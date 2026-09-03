import type { NextConfig } from "next";

// The Keystatic Admin UI needs a POST route handler, which `output: "export"`
// forbids. Set KEYSTATIC=1 (see the `cms` script) to swap the static export for
// a normal dev server and register the `.keystatic.*` page extension, which is
// what makes the CMS-only route files under src/app resolve at all. With the
// flag unset they are invisible to Next and never reach the production build.
const cms = process.env.KEYSTATIC === "1";

const nextConfig: NextConfig = {
  ...(cms ? {} : { output: "export" }),
  pageExtensions: cms
    ? ["tsx", "ts", "jsx", "js", "keystatic.tsx", "keystatic.ts"]
    : ["tsx", "ts", "jsx", "js"],
  images: {
    loader: "custom",
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  transpilePackages: ["next-image-export-optimizer"],
  env: {
    nextImageExportOptimizer_imageFolderPath: "public/images",
    nextImageExportOptimizer_exportFolderPath: "out",
    nextImageExportOptimizer_quality: "75",
    nextImageExportOptimizer_storePicturesInWEBP: "true",
    nextImageExportOptimizer_exportFolderName: "nextImageExportOptimizer",
    nextImageExportOptimizer_generateAndUseBlurImages: "true",
    nextImageExportOptimizer_remoteImageCacheTTL: "0",
  },
};

export default nextConfig;
