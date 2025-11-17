import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { client } from './sanity.client'

const builder = imageUrlBuilder(client)

export function urlForImage(source: SanityImageSource) {
  if (!source) {
    console.warn('[SANITY-IMAGE] No image source provided')
    return builder.image({} as SanityImageSource)
  }
  return builder.image(source).auto('format').fit('max')
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

