import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { applyCorsHeaders, handleCorsPreflight } from "./global-cors";

/**
 * Global CORS Middleware
 * This middleware handles CORS for all requests to the Medusa backend
 */
export const corsMiddleware = (req: MedusaRequest, res: MedusaResponse, next: () => void) => {
  // Apply comprehensive CORS headers
  applyCorsHeaders(req, res);
  
  // Handle preflight requests
  if (handleCorsPreflight(req, res)) {
    return; // Request was handled as preflight
  }
  
  next();
};

/**
 * Enhanced CORS headers for specific endpoints
 * @deprecated Use applyCorsHeaders from global-cors.ts instead
 */
export const setCorsHeaders = (req: MedusaRequest, res: MedusaResponse) => {
  applyCorsHeaders(req, res);
};

