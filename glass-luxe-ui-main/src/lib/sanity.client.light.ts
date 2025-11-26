// Lightweight Sanity client for PRODUCTION use only
// This doesn't include visual editing features - much smaller bundle
import { createClient } from '@sanity/client'
import { projectId, dataset, apiVersion } from './sanity.config'

const PROXY_ENDPOINT = import.meta.env.VITE_SANITY_PROXY_ENDPOINT || 'https://backend.sharifgpt.com/sanity-proxy'

const directClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
})

async function fetchViaProxy<T>(query: string, params?: Record<string, any>): Promise<T> {
  const response = await fetch(PROXY_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, params }),
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Proxy request failed with status ${response.status}`)
  }

  const payload = await response.json()

  if (!payload?.success) {
    throw new Error(payload?.error || 'Proxy response missing data')
  }

  return payload.data as T
}

export async function fetchFromSanity<T>(query: string, params?: Record<string, any>): Promise<T | null> {
  if (!projectId || projectId === 'placeholder') {
    console.warn('[SANITY] Not configured')
    return null
  }

  try {
    return await fetchViaProxy<T>(query, params)
  } catch (proxyError) {
    console.error('[SANITY] Proxy fetch failed:', proxyError)

    if (import.meta.env.DEV) {
      try {
        return await directClient.fetch<T>(query, params)
      } catch (directError) {
        console.error('[SANITY] Direct fetch fallback failed:', directError)
        return null
      }
    }

    return null
  }
}

export { directClient as client }

