import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SurfaceGlass } from "@/components/ui/surface-glass";
import { cn } from "@/lib/utils";
import { useDirection } from "@/contexts/DirectionContext";
import EnhancedMarkdownRenderer from "@/components/EnhancedMarkdownRenderer";

const springTransition = {
  type: "spring" as const,
  stiffness: 220,
  damping: 28,
};

interface FaqItem {
  q: string;
  a: string;
}

interface ProductContentAccordionProps {
  description?: string;
  descriptionFa?: string;
  faqs?: FaqItem[];
  className?: string;
}

export function ProductContentAccordion({
  description,
  descriptionFa,
  faqs = [],
  className,
}: ProductContentAccordionProps) {
  const { isRTL } = useDirection();
  const [openItem, setOpenItem] = useState<string | null>(null);

  const handleToggle = (itemId: string) => {
    setOpenItem(prev => prev === itemId ? null : itemId);
  };

  // Get description content based on RTL
  const descriptionContent = (isRTL && descriptionFa) ? descriptionFa : (description || "");

  // Fallback content
  const fallbackDescription = "توضیحات کامل محصول در حال حاضر در دسترس نیست. برای اطلاعات بیشتر با پشتیبانی تماس بگیرید.";
  const fallbackFaq = "سوالات متداول این محصول در حال حاضر در دسترس نیست. برای پرسش سوالات خود با پشتیبانی تماس بگیرید.";
  const fallbackDetails = "جزئیات و شرایط استفاده از این محصول در حال حاضر در دسترس نیست. برای اطلاعات بیشتر با پشتیبانی تماس بگیرید.";

  const accordionItems: Array<{
    id: string;
    title: string;
    content?: string;
    isMarkdown?: boolean;
    faqs?: FaqItem[] | null;
    fallback?: string;
  }> = [
    {
      id: "description",
      title: "توضیحات محصول",
      content: descriptionContent || fallbackDescription,
      isMarkdown: !!descriptionContent,
    },
    {
      id: "faq",
      title: "سوالات متداول",
      faqs: faqs.length > 0 ? faqs : null,
      fallback: fallbackFaq,
    },
    {
      id: "details",
      title: "جزئیات و شرایط",
      content: fallbackDetails,
      isMarkdown: false,
    },
  ];

  return (
    <section
      dir="rtl"
      className={cn("py-12 md:py-16", className)}
    >
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
        <SurfaceGlass className="rounded-2xl p-6 md:p-8">
          <div className="space-y-1">
            {accordionItems.map((item) => {
              const isOpen = openItem === item.id;
              return (
                <div
                  key={item.id}
                  className={cn(
                    "border-b border-white/10 last:border-b-0",
                    "overflow-hidden rounded-lg"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => handleToggle(item.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleToggle(item.id);
                      }
                    }}
                    className={cn(
                      "w-full px-4 md:px-6 py-4 md:py-5 flex items-center justify-between gap-4",
                      "text-right font-vazirmatn",
                      "hover:bg-[hsla(0,0%,100%,0.08)] transition-colors duration-200",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary focus-visible:ring-offset-2",
                      isRTL ? "flex-row" : "flex-row-reverse"
                    )}
                    aria-expanded={isOpen}
                    aria-controls={`product-content-${item.id}`}
                    id={`product-content-trigger-${item.id}`}
                  >
                    <span className="flex-1 text-base md:text-lg font-semibold font-vazirmatn leading-[1.5] text-foreground text-right">
                      {item.title}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 text-muted-foreground transition-transform duration-300 flex-shrink-0",
                        isOpen && "rotate-180 text-primary"
                      )}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`product-content-${item.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={springTransition}
                        className="overflow-hidden"
                        role="region"
                        aria-labelledby={`product-content-trigger-${item.id}`}
                      >
                        <div className="px-4 md:px-6 pb-5 md:pb-6 pt-2">
                          {item.id === "faq" && item.faqs ? (
                            <div className="space-y-6">
                              {item.faqs.map((faq, idx) => (
                                <div key={idx} className="space-y-2">
                                  <h4 className="text-base md:text-lg font-semibold text-foreground mb-2">
                                    {faq.q}
                                  </h4>
                                  <p className="text-sm md:text-base font-vazirmatn font-normal leading-relaxed text-muted-foreground text-right">
                                    {faq.a}
                                  </p>
                                  {idx < item.faqs!.length - 1 && (
                                    <div className="border-t border-white/10 pt-4 mt-4" />
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : item.isMarkdown ? (
                            <div className="prose prose-invert prose-sm md:prose-base max-w-none text-right">
                              <EnhancedMarkdownRenderer content={item.content} />
                            </div>
                          ) : (
                            <p className="text-sm md:text-base font-vazirmatn font-normal leading-relaxed text-muted-foreground text-right whitespace-pre-line">
                              {item.content || item.fallback}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </SurfaceGlass>
      </div>
    </section>
  );
}

