import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  //disable ts checks
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
