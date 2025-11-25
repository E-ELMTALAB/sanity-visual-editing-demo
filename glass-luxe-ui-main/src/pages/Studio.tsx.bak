/**
 * Sanity Studio page component for Vite/React
 * This component mounts Sanity Studio at /studio route
 */
import { useEffect } from 'react'
import { Studio } from 'sanity'
import config from '../lib/sanity.studio.config'

export default function StudioPage() {
  useEffect(() => {
    // Set document title when Studio mounts
    document.title = config.title || 'Sanity Studio'
    
    // Remove any background styling that might interfere with Studio
    document.body.style.overflow = 'hidden'
    
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0 }}>
      <Studio config={config} />
    </div>
  )
}

