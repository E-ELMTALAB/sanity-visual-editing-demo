import { draftMode } from 'next/headers'
import { getClient } from 'lib/sanity.client'
import { readToken } from 'lib/sanity.api'
import { sharifHeroQuery } from 'lib/sanity.queries'
import { urlForImage } from 'lib/sanity.image'
import SharifHome from '@/app/page'
import HeroPromoOverlay from 'components/site/home/HeroPromoOverlay'

export default async function RootPage() {
  const isDraft = draftMode().isEnabled
  const client = getClient(isDraft ? { token: readToken } : undefined)
  const data = await client.fetch<any | null>(sharifHeroQuery)
  
  // Convert Sanity image objects to URLs
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
  
  return (
    <>
      <HeroPromoOverlay slides={heroSlides} promoCards={promoCards} discountedProducts={discountedProducts} socialMediaProducts={socialMediaProducts} educationalProducts={educationalProducts} bestsellingCourses={bestsellingCourses} />
      <SharifHome heroData={{ heroSlides, promoCards, discountedProducts, socialMediaProducts, educationalProducts, bestsellingCourses }} />
    </>
  )
}


