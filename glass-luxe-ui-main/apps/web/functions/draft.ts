interface Env {
  SANITY_READ_TOKEN?: string
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context

  if (!env.SANITY_READ_TOKEN) {
    return new Response('Server misconfigured', { status: 500 })
  }

  try {
    // Get the requested URL to redirect to
    const url = new URL(request.url)
    const redirectTo = url.searchParams.get('redirect') || '/'

    // Use the read token as the preview token
    const previewToken = env.SANITY_READ_TOKEN
    const cookieValue = `__sanity_preview_token=${encodeURIComponent(previewToken)}; Path=/; SameSite=None; Secure; Max-Age=3600`

    // Redirect to the specified URL with preview token cookie set
    return new Response(null, {
      status: 307,
      headers: {
        Location: redirectTo,
        'Set-Cookie': cookieValue,
      },
    })

  } catch (error) {
    console.error('Preview error:', error)
    return new Response('Error', { status: 500 })
  }
}