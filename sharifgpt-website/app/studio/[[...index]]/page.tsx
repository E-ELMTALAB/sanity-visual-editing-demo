/**
 * Sanity Studio route for the built Next.js app (`sharifgpt-website`).
 * Uses a catch-all route so all /studio subpaths are handled by Studio.
 */

import { NextStudio } from 'next-sanity/studio'
import config from '../../../sanity.config'

export const dynamic = 'force-static'

export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  return (
    <NextStudio
      config={config}
      unstable_noAuthBoundary={
        process.env.NEXT_PUBLIC_UNSTABLE_NOAUTHBOUNDARY === 'true'
      }
    />
  )
}


