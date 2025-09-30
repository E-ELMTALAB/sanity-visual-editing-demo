"use client"
import { createContext, useContext } from 'react'
import type { HeroSlide } from 'types'

type Ctx = { slides: HeroSlide[] }

const SanityHeroContext = createContext<Ctx | null>(null)

export function SanityHeroProvider({ slides, children }: { slides: HeroSlide[]; children: React.ReactNode }) {
  return <SanityHeroContext.Provider value={{ slides }}>{children}</SanityHeroContext.Provider>
}

export function useSanityHero() {
  return useContext(SanityHeroContext)
}


