import { useCallback } from "react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { SectionHeader } from "@/components/ui/section-header";
import { EduProductCard } from "./EduProductCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
const springTransition = {
  type: "spring" as const,
  stiffness: 220,
  damping: 28
};
interface EduProductItem {
  id: string;
  provider: "Coursera" | "Udemy" | "YouTube Premium" | "Skillshare";
  title: string;
  image: string;
  price: number;
  duration: string;
}
interface EduProductsSliderProps {
  items: EduProductItem[];
  onAdd: (id: string) => void;
  rtl?: boolean;
  onViewAll?: () => void;
}
export function EduProductsSlider({
  items,
  onAdd,
  rtl = false,
  onViewAll
}: EduProductsSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    direction: rtl ? "rtl" : "ltr",
    align: "start",
    slidesToScroll: 1,
    breakpoints: {
      "(min-width: 640px)": {
        slidesToScroll: 2
      },
      "(min-width: 1024px)": {
        slidesToScroll: 3
      }
    }
  });
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  return <section className="relative py-8 sm:py-10 lg:py-12 px-6 lg:px-[100px] overflow-hidden bg-transparent">
      <div className="max-w-[1400px] relative z-10 mx-[10px]">
        <SectionHeader title="مرکز آموزش هوش مصنوعی" eyebrow="برترین محصولات آموزشی" className="mb-6" />

        <div className="relative group">
          {/* Carousel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4 sm:gap-6 lg:gap-8 touch-pan-y">
              {items.map((item, index) => <motion.div key={item.id} className="flex-[0_0_100%] sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-21.33px)] min-w-0" initial={{
              opacity: 0,
              x: rtl ? -30 : 30
            }} animate={{
              opacity: 1,
              x: 0
            }} transition={{
              ...springTransition,
              delay: index * 0.05
            }}>
                  <EduProductCard id={item.id} provider={item.provider} title={item.title} image={item.image} price={item.price} duration={item.duration} onAdd={onAdd} />
                </motion.div>)}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button onClick={scrollPrev} className={cn("absolute top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full glass flex items-center justify-center", "border border-white/35 transition-all duration-200", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green", "hover:bg-accent-green/20 hover:border-accent-green/40 active:scale-95", "disabled:opacity-35 disabled:cursor-not-allowed", "ltr:left-2 rtl:right-2")} aria-label="Previous slide">
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-accent-green ltr:block rtl:hidden" />
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-accent-green ltr:hidden rtl:block" />
          </button>
          <button onClick={scrollNext} className={cn("absolute top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full glass flex items-center justify-center", "border border-white/35 transition-all duration-200", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green", "hover:bg-accent-green/20 hover:border-accent-green/40 active:scale-95", "disabled:opacity-35 disabled:cursor-not-allowed", "ltr:right-2 rtl:left-2")} aria-label="Next slide">
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-accent-green ltr:block rtl:hidden" />
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-accent-green ltr:hidden rtl:block" />
          </button>
        </div>

        {onViewAll && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0.3 }}
            className="flex justify-center mt-8"
          >
            <Button
              onClick={onViewAll}
              variant="viewAll"
              size="lg"
              className="w-full sm:w-auto rounded-2xl"
            >
              مشاهده همه
            </Button>
          </motion.div>
        )}
      </div>
    </section>;
}