import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { SectionHeader } from "@/components/ui/section-header";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { useDirection } from "@/contexts/DirectionContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";


interface Product {
  id: string;
  title: string;
  image: string;
  price: number;
}

interface SpecialOffersProps {
  products: Product[];
  onAdd: (id: string) => void;
  onViewAll?: () => void;
  className?: string;
}

export function SpecialOffers({ products, onAdd, onViewAll, className }: SpecialOffersProps) {
  const { isRTL } = useDirection();
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
              {products.slice(0, 3).map((product, index) => (
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
                    onAdd={onAdd}
                  />
                </div>
              ))}
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
