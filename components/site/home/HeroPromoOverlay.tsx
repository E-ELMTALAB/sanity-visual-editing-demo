interface HeroPromoOverlayProps {
  slides: any[]
  promoCards: any[]
  discountedProducts: any[]
}

export default function HeroPromoOverlay({ slides, promoCards, discountedProducts }: HeroPromoOverlayProps) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0 }}>
      {slides?.map((s, i) => (
        <div
          key={`slide-${i}`}
          data-sanity-type="home"
          data-sanity-path={`heroSlides[${i}]`}
        >
          <span>{s?.title}</span>
          <span>{s?.subtitle}</span>
          <span>{s?.buttonText}</span>
        </div>
      ))}
      {promoCards?.map((p, i) => (
        <div
          key={`promo-${i}`}
          data-sanity-type="home"
          data-sanity-path={`promoCards[${i}]`}
        >
          <span>{p?.title}</span>
          <span>{p?.subtitle}</span>
          <span>{p?.buttonText}</span>
        </div>
      ))}
      {discountedProducts?.map((p, i) => (
        <div
          key={`discount-${i}`}
          data-sanity-type="home"
          data-sanity-path={`discountedProducts[${i}]`}
        >
          <span>{p?.title}</span>
          <span>{p?.description}</span>
          <span>{p?.buttonText}</span>
        </div>
      ))}
    </div>
  )
}


