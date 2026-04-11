import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDirection } from "@/contexts/DirectionContext";

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
    <section className={cn("py-8 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-8 bg-transparent", className)}>
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          {banners.map((banner, index) => (
          <div
            key={banner.id}
            className="group relative w-full h-[280px] sm:h-[320px] md:h-[360px] rounded-3xl overflow-hidden cursor-pointer ring-1 ring-white/10 animate-fadeIn"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={banner.onClick}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={banner.backgroundImage}
                srcSet={banner.backgroundImageSrcSet}
                sizes="(max-width: 768px) 100vw, 560px"
                alt={banner.title}
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
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-3 md:mb-4 animate-fadeIn"
                style={{ filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.5))', animationDelay: `${index * 100 + 200}ms` }}
              >
                {banner.title}
              </h2>
              
              <p
                className="text-base sm:text-lg md:text-xl text-white/90 mb-6 md:mb-8 max-w-2xl animate-fadeIn"
                style={{ filter: 'drop-shadow(0 0 15px rgba(0,0,0,0.4))', animationDelay: `${index * 100 + 300}ms` }}
              >
                {banner.subtitle}
              </p>

              <button
                className={cn(
                  "glass px-6 py-3 rounded-full border border-white/35 text-white font-medium",
                  "hover:bg-white/15 transition-all duration-200",
                  "flex items-center gap-2 group/btn animate-fadeIn"
                )}
                style={{ animationDelay: `${index * 100 + 400}ms` }}
              >
                <span>{banner.ctaText}</span>
                <ArrowRight className={cn(
                  "h-4 w-4 transition-transform group-hover/btn:translate-x-1",
                  isRTL && "rotate-180"
                )} />
              </button>
            </div>
          </div>
          ))}
        </div>
      </div>
    </section>
  );
}
