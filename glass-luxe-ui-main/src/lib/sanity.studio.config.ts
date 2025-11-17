/**
 * Sanity Studio configuration for Vite/React app
 * This config imports schemas from the parent directory
 */
import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { unsplashImageAsset } from 'sanity-plugin-asset-source-unsplash'
import { projectId, dataset, apiVersion } from './sanity.config'

// Import schemas from parent directory
import page from '../../../schemas/documents/page'
import post from '../../../schemas/documents/post'
import project from '../../../schemas/documents/project'
import duration from '../../../schemas/objects/duration'
import product from '../../../schemas/documents/product'
import productOption from '../../../schemas/objects/productOption'
import faq from '../../../schemas/documents/faq'
import course from '../../../schemas/documents/course'
import instructor from '../../../schemas/documents/instructor'
import collection from '../../../schemas/documents/collection'
import milestone from '../../../schemas/objects/milestone'
import timeline from '../../../schemas/objects/timeline'
import youtube from '../../../schemas/objects/youtube'
import syllabusModule from '../../../schemas/objects/syllabusModule'
import lesson from '../../../schemas/objects/lesson'
import discountedProduct from '../../../schemas/objects/discountedProduct'
import socialMediaProduct from '../../../schemas/objects/socialMediaProduct'
import educationalProduct from '../../../schemas/objects/educationalProduct'
import bestsellingCourse from '../../../schemas/objects/bestsellingCourse'
import topBannerSlide from '../../../schemas/objects/topBannerSlide'
import home from '../../../schemas/singletons/home'
import settings from '../../../schemas/singletons/settings'

// Import plugins
import { pageStructure, singletonPlugin } from '../../../plugins/settings'

// Presentation tool for Visual Editing
import { presentationTool } from 'sanity/presentation'
import { locations } from './presentation.resolve'

const title = import.meta.env.VITE_SANITY_PROJECT_TITLE || 'Content Studio'

export default defineConfig({
  basePath: '/studio',
  projectId: projectId || '',
  dataset: dataset || 'production',
  title,
  schema: {
    types: [
      // Singletons
      home,
      settings,
      // Documents
      duration,
      page,
      project,
      post,
      product,
      faq,
      course,
      instructor,
      collection,
      // Objects
      productOption,
      milestone,
      timeline,
      youtube,
      discountedProduct,
      socialMediaProduct,
      educationalProduct,
      bestsellingCourse,
      topBannerSlide,
      syllabusModule,
      lesson,
    ],
  },
  plugins: [
    presentationTool({
      resolve: {
        locations,
      },
      previewUrl: {
        initial: typeof window !== 'undefined' 
          ? window.location.origin 
          : 'http://localhost:5173',
        // For Vite/React, we don't have server-side API routes
        // Visual editing will work via query parameters and iframe detection
      },
      allowOrigins: [
        'http://localhost:*',
        'https://*.vercel.app',
        'https://*.netlify.app',
      ],
    }),
    structureTool({
      structure: pageStructure([home, settings]),
    }),
    // Configures the global "new document" button, and document actions, to suit the Settings document singleton
    singletonPlugin([home.name, settings.name]),
    // Add an image asset source for Unsplash
    unsplashImageAsset(),
    // Vision lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})

