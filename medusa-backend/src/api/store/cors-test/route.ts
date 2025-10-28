import { MedusaRequest, MedusaResponse } from "@medusajs/framework";

/**
 * CORS Test Endpoint
 * GET /store/cors-test
 * Simple endpoint to test CORS configuration
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
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
  // Handle preflight requests
  res.status(200).end();
};
