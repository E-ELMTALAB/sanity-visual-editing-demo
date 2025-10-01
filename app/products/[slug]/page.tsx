import { draftMode } from 'next/headers'
import { getClient } from 'lib/sanity.client'
import { readToken } from 'lib/sanity.api'
import { productDocBySlugQuery } from 'lib/sanity.queries'
import { urlForImage } from 'lib/sanity.image'
import ProductOverlay from 'components/site/product/ProductOverlay'
import ProductPageClient from '../../../sharifgpt-website/app/products/[slug]/page'

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

  return (
    <>
      <ProductOverlay product={product} />
      <ProductPageClient params={params} />
    </>
  )
}
