import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { SectionHeader } from "@/components/ui/section-header";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { useDirection } from "@/contexts/DirectionContext";
import { usePromotions } from "@/contexts/promotion-context";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductPrices } from "@/lib/medusa-prices";

interface Product {
  id: string;
  title: string;
  image: string;
  price: number;
  slug?: string;
}

interface SpecialOffersProps {
  products: Product[];
  onAdd: (id: string) => void;
  onViewAll?: () => void;
  className?: string;
  productPrices?: Record<string, ProductPrices>;
}

export function SpecialOffers({ products, onAdd, onViewAll, className, productPrices }: SpecialOffersProps) {
  const { isRTL } = useDirection();
  const { getPromotionForProduct, getSiteWidePromotion } = usePromotions();
  const siteWidePromotion = getSiteWidePromotion();
  
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    direction: isRTL ? "rtl" : "ltr",
    align: "start",
    slidesToScroll: 1,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className={cn("relative py-8 sm:py-10 lg:py-12 px-6 lg:px-[100px] overflow-hidden bg-transparent", className)}>
      <div className="max-w-[1400px] mx-auto relative z-10">
        <SectionHeader
          title="منطقه تخفیفات"
          eyebrow="پیشنهادات ویژه شریف‌GPT"
          className="mb-6"
        />

        <div className="relative group">
          {/* Carousel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4 sm:gap-6 lg:gap-8 touch-pan-y">
              {products.slice(0, 6).map((product, index) => {
                // Get promotion info for this product
                const productPriceData = product.slug ? productPrices?.[product.slug] : undefined;
                const medusaVariants = productPriceData?.variants || [];
                const medusaProductId = productPriceData?.product_id; // Medusa product ID
                
                // Find the variant with the lowest current price
                const validVariants = medusaVariants.filter(v => v.price > 0);
                const lowestPriceVariant = validVariants.length > 0
                  ? validVariants.reduce((lowest, current) => 
                      current.price < lowest.price ? current : lowest
                    )
                  : null;
                
                // For product cards: original price should be the lowest variant's original_price
                // If the lowest variant has original_price, use it; otherwise use its current price as original
                const originalPrice = lowestPriceVariant?.original_price || lowestPriceVariant?.price || product.price;
                
                // Use Medusa product ID if available, otherwise fall back to Sanity ID
                const productIdForMatching = medusaProductId || product.id;
                const promotionInfo = product.slug && originalPrice > 0
                  ? getPromotionForProduct(product.slug, productIdForMatching, originalPrice)
                  : null;

                // Check if product has a discount from variant
                const hasVariantDiscount = lowestPriceVariant?.original_price && lowestPriceVariant.original_price > lowestPriceVariant.price;
                
                // Determine endsAt: priority is promotionInfo > variant promotion_ends_at > site-wide promotion
                const variantEndsAt = lowestPriceVariant?.promotion_ends_at;
                const endsAt = promotionInfo?.endsAt || variantEndsAt || siteWidePromotion?.campaign?.ends_at;
                
                // Check if product has any discount (from promotion or variant)
                const hasDiscount = promotionInfo || hasVariantDiscount || (lowestPriceVariant?.price && lowestPriceVariant.price < originalPrice);

                return (
                  <div
                    key={product.id}
                    className="flex-[0_0_75%] sm:flex-[0_0_45%] md:flex-[0_0_38%] lg:flex-[0_0_24%] min-w-0 animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ProductCard
                      id={product.id}
                      title={product.title}
                      image={product.image}
                      price={product.price}
                      slug={product.slug}
                      medusaVariants={medusaVariants}
                      onAdd={onAdd}
                      promotion={promotionInfo ? {
                        discountPercentage: promotionInfo.discountPercentage,
                        originalPrice: promotionInfo.originalPrice,
                        discountedPrice: promotionInfo.discountedPrice,
                        endsAt: endsAt,
                      } : (hasDiscount ? {
                        discountPercentage: hasVariantDiscount && lowestPriceVariant?.discount_percentage 
                          ? lowestPriceVariant.discount_percentage 
                          : (originalPrice > 0 ? Math.round(((originalPrice - (lowestPriceVariant?.price || originalPrice)) / originalPrice) * 100) : 0),
                        originalPrice: originalPrice,
                        discountedPrice: lowestPriceVariant?.price || originalPrice,
                        endsAt: endsAt, // Will be used if available, ProductCard will fallback to site-wide
                      } : undefined)}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={scrollPrev}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full glass flex items-center justify-center",
              "border border-white/35 transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-red",
              "hover:bg-accent-red/20 hover:border-accent-red/40 active:scale-95",
              "disabled:opacity-35 disabled:cursor-not-allowed",
              "ltr:left-2 rtl:right-2"
            )}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-accent-red ltr:block rtl:hidden" />
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-accent-red ltr:hidden rtl:block" />
          </button>
          <button
            onClick={scrollNext}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full glass flex items-center justify-center",
              "border border-white/35 transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-red",
              "hover:bg-accent-red/20 hover:border-accent-red/40 active:scale-95",
              "disabled:opacity-35 disabled:cursor-not-allowed",
              "ltr:right-2 rtl:left-2"
            )}
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-accent-red ltr:block rtl:hidden" />
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-accent-red ltr:hidden rtl:block" />
          </button>
        </div>

        {onViewAll && (
          <div
            className="flex justify-center mt-8 animate-fade-in"
            style={{ animationDelay: '300ms' }}
          >
            <Button
              onClick={onViewAll}
              variant="viewAll"
              size="lg"
              className="w-full sm:w-auto rounded-2xl"
            >
              مشاهده همه
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
