import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/formatter",
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
