import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowLeft } from "lucide-react";
import { CountdownTimer } from "@/components/ui/countdown-timer";
import { cn } from "@/lib/utils";

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

  useEffect(() => {
    if (typeof window === "undefined") return;

    const expiry = getOrInitExpiry();
    setEndsAt(expiry);
  }, []);

  const handleExpire = () => {
    // Banner expires naturally when countdown ends
  };

  const handleButtonClick = () => {
    navigate("/products");
  };

  const showBanner = !!endsAt;

  const backgroundImageUrl = useMemo(
    () =>
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1600&q=80&auto=format&fit=crop",
    []
  );

  if (!showBanner) return null;

  return (
    <section className={cn("py-8 sm:py-10 lg:py-12 px-6 sm:px-6 lg:px-[100px]", className)}>
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
          <div className="relative z-10 flex w-full flex-col sm:flex-row items-center justify-between gap-5 px-6 sm:px-10 lg:px-12 py-6 sm:py-8 lg:py-10 text-right">
            {/* Text + badge */}
            <div className="flex-1 flex flex-col items-end">
              {/* Heading with badge on the right */}
              <div className="flex items-start gap-3 w-full justify-end">
                <div className="flex-1 text-right">
                  <h2 className="font-vazirmatn font-black text-[22px] sm:text-[26px] lg:text-[32px] leading-tight tracking-[-0.025em] text-white">
                    تخفیف ویژه روی اکانت‌های پریمیوم ChatGPT
                  </h2>
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(245,158,11,0.3)] flex-shrink-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(245,158,11,0.2), rgba(249,115,22,0.2))",
                  }}
                >
                  <div className="flex items-center gap-[6px] px-3 py-1">
                    <Sparkles className="w-[14px] h-[14px] text-amber-300" />
                    <span className="font-vazirmatn text-[12px] font-bold tracking-[0.025em] text-amber-300">
                      پیشنهاد محدود زمانی
                    </span>
                  </div>
                </motion.div>
              </div>

              <p className="mt-2 font-vazirmatn text-[15px] sm:text-[17px] font-medium text-white/70 max-w-xl text-right">
                فقط تا پایان شمارش معکوس، می‌توانید اکانت‌های قانونی با تحویل آنی و پشتیبانی واقعی را
                با قیمت ویژه تهیه کنید.
              </p>
            </div>

            {/* CTA + countdown */}
            <div className="flex flex-col items-end gap-5 min-w-[220px]">
              {endsAt && (
                <CountdownTimer
                  endsAt={endsAt}
                  size="md"
                  variant="glass"
                  className="shadow-lg"
                  onExpire={handleExpire}
                />
              )}

              <motion.button
                type="button"
                onClick={handleButtonClick}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border border-white/20 px-5 sm:px-6 lg:px-7 py-2.5 shadow-[0_4px_24px_rgba(147,51,234,0.4)] text-[14px] sm:text-[16px] font-bold text-white cursor-pointer z-20"
                style={{
                  backgroundImage: "linear-gradient(90deg,#7C3AED,#EC4899,#7C3AED)",
                  backgroundSize: "200% 100%",
                  backgroundPosition: "0% 0%",
                  transition: "background-position 0.3s ease-out, box-shadow 0.3s ease-out",
                  pointerEvents: "auto",
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
                <span>مشاهده پلن‌ها و قیمت‌ها</span>
                <motion.span
                  initial={false}
                  whileHover={{ x: -4 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="flex items-center justify-center"
                >
                  <ArrowLeft className="w-[16px] h-[16px] sm:w-[20px] sm:h-[20px]" />
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
