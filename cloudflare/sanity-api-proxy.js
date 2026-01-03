/**
 * Cloudflare Worker: Sanity API Proxy
 * Proxies GROQ queries and mutations to Sanity API for bypassing internet filtering
 * 
 * Deploy to Cloudflare Workers and use the worker URL as the Sanity API base
 * Example: https://your-sanity-api-proxy.your-account.workers.dev
 * 
 * Supports:
 * - GET /v{version}/data/query/{dataset}?query=...
 * - POST /v{version}/data/mutate/{dataset}
 * - All other Sanity API endpoints
 * 
 * Environment variables (optional, can be hardcoded):
 * - SANITY_PROJECT_ID: Your Sanity project ID
 */

// Default configuration - can be overridden via env or request headers
const DEFAULT_CONFIG = {
  SANITY_PROJECT_ID: "zrvdkcjy",  // Your project ID
  SANITY_DATASET: "production",
  SANITY_API_VERSION: "2023-06-21",
  // Use 'api' for fresh data or 'apicdn' for cached data
  SANITY_HOST_TYPE: "apicdn"
};

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

      // Get configuration from env or defaults
      const projectId = env?.SANITY_PROJECT_ID || DEFAULT_CONFIG.SANITY_PROJECT_ID;
      const hostType = env?.SANITY_HOST_TYPE || DEFAULT_CONFIG.SANITY_HOST_TYPE;

      // Build target URL to Sanity API
      // The client will send requests like: /v2023-06-21/data/query/production?query=...
      const targetUrl = `https://${projectId}.${hostType}.sanity.io${pathname}${search}`;

      // Prepare headers for the proxied request
      const proxyHeaders = new Headers();
      proxyHeaders.set('User-Agent', 'Cloudflare-Worker-Sanity-Proxy/1.0');
      proxyHeaders.set('Accept', 'application/json');
      
      // Forward authorization if present (for write operations)
      const authHeader = request.headers.get('Authorization');
      if (authHeader) {
        proxyHeaders.set('Authorization', authHeader);
      }

      // Forward Sanity-specific headers
      const sanityToken = request.headers.get('x-sanity-token');
      if (sanityToken) {
        proxyHeaders.set('Authorization', `Bearer ${sanityToken}`);
      }

      // Forward content type for POST requests
      if (request.method === 'POST' || request.method === 'PUT' || request.method === 'PATCH') {
        proxyHeaders.set('Content-Type', request.headers.get('Content-Type') || 'application/json');
      }

      // Make the request to Sanity
      const fetchOptions = {
        method: request.method,
        headers: proxyHeaders,
      };

      // Forward body for POST/PUT/PATCH requests
      if (request.method === 'POST' || request.method === 'PUT' || request.method === 'PATCH') {
        fetchOptions.body = await request.text();
      }

      const response = await fetch(targetUrl, fetchOptions);

      // Get response body
      const responseBody = await response.text();

      // Build response headers
      const responseHeaders = new Headers();
      Object.entries(corsHeaders).forEach(([key, value]) => {
        responseHeaders.set(key, value);
      });
      responseHeaders.set('Content-Type', response.headers.get('Content-Type') || 'application/json');

      // Add caching for GET requests
      if (request.method === 'GET' && response.ok) {
        responseHeaders.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
      }

      return new Response(responseBody, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders
      });

    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
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
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-sanity-token, Accept",
    "Access-Control-Max-Age": "86400",
  };
}

