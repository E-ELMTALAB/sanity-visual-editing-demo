import { draftMode } from 'next/headers'
import { getClient } from 'lib/sanity.client'
import { readToken } from 'lib/sanity.api'
import { productDocBySlugQuery, productDocPaths } from 'lib/sanity.queries'
import { urlForImage } from 'lib/sanity.image'
import ProductOverlay from 'components/site/product/ProductOverlay'
import ProductPageClient from '../../../sharifgpt-website/app/products/[slug]/page'
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: { slug: string } }) {
  const isDraft = draftMode().isEnabled
  const client = getClient(isDraft ? { token: readToken } : undefined)
  const product = await client.fetch<any | null>(productDocBySlugQuery, { slug: params.slug })

  const productForClient = product
    ? {
        _id: product._id,
        name: product.name || '',
        description: product.description || '',
        longDescription: product.longDescription || '',
        category: product.category || 'default',
        price: product.price || 0,
        originalPrice: product.originalPrice || 0,
        discountPercentage: product.discountPercentage || 0,
        imageUrl: product.image ? urlForImage(product.image)?.url() : null,
        galleryUrls: Array.isArray(product.gallery)
          ? product.gallery.map((img: any) => (img ? urlForImage(img)?.url() : null))
          : [],
        features: product.features || [],
        badges: product.badges || [],
        inStock: product.inStock !== false,
        slug: product.slug,
      }
    : null

  if (!productForClient) {
    notFound()
  }

  return (
    <>
      <ProductOverlay product={product} />
      <ProductPageClient productData={productForClient} />
    </>
  )
}

export async function generateStaticParams() {
  const client = getClient()
  const slugs: string[] = await client.fetch(productDocPaths)
  return slugs.map((slug) => ({ slug }))
}
