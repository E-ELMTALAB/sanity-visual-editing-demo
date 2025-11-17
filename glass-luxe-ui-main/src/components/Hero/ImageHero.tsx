import React from "react";
import heroBg from "@/assets/hero-ai-cubes.png";

export default function ImageHero() {
  return (
    <section dir="rtl"
      className="relative min-h-[92vh] w-full overflow-hidden bg-transparent
                 [mask-image:linear-gradient(to_bottom,black_82%,transparent_100%)]
                 [-webkit-mask-image:linear-gradient(to_bottom,black_82%,transparent_100%)]">
      
      {/* Background image layer - left bias on mobile */}
      <img
        src={heroBg}
        alt=""
        className="absolute inset-0 h-full w-full object-cover
                   object-[20%_50%] md:object-[60%_50%]
                   [filter:brightness(.85)]
                   md:[filter:brightness(1.18)_saturate(1.08)_contrast(1.05)]
                   -z-10"
      />
      
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
              اکانت‌ها و اشتراک‌های مطمئن — سریع و تمیز
            </h1>
            <p className="mt-4 max-w-xl text-white/85 text-sm md:text-base lg:text-lg leading-relaxed">
              خرید امن با پشتیبانی ۲۴/۷ و تعویض حساب تضمینی برای سرویس‌های هوش مصنوعی، سوشیال مدیا و آموزشی.
            </p>

            <div className="mt-8">
              <a href="https://t.me/SharifGPT" target="_blank" rel="noopener"
                 className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-md text-white px-6 py-3 text-base font-semibold border border-white/30 hover:bg-white/30 hover:border-white/40 transition-all shadow-lg hover:shadow-2xl hover:scale-105 w-fit">
                عضویت در کانال تلگرام
              </a>
            </div>
          </div>
          
          {/* Empty left column for balance */}
          <div className="hidden lg:block" />
        </div>
      </div>
    </section>
  );
}
