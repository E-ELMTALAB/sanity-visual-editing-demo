import { MedusaRequest, MedusaResponse } from "@medusajs/framework";

// GET / - simple health body
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  res.setHeader("content-type", "text/plain; charset=utf-8");
  res.status(200).send("OK");
};

// HEAD / - respond 200 without body
export const HEAD = async (req: MedusaRequest, res: MedusaResponse) => {
  res.status(200).end();
};


