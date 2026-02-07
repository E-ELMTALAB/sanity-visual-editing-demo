import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Check,
  Truck,
  Shield,
  RefreshCw,
  Star,
  ChevronRight,
} from "lucide-react";
import { SurfaceGlass } from "@/components/ui/surface-glass";
import { Price } from "@/components/ui/price";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CountdownTimer } from "@/components/ui/countdown-timer";
import { BonusGiftBox } from "./BonusGiftBox";
import { useDirection } from "@/contexts/DirectionContext";
import { usePromotions } from "@/contexts/promotion-context";
import { cn } from "@/lib/utils";
import { toPersianNumber, calculateDiscountedPrice } from "@/lib/medusa-promotions";

const springTransition = {
  type: "spring" as const,
  stiffness: 220,
  damping: 28,
};

interface ProductVariant {
  id: string;
  name: string;
  nameFa: string;
  price?: number;
  inStock?: boolean;
}

interface MedusaVariant {
  variant_id: string;
  name: string;
  price: number;
}

interface ProductDetailHeroSectionProps {
  product: {
    id: string;
    slug?: string;
    title: string;
    titleFa: string;
    image: string;
    images: string[];
    badge?: string;
    rating?: number;
    reviewCount?: number;
    features: string[];
    featuresFa: string[];
    variants?: ProductVariant[];
  };
  medusaVariants?: MedusaVariant[];
  selectedVariant: string | null;
  onVariantSelect: (variantId: string) => void;
  onBuyClick: () => void;
  currentPrice: number;
  originalPrice?: number;
  productPromotion?: {
    discountPercentage?: number;
    discountedPrice: number;
    originalPrice: number;
    endsAt?: string;
    promotion?: any;
  } | null;
  className?: string;
}

