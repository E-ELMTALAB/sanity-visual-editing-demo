import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import ProductPageClient from './page-client'
import ProductsOverlay from '../products-overlay'
import { getClient } from '@/lib/sanity.client'
import { readToken } from '@/lib/sanity.api'
import { productDocBySlugQuery, faqsByPageQuery } from '@/lib/sanity.queries'

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const isDraft = draftMode().isEnabled
  const client = getClient(isDraft ? { token: readToken } : undefined)
  
  const [productData, faqsData] = await Promise.all([
    client.fetch(productDocBySlugQuery, { slug: params.slug }),
    client.fetch(faqsByPageQuery, { pageLocation: 'products' }),
  ])

  if (!productData) return notFound()

  return (
    <>
      <ProductsOverlay productsData={[productData]} faqsData={faqsData} />
      <ProductPageClient productData={productData} faqsData={faqsData} />
    </>
  )
}