import { useEffect, useMemo, useState } from "react";
import { Helmet } from "@/components/Helmet";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer/Footer";
import { SectionHeader } from "@/components/ui/section-header";
import { Breadcrumb } from "@/components/ui/breadcrumb-nav";
import { PageIntro } from "@/components/ui/page-intro";
import { ProductCard } from "@/components/Products/ProductCard";
import { FiltersSidebar } from "@/components/Products/FiltersSidebar";
import { FaqAccordion } from "@/components/Products/FaqAccordion";
import { CustomerReviews, type CustomerReview } from "@/components/Products/CustomerReviews";
import { ProductsContentAccordion } from "@/components/Products/ProductsContentAccordion";
import { FloatingDock } from "@/components/FloatingDock/FloatingDock";
import { CartDrawer } from "@/components/FloatingDock/CartDrawer";
import { ChatbotPanel } from "@/components/FloatingDock/ChatbotPanel";
import { SupportPanel } from "@/components/FloatingDock/SupportPanel";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDirection } from "@/contexts/DirectionContext";
import { useCart } from "@/contexts/cart-context";
import { fetchProductPrices, type ProductPrices } from "@/lib/medusa-prices";
import { usePromotions } from "@/contexts/promotion-context";
import { getAllProducts, getFaqsByPage, getPageBySlug } from "@/lib/sanity-cache-direct";
import { transformFaqItem, transformProductListItem } from "@/lib/sanity.transformers";
import { getImageUrl } from "@/lib/sanity.image";

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

type SeoMeta = {
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  robotsMeta?: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
  openGraphImage?: string;
  structuredData?: string;
};

