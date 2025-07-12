import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: ['images.clerk.dev', 'img.clerk.com'],
  },
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react', 'framer-motion'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  poweredByHeader: false,
  compress: true,
}

export default nextConfig