import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // the on-screen route indicator only ever shows in `next dev`; keep screenshots clean there too
  devIndicators: false,
  // the track photos are tinted, grained and darkened, so they can go out at lower quality
  images: { qualities: [60, 75] },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        // keep CSS Modules scoped (the circuit timeline uses one); the `as` override would flatten them
        condition: { not: { path: /\.module\.css$/ } },
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
