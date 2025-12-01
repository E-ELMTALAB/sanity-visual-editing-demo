import { loadEnvConfig } from '@next/env'
import { defineCliConfig } from 'sanity/cli'
import { projectId, dataset } from 'lib/sanity.api'

const dev = process.env.NODE_ENV !== 'production'
loadEnvConfig(__dirname, dev, { info: () => null, error: console.error })

// Validate that projectId is set and not a placeholder
if (!projectId || projectId === 'placeholder') {
  throw new Error(
    'Sanity project ID is not configured. Please set NEXT_PUBLIC_SANITY_PROJECT_ID in your .env file or environment variables.'
  )
}

export default defineCliConfig({ api: { projectId, dataset } })
