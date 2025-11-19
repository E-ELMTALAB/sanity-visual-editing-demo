import { motion } from "framer-motion";
import { useDirection } from "@/contexts/DirectionContext";
import { ArrowRight, Instagram, Send } from "lucide-react";
import { cn } from "@/lib/utils";

// TikTok icon component
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

interface CollectionsBannerProps {
  onClick: () => void;
  className?: string;
  title?: string;
  subtitle?: string;
  image?: string;
  imageSrcSet?: string;
  ctaText?: string;
}

const springTransition = {
  type: "spring" as const,
  stiffness: 220,
  damping: 28,
};

export function CollectionsBanner({ 
  onClick, 
  className,
  title,
  subtitle,
  image,
  imageSrcSet,
  ctaText
}: CollectionsBannerProps) {
  const { isRTL } = useDirection();
  
  // Use Sanity data if available, otherwise use fallback
  const bannerTitle = title || (isRTL ? "همه کلکسیون‌های سوشیال مدیا" : "All Social Media Collections");
  const bannerSubtitle = subtitle || (isRTL 
    ? "اکانت‌های اینستاگرام، تیک‌تاک، تلگرام و بیشتر" 
    : "Instagram, TikTok, Telegram accounts and more");
  const FALLBACK_IMAGE_BASE = "https://images.unsplash.com/photo-1611162617474-5b21e879e113";
  const fallbackWidths = [640, 960, 1280, 1600];
  const buildFallbackUrl = (width: number) =>
    `${FALLBACK_IMAGE_BASE}?auto=format&fit=crop&q=70&w=${width}&h=${Math.round(width * (2 / 3))}`;
  const bannerImage = image || buildFallbackUrl(1280);
  const bannerImageSrcSet = imageSrcSet || fallbackWidths.map((width) => `${buildFallbackUrl(width)} ${width}w`).join(", ");
  const bannerImageSizes = "(max-width: 768px) 100vw, 1100px";
  const bannerCtaText = ctaText || (isRTL ? "کشف همه کلکسیون‌ها" : "Discover All Collections");

  const platforms = [
    { icon: Instagram, label: "Instagram", color: "text-pink-400" },
    { icon: TikTokIcon, label: "TikTok", color: "text-cyan-400" },
    { icon: Send, label: "Telegram", color: "text-blue-400" },
  ];

  return (
    <section className={cn("py-8 sm:py-10 lg:py-12 px-2 md:px-3 lg:px-4 bg-transparent", className)}>
      <div className="max-w-[1100px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springTransition}
          className="group relative h-[280px] sm:h-[320px] md:h-[360px] rounded-3xl overflow-hidden cursor-pointer ring-1 ring-white/10"
          onClick={onClick}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={bannerImage}
              srcSet={bannerImageSrcSet}
              sizes={bannerImageSizes}
              alt={bannerTitle}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Dark overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          </div>

          {/* Content */}
          <div className={cn(
            "relative z-10 h-full flex flex-col justify-center px-8 md:px-12 lg:px-16",
            isRTL ? "items-end text-right" : "items-start text-left"
          )}>
            {/* Platform Icons at top */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springTransition, delay: 0.1 }}
              className={cn("flex items-center gap-3 mb-6", isRTL && "flex-row-reverse")}
            >
              {platforms.map((platform, index) => (
                <div
                  key={platform.label}
                  className="w-10 h-10 rounded-xl glass border border-white/30 flex items-center justify-center"
                >
                  <platform.icon className={`w-5 h-5 ${platform.color}`} />
                </div>
              ))}
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...springTransition, delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-3 md:mb-4"
              style={{ filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.5))' }}
            >
              {bannerTitle}
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...springTransition, delay: 0.3 }}
              className="text-base sm:text-lg md:text-xl text-white/90 mb-6 md:mb-8 max-w-2xl"
              style={{ filter: 'drop-shadow(0 0 15px rgba(0,0,0,0.4))' }}
            >
              {bannerSubtitle}
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springTransition, delay: 0.4 }}
              className={cn(
                "glass px-6 py-3 rounded-full border border-white/35 text-white font-medium",
                "hover:bg-white/15 transition-all duration-200",
                "flex items-center gap-2 group/btn"
              )}
            >
              <span>{bannerCtaText}</span>
              <ArrowRight className={cn(
                "h-4 w-4 transition-transform group-hover/btn:translate-x-1",
                isRTL && "rotate-180"
              )} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
