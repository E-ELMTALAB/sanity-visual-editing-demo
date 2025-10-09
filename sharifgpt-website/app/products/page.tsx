import { getClient } from '../../../lib/sanity.client'
import { faqsByPageQuery } from '../../../lib/sanity.queries'
import ProductsPageClient from './page-client'
import ProductsOverlay from '../../../components/site/product/ProductsOverlay'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'محصولات | SharifGPT',
  description: 'بهترین محصولات دیجیتال، اکانت‌های پریمیوم و خدمات هوش مصنوعی',
}

export default async function ProductsPage() {
  const client = getClient()
  
  // Fetch FAQs for products page
  const faqs = await client.fetch<any[]>(faqsByPageQuery, { pageLocation: 'products' })
  
  return (
    <>
      <ProductsOverlay faqs={faqs} />
      <ProductsPageClient faqsData={faqs} />
    </>
  )
}

