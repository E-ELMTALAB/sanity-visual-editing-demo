// Lightweight Sanity client for PRODUCTION use only
// This doesn't include visual editing features - much smaller bundle
import { createClient } from '@sanity/client'
import { projectId, dataset, apiVersion } from './sanity.config'
import { getCachedData, isCacheAvailable } from './sanity-cache'
import { SANITY_CACHE_MODE } from './sanity-cache-mode'
import { 
  PROXY_ENABLED, 
  UNIFIED_PROXY_URL, 
  getSanityAPIUrl 
} from './proxy.config'

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

// Use the centralized proxy configuration
const proxyEndpoint = PROXY_ENABLED ? UNIFIED_PROXY_URL : ''
const shouldUseProxy = PROXY_ENABLED && Boolean(proxyEndpoint)

const CACHE_ONLY_MODE = SANITY_CACHE_MODE === 'cache-only'
const API_ONLY_MODE = SANITY_CACHE_MODE === 'api-only'
const CACHE_FIRST_MODE = SANITY_CACHE_MODE === 'cache-first'

console.info(`[SANITY] Runtime cache mode: ${SANITY_CACHE_MODE}`)

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

/**
 * Fetch from Sanity via Cloudflare proxy
 * Uses POST /sanity-query endpoint which accepts { query, params }
 */
async function fetchViaProxy<T>(query: string, params?: Record<string, any>): Promise<T | null> {
  if (!shouldUseProxy) {
    return null
  }

  logProxyOrigin()

  // Use the /sanity-query endpoint for POST-based GROQ queries
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

  // Cache path (cache-only and cache-first)
  if (!API_ONLY_MODE && (CACHE_ONLY_MODE || CACHE_FIRST_MODE || import.meta.env.PROD)) {
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
      if (!hasLoggedCacheOnlyMode) {
        console.error('[SANITY] CACHE-ONLY MODE: API call blocked!')
        console.error(`[SANITY] Query: ${queryName}`)
        console.error('[SANITY] This error indicates a cache miss. Check that:')
        console.error('   1. Build script ran successfully and generated cache json files')
        console.error('   2. Cache files exist in src/data/sanity-cache/')
        console.error('   3. Query matches cache logic in sanity-cache.ts')
        hasLoggedCacheOnlyMode = true
      }
      throw new Error(`[SANITY] CACHE-ONLY MODE: Cache miss for ${queryName}. API calls are blocked.`)
    }
    
    // Normal mode: log fallback to API
    console.info(`[SANITY] CACHE MISS → Fetching from API: ${queryName}`)
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
    throw new Error(`[SANITY] CACHE-ONLY MODE: API call blocked for ${queryName}. This should not happen if cache is working.`)
  }

  // In cache-first/api-only modes, API/proxy path is allowed
  if (shouldUseProxy) {
    try {
      if (!hasLoggedProxyOrigin) {
        logProxyOrigin()
      }
      return await fetchViaProxy<T>(query, params)
    } catch (error) {
      console.error('[SANITY] Proxy fetch failed:', error)
      // Don't fall back to direct - if proxy fails, it means filtering is blocking
      return null
    }
  }

  // Direct client (only used when proxy is disabled)
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
