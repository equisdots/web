import type { NextConfig } from "next";

// GitHub Pages serves project sites under /<repo>/, so the default base path
// is /web. Override it at build time (NEXT_PUBLIC_BASE_PATH="") for local
// development or a root/user site.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/web";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
