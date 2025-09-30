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
          data-sanity-id={s?._id || `heroSlides-${s?._key}`}
          data-sanity-type="home.heroSlides"
          data-sanity-index={i}
        >
          <span>{s?.title}</span>
          <span>{s?.subtitle}</span>
          <span>{s?.buttonText}</span>
        </div>
      ))}
      {promoCards?.map((p, i) => (
        <div
          key={`promo-${i}`}
          data-sanity-id={p?._id || `promoCards-${p?._key}`}
          data-sanity-type="home.promoCards"
          data-sanity-index={i}
        >
          <span>{p?.title}</span>
          <span>{p?.subtitle}</span>
          <span>{p?.buttonText}</span>
        </div>
      ))}
      {discountedProducts?.map((dp, i) => (
        <div
          key={`discounted-${i}`}
          data-sanity-id={dp?._id || `discountedProducts-${dp?._key}`}
          data-sanity-type="home.discountedProducts"
          data-sanity-index={i}
        >
          <span>{dp?.name}</span>
          <span>{dp?.description}</span>
          <span>{dp?.originalPrice}</span>
          <span>{dp?.discountedPrice}</span>
        </div>
      ))}
    </div>
  )
}


