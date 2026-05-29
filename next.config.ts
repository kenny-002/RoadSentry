import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: ".next.nosync",
  allowedDevOrigins: ["172.20.39.92", "localhost:3000", "172.20.39.92:3000"],
};

export default nextConfig;

