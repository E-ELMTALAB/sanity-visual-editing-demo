import ProductsPageClient from './page-client'
import ProductsOverlay from './products-overlay'
import { getClient } from '@/lib/sanity.client'
import { productsListQuery, faqsByPageQuery } from '@/lib/sanity.queries'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'محصولات | SharifGPT',
  description: 'بهترین محصولات دیجیتال، اکانت‌های پریمیوم و خدمات هوش مصنوعی',
}

export default async function ProductsPage() {
  const client = getClient()
  const [productsData, faqsData] = await Promise.all([
    client.fetch(productsListQuery),
    client.fetch(faqsByPageQuery, { pageLocation: 'products' })
  ])

  return (
    <>
      <ProductsOverlay productsData={productsData} faqsData={faqsData} />
      <ProductsPageClient productsData={productsData} faqsData={faqsData} />
    </>
  )
}

