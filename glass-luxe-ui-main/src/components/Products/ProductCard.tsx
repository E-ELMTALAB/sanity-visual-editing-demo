import React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  title: string;
  image: string;
  oldPrice?: number;
  price: number;
  discountPct?: number;
  onAdd: (id: string) => void;
  className?: string;
  slug?: string;
}

export const ProductCard = React.memo(function ProductCard({
  id,
  title,
  image,
  oldPrice,
  price,
  discountPct,
  onAdd,
  className,
  slug,
}: ProductCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (slug) {
      navigate(`/products/${slug}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
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

        {/* Discount badge */}
        {discountPct && (
          <div className="absolute ltr:left-3 rtl:right-3 top-3 px-2.5 py-1 rounded-full text-[12px] leading-5 flex items-center gap-1 backdrop-blur-[18px] bg-white/12 border border-white/35">
            <span className="w-2.5 h-2.5 rounded-full bg-accent-red/90" />
            <span className="text-white/95 font-medium">{discountPct}% تخفیف</span>
          </div>
        )}
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
            {oldPrice && (
              <span className="text-[13px] text-white/50 line-through">
                {oldPrice.toLocaleString('fa-IR')}
              </span>
            )}
          </div>
          <button
            onClick={handleCardClick}
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
