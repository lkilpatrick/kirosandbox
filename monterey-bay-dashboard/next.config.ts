import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Removed 'output: export' to support API routes
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
