// Lightweight Sanity client for PRODUCTION use only
// This doesn't include visual editing features - much smaller bundle
import { createClient } from '@sanity/client'
import { projectId, dataset, apiVersion } from './sanity.config'
import { getCachedData, isCacheAvailable } from './sanity-cache'

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
let hasLoggedCacheUsage = false

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

function logCacheUsage() {
  if (hasLoggedCacheUsage) {
    return
  }

  console.info('[SANITY] Using build-time cached data (no API calls)')
  hasLoggedCacheUsage = true
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

  // In production, try to use cached data first
  if (import.meta.env.PROD) {
    const cached = await getCachedData<T>(query, params)
    if (cached !== null) {
      // Cache hit - logCacheUsage already called in getCachedData
      if (!hasLoggedCacheUsage) {
        logCacheUsage()
      }
      return cached
    }
    // Cache miss - log fallback to API
    const queryName = query.includes('_type == "home"') ? 'homePageQuery' :
                     query.includes('_type == "product"') && params?.category ? `productsByCategoryQuery (${params.category})` :
                     query.includes('_type == "product"') ? 'featuredProductsQuery' :
                     query.includes('_type == "course"') ? 'featuredCoursesQuery' :
                     query.includes('_type == "post"') ? 'featuredPostsQuery' :
                     query.includes('_type == "faq"') ? 'faqsByPageQuery' :
                     'unknown query'
    console.info(`[SANITY] ⚠️ CACHE MISS → Fetching from API: ${queryName}`)
  }

  if (shouldUseProxy) {
    try {
      if (!hasLoggedProxyOrigin) {
        logProxyOrigin()
      }
      return await fetchViaProxy<T>(query, params)
    } catch (error) {
      console.error('[SANITY] Proxy fetch failed:', error)
      return null
    }
  }

  if (!hasLoggedClientOrigin) {
    logDirectClientOrigin()
  }

  try {
    return await client.fetch<T>(query, params)
  } catch (error) {
    console.error('[SANITY] Client fetch failed:', error)
    return null
  }
}

export { client }

