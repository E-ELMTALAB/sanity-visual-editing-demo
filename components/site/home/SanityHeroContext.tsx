"use client"
import { createContext, useContext } from 'react'
import type { HeroSlide, PromoCard } from 'types'

type Ctx = { slides: HeroSlide[]; promoCards: PromoCard[] }

const SanityHeroContext = createContext<Ctx | null>(null)

export function SanityHeroProvider({
  slides,
  promoCards,
  children,
}: {
  slides: HeroSlide[]
  promoCards: PromoCard[]
  children: React.ReactNode
}) {
  return (
    <SanityHeroContext.Provider value={{ slides, promoCards }}>
      {children}
    </SanityHeroContext.Provider>
  )
}

export function useSanityHero() {
  return useContext(SanityHeroContext)
}


