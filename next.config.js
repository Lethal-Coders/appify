/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Keep LibSQL packages external so they're not bundled
      config.externals.push({
        '@libsql/client': 'commonjs @libsql/client',
        '@prisma/adapter-libsql': 'commonjs @prisma/adapter-libsql',
      })
    }
    return config
  },
}

module.exports = nextConfig
