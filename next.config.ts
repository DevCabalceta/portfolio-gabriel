import type { NextConfig } from "next";
import { networkInterfaces } from "node:os";

const nextConfig: NextConfig = {
  reactCompiler: true,
  devIndicators: false,
  images: { qualities: [75, 85] },
  async headers() {
    return [{
      source: "/scenes/hero-robot.splinecode",
      headers: [
        { key: "Content-Type", value: "application/json" },
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    }];
  },
  // Allow phone previews through this computer's LAN addresses in development.
  allowedDevOrigins: Object.values(networkInterfaces()).flatMap((interfaces) =>
    (interfaces ?? []).filter((entry) => entry.family === "IPv4" && !entry.internal).map((entry) => entry.address),
  ),
};

export default nextConfig;
