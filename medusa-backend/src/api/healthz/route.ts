import { MedusaRequest, MedusaResponse } from "@medusajs/framework";

// GET /healthz - minimal plain text health endpoint for platform checks
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  res.setHeader("content-type", "text/plain; charset=utf-8");
  res.status(200).send("OK");
};

// HEAD /healthz - respond with 200 without body
export const HEAD = async (req: MedusaRequest, res: MedusaResponse) => {
  res.status(200).end();
};



