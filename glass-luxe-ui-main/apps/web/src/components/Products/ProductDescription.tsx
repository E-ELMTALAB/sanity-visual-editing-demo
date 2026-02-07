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

// Group headings: H2 as groups, H3/H4 as children
const groupHeadings = (headings: TocItem[]): TocGroup[] => {
  const groups: TocGroup[] = [];
  let currentGroup: TocGroup | null = null;
  
  for (const heading of headings) {
    if (heading.level === 2) {
      // Start a new H2 group
      if (currentGroup) {
        groups.push(currentGroup);
      }
      currentGroup = {
        h2: heading,
        children: [],
      };
    } else if (heading.level > 2 && currentGroup) {
      // Add H3, H4, etc. as children of current H2
      currentGroup.children.push(heading);
    }
  }
  
  // Add the last group
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
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const tocRef = useRef<HTMLDivElement>(null);
  
  // Get description content based on RTL
  const descriptionContent = (isRTL && descriptionFa) ? descriptionFa : (description || "");
  const displayTitle = (isRTL && productTitleFa) ? productTitleFa : (productTitle || "");
  
  // Extract headings for TOC
  const allHeadings = extractHeadings(descriptionContent);
  const h2Groups = groupHeadings(allHeadings);
  const hasToc = h2Groups.length > 0;
  
  // Smooth scroll to heading with offset for sticky header
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Account for sticky header (approximately 100px)
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Close mobile TOC after clicking
      if (window.innerWidth < 1024) {
        setIsMobileTocOpen(false);
      }
    }
  };
  
  // Toggle H2 group
  const toggleGroup = (groupId: string) => {
    setOpenGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };
  
  // Fallback content
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
                "border border-primary/30",
                "shadow-2xl shadow-primary/25",
                "flex items-center justify-center",
                "transition-all duration-200",
                "hover:scale-105 active:scale-95"
              )}
              aria-label="فهرست مطالب"
            >
              <List className="w-6 h-6 text-primary-foreground" />
            </button>
            
            {/* Mobile TOC Panel */}
            <AnimatePresence>
              {isMobileTocOpen && (
                <>
                  {/* Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsMobileTocOpen(false)}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                  />
                  
                  {/* TOC Panel */}
                  <motion.div
                    initial={{ x: isRTL ? -320 : 320, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: isRTL ? -320 : 320, opacity: 0 }}
                    transition={springTransition}
                    className={cn(
                      "fixed top-0 bottom-0 z-50 w-80",
                      isRTL ? "left-0" : "right-0",
                      "bg-background/98 backdrop-blur-[32px]",
                      "border-l border-white/10",
                      isRTL ? "border-l-0 border-r" : "border-r-0 border-l",
                      "shadow-2xl"
                    )}
                  >
                    <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                      <div className="p-6">
                        <TocContent
                          displayTitle={displayTitle}
                          h2Groups={h2Groups}
                          openGroups={openGroups}
                          toggleGroup={toggleGroup}
                          scrollToHeading={scrollToHeading}
                          isRTL={isRTL}
                          onClose={() => setIsMobileTocOpen(false)}
                        />
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        )}
        
        {/* Desktop: 2-Column Layout | Mobile: Stacked */}
        <div className={cn(
          "flex gap-6 lg:gap-8",
          "flex-col lg:flex-row",
          isRTL ? "lg:flex-row-reverse" : "lg:flex-row"
        )}>
          {/* Description - Left side (RTL: Right side) */}
          <div className={cn(
            "flex-1 min-w-0",
            "lg:order-2"
          )}>
            <SurfaceGlass className="rounded-2xl p-6 md:p-8">
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
          
          {/* TOC Sidebar - Right side (RTL: Left side) */}
          {hasToc && (
            <div               className={cn(
                "w-full lg:w-80 flex-shrink-0",
                "lg:order-1",
                "lg:sticky lg:top-28 lg:self-start",
                "lg:max-h-[calc(100vh-9rem)]"
              )}>
              <div
                ref={tocRef}
                className="hidden lg:block h-full overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30"
              >
                <SurfaceGlass className="rounded-2xl p-6">
                  <TocContent
                    displayTitle={displayTitle}
                    h2Groups={h2Groups}
                    openGroups={openGroups}
                    toggleGroup={toggleGroup}
                    scrollToHeading={scrollToHeading}
                    isRTL={isRTL}
                  />
                </SurfaceGlass>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// TOC Content Component
interface TocContentProps {
  displayTitle: string;
  h2Groups: TocGroup[];
  openGroups: Set<string>;
  toggleGroup: (groupId: string) => void;
  scrollToHeading: (id: string) => void;
  isRTL: boolean;
  onClose?: () => void;
}

function TocContent({
  displayTitle,
  h2Groups,
  openGroups,
  toggleGroup,
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
      
      {/* TOC Groups */}
      <div className="space-y-1">
        {h2Groups.map((group) => {
          const groupId = group.h2.id;
          const isOpen = openGroups.has(groupId);
          const hasChildren = group.children.length > 0;
          
          return (
            <div
              key={groupId}
              className="border-b border-white/5 last:border-b-0 pb-2 last:pb-0"
            >
              {/* H2 Group Header */}
              <button
                type="button"
                onClick={() => {
                  if (hasChildren) {
                    toggleGroup(groupId);
                  } else {
                    scrollToHeading(groupId);
                    onClose?.();
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (hasChildren) {
                      toggleGroup(groupId);
                    } else {
                      scrollToHeading(groupId);
                      onClose?.();
                    }
                  }
                }}
                className={cn(
                  "w-full flex items-center justify-between gap-3",
                  "px-3 py-2.5 rounded-lg",
                  "text-right font-vazirmatn",
                  "transition-all duration-200",
                  "hover:bg-white/5",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary focus-visible:ring-offset-2",
                  isRTL ? "flex-row" : "flex-row-reverse"
                )}
                aria-expanded={hasChildren ? isOpen : undefined}
              >
                <a
                  href={`#${groupId}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    scrollToHeading(groupId);
                    onClose?.();
                  }}
                  className={cn(
                    "flex-1 text-sm md:text-base font-semibold",
                    "text-foreground hover:text-primary",
                    "transition-colors duration-150"
                  )}
                >
                  {group.h2.text}
                </a>
                {hasChildren && (
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform duration-300 flex-shrink-0",
                      isOpen && "rotate-180 text-primary"
                    )}
                  />
                )}
              </button>
              
              {/* Nested H3/H4 Children */}
              {hasChildren && (
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={springTransition}
                      className="overflow-hidden"
                    >
                      <ul className="pt-1 space-y-1 pr-4" dir="rtl">
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
                                "text-muted-foreground hover:text-foreground hover:bg-white/5",
                                "font-vazirmatn font-normal",
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
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
