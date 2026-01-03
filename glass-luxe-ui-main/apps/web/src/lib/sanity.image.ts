import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { client } from './sanity.client.light'
import { 
  PROXY_ENABLED, 
  proxySanityCDNUrl, 
  SANITY_PROJECT_ID, 
  SANITY_DATASET,
  getSanityCDNUrl
} from './proxy.config'

const builder = imageUrlBuilder(client)

const clampWidth = (width?: number, max = 1400) =>
  typeof width === 'number' ? Math.min(Math.max(width, 1), max) : max

/**
 * Create an image URL builder for the given source
 * Returns a builder that can be chained with .width(), .height(), etc.
 */
export function urlForImage(source: SanityImageSource, quality = 70) {
  if (!source) {
    console.warn('[SANITY-IMAGE] No image source provided')
    return builder.image({} as SanityImageSource)
  }
  return builder
    .image(source)
    .auto('format') // Let Sanity pick best (AVIF/WebP/JP2) per browser
    .fit('max')
    .quality(quality)
}

/**
 * Get a single image URL with proxy support
 * Automatically routes through Cloudflare proxy when enabled
 */
export function getImageUrl(
  source: SanityImageSource,
  width: number = 800,
  height?: number,
  quality = 70
): string {
  const w = clampWidth(width)
  const urlBuilder = urlForImage(source, quality).width(w)
  if (height) {
    urlBuilder.height(height)
  }
  const originalUrl = urlBuilder.url() || ''
  
  // Apply proxy transformation if enabled
  return PROXY_ENABLED ? proxySanityCDNUrl(originalUrl) : originalUrl
}

/**
 * Build responsive image set with srcset for different screen sizes
 * All URLs are automatically proxied when proxy is enabled
 */
export function buildResponsiveImageSet(
  source: SanityImageSource,
  widths: number[] = [480, 768, 1100, 1400],
  options?: { quality?: number; maxWidth?: number }
) {
  if (!source) {
    return { src: '', srcSet: '' }
  }

  // Limit max width to avoid over-fetching huge assets
  const maxWidth = options?.maxWidth || 1400
  const filteredWidths = widths.filter(w => w <= maxWidth).map(w => clampWidth(w, maxWidth))

  const sortedWidths = [...filteredWidths].sort((a, b) => a - b)
  const quality = options?.quality ?? 70

  const srcSet = sortedWidths
    .map((width) => {
      const originalUrl = urlForImage(source, quality)
        .width(width)
        .url()
      // Apply proxy transformation
      const proxiedUrl = PROXY_ENABLED ? proxySanityCDNUrl(originalUrl) : originalUrl
      return proxiedUrl
    })
    .filter(Boolean)
    .map((url, index) => `${url} ${sortedWidths[index]}w`)
    .join(', ')

  const largestWidth = sortedWidths[sortedWidths.length - 1]
  const originalSrc = urlForImage(source, quality)
    .width(largestWidth)
    .url() || ''
  
  // Apply proxy transformation to main src
  const src = PROXY_ENABLED ? proxySanityCDNUrl(originalSrc) : originalSrc

  return { src, srcSet }
}

/**
 * Direct URL builder for when you have a Sanity image reference
 * Useful for building URLs manually without the builder pattern
 */
export function buildImageUrl(
  imageRef: string,
  options?: {
    width?: number
    height?: number
    quality?: number
    format?: 'auto' | 'webp' | 'jpg' | 'png'
  }
): string {
  if (!imageRef) return ''
  
  // Parse image reference: image-abc123-800x600-jpg
  const parts = imageRef.replace('image-', '').split('-')
  if (parts.length < 2) return ''
  
  const id = parts[0]
  const dimensions = parts[1]
  const format = parts[2] || 'jpg'
  
  // Build CDN URL
  const baseUrl = PROXY_ENABLED 
    ? getSanityCDNUrl() 
    : 'https://cdn.sanity.io'
  
  let url = `${baseUrl}/images/${SANITY_PROJECT_ID}/${SANITY_DATASET}/${id}-${dimensions}.${format}`
  
  // Add query parameters
  const params = new URLSearchParams()
  if (options?.width) params.set('w', String(options.width))
  if (options?.height) params.set('h', String(options.height))
  if (options?.quality) params.set('q', String(options.quality))
  if (options?.format && options.format !== 'auto') params.set('fm', options.format)
  if (options?.format === 'auto') params.set('auto', 'format')
  
  const queryString = params.toString()
  if (queryString) {
    url += `?${queryString}`
  }
  
  return url
}

/**
 * Get proxied URL for any Sanity CDN URL
 * Use this when you have a raw CDN URL that needs proxying
 */
export function getProxiedImageUrl(originalUrl: string): string {
  if (!originalUrl) return ''
  return PROXY_ENABLED ? proxySanityCDNUrl(originalUrl) : originalUrl
}
