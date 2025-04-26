/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/formatter",
  assetPrefix: "/formatter/",
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;