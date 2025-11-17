import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDirection } from "@/contexts/DirectionContext";

const springTransition = {
  type: "spring" as const,
  stiffness: 220,
  damping: 28,
};

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  backgroundImage: string;
  onClick: () => void;
}

interface EditorialBannersProps {
  banners: Banner[];
  className?: string;
}

export function EditorialBanners({ banners, className }: EditorialBannersProps) {
  const { isRTL } = useDirection();

  return (
    <section className={cn("py-8 sm:py-10 lg:py-12 px-2 md:px-3 lg:px-4 bg-transparent", className)}>
      <div className="max-w-[1100px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {banners.map((banner, index) => (
          <motion.div
            key={banner.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: index * 0.1 }}
            className="group relative h-[280px] sm:h-[320px] md:h-[360px] rounded-3xl overflow-hidden cursor-pointer ring-1 ring-white/10"
            onClick={banner.onClick}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={banner.backgroundImage}
                alt={banner.title}
                loading="lazy"
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
              <motion.h2
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...springTransition, delay: index * 0.1 + 0.2 }}
                className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-3 md:mb-4"
                style={{ filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.5))' }}
              >
                {banner.title}
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...springTransition, delay: index * 0.1 + 0.3 }}
                className="text-base sm:text-lg md:text-xl text-white/90 mb-6 md:mb-8 max-w-2xl"
                style={{ filter: 'drop-shadow(0 0 15px rgba(0,0,0,0.4))' }}
              >
                {banner.subtitle}
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...springTransition, delay: index * 0.1 + 0.4 }}
                className={cn(
                  "glass px-6 py-3 rounded-full border border-white/35 text-white font-medium",
                  "hover:bg-white/15 transition-all duration-200",
                  "flex items-center gap-2 group/btn"
                )}
              >
                <span>{banner.ctaText}</span>
                <ArrowRight className={cn(
                  "h-4 w-4 transition-transform group-hover/btn:translate-x-1",
                  isRTL && "rotate-180"
                )} />
              </motion.button>
            </div>
          </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
