// Import VisualEditing - conditionally loaded to avoid build issues
// The component will only render when inside Sanity Studio's Presentation tool
import { lazy, Suspense } from 'react'

// Use a string template to prevent Vite from statically analyzing the import path
// This import will only be resolved at runtime
const getVisualEditing = () => {
  // Create import path dynamically to prevent static analysis
  const basePath = '@sanity/visual-editing'
  const reactPath = '/react'
  return import(/* @vite-ignore */ `${basePath}${reactPath}`)
    .then(module => ({ default: module.VisualEditing }))
    .catch(() => {
      // Fallback: try main package
      return import(/* @vite-ignore */ basePath)
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

