/**
 * Cloudflare Worker: Unified Proxy for Glass Luxe UI
 * 
 * Single worker that proxies Sanity CDN, Sanity API, and Medusa Backend
 * Designed for bypassing internet filtering in Iran
 * 
 * Deploy this single worker and use path prefixes to route requests:
 * - /cdn/* → cdn.sanity.io/* (images and files)
 * - /images/* → cdn.sanity.io/images/* (direct image path)
 * - /files/* → cdn.sanity.io/files/* (direct file path)
 * - /api/* → {projectId}.apicdn.sanity.io/* (GROQ queries)
 * - /sanity-query → POST endpoint for GROQ queries (legacy support)
 * - /medusa/* → backend.sharifgpt.com/* (Medusa API)
 * - /health → Health check endpoint
 * 
 * DEPLOYMENT INSTRUCTIONS:
 * 1. Go to https://dash.cloudflare.com/
 * 2. Workers & Pages → Create Application → Create Worker
 * 3. Name it: glassluxe-proxy
 * 4. Deploy, then click "Edit code"
 * 5. Paste this entire file and deploy
 * 6. The worker URL will be: https://glassluxe-proxy.{your-subdomain}.workers.dev
 */

// ============================================================================
// CONFIGURATION - Hardcoded for Glass Luxe UI
// ============================================================================
const CONFIG = {
  SANITY_PROJECT_ID: "zrvdkcjy",
  SANITY_DATASET: "production",
  SANITY_API_VERSION: "2023-06-21",
  SANITY_HOST_TYPE: "apicdn", // Use CDN for faster reads
  MEDUSA_BACKEND_URL: "https://backend.sharifgpt.com"
};

// Request timeout in milliseconds (45 seconds for slow connections)
const REQUEST_TIMEOUT = 45000;

