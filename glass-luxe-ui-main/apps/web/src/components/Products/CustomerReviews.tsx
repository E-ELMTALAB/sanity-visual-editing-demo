import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ZoomIn, Send, Instagram, MessageCircle, X, ChevronLeft, ChevronRight } from "lucide-react";
import { SurfaceGlass } from "@/components/ui/surface-glass";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, type CarouselApi } from "@/components/ui/carousel";
import { useDirection } from "@/contexts/DirectionContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export interface CustomerReview {
  id: string;
  text: string;
  screenshot?: string;
  source: {
    platform: "telegram" | "instagram" | "whatsapp";
    label: string;
    url: string;
  };
}

interface CustomerReviewsProps {
  reviews: CustomerReview[];
  className?: string;
}

const springTransition = {
  type: "spring" as const,
  stiffness: 220,
  damping: 28,
};

export function CustomerReviews({ reviews, className }: CustomerReviewsProps) {
  const { isRTL } = useDirection();
  const isMobile = useIsMobile();
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = useCallback((image: string) => {
    setLightboxImage(image);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxImage(null);
  }, []);

  // Keep currentIndex in bounds when reviews change (mobile-only logic)
  useEffect(() => {
    if (!reviews.length) {
      setCurrentIndex(0);
      return;
    }
    setCurrentIndex((prev) => {
      if (prev < 0) return 0;
      if (prev > reviews.length - 1) return reviews.length - 1;
      return prev;
    });
  }, [reviews.length]);

  // Reinitialize carousel on resize and after mount to fix mobile navigation issues
  useEffect(() => {
    // Only needed for desktop/tablet carousel behavior
    if (!api || !reviews.length || isMobile) return;

    let resizeTimer: NodeJS.Timeout;

    // Reinitialize after mount to ensure proper width calculations
    // Use requestAnimationFrame to ensure DOM is fully rendered
    const initCarousel = () => {
      requestAnimationFrame(() => {
        try {
          // Reinit to recalculate slide widths and positions
          api.reInit();
        } catch (error) {
          console.warn('[CustomerReviews] Carousel reinit error:', error);
        }
      });
    };

    // Initial reinit after mount
    const initTimer = setTimeout(initCarousel, 150);

    // Also reinit after a short delay to catch any late renders
    const delayedInit = setTimeout(initCarousel, 300);

    const handleResize = () => {
      // Debounce resize events
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        requestAnimationFrame(() => {
          try {
            api.reInit();
          } catch (error) {
            console.warn('[CustomerReviews] Carousel resize reinit error:', error);
          }
        });
      }, 150);
    };

    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      clearTimeout(initTimer);
      clearTimeout(delayedInit);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, [api, reviews.length, isMobile]);

  const handlePrevMobile = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const handleNextMobile = useCallback(() => {
    setCurrentIndex((prev) => (prev < reviews.length - 1 ? prev + 1 : prev));
  }, [reviews.length]);

  const getPlatformIcon = (platform: string) => {
    const iconSize = "w-[14px] h-[14px]";
    switch (platform) {
      case "telegram":
        return (
          <Send
            className={cn(iconSize, "transition-opacity duration-200 group-hover/source:opacity-100")}
            style={{ color: "#38BDF8", opacity: 0.6 }}
          />
        );
      case "instagram":
        return (
          <Instagram
            className={cn(iconSize, "transition-opacity duration-200 group-hover/source:opacity-100")}
            style={{ color: "#F472B6", opacity: 0.6 }}
          />
        );
      case "whatsapp":
        return (
          <MessageCircle
            className={cn(iconSize, "transition-opacity duration-200 group-hover/source:opacity-100")}
            style={{ color: "#4ADE80", opacity: 0.6 }}
          />
        );
      default:
        return null;
    }
  };

  if (!reviews || reviews.length === 0) {
    return null;
  }

  const renderReviewCard = (review: CustomerReview, index: number) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        ...springTransition,
        delay: index * 0.05,
      }}
      className="h-full flex flex-col"
    >
      <div
        className={cn(
          "flex-1 p-5 md:p-3 rounded-xl border transition-colors duration-300",
          "hover:border-primary/30",
          "backdrop-blur-sm"
        )}
        style={{
          borderColor: "hsl(var(--border-glass))",
          backgroundColor: "hsl(var(--surface-glass) / 0.5)",
        }}
      >
        {/* Screenshot Container */}
        <div className="relative aspect-[4/3] rounded-lg mb-4 md:mb-2 overflow-hidden cursor-pointer group">
          {review.screenshot ? (
            <>
              <img
                src={review.screenshot}
                alt="Review screenshot"
                className="w-full h-full object-contain object-center"
                loading="lazy"
                onClick={() => openLightbox(review.screenshot!)}
              />
              {/* Glass gradient background */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(to bottom, hsl(var(--muted) / 0.2), hsl(var(--muted) / 0.1), hsl(var(--primary) / 0.05))",
                }}
              />
              {/* Hover overlay */}
              <div
                className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-opacity duration-200 flex items-center justify-center cursor-pointer"
                onClick={() => openLightbox(review.screenshot!)}
              >
                <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center border border-dashed border-border rounded-lg">
              <span className="font-vazirmatn text-[14px] md:text-[12px] font-normal leading-[1.5] text-muted-foreground">
                اسکرین‌شات نظر
              </span>
            </div>
          )}
        </div>

        {/* Quote Icon */}
        <div className="mb-3 md:mb-2 flex justify-start">
          <Quote
            className="w-8 h-8 md:w-5 md:h-5"
            style={{
              color: "hsl(var(--primary) / 0.4)",
              transform: "rotate(180deg)",
            }}
          />
        </div>

        {/* Review Text */}
        <p className="font-vazirmatn text-[14px] md:text-[12px] font-normal leading-[1.625] text-foreground/90 flex-1 mb-4 md:mb-3">
          {review.text}
        </p>

        {/* Source Divider */}
        <div
          className="h-px border-t mb-3 md:mb-2"
          style={{ borderColor: "hsl(var(--border-glass))" }}
        />

        {/* Source Label */}
        <a
          href={review.source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 font-vazirmatn text-[12px] font-normal leading-[1.5] text-muted-foreground hover:text-foreground transition-colors duration-200 group/source"
        >
          {getPlatformIcon(review.source.platform)}
          <span className="group-hover/source:underline underline-offset-2">
            {review.source.label}
          </span>
        </a>
      </div>
    </motion.div>
  );

  return (
    <>
      <section dir="rtl" className={cn("py-10 md:py-4", className)}>
        <SurfaceGlass className="rounded-2xl overflow-hidden p-6 md:p-4">
          {/* Background accent gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(to bottom right, hsl(var(--primary) / 0.05), transparent, hsl(var(--accent) / 0.05))",
            }}
          />

          <div className="relative z-10">
            {/* Header */}
            <div className="mb-4 md:mb-3 text-center">
              <h2 className="font-vazirmatn text-[18px] md:text-[20px] lg:text-[24px] font-bold leading-[1.3] text-foreground">
                مورد اعتماد هزاران دانشجو
              </h2>
              <p className="font-vazirmatn text-[16px] md:text-[14px] font-normal leading-[1.5] text-muted-foreground hidden md:block mt-1">
                تجربه واقعی مشتریان از محصولات ما
              </p>
            </div>

            {/* Carousel / Mobile vs Desktop */}
            {isMobile ? (
              <>
                {renderReviewCard(reviews[currentIndex], currentIndex)}
                {reviews.length > 1 && (
                  <div className="flex justify-center items-center gap-4 md:gap-2 mt-8 md:mt-6 relative z-20 pb-2">
                    <button
                      type="button"
                      onClick={handlePrevMobile}
                      disabled={currentIndex === 0}
                      className={cn(
                        "static w-10 h-10 md:w-8 md:h-8 rounded-full",
                        "border hover:bg-primary hover:text-primary-foreground hover:border-primary",
                        "active:scale-95",
                        "transition-all duration-200 flex items-center justify-center",
                        "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:hover:bg-transparent disabled:hover:text-inherit",
                        "cursor-pointer z-20 pointer-events-auto"
                      )}
                      aria-label="قبلی"
                    >
                      {isRTL ? (
                        <ChevronRight className="w-5 h-5" />
                      ) : (
                        <ChevronLeft className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleNextMobile}
                      disabled={currentIndex === reviews.length - 1}
                      className={cn(
                        "static w-10 h-10 md:w-8 md:h-8 rounded-full",
                        "border hover:bg-primary hover:text-primary-foreground hover:border-primary",
                        "active:scale-95",
                        "transition-all duration-200 flex items-center justify-center",
                        "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:hover:bg-transparent.disabled:hover:text-inherit",
                        "cursor-pointer z-20 pointer-events-auto"
                      )}
                      aria-label="بعدی"
                    >
                      {isRTL ? (
                        <ChevronLeft className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Carousel
                key={`carousel-${reviews.length}-${isRTL}`}
                setApi={setApi}
                opts={{
                  align: "start",
                  direction: isRTL ? "rtl" : "ltr",
                  loop: true,
                  slidesToScroll: 1,
                  dragFree: false,
                  containScroll: "trimSnaps",
                  // Ensure proper slide calculations on mobile
                  watchDrag: true,
                }}
                className="w-full"
              >
                <CarouselContent className={isRTL ? "-mr-4 md:-mr-2" : "-ml-4 md:-ml-2"}>
                  {reviews.map((review, index) => {
                    // Ensure review exists before rendering
                    if (!review || !review.id) {
                      console.warn('[CustomerReviews] Invalid review at index:', index);
                      return null;
                    }

                    return (
                      <CarouselItem
                        key={review.id}
                        className={cn(
                          // Mobile: full width (1 slide), Desktop: half width (2 slides)
                          "basis-full sm:basis-1/2 lg:basis-1/2",
                          // Ensure proper spacing that matches CarouselContent negative margin
                          isRTL ? "pr-4 md:pr-2" : "pl-4 md:pl-2",
                          // Ensure slides don't shrink and maintain proper width
                          "min-w-0 shrink-0"
                        )}
                      >
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            ...springTransition,
                            delay: index * 0.05,
                          }}
                          className="h-full flex flex-col"
                        >
                          <div
                            className={cn(
                              "flex-1 p-5 md:p-3 rounded-xl border transition-colors duration-300",
                              "hover:border-primary/30",
                              "backdrop-blur-sm"
                            )}
                            style={{
                              borderColor: "hsl(var(--border-glass))",
                              backgroundColor: "hsl(var(--surface-glass) / 0.5)",
                            }}
                          >
                            {/* Screenshot Container */}
                            <div className="relative aspect-[4/3] rounded-lg mb-4 md:mb-2 overflow-hidden cursor-pointer group">
                              {review.screenshot ? (
                                <>
                                  <img
                                    src={review.screenshot}
                                    alt="Review screenshot"
                                    className="w-full h-full object-contain object-center"
                                    loading="lazy"
                                    onClick={() => openLightbox(review.screenshot!)}
                                  />
                                  {/* Glass gradient background */}
                                  <div
                                    className="absolute inset-0 pointer-events-none"
                                    style={{
                                      backgroundImage:
                                        "linear-gradient(to bottom, hsl(var(--muted) / 0.2), hsl(var(--muted) / 0.1), hsl(var(--primary) / 0.05))",
                                    }}
                                  />
                                  {/* Hover overlay */}
                                  <div
                                    className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-opacity duration-200 flex items-center justify-center cursor-pointer"
                                    onClick={() => openLightbox(review.screenshot!)}
                                  >
                                    <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                  </div>
                                </>
                              ) : (
                                <div className="w-full h-full flex items-center justify-center border border-dashed border-border rounded-lg">
                                  <span className="font-vazirmatn text-[14px] md:text-[12px] font-normal leading-[1.5] text-muted-foreground">
                                    اسکرین‌شات نظر
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Quote Icon */}
                            <div className="mb-3 md:mb-2 flex justify-start">
                              <Quote
                                className="w-8 h-8 md:w-5 md:h-5"
                                style={{
                                  color: "hsl(var(--primary) / 0.4)",
                                  transform: "rotate(180deg)"
                                }}
                              />
                            </div>

                            {/* Review Text */}
                            <p className="font-vazirmatn text-[14px] md:text-[12px] font-normal leading-[1.625] text-foreground/90 flex-1 mb-4 md:mb-3">
                              {review.text}
                            </p>

                            {/* Source Divider */}
                            <div
                              className="h-px border-t mb-3 md:mb-2"
                              style={{ borderColor: "hsl(var(--border-glass))" }}
                            />

                            {/* Source Label */}
                            <a
                              href={review.source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 font-vazirmatn text-[12px] font-normal leading-[1.5] text-muted-foreground hover:text-foreground transition-colors duration-200 group/source"
                            >
                              {getPlatformIcon(review.source.platform)}
                              <span className="group-hover/source:underline underline-offset-2">
                                {review.source.label}
                              </span>
                            </a>
                          </div>
                        </motion.div>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>

                {/* Navigation Buttons - Centered below carousel */}
                <div className="flex justify-center items-center gap-4 md:gap-2 mt-8 md:mt-6 relative z-20 pb-2">
                  {/* Previous button (visually right in RTL, scrolls to previous slide) */}
                  <CarouselPrevious
                    className={cn(
                      "static w-10 h-10 md:w-8 md:h-8 rounded-full",
                      "border hover:bg-primary hover:text-primary-foreground hover:border-primary",
                      "active:scale-95",
                      "transition-all duration-200 flex items-center justify-center",
                      "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:hover:bg-transparent disabled:hover:text-inherit",
                      "cursor-pointer z-20 pointer-events-auto"
                    )}
                    aria-label="قبلی"
                  />
                  {/* Next button (visually left in RTL, scrolls to next slide) */}
                  <CarouselNext
                    className={cn(
                      "static w-10 h-10 md:w-8 md:h-8 rounded-full",
                      "border hover:bg-primary hover:text-primary-foreground hover:border-primary",
                      "active:scale-95",
                      "transition-all duration-200 flex items-center justify-center",
                      "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:hover:bg-transparent disabled:hover:text-inherit",
                      "cursor-pointer z-20 pointer-events-auto"
                    )}
                    aria-label="بعدی"
                  />
                </div>
              </Carousel>
            )}
          </div>
        </SurfaceGlass>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              backdropFilter: "blur(4px)",
            }}
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 flex items-center justify-center z-10"
              aria-label="بستن"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Image */}
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              src={lightboxImage}
              alt="Review screenshot"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

