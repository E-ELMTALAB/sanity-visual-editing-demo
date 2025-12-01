type SocialPlatform = "telegram" | "instagram" | "x";

type Testimonial = {
  name: string;
  handle: string;
  quote: string;
  socials: SocialPlatform[];
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: "@mahdi_ai",
    handle: "کاربر قدیمی از ۱۴۰۱",
    quote: "«سریع‌ترین تحویل اکانتی که تا حالا تجربه کردم؛ کمتر از دو دقیقه.»",
    socials: ["telegram", "instagram"],
  },
  {
    name: "@sahar.codes",
    handle: "برنامه‌نویس فرانت‌اند",
    quote: "«پشتیبانی‌شون واقعاً ۲۴ ساعته‌ست؛ نصف شب اکانتم مشکل داشت، همون موقع عوضش کردن.»",
    socials: ["telegram", "x"],
  },
  {
    name: "@startup_team",
    handle: "تیم استارتاپی ۸ نفره",
    quote: "«برای تیم‌مون چندین اکانت گرفتیم؛ بدون VPN و بدون دردسر وصل می‌شن.»",
    socials: ["telegram"],
  },
] as const;

const SOCIAL_ICON: Record<
  SocialPlatform,
  {
    className: string;
    icon: JSX.Element;
  }
> = {
  telegram: {
    className: "bg-gradient-to-br from-sky-400 to-sky-600",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5" fill="currentColor">
        <path d="M9.78 13.83 9.6 17.2a.8.8 0 0 0 1.3.62l1.74-1.44 3.6 2.64c.74.54 1.8.14 2.02-.77l2.74-11.04c.24-.97-.72-1.78-1.62-1.38L3.5 9.89a.84.84 0 0 0 .03 1.55l4.06 1.48 9.4-5.67-7.2 6.58a.8.8 0 0 0-.01 1.2Z" />
      </svg>
    ),
  },
  instagram: {
    className: "bg-gradient-to-br from-orange-400 via-pink-500 to-fuchsia-500",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5" fill="currentColor">
        <path d="M7 3C4.24 3 2 5.24 2 8v8c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V8c0-2.76-2.24-5-5-5H7Zm0 2h10c1.66 0 3 1.34 3 3v8c0 1.66-1.34 3-3 3H7c-1.66 0-3-1.34-3-3V8c0-1.66 1.34-3 3-3Zm9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm-5 1.5A4.5 4.5 0 1 0 15.5 14 4.5 4.5 0 0 0 11 7.5Zm0 2A2.5 2.5 0 1 1 8.5 12 2.5 2.5 0 0 1 11 9.5Z" />
      </svg>
    ),
  },
  x: {
    className: "bg-gradient-to-br from-slate-900 to-black",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5" fill="currentColor">
        <path d="M4.5 3h4.2l3.18 4.38L15.9 3h3.6l-5.52 6.24L20.25 21H16.1l-3.54-5.58L8.4 21H4.8l6.06-6.86L4.5 3Zm2.4 1.8 9.18 13.38h1.32L8.28 4.8H6.9Z" />
      </svg>
    ),
  },
};

export default function TestimonialsRow() {
  return (
    <section dir="rtl" className="mt-6 mb-6 w-full px-4 sm:px-0">
      <div className="mx-auto flex max-w-[980px] justify-end">
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {TESTIMONIALS.map((testimonial) => (
            <article
              key={testimonial.name}
              className="relative flex min-w-[260px] max-w-[320px] snap-start flex-col gap-2.5 rounded-3xl border border-slate-500/70 bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-slate-950/95 px-4 py-3 text-right text-white shadow-[0_22px_48px_rgba(15,23,42,0.95)] backdrop-blur-xl backdrop-saturate-150 before:absolute before:inset-0 before:-z-10 before:rounded-3xl before:bg-gradient-to-br before:from-sky-500/25 before:to-transparent"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 shadow-[0_14px_32px_rgba(15,23,42,0.95)]" />
                <div className="flex flex-col gap-0.5 text-xs">
                  <span className="font-medium text-slate-50">{testimonial.name}</span>
                  <span className="text-[11px] text-slate-400">{testimonial.handle}</span>
                </div>
              </div>
              <p className="text-[12px] leading-relaxed text-slate-200">{testimonial.quote}</p>
              <div className="mt-1 flex items-center gap-2">
                {testimonial.socials.map((platform) => {
                  const { className, icon } = SOCIAL_ICON[platform];
                  return (
                    <span
                      key={`${testimonial.name}-${platform}`}
                      className={`flex h-7 w-7 items-center justify-center rounded-full border border-slate-400/70 text-slate-50 shadow-[0_8px_18px_rgba(15,23,42,0.9)] ${className}`}
                    >
                      {icon}
                    </span>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

