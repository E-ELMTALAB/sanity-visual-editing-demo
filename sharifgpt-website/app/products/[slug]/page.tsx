import { draftMode } from 'next/headers'
import { getClient } from '../../../../lib/sanity.client'
import { readToken } from '../../../../lib/sanity.api'
import { productDocumentBySlugQuery, faqsByPageQuery, productBySlugQuery } from '../../../../lib/sanity.queries'
import { urlForImage } from '../../../../lib/sanity.image'
import ProductPageClient from './page-client'
import ProductOverlay from '../../../../components/site/product/ProductOverlay'
import type { Metadata } from 'next'

interface ProductPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const isDraft = draftMode().isEnabled
  const client = getClient(isDraft ? { token: readToken } : undefined)
  
  // Try to fetch from product documents first, then fall back to home arrays
  let productData = await client.fetch(productDocumentBySlugQuery, { slug: params.slug })
  
  if (!productData) {
    productData = await client.fetch(productBySlugQuery, { slug: params.slug })
  }

  return {
    title: `${productData?.name || 'محصول'} | SharifGPT`,
    description: productData?.description || 'محصول دیجیتال با کیفیت',
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const isDraft = draftMode().isEnabled
  const client = getClient(isDraft ? { token: readToken } : undefined)
  
  // Try to fetch from product documents first, then fall back to home arrays
  let productData = await client.fetch(productDocumentBySlugQuery, { slug: params.slug })
  
  if (!productData) {
    productData = await client.fetch(productBySlugQuery, { slug: params.slug })
  }
  
  // Fetch FAQs for products page
  const faqs = await client.fetch<any[]>(faqsByPageQuery, { pageLocation: 'products' })
  
  // Process images for related products
  const relatedProducts = (productData?.relatedProducts || []).map((prod: any) => ({
    ...prod,
    imageUrl: prod.image ? urlForImage(prod.image)?.url() : null,
  }))
  
  // Process product main image
  const productWithImages = {
    ...productData,
    imageUrl: productData?.image ? urlForImage(productData.image)?.url() : null,
    galleryImages: (productData?.gallery || []).map((img: any) => urlForImage(img)?.url()),
    relatedProducts,
  }
  
  return (
    <>
      <ProductOverlay product={productWithImages} faqs={faqs} relatedProducts={relatedProducts} />
      <ProductPageClient productData={productWithImages} faqsData={faqs} />
    </>
  )
}
