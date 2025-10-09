import { draftMode } from 'next/headers'
import { getClient } from '../../../lib/sanity.client'
import { readToken } from '../../../lib/sanity.api'
import { faqsByPageQuery } from '../../../lib/sanity.queries'
import ProductsPageClient from './page-client'
import ProductsOverlay from '../../../components/site/product/ProductsOverlay'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'محصولات دیجیتال | SharifGPT',
  description: 'بهترین محصولات دیجیتال شامل اکانت‌های پریمیوم و خدمات آنلاین',
}

export default async function ProductsPage() {
  const isDraft = draftMode().isEnabled
  const client = getClient(isDraft ? { token: readToken } : undefined)
  
  // Fetch FAQs for products page
  const faqs = await client.fetch<any[]>(faqsByPageQuery, { pageLocation: 'products' })
  
  return (
    <>
      <ProductsOverlay faqs={faqs} />
      <ProductsPageClient faqsData={faqs} />
    </>
  )
}

