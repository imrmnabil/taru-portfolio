"use client";

import { useEffect, useState } from "react";
import HomePage from "@/components/HomePage";
import type { SiteContent } from "@/lib/content";

export const PREVIEW_MESSAGE = "keystatic-preview-content";
export const PREVIEW_READY = "keystatic-preview-ready";

/**
 * Wraps the real page so /studio can swap in freshly rendered content over
 * postMessage. Re-rendering in place (rather than reloading the frame) is what
 * keeps scroll position and carousel state stable while typing.
 */
export default function LivePreviewHost({ initial }: { initial: SiteContent }) {
  const [content, setContent] = useState(initial);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === PREVIEW_MESSAGE) setContent(event.data.content);
    };
    window.addEventListener("message", onMessage);
    // Tell the studio the frame is mounted and safe to push content into.
    window.parent?.postMessage({ type: PREVIEW_READY }, window.location.origin);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return <HomePage content={content} />;
}
