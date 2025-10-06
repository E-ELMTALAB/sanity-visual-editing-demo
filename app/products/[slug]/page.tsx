import { draftMode } from 'next/headers'
import { getClient } from 'lib/sanity.client'
import { readToken } from 'lib/sanity.api'
import { productDocBySlugQuery, productDocPaths } from 'lib/sanity.queries'
import { urlForImage } from 'lib/sanity.image'
import ProductOverlay from 'components/site/product/ProductOverlay'
import ProductPageClient from '../../../sharifgpt-website/app/products/[slug]/page'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const isDraft = draftMode().isEnabled
  const client = getClient(isDraft ? { token: readToken } : undefined)
  const product = await client.fetch<any | null>(productDocBySlugQuery, { slug: params.slug })

  if (!product) {
    return {
      title: 'محصول یافت نشد',
      description: 'محصول مورد نظر یافت نشد',
    }
  }

  const seo = product.seo || {}
  const imageUrl = product.image ? urlForImage(product.image)?.url() : undefined
  const ogImageUrl = seo.openGraphImage ? urlForImage(seo.openGraphImage)?.url() : imageUrl

  return {
    title: seo.metaTitle || product.name || 'محصول',
    description: seo.metaDescription || product.description || '',
    openGraph: {
      title: seo.openGraphTitle || product.name || '',
      description: seo.openGraphDescription || product.description || '',
      images: ogImageUrl ? [{ url: ogImageUrl }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.openGraphTitle || product.name || '',
      description: seo.openGraphDescription || product.description || '',
      images: ogImageUrl ? [ogImageUrl] : [],
    },
    alternates: {
      canonical: seo.canonicalUrl || `https://sharifgpt.com/products/${params.slug}`,
    },
    robots: {
      index: seo.robotsMeta?.includes('noindex') ? false : true,
      follow: seo.robotsMeta?.includes('nofollow') ? false : true,
    },
  }
}

export default async function Page({ params }: { params: { slug: string } }) {
  const isDraft = draftMode().isEnabled
  const client = getClient(isDraft ? { token: readToken } : undefined)
  const product = await client.fetch<any | null>(productDocBySlugQuery, { slug: params.slug })

  const productForClient = product
    ? {
        _id: product._id,
        name: product.name || '',
        description: product.description || '',
        category: product.category || 'default',
        price: product.price || 0,
        originalPrice: product.originalPrice || 0,
        discountPercentage: product.discountPercentage || 0,
        imageUrl: product.image ? urlForImage(product.image)?.url() : null,
        galleryUrls: Array.isArray(product.gallery)
          ? product.gallery.map((img: any) => (img ? urlForImage(img)?.url() : null))
          : [],
        features: product.features || [],
        badges: product.badges || [],
        inStock: product.inStock !== false,
        rating: product.rating || 0,
        reviewCount: product.reviewCount || 0,
        options: product.options || [],
        relatedProducts: Array.isArray(product.relatedProducts) ? product.relatedProducts.map((related: any) => ({
          id: related._id,
          title: related.name,
          slug: related.slug,
          price: related.price,
          originalPrice: related.originalPrice,
          discountPercentage: related.discountPercentage,
          image: related.image ? urlForImage(related.image)?.url() : null,
          category: related.category,
          rating: related.rating,
          reviewCount: related.reviewCount
        })) : [],
        relatedBlogs: Array.isArray(product.relatedBlogs) ? product.relatedBlogs.map((blog: any) => ({
          id: blog._id,
          title: blog.title,
          slug: blog.slug,
          excerpt: blog.excerpt,
          coverImage: blog.coverImage ? urlForImage(blog.coverImage)?.url() : null,
          publishedAt: blog.publishedAt,
          tags: blog.tags || []
        })) : [],
        slug: product.slug,
      }
    : null

  if (!productForClient) {
    notFound()
  }

  return (
    <>
      <ProductOverlay product={product} />
      <ProductPageClient productData={productForClient} />
    </>
  )
}

export async function generateStaticParams() {
  const client = getClient()
  const slugs: string[] = await client.fetch(productDocPaths)
  return slugs.map((slug) => ({ slug }))
}
