import { draftMode } from 'next/headers'
import { getClient } from 'lib/sanity.client'
import { readToken } from 'lib/sanity.api'
import { sharifHeroQuery } from 'lib/sanity.queries'
import { defaultHeroSlides, defaultPromoCards } from 'lib/defaults/homeHero'
import SharifHome from '@/app/page'
import { SanityHeroProvider } from 'components/site/home/SanityHeroContext'

export default async function RootPage() {
  const isDraft = draftMode().isEnabled
  const client = getClient(isDraft ? { token: readToken } : undefined)
  const data = await client.fetch<any | null>(sharifHeroQuery)
  const slides = data?.heroSlides?.length ? data.heroSlides : defaultHeroSlides
  const promoCards = data?.promoCards?.length ? data.promoCards : defaultPromoCards
  return (
    <SanityHeroProvider slides={slides}>
      <SharifHome />
    </SanityHeroProvider>
  )
}


