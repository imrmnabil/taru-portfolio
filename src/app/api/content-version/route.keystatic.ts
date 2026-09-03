import { createHash } from "node:crypto";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";

// Dev-only. The /studio preview pane polls this to notice that Keystatic has
// written to disk, so it can reload itself the moment an entry is saved.
export const dynamic = "force-dynamic";

// Image uploads land in public/, not content/, so a save that only swaps a
// picture would otherwise go unnoticed by the preview.
const WATCHED = [
  path.join(process.cwd(), "content"),
  path.join(process.cwd(), "public", "images"),
];

// Build artifacts, regenerated wholesale on every `npm run build`.
const IGNORED_DIR = "nextImageExportOptimizer";

async function walk(dir: string, out: string[] = []): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === IGNORED_DIR) continue;
      await walk(full, out);
    } else out.push(full);
  }
  return out;
}

export async function GET() {
  const hash = createHash("sha1");
  for (const dir of WATCHED) {
    try {
      const files = (await walk(dir)).sort();
      for (const file of files) {
        const { mtimeMs, size } = await stat(file);
        hash.update(`${file}:${mtimeMs}:${size}\n`);
      }
    } catch {
      hash.update(`missing:${dir}`);
    }
  }
  return Response.json(
    { version: hash.digest("hex") },
    { headers: { "Cache-Control": "no-store" } },
  );
}
