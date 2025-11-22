import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { client } from './sanity.client'

const builder = imageUrlBuilder(client)

export function urlForImage(source: SanityImageSource) {
  if (!source) {
    console.warn('[SANITY-IMAGE] No image source provided')
    return builder.image({} as SanityImageSource)
  }
  return builder
    .image(source)
    .auto('format') // Auto format (WebP/AVIF when supported)
    .fit('max')
    .quality(80) // Add default quality
}

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

export function buildResponsiveImageSet(
  source: SanityImageSource,
  widths: number[] = [480, 768, 1024, 1440, 1920],
  options?: { quality?: number; maxWidth?: number }
) {
  if (!source) {
    return { src: '', srcSet: '' }
  }

  // Limit max width for hero images and large displays
  const maxWidth = options?.maxWidth || 1920
  const filteredWidths = widths.filter(w => w <= maxWidth)

  const sortedWidths = [...filteredWidths].sort((a, b) => a - b)
  const quality = options?.quality ?? 75 // Increase default quality slightly

  const srcSet = sortedWidths
    .map((width) =>
      urlForImage(source)
        .width(width)
        .quality(quality)
        .format('webp') // Force WebP format for better compression
        .url()
    )
    .filter(Boolean)
    .map((url, index) => `${url} ${sortedWidths[index]}w`)
    .join(', ')

  const largestWidth = sortedWidths[sortedWidths.length - 1]
  const src =
    urlForImage(source)
      .width(largestWidth)
      .quality(quality)
      .format('webp') // Force WebP format for better compression
      .url() || ''

  return { src, srcSet }
}

