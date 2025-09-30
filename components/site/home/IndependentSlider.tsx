"use client"
import { useCallback, useEffect, useState } from 'react'

export interface IndependentSliderItem {
  id?: string | number
  title?: string
  subtitle?: string
  imageUrl?: string
  buttonText?: string
  buttonHref?: string
}

export function IndependentSlider({
  className,
  items = [],
  autoplayInterval = 5000,
}: {
  className?: string
  items?: IndependentSliderItem[]
  autoplayInterval?: number
}) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = useCallback(() => {
    const isFirst = currentIndex === 0
    setCurrentIndex(isFirst ? items.length - 1 : currentIndex - 1)
  }, [currentIndex, items.length])

  const goToNext = useCallback(() => {
    const isLast = currentIndex === items.length - 1
    setCurrentIndex(isLast ? 0 : currentIndex + 1)
  }, [currentIndex, items.length])

  useEffect(() => {
    if (!autoplayInterval) return
    const timer = setInterval(goToNext, autoplayInterval)
    return () => clearInterval(timer)
  }, [goToNext, autoplayInterval])

  if (!items?.length) return null

  const current = items[currentIndex]

  return (
    <div className={`relative group overflow-hidden rounded-2xl shadow-lg w-full h-full ${className ?? ''}`}>
      {/* Background image */}
      {current?.imageUrl && (
        <img
          src={current.imageUrl}
          alt={current?.title ?? ''}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-4 md:p-6 text-white w-full">
        <h3 className="text-xl md:text-2xl font-bold drop-shadow-lg">{current?.title}</h3>
        <p className="text-sm md:text-base mt-1 opacity-90 drop-shadow-md">{current?.subtitle}</p>
        {current?.buttonText && (
          <a
            href={current?.buttonHref || '#'}
            className="inline-flex mt-3 text-xs py-2 px-4 bg-sky-500 text-white font-bold rounded-full shadow-md hover:bg-sky-600 transition-all duration-300 transform hover:scale-105"
          >
            {current.buttonText}
          </a>
        )}
      </div>
      <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={goToPrevious}
          className="bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors duration-300"
        >
          ‹
        </button>
        <button
          onClick={goToNext}
          className="bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors duration-300"
        >
          ›
        </button>
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center items-center space-x-2">
        {items.map((_, idx) => (
          <div
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-500 ${
              currentIndex === idx ? 'bg-white scale-125' : 'bg-white/50'
            }`}
          ></div>
        ))}
      </div>
    </div>
  )
}


