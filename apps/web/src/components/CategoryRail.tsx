import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDirection } from "@/contexts/DirectionContext";
import { toast } from "@/hooks/use-toast";
import { SectionHeader } from "@/components/ui/section-header";
interface CategoryItem {
  id: string;
  label: string;
  image: string;
  slug?: string;
  href?: string;
}

const fallbackCategories: CategoryItem[] = [{
  id: "ai",
  label: "هوش مصنوعی",
  image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop"
}, {
  id: "social",
  label: "سوشیال مدیا",
  image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop"
}, {
  id: "music",
  label: "موسیقی",
  image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop"
}, {
  id: "education",
  label: "آموزشی",
  image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop"
}, {
  id: "simcards",
  label: "سیم‌کارت",
  image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=300&fit=crop"
}];

interface CategoryRailProps {
  categories?: CategoryItem[];
}

export function CategoryRail({ categories = fallbackCategories }: CategoryRailProps) {
  const {
    isRTL
  } = useDirection();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    direction: isRTL ? "rtl" : "ltr",
    align: "start",
    slidesToScroll: 1,
    dragFree: true
  });
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const handleCategorySelect = (category: CategoryItem) => {
    setSelectedCategory(category.id);
    // Navigate to collection page if href is available
    if (category.href) {
      navigate(category.href);
    } else {
      // Fallback to toast notification
    toast({
      title: isRTL ? "فیلتر دسته‌بندی" : "Category Filter",
        description: isRTL ? `محصولات ${category.label} انتخاب شد` : `Filtering by ${category.label}`
    });
    }
  };
  return <section className="relative py-8 px-4 md:px-6 lg:px-8 bg-transparent">
      <div className="max-w-[1100px] mx-auto">
        {/* Section Header */}
        <SectionHeader title="دسته‌بندی‌ها" eyebrow="انتخاب بر اساس دسته" className="mb-8" />
        
        <div className="relative group">
          {/* Carousel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-3 sm:gap-4 touch-pan-y py-[5px]">
              {categories.map(category => {
              const isActive = selectedCategory === category.id;
              return <div key={category.id} onClick={() => handleCategorySelect(category)} className={cn("flex-[0_0_auto] w-[180px] sm:w-[200px] cursor-pointer group relative", "rounded-3xl ring-1 overflow-hidden transition-all duration-200", "hover:-translate-y-0.5 active:scale-[0.995]", isActive ? "ring-white/30" : "ring-white/10")}>
                    {/* Image Area */}
                    <div className="relative aspect-square rounded-2xl overflow-hidden">
                      <img src={category.image} alt={category.label} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover ring-1 ring-white/12 shadow-none transition-transform duration-200 group-hover:scale-[1.02]" />
                      
                      {/* Fade gradient layer */}
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-black/18" />
                    </div>

                    {/* Info box (overlapping) */}
                    <div className={cn("absolute left-3 right-3 bottom-3 glass rounded-3xl px-4 py-3 border border-white/35", "transition-colors duration-200", isActive && "bg-white/15 border-white/45")}>
                      <span className={cn("text-[14px] sm:text-[15px] font-semibold block text-center", isActive ? "text-white" : "text-white/90")}>
                        {category.label}
                      </span>
                    </div>

                    {/* Focus ring */}
                    <span className="pointer-events-none absolute inset-0 rounded-3xl ring-0 ring-offset-0 ring-white/40 focus-within:ring-2" />
                  </div>;
            })}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button onClick={scrollPrev} className={cn("absolute top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full glass flex items-center justify-center", "border border-white/35 transition-all duration-200", "hover:bg-white/15 active:scale-95", "ltr:left-0 rtl:right-0 -translate-x-2")} aria-label="Previous categories">
            <ChevronLeft className="h-5 w-5 text-white/90 ltr:block rtl:hidden" />
            <ChevronRight className="h-5 w-5 text-white/90 ltr:hidden rtl:block" />
          </button>
          <button onClick={scrollNext} className={cn("absolute top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full glass flex items-center justify-center", "border border-white/35 transition-all duration-200", "hover:bg-white/15 active:scale-95", "ltr:right-0 rtl:left-0 translate-x-2")} aria-label="Next categories">
            <ChevronRight className="h-5 w-5 text-white/90 ltr:block rtl:hidden" />
            <ChevronLeft className="h-5 w-5 text-white/90 ltr:hidden rtl:block" />
          </button>
        </div>
      </div>
    </section>;
}