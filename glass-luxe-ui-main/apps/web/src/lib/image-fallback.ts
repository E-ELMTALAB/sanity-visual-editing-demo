export const ARVAN_IMAGE_BASE =
  'https://sharifgptwebsiteimages.s3.ir-thr-at1.arvanstorage.ir/images'

export const IMAGE_FALLBACK_DEBUG =
  (import.meta.env.VITE_IMAGE_FALLBACK_DEBUG || 'false').toLowerCase() === 'true'

export type ImageFallbackInput = {
  imageKey?: string
  filename?: string
  sanityUrl?: string
}
const IMAGE_EXTENSION = 'webp'

function coerceImageKey(value?: unknown): string {
  if (!value) return ''
  return typeof value === 'string'
    ? value
    : (typeof value === 'object' && value && 'current' in (value as Record<string, unknown>) && typeof (value as Record<string, unknown>).current === 'string')
      ? String((value as Record<string, unknown>).current)
      : String(value)
}

function normalizeImageKey(value?: string): string {
  if (!value) return ''
  return value
    .toLowerCase()
    .trim()
    .replace(/\.(webp)$/i, '')
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

function keyVariants(value?: unknown): string[] {
  const raw = coerceImageKey(value).toLowerCase().trim().replace(/\.webp$/i, '')
  const normalized = normalizeImageKey(raw)
  const dotVariant = raw
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9.-]/g, '')
    .replace(/-+/g, '-')
  const dashedVariant = dotVariant.replace(/\./g, '-')
  return Array.from(new Set([normalized, dotVariant, dashedVariant].filter(Boolean)))
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
  const normalizedKeys = keyVariants(input.imageKey || sanitizedFilename)
  const candidates: string[] = []

  if (normalizedKeys.length > 0) {
    normalizedKeys.forEach((key) => {
      candidates.push(`/assets/images/${key}.${IMAGE_EXTENSION}`)
      candidates.push(`${ARVAN_IMAGE_BASE}/${key}.${IMAGE_EXTENSION}`)
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
