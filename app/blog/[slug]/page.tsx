import { draftMode } from 'next/headers'
import { getClient } from 'lib/sanity.client'
import { readToken } from 'lib/sanity.api'
import { postBySlugQuery } from 'lib/sanity.queries'
import { defaultPost } from 'lib/defaults/post'
import { fetchWithFallback } from 'lib/fetchWithFallback'
import BlogPost from 'components/site/blog/BlogPost'
import { urlForImage } from 'lib/sanity.image'
import type { Metadata } from 'next'

function extractTextFromPortableText(blocks: any[]): string {
  if (!blocks || !Array.isArray(blocks)) return ''
  return blocks
    .filter((block) => block._type === 'block')
    .map((block) => block.children?.map((child: any) => child.text).join(''))
    .join(' ')
    .substring(0, 160)
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const isDraft = draftMode().isEnabled
  const client = getClient(isDraft ? { token: readToken } : undefined)
  const post = await fetchWithFallback(client, postBySlugQuery, { slug: params.slug }, defaultPost)

  if (!post || post === defaultPost) {
    return {
      title: 'مقاله یافت نشد',
      description: 'مقاله مورد نظر یافت نشد',
    }
  }

  const seo = post.seo || {}
  const excerptText = post.excerpt ? extractTextFromPortableText(post.excerpt) : ''
  const coverImageUrl = post.coverImage ? urlForImage(post.coverImage)?.url() : undefined
  const ogImageUrl = seo.openGraphImage ? urlForImage(seo.openGraphImage)?.url() : coverImageUrl

  return {
    title: seo.metaTitle || post.title || 'مقاله',
    description: seo.metaDescription || excerptText || '',
    openGraph: {
      title: seo.openGraphTitle || post.title || '',
      description: seo.openGraphDescription || excerptText || '',
      images: ogImageUrl ? [{ url: ogImageUrl }] : [],
      type: 'article',
      publishedTime: post.publishedAt,
      authors: post.author ? [post.author] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.openGraphTitle || post.title || '',
      description: seo.openGraphDescription || excerptText || '',
      images: ogImageUrl ? [ogImageUrl] : [],
    },
    alternates: {
      canonical: seo.canonicalUrl || `https://sharifgpt.com/blog/${params.slug}`,
    },
    robots: {
      index: seo.robotsMeta?.includes('noindex') ? false : true,
      follow: seo.robotsMeta?.includes('nofollow') ? false : true,
    },
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const isDraft = draftMode().isEnabled
  const client = getClient(isDraft ? { token: readToken } : undefined)
  const initial = await fetchWithFallback(client, postBySlugQuery, { slug: params.slug }, defaultPost)
  return <BlogPost post={initial as any} />
}


