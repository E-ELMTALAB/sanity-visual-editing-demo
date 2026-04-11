import { motion } from "framer-motion";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDirection } from "@/contexts/DirectionContext";
import { Helmet } from "@/components/Helmet";

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
  const siteUrl = "https://sharifgpt.ai";

  // Generate JSON-LD for BreadcrumbList
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": path.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      ...(item.href && { "item": `${siteUrl}${item.href}` })
    }))
  };

  const ChevronIcon = isRTL ? ChevronRight : ChevronRight;

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springTransition}
        aria-label="Breadcrumb"
        className={cn(
          "rounded-xl py-3 px-4",
          "bg-white/95 dark:bg-white/10",
          "shadow-lg shadow-black/5",
          className
        )}
      >
        <ol className="flex items-center gap-2 flex-wrap">
          {path.map((item, index) => {
            const isLast = index === path.length - 1;
            const isFirst = index === 0;

            return (
              <li key={index} className="flex items-center gap-2">
                {item.href ? (
                  <a
                    href={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors rounded-md px-2 py-1 flex items-center gap-1.5",
                      "hover:bg-surface-glass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      isFirst 
                        ? "text-muted-foreground hover:text-foreground" 
                        : "text-muted-foreground hover:text-primary"
                    )}
                    aria-current={isLast ? "page" : undefined}
                  >
                    {isFirst && <Home className="h-3.5 w-3.5" />}
                    <span>{item.label}</span>
                  </a>
                ) : (
                  <span
                    className={cn(
                      "text-sm font-medium px-2 py-1 flex items-center gap-1.5",
                      isLast ? "text-foreground" : "text-muted-foreground"
                    )}
                    aria-current={isLast ? "page" : undefined}
                  >
                    {isFirst && <Home className="h-3.5 w-3.5" />}
                    <span>{item.label}</span>
                  </span>
                )}

                {!isLast && (
                  <ChevronIcon 
                    className={cn(
                      "h-4 w-4 text-muted-foreground flex-shrink-0",
                      isRTL && "rotate-180"
                    )} 
                    aria-hidden="true"
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
