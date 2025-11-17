import { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { SurfaceGlass } from "@/components/ui/surface-glass";
import { cn } from "@/lib/utils";

interface CategoryTabsProps {
  items: string[];
  active: string;
  onChange: (category: string) => void;
  rtl?: boolean;
}

const springTransition = {
  type: "spring" as const,
  stiffness: 220,
  damping: 28,
};

export function CategoryTabs({ items, active, onChange, rtl = false }: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeRect, setActiveRect] = useState<{ left: number; width: number }>({ left: 0, width: 0 });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Spring-animated underline position
  const underlineX = useMotionValue(0);
  const underlineWidth = useMotionValue(0);
  const smoothX = useSpring(underlineX, springTransition);
  const smoothWidth = useSpring(underlineWidth, springTransition);

  // Update underline position when active tab changes
  useEffect(() => {
    const activeIndex = items.indexOf(active);
    const activeTab = tabRefs.current[activeIndex];
    const container = scrollRef.current;

    if (activeTab && container) {
      const containerRect = container.getBoundingClientRect();
      const tabRect = activeTab.getBoundingClientRect();
      
      // Calculate position relative to container
      const left = tabRect.left - containerRect.left + container.scrollLeft;
      const width = tabRect.width;

      setActiveRect({ left, width });
      underlineX.set(left);
      underlineWidth.set(width);

      // Center the active tab
      const scrollTo = activeTab.offsetLeft - container.offsetWidth / 2 + tabRect.width / 2;
      container.scrollTo({
        left: rtl ? -scrollTo : scrollTo,
        behavior: "smooth",
      });
    }
  }, [active, items, rtl, underlineX, underlineWidth]);

  return (
    <SurfaceGlass className="relative overflow-hidden">
      <div
        ref={scrollRef}
        className={cn(
          "flex gap-2 overflow-x-auto overflow-y-hidden scrollbar-hide p-3",
          "snap-x snap-mandatory scroll-smooth",
          "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        )}
        style={{ direction: rtl ? "rtl" : "ltr" }}
        onWheel={(e) => {
          e.preventDefault();
          if (scrollRef.current) {
            scrollRef.current.scrollLeft += e.deltaY;
          }
        }}
      >
        {items.map((item, index) => {
          const isActive = item === active;
          
          return (
            <motion.button
              key={item}
              ref={(el) => (tabRefs.current[index] = el)}
              onClick={() => onChange(item)}
              className={cn(
                "relative px-6 py-2.5 rounded-full whitespace-nowrap snap-center",
                "transition-colors duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                isActive
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-glass/50"
              )}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...springTransition, delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {item}
            </motion.button>
          );
        })}

        {/* Animated gradient underline */}
        <motion.div
          className="absolute bottom-2 h-0.5 rounded-full"
          style={{
            left: rtl ? "auto" : smoothX,
            right: rtl ? smoothX : "auto",
            width: smoothWidth,
            background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))",
            boxShadow: "0 0 8px hsl(var(--primary) / 0.5)",
          }}
          initial={false}
        />
      </div>
    </SurfaceGlass>
  );
}
