export const ARVAN_IMAGE_BASE =
  'https://sharifgptwebsiteimages.s3.ir-thr-at1.arvanstorage.ir/images'

export const IMAGE_FALLBACK_DEBUG =
  (import.meta.env.VITE_IMAGE_FALLBACK_DEBUG || 'false').toLowerCase() === 'true'

export type ImageFallbackInput = {
  imageKey?: string
  filename?: string
  sanityUrl?: string
}
const IMAGE_EXTENSIONS = ['webp', 'jpg', 'jpeg', 'png']

function normalizeImageKey(value?: string): string {
  if (!value) return ''
  return value
    .toLowerCase()
    .trim()
    .replace(/\.(webp|jpg|jpeg|png)$/i, '')
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
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
  const normalizedKey = normalizeImageKey(input.imageKey || sanitizedFilename)
  const candidates: string[] = []

  if (normalizedKey) {
    IMAGE_EXTENSIONS.forEach((ext) => {
      candidates.push(`/assets/images/${normalizedKey}.${ext}`)
      candidates.push(`${ARVAN_IMAGE_BASE}/${normalizedKey}.${ext}`)
    })
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
