import ProductsPageClient from './page-client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'محصولات | SharifGPT',
  description: 'بهترین محصولات دیجیتال، اکانت‌های پریمیوم و خدمات هوش مصنوعی',
}

export default function ProductsPage() {
  return <ProductsPageClient />
}

