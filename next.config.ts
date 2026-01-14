import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 👇 TOTO PŘIDEJ:
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,   // Kontroluje změny každou sekundu
      aggregateTimeout: 300,
    }
    return config
  },
};

export default nextConfig;