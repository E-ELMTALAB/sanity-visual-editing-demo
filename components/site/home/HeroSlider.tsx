"use client"
import { useCallback, useEffect, useState } from 'react'
import ImageBox from 'components/shared/ImageBox'

interface Slide {
  title?: string
  subtitle?: string
  buttonText?: string
  link?: string
  image?: { asset?: any }
}

export default function HeroSlider({ slides }: { slides: Slide[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const goPrev = useCallback(() => setCurrentIndex((i) => (i === 0 ? slides.length - 1 : i - 1)), [slides.length])
  const goNext = useCallback(() => setCurrentIndex((i) => (i === slides.length - 1 ? 0 : i + 1)), [slides.length])

  useEffect(() => {
    const t = setInterval(goNext, 5000)
    return () => clearInterval(t)
  }, [goNext])

  if (!slides || slides.length === 0) return null
  const current = slides[currentIndex]

  return (
    <div className="relative group overflow-hidden rounded-2xl border">
      <div className="relative aspect-[16/9] w-full">
        <ImageBox image={current.image as any} alt={current.title || 'slide'} classesWrapper="relative aspect-[16/9]" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 p-4 md:p-6 text-white w-full">
        <h3 className="text-xl md:text-2xl font-bold drop-shadow-lg">{current.title}</h3>
        <p className="text-sm md:text-base mt-1 opacity-90 drop-shadow-md">{current.subtitle}</p>
        {current.buttonText && (
          <a href={current.link || '#'} className="mt-3 inline-block text-xs py-2 px-4 bg-sky-500 text-white font-bold rounded-full shadow-md hover:bg-sky-600">
            {current.buttonText}
          </a>
        )}
      </div>
      <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button onClick={goPrev} className="bg-black/30 text-white p-2 rounded-full hover:bg-black/50">‹</button>
        <button onClick={goNext} className="bg-black/30 text-white p-2 rounded-full hover:bg-black/50">›</button>
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <div key={i} onClick={() => setCurrentIndex(i)} className={`w-2 h-2 rounded-full ${i === currentIndex ? 'bg-white' : 'bg-white/50'}`} />
        ))}
      </div>
    </div>
  )
}


