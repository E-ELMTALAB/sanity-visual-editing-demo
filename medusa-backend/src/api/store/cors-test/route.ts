import { MedusaRequest, MedusaResponse } from "@medusajs/framework";

/**
 * CORS Test Endpoint
 * GET /store/cors-test
 * Simple endpoint to test CORS configuration
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  try {
    res.status(200).json({
      success: true,
      message: "CORS is working correctly",
      timestamp: new Date().toISOString(),
      origin: req.headers.origin || "unknown",
      userAgent: req.headers["user-agent"] || "unknown"
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const OPTIONS = async (req: MedusaRequest, res: MedusaResponse) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(200).end();
};
