import { useState, useEffect, useRef, type CSSProperties } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ShoppingCart, Check, Truck, Shield, RefreshCw, Star, ChevronRight, ChevronDown } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer/Footer";
import { SectionHeader } from "@/components/ui/section-header";
import { ProductCard } from "@/components/Products/ProductCard";
import { BlogCard, type BlogPost as BlogCardPost } from "@/components/Blog/BlogCard";
import { Price } from "@/components/ui/price";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaqAccordion } from "@/components/Products/FaqAccordion";
import { CartDrawer } from "@/components/FloatingDock/CartDrawer";
import { SurfaceGlass } from "@/components/ui/surface-glass";
import { CountdownTimer } from "@/components/ui/countdown-timer";
import { useDirection } from "@/contexts/DirectionContext";
import { useCart } from "@/contexts/cart-context";
import { useProductPromotion } from "@/contexts/promotion-context";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { fetchFromSanity } from "@/lib/sanity.client.light";
import { validateSanityConfig } from "@/lib/sanity.config";
import { productBySlugQuery, faqsByPageQuery } from "@/lib/sanity.queries";
import { transformProductDetail, transformFaqItem } from "@/lib/sanity.transformers";
import { fetchProductPrices, type MedusaVariant } from "@/lib/medusa-prices";
import { toPersianNumber, calculateDiscountedPrice } from "@/lib/medusa-promotions";
import EnhancedMarkdownRenderer from "@/components/EnhancedMarkdownRenderer";
const springTransition = {
  type: "spring" as const,
  stiffness: 220,
  damping: 28
};

type ProductBadge = "sale" | "new" | "hot" | string;

interface ProductVariant {
  id: string;
  name: string;
  nameFa: string;
  price?: number;
  inStock?: boolean;
}

interface RelatedProductCardData {
  id: string;
  title: string;
  image: string;
  price: number;
  slug?: string;
}

interface ProductDetailData {
  id: string;
  handle: string;
  title: string;
  titleFa: string;
  description: string;
  descriptionFa: string;
  image: string;
  images: string[];
  price: number;
  originalPrice?: number;
  category: string;
  categoryFa: string;
  inStock: boolean;
  badge?: ProductBadge;
  badges: string[];
  variants: ProductVariant[];
  features: string[];
  featuresFa: string[];
  rating?: number;
  reviewCount?: number;
  relatedProducts: RelatedProductCardData[];
  relatedPosts: BlogCardPost[];
}

interface FaqItem {
  q: string;
  a: string;
}

