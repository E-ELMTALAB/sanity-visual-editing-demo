// Visual Editing Sanity client that supports draft content
import { createClient } from '@sanity/preview-kit/client'
import { projectId, dataset, apiVersion } from './sanity.config'

// Detect if we're in visual editing mode
function isVisualEditing(): boolean {
  if (typeof window === 'undefined') return false

  // Check if we're in an iframe (Presentation tool)
  const inIframe = window !== window.parent || !!window.opener

  // Check for preview query param
  const urlParams = new URLSearchParams(window.location.search)
  const hasPreviewParam = urlParams.has('preview')

  // Check for preview cookie
  const hasPreviewCookie = document.cookie.includes('__sanity_preview_token')

  return inIframe || hasPreviewParam || hasPreviewCookie
}

// Get preview token from cookie or URL
function getPreviewToken(): string | undefined {
  if (typeof window === 'undefined') return undefined

  // Try cookie first
  const cookieMatch = document.cookie.match(/__sanity_preview_token=([^;]+)/)
  if (cookieMatch) return cookieMatch[1]

  // Try URL param as fallback
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get('token') || undefined
}

// Create the visual editing client
export const visualEditingClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Never use CDN for visual editing
  perspective: 'previewDrafts', // Always fetch drafts when in visual editing mode
  token: getPreviewToken(),
  stega: {
    enabled: true,
    studioUrl: import.meta.env.VITE_PUBLIC_STUDIO_URL || '/studio',
    logger: console,
    filter: (props: any) => {
      // Filter out specific fields that shouldn't have overlays
      if (props.sourcePath?.at(0) === 'duration') return false
      return props.filterDefault(props)
    },
  },
})

// Export helper functions
export { isVisualEditing, getPreviewToken }

// Re-export the original fetch function but with visual editing support
export async function fetchFromSanityVisualEditing<T>(query: string, params?: Record<string, any>): Promise<T | null> {
  try {
    const result = await visualEditingClient.fetch<T>(query, params)

    if (!result) {
      console.warn('[SANITY] Visual editing query returned null/undefined')
      return null
    }

    return result
  } catch (error) {
    console.error('[SANITY] Visual editing fetch failed:', error)
    return null
  }
}