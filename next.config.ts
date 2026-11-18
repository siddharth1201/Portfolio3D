import type { NextConfig } from "next";

// Static export → the build produces plain files in `out/`,
// which Cloudflare Pages (or any static host) can serve directly.
const nextConfig: NextConfig = {
  output: "export",
  images: {
    // Remote image optimization is a server feature — not available
    // in a fully static export. Images are already size-optimized.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
};

export default nextConfig;
