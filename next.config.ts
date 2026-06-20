import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project — the parent folder also has a
  // lockfile, which would otherwise make Next.js guess the wrong root.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
