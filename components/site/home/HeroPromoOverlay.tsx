interface HeroPromoOverlayProps {
  slides: any[]
  promoCards: any[]
  discountedProducts: any[]
  socialMediaProducts: any[]
  educationalProducts: any[]
  bestsellingCourses: any[]
}

export default function HeroPromoOverlay({ slides, promoCards, discountedProducts, socialMediaProducts, educationalProducts, bestsellingCourses }: HeroPromoOverlayProps) {
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
          <span>{dp?.slug}</span>
        </div>
      ))}
      {socialMediaProducts?.map((smp, i) => (
        <div
          key={`social-${i}`}
          data-sanity-id={smp?._id || `socialMediaProducts-${smp?._key}`}
          data-sanity-type="home.socialMediaProducts"
          data-sanity-index={i}
        >
          <span>{smp?.name}</span>
          <span>{smp?.description}</span>
          <span>{smp?.price}</span>
          <span>{smp?.originalPrice}</span>
        </div>
      ))}
      {educationalProducts?.map((edp, i) => (
        <div
          key={`edu-${i}`}
          data-sanity-id={edp?._id || `educationalProducts-${edp?._key}`}
          data-sanity-type="home.educationalProducts"
          data-sanity-index={i}
        >
          <span>{edp?.name}</span>
          <span>{edp?.description}</span>
          <span>{edp?.price}</span>
          <span>{edp?.originalPrice}</span>
        </div>
      ))}
      {bestsellingCourses?.map((course, i) => (
        <div
          key={`course-${i}`}
          data-sanity-id={course?._id || `bestsellingCourses-${course?._key}`}
          data-sanity-type="home.bestsellingCourses"
          data-sanity-index={i}
        >
          <span>{course?.title}</span>
          <span>{course?.description}</span>
          <span>{course?.instructor}</span>
          <span>{course?.price}</span>
          <span>{course?.originalPrice}</span>
          <span>{course?.duration}</span>
          <span>{course?.rating}</span>
        </div>
      ))}
    </div>
  )
}