// ============================================================================
// MAIN HANDLER
// ============================================================================
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
        worker: "glassluxe-proxy",
        services: {
          sanity_cdn: "ready",
          sanity_api: "ready",
          medusa: "ready"
        },
        config: {
          sanityProjectId: CONFIG.SANITY_PROJECT_ID,
          sanityDataset: CONFIG.SANITY_DATASET,
          medusaBackend: CONFIG.MEDUSA_BACKEND_URL
        },
        timestamp: new Date().toISOString()
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    try {
      // Route based on path prefix
      
      // Sanity CDN routes (images and files)
      if (pathname.startsWith("/cdn/") || pathname.startsWith("/images/") || pathname.startsWith("/files/")) {
        return await proxySanityCDN(request, pathname, url.search, corsHeaders);
      }
      
      // Sanity API route (GROQ queries via path)
      if (pathname.startsWith("/api/")) {
        return await proxySanityAPI(request, pathname, url.search, corsHeaders, env);
      }
      
      // Legacy POST endpoint for Sanity GROQ queries (used by sanity.client.light.ts)
      if (pathname === "/sanity-query" || pathname === "/") {
        if (request.method === "POST") {
          return await handleSanityQueryPost(request, corsHeaders, env);
        }
      }
      
      // Medusa backend route
      if (pathname.startsWith("/medusa/")) {
        return await proxyMedusa(request, pathname, url.search, corsHeaders, env);
      }

      // Default: return routing info
      return new Response(JSON.stringify({
        error: "Unknown route",
        message: "Use /cdn/*, /images/*, /files/*, /api/*, /sanity-query, or /medusa/* prefixes",
        routes: {
          "/cdn/*": "Sanity CDN (strips /cdn prefix)",
          "/images/*": "Sanity CDN images (direct path)",
          "/files/*": "Sanity CDN files (direct path)",
          "/api/*": "Sanity API (GROQ queries via URL)",
          "/sanity-query": "POST endpoint for GROQ queries",
          "/medusa/*": "Medusa backend API"
        },
        examples: {
          image: "/cdn/images/zrvdkcjy/production/abc123-800x600.jpg",
          imageAlt: "/images/zrvdkcjy/production/abc123-800x600.jpg",
          api: "/api/v2023-06-21/data/query/production?query=*[_type==\"product\"]",
          sanityQuery: "POST /sanity-query with { query, params }",
          medusa: "/medusa/store/products"
        }
      }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });

    } catch (error) {
      console.error("[Glass Luxe Proxy] Error:", error);
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

// ============================================================================
// FETCH WITH TIMEOUT AND RETRY
// ============================================================================
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

async function fetchWithRetry(url, options = {}, retries = 2, timeout = REQUEST_TIMEOUT) {
  let lastError;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fetchWithTimeout(url, options, timeout);
    } catch (error) {
      lastError = error;
      if (i < retries) {
        console.log(`[Proxy] Retry ${i + 1}/${retries} for ${url}`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }
  throw lastError;
}

// ============================================================================
// SANITY CDN PROXY (Images and Files)
// ============================================================================
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

  const response = await fetchWithRetry(targetUrl, {
    method: request.method,
    headers: {
      "User-Agent": "Cloudflare-Proxy/1.0 (GlassLuxe)",
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

// ============================================================================
// SANITY API PROXY (GROQ Queries via URL path)
// ============================================================================
async function proxySanityAPI(request, pathname, search, corsHeaders, env) {
  const projectId = CONFIG.SANITY_PROJECT_ID;
  const hostType = CONFIG.SANITY_HOST_TYPE;
  
  // Remove /api prefix: /api/v2023-06-21/... → /v2023-06-21/...
  const targetPath = pathname.replace(/^\/api/, "");
  const targetUrl = `https://${projectId}.${hostType}.sanity.io${targetPath}${search}`;

  console.log("[Sanity API Proxy] Forwarding to:", targetUrl);

  const proxyHeaders = new Headers();
  proxyHeaders.set("User-Agent", "Cloudflare-Proxy/1.0 (GlassLuxe)");
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

  const response = await fetchWithRetry(targetUrl, fetchOptions);
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

// ============================================================================
// SANITY QUERY POST ENDPOINT (Legacy support for sanity.client.light.ts)
// ============================================================================
async function handleSanityQueryPost(request, corsHeaders, env) {
  const projectId = CONFIG.SANITY_PROJECT_ID;
  const dataset = CONFIG.SANITY_DATASET;
  const apiVersion = CONFIG.SANITY_API_VERSION;
  const hostType = CONFIG.SANITY_HOST_TYPE;
  
  let requestBody;
  try {
    requestBody = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({
      success: false,
      error: "Invalid JSON body"
    }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  const { query, params = {} } = requestBody;
  
  if (!query) {
    return new Response(JSON.stringify({
      success: false,
      error: "Missing 'query' field in request body"
    }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  // Build Sanity API URL with query and params
  const queryString = new URLSearchParams();
  queryString.set("query", query);
  
  // Add params as URL parameters
  for (const [key, value] of Object.entries(params)) {
    queryString.set(`$${key}`, JSON.stringify(value));
  }

  const targetUrl = `https://${projectId}.${hostType}.sanity.io/v${apiVersion}/data/query/${dataset}?${queryString.toString()}`;

  console.log("[Sanity Query Proxy] Forwarding to:", targetUrl);

  try {
    const response = await fetchWithRetry(targetUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Cloudflare-Proxy/1.0 (GlassLuxe)",
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Sanity Query Proxy] Failed:", response.status, errorText);
      return new Response(JSON.stringify({
        success: false,
        error: `Sanity API error: ${response.status}`,
        details: errorText
      }), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const sanityResponse = await response.json();

    return new Response(JSON.stringify({
      success: true,
      data: sanityResponse.result
    }), {
      status: 200,
      headers: { 
        ...corsHeaders, 
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300"
      }
    });

  } catch (error) {
    console.error("[Sanity Query Proxy] Error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || "Failed to fetch from Sanity"
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}

// ============================================================================
// MEDUSA BACKEND PROXY
// ============================================================================
async function proxyMedusa(request, pathname, search, corsHeaders, env) {
  const backendUrl = CONFIG.MEDUSA_BACKEND_URL;
  
  // Remove /medusa prefix: /medusa/store/products → /store/products
  const targetPath = pathname.replace(/^\/medusa/, "");
  const targetUrl = `${backendUrl}${targetPath}${search}`;

  console.log("[Medusa Proxy] Forwarding to:", targetUrl);

  const proxyHeaders = new Headers();
  proxyHeaders.set("User-Agent", "Cloudflare-Proxy/1.0 (GlassLuxe)");

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

  const response = await fetchWithRetry(targetUrl, fetchOptions);
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

// ============================================================================
// CORS HEADERS
// ============================================================================
function buildCorsHeaders(origin) {
  // Allowed origins - add your domains
  const allowedOrigins = [
    // Local development
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173",
    "http://localhost:8788",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    // Production domains
    "https://sharifgpt.com",
    "https://www.sharifgpt.com",
    "https://sharifgpt.vercel.app",
    "https://test.sharifgpt.com",
    "https://glass-luxe.vercel.app",
    // Cloudflare Pages preview
    /https:\/\/.*\.pages\.dev$/,
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

