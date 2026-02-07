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

interface TocGroup {
  h2: TocItem;
  children: TocItem[];
}

interface ProductDescriptionProps {
  description?: string;
  descriptionFa?: string;
  productTitle?: string;
  productTitleFa?: string;
  className?: string;
}

// Generate heading ID from text (must match EnhancedMarkdownRenderer exactly)
const generateHeadingId = (text: string, existingIds: Set<string> = new Set()): string => {
  // Remove markdown formatting first (same as EnhancedMarkdownRenderer)
  let cleanText = text.replace(/\*\*|__|\*|_|`/g, '').trim();
  
  // Slugify (same logic as EnhancedMarkdownRenderer)
  let baseId = cleanText
    .toLowerCase()
    .replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  // Ensure uniqueness (same logic as EnhancedMarkdownRenderer)
  let uniqueId = baseId;
  let counter = 1;
  while (existingIds.has(uniqueId)) {
    uniqueId = `${baseId}-${counter}`;
    counter++;
  }
  existingIds.add(uniqueId);
  
  return uniqueId;
};

// Extract headings from markdown content
const extractHeadings = (content: string): TocItem[] => {
  if (!content || typeof content !== 'string') return [];
  
  const headings: TocItem[] = [];
  const lines = content.split('\n');
  const existingIds = new Set<string>();
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Match markdown headings: # Heading, ## Heading, etc.
    const markdownMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (markdownMatch) {
      const level = markdownMatch[1].length;
      const text = markdownMatch[2].trim();
      const cleanText = text.replace(/\*\*|__|\*|_|`/g, '').trim();
      const id = generateHeadingId(cleanText, existingIds);
      
      headings.push({ id, text: cleanText, level });
    }
  }
  
  return headings;
};

// Group headings: H2 as groups, H3/H4 as children
const groupHeadings = (headings: TocItem[]): TocGroup[] => {
  const groups: TocGroup[] = [];
  let currentGroup: TocGroup | null = null;
  
  for (const heading of headings) {
    if (heading.level === 2) {
      if (currentGroup) {
        groups.push(currentGroup);
      }
      currentGroup = {
        h2: heading,
        children: [],
      };
    } else if (heading.level > 2 && currentGroup) {
      currentGroup.children.push(heading);
    }
  }
  
  if (currentGroup) {
    groups.push(currentGroup);
  }
  
  return groups;
};

