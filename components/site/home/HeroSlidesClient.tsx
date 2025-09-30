"use client"
import { IndependentSlider } from '@/components/site/home/IndependentSlider'

interface SlideItem {
  _key?: string
  title?: string
  subtitle?: string
  buttonText?: string
  buttonHref?: string
  image?: { asset?: { url?: string } }
}

export default function HeroSlidesClient({ slides }: { slides: SlideItem[] }) {
  if (!slides?.length) return null
  const items = slides.map((s) => ({
    id: s._key ?? s.title,
    title: s.title,
    subtitle: s.subtitle,
    buttonText: s.buttonText,
    buttonHref: s.buttonHref,
    imageUrl: s.image?.asset?.url,
  }))
  return <IndependentSlider className="w-full" items={items} />
}

