import { useMemo, useState } from 'react'
import { buildImageFallbackCandidates, IMAGE_FALLBACK_DEBUG } from '@/lib/image-fallback'

type UseImageFallbackParams = {
  imageKey?: string
  filename?: string
  sanityUrl?: string
  fallbackSrc?: string
}

export function useImageFallback({ imageKey, filename, sanityUrl, fallbackSrc }: UseImageFallbackParams) {
  const candidates = useMemo(() => {
    const built = buildImageFallbackCandidates({ imageKey, filename, sanityUrl })
    if (fallbackSrc) built.push(fallbackSrc)
    return Array.from(new Set(built.filter(Boolean)))
  }, [imageKey, filename, sanityUrl, fallbackSrc])

  const [index, setIndex] = useState(0)
  const src = candidates[index] || ''

  const onError = () => {
    if (index < candidates.length - 1) {
      const next = index + 1
      if (IMAGE_FALLBACK_DEBUG) {
        console.warn('[IMAGE-FALLBACK] failed, switching source', {
          current: candidates[index],
          next: candidates[next],
          index: next,
        })
      }
      setIndex(next)
      return
    }

    if (IMAGE_FALLBACK_DEBUG) {
      console.error('[IMAGE-FALLBACK] exhausted all candidates', { candidates })
    }
  }

  return { src, onError, candidates, currentIndex: index }
}
