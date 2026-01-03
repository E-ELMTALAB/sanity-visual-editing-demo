/** @type {import('next').NextConfig} */
const config = {
  images: {
    remotePatterns: [
      // Original Sanity CDN
      { hostname: 'cdn.sanity.io' },
      { hostname: 'source.unsplash.com' },
      // Cloudflare Workers proxy domains
      // Add your specific worker hostname here when deployed
      { hostname: '*.workers.dev' },
      // Common Cloudflare patterns
      { hostname: 'sharifgpt-proxy.*.workers.dev' },
    ],
    // Allow dynamic hostnames via env var for flexibility
    ...(process.env.NEXT_PUBLIC_UNIFIED_PROXY_URL && {
      remotePatterns: [
        { hostname: 'cdn.sanity.io' },
        { hostname: 'source.unsplash.com' },
        { hostname: '*.workers.dev' },
        // Extract hostname from proxy URL
        (() => {
          try {
            const url = new URL(process.env.NEXT_PUBLIC_UNIFIED_PROXY_URL);
            return { hostname: url.hostname };
          } catch {
            return { hostname: '*.workers.dev' };
          }
        })(),
      ],
    }),
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
