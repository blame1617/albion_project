import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Mantenemos el compilador activo (ahora funcionará bien con el cambio de arriba)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "render.albiononline.com",
      },
    ],
  },
};

export default nextConfig;