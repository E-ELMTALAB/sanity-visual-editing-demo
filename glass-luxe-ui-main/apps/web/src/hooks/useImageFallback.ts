/**
 * React Hook for Image Fallback
 * Handles: Local Assets → Arvan Cloud → Sanity CMS
 * Plus: Runtime onerror fallback to next source when image fails to load
 * 
 * FALLBACK CHAIN:
 * 1. Local Assets: /assets/images/{filename}
 * 2. Arvan Cloud: https://sharifgptwebsiteimages.s3.ir-thr-at1.arvanstorage.ir/images/{filename}
 * 3. Sanity CMS: Original Sanity image source
 * 4. Placeholder: /placeholder.svg
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  getImageFallbackChain,
  logImageFallbackChain,
  ImageSource,
} from '@/lib/image-fallback'

export interface UseImageFallbackOptions {
  productSlug?: string | null
  sanitySource?: ImageSource | null
  enableLogging?: boolean
  onSourceChange?: (source: 'local' | 'arvan' | 'sanity') => void
}

export interface UseImageFallbackResult {
  src: string
  srcSet: string
  alt: string
  onError: () => void
  currentSource: 'local' | 'arvan' | 'sanity'
  isLoaded: boolean
  failedAttempts: number
}

/**
 * Hook that implements three-tier image fallback with runtime error handling
 * 
 * This hook:
 * 1. Builds a fallback chain of possible image URLs
 * 2. Starts with the first URL (local assets)
 * 3. On error, automatically tries the next source
 * 4. Tracks which source successfully loaded
 * 5. Provides debugging information via optional logging
 * 
 * IMPORTANT: The fallback triggers on the img onerror event, which fires when:
 * - File not found (404)
 * - Network error
 * - CORS error
 * - Timeout
 */
export function useImageFallback(options: UseImageFallbackOptions): UseImageFallbackResult {
  const {
    productSlug,
    sanitySource,
    enableLogging = false,
    onSourceChange,
  } = options

  // Track all possible URLs in the fallback chain
  const [fallbackChain, setFallbackChain] = useState<string[]>([])
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0)
  const [currentSource, setCurrentSource] = useState<'local' | 'arvan' | 'sanity'>('sanity')
  const [isLoaded, setIsLoaded] = useState(false)
  const [failedAttempts, setFailedAttempts] = useState(0)
  const attemptedUrlsRef = useRef<Set<string>>(new Set())

  // Build fallback chain on mount or when inputs change
  useEffect(() => {
    const chain = getImageFallbackChain(productSlug, sanitySource)
    setFallbackChain(chain)
    setCurrentUrlIndex(0)
    setIsLoaded(false)
    setFailedAttempts(0)
    attemptedUrlsRef.current.clear()

    if (enableLogging) {
      console.log('[IMG-FALLBACK][CHECK] init inputs', {
        productSlug,
        hasSanitySource: !!sanitySource,
      })
      console.log('[IMG-FALLBACK][CHECK] ordered candidate chain', chain)
      logImageFallbackChain(productSlug, sanitySource)
      chain.forEach((url, index) => {
        console.log('[IMG-FALLBACK][CHECK]', {
          result: url ? 'PASS' : 'FAIL',
          index,
          url,
        })
      })
    }

    // Determine initial source
    const initialSource = determineSourceFromIndex(0, productSlug)
    setCurrentSource(initialSource)
    if (enableLogging) {
      console.log('[IMG-FALLBACK][SELECT] initial source selected', {
        source: initialSource,
        url: chain[0] ?? '/placeholder.svg',
      })
    }
    onSourceChange?.(initialSource)
  }, [productSlug, sanitySource, enableLogging, onSourceChange])

  /**
   * Determine which source a URL index corresponds to
   */
  function determineSourceFromIndex(index: number, slug?: string | null): 'local' | 'arvan' | 'sanity' {
    if (index > fallbackChain.length - 1) {
      return 'sanity'
    }

    // Count sources up to this index
    let currentIdx = 0

    // Check local
    if (slug && fallbackChain[currentIdx]?.includes('/assets/images/')) {
      if (index === currentIdx) return 'local'
      currentIdx++
    }

    // Check Arvan
    if (slug && fallbackChain[currentIdx]?.includes('arvanstorage')) {
      if (index === currentIdx) return 'arvan'
      currentIdx++
    }

    // Rest are Sanity
    return 'sanity'
  }

  /**
   * Handle image load errors - move to next in fallback chain
   * This is called when an image fails to load (404, network error, etc.)
   */
  const handleError = useCallback(() => {
    const currentUrl = fallbackChain[currentUrlIndex]
    const nextIndex = currentUrlIndex + 1

    // Record this attempt
    attemptedUrlsRef.current.add(currentUrl)

    if (enableLogging) {
      console.warn('[IMG-FALLBACK][ERROR] runtime onError', {
        attempt: failedAttempts + 1,
        failedUrl: currentUrl,
        nextIndex,
        chainLength: fallbackChain.length,
      })
    }

    setFailedAttempts(prev => prev + 1)

    if (nextIndex < fallbackChain.length) {
      setCurrentUrlIndex(nextIndex)

      // Update source
      const newSource = determineSourceFromIndex(nextIndex, productSlug)
      setCurrentSource(newSource)
      onSourceChange?.(newSource)

      if (enableLogging) {
        console.log('[IMG-FALLBACK][SELECT] runtime transition', {
          fromIndex: currentUrlIndex,
          toIndex: nextIndex,
          toSource: newSource,
          toUrl: fallbackChain[nextIndex],
        })
      }
    } else {
      if (enableLogging) {
        console.error('[IMG-FALLBACK][ERROR] exhausted all runtime candidates', {
          attempted: failedAttempts + 1,
          fallbackUrl: '/placeholder.svg',
        })
      }
      setCurrentSource('sanity')
    }
  }, [currentUrlIndex, fallbackChain, failedAttempts, enableLogging, productSlug, onSourceChange])

  /**
   * Handle successful image load
   */
  const handleLoad = useCallback(() => {
    setIsLoaded(true)
    if (enableLogging) {
      console.log(
        `[IMAGE-FALLBACK] Image loaded successfully from source: ${currentSource}. ` +
        `Failed attempts before success: ${failedAttempts}`
      )
    }
    onSourceChange?.(currentSource)
  }, [currentSource, enableLogging, failedAttempts, onSourceChange])

  const currentUrl = fallbackChain[currentUrlIndex] || '/placeholder.svg'

  return {
    src: currentUrl,
    srcSet: `${currentUrl} 1400w`,
    alt: productSlug ? `${productSlug} product image` : 'Product image',
    onError: handleError,
    currentSource,
    isLoaded,
    failedAttempts,
  }
}
