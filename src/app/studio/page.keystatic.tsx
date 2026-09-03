"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const POLL_MS = 400;
const MIN_PCT = 25;
const MAX_PCT = 75;

// Keystatic (local mode) writes the entry being edited to IndexedDB on every
// keystroke, already serialized to the exact bytes a Save would write. Reading
// that store is what makes previewing unsaved work possible.
const DRAFT_DB = "keystatic";
const DRAFT_STORE = "items";

type DraftValue = { files?: Map<string, Uint8Array> };

function openDraftDb(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    let request: IDBOpenDBRequest;
    try {
      request = indexedDB.open(DRAFT_DB);
    } catch {
      resolve(null);
      return;
    }
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(null);
    // Nothing has been edited yet, so Keystatic has not created the store.
    request.onupgradeneeded = () => resolve(null);
  });
}

function readAllDrafts(db: IDBDatabase): Promise<DraftValue[]> {
  return new Promise((resolve) => {
    if (!db.objectStoreNames.contains(DRAFT_STORE)) {
      resolve([]);
      return;
    }
    try {
      const request = db
        .transaction(DRAFT_STORE, "readonly")
        .objectStore(DRAFT_STORE)
        .getAll();
      request.onsuccess = () => resolve(request.result ?? []);
      request.onerror = () => resolve([]);
    } catch {
      resolve([]);
    }
  });
}

