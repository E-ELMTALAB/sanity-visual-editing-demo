import { useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { useDirection } from "@/contexts/DirectionContext";
import { usePromotions } from "@/contexts/promotion-context";
import { cn } from "@/lib/utils";
import useEmblaCarousel from "embla-carousel-react";
import type { ProductPrices } from "@/lib/medusa-prices";

interface Product {
  id: string;
  title: string;
  image: string;
  price: number;
  slug?: string;
}

interface SocialMediaProductsGridProps {
  products: Product[];
  onAdd: (id: string) => void;
  onViewAll: () => void;
  className?: string;
  productPrices?: Record<string, ProductPrices>;
}

export function SocialMediaProductsGrid({
  products,
  onAdd,
  onViewAll,
  className,
  productPrices,
}: SocialMediaProductsGridProps) {
  const { isRTL } = useDirection();
  const { getPromotionForProduct, getSiteWidePromotion } = usePromotions();
  const siteWidePromotion = getSiteWidePromotion();
  
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    direction: isRTL ? "rtl" : "ltr",
    slidesToScroll: 1
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className={cn("py-8 sm:py-10 lg:py-12 px-6 lg:px-[100px] bg-transparent", className)}>
      <div className="max-w-[1400px] mx-auto">
        {/* Section Title */}
        <div className="mb-8 text-center animate-fadeIn">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
            پرفروش‌ترین محصولات سوشیال مدیا
          </h2>
          <p className="text-white/70 text-sm sm:text-base">
            اکانت‌های اینستاگرام، تیک‌تاک، تلگرام و بیشتر
          </p>
        </div>

        {/* Product Carousel */}
        <div className="relative">
          <div 
            className="overflow-hidden animate-fadeIn" 
            ref={emblaRef}
          >
            <div className="flex gap-4 md:gap-5 py-[5px]">
              {products.slice(0, 8).map(product => {
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
                    className="flex-[0_0_75%] sm:flex-[0_0_45%] md:flex-[0_0_38%] lg:flex-[0_0_24%] min-w-0"
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

          {/* Navigation Arrows */}
          <button 
            onClick={scrollPrev} 
            className={cn(
              "absolute top-1/2 -translate-y-1/2 z-10",
              "glass w-10 h-10 rounded-full border border-white/35",
              "flex items-center justify-center",
              "hover:bg-white/10 transition-all duration-200",
              isRTL ? "right-2" : "left-2"
            )}
          >
            <ChevronLeft className={cn("h-5 w-5 text-white", isRTL && "rotate-180")} />
          </button>
          <button 
            onClick={scrollNext} 
            className={cn(
              "absolute top-1/2 -translate-y-1/2 z-10",
              "glass w-10 h-10 rounded-full border border-white/35",
              "flex items-center justify-center",
              "hover:bg-white/10 transition-all duration-200",
              isRTL ? "left-2" : "right-2"
            )}
          >
            <ChevronRight className={cn("h-5 w-5 text-white", isRTL && "rotate-180")} />
          </button>
        </div>

        {/* View All Link */}
        {products.length > 8 && (
          <div className="mt-6 text-center animate-fadeIn" style={{ animationDelay: '200ms' }}>
            <Button onClick={onViewAll} variant="viewAll" size="lg" className="rounded-2xl">
              {isRTL ? "مشاهده همه" : "View All"}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
