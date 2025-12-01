import { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { SurfaceGlass } from "@/components/ui/surface-glass";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const springTransition = {
  type: "spring" as const,
  stiffness: 220,
  damping: 28,
};

interface MagazineCardProps {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  readTime: number;
  image: string;
  onRead: (slug: string) => void;
  className?: string;
}

export function MagazineCard({
  id,
  slug,
  title,
  excerpt,
  readTime,
  image,
  onRead,
  className,
}: MagazineCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Parallax effect for image shift
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const imageX = useTransform(x, [-100, 100], [-3, 3]);
  const imageY = useTransform(y, [-100, 100], [-3, 3]);

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

  // Truncate excerpt to max 120 chars
  const truncatedExcerpt = excerpt.length > 120 ? excerpt.slice(0, 120) + "..." : excerpt;

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

        {/* Read Time Badge */}
        <div className="absolute ltr:left-3 rtl:right-3 top-3 px-2.5 py-1 rounded-full text-[12px] leading-5 flex items-center gap-1 backdrop-blur-[18px] bg-white/12 border border-white/35">
          <Clock className="h-3.5 w-3.5 text-white/90" />
          <span className="text-xs font-semibold text-white/90">
            {readTime} دقیقه
          </span>
        </div>
      </div>

      {/* Info box (overlapping) */}
      <div className="absolute left-3 right-3 bottom-3 glass rounded-3xl px-4 py-4 md:px-5 md:py-4 border border-white/35">
        <h3 className="text-[16px] md:text-[17px] font-semibold text-white/95 line-clamp-1 mb-2">
          {title}
        </h3>

        <p className="text-[13px] text-white/70 line-clamp-2 leading-relaxed mb-3">
          {truncatedExcerpt}
        </p>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onRead(slug);
          }}
          className="w-full px-3.5 py-2 rounded-full text-[13px] font-medium bg-white/15 hover:bg-white/22 active:bg-white/28 border border-white/35 transition-colors flex items-center justify-center gap-2"
        >
          <span>مطالعه</span>
          <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
        </button>
      </div>

      {/* Focus ring */}
      <span className="pointer-events-none absolute inset-0 rounded-3xl ring-0 ring-offset-0 ring-white/40 focus-within:ring-2" />
    </motion.div>
  );
}
