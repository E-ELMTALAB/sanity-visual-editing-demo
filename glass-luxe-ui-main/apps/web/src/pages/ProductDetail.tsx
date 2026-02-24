import { useState, useEffect, useRef, type CSSProperties } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "@/components/Helmet";
import { motion } from "framer-motion";
import { ShoppingCart, Check, Truck, Shield, RefreshCw, ChevronRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer/Footer";
import { SectionHeader } from "@/components/ui/section-header";
import { ProductCard } from "@/components/Products/ProductCard";
import { BlogCard, type BlogPost as BlogCardPost } from "@/components/Blog/BlogCard";
import { Price } from "@/components/ui/price";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeliveryProcessSection } from "@/components/Products/DeliveryProcessSection";
import { ProductDescription } from "@/components/Products/ProductDescription";
import { CustomerReviews } from "@/components/Products/CustomerReviews";
import { CartDrawer } from "@/components/FloatingDock/CartDrawer";
import { SurfaceGlass } from "@/components/ui/surface-glass";
import { CountdownTimer } from "@/components/ui/countdown-timer";
import { BonusBar } from "@/components/ui/bonus-bar";
import { useDirection } from "@/contexts/DirectionContext";
import { useCart } from "@/contexts/cart-context";
import { useProductPromotion } from "@/contexts/promotion-context";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { getProductBySlug } from "@/lib/sanity-cache-direct";
import { transformProductDetail, transformFaqItem } from "@/lib/sanity.transformers";
import { fetchProductPrices, type MedusaVariant } from "@/lib/medusa-prices";
import { toPersianNumber, calculateDiscountedPrice } from "@/lib/medusa-promotions";
const springTransition = {
  type: "spring" as const,
  stiffness: 220,
  damping: 28
};

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
  seo?: SeoMeta;
}

interface FaqItem {
  q: string;
  a: string;
}


