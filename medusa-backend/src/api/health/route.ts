import { MedusaRequest, MedusaResponse } from "@medusajs/framework";

/**
 * Simple Health Check Endpoint
 * GET /health
 * 
 * Returns basic health status
 * No authentication required
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "Medusa Backend",
      version: process.env.npm_package_version || "2",
      message: "Backend is running"
    });
  } catch {
    res.status(200).json({ status: "ok" });
  }
};

export const HEAD = async (req: MedusaRequest, res: MedusaResponse) => {
  res.status(200).end();
};