function toBase64(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

/** Collect every open draft as repo-relative path -> base64 file contents. */
async function collectDraftFiles(): Promise<Record<string, string>> {
  const db = await openDraftDb();
  if (!db) return {};
  try {
    const drafts = await readAllDrafts(db);
    const files: Record<string, string> = {};
    for (const draft of drafts) {
      if (!(draft?.files instanceof Map)) continue;
      for (const [filePath, contents] of draft.files) {
        if (typeof filePath !== "string" || !filePath) continue;
        if (!(contents instanceof Uint8Array)) continue;
        files[filePath] = toBase64(contents);
      }
    }
    return files;
  } finally {
    db.close();
  }
}

function hash(input: string) {
  let h = 5381;
  for (let i = 0; i < input.length; i++)
    h = ((h << 5) + h + input.charCodeAt(i)) | 0;
  return String(h);
}

type Status = "idle" | "live" | "invalid";

/**
 * Dev-only side-by-side editor: Keystatic on the left, the live site on the
 * right. The preview follows unsaved edits as they are typed; saving simply
 * clears the draft and the pane falls back to what is on disk.
 */
export default function Studio() {
  const previewRef = useRef<HTMLIFrameElement>(null);
  const readyRef = useRef(false);
  const draftRef = useRef<string | null>(null);
  const diskRef = useRef<string | null>(null);
  const scrollRef = useRef(0);
  const [splitPct, setSplitPct] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  /**
   * Saving can swap an image file under its existing filename. React re-renders
   * with an identical src, so the browser keeps its already-decoded bitmap and
   * the picture never visibly changes — only a reload drops it. Typing still
   * goes through postMessage, which is what keeps the pane from flickering.
   */
  const reloadPreview = useCallback(() => {
    const frame = previewRef.current;
    if (!frame?.contentWindow) return;
    scrollRef.current = frame.contentWindow.scrollY;
    readyRef.current = false;
    draftRef.current = null;
    frame.contentWindow.location.reload();
  }, []);

  const restoreScroll = useCallback(() => {
    const frame = previewRef.current;
    if (!frame?.contentWindow || !scrollRef.current) return;
    frame.contentWindow.scrollTo(0, scrollRef.current);
  }, []);

  const push = useCallback((content: unknown) => {
    previewRef.current?.contentWindow?.postMessage(
      { type: "keystatic-preview-content", content },
      window.location.origin,
    );
  }, []);

  const refresh = useCallback(
    async (files: Record<string, string>) => {
      const response = await fetch("/api/preview-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files }),
        cache: "no-store",
      });
      if (!response.ok) {
        // Mid-keystroke the entry can be momentarily unparseable; hold the
        // last good render rather than flashing an error into the pane.
        setStatus("invalid");
        return;
      }
      push(await response.json());
      setStatus(Object.keys(files).length > 0 ? "live" : "idle");
      setUpdatedAt(new Date().toLocaleTimeString());
    },
    [push],
  );

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === "keystatic-preview-ready") {
        readyRef.current = true;
        // A reloaded frame starts from disk, so re-send any open drafts.
        draftRef.current = null;
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    let justReloaded = true;

    const tick = async () => {
      try {
        const files = await collectDraftFiles();
        const version = await fetch("/api/content-version", {
          cache: "no-store",
        })
          .then((r) => r.json())
          .then((d) => d.version as string)
          .catch(() => "");
        const draftSignature = hash(JSON.stringify(files));

        if (!cancelled) {
          const diskChanged =
            diskRef.current !== null && diskRef.current !== version;
          diskRef.current = version;

          if (diskChanged) {
            // A save landed: reload so replaced images are re-fetched.
            reloadPreview();
            justReloaded = true;
          } else if (readyRef.current && draftRef.current !== draftSignature) {
            const noDrafts = Object.keys(files).length === 0;
            draftRef.current = draftSignature;
            // A frame that just reloaded already shows disk content.
            if (noDrafts && justReloaded) setStatus("idle");
            else await refresh(files);
            justReloaded = false;
          }
        }
      } catch {
        // Dev server restarting; retry on the next tick.
      }
      if (!cancelled) timer = setTimeout(tick, POLL_MS);
    };

    tick();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [refresh, reloadPreview]);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      const pct = (e.clientX / window.innerWidth) * 100;
      setSplitPct(Math.min(MAX_PCT, Math.max(MIN_PCT, pct)));
    };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging]);

  const label =
    status === "live"
      ? "Previewing unsaved edits"
      : status === "invalid"
        ? "Waiting for valid input…"
        : "Showing saved content";

  return (
    <div className="fixed inset-0 flex flex-col bg-neutral-200">
      <div className="flex items-center gap-3 px-4 py-2 bg-neutral-900 text-white text-xs shrink-0">
        <strong className="font-medium">Studio</strong>
        <span
          className={
            status === "live"
              ? "text-emerald-400"
              : status === "invalid"
                ? "text-amber-400"
                : "text-neutral-400"
          }
        >
          {label}
        </span>
        <div className="ml-auto flex items-center gap-3">
          {updatedAt && (
            <span className="text-neutral-400">Updated {updatedAt}</span>
          )}
          <button
            type="button"
            onClick={reloadPreview}
            className="rounded bg-white/10 px-2 py-1 hover:bg-white/20"
          >
            Refresh preview
          </button>
        </div>
      </div>

      <div className="relative flex flex-1 min-h-0">
        <iframe
          title="Keystatic editor"
          src="/keystatic"
          className="h-full border-0 bg-white"
          style={{ width: `${splitPct}%` }}
        />
        {/* biome-ignore lint/a11y/useSemanticElements: no HTML element models a window
            splitter; role="separator" on a focusable control is the ARIA pattern. */}
        <button
          type="button"
          role="separator"
          aria-label="Resize panes"
          aria-orientation="vertical"
          aria-valuenow={Math.round(splitPct)}
          aria-valuemin={MIN_PCT}
          aria-valuemax={MAX_PCT}
          onMouseDown={() => setDragging(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft")
              setSplitPct((p) => Math.max(MIN_PCT, p - 2));
            if (e.key === "ArrowRight")
              setSplitPct((p) => Math.min(MAX_PCT, p + 2));
          }}
          className="w-1 cursor-col-resize bg-neutral-400 hover:bg-neutral-600 shrink-0"
        />
        <iframe
          ref={previewRef}
          title="Site preview"
          src="/preview"
          onLoad={restoreScroll}
          className="h-full flex-1 border-0 bg-white"
        />
        {/* While dragging, this keeps the mouse events out of the iframes. */}
        {dragging && <div className="absolute inset-0 cursor-col-resize" />}
      </div>
    </div>
  );
}
