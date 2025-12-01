import { draftMode } from 'next/headers'
import { getClient } from 'lib/sanity.client'
import { readToken } from 'lib/sanity.api'
import { blogListQuery } from 'lib/sanity.queries'
import { defaultPostList } from 'lib/defaults/post'
import { fetchWithFallback } from 'lib/fetchWithFallback'
import BlogIndex from 'components/site/blog/BlogIndex'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'بلاگ SharifGPT - مقالات و آموزش‌های هوش مصنوعی',
  description: 'آخرین مقالات، آموزش‌ها و اخبار دنیای هوش مصنوعی، برنامه‌نویسی و فناوری',
  openGraph: {
    title: 'بلاگ SharifGPT - مقالات و آموزش‌های هوش مصنوعی',
    description: 'آخرین مقالات، آموزش‌ها و اخبار دنیای هوش مصنوعی',
    type: 'website',
    url: 'https://sharifgpt.com/blog',
    siteName: 'SharifGPT',
    locale: 'fa_IR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'بلاگ SharifGPT',
    description: 'آخرین مقالات و آموزش‌های هوش مصنوعی',
  },
  alternates: {
    canonical: 'https://sharifgpt.com/blog',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default async function BlogPage() {
  const isDraft = draftMode().isEnabled
  const client = getClient(isDraft ? { token: readToken } : undefined)
  const params = {}
  const initial = await fetchWithFallback(client, blogListQuery, params, defaultPostList)
  return <BlogIndex posts={initial} />
}


