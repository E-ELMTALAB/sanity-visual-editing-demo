import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "@/components/Helmet";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer/Footer";
import { ProductCard } from "@/components/Products/ProductCard";
import { toast } from "sonner";
import { FaqAccordion } from "@/components/Products/FaqAccordion";
import { getCollectionBySlug } from "@/lib/sanity-cache-direct";
import { transformCollectionDetail, transformFaqItem } from "@/lib/sanity.transformers";
import { fetchProductPrices, type ProductPrices } from "@/lib/medusa-prices";
import { usePromotions } from "@/contexts/promotion-context";

export default function Collection() {
  const {
    slug
  } = useParams<{
    slug: string;
  }>();
  const [cartCount, setCartCount] = useState(0);
  const [collectionData, setCollectionData] = useState<ReturnType<typeof transformCollectionDetail> | null>(null);
  const [products, setProducts] = useState<ReturnType<typeof transformCollectionDetail>["products"]>([]);
  const [faqItems, setFaqItems] = useState<{ q: string; a: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [productPrices, setProductPrices] = useState<Record<string, ProductPrices>>({});
  const { getPromotionForProduct, getSiteWidePromotion } = usePromotions();
  const siteWidePromotion = getSiteWidePromotion();

  useEffect(() => {
    if (!slug) {
      setIsLoading(false);
      setFetchError("آدرس کلکسیون نامعتبر است");
      return;
    }

    let isMounted = true;

    async function loadCollection() {
      try {
        setIsLoading(true);
        const result = await getCollectionBySlug(slug!);
        if (!isMounted) return;

        if (!result) {
          setFetchError("کلکسیون مورد نظر یافت نشد");
          return;
        }

        const transformed = transformCollectionDetail(result);
        setCollectionData(transformed);
        setProducts(transformed.products);
        const faqs = Array.isArray(result?.faq)
          ? result.faq
              .map((faq: any) => transformFaqItem(faq))
              .filter((faq: { q: string; a: string }) => faq.q && faq.a)
          : [];
        setFaqItems(faqs);
        setFetchError(null);
      } catch (error) {
        console.error("[COLLECTION] Failed to fetch data", error);
        if (isMounted) {
          setFetchError("خطا در بارگذاری کلکسیون");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadCollection();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Fetch prices from Medusa for collection products
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
        console.error('[COLLECTION] Failed to fetch prices from Medusa:', error);
      }
    };
    
    fetchAllPrices();
  }, [products]);

  const collection = collectionData;
  const handleAddToCart = (id: string) => {
    setCartCount(prev => prev + 1);
    toast.success("محصول به سبد خرید اضافه شد");
  };
  const handleOpenCart = () => {
    toast.info("سبد خرید");
  };
  const handleSearch = (query: string) => {
    toast.info(`جستجو برای: ${query}`);
  };
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">در حال بارگذاری...</div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">{fetchError ?? "کلکسیون یافت نشد"}</div>
      </div>
    );
  }

  const origin = typeof window !== "undefined" ? window.location.origin : "https://sharifgpt.com";
  const seo = collection.seo || {};
  const seoTitle = seo.metaTitle || collection.heroTitle || collection.title || "شریف‌GPT";
  const seoDescription = seo.metaDescription || collection.heroSubtitle || collection.heroTitle || collection.title || "";
  const canonicalUrl = seo.canonicalUrl || `${origin}/collections/${slug}`;
  const ogTitle = seo.openGraphTitle || seo.metaTitle || seoTitle;
  const ogDescription = seo.openGraphDescription || seo.metaDescription || seoDescription;
  const ogImage = seo.openGraphImage || collection.cover;

  return <>
      <Helmet>
        <title>{seoTitle} | شریف‌GPT</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href={canonicalUrl} />
        {seo.robotsMeta && <meta name="robots" content={seo.robotsMeta} />}
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:url" content={canonicalUrl} />
        {ogImage && <meta property="og:image" content={ogImage} />}
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={ogTitle} />
        <meta name="twitter:description" content={ogDescription} />
        {ogImage && <meta name="twitter:image" content={ogImage} />}
        {seo.structuredData && (
          <script type="application/ld+json">{seo.structuredData}</script>
        )}
      </Helmet>

      <div className="min-h-screen text-foreground" dir="rtl">
        <Header onSearch={handleSearch} rtl={true} />

        {/* Banner Section */}
        <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden mb-8
                           [mask-image:linear-gradient(to_bottom,black_82%,transparent_100%)]
                           [-webkit-mask-image:linear-gradient(to_bottom,black_82%,transparent_100%)]">
          {/* Background Image */}
          <motion.img initial={{
          scale: 1.1,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} transition={{
          duration: 0.8,
          ease: "easeOut"
        }} src={collection.cover} alt={collection.title} className="absolute inset-0 w-full h-full object-cover [filter:brightness(.85)] md:[filter:brightness(1.18)_saturate(1.08)_contrast(1.05)]" />
          
          {/* Brand tint overlay - matches site's blue-purple palette */}
          <div className="absolute inset-0 mix-blend-soft-light opacity-85 md:opacity-60 bg-gradient-to-br from-[#1E67C6]/60 via-transparent to-[#8B5CF6]/60" />
          
          {/* Readability vignette */}
          <div className="absolute inset-0" style={{
          background: "radial-gradient(120% 80% at 85% 50%, rgba(0,0,0,.18) 0%, rgba(0,0,0,.55) 60%, rgba(0,0,0,.70) 100%)"
        }} />

          {/* Content */}
          <div className="relative h-full flex items-end pb-12 md:pb-16 pt-[100px] justify-end">
            <div className="container mx-auto px-4 md:px-6">
              <motion.div initial={{
              opacity: 0,
              y: 30
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6,
              delay: 0.3
            }} className="max-w-3xl text-right mt-[100px] my-0">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 justify-start">
                  <span className="text-foreground font-medium">{collection.title}</span>
                  <span>/</span>
                  <Link to="/" className="hover:text-foreground transition-colors">
                    خانه
                  </Link>
                </nav>

                {/* Glass card with title */}
                <div className="glass rounded-3xl p-6 md:p-8 border border-white/20">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-3">
                    {collection.heroTitle || collection.title}
                  </h1>
                  <p className="text-lg md:text-xl text-white/80">
                    {collection.heroSubtitle}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Products Grid Section */}
        <section className="container mx-auto px-4 md:px-6 py-8 pb-20">
          <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }}>
            {/* Section Header */}
            <div className="mb-8 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                محصولات {collection.title}
              </h2>
              <p className="text-muted-foreground">
                {products.length} محصول
              </p>
            </div>

            {/* Products Grid - matching homepage style */}
            <div className="max-w-[1400px] w-full mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
                {products.map((product, index) => {
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
                    transition={{ duration: 0.4, delay: 0.1 * index }} 
                    className="w-full"
                  >
                    <ProductCard
                      id={product.id}
                      title={product.title}
                      image={product.image}
                      price={product.price}
                      slug={product.slug}
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
            </div>

            {/* View All Link */}
            {products.length > 12 && <motion.div initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            duration: 0.5,
            delay: 0.6
          }} className="mt-12 text-center">
                <Link to={`/products?collection=${slug}`} className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full glass border border-white/20 hover:border-white/30 text-foreground hover:bg-white/5 transition-all duration-200">
                  مشاهده همه محصولات
                  <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>}
          </motion.div>
        </section>

        {faqItems.length > 0 && (
          <section className="container mx-auto px-4 md:px-6 pb-16">
            <h2 className="text-2xl font-bold mb-6 text-foreground text-center">سوالات مرتبط</h2>
            <FaqAccordion items={faqItems} />
          </section>
        )}

        <Footer links={{
        products: "/products",
        magazine: "/blog",
        courses: "/products?category=courses",
        pricing: "/products",
        support: "/support"
      }} socials={[{
        type: "Instagram",
        href: "https://instagram.com"
      }, {
        type: "X",
        href: "https://twitter.com"
      }, {
        type: "Telegram",
        href: "https://t.me"
      }]} />
      </div>
    </>;
}