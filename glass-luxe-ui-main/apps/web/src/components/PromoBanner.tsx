import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowLeft } from "lucide-react";
import { CountdownTimer } from "@/components/ui/countdown-timer";
import { cn } from "@/lib/utils";
import { getPromoBannerContent } from "@/lib/sanityContent";

interface PromoBannerProps {
  className?: string;
}

const EXPIRY_KEY = "promo-banner-expiry-v1";
const DEFAULT_DURATION_MS = 48 * 60 * 60 * 1000; // 48 hours

function getOrInitExpiry(): string {
  if (typeof window === "undefined") {
    return new Date(Date.now() + DEFAULT_DURATION_MS).toISOString();
  }

  try {
    const stored = window.localStorage.getItem(EXPIRY_KEY);
    if (stored && !Number.isNaN(new Date(stored).getTime())) {
      return stored;
    }
  } catch {
    // ignore and fall through
  }

  const expiry = new Date(Date.now() + DEFAULT_DURATION_MS).toISOString();
  try {
    window.localStorage.setItem(EXPIRY_KEY, expiry);
  } catch {
    // ignore storage errors
  }
  return expiry;
}

export function PromoBanner({ className }: PromoBannerProps) {
  const navigate = useNavigate();
  const [endsAt, setEndsAt] = useState<string | null>(null);

  // Get content from Sanity cache (with safe fallbacks)
  const bannerContent = useMemo(() => getPromoBannerContent(), []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const expiry = getOrInitExpiry();
    setEndsAt(expiry);
  }, []);

  const handleExpire = () => {
    // Banner expires naturally when countdown ends
  };

  const handleButtonClick = () => {
    navigate(bannerContent.buttonLink);
  };

  // Hide banner if not active or no expiry time
  const showBanner = bannerContent.isActive && !!endsAt;

  // Optimize image URL with better compression and format
  const backgroundImageUrl = useMemo(
    () =>
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1600&q=75&auto=format&fit=crop&format=webp",
    []
  );

  if (!showBanner) return null;

  return (
    <section className={cn("py-8 sm:py-10 lg:py-12 px-6 sm:px-6 lg:px-[100px]", className)} style={{ backgroundColor: 'transparent !important', backgroundImage: 'none !important', background: 'transparent !important' }}>
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          dir="rtl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={cn(
            "relative overflow-hidden",
            "rounded-[24px] border border-white/10",
            "shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_80px_rgba(147,51,234,0.15)]",
            "flex items-stretch",
            // Responsive height to match product cards (aspect-[3/4])
            // Product cards: aspect-[3/4], max-w-[1400px] container
            // Mobile: 75% width ≈ 300px, height = 300px × 4/3 = 400px
            // Tablet: 45% width ≈ 360px, height = 360px × 4/3 = 480px
            // Desktop: 24% width ≈ 336px, height = 336px × 4/3 = 448px
            "h-[400px]",
            "sm:h-[480px]",
            "md:h-[480px]",
            "lg:h-[448px]"
          )}
          style={{
            backgroundImage: `
              linear-gradient(to left, rgba(0,0,0,0.7), rgba(0,0,0,0.6), rgba(0,0,0,0.8)),
              url(${backgroundImageUrl})
            `,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Top fade overlay to blend with page background */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0"
            style={{
              height: '80px',
              background: 'linear-gradient(to bottom, hsl(var(--bg-base-bot)) 0%, rgba(10,15,39,0) 100%)',
              zIndex: 0,
            }}
          />
          {/* Animated accent glow */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full"
            initial={{ opacity: 0.3, scale: 1 }}
            animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{
              backgroundImage:
                "linear-gradient(to bottom right, rgba(139,92,246,0.2), rgba(217,70,239,0.1))",
              filter: "blur(48px)",
            }}
          />

          {/* Highlight lines */}
          <div
            aria-hidden="true"
            className="absolute inset-x-8 sm:inset-x-10 lg:inset-x-16 top-8 h-px"
            style={{
              backgroundImage:
                "linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-16 sm:inset-x-20 lg:inset-x-24 bottom-16 h-px"
            style={{
              backgroundImage:
                "linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)",
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex w-full flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-8 px-6 sm:px-8 lg:px-12 py-6 sm:py-8 lg:py-10">
            {/* Text + badge - Left side (RTL) */}
            <div className="flex-1 flex flex-col items-start lg:items-end w-full lg:w-auto">
              {/* Badge - Above title on mobile, inline on desktop */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
                className="mb-3 lg:mb-4 flex-shrink-0 self-start lg:self-end"
              >
                <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 px-3 sm:px-3.5 py-1 sm:py-1.5 backdrop-blur-sm"
                  style={{
                    backgroundImage:
                      "linear-gradient(to left, rgba(245,158,11,0.25), rgba(249,115,22,0.25))",
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 flex-shrink-0" />
                  <span className="font-vazirmatn text-xs sm:text-sm font-bold text-amber-300 whitespace-nowrap">
                    پیشنهاد محدود زمانی
                  </span>
                </div>
              </motion.div>

              {/* Main Heading */}
              <h2 className="font-vazirmatn font-black text-2xl sm:text-3xl lg:text-4xl leading-tight tracking-tight text-white mb-3 lg:mb-4 text-right w-full lg:w-auto">
                {bannerContent.title}
              </h2>

              {/* Subtitle */}
              <p className="font-vazirmatn text-sm sm:text-base lg:text-lg font-normal text-white/75 leading-relaxed max-w-2xl text-right">
                {bannerContent.description || bannerContent.subtitle}
              </p>
            </div>

            {/* CTA + countdown - Right side */}
            <div className="flex flex-col items-center lg:items-end gap-4 sm:gap-5 w-full lg:w-auto lg:min-w-[240px] flex-shrink-0">
              {/* Countdown Timer - Premium Styled */}
              {endsAt && (
                <div className="w-full lg:w-auto flex flex-col items-center lg:items-end gap-2">
                  <div className="relative">
                    <CountdownTimer
                      endsAt={endsAt}
                      size="lg"
                      variant="glass"
                      className="shadow-[0_8px_32px_rgba(0,0,0,0.3)] border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md"
                      onExpire={handleExpire}
                    />
                  </div>
                </div>
              )}

              {/* CTA Button */}
              <motion.button
                type="button"
                onClick={handleButtonClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl border border-white/20 px-6 sm:px-7 lg:px-8 py-3 sm:py-3.5 shadow-[0_4px_24px_rgba(147,51,234,0.4)] text-sm sm:text-base font-bold text-white cursor-pointer w-full sm:w-auto min-w-[200px] sm:min-w-[240px] transition-all duration-300"
                style={{
                  backgroundImage: "linear-gradient(90deg,#7C3AED,#EC4899,#7C3AED)",
                  backgroundSize: "200% 100%",
                  backgroundPosition: "0% 0%",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundPosition = "100% 0";
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(147,51,234,0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundPosition = "0% 0";
                  e.currentTarget.style.boxShadow = "0 4px 24px rgba(147,51,234,0.4)";
                }}
              >
                <span className="font-vazirmatn">{bannerContent.buttonText}</span>
                <motion.span
                  initial={false}
                  whileHover={{ x: -4 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="flex items-center justify-center flex-shrink-0"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.span>

                {/* Hover glow sweep */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full"
                  style={{
                    background:
                      "linear-gradient(120deg, transparent, rgba(255,255,255,0.6), transparent)",
                    mixBlendMode: "screen",
                    transition: "transform 0.7s ease-out",
                  }}
                />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default PromoBanner;
