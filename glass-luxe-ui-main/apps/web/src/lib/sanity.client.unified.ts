// Unified Sanity client that switches between production and visual editing modes
import { fetchFromSanity as fetchProduction } from './sanity.client.light'
import { fetchFromSanityVisualEditing } from './sanity.client.visual-editing'

// Detect if we're in visual editing mode
function isVisualEditing(): boolean {
  if (typeof window === 'undefined') return false

  // Only enable on the Presentation tool iframe (or popup) AND when preview cookie exists
  const inPresentation = window !== window.parent || !!window.opener
  const hasPreviewCookie = document.cookie.includes('__sanity_preview_token=')

  return inPresentation && hasPreviewCookie
}


/**
 * Unified fetch function that automatically switches between production and visual editing clients
 * This ensures preview mode fetches draft content while production stays cached and fast
 */
export async function fetchFromSanity<T>(query: string, params?: Record<string, any>): Promise<T | null> {
  const visualEditing = isVisualEditing()

  if (visualEditing) {
    console.log('[SANITY] Using visual editing client (draft content)')
    return fetchFromSanityVisualEditing<T>(query, params)
  } else {
    console.log('[SANITY] Using production client (published content)')
    return fetchProduction<T>(query, params)
  }
}

// Re-export other utilities
export { isVisualEditing }