import { MedusaRequest, MedusaResponse } from "@medusajs/framework";

/**
 * Global CORS Middleware for Medusa v2
 * This middleware should be applied to all API routes to handle CORS properly
 * 
 * Usage: Import and call this function at the beginning of each API route handler
 */

/**
 * Get allowed origin based on configuration
 */
function getAllowedOrigin(requestOrigin: string | undefined, corsConfig: string): string | undefined {
  if (corsConfig === '*' || !corsConfig) {
    return '*';
  }
  
  const origins = corsConfig.split(',').map(origin => origin.trim());
  
  if (!requestOrigin) {
    return undefined;
  }
  
  // Check exact matches
  if (origins.includes(requestOrigin)) {
    return requestOrigin;
  }
  
  // Check regex patterns
  for (const pattern of origins) {
    if (pattern.startsWith('/') && pattern.endsWith('/')) {
      try {
        const regex = new RegExp(pattern.slice(1, -1));
        if (regex.test(requestOrigin)) {
          return requestOrigin;
        }
      } catch (e) {
        console.warn(`Invalid CORS regex pattern: ${pattern}`);
      }
    }
  }
  
  return undefined;
}

export const applyCorsHeaders = (reqOrRes: MedusaRequest | MedusaResponse, res?: MedusaResponse) => {
  console.log('[CORS] applyCorsHeaders called');
  
  // Handle both old signature (res only) and new signature (req, res)
  let req: MedusaRequest | null = null;
  let response: MedusaResponse;
  
  if (res) {
    // New signature: (req, res)
    req = reqOrRes as MedusaRequest;
    response = res;
    console.log('[CORS] Using new signature (req, res)');
  } else {
    // Old signature: (res) - backward compatibility
    response = reqOrRes as MedusaResponse;
    console.log('[CORS] Using old signature (res only)');
  }
  
  // Get CORS config from environment variable
  const corsConfig = process.env.STORE_CORS || '*';
  const requestOrigin = req?.headers?.origin;
  
  console.log('[CORS] Configuration:');
  console.log('[CORS] - STORE_CORS env:', corsConfig);
  console.log('[CORS] - Request origin:', requestOrigin);
  
  // Get allowed origin based on config
  const allowedOrigin = getAllowedOrigin(requestOrigin, corsConfig);
  
  console.log('[CORS] - Allowed origin:', allowedOrigin);
  
  // Only set Access-Control-Allow-Origin if we have a valid origin
  if (allowedOrigin) {
    response.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    console.log('[CORS] ✅ Set Access-Control-Allow-Origin:', allowedOrigin);
  } else {
    console.log('[CORS] ⚠️ No allowed origin, skipping Access-Control-Allow-Origin');
  }
  
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, x-publishable-api-key, x-medusa-access-token, Accept, Origin, Cache-Control, Pragma');
  response.setHeader('Access-Control-Allow-Credentials', 'true');
  response.setHeader('Access-Control-Max-Age', '86400');
  response.setHeader('Access-Control-Expose-Headers', 'Content-Length, X-JSON');
  response.setHeader('Vary', 'Origin');
  
  console.log('[CORS] ✅ All CORS headers set');
};

export const handleCorsPreflight = (req: MedusaRequest, res: MedusaResponse) => {
  applyCorsHeaders(req, res);
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true; // Indicates that the request was handled
  }
  
  return false; // Indicates that the request should continue
};

/**
 * CORS wrapper for API route handlers
 * Use this to wrap your API route handlers
 */
export const withCors = (handler: (req: MedusaRequest, res: MedusaResponse) => Promise<void> | void) => {
  return async (req: MedusaRequest, res: MedusaResponse) => {
    // Apply CORS headers
    applyCorsHeaders(req, res);
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    
    // Call the original handler
    await handler(req, res);
  };
};

/**
 * Enhanced CORS headers specifically for store API routes
 */
export const applyStoreCorsHeaders = (res: MedusaResponse) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, x-publishable-api-key, x-medusa-access-token, Accept, Origin, Cache-Control, Pragma');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Length, X-JSON');
  res.setHeader('Vary', 'Origin');
};

/**
 * CORS headers for admin API routes
 */
export const applyAdminCorsHeaders = (res: MedusaResponse) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, x-medusa-access-token, Accept, Origin, Cache-Control, Pragma');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Length, X-JSON');
  res.setHeader('Vary', 'Origin');
};
