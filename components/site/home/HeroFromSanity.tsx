"use client"
import Link from 'next/link'
import { type HeroSlide } from 'types'

export default function HeroFromSanity({ slides }: { slides: HeroSlide[] }) {
  const items = (slides || []).map((s) => ({
    title: s.title || '',
    subtitle: s.subtitle || '',
    imageUrl: (s as any)?.imageUrl, // URL already generated server-side
    buttonText: s.buttonText,
    buttonHref: s.buttonHref,
  }))
  // Render a minimal independent slider equivalent; the parent page owns layout/styling
  return (
    <div className="w-full">
      {items.map((it, idx) => (
        <div key={idx} className="hidden first:block">
          <div className="relative group overflow-hidden rounded-2xl shadow-lg w-full h-full">
            {it.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={it.imageUrl} alt={it.title} className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4 md:p-6 text-white w-full">
              <h3 className="text-xl md:text-2xl font-bold drop-shadow-lg">{it.title}</h3>
              <p className="text-sm md:text-base mt-1 opacity-90 drop-shadow-md">{it.subtitle}</p>
              {it.buttonText && (
                <Link href={it.buttonHref || '#'} className="inline-block mt-3 text-xs py-2 px-4 bg-sky-500 text-white font-bold rounded-full shadow-md hover:bg-sky-600">
                  {it.buttonText}
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}


