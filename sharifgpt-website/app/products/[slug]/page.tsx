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

  // SERVER-SIDE DEBUG
  console.log('[SERVER] ============ PRODUCT DATA FROM SANITY ============')
  console.log('[SERVER] URL slug param:', params.slug)
  console.log('[SERVER] Product exists:', !!productData)
  if (productData) {
    console.log('[SERVER] Product _id:', productData._id)
    console.log('[SERVER] Product name:', productData.name)
    console.log('[SERVER] Product slug (raw):', productData.slug)
    console.log('[SERVER] Product slug type:', typeof productData.slug)
    console.log('[SERVER] Product slug.current:', productData.slug?.current)
    console.log('[SERVER] Full productData keys:', Object.keys(productData))
    console.log('[SERVER] ================================================')
  }

  if (!productData) return notFound()

  return (
    <>
      <ProductsOverlay productsData={[productData]} faqsData={faqsData} />
      <ProductPageClient productData={productData} faqsData={faqsData} />
    </>
  )
}