export function ProductDetailHeroSection({
  product,
  medusaVariants = [],
  selectedVariant,
  onVariantSelect,
  onBuyClick,
  currentPrice,
  originalPrice,
  productPromotion,
  className,
}: ProductDetailHeroSectionProps) {
  const { isRTL } = useDirection();
  const stickyRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  // Get available variants
  const availableVariants =
    medusaVariants.length > 0
      ? medusaVariants
      : product.variants || [];

  const hasVariants = availableVariants.length > 0;
  const shouldShowPrice = !hasVariants || selectedVariant;
  const shouldShowBuyButton = !hasVariants || selectedVariant;

  // Calculate prices with promotion
  const finalCurrentPrice = productPromotion
    ? productPromotion.discountedPrice
    : currentPrice;
  const finalOriginalPrice = productPromotion
    ? productPromotion.originalPrice
    : originalPrice && originalPrice > currentPrice
    ? originalPrice
    : undefined;

  const discountPercentage = productPromotion?.discountPercentage;

  // Gallery images
  const galleryImages =
    product.images.length > 0 ? product.images : product.image ? [product.image] : [];
  const currentImage = galleryImages[selectedImage] || galleryImages[0] || "";

  // Features (prefer Fa, fallback to regular)
  const features = product.featuresFa.length > 0 ? product.featuresFa : product.features;

  return (
    <section dir="rtl" className={cn("w-full", className)}>
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-6">
        <SurfaceGlass className="rounded-2xl p-4 md:p-6 lg:p-8">
          <div className="flex flex-col md:flex-row-reverse gap-8 min-w-0 md:items-start">
            {/* Product Info Column - Sticky on Desktop */}
            <div
              ref={stickyRef}
              className="w-full md:w-[45%] md:sticky md:top-[100px] min-w-0 order-last md:order-none"
              dir="rtl"
            >
              {/* Breadcrumb */}
              <nav className="mb-3 text-xs sm:text-sm text-muted-foreground flex items-center gap-2 flex-wrap flex-row-reverse justify-start">
                <Link
                  to="/"
                  className="hover:text-foreground transition-colors whitespace-nowrap"
                >
                  خانه
                </Link>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 shrink-0 rotate-180" />
                <Link
                  to="/products"
                  className="hover:text-foreground transition-colors whitespace-nowrap"
                >
                  محصولات
                </Link>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 shrink-0 rotate-180" />
                <span className="text-foreground line-clamp-1">{product.titleFa || product.title}</span>
              </nav>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 break-words text-right">
                {product.titleFa || product.title}
              </h1>

              {/* Rating */}
              <a
                href="#reviews"
                className="inline-flex items-center gap-2 text-sm hover:text-primary transition-colors mb-3 flex-row-reverse"
              >
                <div className="flex items-center gap-1 flex-row-reverse">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-500 text-yellow-500"
                    />
                  ))}
                </div>
                <span className="font-semibold">
                  {toPersianNumber(product.rating?.toFixed(1) || "4.9")}
                </span>
                <span className="text-muted-foreground">
                  ({toPersianNumber(product.reviewCount?.toString() || "128")} نظر)
                </span>
              </a>

              {/* Discount Badge with Animation */}
              {productPromotion && discountPercentage && discountPercentage > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={springTransition}
                  className="mb-3 flex items-center gap-2 flex-row-reverse"
                >
                  <Badge className="bg-[#EF4444] text-white px-3 py-1 text-sm font-bold">
                    تخفیف
                  </Badge>
                  {/* Discount Percent Pill */}
                  <motion.span
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ ...springTransition, delay: 0.1 }}
                    className="inline-flex items-center rounded-full bg-[#EF4444] text-white text-xs font-bold px-2 py-0.5"
                  >
                    {toPersianNumber(discountPercentage)}٪
                  </motion.span>
                </motion.div>
              )}

              {/* Price Block */}
              {shouldShowPrice && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={springTransition}
                  className="mb-3"
                >
                  <Price
                    current={finalCurrentPrice}
                    old={finalOriginalPrice}
                    discountPercentage={discountPercentage}
                    className="text-xl sm:text-2xl"
                    variant={productPromotion ? "promotional" : "default"}
                  />
                </motion.div>
              )}

              {/* Countdown Timer */}
              {productPromotion?.endsAt && discountPercentage && discountPercentage > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={springTransition}
                  className="mb-3"
                >
                  <div className="text-sm text-muted-foreground mb-2">پایان تخفیف:</div>
                  <CountdownTimer endsAt={productPromotion.endsAt} size="md" variant="default" />
                </motion.div>
              )}

              {/* Features List - Modern Minimal Design */}
              {features.length > 0 && (
                <div className="mb-6 space-y-3.5" dir="rtl">
                  {features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 text-sm group"
                      style={{ direction: "rtl" }}
                    >
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center transition-all group-hover:bg-green-500/15 group-hover:border-green-500/30">
                        <Check className="w-3.5 h-3.5 text-green-400" strokeWidth={2.5} />
                      </div>
                      <span className="text-foreground/90 leading-relaxed flex-1 transition-colors group-hover:text-foreground">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Bonus Gift Box */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...springTransition, delay: 0.1 }}
                className="mt-6"
              >
                <BonusGiftBox />
              </motion.div>

              {/* Buy Button */}
              {shouldShowBuyButton && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...springTransition, delay: 0.15 }}
                  className="mt-3 sm:mt-4 mb-6"
                >
                  <Button
                    size="lg"
                    onClick={onBuyClick}
                    className="w-full text-base font-semibold active:scale-95 transition-transform"
                  >
                    <ShoppingCart className="ml-2 h-4 w-4 shrink-0" />
                    <span>خرید</span>
                  </Button>
                </motion.div>
              )}

              {/* Policy Microcopy */}
              <p className="text-xs text-muted-foreground text-right break-words mb-6">
                تحویل فوری دیجیتال • پشتیبانی ۲۴ ساعته • ضمانت بازگشت وجه • دسترسی دائمی
              </p>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-[hsl(var(--border-glass))]">
                <div className="flex flex-col items-center text-center gap-1 sm:gap-2">
                  <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-primary shrink-0" />
                  <span className="text-xs text-muted-foreground break-words">تحویل فوری</span>
                </div>
                <div className="flex flex-col items-center text-center gap-1 sm:gap-2">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary shrink-0" />
                  <span className="text-xs text-muted-foreground break-words">پرداخت امن</span>
                </div>
                <div className="flex flex-col items-center text-center gap-1 sm:gap-2">
                  <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 text-primary shrink-0" />
                  <span className="text-xs text-muted-foreground break-words">پشتیبانی کامل</span>
                </div>
              </div>
            </div>

            {/* Image Column */}
            <div className="w-full md:w-[55%] space-y-4 min-w-0 order-first md:order-none">
              {/* Main Image */}
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="relative aspect-square rounded-2xl overflow-hidden glass w-full"
              >
                <img
                  src={currentImage}
                  alt={product.titleFa || product.title}
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
                {/* Badge */}
                {product.badge && (
                  <div className="absolute top-4 right-4">
                    <Badge
                      variant={product.badge as "sale" | "new" | "hot"}
                      className="bg-[#EF4444] text-white"
                    >
                      {product.badge === "sale" && "تخفیف"}
                      {product.badge === "new" && "جدید"}
                      {product.badge === "hot" && "داغ"}
                    </Badge>
                  </div>
                )}
              </motion.div>

              {/* Variant Selection */}
              {hasVariants && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {availableVariants.map((variant, idx) => {
                      const variantId =
                        medusaVariants.length > 0
                          ? (variant as MedusaVariant).variant_id
                          : (variant as ProductVariant).id;
                      const variantName =
                        medusaVariants.length > 0
                          ? (variant as MedusaVariant).name
                          : isRTL
                          ? (variant as ProductVariant).nameFa
                          : (variant as ProductVariant).name;
                      const variantPrice =
                        medusaVariants.length > 0
                          ? (variant as MedusaVariant).price
                          : (variant as ProductVariant).price || 0;
                      const variantInStock =
                        medusaVariants.length > 0
                          ? true
                          : (variant as ProductVariant).inStock !== false;

                      // Calculate discounted price if promotion exists
                      let originalVariantPrice = variantPrice;
                      let discountedVariantPrice = variantPrice;
                      if (productPromotion && productPromotion.promotion && variantPrice > 0) {
                        discountedVariantPrice = calculateDiscountedPrice(
                          variantPrice,
                          productPromotion.promotion
                        );
                      }

                      const isSelected = selectedVariant === variantId;
                      const isOutOfStock = !variantInStock;

                      return (
                        <motion.button
                          key={variantId}
                          type="button"
                          onClick={() => !isOutOfStock && onVariantSelect(variantId)}
                          disabled={isOutOfStock}
                          className={cn(
                            "relative p-4 rounded-xl border-2 transition-all duration-200 text-right",
                            "hover:scale-[1.02] active:scale-[0.98]",
                            isSelected
                              ? "border-primary bg-primary/10 shadow-[0_10px_25px_-5px_hsl(var(--primary)/0.2)]"
                              : "border-[hsl(var(--border))] bg-[hsl(var(--surface-glass))] bg-opacity-30",
                            isOutOfStock && "opacity-50 cursor-not-allowed hover:scale-100"
                          )}
                        >
                          {/* Selected Check Icon */}
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center"
                            >
                              <Check className="w-3 h-3 text-primary-foreground" />
                            </motion.div>
                          )}

                          {/* Out of Stock Overlay */}
                          {isOutOfStock && (
                            <div className="absolute inset-0 bg-background/80 rounded-xl flex items-center justify-center z-10">
                              <span className="text-muted-foreground text-sm font-medium">
                                ناموجود
                              </span>
                            </div>
                          )}

                          <div className="flex flex-col gap-2">
                            <span className="text-sm font-semibold text-foreground">
                              {variantName}
                            </span>
                            <div className="flex items-center gap-1.5 flex-row-reverse justify-start">
                              <span
                                className={cn(
                                  "text-base sm:text-lg font-bold",
                                  productPromotion && discountedVariantPrice < originalVariantPrice
                                    ? "text-[#4ADE80]"
                                    : "text-primary"
                                )}
                              >
                                {toPersianNumber(
                                  new Intl.NumberFormat("fa-IR").format(discountedVariantPrice)
                                )}
                              </span>
                              <span className="text-xs text-muted-foreground">تومان</span>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </SurfaceGlass>
      </div>
    </section>
  );
}

