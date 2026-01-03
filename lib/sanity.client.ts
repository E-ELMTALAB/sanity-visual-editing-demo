import { apiVersion, basePath, dataset, projectId } from 'lib/sanity.api'
import { createClient, type SanityClient } from 'next-sanity'
import { getSanityAPIProxyUrl, isProxyEnabled, UNIFIED_PROXY_URL } from 'lib/proxy.config'

// Log proxy status on module load
console.log('[Sanity Client] Proxy enabled:', isProxyEnabled)
console.log('[Sanity Client] Proxy URL:', UNIFIED_PROXY_URL)
console.log('[Sanity Client] API Proxy URL:', getSanityAPIProxyUrl())

/**
 * Custom fetch function that routes through Cloudflare proxy when enabled
 * This intercepts Sanity API calls and routes them through the proxy
 */
function createProxiedFetch(): typeof fetch {
  const proxyUrl = getSanityAPIProxyUrl()
  
  console.log('[Sanity Client] Creating proxied fetch with URL:', proxyUrl)
  
  if (!proxyUrl) {
    console.log('[Sanity Client] No proxy URL, using default fetch')
    return fetch
  }
  
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    const originalUrl = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
    
    // Check if this is a Sanity API request
    const sanityApiPattern = /https:\/\/[^.]+\.api(cdn)?\.sanity\.io/
    
    if (sanityApiPattern.test(originalUrl)) {
      // Transform URL to use proxy
      // Original: https://projectId.apicdn.sanity.io/v2023-06-21/data/query/production?query=...
      // Proxied: https://proxy.workers.dev/api/v2023-06-21/data/query/production?query=...
      const url = new URL(originalUrl)
      const pathAndQuery = url.pathname + url.search
      const proxiedUrl = `${proxyUrl}${pathAndQuery}`
      
      console.log('[Sanity Client Proxy] Routing request through proxy:', proxiedUrl)
      
      return fetch(proxiedUrl, init)
    }
    
    return fetch(input, init)
  }
}

export function getClient(preview?: { token: string }): SanityClient {
  // Validate that we have proper credentials before creating client
  if (!projectId || !dataset || projectId === 'placeholder' || dataset === 'production' && !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    console.warn('Sanity credentials not properly configured')
    // Return a dummy client that won't work but won't crash the build
    return createClient({
      projectId: 'placeholder',
      dataset: 'production',
      apiVersion,
      useCdn: false,
    })
  }

  // Use custom fetch for proxy support - always create to ensure fresh config
  const customFetch = isProxyEnabled ? createProxiedFetch() : undefined
  
  console.log('[Sanity Client] getClient called, proxy enabled:', isProxyEnabled, 'customFetch:', !!customFetch)

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    perspective: 'published',
    // Add custom fetch if proxy is enabled
    ...(customFetch && { fetch: customFetch }),
    stega: {
      enabled:
        process.env.NEXT_PUBLIC_SANITY_VISUAL_EDITING === 'true' ||
        process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview' ||
        typeof preview?.token === 'string',
      studioUrl: basePath,
      logger: console,
      filter: (props) => {
        // Allow arrays (e.g., heroSlides[]) to carry stega so Visual Editing can map overlays
        if (props.sourcePath.at(0) === 'duration') {
          return false
        }
        switch (props.sourcePath.at(-1)) {
          case 'site':
            return false
        }
        return props.filterDefault(props)
      },
    },
  })
  
  if (preview) {
    if (!preview.token) {
      throw new Error('You must provide a token to preview drafts')
    }
    return client.withConfig({
      token: preview.token,
      useCdn: false,
      ignoreBrowserTokenWarning: true,
      perspective: 'previewDrafts',
      // Also apply custom fetch to preview client
      ...(customFetch && { fetch: customFetch }),
    })
  }
  
  return client
}

/**
 * Direct query function for cases where you want to use the proxy directly
 * Useful for server-side queries during build time
 */
export async function proxiedSanityQuery<T = any>(
  query: string,
  params: Record<string, any> = {}
): Promise<T> {
  const proxyUrl = getSanityAPIProxyUrl()
  
  if (!proxyUrl) {
    // Fall back to regular client
    const client = getClient()
    return client.fetch<T>(query, params)
  }
  
  // Build the query URL
  const queryUrl = new URL(`${proxyUrl}/v${apiVersion}/data/query/${dataset}`)
  queryUrl.searchParams.set('query', query)
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      queryUrl.searchParams.set(`$${key}`, JSON.stringify(value))
    }
  })
  
  console.log('[Sanity Query Proxy] Fetching:', queryUrl.toString())
  
  const response = await fetch(queryUrl.toString())
  
  if (!response.ok) {
    throw new Error(`Sanity query failed: ${response.status} ${response.statusText}`)
  }
  
  const data = await response.json()
  return data.result as T
}
