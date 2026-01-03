/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    // Allow images from both direct Sanity CDN and Cloudflare proxy
    remotePatterns: [
      { hostname: 'cdn.sanity.io' },
      // Cloudflare Workers proxy domains
      { hostname: '*.workers.dev' },
      // Add your specific worker hostname if needed
      // { hostname: 'sharifgpt-proxy.xxx.workers.dev' },
    ],
  },
}

export default nextConfig
