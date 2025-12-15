// Visual Editing component for Sanity Presentation tool
import { lazy, Suspense } from 'react'

// Lazy load the VisualEditing component from Sanity
const LazyVisualEditing = lazy(() =>
  import('@sanity/visual-editing/react').then(module => ({
    default: module.VisualEditing
  })).catch(() => {
    // Fallback if import fails
    return { default: () => null }
  })
)

/**
 * Visual Editing component for Vite/React
 * This enables click-to-edit functionality when viewing the site from Sanity Studio
 */
export default function AppVisualEditing() {
  // Check if we're in visual editing mode
  const isVisualEditing = (() => {
    if (typeof window === 'undefined') return false

    // Check if we're in an iframe (Presentation tool)
    const inIframe = window !== window.parent || !!window.opener

    // Check for preview query param
    const urlParams = new URLSearchParams(window.location.search)
    const hasPreviewParam = urlParams.has('preview')

    // Check for preview cookie
    const hasPreviewCookie = document.cookie.includes('__sanity_preview_token')

    return inIframe || hasPreviewParam || hasPreviewCookie
  })()

  // Only render visual editing when in preview mode
  if (!isVisualEditing) {
    return null
  }

  return (
    <Suspense fallback={null}>
      <LazyVisualEditing />
    </Suspense>
  )
}