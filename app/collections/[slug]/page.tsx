import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import {
  type CollectionDocument,
  collectionMockData,
  getMockCollection,
} from '../../../lib/collections.mock'
import CollectionPageClient from './page-client'

export const revalidate = 60

export async function generateStaticParams() {
  return Object.values(collectionMockData).map((collection) => ({ slug: collection.slug }))
}

interface CollectionPageProps {
  params: { slug: string }
  searchParams?: Record<string, string | string[] | undefined>
}

function buildSeoMetadata(collection: CollectionDocument): Metadata {
  const title = collection.seo_title || collection.hero_title || collection.title
  const description = collection.seo_description || collection.hero_subtitle
  const images = collection.og_image ? [{ url: collection.og_image }] : undefined

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/collections/${collection.slug}`,
      images,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images,
    },
    alternates: {
      canonical: `/collections/${collection.slug}`,
    },
  }
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const collection = getMockCollection(params.slug)
  if (!collection) {
    return {}
  }

  return buildSeoMetadata(collection)
}

export default async function CollectionPage({ params, searchParams }: CollectionPageProps) {
  const collection = getMockCollection(params.slug)

  if (!collection) {
    notFound()
  }

  return (
    <CollectionPageClient
      key={collection.key}
      collection={collection}
      initialSearchParams={searchParams}
    />
  )
}
