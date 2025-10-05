import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    config.externals = [...(config.externals || []), "pg", "pg-native"];
    return config;
  },
};

export default nextConfig;
