import { MedusaRequest, MedusaResponse } from "@medusajs/framework";

// CORS middleware function
const setCorsHeaders = (res: MedusaResponse) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Max-Age', '86400');
};

/**
 * Simple CORS Test Endpoint
 * GET /store/test-cors
 * Test endpoint to verify CORS is working
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  // Set CORS headers first
  setCorsHeaders(res);
  
  try {
    res.status(200).json({
      success: true,
      message: "CORS is working correctly!",
      timestamp: new Date().toISOString(),
      origin: req.headers.origin || "unknown",
      userAgent: req.headers["user-agent"] || "unknown",
      method: req.method,
      url: req.url
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Handle preflight requests
export const OPTIONS = async (req: MedusaRequest, res: MedusaResponse) => {
  setCorsHeaders(res);
  res.status(200).end();
};
