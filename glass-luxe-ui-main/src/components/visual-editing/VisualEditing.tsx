import { VisualEditing } from '@sanity/visual-editing/react'

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

  return <VisualEditing />
}

