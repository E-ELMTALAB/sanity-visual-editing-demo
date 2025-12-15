import { createClient } from '@sanity/client'
import { validatePreviewUrl } from '@sanity/preview-url-secret'

interface Env {
  SANITY_READ_TOKEN?: string
  VITE_SANITY_PROJECT_ID?: string
  VITE_SANITY_DATASET?: string
  VITE_SANITY_API_VERSION?: string
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context

  if (!env.SANITY_READ_TOKEN) {
    return new Response('Server misconfigured', { status: 500 })
  }

  // Create Sanity client for validation
  const client = createClient({
    projectId: env.VITE_SANITY_PROJECT_ID || 'placeholder',
    dataset: env.VITE_SANITY_DATASET || 'production',
    apiVersion: env.VITE_SANITY_API_VERSION || '2023-06-21',
    token: env.SANITY_READ_TOKEN,
    useCdn: false,
  })

  try {
    // Validate the preview URL using Sanity's official method
    const { isValid, redirectTo = '/' } = await validatePreviewUrl(client, request.url)
    if (!isValid) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Use the read token as the preview token (this is what the client expects)
    const previewToken = env.SANITY_READ_TOKEN
    const cookieValue = `__sanity_preview_token=${encodeURIComponent(previewToken)}; Path=/; SameSite=None; Secure; Max-Age=3600`

    // Redirect to the validated URL with cookie set
    return new Response(null, {
      status: 307,
      headers: {
        Location: redirectTo,
        'Set-Cookie': cookieValue,
      },
    })

  } catch (error) {
    console.error('Preview validation error:', error)
    return new Response('Unauthorized', { status: 401 })
  }
}