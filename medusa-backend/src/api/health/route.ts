import { MedusaRequest, MedusaResponse } from "@medusajs/framework";

/**
 * Simple Health Check Endpoint
 * GET /health
 * 
 * Returns basic health status
 * No authentication required
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "Medusa Backend",
    version: "2.10.2",
    message: "Backend is running"
  });
};

