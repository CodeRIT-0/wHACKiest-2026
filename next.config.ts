import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // the on-screen route indicator only ever shows in `next dev`; keep screenshots clean there too
  devIndicators: false,
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    turbopackPluginRuntimeStrategy: "forceWorkerThreads",
  },
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