// Feature flag: Temporarily disable testimonials on Product listing page
// TODO: Re-enable by setting ENABLE_PRODUCTS_PAGE_TESTIMONIAL to true
// Temporarily disabled on Product listing page. Still active on Product Detail page.
const ENABLE_PRODUCTS_PAGE_TESTIMONIAL = false;

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
  const { getPromotionForProduct, getSiteWidePromotion } = usePromotions();
  const siteWidePromotion = getSiteWidePromotion();
  const [pageSeo, setPageSeo] = useState<SeoMeta | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProductsPage() {
      try {
        setIsLoading(true);
        const [productsResult, faqsResult, seoResult] = await Promise.all([
          getAllProducts(),
          getFaqsByPage('products').catch(() => [] as any[]),
          getPageBySlug('products'),
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

        if (seoResult?.seo) {
          const seo = seoResult.seo;
          setPageSeo({
            metaTitle: seo.metaTitle || "فروشگاه محصولات دیجیتال | SharifGPT",
            metaDescription: seo.metaDescription || "فروشگاه محصولات دیجیتال SharifGPT - دوره‌های آموزشی، کتاب‌های الکترونیکی، ابزارها و قالب‌های آماده در حوزه هوش مصنوعی و برنامه‌نویسی",
            canonicalUrl: seo.canonicalUrl || "https://sharifgpt.ir/products",
            robotsMeta: seo.robotsMeta || "",
            openGraphTitle: seo.openGraphTitle || seo.metaTitle || "فروشگاه محصولات دیجیتال | SharifGPT",
            openGraphDescription: seo.openGraphDescription || seo.metaDescription || "فروشگاه محصولات دیجیتال SharifGPT - دوره‌های آموزشی، کتاب‌های الکترونیکی، ابزارها و قالب‌های آماده در حوزه هوش مصنوعی و برنامه‌نویسی",
            openGraphImage: seo.openGraphImage ? getImageUrl(seo.openGraphImage, 1200) : undefined,
            structuredData: seo.structuredData || "",
          });
        }
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
        <title>{pageSeo?.metaTitle || "فروشگاه محصولات دیجیتال | SharifGPT"}</title>
        <meta name="description" content={pageSeo?.metaDescription || "فروشگاه محصولات دیجیتال SharifGPT - دوره‌های آموزشی، کتاب‌های الکترونیکی، ابزارها و قالب‌های آماده در حوزه هوش مصنوعی و برنامه‌نویسی"} />
        <link rel="canonical" href={pageSeo?.canonicalUrl || "https://sharifgpt.ir/products"} />
        {pageSeo?.robotsMeta && <meta name="robots" content={pageSeo.robotsMeta} />}
        <meta property="og:title" content={pageSeo?.openGraphTitle || pageSeo?.metaTitle || "فروشگاه محصولات دیجیتال | SharifGPT"} />
        <meta property="og:description" content={pageSeo?.openGraphDescription || pageSeo?.metaDescription || "فروشگاه محصولات دیجیتال SharifGPT - دوره‌های آموزشی، کتاب‌های الکترونیکی، ابزارها و قالب‌های آماده در حوزه هوش مصنوعی و برنامه‌نویسی"} />
        <meta property="og:url" content={pageSeo?.canonicalUrl || "https://sharifgpt.ir/products"} />
        <meta property="og:type" content="website" />
        {pageSeo?.openGraphImage && <meta property="og:image" content={pageSeo.openGraphImage} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageSeo?.openGraphTitle || pageSeo?.metaTitle || "فروشگاه محصولات دیجیتال | SharifGPT"} />
        <meta name="twitter:description" content={pageSeo?.openGraphDescription || pageSeo?.metaDescription || "فروشگاه محصولات دیجیتال SharifGPT - دوره‌های آموزشی، کتاب‌های الکترونیکی، ابزارها و قالب‌های آماده در حوزه هوش مصنوعی و برنامه‌نویسی"} />
        {pageSeo?.openGraphImage && <meta name="twitter:image" content={pageSeo.openGraphImage} />}
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
        {pageSeo?.structuredData && (
          <script type="application/ld+json">
            {pageSeo.structuredData}
          </script>
        )}
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

                {/* Customer Reviews / Testimonials Section */}
                {/* Temporarily disabled on Product listing page. Still active on Product Detail page. */}
                {ENABLE_PRODUCTS_PAGE_TESTIMONIAL && (
                  <CustomerReviews
                    reviews={[
                      {
                        id: "1",
                        text: "محصولات عالی و با کیفیت. تحویل سریع و پشتیبانی عالی داشتند. حتماً دوباره خرید می‌کنم.",
                        screenshot: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
                        source: {
                          platform: "telegram",
                          label: "کانال تلگرام",
                          url: "https://t.me/sharifgpt",
                        },
                      },
                      {
                        id: "2",
                        text: "راضی هستم از خرید. قیمت‌ها مناسب و محصولات با کیفیت هستند.",
                        screenshot: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80",
                        source: {
                          platform: "instagram",
                          label: "صفحه اینستاگرام",
                          url: "https://instagram.com/sharifgpt",
                        },
                      },
                      {
                        id: "3",
                        text: "خدمات عالی و سریع. پیشنهاد می‌کنم به همه دوستان.",
                        source: {
                          platform: "whatsapp",
                          label: "واتساپ",
                          url: "https://wa.me/1234567890",
                        },
                      },
                    ]}
                  />
                )}

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

                  <div className="max-w-[1400px] w-full mx-auto">
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
                        {filteredProducts.map((product, index) => {
                          // Get promotion info for this product
                          const productPriceData = product.slug ? productPrices?.[product.slug] : undefined;
                          const medusaVariants = productPriceData?.variants || [];
                          const medusaProductId = productPriceData?.product_id; // Medusa product ID

                          // Find the variant with the lowest current price
                          const validVariants = medusaVariants.filter(v => v.price > 0);
                          const lowestPriceVariant = validVariants.length > 0
                            ? validVariants.reduce((lowest, current) =>
                              current.price < lowest.price ? current : lowest
                            )
                            : null;

                          // For product cards: original price should be the lowest variant's original_price
                          // If the lowest variant has original_price, use it; otherwise use its current price as original
                          const originalPrice = lowestPriceVariant?.original_price || lowestPriceVariant?.price || product.price;

                          // Use Medusa product ID if available, otherwise fall back to Sanity ID
                          const productIdForMatching = medusaProductId || product.id;
                          const promotionInfo = product.slug && originalPrice > 0
                            ? getPromotionForProduct(product.slug, productIdForMatching, originalPrice)
                            : null;

                          // Check if product has a discount from variant
                          const hasVariantDiscount = lowestPriceVariant?.original_price && lowestPriceVariant.original_price > lowestPriceVariant.price;

                          // Determine endsAt: priority is promotionInfo > variant promotion_ends_at > site-wide promotion
                          const variantEndsAt = lowestPriceVariant?.promotion_ends_at;
                          const endsAt = promotionInfo?.endsAt || variantEndsAt || siteWidePromotion?.campaign?.ends_at;

                          // Check if product has any discount (from promotion or variant)
                          const hasDiscount = promotionInfo || hasVariantDiscount || (lowestPriceVariant?.price && lowestPriceVariant.price < originalPrice);

                          return (
                            <motion.div
                              key={product.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                ...springTransition,
                                delay: 0.3 + index * 0.05,
                              }}
                              className="w-full"
                            >
                              <ProductCard
                                id={product.id}
                                slug={product.slug}
                                title={product.title}
                                image={product.image}
                                price={product.price}
                                medusaVariants={medusaVariants}
                                onAdd={handleAddToCart}
                                promotion={promotionInfo ? {
                                  discountPercentage: promotionInfo.discountPercentage,
                                  originalPrice: promotionInfo.originalPrice,
                                  discountedPrice: promotionInfo.discountedPrice,
                                  endsAt: endsAt,
                                } : (hasDiscount ? {
                                  discountPercentage: hasVariantDiscount && lowestPriceVariant?.discount_percentage
                                    ? lowestPriceVariant.discount_percentage
                                    : (originalPrice > 0 ? Math.round(((originalPrice - (lowestPriceVariant?.price || originalPrice)) / originalPrice) * 100) : 0),
                                  originalPrice: originalPrice,
                                  discountedPrice: lowestPriceVariant?.price || originalPrice,
                                  endsAt: endsAt, // Will be used if available, ProductCard will fallback to site-wide
                                } : undefined)}
                              />
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* FAQ Section */}
                {faqItems.length > 0 && (
                  <FaqAccordion items={faqItems} className="mt-16" />
                )}

                {/* Products Content / Trust Accordion (below product cards, above footer) */}
                <ProductsContentAccordion />
              </div>
            </div>
          </div>
        </main>

        <Footer
          links={{
            products: "/products",
            magazine: "/blog",
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