// Feature flag: Temporarily disable testimonials on Product Detail page
// TODO: Re-enable by setting ENABLE_PRODUCT_DETAIL_TESTIMONIAL to true
// Temporarily disabled until Sanity integration is ready
const ENABLE_PRODUCT_DETAIL_TESTIMONIAL = false;

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isRTL } = useDirection();
  const [product, setProduct] = useState<ProductDetailData | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
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

  // Get promotion info from context - use Medusa product ID if available
  const productIdForPromotion = medusaProductId || product?.id; // Prefer Medusa product ID

  // Calculate the price for promotion based on selected variant (not lowest price)
  // This needs to be calculated inline since getCurrentPrice() is defined later
  const getPriceForPromotion = () => {
    // Priority 1: Medusa variant price (if variant selected)
    if (medusaVariants.length > 0 && selectedVariant) {
      const variant = medusaVariants.find(v => v.variant_id === selectedVariant);
      if (variant?.price) {
        return variant.price;
      }
    }
    // Priority 2: Lowest Medusa variant price (if no variant selected but Medusa has data)
    if (medusaVariants.length > 0) {
      const lowestPrice = Math.min(...medusaVariants.filter(v => v.price > 0).map(v => v.price));
      if (lowestPrice && lowestPrice !== Infinity) {
        return lowestPrice;
      }
    }
    // Priority 3: Sanity variant price (fallback)
    if (product?.variants && selectedVariant) {
      const variant = product.variants.find(v => v.id === selectedVariant);
      if (variant?.price) {
        return variant.price;
      }
    }
    // Fallback to product price
    return product?.price || 0;
  };

  const priceForPromotion = getPriceForPromotion();
  const productPromotion = useProductPromotion(slug, productIdForPromotion, priceForPromotion);

  useEffect(() => {
    if (!slug) {
      setError("شناسه محصول معتبر نیست");
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    async function loadProduct() {
      try {
        setIsLoading(true);
        const result = await getProductBySlug(slug!);

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
        // TEMPORARILY DISABLED: Build the page URL for specific page matching
        // const pageUrl = `/products/${slug}`;

        // TEMPORARILY DISABLED: Fetch global FAQs that match either page type ("products") or specific page URL
        // const globalFaqs = await fetchFromSanity(faqsByPageQuery, {
        //   page: "products", // Page type
        //   pageUrl: pageUrl   // Specific page URL
        // });
        // const mappedGlobal = Array.isArray(globalFaqs) ? globalFaqs.map(transformFaqItem) : [];

        // Get product-specific FAQs only (temporarily disabled global FAQ fetching)
        let productFaqs: FaqItem[] = [];
        if (product?.faqs) {
          productFaqs = product.faqs
            .filter((faq: any) => faq.isActive !== false) // Include FAQs that are active (default true)
            .sort((a: any, b: any) => (a.order || 0) - (b.order || 0)) // Sort by order
            .map((faq: any) => ({
              q: faq.question,
              a: faq.answer,
            }));
        }

        // TEMPORARILY DISABLED: Combine product-specific FAQs first, then global FAQs
        // const combinedFaqs = [...productFaqs, ...mappedGlobal];
        const combinedFaqs = [...productFaqs]; // Only product FAQs for now
        if (!isMounted) return;

        setFaqItems(combinedFaqs.filter((item) => item.q && item.a));
      } catch (err) {
        console.error("[PRODUCT DETAIL] Failed to fetch FAQs", err);
        if (isMounted) {
          // Fallback to product-specific FAQs only
          if (product?.faqs) {
            const productFaqs = product.faqs
              .filter((faq: any) => faq.isActive !== false)
              .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
              .map((faq: any) => ({
                q: faq.question,
                a: faq.answer,
              }));
            setFaqItems(productFaqs.filter((item) => item.q && item.a));
          } else {
            setFaqItems([]);
          }
        }
      }
    }

    loadFaqs();
    return () => {
      isMounted = false;
    };
  }, [product, slug]); // Added slug dependency for pageUrl

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

  // Fire view_item event for GA4 ecommerce tracking
  useEffect(() => {
    if (!product || !product.price) return;

    // Convert toman price to rial (multiply by 10)
    const priceInRial = product.price * 10;

    // Push view_item event to dataLayer
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "view_item",
      ecommerce: {
        currency: "IRR",
        value: priceInRial,
        items: [{
          item_id: product.handle || slug || product.id,
          item_name: product.titleFa || product.title,
          item_category: product.categoryFa || product.category,
          item_variant: "default",
          price: priceInRial
        }]
      }
    });
  }, [product, slug]);

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
    // Skip if we don't have product data yet
    if (!product) return;

    // Only set default variant if no variant is currently selected (initial load only)
    // Once user selects a variant, don't override their choice
    if (selectedVariant !== null) return;

    // Always prioritize Medusa variants (they're the source of truth)
    const medusaDefault = getLowestPricedMedusaVariantId();
    if (medusaDefault) {
      console.log('[PRODUCT-DETAIL] Setting default variant from Medusa:', medusaDefault);
      setSelectedVariant(medusaDefault);
      return;
    }

    // Fallback to Sanity variants if Medusa variants aren't available yet
    const sanityDefault = getLowestPricedSanityVariantId();
    if (sanityDefault) {
      console.log('[PRODUCT-DETAIL] Setting default variant from Sanity (fallback):', sanityDefault);
      setSelectedVariant(sanityDefault);
    } else {
      console.log('[PRODUCT-DETAIL] No variants available yet - waiting for Medusa prices...');
    }
  }, [medusaVariants, product?.variants, product]);

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

    // Priority 1: Medusa variant original_price (if variant selected)
    if (medusaVariants.length > 0 && selectedVariant) {
      const variant = medusaVariants.find(v => v.variant_id === selectedVariant);
      if (variant?.original_price && variant.original_price > 0) {
        return variant.original_price;
      }
      // If no original_price but has price, use price as original
      if (variant?.price && variant.price > 0) {
        return variant.price;
      }
    }

    // Priority 2: Sanity variant price (if variant selected)
    if (product.variants && selectedVariant) {
      const sanityVariant = product.variants.find((variant) => variant.id === selectedVariant);
      if (typeof sanityVariant?.originalPrice === "number" && sanityVariant.originalPrice > 0) {
        return sanityVariant.originalPrice;
      }
      if (typeof sanityVariant?.price === "number" && sanityVariant.price > 0) {
        return sanityVariant.price;
      }
    }

    // Priority 3: Product originalPrice
    if (typeof product.originalPrice === "number" && product.originalPrice > 0) {
      return product.originalPrice;
    }

    // Priority 4: Product price (fallback)
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

      // Calculate final price with discount applied if promotion exists
      let finalPrice = selectedVariantData.price;
      if (productPromotion && productPromotion.promotion && selectedVariantData.price > 0) {
        finalPrice = calculateDiscountedPrice(selectedVariantData.price, productPromotion.promotion);
      }

      const cartItem = {
        id: parseInt(product.id) || Date.now(),
        title: product.title,
        price: finalPrice, // Use discounted price for cart/checkout
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
      const originalPrice = selectedProductVariant?.price || product.price || 0;

      console.log('[PRODUCT-DETAIL] Fallback price:', originalPrice);
      console.log('[PRODUCT-DETAIL] Sanity slug:', sanitySlug);

      if (originalPrice === 0) {
        console.error('[PRODUCT-DETAIL] ❌ Price is zero');
        toast({
          title: "خطا",
          description: 'قیمت این محصول در دسترس نیست.',
          variant: "destructive",
        });
        return false;
      }

      // Calculate final price with discount applied if promotion exists
      let finalPrice = originalPrice;
      if (productPromotion && productPromotion.promotion && originalPrice > 0) {
        finalPrice = calculateDiscountedPrice(originalPrice, productPromotion.promotion);
      }

      const cartItem = {
        id: parseInt(product.id) || Date.now(),
        title: product.title,
        price: finalPrice, // Use discounted price for cart/checkout
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
      // Fire begin_checkout event for GA4 ecommerce tracking
      if (product) {
        const priceInRial = getCurrentPrice() * 10; // Convert toman to rial

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "begin_checkout",
          ecommerce: {
            currency: "IRR",
            value: priceInRial,
            items: [{
              item_id: product.handle || slug || product.id,
              item_name: product.titleFa || product.title,
              item_category: product.categoryFa || product.category,
              item_variant: selectedVariant || "default",
              price: priceInRial,
              quantity: quantity
            }]
          }
        });
      }

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

  // Calculate prices based on selected variant - these will recalculate on every render when selectedVariant changes
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
  const origin = typeof window !== "undefined" ? window.location.origin : "https://sharifgpt.ai";
  const seo = product.seo || {};
  const seoTitle = seo.metaTitle || ((isRTL || forceRTL) ? product.titleFa : product.title) || "SharifGPT";
  const seoDescription = seo.metaDescription || ((isRTL || forceRTL) ? product.descriptionFa : product.description) || "";
  const canonicalUrl = seo.canonicalUrl || `${origin}/products/${slug}`;
  const ogTitle = seo.openGraphTitle || seo.metaTitle || seoTitle;
  const ogDescription = seo.openGraphDescription || seo.metaDescription || seoDescription;
  const ogImage = seo.openGraphImage || product.image || currentImage;
  return <>
    <Helmet>
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <link rel="canonical" href={canonicalUrl} />
      {seo.robotsMeta && <meta name="robots" content={seo.robotsMeta} />}
      <meta property="og:type" content="product" />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:url" content={canonicalUrl} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={ogDescription} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      <script type="application/ld+json">{JSON.stringify(productJsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      {seo.structuredData && (
        <script type="application/ld+json">{seo.structuredData}</script>
      )}
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
                  className="mb-2 text-[11px] sm:text-xs text-muted-foreground flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0 flex-row-reverse justify-start"
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

                {/* Title Section */}
                <div className="min-w-0 mb-6" style={{ textAlign: "right", marginRight: 0, paddingRight: 0 }}>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4 leading-tight break-words" style={{ textAlign: "right", marginRight: 0 }}>
                    {product.titleFa || product.title}
                  </h1>

                </div>

                {/* Pricing Box - Styled Container */}
                {(() => {
                  const hasVariants = (medusaVariants.length > 0 || (product?.variants?.length || 0) > 0);
                  const shouldShowOnMobile = !hasVariants || selectedVariant;

                  if (!shouldShowOnMobile) return null; // Hide on mobile if variants exist but none selected

                  const displayPrice = productPromotion ? productPromotion.discountedPrice : currentPrice;
                  const displayOldPrice = productPromotion ? productPromotion.originalPrice : (shouldShowOriginalPrice ? originalPrice : undefined);
                  const discountPercent = productPromotion?.discountPercentage;
                  const hasDiscount = displayOldPrice && displayOldPrice > displayPrice;

                  return (
                    <div className="mt-4 mb-6" style={{ textAlign: "right", marginRight: 0, paddingRight: 0 }}>
                      <SurfaceGlass className="rounded-xl p-4 sm:p-5 border border-white/20">
                        <div className="flex flex-col gap-3" dir="rtl">
                          {/* Discount Badge - Top Right */}
                          {discountPercent && discountPercent > 0 && (
                            <div className="flex justify-end">
                              <Badge className="bg-red-500 text-white px-3 py-1 text-xs sm:text-sm font-bold">
                                {toPersianNumber(discountPercent)}٪ تخفیف ویژه
                              </Badge>
                            </div>
                          )}

                          {/* Price Display */}
                          <div className="flex flex-col gap-1.5" dir="rtl">
                            {/* Current Price - Large and Dominant */}
                            <div className="flex items-baseline gap-2" style={{ direction: "rtl" }}>
                              <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary">
                                {new Intl.NumberFormat(isRTL ? "fa-IR" : "en-US").format(displayPrice)}
                              </span>
                              <span className="text-base sm:text-lg text-muted-foreground font-medium">
                                تومان
                              </span>
                            </div>

                            {/* Old Price - Smaller with Strike-through */}
                            {hasDiscount && displayOldPrice && (
                              <div className="flex items-baseline gap-1.5" style={{ direction: "rtl" }}>
                                <span className="text-lg sm:text-xl text-muted-foreground line-through opacity-70">
                                  {new Intl.NumberFormat(isRTL ? "fa-IR" : "en-US").format(displayOldPrice)}
                                </span>
                                <span className="text-sm text-muted-foreground opacity-70 line-through">
                                  تومان
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Countdown Timer for time-limited promotions */}
                          {productPromotion?.endsAt && (
                            <div className="mt-2 pt-3 border-t border-white/10">
                              <div className="text-xs text-muted-foreground mb-2">پایان تخفیف:</div>
                              <CountdownTimer
                                endsAt={productPromotion.endsAt}
                                size="sm"
                                variant="default"
                              />
                            </div>
                          )}
                        </div>
                      </SurfaceGlass>
                    </div>
                  );
                })()}

                {/* Features List - Modern Minimal Design */}
                {(product.featuresFa || product.features).length > 0 && (
                  <div className="mt-6 mb-6" dir="rtl" style={{ textAlign: "right" }}>
                    <div className="space-y-3.5">
                      {(product.featuresFa || product.features).map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 text-sm sm:text-base group"
                          style={{ direction: "rtl" }}
                        >
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center transition-all group-hover:bg-green-500/15 group-hover:border-green-500/30">
                            <Check className="w-3.5 h-3.5 text-green-400" strokeWidth={2.5} />
                          </div>
                          <span className="text-foreground/90 leading-relaxed flex-1 transition-colors group-hover:text-foreground">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Purchase Section */}
                <div className="min-w-0 mt-6" style={{ textAlign: "right", marginRight: 0, paddingRight: 0 }}>
                  {/* Bonus Bar - directly above Buy button */}
                  <div className="mb-4" style={{ textAlign: "right", marginRight: 0, paddingRight: 0, width: "100%" }}>
                    <BonusBar />
                  </div>

                  {/* Buy Button */}
                  {(() => {
                    const hasVariants = (medusaVariants.length > 0 || (product?.variants?.length || 0) > 0);
                    const shouldShowOnMobile = !hasVariants || selectedVariant;

                    return (
                      <div className={cn(
                        "flex gap-2 sm:gap-3 min-w-0 mb-4",
                        !shouldShowOnMobile && "hidden md:flex" // Hide on mobile if variants exist but none selected
                      )}>
                        <Button size="lg" onClick={handleBuyNow} className="flex-1 min-w-0 text-sm sm:text-base font-semibold">
                          <ShoppingCart className="ml-1 h-4 w-4 shrink-0" />
                          <span className="truncate">خرید</span>
                        </Button>
                      </div>
                    );
                  })()}

                  {/* Policy Microcopy */}
                  <p className="text-sm sm:text-[15px] text-muted-foreground text-center break-words mb-4 font-medium leading-relaxed">
                    تحویل فوری دیجیتال • پشتیبانی ۲۴ ساعته • ضمانت بازگشت وجه • دسترسی دائمی
                  </p>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-5 sm:pt-7 border-t border-border-glass min-w-0">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0">
                    {(medusaVariants.length > 0 ? medusaVariants : product.variants).map((variant, idx) => {
                      const variantId = medusaVariants.length > 0 ? variant.variant_id : variant.id;
                      const variantName = medusaVariants.length > 0 ? variant.name : (isRTL ? variant.nameFa : variant.name);
                      const variantPrice = medusaVariants.length > 0 ? variant.price : variant.price || 0;
                      const variantInStock = medusaVariants.length > 0 ? true : variant.inStock !== false;

                      // Calculate discounted price if promotion exists
                      let originalPrice = variantPrice;
                      let discountedPrice = variantPrice;
                      if (productPromotion && productPromotion.promotion && variantPrice > 0) {
                        discountedPrice = calculateDiscountedPrice(variantPrice, productPromotion.promotion);
                      }
                      const hasDiscount = discountedPrice < originalPrice;

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
                            <div className="flex flex-col items-start gap-0.5 min-w-0">
                              {/* Original price with strikethrough if discount exists */}
                              {hasDiscount && (
                                <span className="text-xs text-muted-foreground line-through">
                                  {new Intl.NumberFormat(isRTL ? "fa-IR" : "en-US").format(originalPrice)} تومان
                                </span>
                              )}
                              {/* Final price */}
                              <span className={cn(
                                "text-base sm:text-lg font-bold",
                                hasDiscount ? "text-green-400" : "text-primary"
                              )}>
                                {new Intl.NumberFormat(isRTL ? "fa-IR" : "en-US").format(discountedPrice)} تومان
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

          {/* Delivery Process Section */}
          <DeliveryProcessSection />

          {/* Customer Reviews / Testimonials Section */}
          {/* TEMPORARILY DISABLED: Testimonial section will be re-enabled after Sanity integration is complete */}
          {ENABLE_PRODUCT_DETAIL_TESTIMONIAL && (
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

          {/* Product Description */}
          <ProductDescription
            description={product.description}
            descriptionFa={product.descriptionFa}
            productTitle={product.title}
            productTitleFa={product.titleFa}
          />

          {/* Related Products */}
          <section className="space-y-6">
            <SectionHeader title="محصولات مرتبط" eyebrow="ممکن است دوست داشته باشید" />
            {relatedProducts.length > 0 ? (
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
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>در حال حاضر محصول مرتبطی وجود ندارد.</p>
              </div>
            )}
          </section>

          {/* Related Blog Posts */}
          <section className="space-y-6">
            <SectionHeader title="مقالات مرتبط" eyebrow="اطلاعات بیشتر بدانید" />
            {relatedPosts.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5 sm:gap-x-6 sm:gap-y-7 lg:gap-x-8 lg:gap-y-10">
                {relatedPosts.map(post => <BlogCard key={post._id} post={post} />)}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>در حال حاضر مقاله مرتبطی وجود ندارد.</p>
              </div>
            )}
          </section>
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
        magazine: "/blog",
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
