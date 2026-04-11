import { useState, useEffect, useRef } from "react";
import { Search, Menu, X, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDirection } from "@/contexts/DirectionContext";
import { cn } from "@/lib/utils";
// Import optimized logo
import sharifgptLogo from "@/assets/sharifgpt-logo.webp";

interface MegaLink {
  label: string;
  labelFa: string;
  href: string;
}

interface MegaColumn {
  title: string;
  titleFa: string;
  links: MegaLink[];
}

interface MegaFeatured {
  image: string;
  title: string;
  titleFa: string;
  href: string;
  badge: string;
  badgeFa: string;
}

interface MegaItems {
  cols: MegaColumn[];
  featured: MegaFeatured;
}

interface HeaderProps {
  onSearch: (query: string) => void;
  megaItems?: MegaItems;
  active?: string;
  rtl?: boolean;
}

const navItems = [
  { label: "Products", labelFa: "محصولات", href: "/products" },
  { label: "Blog", labelFa: "مقالات", href: "/blog" },
  { label: "Courses", labelFa: "خانه", href: "/" },
];

export function Header({ onSearch, megaItems, active }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { direction, toggleDirection, isRTL } = useDirection();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Handle scroll compression
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // CMD+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchExpanded(true);
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const handleSearchExpand = () => {
    setIsSearchExpanded(true);
    setTimeout(() => searchInputRef.current?.focus(), 100);
  };

  return (
    <>
      <header
        className={cn(
          "fixed left-0 right-0 z-50 transition-all duration-300 transform",
          isScrolled ? "h-[60px] mt-0 mx-0" : "h-[72px] mt-6 mx-6",
          // CSS animation instead of framer-motion
          "animate-slideDown"
        )}
      >
        <div
          className={cn(
            "glass-strong h-full transition-all duration-300 rounded-2xl",
            isScrolled && "backdrop-blur-[28px] rounded-none",
          )}
          style={{ 
            borderBottom: 'none',
            boxShadow: isScrolled 
              ? '0 10px 44px rgba(0, 0, 0, 0.35), inset 0 1px 0 hsl(0 0% 100% / 0.15), inset 0 -1px 0 transparent'
              : undefined
          }}
        >
          <div className="max-w-[1400px] mx-auto h-full px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-full gap-4 rtl:flex-row-reverse">
              {/* Logo */}
              <a
                href="/"
                className="flex items-center gap-2 group hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                <img
                  src={sharifgptLogo}
                  alt="SharifGPT"
                  className="w-10 h-10 rounded-full"
                  width="40"
                  height="40"
                  loading="lazy"
                  decoding="async"
                />
                <span className="text-xl font-bold text-foreground">SharifGPT</span>
              </a>

              {/* Desktop Nav */}
              <nav className="hidden lg:flex items-center gap-1" role="navigation">
                {navItems.map((item) => {
                  const isActive = active?.toLowerCase() === item.label.toLowerCase();
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "px-4 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-surface-glass focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none relative",
                        isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {item.labelFa}
                      {isActive && (
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                      )}
                    </a>
                  );
                })}
              </nav>

              {/* Right Actions */}
              <div className="flex items-center gap-2">
                {/* Contact Button */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="hidden lg:flex items-center gap-2 glass rounded-full px-4"
                  asChild
                >
                  <a href="/contact">
                    <div className="relative">
                      <Headphones className="h-4 w-4" />
                      <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                    </div>
                    <span className="text-sm font-medium">پشتیبانی</span>
                  </a>
                </Button>

                {/* Search */}
                <div className="hidden sm:block">
                    {isSearchExpanded ? (
                    <form
                        onSubmit={handleSearchSubmit}
                      className="relative w-[280px] animate-fadeIn"
                      >
                        <input
                          ref={searchInputRef}
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="جستجو…"
                          className={cn(
                            "w-full h-10 px-4 rounded-full glass text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary",
                            isRTL && "text-right",
                          )}
                          onBlur={() => !searchQuery && setIsSearchExpanded(false)}
                        />
                        <Search className="absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground ltr:right-4 rtl:left-4" />
                    </form>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleSearchExpand}
                        className="rounded-full glass"
                        aria-label="Search"
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="lg:hidden rounded-full glass"
                  aria-label="Open menu"
                  aria-expanded={isMobileMenuOpen}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Slide-over - CSS animations instead of framer-motion */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
          <div
              onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden animate-fadeIn"
            />

            {/* Slide-over Panel */}
          <div
              className={cn(
                "fixed top-0 bottom-0 w-[320px] sm:w-[360px] glass-strong z-50 lg:hidden overflow-y-auto",
              isRTL ? "left-0 animate-slideInLeft" : "right-0 animate-slideInRight",
              )}
              style={{
                background: "hsl(var(--card))",
                borderLeft: isRTL ? "none" : "1px solid hsl(var(--border-glass))",
                borderRight: isRTL ? "1px solid hsl(var(--border-glass))" : "none",
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border-glass">
                <h2 className="text-lg font-bold text-foreground">منو</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-full"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Search (Mobile) */}
              <div className="p-6 border-b border-border-glass">
                <form onSubmit={handleSearchSubmit}>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="جستجو…"
                      className={cn(
                        "w-full h-11 px-4 rounded-xl glass text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary",
                        isRTL ? "text-right pr-11" : "pl-11",
                      )}
                    />
                    <Search
                      className={cn(
                        "absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground",
                        isRTL ? "right-4" : "left-4",
                      )}
                    />
                  </div>
                </form>
              </div>

              {/* Navigation */}
              <nav className="p-6 space-y-1" role="navigation">
                {navItems.map((item, index) => {
                  const isActive = active?.toLowerCase() === item.label.toLowerCase();
                  return (
                  <a
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "block px-4 py-3 text-base font-medium hover:bg-surface-glass rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
                        isActive ? "text-foreground bg-surface-glass" : "text-muted-foreground",
                      )}
                    style={{ animationDelay: `${index * 50}ms` }}
                      onClick={() => setIsMobileMenuOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {item.labelFa}
                  </a>
                  );
                })}
                
                {/* Customer Service Link (Mobile) */}
              <a
                  href="/contact"
                  className="block px-4 py-3 text-base font-medium hover:bg-surface-glass rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none text-muted-foreground"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Headphones className="h-5 w-5" />
                      <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                    </div>
                    <span>پشتیبانی</span>
                  </div>
              </a>
              </nav>
              </div>
          </>
        )}
    </>
  );
}
