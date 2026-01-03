import createImageUrlBuilder from '@sanity/image-url'
import { dataset, projectId } from 'lib/sanity.api'
import { proxySanityCDNUrl, isProxyEnabled } from 'lib/proxy.config'
import type { Image } from 'sanity'

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
})

/**
 * Get raw image URL builder (for chaining)
 * Note: URLs will still go to cdn.sanity.io - use getProxiedImageUrl for proxied URLs
 */
export const urlForImage = (source: Image) => {
  // Ensure that source image contains a valid reference
  // Check for both _ref (reference) and _id (dereferenced asset)
  if (!source?.asset) {
    return undefined
  }

  // If asset is already dereferenced (has _id), use it directly
  // Otherwise, check for _ref
  if (!source.asset._ref && !source.asset._id) {
    return undefined
  }

  return imageBuilder?.image(source).auto('format').fit('max')
}

/**
 * Get proxied image URL string
 * Use this when you need a final URL string that works through the proxy
 */
export const getProxiedImageUrl = (source: Image, options?: {
  width?: number
  height?: number
  quality?: number
}): string | undefined => {
  if (!source?.asset) {
    return undefined
  }

  if (!source.asset._ref && !source.asset._id) {
    return undefined
  }

  let builder = imageBuilder?.image(source).auto('format').fit('max')
  
  if (options?.width) builder = builder?.width(options.width)
  if (options?.height) builder = builder?.height(options.height)
  if (options?.quality) builder = builder?.quality(options.quality)
  
  const url = builder?.url()
  
  if (!url) return undefined
  
  // Apply proxy if enabled
  return proxySanityCDNUrl(url)
}

/**
 * Transform any Sanity CDN URL to proxied version
 * Useful for URLs that come from Sanity data directly or from urlForImage()
 */
export const toProxiedUrl = (url: string | undefined): string | undefined => {
  if (!url) return undefined
  return proxySanityCDNUrl(url)
}

/**
 * Helper to get image URL with automatic proxy support
 * Returns undefined for invalid sources
 */
export const getImageUrl = (source: Image | undefined | null): string | undefined => {
  if (!source) return undefined
  
  const builder = urlForImage(source)
  if (!builder) return undefined
  
  const url = builder.url()
  return proxySanityCDNUrl(url)
}

// Re-export proxy status for convenience
export { isProxyEnabled }
