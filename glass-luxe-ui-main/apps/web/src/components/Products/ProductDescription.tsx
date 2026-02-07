import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, List } from "lucide-react";
import { SurfaceGlass } from "@/components/ui/surface-glass";
import { cn } from "@/lib/utils";
import { useDirection } from "@/contexts/DirectionContext";
import EnhancedMarkdownRenderer from "@/components/EnhancedMarkdownRenderer";

const springTransition = {
  type: "spring" as const,
  stiffness: 220,
  damping: 28,
};

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface ProductDescriptionProps {
  description?: string;
  descriptionFa?: string;
  className?: string;
}

// Generate heading ID from text (must match EnhancedMarkdownRenderer exactly)
const generateHeadingId = (text: string): string => {
  // Remove markdown formatting first
  let cleanText = text
    .replace(/\*\*|__|\*|_|`|\[|\]|\(|\)/g, '')
    .trim();
  
  return cleanText
    .toLowerCase()
    .replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Extract headings from markdown or HTML content
const extractHeadings = (content: string): TocItem[] => {
  if (!content || typeof content !== 'string') return [];
  
  const headings: TocItem[] = [];
  const lines = content.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Match markdown headings: # Heading, ## Heading, etc.
    const markdownMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (markdownMatch) {
      const level = markdownMatch[1].length;
      const text = markdownMatch[2].trim();
      // Remove markdown formatting from text
      const cleanText = text.replace(/\*\*|__|\*|_|`/g, '').trim();
      const id = generateHeadingId(cleanText);
      
      headings.push({ id, text: cleanText, level });
      continue;
    }
    
    // Match HTML headings: <h1>Heading</h1>, <h2>Heading</h2>, etc.
    const htmlMatch = trimmed.match(/^<h([1-6])(?:\s+[^>]*)?>(.*?)<\/h[1-6]>$/i);
    if (htmlMatch) {
      const level = parseInt(htmlMatch[1], 10);
      let text = htmlMatch[2].trim();
      // Remove HTML tags from text
      text = text.replace(/<[^>]+>/g, '').trim();
      const id = generateHeadingId(text);
      
      headings.push({ id, text, level });
    }
  }
  
  return headings;
};

export function ProductDescription({
  description,
  descriptionFa,
  className,
}: ProductDescriptionProps) {
  const { isRTL } = useDirection();
  const [isTocOpen, setIsTocOpen] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);
  
  // Get description content based on RTL
  const descriptionContent = (isRTL && descriptionFa) ? descriptionFa : (description || "");
  
  // Extract headings for TOC
  const tocItems = extractHeadings(descriptionContent);
  const hasToc = tocItems.length > 0;
  
  // Smooth scroll to heading with offset for sticky header
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Account for sticky header (approximately 80-100px)
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Close TOC after clicking (on mobile)
      if (window.innerWidth < 768) {
        setIsTocOpen(false);
      }
    }
  };
  
  // Extract headings from rendered DOM after content is loaded
  useEffect(() => {
    if (descriptionRef.current && hasToc) {
      // Also extract from rendered HTML headings as fallback
      const renderedHeadings = descriptionRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
      if (renderedHeadings.length > 0 && tocItems.length === 0) {
        // If markdown extraction didn't work, use DOM extraction
        // This is handled by EnhancedMarkdownRenderer which already adds IDs
      }
    }
  }, [descriptionContent, hasToc, tocItems.length]);
  
  // Fallback content
  const fallbackDescription = "توضیحات کامل محصول در حال حاضر در دسترس نیست. برای اطلاعات بیشتر با پشتیبانی تماس بگیرید.";
  
  return (
    <section
      dir="rtl"
      className={cn("py-12 md:py-16", className)}
    >
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
        <SurfaceGlass className="rounded-2xl p-6 md:p-8">
          {/* Table of Contents - Collapsible */}
          {hasToc && (
            <div className="mb-8 border-b border-white/10 pb-6">
              <button
                type="button"
                onClick={() => setIsTocOpen(!isTocOpen)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setIsTocOpen(!isTocOpen);
                  }
                }}
                className={cn(
                  "w-full flex items-center justify-between gap-4",
                  "px-4 py-3 rounded-xl",
                  "bg-muted/30 hover:bg-muted/40",
                  "border border-white/10",
                  "transition-colors duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary focus-visible:ring-offset-2",
                  isRTL ? "flex-row" : "flex-row-reverse"
                )}
                aria-expanded={isTocOpen}
                aria-controls="product-toc-content"
              >
                <div className="flex items-center gap-3" style={{ direction: isRTL ? "rtl" : "ltr" }}>
                  <List className={cn(
                    "h-5 w-5 text-primary flex-shrink-0",
                    isRTL && "rotate-180"
                  )} />
                  <span className="text-base md:text-lg font-semibold font-vazirmatn text-foreground">
                    فهرست مطالب
                  </span>
                </div>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 text-muted-foreground transition-transform duration-300 flex-shrink-0",
                    isTocOpen && "rotate-180 text-primary"
                  )}
                />
              </button>
              
              <AnimatePresence initial={false}>
                {isTocOpen && (
                  <motion.div
                    id="product-toc-content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={springTransition}
                    className="overflow-hidden"
                    role="region"
                  >
                    <nav className="pt-4 px-4" aria-label="فهرست مطالب">
                      <ul className="space-y-2" dir="rtl">
                        {tocItems.map((item, idx) => (
                          <li
                            key={idx}
                            className={cn(
                              "transition-colors duration-150",
                              "hover:text-primary"
                            )}
                            style={{ paddingRight: `${(item.level - 1) * 1.25}rem` }}
                          >
                            <a
                              href={`#${item.id}`}
                              onClick={(e) => {
                                e.preventDefault();
                                scrollToHeading(item.id);
                              }}
                              className={cn(
                                "block text-sm md:text-base font-vazirmatn",
                                "text-muted-foreground hover:text-foreground",
                                "transition-colors duration-150",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
                              )}
                            >
                              {item.text}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          
          {/* Product Description - Always Expanded */}
          <div
            ref={descriptionRef}
            className="prose prose-invert prose-sm md:prose-base max-w-none text-right [&_h1]:scroll-mt-[100px] [&_h2]:scroll-mt-[100px] [&_h3]:scroll-mt-[100px] [&_h4]:scroll-mt-[100px] [&_h5]:scroll-mt-[100px] [&_h6]:scroll-mt-[100px]"
            dir="rtl"
          >
            {descriptionContent ? (
              <EnhancedMarkdownRenderer content={descriptionContent} />
            ) : (
              <p className="text-sm md:text-base font-vazirmatn font-normal leading-relaxed text-muted-foreground text-right whitespace-pre-line">
                {fallbackDescription}
              </p>
            )}
          </div>
        </SurfaceGlass>
      </div>
    </section>
  );
}

