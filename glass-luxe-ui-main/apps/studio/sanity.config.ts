import {defineConfig} from 'sanity'
import {visionTool} from '@sanity/vision'
import {assist} from '@sanity/assist'
import {structureTool} from 'sanity/structure'
import {unsplashImageAsset} from 'sanity-plugin-asset-source-unsplash'
import {debugSecrets} from '@sanity/preview-url-secret/sanity-plugin-debug-secrets'
import {presentationTool} from 'sanity/presentation'
import {schemaTypes} from 'sanity-schema'

import {locations} from './presentation.resolve'

const title = process.env.SANITY_STUDIO_TITLE || 'Content Studio'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
if (!projectId) {
  throw new Error('Missing SANITY_STUDIO_PROJECT_ID')
}

const dataset = process.env.SANITY_STUDIO_DATASET || 'production'
const siteUrl = process.env.PUBLIC_SITE_URL || 'http://localhost:5173'

export default defineConfig({
  name: 'default',
  title,
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
  },
  plugins: [
    presentationTool({
      resolve: {locations},
      previewUrl: {
        initial: siteUrl,
        previewMode: {
          enable: '/draft',
          disable: '/exit-preview',
        },
      },
      allowOrigins: [
        'http://localhost:5173',
        'http://localhost:3000',
        'http://localhost:8080',
        siteUrl,
      ].filter(Boolean),
    }),

    structureTool(),
    visionTool({defaultApiVersion: '2023-06-21'}),
    assist(),
    unsplashImageAsset(),
    process.env.NODE_ENV === 'development' && debugSecrets(),
  ].filter(Boolean),
})
