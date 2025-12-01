import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDirection } from "@/contexts/DirectionContext";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  path: BreadcrumbItem[];
  className?: string;
}

const springTransition = {
  type: "spring" as const,
  stiffness: 220,
  damping: 28,
};

export function Breadcrumb({ path, className }: BreadcrumbProps) {
  const { isRTL } = useDirection();

  // Generate JSON-LD for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": path.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      ...(item.href && { "item": `https://sharifgpt.ir${item.href}` }),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springTransition}
        aria-label="Breadcrumb"
        className={cn("flex items-center gap-2", className)}
      >
        <ol className="flex items-center gap-2">
          {path.map((item, index) => {
            const isLast = index === path.length - 1;
            const Chevron = isRTL ? ChevronRight : ChevronRight;

            return (
              <li key={index} className="flex items-center gap-2">
                {item.href && !isLast ? (
                  <a
                    href={item.href}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                      "glass hover:bg-surface-glass/80 shadow-sm",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {item.label}
                  </a>
                ) : (
                  <span
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm font-semibold",
                      "glass shadow-sm",
                      isLast ? "text-foreground" : "text-muted-foreground"
                    )}
                    aria-current={isLast ? "page" : undefined}
                  >
                    {item.label}
                  </span>
                )}

                {!isLast && (
                  <Chevron
                    className={cn(
                      "h-3.5 w-3.5 text-muted-foreground/50",
                      isRTL && "rotate-180"
                    )}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </motion.nav>
    </>
  );
}
