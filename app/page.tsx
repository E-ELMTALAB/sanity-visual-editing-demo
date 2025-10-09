import { draftMode } from 'next/headers'
import { getClient } from 'lib/sanity.client'
import { readToken } from 'lib/sanity.api'
import { sharifHeroQuery } from 'lib/sanity.queries'
import { urlForImage } from 'lib/sanity.image'
import SharifHome from '@/app/page'
import HeroPromoOverlay from 'components/site/home/HeroPromoOverlay'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const isDraft = draftMode().isEnabled
  const client = getClient(isDraft ? { token: readToken } : undefined)
  const data = await client.fetch<any | null>(sharifHeroQuery)

  const seo = data?.seo || {}
  const ogImageUrl = seo.openGraphImage ? urlForImage(seo.openGraphImage)?.url() : undefined

  return {
    title: seo.metaTitle || 'SharifGPT - خدمات هوش مصنوعی و آموزش',
    description: seo.metaDescription || 'بهترین خدمات هوش مصنوعی، دوره‌های آموزشی و محصولات دیجیتال',
    openGraph: {
      title: seo.openGraphTitle || seo.metaTitle || 'SharifGPT',
      description: seo.openGraphDescription || seo.metaDescription || 'بهترین خدمات هوش مصنوعی',
      images: ogImageUrl ? [{ url: ogImageUrl }] : [],
      type: 'website',
      url: 'https://sharifgpt.com',
      siteName: 'SharifGPT',
      locale: 'fa_IR',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.openGraphTitle || seo.metaTitle || 'SharifGPT',
      description: seo.openGraphDescription || seo.metaDescription || 'بهترین خدمات هوش مصنوعی',
      images: ogImageUrl ? [ogImageUrl] : [],
    },
    alternates: {
      canonical: seo.canonicalUrl || 'https://sharifgpt.com',
    },
    robots: {
      index: seo.robotsMeta?.includes('noindex') ? false : true,
      follow: seo.robotsMeta?.includes('nofollow') ? false : true,
    },
  }
}

export default async function RootPage() {
  const isDraft = draftMode().isEnabled
  const client = getClient(isDraft ? { token: readToken } : undefined)
  const data = await client.fetch<any | null>(sharifHeroQuery)
  
  // Convert Sanity image objects to URLs
  const topBannerSlides = (data?.topBannerSlides || []).map((slide: any) => ({
    ...slide,
    imageUrl: slide.image ? urlForImage(slide.image)?.url() : null,
  }))
  
  const heroSlides = (data?.heroSlides || []).map((slide: any) => ({
    ...slide,
    imageUrl: slide.image ? urlForImage(slide.image)?.url() : null,
  }))
  
  const promoCards = (data?.promoCards || []).map((card: any) => ({
    ...card,
    imageUrl: card.image ? urlForImage(card.image)?.url() : null,
  }))
  
  const discountedProducts = (data?.discountedProducts || []).map((product: any) => ({
    ...product,
    imageUrl: product.image ? urlForImage(product.image)?.url() : null,
  }))
  
  const socialMediaProducts = (data?.socialMediaProducts || []).map((product: any) => ({
    ...product,
    imageUrl: product.image ? urlForImage(product.image)?.url() : null,
  }))
  
  const educationalProducts = (data?.educationalProducts || []).map((product: any) => ({
    ...product,
    imageUrl: product.image ? urlForImage(product.image)?.url() : null,
  }))
  
  const bestsellingCourses = (data?.bestsellingCourses || []).map((course: any) => ({
    ...course,
    imageUrl: course.image ? urlForImage(course.image)?.url() : null,
  }))
  
  const magazinePosts = (data?.magazinePosts || []).map((post: any) => ({
    ...post,
    coverImageUrl: post.coverImage ? urlForImage(post.coverImage)?.url() : null,
  }))
  
  return (
    <>
      <HeroPromoOverlay topBannerSlides={topBannerSlides} heroSlides={heroSlides} promoCards={promoCards} discountedProducts={discountedProducts} socialMediaProducts={socialMediaProducts} educationalProducts={educationalProducts} bestsellingCourses={bestsellingCourses} magazinePosts={magazinePosts} />
      <SharifHome heroData={{ topBannerSlides, heroSlides, promoCards, discountedProducts, socialMediaProducts, educationalProducts, bestsellingCourses, magazinePosts }} />
    </>
  )
}


