/**
 * Medusa Client Configuration
 * Used for connecting to Medusa backend from Next.js frontend
 * Supports Cloudflare proxy for bypassing internet filtering
 */

import Medusa from "@medusajs/medusa-js"
import { getMedusaBackendUrl, isProxyEnabled } from '@/lib/proxy.config'

// Get the appropriate backend URL (proxy or direct)
const MEDUSA_BACKEND_URL = getMedusaBackendUrl()

// Log which backend is being used (development only)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('[Medusa Client] Using backend:', MEDUSA_BACKEND_URL)
  console.log('[Medusa Client] Proxy enabled:', isProxyEnabled)
}

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

// Export the backend URL for direct fetch calls
export { MEDUSA_BACKEND_URL }

export default medusaClient

