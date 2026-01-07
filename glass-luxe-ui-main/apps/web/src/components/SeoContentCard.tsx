import { ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { SurfaceGlass } from "@/components/ui/surface-glass";

interface SeoContentCardProps {
  children: ReactNode;
  className?: string;
}

export function SeoContentCard({ children, className }: SeoContentCardProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [maxHeight, setMaxHeight] = useState<number>(240);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mediaQuery.matches);
    const handler = (event: MediaQueryListEvent) => {
      setReduceMotion(event.matches);
    };
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (expanded && contentRef.current) {
      setMaxHeight(contentRef.current.scrollHeight);
    } else {
      setMaxHeight(240);
    }
  }, [expanded, children]);

  const toggle = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <div dir="rtl" className={cn("max-w-4xl mx-auto", className)}>
      <SurfaceGlass
        className={cn(
          "rounded-2xl overflow-hidden",
          "bg-gradient-to-br from-white/5 via-white/10 to-white/5",
          "backdrop-blur-xl"
        )}
      >
        {/* Subtle background gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, hsl(var(--primary) / 0.03), transparent, hsl(var(--accent) / 0.03))",
          }}
        />

        <div className="relative z-10">
          {/* Content container */}
          <div
            className={cn(
              "relative overflow-hidden",
              "px-6 md:px-8 pt-6 md:pt-8 pb-4"
            )}
            style={{
              maxHeight,
              transition: reduceMotion
                ? undefined
                : "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {/* Content with proper hierarchy and RTL alignment */}
            <div
              ref={contentRef}
              className={cn(
                "space-y-4 md:space-y-6",
                "text-sm md:text-base text-foreground/90 leading-relaxed",
                "text-center"
              )}
            >
              {children}
            </div>

            {/* Gradient fade overlay (bottom) - only when collapsed */}
            {!expanded && (
              <div
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute inset-x-0 bottom-0 h-20",
                  "bg-gradient-to-t from-[hsl(var(--card))] via-[hsl(var(--card))/0.4] to-transparent"
                )}
              />
            )}
          </div>

          {/* Toggle button - inside card, centered */}
          <div className="px-6 md:px-8 pb-6 md:pb-8 pt-2">
            <button
              type="button"
              onClick={toggle}
              className={cn(
                "w-full text-sm font-medium font-vazirmatn",
                "text-muted-foreground hover:text-foreground",
                "transition-all duration-200",
                "flex items-center justify-center gap-2",
                "cursor-pointer",
                "hover:underline underline-offset-2"
              )}
            >
              {expanded ? "بستن توضیحات" : "مشاهده توضیحات کامل ←"}
            </button>
          </div>
        </div>
      </SurfaceGlass>
    </div>
  );
}

export default SeoContentCard;


