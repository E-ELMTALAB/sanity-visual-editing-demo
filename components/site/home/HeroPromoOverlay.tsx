interface HeroPromoOverlayProps {
  slides: any[]
  promoCards: any[]
}

export default function HeroPromoOverlay({ slides, promoCards }: HeroPromoOverlayProps) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0 }}>
      {slides?.map((s, i) => (
        <div key={`slide-${i}`}
          data-sanity-id={s?._id || s?._key}
          data-sanity-type="heroSlide"
          data-sanity-index={i}
        >
          <span>{s?.title}</span>
          <span>{s?.subtitle}</span>
          <span>{s?.buttonText}</span>
        </div>
      ))}
      {promoCards?.map((p, i) => (
        <div key={`promo-${i}`}
          data-sanity-id={p?._id || p?._key}
          data-sanity-type="promoCard"
          data-sanity-index={i}
        >
          <span>{p?.title}</span>
          <span>{p?.subtitle}</span>
          <span>{p?.buttonText}</span>
        </div>
      ))}
    </div>
  )
}


