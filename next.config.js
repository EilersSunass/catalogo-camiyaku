/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
    // @vercel/blob usa undici, que webpack de Next 14.1 no sabe compilar: se deja externo.
    serverComponentsExternalPackages: ['@prisma/client', 'prisma', '@vercel/blob', 'undici'],
  },
  // El formulario (componente cliente) también se pre-renderiza en el servidor e importa
  // @vercel/blob/client -> undici; en el servidor se resuelve en tiempo de ejecución.
  webpack: (config, { isServer }) => {
    if (isServer) config.externals.push({ undici: 'commonjs undici' })
    return config
  },
  // Configuración para App Router
  output: 'standalone',
}

module.exports = nextConfig
