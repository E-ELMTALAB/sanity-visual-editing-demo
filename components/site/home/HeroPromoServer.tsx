import { draftMode } from 'next/headers'
import { getClient } from 'lib/sanity.client'
import { readToken } from 'lib/sanity.api'
import { sharifHeroQuery } from 'lib/sanity.queries'

export default async function HeroPromoServer() {
  const isDraft = draftMode().isEnabled
  const client = getClient(isDraft ? { token: readToken } : undefined)
  const data = await client.fetch<any | null>(sharifHeroQuery)
  const slides = data?.heroSlides || []
  const promos = data?.promoCards || []
  // Render minimal DOM with stega-carrying text near top for overlays
  return (
    <div className="sr-only" data-testid="sanity-overlays-anchor">
      {/* Put plain text nodes so overlays have stable anchors */}
      {slides.map((s: any, i: number) => (
        <div key={i}>
          <span>{s?.title}</span>
          <span>{s?.subtitle}</span>
          <span>{s?.buttonText}</span>
        </div>
      ))}
      {promos.map((p: any, i: number) => (
        <div key={i}>
          <span>{p?.title}</span>
          <span>{p?.subtitle}</span>
          <span>{p?.buttonText}</span>
        </div>
      ))}
    </div>
  )
}


