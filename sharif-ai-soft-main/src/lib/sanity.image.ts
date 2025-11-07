/**
 * Sanity Image URL Builder
 * Utilities for generating optimized image URLs from Sanity
 */

import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { client } from './sanity.client'

// Create image URL builder instance
const builder = imageUrlBuilder(client)

/**
 * Generate image URL from Sanity image reference
 * @param source - Sanity image object
 * @returns Image URL builder
 */
export function urlForImage(source: SanityImageSource) {
  if (!source) {
    console.warn('[SANITY-IMAGE] No image source provided')
    return builder.image({} as SanityImageSource)
  }
  return builder.image(source).auto('format').fit('max')
}

/**
 * Get optimized image URL with specific dimensions
 * @param source - Sanity image object
 * @param width - Desired width
 * @param height - Optional height
 * @returns Optimized image URL
 */
export function getImageUrl(
  source: SanityImageSource,
  width: number = 800,
  height?: number
): string {
  const urlBuilder = urlForImage(source).width(width)
  
  if (height) {
    urlBuilder.height(height)
  }
  
  return urlBuilder.url() || ''
}

/**
 * Get responsive image URLs for different screen sizes
 * @param source - Sanity image object
 * @returns Object with URLs for different sizes
 */
export function getResponsiveImageUrls(source: SanityImageSource) {
  return {
    small: getImageUrl(source, 400),
    medium: getImageUrl(source, 800),
    large: getImageUrl(source, 1200),
    xlarge: getImageUrl(source, 1920),
  }
}

