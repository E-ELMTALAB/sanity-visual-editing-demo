/**
 * Sanity Client with Build-Time Cache Support
 * 
 * This is a wrapper around the standard Sanity client that:
 * 1. Checks for cached data first (in production)
 * 2. Returns cached data without API calls when available
 * 3. Falls back to API only if cache is not available
 * 4. Allows draft mode to always use live API
 * 
 * Usage:
 *   import { getCachedClient } from 'lib/sanity-cached-client'
 *   const client = getCachedClient()
 *   const data = await client.fetch(query, params)
 */

import { getClient } from './sanity.client'
import { fetchWithCache, isCacheAvailable, getCacheStatus } from './sanity-cache'

export interface CachedClientOptions {
  bypassCache?: boolean
  forceApi?: boolean
  draft?: boolean
}

/**
 * Create a Sanity client that uses build-time cache in production
 * 
 * In production:
 * - Queries are matched to cache keys
 * - Cached data is returned instantly (0ms API latency)
 * - No external API calls are made unless cache misses
 * 
 * In development/preview:
 * - Always uses live API for real-time changes
 */
export function getCachedClient(options?: CachedClientOptions) {
  const baseClient = getClient()

  // Wrap the fetch method to add cache layer
  const originalFetch = baseClient.fetch.bind(baseClient)

  baseClient.fetch = async (query: string, params?: Record<string, any>) => {
    // Respect options
    if (options?.forceApi || options?.draft) {
      console.info('[SANITY-CACHED-CLIENT] Using live API (forced or draft mode)')
      return originalFetch(query, params)
    }

    // Development mode: always use API
    if (process.env.NODE_ENV !== 'production') {
      return originalFetch(query, params)
    }

    // Production: try cache first
    if (!options?.bypassCache && isCacheAvailable()) {
      // Try to use cached data
      const cacheStatus = getCacheStatus()
      console.info(`[SANITY-CACHED-CLIENT] Cache available, checking for match (loaded at ${new Date(cacheStatus.timestamp || Date.now()).toISOString()})`)

      try {
        const cachedData = await fetchWithCache(query, params, { bypassCache: false })
        if (cachedData !== null) {
          console.info('[SANITY-CACHED-CLIENT] ✅ Using cached data (0ms response time)')
          return cachedData
        }
      } catch (error) {
        console.warn('[SANITY-CACHED-CLIENT] Cache check failed, falling back to API:', error)
      }
    }

    // Cache miss or not available: use API
    console.info('[SANITY-CACHED-CLIENT] Using live API (cache miss or not available)')
    return originalFetch(query, params)
  } as any

  return baseClient
}

/**
 * Status check function for monitoring
 */
export function getCachedClientStatus() {
  return {
    isProduction: process.env.NODE_ENV === 'production',
    cacheAvailable: isCacheAvailable(),
    cacheStatus: getCacheStatus(),
  }
}
