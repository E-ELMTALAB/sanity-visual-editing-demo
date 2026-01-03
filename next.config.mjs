/** @type {import('next').NextConfig} */
const config = {
  images: {
    remotePatterns: [
      // Original Sanity CDN
      { hostname: 'cdn.sanity.io' },
      { hostname: 'source.unsplash.com' },
      // Your Cloudflare Workers proxy domain
      { hostname: 'jaeshproxy.elmtalabx.workers.dev' },
      // Generic workers.dev pattern as fallback
      { hostname: '*.workers.dev' },
    ],
  },
  typescript: {
    // Set this to false if you want production builds to abort if there's type errors
    ignoreBuildErrors: process.env.VERCEL_ENV === 'production',
  },
  eslint: {
    /// Set this to false if you want production builds to abort if there's lint errors
    ignoreDuringBuilds: process.env.VERCEL_ENV === 'production',
  },
  webpack: (config, { isServer }) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/node_modules', '**/medusa-backend/**', '**/sharifgpt-website/**'],
    }
    return config
  },
}

export default config
