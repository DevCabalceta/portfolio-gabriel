import type { NextConfig } from "next";
import { networkInterfaces } from "node:os";

const nextConfig: NextConfig = {
  reactCompiler: true,
  devIndicators: false,
  images: { qualities: [75, 85] },
  // Allow phone previews through this computer's LAN addresses in development.
  allowedDevOrigins: Object.values(networkInterfaces()).flatMap((interfaces) =>
    (interfaces ?? []).filter((entry) => entry.family === "IPv4" && !entry.internal).map((entry) => entry.address),
  ),
};

export default nextConfig;
