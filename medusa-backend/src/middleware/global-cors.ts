import { MedusaRequest, MedusaResponse } from "@medusajs/framework";

/**
 * Global CORS Middleware for Medusa v2
 * This middleware should be applied to all API routes to handle CORS properly
 * 
 * Usage: Import and call this function at the beginning of each API route handler
 */

export const applyCorsHeaders = (res: MedusaResponse) => {
  // Set comprehensive CORS headers for all domains (testing purposes)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, x-publishable-api-key, x-medusa-access-token, Accept, Origin, Cache-Control, Pragma');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Length, X-JSON');
};

export const handleCorsPreflight = (req: MedusaRequest, res: MedusaResponse) => {
  applyCorsHeaders(res);
  
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
    applyCorsHeaders(res);
    
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
