import { createClient } from '@sanity/client'

import {
  SANITY_API_TOKEN,
  SANITY_API_VERSION,
  SANITY_DATASET,
  SANITY_PROJECT_ID,
} from './env.server'
import { getSanityAPIProxyUrl, isProxyEnabled, UNIFIED_PROXY_URL } from './proxy.config'

/**
 * Custom fetch function that routes through Cloudflare proxy when enabled
 * Used for server-side/build-time Sanity queries
 */
function createProxiedFetch(): typeof fetch {
  const proxyUrl = getSanityAPIProxyUrl()
  
  if (!proxyUrl) {
    return fetch
  }
  
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    const originalUrl = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
    
    // Check if this is a Sanity API request
    const sanityApiPattern = /https:\/\/[^.]+\.api(cdn)?\.sanity\.io/
    
    if (sanityApiPattern.test(originalUrl)) {
      // Transform URL to use proxy
      const url = new URL(originalUrl)
      const pathAndQuery = url.pathname + url.search
      const proxiedUrl = `${proxyUrl}${pathAndQuery}`
      
      console.log('[Sanity Server Proxy] Routing through proxy:', proxiedUrl)
      
      return fetch(proxiedUrl, init)
    }
    
    return fetch(input, init)
  }
}

// Create the client with proxy support
const customFetch = isProxyEnabled ? createProxiedFetch() : undefined

export const sanityServerClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  useCdn: false,
  token: SANITY_API_TOKEN,
  // Add custom fetch if proxy is enabled
  ...(customFetch && { fetch: customFetch as any }),
})

// Log proxy status on server startup
console.log('[Sanity Server Client] Proxy enabled:', isProxyEnabled)
console.log('[Sanity Server Client] Proxy URL:', UNIFIED_PROXY_URL || 'not set')
