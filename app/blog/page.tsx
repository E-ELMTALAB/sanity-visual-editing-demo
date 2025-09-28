import { draftMode } from 'next/headers'
import { LiveQuery } from 'next-sanity/preview'
import { getClient } from 'lib/sanity.client'
import { readToken } from 'lib/sanity.api'
import { blogListQuery } from 'lib/sanity.queries'
import { defaultPostList } from 'lib/defaults/post'
import { fetchWithFallback } from 'lib/fetchWithFallback'
import BlogIndex from 'components/site/blog/BlogIndex'

export default async function BlogPage() {
  const isDraft = draftMode().isEnabled
  const client = getClient(isDraft ? { token: readToken } : undefined)
  const params = {}
  const initial = await fetchWithFallback(client, blogListQuery, params, defaultPostList)
  const hasRealData = Array.isArray(initial) && initial.length > 0 && !!(initial as any)[0]?._id
  return (
    <LiveQuery enabled={isDraft && hasRealData} query={blogListQuery} params={params} initialData={initial}>
      <BlogIndex posts={initial} />
    </LiveQuery>
  )
}


