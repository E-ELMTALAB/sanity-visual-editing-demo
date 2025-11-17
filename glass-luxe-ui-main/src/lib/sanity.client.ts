import { createClient } from '@sanity/client'
import { projectId, dataset, apiVersion } from './sanity.config'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
  stega: {
    enabled: process.env.VITE_SANITY_VISUAL_EDITING === 'true' || false,
    studioUrl: '/studio',
    logger: console,
    filter: (props) => {
      // Filter out specific fields that shouldn't have overlays
      if (props.sourcePath.at(0) === 'duration') return false
      return props.filterDefault(props)
    },
  },
})

export async function fetchFromSanity<T>(query: string, params?: Record<string, any>): Promise<T | null> {
  try {
    const result = await client.fetch<T>(query, params)
    return result
  } catch (error) {
    console.error('[SANITY] Failed to fetch data:', error)
    return null
  }
}

