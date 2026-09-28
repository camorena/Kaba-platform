import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep pg out of the bundler — Node native pool client.
  serverExternalPackages: ["pg"],
};

export default nextConfig;
