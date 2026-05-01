export const ARVAN_IMAGE_BASE =
  'https://sharifgptwebsiteimages.s3.ir-thr-at1.arvanstorage.ir/images'

export const IMAGE_FALLBACK_DEBUG =
  (import.meta.env.VITE_IMAGE_FALLBACK_DEBUG || 'false').toLowerCase() === 'true'

export type ImageFallbackInput = {
  filename?: string
  sanityUrl?: string
}

export function extractFilenameFromUrl(url?: string): string | null {
  if (!url) return null
  try {
    const parsed = new URL(url)
    const pathname = parsed.pathname
    const last = pathname.split('/').filter(Boolean).pop()
    return last || null
  } catch {
    return null
  }
}

export function buildImageFallbackCandidates(input: ImageFallbackInput): string[] {
  const filename = input.filename || extractFilenameFromUrl(input.sanityUrl) || ''
  const sanitizedFilename = filename.split('?')[0].split('#')[0]
  const candidates: string[] = []

  if (sanitizedFilename) {
    candidates.push(`/assets/images/${sanitizedFilename}`)
    candidates.push(`${ARVAN_IMAGE_BASE}/${sanitizedFilename}`)
  }

  if (input.sanityUrl) {
    candidates.push(input.sanityUrl)
  }

  const unique = Array.from(new Set(candidates.filter(Boolean)))
  if (IMAGE_FALLBACK_DEBUG) {
    console.log('[IMAGE-FALLBACK] candidates:', unique)
  }
  return unique
}
