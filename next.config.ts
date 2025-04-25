import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/formatter",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
