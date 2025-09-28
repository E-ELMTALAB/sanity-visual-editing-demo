import { draftMode } from 'next/headers'
import { LiveQuery } from 'next-sanity/preview'
import { getClient } from 'lib/sanity.client'
import { readToken } from 'lib/sanity.api'
import { postBySlugQuery } from 'lib/sanity.queries'
import { defaultPost } from 'lib/defaults/post'
import { fetchWithFallback } from 'lib/fetchWithFallback'
import BlogPost from 'components/site/blog/BlogPost'

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const isDraft = draftMode().isEnabled
  const client = getClient(isDraft ? { token: readToken } : undefined)
  const initial = await fetchWithFallback(client, postBySlugQuery, { slug: params.slug }, defaultPost)
  const hasRealData = !!(initial as any)?._id
  if (isDraft && hasRealData) {
    return (
      <LiveQuery enabled query={postBySlugQuery} params={{ slug: params.slug }} initialData={initial}>
        {(data: any) => <BlogPost post={data as any} />}
      </LiveQuery>
    )
  }
  return <BlogPost post={initial as any} />
}


