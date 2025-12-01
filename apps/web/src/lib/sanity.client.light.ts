// Lightweight Sanity client for PRODUCTION use only
// This doesn't include visual editing features - much smaller bundle
import { createClient } from '@sanity/client'
import { projectId, dataset, apiVersion } from './sanity.config'

/**
 * Lightweight browser-only Sanity client.
 * This file is the single place where we talk to Sanity, so keeping the logic
 * here guarantees the app never falls back to our Medusa backend.
 */
const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
})

const proxyEndpoint = (import.meta.env.VITE_SANITY_PROXY_ENDPOINT || 'https://sanityproxy.elmtalabx.workers.dev/').trim()
const shouldUseProxy = Boolean(proxyEndpoint)

let hasLoggedClientOrigin = false
let hasLoggedProxyOrigin = false

function logDirectClientOrigin() {
  if (hasLoggedClientOrigin) {
    return
  }

  const config = client.config()
  const hostSuffix = config.useCdn ? 'apicdn' : 'api'
  const host = config.projectId ? `${config.projectId}.${hostSuffix}.sanity.io` : 'api.sanity.io'

  console.info('[SANITY] Using direct browser client →', `https://${host}`, `(dataset: ${config.dataset})`)
  hasLoggedClientOrigin = true
}

function logProxyOrigin() {
  if (hasLoggedProxyOrigin) {
    return
  }

  console.info('[SANITY] Using Cloudflare worker proxy →', proxyEndpoint)
  hasLoggedProxyOrigin = true
}

async function fetchViaProxy<T>(query: string, params?: Record<string, any>): Promise<T | null> {
  if (!shouldUseProxy) {
    return null
  }

  logProxyOrigin()

  const response = await fetch(proxyEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, params }),
    credentials: 'omit',
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => '')
    throw new Error(`[SANITY] Proxy request failed (${response.status}): ${errorText}`)
  }

  const payload = await response.json().catch(() => null)

  if (!payload?.success) {
    throw new Error(payload?.error || '[SANITY] Proxy response missing success flag')
  }

  return (payload.data ?? null) as T | null
}

export async function fetchFromSanity<T>(query: string, params?: Record<string, any>): Promise<T | null> {
  if (!projectId || projectId === 'placeholder') {
    console.warn('[SANITY] Not configured')
    return null
  }

  if (shouldUseProxy) {
    try {
      return await fetchViaProxy<T>(query, params)
    } catch (error) {
      console.error(error)
      return null
    }
  }

  logDirectClientOrigin()

  try {
    return await client.fetch<T>(query, params)
  } catch (error) {
    console.error('[SANITY] Client fetch failed:', error)
    return null
  }
}

export { client }

