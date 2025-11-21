import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer/Footer";
import { SectionHeader } from "@/components/ui/section-header";
import { Breadcrumb } from "@/components/ui/breadcrumb-nav";
import { PageIntro } from "@/components/ui/page-intro";
import { ProductCard } from "@/components/Products/ProductCard";
import { FiltersSidebar } from "@/components/Products/FiltersSidebar";
import { FaqAccordion } from "@/components/Products/FaqAccordion";
import { FloatingDock } from "@/components/FloatingDock/FloatingDock";
import { CartDrawer } from "@/components/FloatingDock/CartDrawer";
import { ChatbotPanel } from "@/components/FloatingDock/ChatbotPanel";
import { SupportPanel } from "@/components/FloatingDock/SupportPanel";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDirection } from "@/contexts/DirectionContext";
import { useCart } from "@/contexts/cart-context";
import { fetchProductPrices, type ProductPrices } from "@/lib/medusa-prices";
import { fetchFromSanity } from "@/lib/sanity.client";
import { validateSanityConfig } from "@/lib/sanity.config";
import { allProductsQuery, faqsByPageQuery } from "@/lib/sanity.queries";
import { transformFaqItem, transformProductListItem } from "@/lib/sanity.transformers";

const springTransition = {
  type: "spring" as const,
  stiffness: 220,
  damping: 28,
};

interface ProductListItem {
  id: string;
  slug: string;
  title: string;
  image: string;
  price: number;
  oldPrice?: number;
  discountPct?: number;
  category?: string;
  categorySlug?: string;
  rating?: number;
  reviewCount?: number;
}

interface CategoryButton {
  id: string;
  label: string;
  count: number;
}

interface FaqItem {
  q: string;
  a: string;
}

