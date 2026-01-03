/**
 * Cloudflare Worker: Unified Proxy for SharifGPT
 * Single worker that proxies Sanity CDN, Sanity API, and Medusa Backend
 * 
 * Deploy this single worker and use path prefixes to route requests:
 * - /cdn/* → cdn.sanity.io/* (images)
 * - /api/* → {projectId}.apicdn.sanity.io/* (GROQ queries)
 * - /medusa/* → backend.sharifgpt.com/* (Medusa API)
 * - /health → Health check endpoint
 * 
 * Example usage:
 * - Image: https://your-worker.workers.dev/cdn/images/projectId/dataset/imageId.jpg
 * - API: https://your-worker.workers.dev/api/v2023-06-21/data/query/production?query=*
 * - Medusa: https://your-worker.workers.dev/medusa/store/products
 * 
 * Environment variables (set in Cloudflare dashboard):
 * - SANITY_PROJECT_ID: Your Sanity project ID (default: zrvdkcjy)
 * - MEDUSA_BACKEND_URL: Medusa backend URL (default: https://backend.sharifgpt.com)
 * 
 * DEPLOYMENT INSTRUCTIONS:
 * 1. Go to https://dash.cloudflare.com/
 * 2. Workers & Pages → Create Application → Create Worker
 * 3. Name it: sharifgpt-proxy
 * 4. Deploy, then click "Edit code"
 * 5. Paste this entire file and deploy
 * 6. Set environment variables in Settings → Variables
 * 7. Use the worker URL as NEXT_PUBLIC_UNIFIED_PROXY_URL in Vercel
 */

// Configuration - override via Cloudflare env vars
const CONFIG = {
  SANITY_PROJECT_ID: "zrvdkcjy",
  SANITY_DATASET: "production",
  SANITY_API_VERSION: "2023-06-21",
  SANITY_HOST_TYPE: "apicdn",
  MEDUSA_BACKEND_URL: "https://backend.sharifgpt.com"
};

