// Lightweight Sanity client for PRODUCTION use only
// This doesn't include visual editing features - much smaller bundle
import { createClient } from '@sanity/client'
import { projectId, dataset, apiVersion } from './sanity.config'

// Simple production client - no preview kit, no stega encoding
const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Always use CDN for production
  perspective: 'published',
})

export async function fetchFromSanity<T>(query: string, params?: Record<string, any>): Promise<T | null> {
  try {
    if (!projectId || projectId === 'placeholder') {
      console.warn('[SANITY] Not configured')
      return null
    }
    return await client.fetch<T>(query, params)
  } catch (error) {
    console.error('[SANITY] Fetch failed:', error)
    return null
  }
}

export { client }

