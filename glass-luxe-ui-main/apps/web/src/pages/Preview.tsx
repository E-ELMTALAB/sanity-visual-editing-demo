import { useEffect, useState } from 'react'
import { useSearchParams, Navigate } from 'react-router-dom'
import AppVisualEditing from '@/components/visual-editing/VisualEditing'

// Preview page component that enables draft mode
export default function Preview() {
  const [searchParams] = useSearchParams()
  const [isPreviewEnabled, setIsPreviewEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const enablePreview = async () => {
      try {
        // Get preview secret from URL params (support multiple param names)
        const secret = searchParams.get('secret') ||
                      searchParams.get('preview') ||
                      searchParams.get('sanity-preview')

        if (!secret) {
          console.warn('No preview secret provided')
          setIsLoading(false)
          return
        }

        // Determine redirect path (support multiple param names)
        const redirectTo = searchParams.get('redirect') ||
                          searchParams.get('path') ||
                          searchParams.get('slug') ||
                          '/'

        // Call the draft API to enable preview mode
        const response = await fetch('/draft', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ secret }),
        })

        if (response.ok) {
          const data = await response.json()
          console.log('Preview mode enabled:', data)
          setIsPreviewEnabled(true)

          // Redirect to the actual page with preview token (sanitize path)
          const cleanRedirect = redirectTo.startsWith('/') ? redirectTo : '/'
          window.location.href = `${cleanRedirect}?preview=true`
        } else {
          console.error('Failed to enable preview mode')
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Preview setup error:', error)
        setIsLoading(false)
      }
    }

    enablePreview()
  }, [searchParams])

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center text-white/80">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          Enabling preview mode...
        </div>
      </div>
    )
  }

  if (!isPreviewEnabled) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center text-white/80">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Preview Access Denied</h1>
          <p>Unable to enable preview mode. Please check your credentials.</p>
        </div>
      </div>
    )
  }

  // This shouldn't be reached as we redirect, but just in case
  return <Navigate to="/" replace />
}