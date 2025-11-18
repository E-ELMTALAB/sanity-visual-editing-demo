// Import VisualEditing - conditionally loaded to avoid build issues
// The component will only render when inside Sanity Studio's Presentation tool
import { lazy, Suspense } from 'react'

// Use @sanity/preview-kit/visual-editing as per official docs for non-Next.js apps
// This import will only be resolved at runtime to avoid build issues
const getVisualEditing = () => {
  // Try @sanity/preview-kit/visual-editing first (recommended for non-Next.js)
  return import(/* @vite-ignore */ '@sanity/preview-kit/visual-editing')
    .then(module => ({ default: module.VisualEditing }))
    .catch(() => {
      // Fallback: try @sanity/visual-editing/react
      return import(/* @vite-ignore */ '@sanity/visual-editing/react')
        .then(module => ({ default: module.VisualEditing || (() => null) }))
        .catch(() => {
          // If all fails, return empty component
          return { default: () => null }
        })
    })
}

const VisualEditingLazy = lazy(getVisualEditing)

/**
 * Visual Editing component for Vite/React
 * This enables click-to-edit functionality when viewing the site from Sanity Studio
 */
export default function AppVisualEditing() {
  // Check if we're inside an iframe (Presentation tool) or if visual editing is explicitly enabled
  const isMaybeInsidePresentation =
    typeof window !== 'undefined' &&
    (window !== window.parent ||
      !!window.opener ||
      import.meta.env.VITE_SANITY_VISUAL_EDITING === 'true')

  if (!isMaybeInsidePresentation) {
    return null
  }

  return (
    <Suspense fallback={null}>
      <VisualEditingLazy />
    </Suspense>
  )
}

