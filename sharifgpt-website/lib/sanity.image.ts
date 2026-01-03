import createImageUrlBuilder from '@sanity/image-url'
import { dataset, projectId } from '@/lib/sanity.api'
import { proxySanityCDNUrl, isProxyEnabled } from '@/lib/proxy.config'
import type { Image } from 'sanity'

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
})

/**
 * Get raw image URL builder (for chaining)
 */
export const urlForImage = (source: Image) => {
  // Ensure that source image contains a valid reference
  if (!source?.asset?._ref) {
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
  if (!source?.asset?._ref) {
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
 * Useful for URLs that come from Sanity data directly
 */
export const toProxiedUrl = (url: string | undefined): string | undefined => {
  if (!url) return undefined
  return proxySanityCDNUrl(url)
}
