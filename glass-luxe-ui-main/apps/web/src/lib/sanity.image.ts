import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { client } from './sanity.client.light'

const builder = imageUrlBuilder(client)

const clampWidth = (width?: number, max = 1400) =>
  typeof width === 'number' ? Math.min(Math.max(width, 1), max) : max

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
  return urlBuilder.url() || ''
}

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
    .map((width) =>
      urlForImage(source, quality)
        .width(width)
        .url()
    )
    .filter(Boolean)
    .map((url, index) => `${url} ${sortedWidths[index]}w`)
    .join(', ')

  const largestWidth = sortedWidths[sortedWidths.length - 1]
  const src =
    urlForImage(source, quality)
      .width(largestWidth)
      .url() || ''

  return { src, srcSet }
}

