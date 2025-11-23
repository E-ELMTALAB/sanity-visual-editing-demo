'use client'
/**
 * This config is used to set up Sanity Studio that's mounted on the `/pages/studio/[[...index]].tsx` route
 */
import { visionTool } from '@sanity/vision'
import { assist, contextDocumentType, contextDocumentTypeName } from '@sanity/assist'
import { apiVersion, basePath, dataset, projectId } from 'lib/sanity.api'
import { locate } from 'plugins/locate'
import { singletonPlugin } from 'plugins/settings'
import { defineConfig } from 'sanity'
import { presentationTool } from 'sanity/presentation'
import { structureTool } from 'sanity/structure'
import { unsplashImageAsset } from 'sanity-plugin-asset-source-unsplash'
import page from 'schemas/documents/page'
import post from 'schemas/documents/post'
import project from 'schemas/documents/project'
import duration from 'schemas/objects/duration'
import product from 'schemas/documents/product'
import productOption from 'schemas/objects/productOption'
import faq from 'schemas/documents/faq'
import course from 'schemas/documents/course'
import instructor from 'schemas/documents/instructor'
import collection from 'schemas/documents/collection'
import milestone from 'schemas/objects/milestone'
import timeline from 'schemas/objects/timeline'
import youtube from 'schemas/objects/youtube'
import syllabusModule from 'schemas/objects/syllabusModule'
import lesson from 'schemas/objects/lesson'
import discountedProduct from 'schemas/objects/discountedProduct'
import socialMediaProduct from 'schemas/objects/socialMediaProduct'
import educationalProduct from 'schemas/objects/educationalProduct'
import bestsellingCourse from 'schemas/objects/bestsellingCourse'
import topBannerSlide from 'schemas/objects/topBannerSlide'
import home from 'schemas/singletons/home'
import settings from 'schemas/singletons/settings'
import { debugSecrets } from '@sanity/preview-url-secret/sanity-plugin-debug-secrets'

const title = process.env.NEXT_PUBLIC_SANITY_PROJECT_TITLE

export default defineConfig({
  basePath,
  projectId: projectId || '',
  dataset: dataset || '',
  title,
  schema: {
    // If you want more content types, you can add them to this array
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
      // AI Assist context document
      contextDocumentType,
    ],
  },
  plugins: [
    presentationTool({
      locate,
      previewUrl: {
        previewMode: {
          enable: '/api/draft',
        },
      },
    }),
    structureTool({
      structure: (S) => {
        const singletonItems = [home, settings].map((typeDef) =>
          S.listItem()
            .title(typeDef.title)
            .icon(typeDef.icon)
            .child(
              S.editor()
                .id(typeDef.name)
                .schemaType(typeDef.name)
                .documentId(typeDef.name)
                .views([S.view.form()]),
            ),
        )

        const defaultListItems = S.documentTypeListItems().filter((listItem) => {
          const id = listItem.getId()
          return id && ![home.name, settings.name, contextDocumentTypeName].includes(id)
        })

        const aiContextItem = S.documentTypeListItem(contextDocumentTypeName)

        return S.list()
          .title('Content')
          .items([...singletonItems, S.divider(), aiContextItem, S.divider(), ...defaultListItems])
      },
    }),
    // Configures the global "new document" button, and document actions, to suit the Settings document singleton
    singletonPlugin([home.name, settings.name]),
    // Add an image asset source for Unsplash
    unsplashImageAsset(),
    // Vision lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
    // AI Assist plugin for content generation
    assist(),
    // See url preview secrets in the schema for debugging
    process.env.NODE_ENV === 'development' && debugSecrets(),
  ].filter(Boolean),
})
