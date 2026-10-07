import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    // Static export has no optimiser: photographs are pre-rendered to responsive
    // WebP by scripts/build-images.mjs and addressed through this loader.
    loader: "custom",
    loaderFile: "./src/lib/imageLoader.ts",
    // Must match IMAGE_WIDTHS in the loader / build script.
    deviceSizes: [480, 800, 1200, 1600],
  },
};

export default nextConfig;
