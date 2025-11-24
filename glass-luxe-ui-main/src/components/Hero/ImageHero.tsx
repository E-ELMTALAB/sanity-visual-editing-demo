import React from "react";
import { Helmet } from "react-helmet-async";
import heroBg from "@/assets/hero-ai-cubes.png";

interface HeroSlide {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonHref?: string;
  image?: string;
  imageSrcSet?: string;
}

interface ImageHeroProps {
  slide?: HeroSlide;
}

export default function ImageHero({ slide }: ImageHeroProps) {
  // Use Sanity data if available, otherwise use fallback
  const title = slide?.title || "اکانت‌ها و اشتراک‌های مطمئن — سریع و تمیز";
  const subtitle = slide?.subtitle || "خرید امن با پشتیبانی ۲۴/۷ و تعویض حساب تضمینی برای سرویس‌های هوش مصنوعی، سوشیال مدیا و آموزشی.";
  const buttonText = slide?.buttonText || "عضویت در کانال تلگرام";
  const buttonHref = slide?.buttonHref || "https://t.me/SharifGPT";
  const backgroundImage = slide?.image || heroBg;
  const backgroundSrcSet = slide?.imageSrcSet;
  const heroSizes = "(max-width: 1024px) 100vw, 1200px";

  // Extract the largest image from srcSet for preload, or use the main image
  // When using srcSet, preload the largest image (last in the list)
  const preloadImage = backgroundSrcSet
    ? backgroundSrcSet.split(', ').pop()?.split(' ')[0] || backgroundImage
    : backgroundImage

  // Debug: Log image info in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[ImageHero] Image data:', {
      hasImage: !!slide?.image,
      imageUrl: backgroundImage,
      hasSrcSet: !!backgroundSrcSet,
      preloadImage
    })
  }

  return (
    <>
      <Helmet>
        {/* Only preload if we have a valid image URL */}
        {preloadImage && (
          <link
            rel="preload"
            as="image"
            href={preloadImage}
            fetchPriority="high"
          />
        )}
        {/* Preconnect to Sanity CDN for faster image loading */}
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
      </Helmet>
      <section dir="rtl"
      className="relative min-h-[92vh] w-full overflow-hidden bg-transparent
                 [mask-image:linear-gradient(to_bottom,black_82%,transparent_100%)]
                 [-webkit-mask-image:linear-gradient(to_bottom,black_82%,transparent_100%)]">
      
      {/* Background image layer - Use picture element for better format support */}
      <picture className="absolute inset-0 h-full w-full -z-10">
        {/* WebP source - Sanity already provides WebP via query params, so use srcSet directly */}
        {backgroundSrcSet && (
          <source
            srcSet={backgroundSrcSet}
            type="image/webp"
            sizes={heroSizes}
          />
        )}
      <img
        src={backgroundImage}
        srcSet={backgroundSrcSet}
        sizes={backgroundSrcSet ? heroSizes : undefined}
        alt={title || "Hero background"}
        loading="eager"
        decoding="async"
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover
                   object-[20%_50%] md:object-[60%_50%]
                   [filter:brightness(.85)]
                     md:[filter:brightness(1.18)_saturate(1.08)_contrast(1.05)]"
        onError={(e) => {
          console.error('[ImageHero] Failed to load image:', backgroundImage)
          // Fallback to default hero image if Sanity image fails
          if (backgroundImage !== heroBg) {
            e.currentTarget.src = heroBg
          }
        }}
      />
      </picture>
      
      {/* Brand tint overlay - matches site's blue-purple palette */}
      <div className="absolute inset-0 -z-10 mix-blend-soft-light
                      opacity-85 md:opacity-60
                      bg-gradient-to-br from-[#1E67C6]/60 via-transparent to-[#8B5CF6]/60" />
      
      {/* Readability vignette */}
      <div className="absolute inset-0 -z-10"
           style={{ background: "radial-gradient(120% 80% at 85% 50%, rgba(0,0,0,.18) 0%, rgba(0,0,0,.55) 60%, rgba(0,0,0,.70) 100%)" }} />

      <div className="relative z-10 mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* 2-col on desktop: text on the right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 min-h-[70vh]">
          {/* Text content - first in RTL means it appears on the right */}
          <div className="text-white text-center lg:text-right flex flex-col justify-center items-center lg:items-start">
            <span className="inline-block rounded-full bg-white/10 backdrop-blur-sm px-3 py-1 text-xs md:text-sm w-fit border border-white/20">
              برند شریف‌GPT
            </span>
            <h1 className="mt-4 text-5xl sm:text-5xl md:text-6xl font-black leading-tight drop-shadow-[0_0_25px_rgba(255,255,255,0.5)] lg:drop-shadow-none">
              {title}
            </h1>
            <p className="mt-4 max-w-xl text-white/85 text-sm md:text-base lg:text-lg leading-relaxed">
              {subtitle}
            </p>

            <div className="mt-8">
              <a href={buttonHref} target="_blank" rel="noopener"
                 className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-md text-white px-6 py-3 text-base font-semibold border border-white/30 hover:bg-white/30 hover:border-white/40 transition-all shadow-lg hover:shadow-2xl hover:scale-105 w-fit">
                {buttonText}
              </a>
            </div>
          </div>
          
          {/* Empty left column for balance */}
          <div className="hidden lg:block" />
        </div>
      </div>
      </section>
    </>
  );
}
