import React from "react";
import { SurfaceGlass } from "@/components/ui/surface-glass";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { Instagram, Send, Twitter } from "lucide-react";
import { cn } from "@/lib/utils";

const springTransition = {
  type: "spring" as const,
  stiffness: 220,
  damping: 28,
};

interface SocialMediaCardProps {
  id: string;
  platform: "Instagram" | "TikTok" | "Telegram" | "X";
  title: string;
  image: string;
  price: number;
  rating: number;
  onAdd: (id: string) => void;
  className?: string;
}

const platformConfig = {
  Instagram: {
    icon: Instagram,
    color: "from-[#f09433] via-[#e6683c] to-[#bc1888]",
    bgColor: "bg-[#E1306C]/20",
    borderColor: "border-[#E1306C]/30",
    textColor: "text-[#E1306C]",
  },
  TikTok: {
    icon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
      </svg>
    ),
    color: "from-[#00f2ea] to-[#ff0050]",
    bgColor: "bg-[#00f2ea]/20",
    borderColor: "border-[#00f2ea]/30",
    textColor: "text-[#00f2ea]",
  },
  Telegram: {
    icon: Send,
    color: "from-[#229ED9] to-[#0088cc]",
    bgColor: "bg-[#229ED9]/20",
    borderColor: "border-[#229ED9]/30",
    textColor: "text-[#229ED9]",
  },
  X: {
    icon: Twitter,
    color: "from-foreground to-muted-foreground",
    bgColor: "bg-foreground/20",
    borderColor: "border-foreground/30",
    textColor: "text-foreground",
  },
};

export const SocialMediaCard = React.memo(function SocialMediaCard({
  id,
  platform,
  title,
  image,
  price,
  rating,
  onAdd,
  className,
}: SocialMediaCardProps) {
  const config = platformConfig[platform];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "product-poster-compact group relative rounded-3xl overflow-hidden cursor-pointer ring-1 ring-white/10",
        "transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.995]",
        className
      )}
    >
      {/* Image wrapper */}
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
        <img
          src={image}
          alt={title}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover ring-1 ring-white/12 shadow-none transition-transform duration-200 group-hover:scale-[1.02]"
        />
        
        {/* Fade gradient layer */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-black/18" />

        {/* Platform Chip */}
        <div className="absolute ltr:left-3 rtl:right-3 top-3 px-2.5 py-1 rounded-full text-[12px] leading-5 flex items-center gap-1 backdrop-blur-[18px] bg-white/12 border border-white/35">
          <Icon className={cn("h-3.5 w-3.5", config.textColor)} />
          <span className={cn("text-xs font-semibold", config.textColor)}>
            {platform}
          </span>
        </div>
      </div>

      {/* Info box (overlapping) */}
      <div className="absolute left-3 right-3 bottom-3 glass rounded-3xl px-4 py-4 md:px-5 md:py-4 border border-white/35">
        <h3 className="text-[16px] md:text-[17px] font-semibold text-white/95 line-clamp-1">
          {title}
        </h3>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-[17px] md:text-[18px] font-bold text-white/95">
              {price.toLocaleString('fa-IR')} تومان
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdd(id);
            }}
            className="px-3.5 py-2 rounded-full text-[13px] font-medium bg-white/15 hover:bg-white/22 active:bg-white/28 border border-white/35 transition-colors duration-150 whitespace-nowrap"
          >
            خرید سریع
          </button>
        </div>
      </div>

      {/* Focus ring */}
      <span className="pointer-events-none absolute inset-0 rounded-3xl ring-0 ring-offset-0 ring-white/40 focus-within:ring-2" />
    </div>
  );
});
