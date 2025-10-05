import { draftMode } from 'next/headers'
import { getClient } from '@/lib/sanity.client'
import { readToken } from '@/lib/sanity.api'
import { productsListQuery } from '@/lib/sanity.queries'
import type { ProductDoc } from 'types'
import ProductsOverlay from '@/components/site/product/ProductsOverlay'
import ProductsPageClient from './page-client'

export const metadata = {
  title: 'فروشگاه محصولات دیجیتال - SharifGPT',
  description: 'بهترین محصولات دیجیتال با قیمت‌های مناسب - هوش مصنوعی، سوشیال مدیا، موسیقی و بیشتر',
}

export default async function ProductsPage() {
  const isDraft = draftMode().isEnabled
  const client = getClient(isDraft ? { token: readToken } : undefined)
  
  // Fetch all products from Sanity
  const products = await client.fetch<ProductDoc[]>(productsListQuery)

  return (
    <>
      {/* Hidden overlay for Visual Editing */}
      <ProductsOverlay products={products || []} />
      
      {/* Client component with actual UI */}
      <ProductsPageClient productsData={products || []} />
    </>
  )
}