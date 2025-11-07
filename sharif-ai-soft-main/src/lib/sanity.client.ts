/**
 * Sanity Client
 * Creates a configured Sanity client instance for fetching data
 */

import { createClient } from '@sanity/client'
import { projectId, dataset, apiVersion } from './sanity.config'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Use CDN for faster response times (cached)
  perspective: 'published', // Only fetch published documents
  stega: {
    enabled: false, // Disable stega encoding for production
  },
})

/**
 * Fetch data from Sanity with error handling
 */
export async function fetchFromSanity<T>(query: string, params?: Record<string, any>): Promise<T | null> {
  try {
    const result = await client.fetch<T>(query, params)
    return result
  } catch (error) {
    console.error('[SANITY] Failed to fetch data:', error)
    return null
  }
}

