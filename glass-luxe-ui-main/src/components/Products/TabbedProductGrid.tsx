import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDirection } from "@/contexts/DirectionContext";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import useEmblaCarousel from "embla-carousel-react";
import type { ProductPrices } from "@/lib/medusa-prices";

const springTransition = {
  type: "spring" as const,
  stiffness: 220,
  damping: 28
};
interface Product {
  id: string;
  title: string;
  image: string;
  price: number;
  category: string;
  slug?: string;
}
interface TabbedProductGridProps {
  products: Product[];
  productPrices?: Record<string, ProductPrices>;
  onAdd: (id: string) => void;
  onViewAll: (category: string) => void;
  className?: string;
}
const categories = [{
  id: "ai",
  labelFa: "هوش مصنوعی",
  labelEn: "AI Tools"
}, {
  id: "social",
  labelFa: "سوشیال مدیا",
  labelEn: "Social Media"
}, {
  id: "music",
  labelFa: "موسیقی",
  labelEn: "Music"
}, {
  id: "edu",
  labelFa: "آموزشی",
  labelEn: "Education"
}, {
  id: "sim",
  labelFa: "سیم‌کارت",
  labelEn: "SIM Cards"
}];
export function TabbedProductGrid({
  products,
  productPrices,
  onAdd,
  onViewAll,
  className
}: TabbedProductGridProps) {
  const {
    isRTL
  } = useDirection();
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    direction: isRTL ? "rtl" : "ltr",
    slidesToScroll: 1
  });

  // Debug logging
  console.log('[TabbedProductGrid] 🎯 Render with:', {
    totalProducts: products?.length || 0,
    activeCategory,
    hasPrices: !!productPrices && Object.keys(productPrices).length > 0,
    priceKeys: productPrices ? Object.keys(productPrices) : []
  });
  
  if (products?.length > 0) {
    console.log('[TabbedProductGrid] 📦 All product categories:', [...new Set(products.map(p => p.category))]);
    console.log('[TabbedProductGrid] 📦 Sample product:', products[0]);
  }

  const filteredProducts = products.filter(p => p.category === activeCategory).slice(0, 8);
  
  console.log(`[TabbedProductGrid] 🔍 Filtered for "${activeCategory}":`, filteredProducts.length, 'products');
  if (filteredProducts.length === 0 && products?.length > 0) {
    console.log(`[TabbedProductGrid] ⚠️ No products match category "${activeCategory}". Available categories:`, [...new Set(products.map(p => p.category))]);
  }
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);
  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);
  return <section className={cn("py-8 sm:py-10 lg:py-12 px-6 lg:px-[100px] bg-transparent", className)}>
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={springTransition} className="mb-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-2">
            محصولات ما
          </h2>
          <p className="text-foreground/70 text-sm sm:text-base">
            انتخاب بر اساس دسته‌بندی
          </p>
        </motion.div>

        {/* Category Tabs */}
        <div className="mb-8 flex justify-center px-4 sm:px-0">
          <div className="glass flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-2xl border border-white/35 w-full sm:w-auto max-w-full">
            {categories.map(cat => <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={cn("px-2.5 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm md:text-base font-medium transition-all duration-200 whitespace-nowrap", activeCategory === cat.id ? "bg-white/20 text-white border border-white/25" : "text-white/70 hover:text-white/90 hover:bg-white/5")}>
                {isRTL ? cat.labelFa : cat.labelEn}
              </button>)}
          </div>
        </div>

        {/* Product Carousel */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div key={activeCategory} initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} exit={{
            opacity: 0
          }} transition={springTransition} className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-4 md:gap-5 py-[5px]">
                {filteredProducts.map(product => (
                  <div key={product.id} className="flex-[0_0_75%] sm:flex-[0_0_45%] md:flex-[0_0_38%] lg:flex-[0_0_24%] min-w-0">
                    <ProductCard 
                      id={product.id} 
                      title={product.title} 
                      image={product.image} 
                      price={product.price}
                      slug={product.slug}
                      medusaVariants={product.slug && productPrices ? productPrices[product.slug]?.variants : undefined}
                      onAdd={onAdd} 
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button onClick={scrollPrev} className={cn("absolute top-1/2 -translate-y-1/2 z-10", "glass w-10 h-10 rounded-full border border-white/35", "flex items-center justify-center", "hover:bg-white/10 transition-all duration-200", isRTL ? "right-2" : "left-2")}>
            <ChevronLeft className={cn("h-5 w-5 text-white", isRTL && "rotate-180")} />
          </button>
          <button onClick={scrollNext} className={cn("absolute top-1/2 -translate-y-1/2 z-10", "glass w-10 h-10 rounded-full border border-white/35", "flex items-center justify-center", "hover:bg-white/10 transition-all duration-200", isRTL ? "left-2" : "right-2")}>
            <ChevronRight className={cn("h-5 w-5 text-white", isRTL && "rotate-180")} />
          </button>
        </div>

        {/* View All Link */}
        <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        ...springTransition,
        delay: 0.3
      }} className="mt-8 text-center">
          <Button onClick={() => onViewAll(activeCategory)} variant="viewAll" size="lg" className="rounded-2xl">
            <span>مشاهده همه</span>
            <ArrowLeft className={cn("h-4 w-4 transition-transform group-hover:-translate-x-1", isRTL && "rotate-180")} />
          </Button>
        </motion.div>
      </div>
    </section>;
}