// Request timeout in milliseconds (30 seconds)
const REQUEST_TIMEOUT = 30000;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const corsHeaders = buildCorsHeaders(request.headers.get("Origin"));

    // Handle CORS preflight for all routes
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // Health check endpoint
    if (pathname === "/health" || pathname === "/") {
      return new Response(JSON.stringify({
        status: "ok",
        services: {
          sanity_cdn: "ready",
          sanity_api: "ready",
          medusa: "ready"
        },
        config: {
          sanityProjectId: env?.SANITY_PROJECT_ID || CONFIG.SANITY_PROJECT_ID,
          medusaBackend: env?.MEDUSA_BACKEND_URL || CONFIG.MEDUSA_BACKEND_URL
        },
        timestamp: new Date().toISOString()
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    try {
      // Route based on path prefix
      if (pathname.startsWith("/cdn/") || pathname.startsWith("/images/") || pathname.startsWith("/files/")) {
        return await proxySanityCDN(request, pathname, url.search, corsHeaders);
      }
      
      if (pathname.startsWith("/api/")) {
        return await proxySanityAPI(request, pathname, url.search, corsHeaders, env);
      }
      
      if (pathname.startsWith("/medusa/")) {
        return await proxyMedusa(request, pathname, url.search, corsHeaders, env);
      }

      // Default: return routing info
      return new Response(JSON.stringify({
        error: "Unknown route",
        message: "Use /cdn/*, /images/*, /api/*, or /medusa/* prefixes",
        routes: {
          "/cdn/*": "Sanity CDN images (with /cdn prefix stripped)",
          "/images/*": "Sanity CDN images (direct path)",
          "/files/*": "Sanity CDN files (direct path)",
          "/api/*": "Sanity API (GROQ queries)",
          "/medusa/*": "Medusa backend API"
        },
        examples: {
          image: "/cdn/images/zrvdkcjy/production/abc123-800x600.jpg",
          imageAlt: "/images/zrvdkcjy/production/abc123-800x600.jpg",
          api: "/api/v2023-06-21/data/query/production?query=*[_type==\"product\"]",
          medusa: "/medusa/store/products"
        }
      }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });

    } catch (error) {
      console.error("[Unified Proxy] Error:", error);
      return new Response(JSON.stringify({
        success: false,
        error: "Proxy error",
        message: error?.message || String(error),
        timestamp: new Date().toISOString()
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  }
};

// ==================== Fetch with timeout ====================
async function fetchWithTimeout(url, options = {}, timeout = REQUEST_TIMEOUT) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  }
}

// ==================== Sanity CDN Proxy ====================
async function proxySanityCDN(request, pathname, search, corsHeaders) {
  // Handle different path formats:
  // /cdn/images/... → strip /cdn
  // /images/... → use as-is
  // /files/... → use as-is
  let targetPath = pathname;
  if (pathname.startsWith("/cdn/")) {
    targetPath = pathname.replace(/^\/cdn/, "");
  }
  
  const targetUrl = `https://cdn.sanity.io${targetPath}${search}`;

  console.log("[Sanity CDN Proxy] Forwarding to:", targetUrl);

  const response = await fetchWithTimeout(targetUrl, {
    method: request.method,
    headers: {
      "User-Agent": "Cloudflare-Proxy/1.0",
      "Accept": request.headers.get("Accept") || "*/*",
      "Accept-Encoding": request.headers.get("Accept-Encoding") || "gzip, deflate, br",
    }
  });

  if (!response.ok && response.status !== 304) {
    console.error("[Sanity CDN Proxy] Failed:", response.status, response.statusText);
    return new Response(JSON.stringify({
      error: "Failed to fetch from Sanity CDN",
      status: response.status,
      targetUrl: targetUrl
    }), {
      status: response.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  const newHeaders = new Headers(response.headers);
  Object.entries(corsHeaders).forEach(([k, v]) => newHeaders.set(k, v));
  
  // Strong caching for images - they're immutable by hash
  newHeaders.set("Cache-Control", "public, max-age=31536000, immutable");

  return new Response(response.body, {
    status: response.status,
    headers: newHeaders
  });
}

// ==================== Sanity API Proxy ====================
async function proxySanityAPI(request, pathname, search, corsHeaders, env) {
  const projectId = env?.SANITY_PROJECT_ID || CONFIG.SANITY_PROJECT_ID;
  const hostType = env?.SANITY_HOST_TYPE || CONFIG.SANITY_HOST_TYPE;
  
  // Remove /api prefix: /api/v2023-06-21/... → /v2023-06-21/...
  const targetPath = pathname.replace(/^\/api/, "");
  const targetUrl = `https://${projectId}.${hostType}.sanity.io${targetPath}${search}`;

  console.log("[Sanity API Proxy] Forwarding to:", targetUrl);

  const proxyHeaders = new Headers();
  proxyHeaders.set("User-Agent", "Cloudflare-Proxy/1.0");
  proxyHeaders.set("Accept", "application/json");

  // Forward auth headers
  const authHeader = request.headers.get("Authorization");
  if (authHeader) proxyHeaders.set("Authorization", authHeader);
  
  const sanityToken = request.headers.get("x-sanity-token");
  if (sanityToken) proxyHeaders.set("Authorization", `Bearer ${sanityToken}`);

  const fetchOptions = { method: request.method, headers: proxyHeaders };

  if (["POST", "PUT", "PATCH"].includes(request.method)) {
    proxyHeaders.set("Content-Type", request.headers.get("Content-Type") || "application/json");
    fetchOptions.body = await request.text();
  }

  const response = await fetchWithTimeout(targetUrl, fetchOptions);
  const responseBody = await response.text();

  const responseHeaders = new Headers();
  Object.entries(corsHeaders).forEach(([k, v]) => responseHeaders.set(k, v));
  responseHeaders.set("Content-Type", response.headers.get("Content-Type") || "application/json");

  // Cache GET requests briefly
  if (request.method === "GET" && response.ok) {
    responseHeaders.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
  }

  return new Response(responseBody, {
    status: response.status,
    headers: responseHeaders
  });
}

// ==================== Medusa Backend Proxy ====================
async function proxyMedusa(request, pathname, search, corsHeaders, env) {
  const backendUrl = env?.MEDUSA_BACKEND_URL || CONFIG.MEDUSA_BACKEND_URL;
  
  // Remove /medusa prefix: /medusa/store/products → /store/products
  const targetPath = pathname.replace(/^\/medusa/, "");
  const targetUrl = `${backendUrl}${targetPath}${search}`;

  console.log("[Medusa Proxy] Forwarding to:", targetUrl);

  const proxyHeaders = new Headers();
  proxyHeaders.set("User-Agent", "Cloudflare-Proxy/1.0");

  // Forward all important headers
  const headersToForward = [
    "Content-Type", 
    "Accept", 
    "Authorization",
    "x-publishable-api-key", 
    "x-medusa-access-token", 
    "Cookie",
    "X-Forwarded-For",
    "X-Real-IP"
  ];
  
  headersToForward.forEach(header => {
    const value = request.headers.get(header);
    if (value) proxyHeaders.set(header, value);
  });

  // Add client IP for rate limiting on backend
  const clientIP = request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For");
  if (clientIP) {
    proxyHeaders.set("X-Forwarded-For", clientIP);
    proxyHeaders.set("X-Real-IP", clientIP);
  }

  if (["POST", "PUT", "PATCH"].includes(request.method) && !proxyHeaders.has("Content-Type")) {
    proxyHeaders.set("Content-Type", "application/json");
  }

  const fetchOptions = { method: request.method, headers: proxyHeaders };

  if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method)) {
    const contentType = request.headers.get("Content-Type") || "";
    if (contentType.includes("application/json")) {
      fetchOptions.body = await request.text();
    } else if (contentType.includes("form")) {
      fetchOptions.body = await request.formData();
    } else {
      fetchOptions.body = await request.arrayBuffer();
    }
  }

  const response = await fetchWithTimeout(targetUrl, fetchOptions);
  const responseBody = await response.arrayBuffer();

  const responseHeaders = new Headers();
  Object.entries(corsHeaders).forEach(([k, v]) => responseHeaders.set(k, v));

  // Forward response headers
  ["Content-Type", "Set-Cookie", "Cache-Control", "ETag", "X-Medusa-Access-Token"].forEach(header => {
    const value = response.headers.get(header);
    if (value) responseHeaders.set(header, value);
  });

  // Handle multiple Set-Cookie headers
  try {
    const cookies = response.headers.getAll?.("Set-Cookie") || [];
    cookies.forEach(cookie => {
      responseHeaders.append("Set-Cookie", cookie);
    });
  } catch (e) {
    // getAll might not be available in all environments
  }

  return new Response(responseBody, {
    status: response.status,
    headers: responseHeaders
  });
}

// ==================== CORS Headers ====================
function buildCorsHeaders(origin) {
  // Allowed origins - add your domains
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173",
    "https://sharifgpt.com",
    "https://www.sharifgpt.com",
    "https://sharifgpt.vercel.app",
    "https://test.sharifgpt.com",
    // Vercel preview deployments
    /https:\/\/.*\.vercel\.app$/,
  ];

  // Check if origin matches allowed patterns
  let allowOrigin = "*";
  if (origin) {
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === "string") return allowed === origin;
      if (allowed instanceof RegExp) return allowed.test(origin);
      return false;
    });
    if (isAllowed) allowOrigin = origin;
  }

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-sanity-token, x-publishable-api-key, x-medusa-access-token, Accept, Cookie, X-Forwarded-For, X-Real-IP",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Max-Age": "86400",
    "Access-Control-Expose-Headers": "Set-Cookie, X-Medusa-Access-Token"
  };
}
