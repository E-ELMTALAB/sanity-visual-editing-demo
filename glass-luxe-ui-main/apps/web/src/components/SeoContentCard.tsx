import { ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

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
      <div
        className={cn(
          "relative glass rounded-2xl p-5 md:p-6",
          "overflow-hidden"
        )}
        style={{
          maxHeight,
          transition: reduceMotion
            ? undefined
            : "max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div
          ref={contentRef}
          className="space-y-6 text-sm md:text-base text-muted-foreground leading-relaxed"
        >
          {children}
        </div>

        {/* Gradient fade overlay (bottom) */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 h-24",
            "bg-gradient-to-t from-[hsl(var(--card))] via-[hsl(var(--card))/0.6] to-transparent",
            "transition-opacity duration-300 ease-out"
          )}
          style={{ opacity: expanded ? 0 : 1 }}
        />
      </div>

      {/* Toggle button */}
      <button
        type="button"
        onClick={toggle}
        className={cn(
          "mt-4 text-sm font-normal font-vazirmatn",
          "text-muted-foreground hover:text-foreground",
          "transition-colors duration-200",
          "flex items-center justify-center md:justify-end gap-1"
        )}
      >
        {expanded ? "بستن توضیحات" : "مشاهده توضیحات کامل ←"}
      </button>
    </div>
  );
}

export default SeoContentCard;


