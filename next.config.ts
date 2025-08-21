import type { NextConfig } from "next";

const nextConfig: NextConfig = {
eslint: {
    ignoreDuringBuilds: true, // 🚀 build won’t fail due to lint errors
  },};

export default nextConfig;
