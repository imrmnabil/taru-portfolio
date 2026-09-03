import { cp, mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { getSiteContent } from "@/lib/content";

// Dev-only. Renders the site's content model from Keystatic's *unsaved* draft
// files so /studio can preview edits before they are saved.
export const dynamic = "force-dynamic";

type Body = { files?: Record<string, string> };

/** Keep writes inside the sandbox — draft paths come from the browser. */
function safeJoin(root: string, relative: string) {
  const target = path.resolve(root, relative);
  if (target !== root && !target.startsWith(root + path.sep)) return null;
  return target;
}

export async function POST(request: Request) {
  const { files = {} }: Body = await request.json().catch(() => ({}));

  // No drafts open: the real content directory is already the truth.
  if (Object.keys(files).length === 0) {
    return Response.json(await getSiteContent(), {
      headers: { "Cache-Control": "no-store" },
    });
  }

  // Overlay the drafts onto a copy so the working tree is never written to.
  const root = await mkdtemp(path.join(tmpdir(), "keystatic-preview-"));
  try {
    await cp(path.join(process.cwd(), "content"), path.join(root, "content"), {
      recursive: true,
    });

    for (const [relative, base64] of Object.entries(files)) {
      const target = safeJoin(root, relative);
      if (!target) continue;
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, Buffer.from(base64, "base64"));
    }

    return Response.json(await getSiteContent(root), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    // A half-typed entry can be invalid; let the pane keep its last good render.
    return Response.json(
      { error: error instanceof Error ? error.message : "Preview failed" },
      { status: 422, headers: { "Cache-Control": "no-store" } },
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}