// Helper function to extract headings from markdown content
const extractHeadingsFromMarkdown = (content: string): Array<{ level: number; text: string; id: string }> => {
  if (!content) return [];
  
  const lines = content.split('\n');
  const headings: Array<{ level: number; text: string; id: string }> = [];
  let headingCounter = 0;
  
  lines.forEach(line => {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      const id = `heading-${headingCounter++}`;
      headings.push({ level, text, id });
    }
  });
  
  return headings;
};

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isRTL } = useDirection();
  const [product, setProduct] = useState<ProductDetailData | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [faqItems, setFaqItems] = useState<FaqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [medusaVariants, setMedusaVariants] = useState<MedusaVariant[]>([]);
  const [medusaProductId, setMedusaProductId] = useState<string | undefined>(undefined);
  const [pricesLoading, setPricesLoading] = useState(false);
  const [pricesError, setPricesError] = useState<string | null>(null);
  const [relatedProductPrices, setRelatedProductPrices] = useState<Record<string, { variants: MedusaVariant[] }>>({});
  const { addItem, setSingleItem, state: cartState } = useCart();
  const stickyRef = useRef<HTMLDivElement>(null);
  const [tocHeadings, setTocHeadings] = useState<Array<{ level: number; text: string; id: string }>>([]);
  
  // Get promotion info from context - use Medusa product ID if available
  const validMedusaPrices = medusaVariants.filter(v => v.price > 0).map(v => v.price);
  const lowestMedusaPrice = validMedusaPrices.length > 0 
    ? Math.min(...validMedusaPrices)
    : product?.price || 0;
  const productIdForPromotion = medusaProductId || product?.id; // Prefer Medusa product ID
  const productPromotion = useProductPromotion(slug, productIdForPromotion, lowestMedusaPrice);

  // Extract headings from description when product loads
  useEffect(() => {
    if (product) {
      const descriptionContent = (isRTL ? product.descriptionFa : product.description) || '';
      const headings = extractHeadingsFromMarkdown(descriptionContent);
      setTocHeadings(headings);
    }
  }, [product, isRTL]);

  useEffect(() => {
    const configValid = validateSanityConfig();
    if (!slug) {
      setError("شناسه محصول معتبر نیست");
      setIsLoading(false);
      return;
    }
    if (!configValid) {
      setError("اتصال به Sanity پیکربندی نشده است");
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    async function loadProduct() {
      try {
        setIsLoading(true);
        const result = await fetchFromSanity(productBySlugQuery, { slug });
        
        // Debug logging for chatgpt-plus
        if (slug === 'chatgpt-plus') {
          const rawResult = result as any;
          console.log('[PRODUCT-DETAIL DEBUG] Raw Sanity result for chatgpt-plus:', rawResult);
          console.log('[PRODUCT-DETAIL DEBUG] Image field:', rawResult?.image);
          console.log('[PRODUCT-DETAIL DEBUG] FeaturedImage field:', rawResult?.featuredImage);
          console.log('[PRODUCT-DETAIL DEBUG] Gallery field:', rawResult?.gallery);
          console.log('[PRODUCT-DETAIL DEBUG] Price field:', rawResult?.price);
          console.log('[PRODUCT-DETAIL DEBUG] Options field:', rawResult?.options);
        }
        
        if (!isMounted) return;

        if (!result) {
          setError("محصول مورد نظر یافت نشد");
          setProduct(null);
          return;
        }

        const transformed = transformProductDetail(result);
        
        // Debug logging for chatgpt-plus
        if (slug === 'chatgpt-plus') {
          console.log('[PRODUCT-DETAIL DEBUG] Transformed product:', transformed);
          console.log('[PRODUCT-DETAIL DEBUG] Transformed image:', transformed.image);
          console.log('[PRODUCT-DETAIL DEBUG] Transformed images array:', transformed.images);
          console.log('[PRODUCT-DETAIL DEBUG] Transformed price:', transformed.price);
          console.log('[PRODUCT-DETAIL DEBUG] Transformed variants:', transformed.variants);
        }
        
        setProduct(transformed);
        setSelectedVariant(null);
        setSelectedImage(0);
        setError(null);
      } catch (err) {
        console.error("[PRODUCT DETAIL]", err);
        if (isMounted) {
          setError("خطا در بارگذاری اطلاعات محصول");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  useEffect(() => {
    let isMounted = true;

    async function loadFaqs() {
      try {
        const result = await fetchFromSanity(faqsByPageQuery, { page: "products" });
        if (!isMounted) return;
        const mapped = Array.isArray(result) ? result.map(transformFaqItem) : [];
        setFaqItems(mapped.filter((item) => item.q && item.a));
      } catch (err) {
        console.error("[PRODUCT DETAIL] Failed to fetch FAQs", err);
        if (isMounted) {
          setFaqItems([]);
        }
      }
    }

    loadFaqs();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch prices from Medusa backend
  useEffect(() => {
    const fetchPrices = async () => {
      if (!product?.handle && !slug) return;
      
      const productSlug = product?.handle || slug;
      if (!productSlug) return;
      
      try {
        setPricesLoading(true);
        const prices = await fetchProductPrices([productSlug]);
        const productPrices = prices[productSlug];
        
        if (productPrices?.variants?.length > 0) {
          setMedusaVariants(productPrices.variants);
          // Store Medusa product ID for promotion matching
          if (productPrices.product_id) {
            setMedusaProductId(productPrices.product_id);
          }
          setPricesError(null);
        } else {
          setPricesError('قیمت‌ها در دسترس نیستند');
          setMedusaVariants([]);
        }
      } catch (error: any) {
        console.error('[PRODUCT-DETAIL] Price fetch error:', error);
        setPricesError('خطا در دریافت قیمت‌ها');
        setMedusaVariants([]);
      } finally {
        setPricesLoading(false);
      }
    };
    
    if (product) {
      fetchPrices();
    }
  }, [product?.handle, slug, product]);

  // Fetch prices for related products from Medusa
  useEffect(() => {
    const fetchRelatedPrices = async () => {
      if (!product?.relatedProducts?.length) return;
      
      const slugs = product.relatedProducts
        .map(p => p.slug)
        .filter(Boolean) as string[];
      
      if (slugs.length === 0) return;
      
      try {
        const prices = await fetchProductPrices(slugs);
        setRelatedProductPrices(prices);
      } catch (error) {
        console.error('[PRODUCT-DETAIL] Related products price fetch error:', error);
      }
    };
    
    if (product?.relatedProducts?.length) {
      fetchRelatedPrices();
    }
  }, [product?.relatedProducts]);

  const getLowestPricedMedusaVariantId = () => {
    if (!medusaVariants.length) return null;
    const sorted = [...medusaVariants].filter(v => typeof v.price === "number" && v.price > 0)
      .sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    return sorted[0]?.variant_id ?? null;
  };

  const getLowestPricedSanityVariantId = () => {
    if (!product?.variants?.length) return null;
    const sorted = [...product.variants].filter(v => typeof v.price === "number" && v.price > 0)
      .sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    return sorted[0]?.id ?? null;
  };

  useEffect(() => {
    if (selectedVariant) return;
    const medusaDefault = getLowestPricedMedusaVariantId();
    if (medusaDefault) {
      setSelectedVariant(medusaDefault);
      return;
    }
    const sanityDefault = getLowestPricedSanityVariantId();
    if (sanityDefault) {
      setSelectedVariant(sanityDefault);
    }
  }, [medusaVariants, product?.variants, selectedVariant]);

  // Get current price based on selected variant
  const getCurrentPrice = () => {
    console.log('[PRODUCT-DETAIL] getCurrentPrice called:', {
      slug,
      medusaVariantsCount: medusaVariants.length,
      selectedVariant,
      pricesLoading,
      productPrice: product?.price,
    });
    
    // Priority 1: Medusa variant price (if variant selected)
    if (medusaVariants.length > 0 && selectedVariant) {
      const variant = medusaVariants.find(v => v.variant_id === selectedVariant);
      if (variant?.price) {
        console.log('[PRODUCT-DETAIL] ✅ getCurrentPrice - Using Medusa variant price:', variant.price, 'for variant:', variant.name);
        return variant.price;
      }
    }
    
    // Priority 2: Lowest Medusa variant price (if no variant selected but Medusa has data)
    if (medusaVariants.length > 0) {
      const lowestPrice = Math.min(...medusaVariants.filter(v => v.price > 0).map(v => v.price));
      if (lowestPrice && lowestPrice !== Infinity) {
        console.log('[PRODUCT-DETAIL] ✅ getCurrentPrice - Using lowest Medusa price:', lowestPrice);
        return lowestPrice;
      }
    }
    
    // Priority 3: Sanity variant price (fallback)
    if (product?.variants && selectedVariant) {
      const variant = product.variants.find(v => v.id === selectedVariant);
      if (variant?.price) {
        console.log('[PRODUCT-DETAIL] ⚠️ getCurrentPrice - Using Sanity variant price:', variant.price, 'for variant:', variant.name);
        return variant.price;
      }
    }
    
    // Priority 4: If prices are still loading, show 0 (will update when loaded)
    if (pricesLoading) {
      console.log('[PRODUCT-DETAIL] ⏳ getCurrentPrice - Prices loading, showing 0');
      return 0;
    }
    
    // Priority 5: Sanity product price (last resort fallback)
    console.log('[PRODUCT-DETAIL] ⚠️ getCurrentPrice - Using Sanity product price fallback:', product?.price || 0);
    return product?.price || 0;
  };

  const hasMedusaPricing = medusaVariants.some(
    (variant) => typeof variant.price === "number" && variant.price > 0
  );

  const getOriginalPrice = () => {
    if (!product) return 0;

    if (product.variants && selectedVariant) {
      const sanityVariant = product.variants.find((variant) => variant.id === selectedVariant);
      if (typeof sanityVariant?.price === "number" && sanityVariant.price > 0) {
        return sanityVariant.price;
      }
    }

    if (typeof product.originalPrice === "number" && product.originalPrice > 0) {
      return product.originalPrice;
    }

    return typeof product.price === "number" ? product.price : 0;
  };

  const addProductToCart = () => {
    console.log('[PRODUCT-DETAIL] ========== ADD TO CART STARTED ==========');
    console.log('[PRODUCT-DETAIL] Product ID:', product?.id);
    console.log('[PRODUCT-DETAIL] Product title:', product?.title);
    console.log('[PRODUCT-DETAIL] Selected variant:', selectedVariant);
    console.log('[PRODUCT-DETAIL] Quantity:', quantity);
    console.log('[PRODUCT-DETAIL] Medusa variants available:', medusaVariants.length);
    console.log('[PRODUCT-DETAIL] All Medusa variants:', medusaVariants.map(v => ({ id: v.variant_id, name: v.name, price: v.price })));
    console.log('[PRODUCT-DETAIL] Current price from getCurrentPrice():', getCurrentPrice());
    
    if (!product) {
      console.error('[PRODUCT-DETAIL] ❌ No product data');
      return false;
    }
    
    // Use Medusa variant if available
    const selectedVariantData = medusaVariants.find(v => v.variant_id === selectedVariant);
    console.log('[PRODUCT-DETAIL] Found selected variant data:', selectedVariantData);
    
    if ((medusaVariants.length > 0 || (product?.variants?.length ?? 0) > 0) && !selectedVariant) {
      toast({
        title: "انتخاب گزینه",
        description: "لطفاً ابتدا یکی از گزینه‌های محصول را انتخاب کنید.",
        variant: "destructive",
      });
      return false;
    }
    
    if (medusaVariants.length > 0) {
      console.log('[PRODUCT-DETAIL] Using Medusa variant data');
      console.log('[PRODUCT-DETAIL] Selected variant data details:', {
        variant_id: selectedVariantData?.variant_id,
        name: selectedVariantData?.name,
        price: selectedVariantData?.price,
        currency: selectedVariantData?.currency
      });
      
      // If we have Medusa variants, validate price
      if (!selectedVariantData || !selectedVariantData.price || selectedVariantData.price === 0) {
        console.error('[PRODUCT-DETAIL] ❌ Invalid or missing price for variant:', selectedVariant);
        console.error('[PRODUCT-DETAIL] Available variants:', medusaVariants.map(v => ({ id: v.variant_id, name: v.name, price: v.price })));
        toast({
          title: "خطا",
          description: 'قیمت این محصول در دسترس نیست. لطفاً با پشتیبانی تماس بگیرید.',
          variant: "destructive",
        });
        return false;
      }
      
      // Get slug from product (handle both string and object formats)
      const sanitySlug = typeof product.handle === 'string' 
        ? product.handle 
        : slug || '';
      
      console.log('[PRODUCT-DETAIL] Sanity slug:', sanitySlug);
      
      const cartItem = {
        id: parseInt(product.id) || Date.now(),
        title: product.title,
        price: selectedVariantData.price,
        image: product.image || '/placeholder.svg',
        quantity: quantity,
        selectedOption: selectedVariantData.name,
        sanity_slug: sanitySlug,
        variant_id: selectedVariantData.variant_id,
        option_name: selectedVariantData.name,
      };
      
      console.log('[PRODUCT-DETAIL] Cart item being created:', {
        title: cartItem.title,
        price: cartItem.price,
        variant_id: cartItem.variant_id,
        option_name: cartItem.option_name,
        sanity_slug: cartItem.sanity_slug
      });
      setSingleItem(cartItem);
      console.log('[PRODUCT-DETAIL] ✅ Cart replaced with single product');
      console.log('[PRODUCT-DETAIL] =========================================');
      return true;
    } else {
      console.log('[PRODUCT-DETAIL] Using fallback (no Medusa variants)');
      // Fallback: use product data without Medusa (for products not synced yet)
      const sanitySlug = typeof product.handle === 'string' 
        ? product.handle 
        : slug || '';
      
      const selectedProductVariant = product.variants.find(v => v.id === selectedVariant);
      const price = selectedProductVariant?.price || product.price || 0;
      
      console.log('[PRODUCT-DETAIL] Fallback price:', price);
      console.log('[PRODUCT-DETAIL] Sanity slug:', sanitySlug);
      
      if (price === 0) {
        console.error('[PRODUCT-DETAIL] ❌ Price is zero');
        toast({
          title: "خطا",
          description: 'قیمت این محصول در دسترس نیست.',
          variant: "destructive",
        });
        return false;
      }
      
      const cartItem = {
        id: parseInt(product.id) || Date.now(),
        title: product.title,
        price: price,
        image: product.image || '/placeholder.svg',
        quantity: quantity,
        selectedOption: selectedProductVariant?.name,
        sanity_slug: sanitySlug,
      };
      
      console.log('[PRODUCT-DETAIL] Cart item to set (fallback, replacing cart):', cartItem);
      setSingleItem(cartItem);
      console.log('[PRODUCT-DETAIL] ✅ Cart replaced with single product (fallback)');
      console.log('[PRODUCT-DETAIL] =========================================');
      return true;
    }
  };

  const handleAddToCart = () => {
    if (addProductToCart()) {
      toast({
        title: "موفق",
        description: "محصول به سبد خرید اضافه شد",
      });
    }
  };

  const handleBuyNow = () => {
    if (addProductToCart()) {
      // Navigate to checkout page
    navigate("/checkout");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">
          در حال بارگذاری...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">
          {error ?? "محصول یافت نشد"}
        </div>
      </div>
    );
  }

  const currentPrice = getCurrentPrice();
  const originalPrice = getOriginalPrice();
  const shouldShowOriginalPrice =
    hasMedusaPricing &&
    originalPrice > 0 &&
    originalPrice !== currentPrice;
  const structuredDataPrice = currentPrice > 0 ? currentPrice : (product.price || 0);
  // Always force RTL for this Persian product page
  const forceRTL = true;
  const enforceRTL = true;
  const galleryImages = product.images.length > 0 ? product.images : (product.image ? [product.image] : []);
  const currentImage = galleryImages[selectedImage] || galleryImages[0] || "";
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: isRTL ? product.titleFa : product.title,
    image: product.images,
    description: isRTL ? product.descriptionFa : product.description,
    brand: {
      "@type": "Brand",
      name: "SharifGPT"
    },
    offers: {
      "@type": "Offer",
      url: window.location.href,
      priceCurrency: "IRR",
      price: structuredDataPrice,
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{
      "@type": "ListItem",
      position: 1,
        name: "خانه",
        item: window.location.origin
      }, {
        "@type": "ListItem",
        position: 2,
        name: "محصولات",
        item: `${window.location.origin}/products`
    }, {
      "@type": "ListItem",
      position: 3,
      name: (isRTL || forceRTL) ? product.titleFa : product.title,
      item: window.location.href
    }]
  };

  const relatedProducts = product.relatedProducts || [];
  const relatedPosts = product.relatedPosts || [];
  const faqs = faqItems;
  return <>
      <Helmet>
        <title>{((isRTL || forceRTL) ? product.titleFa : product.title) + " | SharifGPT"}</title>
        <meta name="description" content={(isRTL || forceRTL) ? product.descriptionFa : product.description} />
        <link rel="canonical" href={`https://sharifgpt.ai/products/${slug}`} />
        <script type="application/ld+json">{JSON.stringify(productJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      </Helmet>

      <div className="min-h-screen">
        <Header onSearch={query => console.log("Search:", query)} active="Products" />

        <main className="pt-[72px] pb-24 md:pb-10" dir={enforceRTL ? "rtl" : "ltr"}>
          <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 space-y-6 py-6 min-w-0 my-[25px]">
            {/* Product Main Section */}
            <SurfaceGlass className="rounded-2xl p-4 sm:p-6 md:p-8 min-w-0">
              <div className="flex flex-col md:flex-row-reverse gap-6 md:gap-8 min-w-0 md:items-start">
                {/* Product Info - Sticky on Desktop */}
                <div
                  ref={stickyRef}
                  className="w-full md:w-1/2 lg:w-[45%] md:sticky md:top-[100px] min-w-0 order-last md:order-none"
                  dir="rtl"
                  style={{
                    direction: "rtl",
                    textAlign: "right",
                    unicodeBidi: "plaintext",
                    marginRight: 0,
                    paddingRight: 0,
                  }}
                >
                  {/* Breadcrumb */}
                  <nav
                    className="mb-3 text-xs sm:text-sm text-muted-foreground flex items-center gap-2 flex-wrap min-w-0 flex-row-reverse justify-start"
                    style={{ direction: "rtl", marginRight: 0, paddingRight: 0 }}
                  >
                    <Link to="/" className="hover:text-foreground transition-colors whitespace-nowrap">
                      خانه
                    </Link>
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 shrink-0 rotate-180" />
                    <Link to="/products" className="hover:text-foreground transition-colors whitespace-nowrap">
                      محصولات
                    </Link>
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 shrink-0 rotate-180" />
                    <span className="text-foreground line-clamp-1 min-w-0">{product.titleFa || product.title}</span>
                  </nav>

                  <div className="min-w-0" style={{ textAlign: "right", marginRight: 0, paddingRight: 0 }}>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 break-words" style={{ textAlign: "right", marginRight: 0 }}>
                      {product.titleFa || product.title}
                    </h1>
                    
                    {/* Rating Summary */}
                    <a href="#reviews" className="inline-flex items-center gap-2 text-sm hover:text-primary transition-colors mb-2 flex-row-reverse" style={{ direction: "rtl" }}>
                      <div className="flex items-center gap-1 flex-row-reverse">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />)}
                      </div>
                      <span className="font-semibold">۴.۹</span>
                      <span className="text-muted-foreground">
                        (۱۲۸ نظر)
                      </span>
                    </a>

                    
                  </div>

                  <div className="min-w-0" style={{ textAlign: "right", marginRight: 0, paddingRight: 0 }}>
                    {/* Promotion Badge */}
                    {productPromotion && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-3"
                      >
                        <Badge className="bg-red-500 text-white px-3 py-1 text-sm font-bold">
                          {toPersianNumber(productPromotion.discountPercentage)}٪ تخفیف ویژه
                        </Badge>
                      </motion.div>
                    )}
                    
                    {/* On mobile, only show price when variant is selected (if variants exist) */}
                    {(() => {
                      const hasVariants = (medusaVariants.length > 0 || (product?.variants?.length || 0) > 0);
                      const shouldShowOnMobile = !hasVariants || selectedVariant;
                      
                      return (
                        <div className={cn(
                          "overflow-x-auto",
                          !shouldShowOnMobile && "hidden md:block" // Hide on mobile if variants exist but none selected
                        )} style={{ textAlign: "right", marginRight: 0 }}>
                          <Price
                            current={productPromotion ? productPromotion.discountedPrice : currentPrice}
                            old={productPromotion ? productPromotion.originalPrice : (shouldShowOriginalPrice ? originalPrice : undefined)}
                            discountPercentage={productPromotion?.discountPercentage}
                            className="text-xl sm:text-2xl whitespace-nowrap"
                            variant={productPromotion ? "promotional" : "default"}
                          />
                        </div>
                      );
                    })()}
                    
                    {/* Countdown Timer for time-limited promotions */}
                    {productPromotion?.endsAt && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3"
                      >
                        <div className="text-sm text-muted-foreground mb-2">پایان تخفیف:</div>
                        <CountdownTimer 
                          endsAt={productPromotion.endsAt} 
                          size="md" 
                          variant="default"
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* Features */}
                  <div style={{ textAlign: "right", marginRight: 0, paddingRight: 0, width: "100%" }}>
                    {(product.featuresFa || product.features).map((feature, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-start gap-2 text-sm mb-2 justify-end flex-row-reverse"
                        style={{ direction: "rtl", textAlign: "right", marginRight: 0, paddingRight: 0, width: "100%" }}
                      >
                        <span className="text-foreground/80" style={{ marginRight: 0 }}>{feature}</span>
                        <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      </div>
                    ))}
                  </div>

                  {/* Quantity & Actions */}
                  <div className="min-w-0" style={{ textAlign: "right", marginRight: 0, paddingRight: 0 }}>
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 md:mt-[100px] flex-row-reverse justify-start mt-6" style={{ marginRight: 0 }}>
                      <div className="flex items-center glass rounded-lg shrink-0">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 sm:px-4 py-2 hover:bg-surface-glass transition-colors">
                          -
                        </button>
                        <span className="px-4 sm:px-6 py-2 font-semibold">{quantity}</span>
                        <button onClick={() => setQuantity(quantity + 1)} className="px-3 sm:px-4 py-2 hover:bg-surface-glass transition-colors">
                          +
                        </button>
                      </div>
                    </div>

                    {/* On mobile, only show buy button when variant is selected (if variants exist) */}
                    {(() => {
                      const hasVariants = (medusaVariants.length > 0 || (product?.variants?.length || 0) > 0);
                      const shouldShowOnMobile = !hasVariants || selectedVariant;
                      
                      return (
                        <div className={cn(
                          "flex gap-2 sm:gap-3 min-w-0 mt-6",
                          !shouldShowOnMobile && "hidden md:flex" // Hide on mobile if variants exist but none selected
                        )}>
                          <Button size="lg" onClick={handleBuyNow} className="flex-1 min-w-0 text-sm sm:text-base">
                            <ShoppingCart className="ml-1 h-4 w-4 shrink-0" />
                            <span className="truncate">خرید</span>
                          </Button>
                        </div>
                      );
                    })()}

                    {/* Policy Microcopy */}
                    <p className="text-xs text-muted-foreground text-center break-words mt-6" style={{ textAlign: "right" }}>
                      تحویل فوری دیجیتال • پشتیبانی ۲۴ ساعته • ضمانت بازگشت وجه • دسترسی دائمی
                    </p>
                  </div>

                  {/* Trust Badges */}
                  <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-border-glass min-w-0">
                    <div className="flex flex-col items-center text-center gap-1 sm:gap-2 min-w-0">
                      <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-primary shrink-0" />
                      <span className="text-xs text-muted-foreground break-words">
                        تحویل فوری
                      </span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-1 sm:gap-2 min-w-0">
                      <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary shrink-0" />
                      <span className="text-xs text-muted-foreground break-words">
                        پرداخت امن
                      </span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-1 sm:gap-2 min-w-0">
                      <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 text-primary shrink-0" />
                      <span className="text-xs text-muted-foreground break-words">
                        پشتیبانی کامل
                      </span>
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div className="w-full md:w-1/2 lg:w-[55%] space-y-4 min-w-0 order-first md:order-none">
                  <motion.div key={selectedImage} initial={{
                  opacity: 0
                }} animate={{
                  opacity: 1
                }} className="relative aspect-square rounded-2xl overflow-hidden glass w-full">
                    <img src={currentImage} alt={isRTL ? product.titleFa : product.title} className="w-full h-full object-cover object-top" />
                    {product.badge && <div className="absolute top-4 ltr:left-4 rtl:right-4">
                        <Badge variant={product.badge as "sale" | "new" | "hot"}>
                          {product.badge === "sale" && "تخفیف"}
                          {product.badge === "new" && "جدید"}
                          {product.badge === "hot" && "داغ"}
                        </Badge>
                      </div>}
                  </motion.div>

                  {/* Variants Selection */}
                  {((medusaVariants.length > 0 ? medusaVariants : product.variants) && (medusaVariants.length > 0 ? medusaVariants : product.variants).length > 0) && <div className="space-y-3 mt-4">
                      <label className="text-sm font-medium text-foreground">
                        {isRTL ? "انتخاب مدت زمان:" : "Select Duration:"}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0">
                        {(medusaVariants.length > 0 ? medusaVariants : product.variants).map((variant, idx) => {
                          const variantId = medusaVariants.length > 0 ? variant.variant_id : variant.id;
                          const variantName = medusaVariants.length > 0 ? variant.name : (isRTL ? variant.nameFa : variant.name);
                          const variantPrice = medusaVariants.length > 0 ? variant.price : variant.price || 0;
                          const variantInStock = medusaVariants.length > 0 ? true : variant.inStock !== false;

                          return (
                            <button
                              key={variantId || idx}
                              onClick={() => setSelectedVariant(variantId)}
                              disabled={!variantInStock}
                              className={cn("relative p-4 rounded-xl border-2 transition-all duration-200 min-w-0 overflow-hidden", "hover:scale-[1.02] active:scale-[0.98]", selectedVariant === variantId ? "border-primary bg-primary/10 shadow-lg shadow-primary/20" : "border-border/50 bg-surface-glass/30 hover:border-border", !variantInStock && "opacity-50 cursor-not-allowed hover:scale-100")}
                            >
                            <div className="flex flex-col items-start gap-2 min-w-0">
                              <span className="font-semibold text-foreground text-sm line-clamp-2">
                                  {variantName}
                              </span>
                              <div className="flex items-baseline gap-2 flex-wrap min-w-0">
                                <span className="text-base sm:text-lg font-bold text-primary">
                                    {new Intl.NumberFormat(isRTL ? "fa-IR" : "en-US").format(variantPrice)} تومان
                                </span>
                              </div>
                            </div>
                              {selectedVariant === variantId && <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-primary-foreground" />
                              </div>}
                              {!variantInStock && <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-xl">
                                <span className="text-sm font-medium text-muted-foreground">
                                    {isRTL ? "ناموجود" : "Out of Stock"}
                                </span>
                              </div>}
                            </button>
                          );
                        })}
                      </div>
                    </div>}
                </div>
              </div>

              {/* Specs Table */}
              
            </SurfaceGlass>

            {/* Description Section with TOC */}
            <SurfaceGlass className="rounded-2xl p-6 md:p-8">
              <div className="grid md:grid-cols-[280px_1fr] gap-8">
                {/* TOC - Sticky on Desktop */}
                <div className="md:sticky md:top-24 md:self-start">
                  {/* Mobile Collapsible TOC */}
                  <div className="md:hidden">
                    <button onClick={() => setTocOpen(!tocOpen)} className="w-full flex items-center justify-between p-4 glass rounded-lg hover:bg-surface-glass/50 transition-colors">
                      <span className="font-semibold">
                        فهرست مطالب
                      </span>
                      <ChevronDown className={cn("w-5 h-5 transition-transform", tocOpen && "rotate-180")} />
                    </button>
                    {tocOpen && (
                      <nav className="mt-3 space-y-1 p-4 glass rounded-lg" dir="rtl">
                        {tocHeadings.length > 0 ? (
                          tocHeadings.map((heading) => (
                            <a 
                              key={heading.id}
                              href={`#${heading.id}`}
                              className={cn(
                                "block text-sm hover:text-primary transition-colors text-right",
                                heading.level === 1 ? "font-bold" :
                                heading.level === 2 ? "font-semibold" :
                                heading.level === 3 ? "pr-4 text-xs" :
                                "pr-6 text-xs"
                              )}
                            >
                              {heading.text}
                        </a>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground text-right">
                            هیچ سرفصلی یافت نشد
                          </p>
                        )}
                      </nav>
                    )}
                  </div>

                  {/* Desktop Sticky TOC */}
                  <nav className="hidden md:block space-y-1 text-right" dir="rtl">
                    <h3 className="font-bold text-lg mb-4 text-foreground">
                      فهرست مطالب
                    </h3>
                    {tocHeadings.length > 0 ? (
                      tocHeadings.map((heading) => (
                        <a 
                          key={heading.id}
                          href={`#${heading.id}`}
                          className={cn(
                            "block text-sm py-2 rounded-lg transition-colors hover:bg-surface-glass/50 text-right",
                            heading.level === 1 ? "pr-3 font-bold text-base" :
                            heading.level === 2 ? "pr-3 font-semibold" :
                            heading.level === 3 ? "pr-6 text-xs" :
                            "pr-9 text-xs",
                            activeSection === heading.id && "bg-surface-glass text-primary font-medium"
                          )}
                        >
                          {heading.text}
                    </a>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-right pr-3">
                        هیچ سرفصلی یافت نشد
                      </p>
                    )}
                  </nav>
                </div>

                {/* Description Content */}
                <div className={cn("max-w-none", (isRTL || forceRTL) && "text-right")} dir={(isRTL || forceRTL) ? "rtl" : "ltr"}>
                  {/* Render Markdown Content */}
                  <EnhancedMarkdownRenderer content={(isRTL || forceRTL) ? product.descriptionFa : product.description} />

                  {/* FAQ Section */}
                  {faqs.length > 0 && (
                    <section id="faq" className="scroll-mt-24 mt-12">
                      <h2 className="text-2xl font-bold mb-6 text-white">
                        سوالات متداول
                      </h2>
                    <FaqAccordion items={faqs} />
                  </section>
                  )}
                </div>
              </div>
            </SurfaceGlass>

            {/* Related Products */}
            {relatedProducts.length > 0 && <section className="space-y-6">
                <SectionHeader title="محصولات مرتبط" eyebrow="ممکن است دوست داشته باشید" />
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5 sm:gap-x-6 sm:gap-y-7 lg:gap-x-8 lg:gap-y-10">
                  {relatedProducts.map(prod => (
                    <ProductCard 
                      key={prod.id} 
                      id={prod.id} 
                      title={prod.title} 
                      image={prod.image} 
                      price={prod.price}
                      slug={prod.slug}
                      medusaVariants={prod.slug ? relatedProductPrices[prod.slug]?.variants : undefined}
                      onAdd={() => handleAddToCart()} 
                    />
                  ))}
                </div>
              </section>}

            {/* Related Blog Posts */}
            {relatedPosts.length > 0 && <section className="space-y-6">
                <SectionHeader title="مقالات مرتبط" eyebrow="اطلاعات بیشتر بدانید" />
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5 sm:gap-x-6 sm:gap-y-7 lg:gap-x-8 lg:gap-y-10">
                  {relatedPosts.map(post => <BlogCard key={post._id} post={post} />)}
                </div>
              </section>}
          </div>

          {/* Mobile Sticky Bottom Bar - Only Final Price & Buy Button */}
          {(() => {
            const hasVariants = (medusaVariants.length > 0 || (product?.variants?.length || 0) > 0);
            const shouldShowOnMobile = !hasVariants || selectedVariant;
            
            if (!shouldShowOnMobile) return null;
            
            // Calculate final price based on selected variant with discount applied
            // Get the selected variant's price (already computed in currentPrice)
            let variantPrice = currentPrice;
            
            // If there's a promotion, apply discount to the selected variant's price
            let finalPrice = variantPrice;
            if (productPromotion && productPromotion.promotion && variantPrice > 0) {
              // Recalculate discount for the selected variant's specific price
              finalPrice = calculateDiscountedPrice(variantPrice, productPromotion.promotion);
            }
            
            return (
              <div className="md:hidden fixed bottom-0 inset-x-0 z-50 glass border-t border-border-glass backdrop-blur-lg pb-safe">
                <div className="flex items-center gap-3 p-3 sm:p-4 min-w-0 max-w-full">
                  <div className="flex flex-col shrink-0 min-w-0">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      قیمت:
                    </span>
                    <div className="min-w-0 flex items-baseline gap-1">
                      <span className="text-base sm:text-lg font-bold text-primary">
                        {new Intl.NumberFormat("fa-IR").format(finalPrice)}
                      </span>
                      <span className="text-xs text-muted-foreground">تومان</span>
                    </div>
                  </div>
                  <Button size="sm" onClick={handleBuyNow} className="flex-1 min-w-0 h-10 text-sm">
                    <ShoppingCart className="ltr:mr-1 rtl:ml-1 h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">خرید</span>
                  </Button>
                </div>
              </div>
            );
          })()}
        </main>

        <Footer links={{
        products: "/products",
        magazine: "/magazine",
        courses: "/courses",
        pricing: "/pricing",
        support: "/support"
      }} socials={[{
        type: "Instagram",
        href: "https://instagram.com"
      }, {
        type: "Telegram",
        href: "https://t.me"
      }]} />

        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      </div>
    </>;
};
export default ProductDetail;
