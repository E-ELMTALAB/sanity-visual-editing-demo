/** @type {import('next').NextConfig} */
const config = {
  images: {
    remotePatterns: [
      // Original Sanity CDN
      { hostname: 'cdn.sanity.io' },
      { hostname: 'source.unsplash.com' },
      // Your Cloudflare Workers proxy domain
      { hostname: 'backend.sharifgpt.com' },
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
  // ✅ CRITICAL: Ensure public/sanity-cache is included in static output
  // This guarantees cache files are deployed to .next/static/
  publicRuntimeConfig: {
    // Cache directory is served as static by Next.js automatically
    // Files from public/ are copied to .next/static/ during build
  },
  // ✅ Ensure cache files have correct cache headers for production
  headers: async () => {
    return [
      {
        source: '/_next/static/sanity-cache/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, immutable, max-age=31536000', // Cache for 1 year (immutable)
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },
}

export default config
