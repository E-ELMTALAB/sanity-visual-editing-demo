import React from "react";
import { SurfaceGlass } from "@/components/ui/surface-glass";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, Clock, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

const springTransition = {
  type: "spring" as const,
  stiffness: 220,
  damping: 28,
};

interface CourseCardProps {
  id: string;
  title: string;
  instructor: {
    name: string;
    avatar: string;
  };
  rating: number;
  hours: number;
  image: string;
  price: number;
  onAdd: (id: string) => void;
  onView?: (id: string) => void;
  className?: string;
}

export const CourseCard = React.memo(function CourseCard({
  id,
  title,
  instructor,
  rating,
  hours,
  image,
  price,
  onAdd,
  onView,
  className,
}: CourseCardProps) {
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

        {/* Hours Badge */}
        <div className="absolute ltr:left-3 rtl:right-3 top-3 px-2.5 py-1 rounded-full text-[12px] leading-5 flex items-center gap-1 backdrop-blur-[18px] bg-white/12 border border-white/35">
          <Clock className="h-3.5 w-3.5 text-accent-blue" />
          <span className="text-xs font-semibold text-accent-blue">
            {hours} ساعت
          </span>
        </div>
      </div>

      {/* Info box (overlapping) */}
      <div className="absolute left-3 right-3 bottom-3 glass rounded-3xl px-4 py-4 md:px-5 md:py-4 border border-white/35">
        <div className="flex items-center gap-2 mb-2">
          <Avatar className="h-7 w-7 border-2 border-white/35">
            <AvatarImage src={instructor.avatar} alt={instructor.name} />
            <AvatarFallback className="bg-white/20 text-white/90 text-xs">
              {instructor.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-[13px] text-white/70">{instructor.name}</span>
          <div className="flex items-center gap-1 ltr:ml-auto rtl:mr-auto">
            <Star className="h-3.5 w-3.5 text-accent-blue fill-accent-blue" />
            <span className="text-[13px] font-semibold text-white/90">{rating}</span>
          </div>
        </div>

        <h3 className="text-[16px] md:text-[17px] font-semibold text-white/95 line-clamp-1 mb-3">
          {title}
        </h3>

        <div className="flex items-center justify-between gap-3">
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
