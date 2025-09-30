import { draftMode } from 'next/headers'
import { getClient } from 'lib/sanity.client'
import { readToken } from 'lib/sanity.api'
import { sharifHeroQuery } from 'lib/sanity.queries'
import HeroFromSanity from 'components/site/home/HeroFromSanity'
import { defaultHeroSlides } from 'lib/defaults/homeHero'
import SharifHome from '@/app/page'

export default async function RootPage() {
  const isDraft = draftMode().isEnabled
  const client = getClient(isDraft ? { token: readToken } : undefined)
  const data = await client.fetch<any | null>(sharifHeroQuery)
  const slides = data?.heroSlides?.length ? data.heroSlides : defaultHeroSlides
  return (
    <>
      <HeroFromSanity slides={slides} />
      <SharifHome />
    </>
  )
}


