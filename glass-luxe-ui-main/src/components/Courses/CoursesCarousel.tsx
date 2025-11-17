import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { CourseCard } from "./CourseCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDirection } from "@/contexts/DirectionContext";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";
const springTransition = {
  type: "spring" as const,
  stiffness: 220,
  damping: 28
};
interface Course {
  id: string;
  title: string;
  instructor: {
    name: string;
    avatar: string;
  };
  rating: number;
  hours: number;
  image: string;
  price: number;
}
interface CoursesCarouselProps {
  courses: Course[];
  onAdd: (id: string) => void;
  onView?: (id: string) => void;
  onViewAll?: () => void;
  className?: string;
}
export function CoursesCarousel({
  courses,
  onAdd,
  onView,
  onViewAll,
  className
}: CoursesCarouselProps) {
  const {
    isRTL
  } = useDirection();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    direction: isRTL ? "rtl" : "ltr",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
    breakpoints: {
      "(min-width: 640px)": {
        slidesToScroll: 2
      },
      "(min-width: 1024px)": {
        slidesToScroll: 3
      }
    }
  });
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);
  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);
  return <section className={cn("relative py-8 sm:py-10 lg:py-12 px-6 lg:px-[100px] overflow-hidden bg-transparent", className)}>
      <div className="max-w-[1400px] mx-auto relative z-10">
        <SectionHeader title="دوره‌های برتر" eyebrow="پرفروش‌ترین دوره‌های آموزشی" className="mb-6" />

        <div className="relative">
          {/* Carousel Container */}
          <div className="overflow-hidden" ref={emblaRef}>
            <motion.div initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={springTransition} className="flex gap-4 sm:gap-6 lg:gap-8 py-[5px]">
              {courses.map((course, index) => <div key={course.id} className="flex-[0_0_75%] sm:flex-[0_0_45%] md:flex-[0_0_38%] lg:flex-[0_0_24%] min-w-0">
                  <motion.div initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                ...springTransition,
                delay: index * 0.05
              }}>
                    <CourseCard id={course.id} title={course.title} instructor={course.instructor} rating={course.rating} hours={course.hours} image={course.image} price={course.price} onAdd={onAdd} onView={onView} />
                  </motion.div>
                </div>)}
            </motion.div>
          </div>

          {/* Navigation Arrows - Always visible */}
          <button onClick={scrollPrev} className={cn("absolute top-1/2 -translate-y-1/2 z-20", "w-11 h-11 rounded-full glass border border-white/35", "flex items-center justify-center", "transition-all duration-300", "hover:bg-white/20 hover:border-white/50", "shadow-lg backdrop-blur-xl", isRTL ? "right-2" : "left-2")} aria-label={isRTL ? "قبلی" : "Previous"}>
            {isRTL ? <ChevronRight className="w-5 h-5 text-white" /> : <ChevronLeft className="w-5 h-5 text-white" />}
          </button>

          <button onClick={scrollNext} className={cn("absolute top-1/2 -translate-y-1/2 z-20", "w-11 h-11 rounded-full glass border border-white/35", "flex items-center justify-center", "transition-all duration-300", "hover:bg-white/20 hover:border-white/50", "shadow-lg backdrop-blur-xl", isRTL ? "left-2" : "right-2")} aria-label={isRTL ? "بعدی" : "Next"}>
            {isRTL ? <ChevronLeft className="w-5 h-5 text-white" /> : <ChevronRight className="w-5 h-5 text-white" />}
          </button>
        </div>

        {onViewAll && <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        ...springTransition,
        delay: 0.3
      }} className="flex justify-center mt-8">
            <Button onClick={onViewAll} variant="viewAll" size="lg" className="w-full sm:w-auto rounded-2xl">
              مشاهده همه
            </Button>
          </motion.div>}
      </div>
    </section>;
}