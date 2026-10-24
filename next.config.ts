import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  // Dos layouts raíz (es y en): la 404 global arma su propio documento.
  experimental: { globalNotFound: true },
}

export default nextConfig
