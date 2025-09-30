interface HeroPromoOverlayProps {
  slides: any[]
  promoCards: any[]
}

export default function HeroPromoOverlay({ slides, promoCards }: HeroPromoOverlayProps) {
  return (
    <div className="sr-only">
      {slides?.map((s, i) => (
        <div key={`slide-${i}`}>
          <span>{s?.title}</span>
          <span>{s?.subtitle}</span>
          <span>{s?.buttonText}</span>
        </div>
      ))}
      {promoCards?.map((p, i) => (
        <div key={`promo-${i}`}>
          <span>{p?.title}</span>
          <span>{p?.subtitle}</span>
          <span>{p?.buttonText}</span>
        </div>
      ))}
    </div>
  )
}


