/**
 * Image Fallback Utility
 * Implements three-level fallback: Local Assets → Arvan Cloud → Sanity CMS
 * 
 * CRITICAL FALLBACK CHAIN:
 * 1. Local Assets: /assets/images/{filename}
 * 2. Arvan Cloud: https://sharifgptwebsiteimages.s3.ir-thr-at1.arvanstorage.ir/images/{filename}
 * 3. Sanity CMS: Original Sanity image source
 * 4. Placeholder: /placeholder.svg
 */

import { getLocalAssetImagePath, getArvanImageUrl } from '@/config/productImages'
import { getImageUrl as getSanityImageUrl } from '@/lib/sanity.image'

export type ImageSource = string | { _type?: string; asset?: { _ref: string } }

export interface FallbackImageResult {
  url: string
  source: 'local' | 'arvan' | 'sanity'
  fallbackChain: string[]
}

/**
 * Generate Sanity image URL from source
 * Helper function to convert Sanity image reference to URL
 */
function resolveSanityUrl(source: ImageSource): string {
  if (!source) return ''
  if (typeof source === 'string') return source
  return getSanityImageUrl(source, 800)
}

/**
 * CORE FALLBACK LOGIC - Three-tier resolution
 * 
 * IMPORTANT: This function handles the complete fallback chain.
 * Each fallback is attempted in order:
 * 1. Local Assets: /assets/images/{filename}
 * 2. Arvan Cloud: https://sharifgptwebsiteimages.s3.ir-thr-at1.arvanstorage.ir/...
 * 3. Sanity CMS: Original Sanity image source
 * 4. Placeholder: /placeholder.svg
 */
export function getImageWithFallback(
  productSlug: string | null | undefined,
  sanitySource: ImageSource | null | undefined
): FallbackImageResult {
  const fallbackChain: string[] = []

  // LEVEL 1: Try Local Assets
  if (productSlug) {
    const localAssetPath = getLocalAssetImagePath(productSlug)
    if (localAssetPath) {
      fallbackChain.push(`✓ Local: ${localAssetPath}`)
      return {
        url: localAssetPath,
        source: 'local',
        fallbackChain
      }
    }
    fallbackChain.push(`✗ Local: Not found for slug "${productSlug}"`)

    // LEVEL 2: Try Arvan Cloud
    const arvanUrl = getArvanImageUrl(productSlug)
    if (arvanUrl) {
      fallbackChain.push(`✓ Arvan: ${arvanUrl}`)
      return {
        url: arvanUrl,
        source: 'arvan',
        fallbackChain
      }
    }
    fallbackChain.push(`✗ Arvan: Not configured for slug "${productSlug}"`)
  }

  // LEVEL 3: Fallback to Sanity CMS
  if (sanitySource) {
    try {
      const sanityUrl = resolveSanityUrl(sanitySource)
      if (sanityUrl) {
        fallbackChain.push(`✓ Sanity: ${sanityUrl}`)
        return {
          url: sanityUrl,
          source: 'sanity',
          fallbackChain
        }
      }
    } catch (error) {
      fallbackChain.push(`✗ Sanity: Error - ${error instanceof Error ? error.message : 'Unknown error'}`)
      console.error('[IMAGE-FALLBACK] Sanity image resolution failed:', error)
    }
  }

  // FINAL FALLBACK: Return placeholder
  const placeholderUrl = '/placeholder.svg'
  fallbackChain.push(`✓ Placeholder: ${placeholderUrl}`)
  return {
    url: placeholderUrl,
    source: 'sanity', // Mark as sanity to indicate failure
    fallbackChain
  }
}

/**
 * Get image URLs for fallback chain
 * Returns array of all possible URLs to try in order
 */
export function getImageFallbackChain(
  productSlug: string | null | undefined,
  sanitySource: ImageSource | null | undefined
): string[] {
  const urls: string[] = []

  // LEVEL 1: Local Assets
  if (productSlug) {
    const localPath = getLocalAssetImagePath(productSlug)
    if (localPath) {
      urls.push(localPath)
    }
  }

  // LEVEL 2: Arvan Cloud
  if (productSlug) {
    const arvanUrl = getArvanImageUrl(productSlug)
    if (arvanUrl) {
      urls.push(arvanUrl)
    }
  }

  // LEVEL 3: Sanity CMS
  if (sanitySource) {
    try {
      const sanityUrl = resolveSanityUrl(sanitySource)
      if (sanityUrl) {
        urls.push(sanityUrl)
      }
    } catch (error) {
      console.error('[IMAGE-FALLBACK] Failed to resolve Sanity URL:', error)
    }
  }

  // LEVEL 4: Placeholder (always last as escape hatch)
  urls.push('/placeholder.svg')

  return urls
}

/**
 * Debug helper to log fallback chain
 * Use in development to verify fallback behavior
 */
export function logImageFallbackChain(
  productSlug: string | null | undefined,
  sanitySource: ImageSource | null | undefined
): void {
  const result = getImageWithFallback(productSlug, sanitySource)

  console.group('[IMAGE-FALLBACK-DEBUG]', {
    productSlug,
    finalUrl: result.url,
    source: result.source,
  })

  result.fallbackChain.forEach((step, index) => {
    console.log(`  Step ${index + 1}: ${step}`)
  })

  console.groupEnd()
}

/**
 * Build responsive image URLs
 * Creates URLs for different image sources but returns same URL for all sizes
 * (since local and Arvan images don't support dynamic transformations)
 */
export function getResponsiveImageUrls(
  productSlug: string | null | undefined,
  sanitySource: ImageSource | null | undefined,
  widths: number[] = [480, 768, 1100, 1400]
) {
  const primaryResult = getImageWithFallback(productSlug, sanitySource)
  const baseUrl = primaryResult.url

  // For local and Arvan images, return same URL for all widths
  // Browser will handle responsive sizing via CSS
  if (primaryResult.source === 'local' || primaryResult.source === 'arvan') {
    const srcSet = widths
      .map(width => `${baseUrl} ${width}w`)
      .join(', ')

    return {
      src: baseUrl,
      srcSet,
      source: primaryResult.source as 'local' | 'arvan',
    }
  }

  // For Sanity images, attempted to generate different sizes
  // but falls back to single URL since we can't transform Arvan/local images
  return {
    src: baseUrl,
    srcSet: `${baseUrl} ${widths[widths.length - 1]}w`,
    source: 'sanity' as const,
  }
}
