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

// CACHE-ONLY MODE: Set VITE_SANITY_CACHE_ONLY=true to block all API calls (for testing)
// This will throw an error if cache miss occurs, helping verify no API calls are made
const CACHE_ONLY_MODE = import.meta.env.VITE_SANITY_CACHE_ONLY === 'true' || import.meta.env.VITE_SANITY_CACHE_ONLY === '1'

if (CACHE_ONLY_MODE) {
  console.warn('[SANITY] 🚫 CACHE-ONLY MODE ENABLED - All API calls will be blocked!')
  console.warn('[SANITY] This mode is for testing. Set VITE_SANITY_CACHE_ONLY=false to disable.')
}

let hasLoggedClientOrigin = false
let hasLoggedProxyOrigin = false
let hasLoggedCacheUsage = false
let hasLoggedCacheOnlyMode = false

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
  if (import.meta.env.PROD || CACHE_ONLY_MODE) {
    const cached = await getCachedData<T>(query, params)
    if (cached !== null) {
      // Cache hit - logCacheUsage already called in getCachedData
      if (!hasLoggedCacheUsage) {
        logCacheUsage()
      }
      return cached
    }
    
    // Cache miss - check if cache-only mode is enabled
    const queryName = query.includes('_type == "home"') ? 'homePageQuery' :
                     query.includes('_type == "product"') && params?.slug ? `productBySlugQuery (${params.slug})` :
                     query.includes('_type == "product"') && params?.category ? `productsByCategoryQuery (${params.category})` :
                     query.includes('_type == "product"') ? 'featuredProductsQuery' :
                     query.includes('_type == "course"') ? 'featuredCoursesQuery' :
                     query.includes('_type == "post"') ? 'featuredPostsQuery' :
                     query.includes('_type == "faq"') ? 'faqsByPageQuery' :
                     'unknown query'
    
    if (CACHE_ONLY_MODE) {
      // In cache-only mode, throw error instead of falling back to API
      if (!hasLoggedCacheOnlyMode) {
        console.error('[SANITY] 🚫 CACHE-ONLY MODE: API call blocked!')
        console.error(`[SANITY] Query: ${queryName}`)
        console.error('[SANITY] This error indicates a cache miss. Check that:')
        console.error('   1. Build script ran successfully (npm run fetch:homepage)')
        console.error('   2. Cache files exist in src/data/sanity-cache/')
        console.error('   3. Query matches cache logic in sanity-cache.ts')
        hasLoggedCacheOnlyMode = true
      }
      throw new Error(`[SANITY] 🚫 CACHE-ONLY MODE: Cache miss for ${queryName}. API calls are blocked.`)
    }
    
    // Normal mode: log fallback to API
    console.info(`[SANITY] ⚠️ CACHE MISS → Fetching from API: ${queryName}`)
  }

  // Block API calls if cache-only mode is enabled
  if (CACHE_ONLY_MODE) {
    const queryName = query.includes('_type == "home"') ? 'homePageQuery' :
                     query.includes('_type == "product"') && params?.slug ? `productBySlugQuery (${params.slug})` :
                     query.includes('_type == "product"') && params?.category ? `productsByCategoryQuery (${params.category})` :
                     query.includes('_type == "product"') ? 'featuredProductsQuery' :
                     query.includes('_type == "course"') ? 'featuredCoursesQuery' :
                     query.includes('_type == "post"') ? 'featuredPostsQuery' :
                     query.includes('_type == "faq"') ? 'faqsByPageQuery' :
                     'unknown query'
    throw new Error(`[SANITY] 🚫 CACHE-ONLY MODE: API call blocked for ${queryName}. This should not happen if cache is working.`)
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

