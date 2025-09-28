"use client"
import ImageBox from 'components/shared/ImageBox'

interface Card {
  title?: string
  subtitle?: string
  link?: string
  image?: { asset?: any }
}

export default function PromoCard({ card }: { card: Card }) {
  if (!card) return null
  return (
    <a href={card.link || '#'} className="relative block overflow-hidden rounded-2xl border">
      <div className="relative aspect-[4/5] w-full">
        <ImageBox image={card.image as any} alt={card.title || 'promo'} classesWrapper="relative aspect-[4/5]" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 p-4 md:p-6 text-white w-full">
        <h3 className="text-lg md:text-xl font-bold drop-shadow-lg">{card.title}</h3>
        <p className="text-xs md:text-sm mt-1 opacity-90 drop-shadow-md">{card.subtitle}</p>
      </div>
    </a>
  )
}


