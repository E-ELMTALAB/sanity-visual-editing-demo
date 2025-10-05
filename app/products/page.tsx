import { draftMode } from 'next/headers'
import { getClient } from 'lib/sanity.client'
import { readToken } from 'lib/sanity.api'
import { productsListQuery, faqsByPageQuery } from 'lib/sanity.queries'
import type { ProductDoc, FAQ } from 'types'
import ProductsOverlay from 'components/site/product/ProductsOverlay'
import FAQOverlay from 'components/site/product/FAQOverlay'
import ProductsPageClient from './page-client'

export const metadata = {
  title: 'فروشگاه محصولات دیجیتال - SharifGPT',
  description: 'بهترین محصولات دیجیتال با قیمت‌های مناسب - هوش مصنوعی، سوشیال مدیا، موسیقی و بیشتر',
}

export default async function ProductsPage() {
  const isDraft = draftMode().isEnabled
  const client = getClient(isDraft ? { token: readToken } : undefined)
  
  // Fetch all products and FAQs from Sanity
  const products = await client.fetch<ProductDoc[]>(productsListQuery)
  const faqs = await client.fetch<FAQ[]>(faqsByPageQuery, { pageLocation: 'products' })
  
  return (
    <>
      {/* Hidden overlays for Visual Editing */}
      <ProductsOverlay products={products || []} />
      <FAQOverlay faqs={faqs || []} />
      
      {/* Client component with actual UI */}
      <ProductsPageClient 
        productsData={products || []} 
        faqsData={faqs || []}
      />
    </>
  )
}