import { draftMode } from 'next/headers'
import { getClient } from 'lib/sanity.client'
import { readToken } from 'lib/sanity.api'
import { productsListQuery, faqsByPageQuery } from 'lib/sanity.queries'
import type { ProductDoc, FAQ } from 'types'
import ProductsOverlay from 'components/site/product/ProductsOverlay'
import FAQOverlay from 'components/site/product/FAQOverlay'
import ProductsPageClient from './page-client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'فروشگاه محصولات دیجیتال - SharifGPT',
  description: 'بهترین محصولات دیجیتال با قیمت‌های مناسب - هوش مصنوعی، سوشیال مدیا، موسیقی و بیشتر',
  openGraph: {
    title: 'فروشگاه محصولات دیجیتال - SharifGPT',
    description: 'بهترین محصولات دیجیتال با قیمت‌های مناسب',
    type: 'website',
    url: 'https://sharifgpt.com/products',
    siteName: 'SharifGPT',
    locale: 'fa_IR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'فروشگاه محصولات دیجیتال',
    description: 'بهترین محصولات دیجیتال با قیمت‌های مناسب',
  },
  alternates: {
    canonical: 'https://sharifgpt.com/products',
  },
  robots: {
    index: true,
    follow: true,
  },
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