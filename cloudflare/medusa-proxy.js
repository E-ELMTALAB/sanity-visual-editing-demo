/**
 * Cloudflare Worker: Medusa Backend Proxy
 * Proxies all requests to Medusa backend for bypassing internet filtering
 * 
 * Deploy to Cloudflare Workers and use the worker URL as the Medusa backend URL
 * Example: https://your-medusa-proxy.your-account.workers.dev
 * 
 * Supports all Medusa endpoints:
 * - /store/* (Store API)
 * - /admin/* (Admin API)
 * - /health, /healthz (Health checks)
 * - All other Medusa routes
 * 
 * Environment variables:
 * - MEDUSA_BACKEND_URL: The actual Medusa backend URL (e.g., https://backend.sharifgpt.com)
 */

// Default configuration - CHANGE THIS to your actual Medusa backend URL
const DEFAULT_MEDUSA_BACKEND_URL = "https://backend.sharifgpt.com";

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

      // Get Medusa backend URL from env or default
      const backendUrl = env?.MEDUSA_BACKEND_URL || DEFAULT_MEDUSA_BACKEND_URL;

      // Build target URL to Medusa backend
      const targetUrl = `${backendUrl}${pathname}${search}`;

      // Prepare headers for the proxied request
      const proxyHeaders = new Headers();
      proxyHeaders.set('User-Agent', 'Cloudflare-Worker-Medusa-Proxy/1.0');

      // Forward important headers
      const headersToForward = [
        'Content-Type',
        'Accept',
        'Authorization',
        'x-publishable-api-key',
        'x-medusa-access-token',
        'Cookie',
        'x-forwarded-for',
        'x-real-ip'
      ];

      headersToForward.forEach(header => {
        const value = request.headers.get(header);
        if (value) {
          proxyHeaders.set(header, value);
        }
      });

      // Set default Content-Type for POST/PUT/PATCH if not set
      if (['POST', 'PUT', 'PATCH'].includes(request.method) && !proxyHeaders.has('Content-Type')) {
        proxyHeaders.set('Content-Type', 'application/json');
      }

      // Prepare fetch options
      const fetchOptions = {
        method: request.method,
        headers: proxyHeaders,
      };

      // Forward body for requests that have body
      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
        const contentType = request.headers.get('Content-Type') || '';
        if (contentType.includes('application/json')) {
          fetchOptions.body = await request.text();
        } else if (contentType.includes('form')) {
          fetchOptions.body = await request.formData();
        } else {
          fetchOptions.body = await request.arrayBuffer();
        }
      }

      // Make the request to Medusa backend
      const response = await fetch(targetUrl, fetchOptions);

      // Get response body
      const responseBody = await response.arrayBuffer();

      // Build response headers
      const responseHeaders = new Headers();
      
      // Add CORS headers
      Object.entries(corsHeaders).forEach(([key, value]) => {
        responseHeaders.set(key, value);
      });

      // Forward response headers
      const responseHeadersToForward = [
        'Content-Type',
        'Set-Cookie',
        'X-Medusa-Access-Token',
        'Cache-Control',
        'ETag',
        'Last-Modified'
      ];

      responseHeadersToForward.forEach(header => {
        const value = response.headers.get(header);
        if (value) {
          responseHeaders.set(header, value);
        }
      });

      // Handle Set-Cookie specially (may have multiple values)
      const cookies = response.headers.getAll?.('Set-Cookie') || [];
      if (cookies.length > 0) {
        cookies.forEach(cookie => {
          responseHeaders.append('Set-Cookie', cookie);
        });
      }

      return new Response(responseBody, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders
      });

    } catch (error) {
      console.error('Medusa proxy error:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Proxy error',
        message: error?.message || String(error),
        type: 'MEDUSA_PROXY_ERROR'
      }), {
        status: 502,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
  }
};

function buildCorsHeaders(origin) {
  // List of allowed origins - add your frontend domains
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'https://sharifgpt.com',
    'https://www.sharifgpt.com',
    'https://sharifgpt.vercel.app',
    // Add more as needed
  ];

  // Allow the specific origin if it's in the allowed list, otherwise allow all
  const allowOrigin = origin && allowedOrigins.includes(origin) ? origin : '*';

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-publishable-api-key, x-medusa-access-token, Accept, Cookie",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Max-Age": "86400",
  };
}

