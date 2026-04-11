/**
 * Lightweight Sanity client — used only for:
 *  1. Image URL building (via the exported `client`)
 *  2. Dev-mode GROQ fetches when sanity-cache-direct.ts falls back
 *
 * In production, page components use sanity-cache-direct.ts exclusively,
 * so nothing here ever touches the network.
 */
import { createClient } from '@sanity/client'
import { projectId, dataset, apiVersion } from './sanity.config'
import { PROXY_ENABLED, UNIFIED_PROXY_URL } from './proxy.config'

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
})

const proxyEndpoint = PROXY_ENABLED ? UNIFIED_PROXY_URL : ''
const shouldUseProxy = PROXY_ENABLED && Boolean(proxyEndpoint)

async function fetchViaProxy<T>(query: string, params?: Record<string, any>): Promise<T | null> {
  if (!shouldUseProxy) return null

  const response = await fetch(proxyEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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

/**
 * Dev-mode fetcher — called by sanity-cache-direct.ts when not in production.
 * Uses proxy when enabled, otherwise falls back to the direct Sanity client.
 */
export async function fetchFromSanity<T>(query: string, params?: Record<string, any>): Promise<T | null> {
  if (!projectId || projectId === 'placeholder') {
    console.warn('[SANITY] Not configured')
    return null
  }

  if (shouldUseProxy) {
    try {
      return await fetchViaProxy<T>(query, params)
    } catch (error) {
      console.error('[SANITY] Proxy fetch failed:', error)
      return null
    }
  }

  try {
    return await client.fetch<T>(query, params)
  } catch (error) {
    console.error('[SANITY] Client fetch failed:', error)
    return null
  }
}

export { client }
