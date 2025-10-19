import { apiVersion, basePath, dataset, projectId } from './sanity.api'
import { createClient } from 'next-sanity'

export function getClient(preview?: { token: string }) {
  // Validate that we have proper credentials before creating client
  if (!projectId || !dataset || projectId === 'placeholder' || dataset === 'production' && !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    console.warn('Sanity credentials not properly configured')
    // Return a dummy client that won't work but won't crash the build
    return createClient({
      projectId: 'placeholder',
      dataset: 'production',
      apiVersion,
      useCdn: false,
    })
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    perspective: 'published',
    stega: {
      enabled:
        process.env.NEXT_PUBLIC_SANITY_VISUAL_EDITING === 'true' ||
        process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview' ||
        typeof preview?.token === 'string',
      studioUrl: basePath,
      logger: console,
      filter: (props) => {
        // Allow arrays (e.g., heroSlides[]) to carry stega so Visual Editing can map overlays
        if (props.sourcePath.at(0) === 'duration') {
          return false
        }
        switch (props.sourcePath.at(-1)) {
          case 'site':
            return false
        }
        return props.filterDefault(props)
      },
    },
  })
  if (preview) {
    if (!preview.token) {
      throw new Error('You must provide a token to preview drafts')
    }
    return client.withConfig({
      token: preview.token,
      useCdn: false,
      ignoreBrowserTokenWarning: true,
      perspective: 'previewDrafts',
    })
  }
  return client
}
