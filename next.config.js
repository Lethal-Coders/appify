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
    // Don't externalize LibSQL packages - let webpack bundle them
    // Ignore non-JS files in node_modules
    config.module.rules.push({
      test: /\.(md|txt|LICENSE)$/,
      type: 'asset/source',
    })
    return config
  },
}

module.exports = nextConfig
