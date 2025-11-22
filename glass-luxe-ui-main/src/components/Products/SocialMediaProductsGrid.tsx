import { useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { useDirection } from "@/contexts/DirectionContext";
import { cn } from "@/lib/utils";
import useEmblaCarousel from "embla-carousel-react";
interface Product {
  id: string;
  title: string;
  image: string;
  price: number;
}
interface SocialMediaProductsGridProps {
  products: Product[];
  onAdd: (id: string) => void;
  onViewAll: () => void;
  className?: string;
}
const springTransition = {
  type: "spring" as const,
  stiffness: 220,
  damping: 28
};
export function SocialMediaProductsGrid({
  products,
  onAdd,
  onViewAll,
  className
}: SocialMediaProductsGridProps) {
  const {
    isRTL
  } = useDirection();
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
  return <section className={cn("py-8 sm:py-10 lg:py-12 px-4 md:px-6 lg:px-8 bg-transparent", className)}>
      <div className="max-w-[1100px] mx-auto">
        {/* Section Title */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={springTransition} className="mb-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
            {isRTL ? "پرفروش‌ترین محصولات سوشیال مدیا" : "Best-Selling Social Media Products"}
          </h2>
          <p className="text-white/70 text-sm sm:text-base">
            {isRTL ? "اکانت‌های اینستاگرام، تیک‌تاک، تلگرام و بیشتر" : "Instagram, TikTok, Telegram accounts and more"}
          </p>
        </motion.div>

        {/* Product Carousel */}
        <div className="relative">
          <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={springTransition} className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4 md:gap-5 py-[5px]">
              {products.slice(0, 8).map(product => <div key={product.id} className="flex-[0_0_75%] sm:flex-[0_0_45%] md:flex-[0_0_38%] lg:flex-[0_0_24%] min-w-0">
                  <ProductCard id={product.id} title={product.title} image={product.image} price={product.price} onAdd={onAdd} />
                </div>)}
            </div>
          </motion.div>

          {/* Navigation Arrows */}
          <button onClick={scrollPrev} className={cn("absolute top-1/2 -translate-y-1/2 z-10", "glass w-10 h-10 rounded-full border border-white/35", "flex items-center justify-center", "hover:bg-white/10 transition-all duration-200", isRTL ? "right-2" : "left-2")}>
            <ChevronLeft className={cn("h-5 w-5 text-white", isRTL && "rotate-180")} />
          </button>
          <button onClick={scrollNext} className={cn("absolute top-1/2 -translate-y-1/2 z-10", "glass w-10 h-10 rounded-full border border-white/35", "flex items-center justify-center", "hover:bg-white/10 transition-all duration-200", isRTL ? "left-2" : "right-2")}>
            <ChevronRight className={cn("h-5 w-5 text-white", isRTL && "rotate-180")} />
          </button>
        </div>

        {/* View All Link */}
        {products.length > 8 && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        ...springTransition,
        delay: 0.2
      }} className="mt-6 text-center">
            <Button onClick={onViewAll} variant="viewAll" size="lg" className="rounded-2xl">
              {isRTL ? "مشاهده همه" : "View All"}
            </Button>
          </motion.div>}
      </div>
    </section>;
}