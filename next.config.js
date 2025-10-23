/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
    serverComponentsExternalPackages: ['@prisma/client', 'prisma'],
  },
  // Configuración para App Router
  output: 'standalone',
}

module.exports = nextConfig
