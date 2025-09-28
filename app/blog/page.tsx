import { draftMode } from 'next/headers'
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
  return <BlogIndex posts={initial} />
}


