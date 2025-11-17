import { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { SurfaceGlass } from "@/components/ui/surface-glass";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { GraduationCap, Youtube, BookOpen, Sparkles } from "lucide-react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const springTransition = {
  type: "spring" as const,
  stiffness: 220,
  damping: 28,
};

interface EduProductCardProps {
  id: string;
  provider: "Coursera" | "Udemy" | "YouTube Premium" | "Skillshare";
  title: string;
  image: string;
  price: number;
  duration: string;
  onAdd: (id: string) => void;
  className?: string;
}

const providerConfig = {
  Coursera: {
    icon: GraduationCap,
    color: "from-[#0056D2] to-[#003D99]",
    bgColor: "bg-[#0056D2]/20",
    borderColor: "border-[#0056D2]/30",
    textColor: "text-[#0056D2]",
  },
  Udemy: {
    icon: BookOpen,
    color: "from-[#A435F0] to-[#8710D8]",
    bgColor: "bg-[#A435F0]/20",
    borderColor: "border-[#A435F0]/30",
    textColor: "text-[#A435F0]",
  },
  "YouTube Premium": {
    icon: Youtube,
    color: "from-[#FF0000] to-[#CC0000]",
    bgColor: "bg-[#FF0000]/20",
    borderColor: "border-[#FF0000]/30",
    textColor: "text-[#FF0000]",
  },
  Skillshare: {
    icon: Sparkles,
    color: "from-[#00D1B2] to-[#00A896]",
    bgColor: "bg-[#00D1B2]/20",
    borderColor: "border-[#00D1B2]/30",
    textColor: "text-[#00D1B2]",
  },
};

export function EduProductCard({
  id,
  provider,
  title,
  image,
  price,
  duration,
  onAdd,
  className,
}: EduProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const config = providerConfig[provider];
  const Icon = config.icon;

  // Parallax effect for image
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [3, -3]);
  const rotateY = useTransform(x, [-100, 100], [-3, 3]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      className={cn(
        "product-poster-compact group relative rounded-3xl overflow-hidden cursor-pointer ring-1 ring-white/10",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      whileHover={{ y: -2 }}
      whileTap={{ y: -1, scale: 0.995 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {/* Image wrapper */}
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
        <motion.img
          src={image}
          alt={title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover ring-1 ring-white/12 shadow-none"
          animate={isHovered ? { scale: 1.02 } : { scale: 1 }}
          transition={{ duration: 0.2 }}
        />
        
        {/* Fade gradient layer */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-black/18" />

        {/* Provider Chip */}
        <div className="absolute ltr:left-3 rtl:right-3 top-3 px-2.5 py-1 rounded-full text-[12px] leading-5 flex items-center gap-1 backdrop-blur-[18px] bg-white/12 border border-white/35">
          <Icon className={cn("h-3.5 w-3.5", config.textColor)} />
          <span className={cn("text-xs font-semibold", config.textColor)}>
            {provider}
          </span>
        </div>

        {/* Duration Badge */}
        <div className="absolute ltr:right-3 rtl:left-3 top-3 px-2.5 py-1 rounded-full text-[12px] leading-5 flex items-center gap-1 backdrop-blur-[18px] bg-white/12 border border-white/35">
          <Clock className="h-3.5 w-3.5 text-accent-green" />
          <span className="text-xs font-semibold text-accent-green">
            {duration}
          </span>
        </div>
      </div>

      {/* Info box (overlapping) */}
      <div className="absolute left-3 right-3 bottom-3 glass rounded-3xl px-4 py-4 md:px-5 md:py-4 border border-white/35">
        <h3 className="text-[16px] md:text-[17px] font-semibold text-white/95 line-clamp-1">
          {title}
        </h3>

        <div className="mt-3 flex items-center justify-between gap-3">
          <motion.div
            animate={
              isHovered
                ? {
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }
                : {}
            }
            transition={{
              duration: 2,
              repeat: isHovered ? Infinity : 0,
              ease: "linear",
            }}
            style={{
              backgroundSize: "200% 100%",
              backgroundImage: isHovered
                ? "linear-gradient(90deg, transparent 0%, hsl(var(--accent-green) / 0.15) 50%, transparent 100%)"
                : "none",
            }}
            className="rounded-lg p-1 -m-1"
          >
            <span className="text-[17px] md:text-[18px] font-bold text-white/95">
              {price.toLocaleString('fa-IR')} تومان
            </span>
          </motion.div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdd(id);
            }}
            className="px-3.5 py-2 rounded-full text-[13px] font-medium bg-white/15 hover:bg-white/22 active:bg-white/28 border border-white/35 transition-colors whitespace-nowrap"
          >
            خرید سریع
          </button>
        </div>
      </div>

      {/* Focus ring */}
      <span className="pointer-events-none absolute inset-0 rounded-3xl ring-0 ring-offset-0 ring-white/40 focus-within:ring-2" />
    </motion.div>
  );
}
