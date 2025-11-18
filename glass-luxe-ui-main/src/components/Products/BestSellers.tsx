import { useCallback } from "react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { useDirection } from "@/contexts/DirectionContext";
import { cn } from "@/lib/utils";
const springTransition = {
  type: "spring" as const,
  stiffness: 220,
  damping: 28
};
interface Product {
  id: string;
  title: string;
  image: string;
  oldPrice?: number;
  price: number;
  discountPct?: number;
  badge?: string;
  slug?: string;
}
interface BestSellersProps {
  products: Product[];
  onAdd: (id: string) => void;
  className?: string;
}
export function BestSellers({
  products,
  onAdd,
  className
}: BestSellersProps) {
  const {
    isRTL
  } = useDirection();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    direction: isRTL ? "rtl" : "ltr",
    align: "start",
    slidesToScroll: 1,
    breakpoints: {
      "(min-width: 640px)": {
        slidesToScroll: 1
      },
      "(min-width: 768px)": {
        slidesToScroll: 1
      },
      "(min-width: 1024px)": {
        slidesToScroll: 1
      }
    }
  });
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);
  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);
  return <section className={cn("relative py-8 sm:py-10 lg:py-12 px-2 md:px-3 lg:px-4 bg-transparent", className)}>
      <div className="max-w-[1100px] mx-auto">
        {/* Section Header */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={springTransition} className="mb-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-2">
            محصولات منتخب
          </h2>
          <p className="text-foreground/70 text-sm sm:text-base">
            پرفروش‌ترین محصولات ما
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4 sm:gap-5 lg:gap-6 touch-pan-y py-[5px]">
              {products.map((product, index) => <motion.div key={product.id} className="flex-[0_0_75%] sm:flex-[0_0_45%] md:flex-[0_0_38%] lg:flex-[0_0_24%] min-w-0" initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              ...springTransition,
              delay: index * 0.05
            }}>
                  <ProductCard id={product.id} title={product.title} image={product.image} oldPrice={product.oldPrice} price={product.price} discountPct={product.discountPct} slug={product.slug} onAdd={onAdd} />
                </motion.div>)}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button onClick={scrollPrev} className={cn("absolute top-1/2 -translate-y-1/2 z-10", "glass rounded-full p-2.5 border border-white/35", "hover:bg-white/15 transition-all duration-200", isRTL ? "right-2" : "left-2")} aria-label="Previous">
            <ChevronLeft className={cn("h-5 w-5 text-white", isRTL && "rotate-180")} />
          </button>

          <button onClick={scrollNext} className={cn("absolute top-1/2 -translate-y-1/2 z-10", "glass rounded-full p-2.5 border border-white/35", "hover:bg-white/15 transition-all duration-200", isRTL ? "left-2" : "right-2")} aria-label="Next">
            <ChevronRight className={cn("h-5 w-5 text-white", isRTL && "rotate-180")} />
          </button>
        </div>
      </div>
    </section>;
}