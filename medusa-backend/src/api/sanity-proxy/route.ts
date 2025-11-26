import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { getSanityClient } from "../../lib/sanity-sync/sanityClient"

const sanityClient = getSanityClient()
const DEFAULT_ALLOWED = [
  "https://www.sharifgpt.com",
  "https://sharifgpt.com",
  "https://test.sharifgpt.com",
  "https://backend.sharifgpt.com",
  "http://localhost:3000",
]

const allowedOrigins = (process.env.SANITY_PROXY_ALLOWED_ORIGINS
  ? process.env.SANITY_PROXY_ALLOWED_ORIGINS.split(",")
  : DEFAULT_ALLOWED
).map((origin) => origin.trim())

const applyCors = (req: MedusaRequest, res: MedusaResponse) => {
  const requestOrigin = req.headers.origin ?? ""
  console.log("[sanity-proxy] CORS preflight from", requestOrigin ?? "unknown")
  const matchingOrigin = allowedOrigins.includes("*")
    ? "*"
    : allowedOrigins.find((origin) => origin === requestOrigin)

  if (matchingOrigin) {
    res.setHeader("Access-Control-Allow-Origin", matchingOrigin)
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
}

export const OPTIONS = async (req: MedusaRequest, res: MedusaResponse) => {
  applyCors(req, res)
  res.status(200).end()
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  applyCors(req, res)

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {})
    const { query, params } = body

    if (typeof query !== "string" || !query.trim().length) {
      return res.status(400).json({ success: false, error: "Missing query string" })
    }

    const data = await sanityClient.fetch(query, params || {})

    return res.status(200).json({
      success: true,
      release: `sanity-proxy-${new Date().toISOString()}`,
      data,
    })
  } catch (error: any) {
    console.error("[sanity-proxy] Failed to execute query:", error)
    return res.status(500).json({
      success: false,
      error: error?.message || "Failed to execute Sanity query",
    })
  }
}

export const GET = async (_req: MedusaRequest, res: MedusaResponse) => {
  res.status(405).json({ success: false, error: "Method not allowed" })
}


