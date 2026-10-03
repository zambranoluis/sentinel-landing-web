import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Keep development startup from rewriting the project's instruction owners.
  agentRules: false,
  poweredByHeader: false,
};

export default nextConfig;
