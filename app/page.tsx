import { draftMode } from 'next/headers'
import { getClient } from 'lib/sanity.client'
import { readToken } from 'lib/sanity.api'
import { sharifHeroQuery } from 'lib/sanity.queries'
import SharifHome from '@/app/page'
import HeroPromoOverlay from 'components/site/home/HeroPromoOverlay'

export default async function RootPage() {
  const isDraft = draftMode().isEnabled
  const client = getClient(isDraft ? { token: readToken } : undefined)
  const data = await client.fetch<any | null>(sharifHeroQuery)
  const heroSlides = data?.heroSlides || []
  const promoCards = data?.promoCards || []
  const discountedProducts = data?.discountedProducts || []
  const socialMediaProducts = data?.socialMediaProducts || []
  const educationalProducts = data?.educationalProducts || []
  const bestsellingCourses = data?.bestsellingCourses || []
  return (
    <>
      <HeroPromoOverlay slides={heroSlides} promoCards={promoCards} discountedProducts={discountedProducts} socialMediaProducts={socialMediaProducts} educationalProducts={educationalProducts} bestsellingCourses={bestsellingCourses} />
      <SharifHome heroData={{ heroSlides, promoCards, discountedProducts, socialMediaProducts, educationalProducts, bestsellingCourses }} />
    </>
  )
}


