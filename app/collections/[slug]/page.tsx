import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

import CollectionOverlay from 'components/site/collection/CollectionOverlay'
import { getClient } from 'lib/sanity.client'
import { readToken } from 'lib/sanity.api'
import {
  collectionBySlugQuery,
  productsByCollectionTypeQuery,
} from 'lib/sanity.queries'
import { urlForImage } from 'lib/sanity.image'
import type { CollectionPayload, ProductDoc } from 'types'
import CollectionPageClient from './page-client'

export const revalidate = 60

interface CollectionPageProps {
  params: { slug: string }
  searchParams?: Record<string, string | string[] | undefined>
}

function buildSeoMetadata(
  collection: CollectionPayload,
  slug: string
): Metadata {
  const title =
    collection.seo?.metaTitle ||
    collection.heroTitle ||
    collection.title ||
    'Collection'
  const description =
    collection.seo?.metaDescription || collection.heroSubtitle || ''

  const ogImage = collection.seo?.openGraphImage || collection.coverImage
  const images = ogImage
    ? [
        {
          url:
            urlForImage(ogImage)
              ?.width(1200)
              .height(630)
              .fit('crop')
              .url() || '',
        },
      ]
    : undefined

  return {
    title,
    description,
    openGraph: {
      title: collection.seo?.openGraphTitle || title,
      description: collection.seo?.openGraphDescription || description,
      url: `/collections/${slug}`,
      images,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: collection.seo?.openGraphTitle || title,
      description: collection.seo?.openGraphDescription || description,
      images,
    },
    alternates: {
      canonical:
        collection.seo?.canonicalUrl || `/collections/${slug}`,
    },
  }
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const isDraft = draftMode().isEnabled
  const client = getClient(isDraft ? { token: readToken } : undefined)

  const collection = await client.fetch<CollectionPayload | null>(
    collectionBySlugQuery,
    { slug: params.slug }
  )

  if (!collection) {
    return {}
  }

  return buildSeoMetadata(collection, params.slug)
}

export default async function CollectionPage({
  params,
  searchParams,
}: CollectionPageProps) {
  const isDraft = draftMode().isEnabled
  const client = getClient(isDraft ? { token: readToken } : undefined)

  const collection = await client.fetch<CollectionPayload | null>(
    collectionBySlugQuery,
    { slug: params.slug }
  )

  if (!collection) {
    notFound()
  }

  // Fetch products that belong to this collection
  const products = await client.fetch<ProductDoc[]>(
    productsByCollectionTypeQuery,
    { collectionType: collection.key }
  )

  return (
    <>
      <CollectionOverlay collection={collection} products={products} />
      <CollectionPageClient
        key={collection.key}
        collection={collection}
        products={products}
        initialSearchParams={searchParams}
      />
    </>
  )
}