export function ProductDescription({
  description,
  descriptionFa,
  productTitle,
  productTitleFa,
  className,
}: ProductDescriptionProps) {
  const { isRTL } = useDirection();
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);
  
  // Get content based on RTL
  const descriptionContent = (isRTL && descriptionFa) ? descriptionFa : (description || "");
  const displayTitle = (isRTL && productTitleFa) ? productTitleFa : (productTitle || "");
  
  // Extract and group headings
  const allHeadings = extractHeadings(descriptionContent);
  const h2Groups = groupHeadings(allHeadings);
  const hasToc = h2Groups.length > 0;
  
  // Smooth scroll to heading
  const scrollToHeading = (id: string) => {
    setTimeout(() => {
      // Try to find the heading element
      const element = document.getElementById(id);
      
      if (!element) {
        console.warn(`Heading with ID "${id}" not found`);
        return;
      }
      
      // Check if description is in a scrollable container
      const descriptionContainer = descriptionRef.current;
      const isScrollableContainer = descriptionContainer && 
        (descriptionContainer.scrollHeight > descriptionContainer.clientHeight ||
         getComputedStyle(descriptionContainer).overflowY === 'auto' ||
         getComputedStyle(descriptionContainer).overflowY === 'scroll');
      
      const headerOffset = 100; // Match scroll-mt-[100px]
      
      if (isScrollableContainer && descriptionContainer) {
        // Scroll within the description container
        const containerRect = descriptionContainer.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        const relativeTop = elementRect.top - containerRect.top + descriptionContainer.scrollTop;
        
        descriptionContainer.scrollTo({
          top: Math.max(0, relativeTop - headerOffset),
          behavior: 'smooth'
        });
      } else {
        // Scroll the whole page
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: 'smooth'
        });
      }
      
      // Close mobile TOC after clicking
      if (window.innerWidth < 1024) {
        setIsMobileTocOpen(false);
      }
    }, 100); // Slight delay to ensure DOM is ready
  };
  
  // Verify TOC IDs match rendered headings after content loads
  useEffect(() => {
    if (descriptionRef.current && descriptionContent && hasToc) {
      const timer = setTimeout(() => {
        const renderedHeadings = descriptionRef.current?.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const renderedIds = renderedHeadings ? Array.from(renderedHeadings).map(h => h.id).filter(Boolean) : [];
        const tocIds = allHeadings.map(h => h.id);
        
        // Check for mismatches
        const missingIds = tocIds.filter(id => !renderedIds.includes(id));
        if (missingIds.length > 0) {
          console.warn('TOC IDs not found in rendered headings:', missingIds);
        }
        
        // Log for debugging
        if (renderedIds.length > 0) {
          console.log('Rendered heading IDs:', renderedIds);
          console.log('TOC heading IDs:', tocIds);
        }
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [descriptionContent, hasToc, allHeadings]);
  
  const fallbackDescription = "توضیحات کامل محصول در حال حاضر در دسترس نیست. برای اطلاعات بیشتر با پشتیبانی تماس بگیرید.";
  
  return (
    <section
      dir="rtl"
      className={cn("py-12 md:py-16", className)}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Mobile: Floating TOC Button */}
        {hasToc && (
          <div className="lg:hidden mb-6">
            <button
              type="button"
              onClick={() => setIsMobileTocOpen(!isMobileTocOpen)}
              className={cn(
                "fixed bottom-20 z-40",
                isRTL ? "left-6" : "right-6",
                "w-14 h-14 rounded-full",
                "bg-gradient-to-br from-primary to-primary/80",
                "border border-primary/30 shadow-2xl shadow-primary/25",
                "flex items-center justify-center",
                "transition-all duration-200 hover:scale-105 active:scale-95"
              )}
              aria-label="فهرست مطالب"
            >
              <List className="w-6 h-6 text-primary-foreground" />
            </button>
            
            {/* Mobile TOC Panel */}
            <AnimatePresence>
              {isMobileTocOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsMobileTocOpen(false)}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                  />
                  <motion.div
                    initial={{ x: isRTL ? -320 : 320, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: isRTL ? -320 : 320, opacity: 0 }}
                    transition={springTransition}
                    className={cn(
                      "fixed top-0 bottom-0 z-50 w-80",
                      isRTL ? "left-0 border-r" : "right-0 border-l",
                      "bg-background/98 backdrop-blur-[32px] border-white/10 shadow-2xl"
                    )}
                  >
                    <div className="h-full overflow-y-auto p-6">
                      <TocContent
                        displayTitle={displayTitle}
                        h2Groups={h2Groups}
                        scrollToHeading={scrollToHeading}
                        isRTL={isRTL}
                        onClose={() => setIsMobileTocOpen(false)}
                      />
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        )}
        
        {/* Unified Container: TOC + Description */}
        <SurfaceGlass className="rounded-2xl overflow-hidden">
          <div className={cn(
            "flex flex-col lg:flex-row",
            isRTL ? "lg:flex-row-reverse" : "lg:flex-row"
          )}>
            {/* TOC Sidebar - Right (RTL: Left) */}
            {hasToc && (
              <div className={cn(
                "w-full lg:w-80 flex-shrink-0",
                "border-b lg:border-b-0",
                isRTL ? "lg:border-r border-white/10" : "lg:border-l border-white/10",
                "bg-muted/5 lg:bg-transparent"
              )}>
                <div
                  className="lg:sticky lg:top-28 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto"
                  style={{ scrollbarWidth: 'thin' }}
                >
                  <div className="p-6">
                    <TocContent
                      displayTitle={displayTitle}
                      h2Groups={h2Groups}
                      scrollToHeading={scrollToHeading}
                      isRTL={isRTL}
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Description Content - Left (RTL: Right) */}
            <div className="flex-1 min-w-0">
              <div
                ref={descriptionRef}
                className="p-6 md:p-8 prose prose-invert prose-sm md:prose-base max-w-none text-right [&_h1]:scroll-mt-[100px] [&_h2]:scroll-mt-[100px] [&_h3]:scroll-mt-[100px] [&_h4]:scroll-mt-[100px] [&_h5]:scroll-mt-[100px] [&_h6]:scroll-mt-[100px]"
                dir="rtl"
              >
                {descriptionContent ? (
                  <EnhancedMarkdownRenderer content={descriptionContent} />
                ) : (
                  <p className="text-sm md:text-base font-vazirmatn font-normal leading-relaxed text-muted-foreground whitespace-pre-line">
                    {fallbackDescription}
                  </p>
                )}
              </div>
            </div>
          </div>
        </SurfaceGlass>
      </div>
    </section>
  );
}

// TOC Content Component
interface TocContentProps {
  displayTitle: string;
  h2Groups: TocGroup[];
  scrollToHeading: (id: string) => void;
  isRTL: boolean;
  onClose?: () => void;
}

function TocContent({
  displayTitle,
  h2Groups,
  scrollToHeading,
  isRTL,
  onClose,
}: TocContentProps) {
  return (
    <nav className="space-y-6" aria-label="فهرست مطالب" dir="rtl">
      {/* Product Title as H1 Header */}
      {displayTitle && (
        <div className="pb-4 border-b border-white/10">
          <h2 className="text-lg md:text-xl font-bold font-vazirmatn text-foreground leading-tight">
            {displayTitle}
          </h2>
        </div>
      )}
      
      {/* TOC Items */}
      <div className="space-y-1">
        {h2Groups.map((group) => {
          const groupId = group.h2.id;
          const hasChildren = group.children.length > 0;
          
          return (
            <div key={groupId} className="space-y-1">
              {/* H2 Item */}
              <a
                href={`#${groupId}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToHeading(groupId);
                  onClose?.();
                }}
                className={cn(
                  "block px-3 py-2 rounded-lg text-sm md:text-base",
                  "font-vazirmatn font-semibold",
                  "text-foreground hover:text-primary hover:bg-white/5",
                  "transition-colors duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                )}
              >
                {group.h2.text}
              </a>
              
              {/* Nested H3/H4 Children */}
              {hasChildren && (
                <ul className="pr-4 space-y-0.5" dir="rtl">
                  {group.children.map((child, idx) => (
                    <li key={idx}>
                      <a
                        href={`#${child.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToHeading(child.id);
                          onClose?.();
                        }}
                        className={cn(
                          "block px-3 py-1.5 rounded-md text-sm",
                          "font-vazirmatn font-normal",
                          "text-muted-foreground hover:text-foreground hover:bg-white/5",
                          "transition-colors duration-150",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        )}
                        style={{ paddingRight: `${(child.level - 3) * 0.75}rem` }}
                      >
                        {child.text}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
