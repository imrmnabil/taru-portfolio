"use client";

import ExportedImage, {
  type ExportedImageProps,
} from "next-image-export-optimizer";

/**
 * next-image-export-optimizer always requests the pre-generated WEBP variants
 * under nextImageExportOptimizer/, which only exist as of the last `npm run
 * build`. In dev that means a freshly uploaded image 404s, and — worse — an
 * image replaced under its existing filename still loads the stale variant, so
 * nothing appears to change until a rebuild.
 *
 * Serving the original file from public/ during dev keeps the CMS preview
 * honest. NODE_ENV is inlined at build time, so the production export is
 * untouched and still fully optimized.
 */
const isDev = process.env.NODE_ENV !== "production";

export default function Img({ unoptimized, ...props }: ExportedImageProps) {
  return <ExportedImage {...props} unoptimized={isDev || unoptimized} />;
}