export default function Products() {
  const { isRTL } = useDirection();
  const [cartOpen, setCartOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [filters, setFilters] = useState({
    categories: [] as string[],
  });
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [faqItems, setFaqItems] = useState<FaqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [productPrices, setProductPrices] = useState<Record<string, ProductPrices>>({});
  const { addItem, state: cartState } = useCart();

  useEffect(() => {
    const isConfigValid = validateSanityConfig();
    if (!isConfigValid) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    async function loadProductsPage() {
      try {
        setIsLoading(true);
        const [productsResult, faqsResult] = await Promise.all([
          fetchFromSanity<any[]>(allProductsQuery),
          fetchFromSanity<any[]>(faqsByPageQuery, { page: "products" }),
        ]);

        if (!isMounted) return;

        const transformedProducts = (productsResult ?? [])
          .map((item, index) => transformProductListItem(item, index))
          .filter((item) => item.slug && item.title && item.image);

        const transformedFaqs = (faqsResult ?? [])
          .map((faq) => transformFaqItem(faq))
          .filter((faq) => faq.q && faq.a);

        setProducts(transformedProducts);
        setFaqItems(transformedFaqs);
        setFetchError(null);
      } catch (error) {
        console.error("[PRODUCTS] Failed to fetch Sanity data", error);
        if (isMounted) {
          setFetchError("مشکلی در بارگذاری محصولات به وجود آمد");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProductsPage();
  }, []);

  // Fetch prices from Medusa for all products
  useEffect(() => {
    const fetchAllPrices = async () => {
      if (!products || products.length === 0) return;
      
      const slugs = products
        .map((p: any) => p.slug || p.handle)
        .filter(Boolean);
      
      if (slugs.length === 0) return;
      
      try {
        const prices = await fetchProductPrices(slugs);
        setProductPrices(prices);
      } catch (error) {
        console.error('[PRODUCTS-LIST] Failed to fetch prices from Medusa:', error);
      }
    };
    
    fetchAllPrices();
  }, [products]);

  const derivedCategories = useMemo(() => {
    const map = new Map<string, CategoryButton>();
    products.forEach((product) => {
      if (!product.categorySlug || !product.category) return;
      const current = map.get(product.categorySlug);
      if (current) {
        current.count += 1;
      } else {
        map.set(product.categorySlug, {
          id: product.categorySlug,
          label: product.category,
          count: 1,
        });
      }
    });
    return Array.from(map.values());
  }, [products]);

  const categoryButtons: CategoryButton[] = useMemo(() => {
    return [
      { id: "all", label: "همه محصولات", count: products.length },
      ...derivedCategories,
    ];
  }, [derivedCategories, products.length]);

  const sidebarCategories = useMemo(() => {
    return derivedCategories.filter((category) => category.id && category.label);
  }, [derivedCategories]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesActiveCategory =
        activeCategory === "all" ||
        product.categorySlug === activeCategory;

      const matchesSidebarCategory =
        filters.categories.length === 0 ||
        filters.categories.includes(product.categorySlug || "");

      return matchesActiveCategory && matchesSidebarCategory;
    });
  }, [products, activeCategory, filters]);

  const handleAddToCart = (productId: string) => {
    console.log('[PRODUCTS-LIST] ========== ADD TO CART FROM LIST ==========');
    console.log('[PRODUCTS-LIST] Product ID:', productId);
    
    const product = products.find((p) => p.id === productId);
    if (!product) {
      console.error('[PRODUCTS-LIST] ❌ Product not found:', productId);
      return;
    }

    console.log('[PRODUCTS-LIST] Product found:', product.title);
    console.log('[PRODUCTS-LIST] Product slug:', product.slug);

    // Get Medusa price if available
    const productSlug = product.slug;
    const prices = productPrices[productSlug];
    const firstVariant = prices?.variants?.[0];

    console.log('[PRODUCTS-LIST] Medusa prices available:', !!prices);
    console.log('[PRODUCTS-LIST] First variant:', firstVariant);

    const price = firstVariant?.price || product.price || 0;

    console.log('[PRODUCTS-LIST] Final price:', price);

    if (price === 0) {
      console.error('[PRODUCTS-LIST] ❌ Price is zero');
      toast.error("قیمت این محصول در دسترس نیست");
      return;
    }

    const cartItem = {
      id: parseInt(product.id) || Date.now(),
      title: product.title,
      price: price,
      image: product.image,
      quantity: 1,
      sanity_slug: productSlug,
      variant_id: firstVariant?.variant_id,
      option_name: firstVariant?.name,
    };

    console.log('[PRODUCTS-LIST] Cart item to set (replacing cart):', cartItem);
    setSingleItem(cartItem);
    console.log('[PRODUCTS-LIST] ✅ Cart replaced with single product');
    console.log('[PRODUCTS-LIST] =========================================');
    toast.success("محصول آماده خرید است");
  };

  const handleSearch = (query: string) => {
    toast.info(`جستجو برای: ${query}`);
  };

  const handleFiltersChange = (newFilters: {
    categories: string[];
  }) => {
    setFilters(newFilters);
    console.log("Filters changed:", newFilters);
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "خانه",
        "item": "https://sharifgpt.ir/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "فروشگاه محصولات دیجیتال",
        "item": "https://sharifgpt.ir/products"
      }
    ]
  };

  const megaItems = {
    cols: [
      {
        title: "راهکارهای هوش مصنوعی کسب‌وکار",
        titleFa: "راهکارهای هوش مصنوعی کسب‌وکار",
        links: [
          { label: "مدیریت پروژه", labelFa: "مدیریت پروژه", href: "/products?cat=project-management" },
          { label: "تحلیل داده", labelFa: "تحلیل داده", href: "/products?cat=data-analysis" },
          { label: "اتوماسیون", labelFa: "اتوماسیون", href: "/products?cat=automation" },
        ],
      },
      {
        title: "خلاقیت و فناوری",
        titleFa: "خلاقیت و فناوری",
        links: [
          { label: "تولید محتوا", labelFa: "تولید محتوا", href: "/products?cat=content" },
          { label: "تولید ویدیو", labelFa: "تولید ویدیو", href: "/products?cat=video" },
          { label: "گرافیک با AI", labelFa: "گرافیک با AI", href: "/products?cat=graphic" },
        ],
      },
    ],
    featured: {
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&auto=format&fit=crop",
      title: "دوره پیشرفته ChatGPT: تکنیک‌های حرفه‌ای",
      titleFa: "دوره پیشرفته ChatGPT: تکنیک‌های حرفه‌ای",
      href: "/products/p1",
      badge: "پیشنهاد ویژه",
      badgeFa: "پیشنهاد ویژه",
    },
  };

  return (
    <>
      <Helmet>
        <title>فروشگاه محصولات دیجیتال | SharifGPT</title>
        <meta name="description" content="فروشگاه محصولات دیجیتال SharifGPT - دوره‌های آموزشی، کتاب‌های الکترونیکی، ابزارها و قالب‌های آماده در حوزه هوش مصنوعی و برنامه‌نویسی" />
        <link rel="canonical" href="https://sharifgpt.ir/products" />
        <meta property="og:title" content="فروشگاه محصولات دیجیتال | SharifGPT" />
        <meta property="og:description" content="فروشگاه محصولات دیجیتال SharifGPT - دوره‌های آموزشی، کتاب‌های الکترونیکی، ابزارها و قالب‌های آماده در حوزه هوش مصنوعی و برنامه‌نویسی" />
        <meta property="og:url" content="https://sharifgpt.ir/products" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header
          onSearch={handleSearch}
          megaItems={megaItems}
        />

        <main className="flex-1 pt-24 pb-16">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 space-y-8">
            {/* Breadcrumb */}
            <Breadcrumb
              path={[
                { label: "خانه", href: "/" },
                { label: "محصولات" },
              ]}
            />

            {/* Page Intro */}
            <PageIntro
              title="فروشگاه محصولات دیجیتال"
              subtitle="بهترین محصولات دیجیتال با قیمت‌های مناسب"
            />

            {/* Main Content: Filters + Products */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Filters Sidebar - Hidden on mobile */}
              <div className="hidden lg:block">
                <FiltersSidebar
                  onChange={handleFiltersChange}
                  categories={sidebarCategories}
                />
              </div>

              {/* Products Grid */}
              <div className="lg:col-span-3 space-y-8">
                {/* Category Filters */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...springTransition, delay: 0.1 }}
                  className="flex flex-wrap justify-center lg:justify-start gap-3"
                >
                  {categoryButtons.map((category) => (
                    <Button
                      key={category.id}
                      variant={activeCategory === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveCategory(category.id)}
                      className="min-w-[120px]"
                    >
                      {category.label}
                    </Button>
                  ))}
                </motion.div>

                {/* Products Grid */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ ...springTransition, delay: 0.2 }}
                >
                  <SectionHeader
                    title={
                      isLoading
                        ? "در حال بارگذاری محصولات..."
                        : `${filteredProducts.length} محصول موجود`
                    }
                    eyebrow="محصولات دیجیتال"
                    className="mb-8"
                  />

                  <div className="max-w-sm sm:max-w-none mx-auto">
                    {fetchError && !isLoading && (
                      <p className="text-center text-sm text-destructive mb-6">
                        {fetchError}
                      </p>
                    )}
                    {isLoading ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-center text-sm text-muted-foreground">
                        <p className="col-span-full">در حال بارگذاری ...</p>
                      </div>
                    ) : filteredProducts.length === 0 ? (
                      <div className="text-center text-sm text-muted-foreground py-10">
                        هیچ محصولی مطابق فیلترهای شما یافت نشد.
                      </div>
                    ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5 sm:gap-x-6 sm:gap-y-7 lg:gap-x-8 lg:gap-y-10">
                        {filteredProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          ...springTransition,
                          delay: 0.3 + index * 0.05,
                        }}
                        className="w-full max-w-[280px] mx-auto sm:max-w-none"
                      >
                        <ProductCard
                          id={product.id}
                          slug={product.slug}
                          title={product.title}
                          image={product.image}
                          price={product.price}
                          oldPrice={product.oldPrice}
                          discountPct={product.discountPct}
                          onAdd={handleAddToCart}
                          className="[&>div:first-child]:aspect-[4/5] sm:[&>div:first-child]:aspect-[3/4]"
                        />
                      </motion.div>
                    ))}
                    </div>
                    )}
                  </div>
                </motion.div>

                {/* FAQ Section */}
                {faqItems.length > 0 && (
                  <FaqAccordion items={faqItems} className="mt-16" />
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer
          links={{
            products: "/products",
            magazine: "/magazine",
            courses: "/courses",
            pricing: "/pricing",
            support: "/support",
          }}
          socials={[
            { type: "Telegram", href: "https://t.me/sharifgpt" },
            { type: "Instagram", href: "https://instagram.com/sharifgpt" },
            { type: "X", href: "https://twitter.com/sharifgpt" },
          ]}
        />

        <FloatingDock
          onOpenChat={() => setChatOpen(true)}
          onOpenSupport={() => setSupportOpen(true)}
          onOpenCart={() => setCartOpen(true)}
          cartItemCount={cartState.itemCount}
        />

        <CartDrawer
          open={cartOpen}
          onClose={() => setCartOpen(false)}
        />

        <ChatbotPanel open={chatOpen} onClose={() => setChatOpen(false)} />
        <SupportPanel open={supportOpen} onClose={() => setSupportOpen(false)} />
      </div>
    </>
  );
}
