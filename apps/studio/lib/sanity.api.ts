/**
 * As this file is reused in several other files, try to keep it lean and small.
 * Importing other npm packages here could lead to needlessly increasing the client bundle size, or end up in a server-only function that don't need it.
 */

// During build time, environment variables might not be available
// We'll use fallback values to prevent build failures
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder'

export const readToken = process.env.SANITY_API_READ_TOKEN || ''

// see https://www.sanity.io/docs/api-versioning for how versioning works
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-06-21'

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}

// The route that hosts the Studio, used for the embedded Studio routing as well as Visual Editing
export const basePath = '/studio'
