export const onRequest: PagesFunction = async (context) => {
  const { request } = context
  const url = new URL(request.url)

  // Sanitize redirect to avoid open redirects
  const raw = url.searchParams.get('redirect') || '/'
  const redirectTo = raw.startsWith('/') && !raw.startsWith('//') ? raw : '/'

  // Clear preview cookies
  const cookieValue = `__sanity_preview_token=; Path=/; SameSite=None; Secure; Max-Age=0`

  // Redirect to the specified path with cookie cleared
  return new Response(null, {
    status: 307,
    headers: {
      Location: redirectTo,
      'Set-Cookie': cookieValue,
    },
  })
}