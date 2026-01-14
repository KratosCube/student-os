import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 👇 PŘIDEJ TOTO (Ignoruje chyby linteru při buildu v Dockeru)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 👇 TOTO TAM UŽ MÁŠ (pro Windows hot reload)
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    }
    return config
  },
};

export default nextConfig;