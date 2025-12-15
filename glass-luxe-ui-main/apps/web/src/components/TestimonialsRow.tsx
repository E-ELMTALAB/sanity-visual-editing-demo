type SocialPlatform = "telegram" | "instagram" | "x";

type Testimonial = {
  name: string;
  subtitle: string;
  quote: string;
  socials: SocialPlatform[];
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: "@mahdi_ai",
    subtitle: "کاربر قدیمی از ۱۴۰۱",
    quote: "از وقتی اکانت‌هام رو از شریف‌جی‌پی‌تی می‌گیرم، حتی یک لحظه قطعی نداشتم.",
    socials: ["telegram", "instagram"],
  },
  {
    name: "@sahar.codes",
    subtitle: "برنامه‌نویس فرانت‌اند",
    quote: "پشتیبانی ۲۴/۷شون واقعاً حرفه‌ایه؛ هر سوالی داشتم توی چند دقیقه جواب دادن.",
    socials: ["instagram", "x"],
  },
  {
    name: "@startup_team",
    subtitle: "تیم استارتاپی ۸ نفره",
    quote: "برای کل تیم پلن گرفتیم؛ هزینه‌ها مدیریت شد و دسترسی پایدار موند.",
    socials: ["telegram", "x"],
  },
];

const SOCIAL_STYLE: Record<
  SocialPlatform,
  { gradient: string; icon: JSX.Element; label: string }
> = {
  telegram: {
    gradient: "bg-gradient-to-br from-sky-400 to-sky-500 text-white",
    label: "تلگرام",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5">
        <path
          fill="currentColor"
          d="M20.43 3.55 2.69 10.43c-1.19.48-1.18 2.14.02 2.6l4.6 1.79 1.8 6.02a1.32 1.32 0 0 0 2.07.7l2.68-2.06 4.6 3.36c.98.72 2.37.18 2.63-1l3.07-14.1c.28-1.28-.96-2.35-2.33-1.98Z"
        />
      </svg>
    ),
  },
  instagram: {
    gradient: "bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 text-white",
    label: "اینستاگرام",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5">
        <path
          fill="currentColor"
          d="M12 7.3A4.7 4.7 0 1 0 16.7 12 4.7 4.7 0 0 0 12 7.3Zm0 7.7A3 3 0 1 1 15 12a3 3 0 0 1-3 3Zm5-7.9a1.1 1.1 0 1 0-1.1-1.1 1.1 1.1 0 0 0 1.1 1.1ZM12 3.4c-2.5 0-2.8 0-3.8.05a6.6 6.6 0 0 0-2.2.42 4.7 4.7 0 0 0-2.7 2.7 6.6 6.6 0 0 0-.42 2.2C2.8 9.7 2.8 10 2.8 12s0 2.3.06 3.2a6.6 6.6 0 0 0 .42 2.2 4.7 4.7 0 0 0 2.7 2.7 6.6 6.6 0 0 0 2.2.42c.9.05 1.3.05 3.8.05s2.9 0 3.8-.05a6.6 6.6 0 0 0 2.2-.42 4.7 4.7 0 0 0 2.7-2.7 6.6 6.6 0 0 0 .42-2.2c.05-.9.05-1.3.05-3.8s0-2.9-.05-3.8a6.6 6.6 0 0 0-.42-2.2 4.7 4.7 0 0 0-2.7-2.7 6.6 6.6 0 0 0-2.2-.42C14.9 3.4 14.5 3.4 12 3.4Z"
        />
      </svg>
    ),
  },
  x: {
    gradient: "bg-gradient-to-br from-slate-900 to-black text-white",
    label: "ایکس",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5">
        <path
          fill="currentColor"
          d="M20.3 3h-3.2l-4 4.7L11 5H3l6.8 9.1L3.5 21h3.2l4.4-4.9 2.4 3.2H21l-7-9.3L20.3 3Zm-11 2.2 9.4 12.6H15L5.5 5.2h3.8Z"
        />
      </svg>
    ),
  },
};

export default function TestimonialsRow() {
  return (
    <section dir="rtl" className="w-full max-w-6xl mx-auto mt-8 mb-16 px-5 sm:mb-20 sm:px-0">
      <div className="flex flex-wrap justify-center gap-5">
        {TESTIMONIALS.map((testimonial) => (
          <article
            key={testimonial.name}
            className="flex-1 min-w-[300px] max-w-md rounded-3xl border border-slate-500/60 bg-slate-900/80 px-6 py-5 shadow-2xl backdrop-blur-2xl transition-all duration-300"
            style={{
              backgroundImage:
                "radial-gradient(circle at 85% 10%, rgba(14,165,233,0.35), transparent 60%)",
            }}
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 shadow-xl shadow-indigo-500/40" />
              <div className="flex flex-col text-sm leading-tight">
                <span className="text-base font-bold text-slate-50">{testimonial.name}</span>
                <span className="text-[12px] text-slate-400">{testimonial.subtitle}</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-200">
              {testimonial.quote}
            </p>
            <div className="mt-1 flex items-center justify-start gap-2">
              <div className="inline-flex items-center gap-2">
                {testimonial.socials.map((platform) => {
                  const social = SOCIAL_STYLE[platform];
                  return (
                    <span
                      key={`${testimonial.name}-${platform}`}
                      aria-label={social.label}
                      className={`flex h-8 w-8 items-center justify-center rounded-full border border-slate-400/70 shadow-lg shadow-slate-950/60 ${social.gradient}`}
                    >
                      {social.icon}
                    </span>
                  );
                })}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

