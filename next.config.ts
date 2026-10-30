import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // These local WebP assets are already sized and compressed, including alpha.
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        // Keep CSS Modules scoped; the Tailwind loader's `as` override erases them.
        condition: { not: { path: /\.module\.css$/ } },
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
