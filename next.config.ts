import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep Node-native / large SDKs out of the bundler.
  serverExternalPackages: ["pg", "stripe"],
};

export default nextConfig;
