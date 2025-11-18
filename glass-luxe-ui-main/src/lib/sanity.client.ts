// Use @sanity/preview-kit for Visual Editing support (recommended for non-Next.js apps)
import { createClient } from '@sanity/preview-kit/client'
import { projectId, dataset, apiVersion } from './sanity.config'

// Check if we're in visual editing mode (iframe from Presentation tool)
// This function is called each time to get the current state
function isVisualEditing(): boolean {
  if (typeof window === 'undefined') return false
  
  // Check if we're in an iframe (Presentation tool)
  const inIframe = window !== window.parent || !!window.opener
  
  // Check environment variable
  const envEnabled = import.meta.env.VITE_SANITY_VISUAL_EDITING === 'true'
  
  const result = inIframe || envEnabled
  
  // Debug logging
  if (result) {
    console.log('[SANITY] Visual editing detected:', { inIframe, envEnabled })
  }
  
  return result
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
  
  // Validate configuration
  if (!projectId || projectId === 'placeholder') {
    console.error('[SANITY] ❌ Invalid projectId:', projectId)
    throw new Error('Sanity projectId is not configured. Please set VITE_SANITY_PROJECT_ID in your .env file.')
  }
  
  const clientConfig: any = {
  projectId,
  dataset,
  apiVersion,
    // For normal viewing, use CDN for better performance
    // Disable CDN when visual editing is enabled (CDN strips stega metadata)
    useCdn: !visualEditing,
    // Always use 'published' perspective for normal viewing
    // Only use 'drafts' when explicitly in visual editing mode with token
    perspective: (visualEditing && token) ? 'drafts' : 'published',
  }
  
  // Add token if we're in preview mode
  if (token) {
    clientConfig.token = token
    clientConfig.ignoreBrowserTokenWarning = true
  }
  
  // Stega encoding embeds Content Source Maps in text content (required for Visual Editing)
  // Only enable stega when visual editing is active
  if (visualEditing) {
    clientConfig.stega = {
      enabled: true,
      studioUrl: '/studio',
      logger: console,
      filter: (props: any) => {
        // Filter out specific fields that shouldn't have overlays
        if (props.sourcePath?.at(0) === 'duration') return false
        return props.filterDefault(props)
  },
    }
  }
  
  return createClient(clientConfig)
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
    
    // Log client configuration for debugging
    const visualEditing = isVisualEditing()
    const token = getPreviewToken()
    const actualPerspective = (visualEditing && token) ? 'drafts' : 'published'
    
    console.log('[SANITY] Fetching with config:', {
      projectId,
      dataset,
      apiVersion,
      useCdn: !visualEditing,
      perspective: actualPerspective,
      stegaEnabled: visualEditing,
      hasToken: !!token,
      inIframe: typeof window !== 'undefined' && (window !== window.parent || !!window.opener),
    })
    
    const result = await currentClient.fetch<T>(query, params)
    
    if (!result) {
      console.warn('[SANITY] Query returned null/undefined. Query:', query.substring(0, 100) + '...')
      
      // Test if we can connect to Sanity at all
      try {
        const testResult = await currentClient.fetch<number>('count(*[_type == "home"])')
        console.log('[SANITY] Test query - home documents count:', testResult)
        
        if (testResult === 0) {
          console.warn('[SANITY] ⚠️ No home documents found in Sanity. Please create a "home" document in Sanity Studio and publish it.')
        } else {
          console.warn('[SANITY] ⚠️ Home document exists but query returned null. Check if document is published (not just a draft).')
        }
      } catch (testError) {
        console.error('[SANITY] Test query failed:', testError)
      }
    } else {
      console.log('[SANITY] ✅ Successfully fetched data:', result)
    }
    
    return result
  } catch (error) {
    console.error('[SANITY] ❌ Failed to fetch data:', error)
    if (error instanceof Error) {
      console.error('[SANITY] Error details:', {
        message: error.message,
        stack: error.stack,
      })
    }
    return null
  }
}

