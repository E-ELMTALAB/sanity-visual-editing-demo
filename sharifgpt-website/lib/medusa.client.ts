/**
 * Medusa Client Configuration
 * Used for connecting to Medusa backend from Next.js frontend
 */

import Medusa from "@medusajs/medusa-js"

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "https://backend-production-ea59.up.railway.app"

// Create Medusa client instance
export const medusaClient = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  maxRetries: 3,
})

// Admin client (requires authentication)
export const createMedusaAdminClient = (apiKey?: string) => {
  return new Medusa({
    baseUrl: MEDUSA_BACKEND_URL,
    maxRetries: 3,
    apiKey: apiKey || process.env.MEDUSA_ADMIN_API_KEY,
  })
}

export default medusaClient

