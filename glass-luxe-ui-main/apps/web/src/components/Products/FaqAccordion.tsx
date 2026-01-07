import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SurfaceGlass } from "@/components/ui/surface-glass";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";
import { useDirection } from "@/contexts/DirectionContext";

const springTransition = {
  type: "spring" as const,
  stiffness: 220,
  damping: 28,
};

interface FaqItem {
  q: string;
  a: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
  className?: string;
}

export function FaqAccordion({ items, className }: FaqAccordionProps) {
  const { isRTL } = useDirection();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Initialize from URL hash
  useEffect(() => {
    const hash = window.location.hash.replace("#faq-", "");
    const index = parseInt(hash);
    if (!isNaN(index) && index >= 0 && index < items.length) {
      setOpenIndex(index);
      // Scroll to the element with proper offset
      setTimeout(() => {
        const element = document.getElementById(`faq-${index}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  }, [items.length]);

  const handleToggle = (index: number) => {
    const newIndex = openIndex === index ? null : index;
    setOpenIndex(newIndex);
    
    // Update URL hash
    if (newIndex !== null) {
      window.history.replaceState(null, "", `#faq-${newIndex}`);
    } else {
      window.history.replaceState(null, "", window.location.pathname);
    }
  };

  if (!items || items.length === 0) {
    return (
      <section dir="rtl" className={cn("container mx-auto max-w-4xl px-4 md:px-6 py-16", className)}>
        <SectionHeader
          title="سوالات متداول"
          eyebrow="راهنما"
        />
      </section>
    );
  }

  return (
    <section dir="rtl" className={cn("container mx-auto max-w-4xl px-4 md:px-6 py-16", className)}>
      <div className="space-y-8">
        <SectionHeader
          title="سوالات متداول"
          eyebrow="راهنما"
        />

        <div className="space-y-4 max-w-3xl mx-auto">
          {items.map((item, index) => (
            <SurfaceGlass
              key={index}
              id={`faq-${index}`}
              variant="default"
              className={cn(
                "overflow-hidden rounded-xl",
                "border border-white/35",
                "scroll-mt-24"
              )}
            >
              <button
                onClick={() => handleToggle(index)}
                className={cn(
                  "w-full px-6 py-4 flex items-center gap-4",
                  "text-right font-vazirmatn",
                  "hover:bg-[hsla(0,0%,100%,0.14)]/50 transition-colors duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary",
                  isRTL ? "flex-row" : "flex-row-reverse"
                )}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
                id={`faq-question-${index}`}
              >
                <span className="flex-1 text-base font-semibold font-vazirmatn leading-[1.5] text-foreground">
                  {item.q}
                </span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 text-muted-foreground transition-transform duration-300 flex-shrink-0",
                    openIndex === index && "rotate-180"
                  )}
                />
              </button>

              <motion.div
                id={`faq-answer-${index}`}
                initial={false}
                animate={{
                  height: openIndex === index ? "auto" : 0,
                  opacity: openIndex === index ? 1 : 0,
                }}
                transition={springTransition}
                className="overflow-hidden"
                role="region"
                aria-labelledby={`faq-question-${index}`}
              >
                <div className="px-6 pb-4 pt-2">
                  <p className="text-sm font-vazirmatn font-normal leading-relaxed text-muted-foreground text-right">
                    {item.a}
                  </p>
                </div>
              </motion.div>
            </SurfaceGlass>
          ))}
        </div>
      </div>
    </section>
  );
}
