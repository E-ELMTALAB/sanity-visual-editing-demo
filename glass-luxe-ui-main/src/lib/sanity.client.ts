// Use @sanity/preview-kit for Visual Editing support (recommended for non-Next.js apps)
import { createClient } from '@sanity/preview-kit/client'
import { projectId, dataset, apiVersion } from './sanity.config'

// Check if we're in visual editing mode (iframe from Presentation tool)
// This function is called each time to get the current state
function isVisualEditing(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window !== window.parent ||
    !!window.opener ||
    import.meta.env.VITE_SANITY_VISUAL_EDITING === 'true'
  )
}

// Get preview token from URL if present (set by Presentation tool)
function getPreviewToken(): string | undefined {
  if (typeof window === 'undefined') return undefined
  const params = new URLSearchParams(window.location.search)
  return params.get('token') || undefined
}

// Create a function that returns the client with current visual editing state
function getClient() {
  const visualEditing = isVisualEditing()
  const token = getPreviewToken()
  
  return createClient({
    projectId,
    dataset,
    apiVersion,
    // Disable CDN when visual editing is enabled (CDN strips stega metadata)
    useCdn: !visualEditing,
    // Use previewDrafts perspective when in visual editing to see draft content
    perspective: visualEditing ? 'previewDrafts' : 'published',
    // Add token if we're in preview mode
    token: token,
    ignoreBrowserTokenWarning: !!token,
    // Enable Content Source Maps (required for Visual Editing)
    encodeSourceMap: visualEditing,
    stega: {
      // Enable stega when visual editing is enabled (embeds metadata in text content)
      enabled: visualEditing,
      studioUrl: '/studio',
      logger: console,
      filter: (props) => {
        // Filter out specific fields that shouldn't have overlays
        if (props.sourcePath.at(0) === 'duration') return false
        return props.filterDefault(props)
      },
    },
  })
}

// Export a client instance that will be used
// Note: For visual editing, the client should be recreated when state changes
// but for simplicity, we'll use a getter function
export const client = getClient()

// Export a function to get a fresh client instance
export function getSanityClient() {
  return getClient()
}

export async function fetchFromSanity<T>(query: string, params?: Record<string, any>): Promise<T | null> {
  try {
    // Use fresh client to ensure visual editing state is current
    const currentClient = getSanityClient()
    const result = await currentClient.fetch<T>(query, params)
    return result
  } catch (error) {
    console.error('[SANITY] Failed to fetch data:', error)
    return null
  }
}

