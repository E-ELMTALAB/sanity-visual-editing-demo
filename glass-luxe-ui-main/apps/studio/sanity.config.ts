import { defineConfig } from 'sanity'
import { visionTool } from '@sanity/vision'
import { assist } from '@sanity/assist'
import { structureTool } from 'sanity/structure'
import { unsplashImageAsset } from 'sanity-plugin-asset-source-unsplash'
import { debugSecrets } from '@sanity/preview-url-secret/sanity-plugin-debug-secrets'
import { presentationTool } from 'sanity/presentation'
import { schemaTypes } from 'sanity-schema'

// Import locations from local file
import { locations } from './presentation.resolve'

const title = process.env.SANITY_STUDIO_TITLE || 'Content Studio'

export default defineConfig({
  name: 'default',
  title,
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || '',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  schema: {
    types: schemaTypes,
  },
  plugins: [
    presentationTool({
      resolve: {
        locations,
      },
      previewUrl: {
        origin: process.env.PUBLIC_SITE_URL || 'http://localhost:5173',
        preview: (document) => {
          // Map document to preview URL
          if (document._type === 'home') return '/'
          if (document._type === 'product' && document.slug?.current) return `/products/${document.slug.current}`
          if (document._type === 'post' && document.slug?.current) return `/blog/${document.slug.current}`
          if (document._type === 'course' && document.slug?.current) return `/courses/${document.slug.current}`
          if (document._type === 'collection' && document.slug?.current) return `/collections/${document.slug.current}`
          if (document._type === 'page' && document.slug?.current) return `/${document.slug.current}`
          return '/'
        },
      },
      previewMode: {
        enable: '/draft',
        disable: '/exit-preview',
      },
      allowOrigins: [
        'http://localhost:5173',
        'http://localhost:3000',
        'http://localhost:8080',
        process.env.PUBLIC_SITE_URL,
      ].filter(Boolean),
    }),
    structureTool(),
    visionTool({ defaultApiVersion: '2023-06-21' }),
    assist(),
    unsplashImageAsset(),
    process.env.NODE_ENV === 'development' && debugSecrets(),
  ].filter(Boolean),
})
