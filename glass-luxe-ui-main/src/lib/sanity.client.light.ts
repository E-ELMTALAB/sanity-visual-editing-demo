// Lightweight Sanity client for PRODUCTION use only
// This doesn't include visual editing features - much smaller bundle
import { createClient } from '@sanity/client'
import { projectId, dataset, apiVersion } from './sanity.config'

/**
 * Lightweight browser-only Sanity client.
 * This file is the single place where we talk to Sanity, so keeping the logic
 * here guarantees the app never falls back to our Medusa backend.
 */
const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
})

let hasLoggedClientOrigin = false

function logDirectClientOrigin() {
  if (hasLoggedClientOrigin) {
    return
  }

  const config = client.config()
  const hostSuffix = config.useCdn ? 'apicdn' : 'api'
  const host = config.projectId ? `${config.projectId}.${hostSuffix}.sanity.io` : 'api.sanity.io'

  console.info('[SANITY] Using direct browser client →', `https://${host}`, `(dataset: ${config.dataset})`)
  hasLoggedClientOrigin = true
}

export async function fetchFromSanity<T>(query: string, params?: Record<string, any>): Promise<T | null> {
  if (!projectId || projectId === 'placeholder') {
    console.warn('[SANITY] Not configured')
    return null
  }

  logDirectClientOrigin()

  try {
    return await client.fetch<T>(query, params)
  } catch (error) {
    console.error('[SANITY] Client fetch failed:', error)
    return null
  }
}

export { client }

