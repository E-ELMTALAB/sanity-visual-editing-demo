import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { lazy, Suspense, useMemo } from "react";
import { toPersianNumber } from "@/lib/medusa-promotions";
import { useSiteWidePromotion } from "@/contexts/promotion-context";
const CompactCountdownTimer = lazy(() => import("@/components/ui/countdown-timer").then(m => ({ default: m.CompactCountdownTimer })));

interface MedusaVariant {
  variant_id: string;
  name: string;
  price: number; // In Tomans (current/discounted price)
  price_rials: number; // In Rials
  original_price?: number; // Original price in Tomans (before discount)
  original_price_rials?: number;
  sku?: string;
  currency: string;
  has_promotion?: boolean;
  discount_percentage?: number;
  promotion_ends_at?: string;
}

interface PromotionInfo {
  discountPercentage: number;
  originalPrice: number;
  discountedPrice: number;
  endsAt?: string;
}

interface ProductCardProps {
  id: string;
  title: string;
  image: string;
  imageSrcSet?: string;
  price: number;
  onAdd: (id: string) => void;
  className?: string;
  slug?: string;
  medusaVariants?: MedusaVariant[];
  // Direct promotion info (from promotion context)
  promotion?: PromotionInfo;
}

export const ProductCard = React.memo(function ProductCard({
  id,
  title,
  image,
  imageSrcSet,
  price,
  onAdd,
  className,
  slug,
  medusaVariants,
  promotion,
}: ProductCardProps) {
  const navigate = useNavigate();
  const siteWidePromotion = useSiteWidePromotion();

  // Calculate pricing and promotion info
  const pricingInfo = useMemo(() => {
    // Check if any variant has a promotion from Medusa prices
    const variantWithPromo = (medusaVariants ?? []).find(v => v.has_promotion && v.original_price);
    
    // Extract valid Medusa prices
    const medusaPrices = (medusaVariants ?? [])
      .map((variant) => variant.price)
      .filter((value): value is number => typeof value === "number" && value > 0);

    const medusaLowestPrice = medusaPrices.length > 0
      ? Math.min(...medusaPrices)
      : undefined;

    // Determine original price (for strikethrough)
    let originalPrice: number | undefined;
    let discountPercentage: number | undefined;
    let promotionEndsAt: string | undefined;
    let displayPrice: number;

    // Priority 1: Direct promotion prop (from promotion context)
    if (promotion) {
      originalPrice = promotion.originalPrice;
      discountPercentage = promotion.discountPercentage;
      promotionEndsAt = promotion.endsAt; // Use endsAt from promotion prop
      // Use the discounted price from promotion
      displayPrice = promotion.discountedPrice;
    }
    // Priority 2: Variant-level promotion from Medusa
    else if (variantWithPromo) {
      originalPrice = variantWithPromo.original_price;
      discountPercentage = variantWithPromo.discount_percentage;
      promotionEndsAt = variantWithPromo.promotion_ends_at; // Use variant's promotion_ends_at
      // Use the discounted price from variant
      displayPrice = variantWithPromo.price;
    }
    // Priority 3: Compare Sanity price with Medusa price
    else if (typeof medusaLowestPrice === "number" && price > 0 && price !== medusaLowestPrice && price > medusaLowestPrice) {
      originalPrice = price;
      discountPercentage = Math.round(((price - medusaLowestPrice) / price) * 100);
      displayPrice = medusaLowestPrice;
    }
    // No promotion - use lowest available price
    else {
      displayPrice = typeof medusaLowestPrice === "number" ? medusaLowestPrice : price;
    }

    const hasPromotion = !!originalPrice && originalPrice > displayPrice;
    
    // If we have a promotion but no endsAt yet, check site-wide promotion as fallback
    if (hasPromotion && !promotionEndsAt && siteWidePromotion?.campaign?.ends_at) {
      promotionEndsAt = siteWidePromotion.campaign.ends_at;
    }
    
    const showRangeLabel = medusaPrices.length > 1;

    return {
      displayPrice,
      originalPrice,
      hasPromotion,
      discountPercentage,
      promotionEndsAt,
      showRangeLabel,
    };
  }, [medusaVariants, price, promotion, siteWidePromotion]);

  const formatPrice = (value: number) => value.toLocaleString("fa-IR");

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
      {/* Discount Badge */}
      {pricingInfo.hasPromotion && pricingInfo.discountPercentage && (
        <div className="absolute top-3 right-3 z-20">
          <div className="bg-red-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg">
            {toPersianNumber(pricingInfo.discountPercentage)}٪ تخفیف
          </div>
        </div>
      )}

      {/* Image wrapper */}
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
        <img
          src={image}
          srcSet={imageSrcSet || ''}
          sizes="(max-width: 768px) 100vw, 560px"
          alt={title}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover ring-1 ring-white/12 shadow-none transition-transform duration-200 group-hover:scale-[1.02]"
        />
        
        {/* Fade gradient layer */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-black/18" />
      </div>

      {/* Info box (overlapping) */}
      <div className="absolute left-3 right-3 bottom-3 glass rounded-3xl px-4 py-4 md:px-5 md:py-4 border border-white/35">
        <h3 className="text-[16px] md:text-[17px] font-semibold text-white/95 line-clamp-1">
          {title}
        </h3>

        {/* Countdown Timer for time-limited promotions */}
        {pricingInfo.hasPromotion && pricingInfo.promotionEndsAt && (
          <div className="mt-2" key={`timer-${id}-${pricingInfo.promotionEndsAt}`}>
            <Suspense fallback={null}>
              <CompactCountdownTimer endsAt={pricingInfo.promotionEndsAt} />
            </Suspense>
          </div>
        )}

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            {/* Original price with red strikethrough */}
            {pricingInfo.hasPromotion && pricingInfo.originalPrice && (
              <span className="text-[12px] text-red-400/80 line-through">
                {formatPrice(pricingInfo.originalPrice)} تومان
              </span>
            )}
            <div className="flex items-baseline gap-1.5 flex-wrap">
              {pricingInfo.showRangeLabel && (
                <span className="text-xs md:text-sm text-white/80">
                  قیمت از
                </span>
              )}
              <span className={cn(
                "text-[17px] md:text-[18px] font-bold",
                pricingInfo.hasPromotion ? "text-green-400" : "text-white/95"
              )}>
                {formatPrice(pricingInfo.displayPrice)}
              </span>
              <span className="text-[11px] md:text-xs text-white/70">
                تومان
              </span>
            </div>
          </div>
          <button
            onClick={handleCardClick}
            className="px-3.5 py-2 rounded-full text-[13px] font-medium bg-white/15 hover:bg-white/22 active:bg-white/28 border border-white/35 transition-colors duration-150 whitespace-nowrap"
          >
            مشاهده
          </button>
        </div>
      </div>

      {/* Focus ring */}
      <span className="pointer-events-none absolute inset-0 rounded-3xl ring-0 ring-offset-0 ring-white/40 focus-within:ring-2" />
    </div>
  );
});
