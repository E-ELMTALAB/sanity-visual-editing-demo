/**
 * Cloudflare Worker: Sanity CDN Image Proxy
 * Proxies all requests to cdn.sanity.io for bypassing internet filtering
 * 
 * Deploy to Cloudflare Workers and use the worker URL as the image CDN base
 * Example: https://your-sanity-cdn-proxy.your-account.workers.dev
 * 
 * Usage: Replace cdn.sanity.io with your worker URL
 * Original: https://cdn.sanity.io/images/projectId/dataset/imageId-dimensions.format
 * Proxied: https://your-worker.workers.dev/images/projectId/dataset/imageId-dimensions.format
 */

export default {
  async fetch(request, env, ctx) {
    const corsHeaders = buildCorsHeaders(request.headers.get("Origin"));

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    try {
      const url = new URL(request.url);
      const pathname = url.pathname;
      const search = url.search;

      // Build the target URL to Sanity CDN
      const targetUrl = `https://cdn.sanity.io${pathname}${search}`;

      // Forward the request to Sanity CDN
      const response = await fetch(targetUrl, {
        method: request.method,
        headers: {
          'User-Agent': 'Cloudflare-Worker-Sanity-Proxy/1.0',
          'Accept': request.headers.get('Accept') || '*/*',
          'Accept-Encoding': request.headers.get('Accept-Encoding') || 'gzip, deflate',
        },
      });

      // If the request failed, return error
      if (!response.ok && response.status !== 304) {
        return new Response(JSON.stringify({
          error: 'Failed to fetch from Sanity CDN',
          status: response.status,
          statusText: response.statusText
        }), {
          status: response.status,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        });
      }

      // Clone the response and add CORS headers
      const newHeaders = new Headers(response.headers);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        newHeaders.set(key, value);
      });

      // Add caching headers for better performance
      if (!newHeaders.has('Cache-Control')) {
        newHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');
      }

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders
      });

    } catch (error) {
      return new Response(JSON.stringify({
        error: 'Proxy error',
        message: error?.message || String(error)
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
  }
};

function buildCorsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept, Accept-Encoding",
    "Access-Control-Max-Age": "86400",
  };
}

