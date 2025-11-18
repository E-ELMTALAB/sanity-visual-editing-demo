import { useState, useMemo, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Search, X, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SurfaceGlass } from "@/components/ui/surface-glass";
import { cn } from "@/lib/utils";
import { fetchFromSanity } from "@/lib/sanity.client";
import { validateSanityConfig } from "@/lib/sanity.config";
import { allFaqsQuery } from "@/lib/sanity.queries";

const categoryLabels: Record<string, string> = {
  general: "عمومی",
  payment: "پرداخت",
  products: "محصولات",
  technical: "فنی",
  services: "خدمات",
};

interface SanityFaq {
  question: string;
  answer: string;
  category?: string;
  order?: number;
}

export default function Faq() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [faqs, setFaqs] = useState<SanityFaq[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const isConfigValid = validateSanityConfig();
    if (!isConfigValid) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    async function loadFaqs() {
      try {
        setIsLoading(true);
        const result = await fetchFromSanity<any[]>(allFaqsQuery);
        if (!isMounted) return;

        const transformed = (result ?? []).map((faq) => ({
          question: faq?.question || "",
          answer: faq?.answer || "",
          category: faq?.category || "general",
          order: typeof faq?.order === "number" ? faq.order : 0,
        }));

        setFaqs(transformed);
        setFetchError(null);
      } catch (error) {
        console.error("[FAQ] Failed to fetch Sanity data", error);
        if (isMounted) {
          setFetchError("خطا در بارگذاری سوالات");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadFaqs();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter FAQs based on search and category
  const filteredFaqs = useMemo(() => {
    let filtered = faqs;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((faq) => faq.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (faq) =>
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query)
      );
    }

    return filtered
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((faq) => ({ q: faq.question, a: faq.answer }));
  }, [searchQuery, selectedCategory, faqs]);

  const categoryOptions = useMemo(() => {
    const unique = new Set<string>();
    faqs.forEach((faq) => {
      if (faq.category) {
        unique.add(faq.category);
      }
    });
    return [
      { id: "all", label: "همه" },
      ...Array.from(unique).map((id) => ({
        id,
        label: categoryLabels[id] || id,
      })),
    ];
  }, [faqs]);

  // Prepare JSON-LD with first 12 FAQs
  const structuredData =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.slice(0, 12).map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <>
      <Helmet>
        <title>سوالات متداول | SharifGPT</title>
        <meta
          name="description"
          content="پاسخ به سوالات متداول درباره خرید، پرداخت، محصولات و خدمات شریف‌GPT"
        />
        <link rel="canonical" href="https://sharifgpt.ai/faq" />
        {structuredData && (
          <script type="application/ld+json">
            {JSON.stringify(structuredData)}
          </script>
        )}
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header
          onSearch={() => {}}
          active="faq"
        />

        <main className="flex-1">
          <div className="max-w-[1100px] mx-auto px-4 md:px-6 lg:px-8 py-12 space-y-8">
            {/* Hero Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center pt-8 pb-6"
            >
              <h1 className="text-[32px] md:text-[42px] lg:text-[48px] font-extrabold mb-4">
                سوالات متداول
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-[680px] mx-auto mb-8">
                پاسخ کوتاه به پرتکرارترین سوال‌ها
              </p>

              {/* Search Input */}
              <div className="max-w-[600px] mx-auto">
                <div className="relative">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                  <Input
                    type="text"
                    placeholder="جستجوی سوال..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="glass border-white/30 h-12 pr-12 pl-12 text-base"
                    dir="rtl"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                      aria-label="پاک کردن جستجو"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </motion.section>

            {/* Category Filters */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-wrap items-center justify-center gap-3"
            >
              {categoryOptions.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "glass rounded-full px-5 py-2.5 text-sm font-semibold transition-all",
                    "border hover:scale-105 active:scale-95",
                    selectedCategory === category.id
                      ? "border-primary bg-primary/20 text-primary shadow-[0_0_20px_rgba(10,132,255,0.4)]"
                      : "border-white/30 text-white/90 hover:border-white/50"
                  )}
                >
                  {category.label}
                </button>
              ))}
            </motion.section>

            {fetchError && !isLoading && (
              <p className="text-center text-sm text-destructive">{fetchError}</p>
            )}

            {/* FAQ List */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {isLoading ? (
                <SurfaceGlass className="p-12 text-center max-w-2xl mx-auto">
                  <p className="text-muted-foreground">در حال بارگذاری سوالات...</p>
                </SurfaceGlass>
              ) : filteredFaqs.length > 0 ? (
                <div className="max-w-3xl mx-auto space-y-4">
                  {filteredFaqs.map((item, index) => (
                    <SurfaceGlass
                      key={index}
                      id={`faq-${index}`}
                      variant="default"
                      className="overflow-hidden scroll-mt-24"
                    >
                      <details className="group">
                        <summary
                          className={cn(
                            "w-full px-6 py-4 flex items-center justify-between gap-4 cursor-pointer",
                            "text-right list-none",
                            "hover:bg-surface-glass/50 transition-colors",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset",
                            "[&::-webkit-details-marker]:hidden"
                          )}
                        >
                          <span className="flex-1 text-base font-semibold text-foreground">
                            {item.q}
                          </span>
                          <svg
                            className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-open:rotate-180"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </summary>
                        <div className="px-6 pb-4 pt-2 animate-accordion-down">
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {item.a}
                          </p>
                        </div>
                      </details>
                    </SurfaceGlass>
                  ))}
                </div>
              ) : (
                <SurfaceGlass className="p-12 text-center max-w-2xl mx-auto">
                  <div className="mb-6">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">نتیجه‌ای یافت نشد</h3>
                    <p className="text-white/70 mb-6">
                      متأسفانه پاسخی برای جستجوی شما پیدا نکردیم.
                      <br />
                      لطفاً سوال خود را مستقیماً از تیم پشتیبانی بپرسید.
                    </p>
                  </div>
                  <Button asChild size="lg" className="gap-2">
                    <Link to="/support?new=ticket">
                      <Send className="w-5 h-5" />
                      ثبت تیکت پشتیبانی
                    </Link>
                  </Button>
                </SurfaceGlass>
              )}
            </motion.section>

            {/* Contact CTA */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <SurfaceGlass className="p-8 text-center max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold mb-3">سوالی دارید؟</h3>
                <p className="text-white/70 mb-6">
                  اگر پاسخ سوال خود را پیدا نکردید، با تیم پشتیبانی ما در تماس باشید.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button asChild size="lg" className="gap-2 w-full sm:w-auto">
                    <Link to="/support?new=ticket">
                      <Send className="w-5 h-5" />
                      ثبت تیکت پشتیبانی
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="gap-2 w-full sm:w-auto"
                  >
                    <Link to="/contact">تماس با ما</Link>
                  </Button>
                </div>
              </SurfaceGlass>
            </motion.section>
          </div>
        </main>

        <Footer
          links={{
            products: "/products",
            magazine: "/blog",
            courses: "/products?category=courses",
            pricing: "/products",
            support: "/support",
          }}
          socials={[
            { type: "Telegram", href: "https://t.me/SharifGPT" },
            { type: "Instagram", href: "https://instagram.com/sharifgpt" },
          ]}
        />
      </div>
    </>
  );
}
