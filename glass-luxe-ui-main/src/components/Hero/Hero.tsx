import { useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { SurfaceGlass } from "@/components/ui/surface-glass";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDirection } from "@/contexts/DirectionContext";
import PixelStarfield from "./PixelStarfield";

const springTransition = {
  type: "spring" as const,
  stiffness: 220,
  damping: 28,
};

interface PromoSlide {
  title: string;
  subtitle: string;
  image: string;
  cta: {
    label: string;
    href: string;
  };
}

interface MainSlide {
  kicker?: string;
  title: string;
  subtitle: string;
  image: string;
  ctaPrimary: {
    label: string;
    href: string;
  };
  ctaSecondary?: {
    label: string;
    href: string;
  };
}

interface HeroProps {
  leftSlides: PromoSlide[];
  mainSlides: MainSlide[];
  rightSlides: PromoSlide[];
}

const PromoSlider = ({ slides, position }: { slides: PromoSlide[]; position: "left" | "right" }) => {
  const { isRTL } = useDirection();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, direction: isRTL ? "rtl" : "ltr" });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <SurfaceGlass className="relative overflow-hidden h-full group">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => (
            <motion.div
              key={index}
              className="flex-[0_0_100%] min-w-0 relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...springTransition, delay: position === "left" ? 0.2 : 0.4 }}
            >
              <div className="aspect-[4/5] relative overflow-hidden rounded-xl">
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent z-10" />
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20 space-y-3">
                  <h3 className="text-xl font-bold text-foreground leading-tight">
                    {slide.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {slide.subtitle}
                  </p>
                  <Button variant="primary" size="sm" className="w-full">
                    {slide.cta.label}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      {slides.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute top-1/2 ltr:left-2 rtl:right-2 -translate-y-1/2 z-30 w-8 h-8 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4 ltr:block rtl:hidden" />
            <ChevronRight className="h-4 w-4 ltr:hidden rtl:block" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute top-1/2 ltr:right-2 rtl:left-2 -translate-y-1/2 z-30 w-8 h-8 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4 ltr:block rtl:hidden" />
            <ChevronLeft className="h-4 w-4 ltr:hidden rtl:block" />
          </button>
        </>
      )}

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={cn(
              "w-1.5 h-1.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              selectedIndex === index
                ? "bg-primary w-4"
                : "bg-foreground/30"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </SurfaceGlass>
  );
};

const MainSlider = ({ slides }: { slides: MainSlide[] }) => {
  const { isRTL } = useDirection();
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, direction: isRTL ? "rtl" : "ltr" },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <SurfaceGlass className="relative overflow-hidden h-full">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => (
            <div key={index} className="flex-[0_0_100%] min-w-0">
              <div className="relative aspect-[16/10] lg:aspect-[16/9] overflow-hidden rounded-2xl">
                {/* Image with parallax */}
                <motion.div
                  style={{ y }}
                  className="absolute inset-0 scale-110"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 z-10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Bloom effect */}
                  <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-primary/30 blur-[100px] rounded-full z-0" />
                </motion.div>

                {/* Content */}
                <div className="relative z-20 h-full flex flex-col justify-end p-8 lg:p-12">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...springTransition, delay: 0.3 }}
                    className="space-y-4 max-w-2xl"
                  >
                    {slide.kicker && (
                      <div className="inline-block px-4 py-1.5 glass-subtle rounded-full">
                        <span className="text-xs font-semibold tracking-wider uppercase text-primary">
                          {slide.kicker}
                        </span>
                      </div>
                    )}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                      {slide.subtitle}
                    </p>
                    <div className="flex flex-wrap gap-4 pt-4">
                      <Button variant="primary" size="lg">
                        {slide.ctaPrimary.label}
                      </Button>
                      {slide.ctaSecondary && (
                        <Button variant="outline" size="lg">
                          {slide.ctaSecondary.label}
                        </Button>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={cn(
              "h-2 rounded-full transition-all backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              selectedIndex === index
                ? "w-8 glass-strong border-primary/50"
                : "w-2 glass border-transparent"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </SurfaceGlass>
  );
};

export function Hero({ leftSlides, mainSlides, rightSlides }: HeroProps) {
  return (
    <section className="relative pt-36 pb-12 px-6 bg-transparent overflow-hidden">
      <PixelStarfield />
      <div className="relative z-10 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Promo Slider */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={springTransition}
            className="lg:col-span-3"
          >
            <PromoSlider slides={leftSlides} position="left" />
          </motion.div>

          {/* Main Hero Slider */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0.1 }}
            className="lg:col-span-6"
          >
            <MainSlider slides={mainSlides} />
          </motion.div>

          {/* Right Promo Slider */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...springTransition, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <PromoSlider slides={rightSlides} position="right" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
