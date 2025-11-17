import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ShoppingCart, Check, Truck, Shield, RefreshCw, Star, ChevronRight, ChevronDown } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer/Footer";
import { Breadcrumb } from "@/components/ui/breadcrumb-component";
import { SectionHeader } from "@/components/ui/section-header";
import { ProductCard } from "@/components/Products/ProductCard";
import { BlogCard } from "@/components/Blog/BlogCard";
import { Price } from "@/components/ui/price";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaqAccordion } from "@/components/Products/FaqAccordion";
import { FloatingDock } from "@/components/FloatingDock/FloatingDock";
import { CartDrawer, CartItem } from "@/components/FloatingDock/CartDrawer";
import { ChatbotPanel } from "@/components/FloatingDock/ChatbotPanel";
import { SupportPanel } from "@/components/FloatingDock/SupportPanel";
import { SurfaceGlass } from "@/components/ui/surface-glass";
import { useDirection } from "@/contexts/DirectionContext";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
const springTransition = {
  type: "spring" as const,
  stiffness: 220,
  damping: 28
};
interface ProductVariant {
  id: string;
  name: string;
  nameFa: string;
  price: number;
  oldPrice?: number;
  inStock: boolean;
}
interface Product {
  id: string;
  handle: string;
  title: string;
  titleFa: string;
  description: string;
  descriptionFa: string;
  image: string;
  images: string[];
  price: number;
  oldPrice?: number;
  category: string;
  categoryFa: string;
  inStock: boolean;
  badge?: "sale" | "new" | "hot";
  variants?: ProductVariant[];
  specs: {
    label: string;
    labelFa: string;
    value: string;
    valueFa: string;
  }[];
  features: string[];
  featuresFa: string[];
}
const ProductDetail = () => {
  const {
    slug
  } = useParams<{
    slug: string;
  }>();
  const navigate = useNavigate();
  const {
    isRTL
  } = useDirection();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [tocOpen, setTocOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const stickyRef = useRef<HTMLDivElement>(null);

  // Mock product data - in real app, fetch from Medusa Store API
  useEffect(() => {
    const mockProducts: Product[] = [{
      id: "1",
      handle: "premium-headphones",
      title: "Premium Wireless Headphones with ANC",
      titleFa: "هدفون بی‌سیم پریمیوم با نویزکنسلینگ",
      description: "Experience crystal-clear audio with advanced active noise cancellation. Premium materials and 40-hour battery life.",
      descriptionFa: "صدای کریستالی با نویزکنسلینگ پیشرفته. مواد پریمیوم و ۴۰ ساعت عمر باتری.",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
      images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800&h=800&fit=crop"],
      price: 2240000,
      oldPrice: 3200000,
      category: "Audio",
      categoryFa: "صوتی",
      inStock: true,
      badge: "sale",
      specs: [{
        label: "Battery Life",
        labelFa: "عمر باتری",
        value: "40 hours",
        valueFa: "۴۰ ساعت"
      }, {
        label: "Connectivity",
        labelFa: "اتصال",
        value: "Bluetooth 5.0",
        valueFa: "بلوتوث ۵.۰"
      }, {
        label: "Weight",
        labelFa: "وزن",
        value: "250g",
        valueFa: "۲۵۰ گرم"
      }, {
        label: "Warranty",
        labelFa: "گارانتی",
        value: "2 years",
        valueFa: "۲ سال"
      }],
      features: ["Active Noise Cancellation", "40-Hour Battery Life", "Premium Sound Quality", "Comfortable Design", "Foldable & Portable"],
      featuresFa: ["نویزکنسلینگ فعال", "۴۰ ساعت عمر باتری", "کیفیت صدای پریمیوم", "طراحی راحت", "تاشو و قابل حمل"]
    }, {
      id: "p1",
      handle: "chatgpt-advanced",
      title: "پکیج آموزش هوش مصنوعی ChatGPT پیشرفته",
      titleFa: "پکیج آموزش هوش مصنوعی ChatGPT پیشرفته",
      description: "تسلط بر تکنیک‌های پیشرفته هوش مصنوعی با ChatGPT. دوره ویدیویی کامل با پروژه‌های عملی.",
      descriptionFa: "تسلط بر تکنیک‌های پیشرفته هوش مصنوعی با ChatGPT. دوره ویدیویی کامل با پروژه‌های عملی.",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop",
      images: ["https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop"],
      price: 899000,
      oldPrice: 1200000,
      category: "دوره‌های آموزشی",
      categoryFa: "دوره‌های آموزشی",
      inStock: true,
      badge: "sale",
      variants: [{
        id: "1month",
        name: "دسترسی ۱ ماهه",
        nameFa: "دسترسی ۱ ماهه",
        price: 899000,
        oldPrice: 1200000,
        inStock: true
      }, {
        id: "3months",
        name: "دسترسی ۳ ماهه",
        nameFa: "دسترسی ۳ ماهه",
        price: 1899000,
        oldPrice: 2500000,
        inStock: true
      }, {
        id: "6months",
        name: "دسترسی ۶ ماهه",
        nameFa: "دسترسی ۶ ماهه",
        price: 2999000,
        oldPrice: 4200000,
        inStock: true
      }, {
        id: "lifetime",
        name: "دسترسی مادام‌العمر",
        nameFa: "دسترسی مادام‌العمر",
        price: 4599000,
        oldPrice: 6500000,
        inStock: true
      }],
      specs: [{
        label: "مدت زمان",
        labelFa: "مدت زمان",
        value: "۱۲ ساعت",
        valueFa: "۱۲ ساعت"
      }, {
        label: "سطح",
        labelFa: "سطح",
        value: "پیشرفته",
        valueFa: "پیشرفته"
      }, {
        label: "گواهینامه",
        labelFa: "گواهینامه",
        value: "دارد",
        valueFa: "دارد"
      }, {
        label: "پشتیبانی",
        labelFa: "پشتیبانی",
        value: "مادام‌العمر",
        valueFa: "مادام‌العمر"
      }],
      features: ["بیش از ۱۲ ساعت محتوای ویدیویی", "پروژه‌های واقعی", "گواهینامه پایان دوره", "دسترسی مادام‌العمر", "زیرنویس فارسی"],
      featuresFa: ["بیش از ۱۲ ساعت محتوای ویدیویی", "پروژه‌های واقعی", "گواهینامه پایان دوره", "دسترسی مادام‌العمر", "زیرنویس فارسی"]
    }, {
      id: "p2",
      handle: "python-ml",
      title: "Python & Machine Learning Complete Course",
      titleFa: "دوره جامع برنامه‌نویسی Python و یادگیری ماشین",
      description: "Learn Python programming and machine learning from scratch to advanced level.",
      descriptionFa: "آموزش برنامه‌نویسی پایتون و یادگیری ماشین از صفر تا پیشرفته.",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop",
      images: ["https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop"],
      price: 1499000,
      oldPrice: 2000000,
      category: "Courses",
      categoryFa: "دوره‌های آموزشی",
      inStock: true,
      badge: "sale",
      specs: [{
        label: "Duration",
        labelFa: "مدت زمان",
        value: "20 hours",
        valueFa: "۲۰ ساعت"
      }, {
        label: "Level",
        labelFa: "سطح",
        value: "Beginner to Advanced",
        valueFa: "مقدماتی تا پیشرفته"
      }, {
        label: "Certificate",
        labelFa: "گواهینامه",
        value: "Yes",
        valueFa: "دارد"
      }, {
        label: "Projects",
        labelFa: "پروژه‌ها",
        value: "10+",
        valueFa: "+۱۰"
      }],
      features: ["20+ Hours Video Content", "10+ Real Projects", "Python Fundamentals", "Machine Learning Algorithms", "Data Analysis with Pandas"],
      featuresFa: ["بیش از ۲۰ ساعت محتوای ویدیویی", "بیش از ۱۰ پروژه واقعی", "اصول پایتون", "الگوریتم‌های یادگیری ماشین", "تحلیل داده با Pandas"]
    }];
    const foundProduct = mockProducts.find(p => p.handle === slug);
    if (foundProduct) {
      setProduct(foundProduct);
      // Set first variant as default if variants exist
      if (foundProduct.variants && foundProduct.variants.length > 0) {
        setSelectedVariant(foundProduct.variants[0].id);
      }
    } else {
      navigate("/404");
    }
  }, [slug, navigate]);
  // Get current price based on selected variant
  const getCurrentPrice = () => {
    if (product?.variants && selectedVariant) {
      const variant = product.variants.find(v => v.id === selectedVariant);
      return variant ? variant.price : product.price;
    }
    return product?.price || 0;
  };
  const getCurrentOldPrice = () => {
    if (product?.variants && selectedVariant) {
      const variant = product.variants.find(v => v.id === selectedVariant);
      return variant?.oldPrice;
    }
    return product?.oldPrice;
  };
  const handleAddToCart = () => {
    if (!product) return;
    // Navigate directly to checkout
    navigate('/checkout');
  };
  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">{isRTL ? "در حال بارگذاری..." : "Loading..."}</div>
    </div>;
  }
  const forceRTL = product.handle === "chatgpt-advanced";
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
      price: product.price,
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{
      "@type": "ListItem",
      position: 1,
      name: (isRTL || forceRTL) ? "خانه" : "Home",
      item: window.location.origin
    }, {
      "@type": "ListItem",
      position: 2,
      name: (isRTL || forceRTL) ? "محصولات" : "Products",
      item: `${window.location.origin}/products`
    }, {
      "@type": "ListItem",
      position: 3,
      name: (isRTL || forceRTL) ? product.titleFa : product.title,
      item: window.location.href
    }]
  };

  // Mock related products - show courses for chatgpt-advanced
  const relatedProducts = product.handle === "chatgpt-advanced" ? [{
    id: "rel-1",
    title: "دوره جامع Python و یادگیری ماشین",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=600&fit=crop",
    price: 1499000,
    oldPrice: 2000000,
    discountPct: 25
  }, {
    id: "rel-2",
    title: "دوره پیشرفته Claude AI",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=600&fit=crop",
    price: 799000,
    oldPrice: 1100000,
    discountPct: 27
  }, {
    id: "rel-3",
    title: "دوره جامع Midjourney و تولید تصویر",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=600&fit=crop",
    price: 899000,
    oldPrice: 1300000,
    discountPct: 31
  }] : [{
    id: "rel-1",
    title: isRTL ? "ساعت هوشمند نسل ۵" : "Smart Watch Gen 5",
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&h=600&fit=crop",
    price: 2700000,
    oldPrice: 4500000,
    discountPct: 40
  }, {
    id: "rel-2",
    title: isRTL ? "عینک آفتابی UV400" : "UV400 Sunglasses",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop",
    price: 665000,
    oldPrice: 950000,
    discountPct: 30
  }, {
    id: "rel-3",
    title: isRTL ? "کیف چرم دست‌دوز" : "Handcrafted Leather Bag",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop",
    price: 1680000,
    oldPrice: 2800000,
    discountPct: 40
  }];

  // Mock related blog posts - show AI articles for chatgpt-advanced
  const relatedPosts = product.handle === "chatgpt-advanced" ? [{
    _id: "post-1",
    title: "راهنمای جامع استفاده از ChatGPT در کسب‌وکار",
    excerpt: "نحوه استفاده حرفه‌ای از ChatGPT برای افزایش بهره‌وری",
    slug: "chatgpt-business-guide",
    image: {
      asset: {
        url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop"
      }
    },
    category: "tutorials",
    readTime: 8,
    publishedAt: new Date().toISOString()
  }, {
    _id: "post-2",
    title: "مقایسه ChatGPT با سایر مدل‌های زبانی",
    excerpt: "بررسی تفاوت‌های ChatGPT با Claude و Gemini",
    slug: "ai-models-comparison",
    image: {
      asset: {
        url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&h=400&fit=crop"
      }
    },
    category: "reviews",
    readTime: 6,
    publishedAt: new Date().toISOString()
  }] : [{
    _id: "post-1",
    title: isRTL ? "راهنمای خرید هدفون" : "Headphone Buying Guide",
    excerpt: isRTL ? "همه چیز درباره انتخاب بهترین هدفون" : "Everything about choosing the best headphones",
    slug: "headphone-guide",
    image: {
      asset: {
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop"
      }
    },
    category: "tutorials",
    readTime: 5,
    publishedAt: new Date().toISOString()
  }];
  // FAQs based on product
  const faqs = product.handle === "chatgpt-advanced" ? [{
    q: "آیا این دوره برای مبتدی‌ها مناسب است؟",
    a: "بله، این دوره با فرض عدم دانش قبلی طراحی شده و از مبانی شروع می‌شود."
  }, {
    q: "آیا پس از خرید به‌روزرسانی‌های رایگان دریافت می‌کنم؟",
    a: "بله، تمام به‌روزرسانی‌های آینده دوره به صورت رایگان در دسترس شما خواهد بود."
  }, {
    q: "آیا گواهینامه این دوره معتبر است؟",
    a: "بله، گواهینامه این دوره توسط موسسات معتبر شناخته شده و قابل ارائه در رزومه است."
  }, {
    q: "چگونه می‌توانم با پشتیبانی ارتباط برقرار کنم؟",
    a: "می‌توانید از طریق چت آنلاین، ایمیل یا تلگرام با تیم پشتیبانی در ارتباط باشید."
  }] : [{
    q: isRTL ? "آیا این محصول گارانتی دارد؟" : "Does this product have a warranty?",
    a: isRTL ? "بله، این محصول دارای ۲ سال گارانتی رسمی است." : "Yes, this product comes with a 2-year official warranty."
  }, {
    q: isRTL ? "زمان ارسال چقدر است؟" : "What is the shipping time?",
    a: isRTL ? "ارسال سریع ۱-۳ روز کاری در سراسر کشور." : "Fast shipping 1-3 business days nationwide."
  }];
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

        <main className="pt-[72px] pb-24 md:pb-10" dir={(isRTL || forceRTL) ? "rtl" : "ltr"}>
          <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 space-y-6 py-6 min-w-0 my-[25px]">
            {/* Product Main Section */}
            <SurfaceGlass className="rounded-2xl p-4 sm:p-6 md:p-8 min-w-0 overflow-hidden">
              <div className="grid md:grid-cols-2 gap-6 md:gap-8 min-w-0">
                {/* Images */}
                <div className="space-y-4 min-w-0">
                  <motion.div key={selectedImage} initial={{
                  opacity: 0
                }} animate={{
                  opacity: 1
                }} className="relative aspect-square rounded-2xl overflow-hidden glass w-full">
                    <img src={product.images[selectedImage]} alt={isRTL ? product.titleFa : product.title} className="w-full h-full object-cover" />
                    {product.badge && <div className="absolute top-4 ltr:left-4 rtl:right-4">
                        <Badge variant={product.badge}>
                          {product.badge === "sale" && (isRTL ? "تخفیف" : "Sale")}
                          {product.badge === "new" && (isRTL ? "جدید" : "New")}
                          {product.badge === "hot" && (isRTL ? "داغ" : "Hot")}
                        </Badge>
                      </div>}
                  </motion.div>
                  
                  {/* Variants Selection */}
                  {product.variants && product.variants.length > 0 && <div className="space-y-3 mt-4">
                      <label className="text-sm font-medium text-foreground">
                        {isRTL ? "انتخاب مدت زمان:" : "Select Duration:"}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0">
                        {product.variants.map(variant => <button key={variant.id} onClick={() => setSelectedVariant(variant.id)} disabled={!variant.inStock} className={cn("relative p-4 rounded-xl border-2 transition-all duration-200 min-w-0 overflow-hidden", "hover:scale-[1.02] active:scale-[0.98]", selectedVariant === variant.id ? "border-primary bg-primary/10 shadow-lg shadow-primary/20" : "border-border/50 bg-surface-glass/30 hover:border-border", !variant.inStock && "opacity-50 cursor-not-allowed hover:scale-100")}>
                            <div className="flex flex-col items-start gap-2 min-w-0">
                              <span className="font-semibold text-foreground text-sm line-clamp-2">
                                {isRTL ? variant.nameFa : variant.name}
                              </span>
                              <div className="flex items-baseline gap-2 flex-wrap min-w-0">
                                <span className="text-base sm:text-lg font-bold text-primary">
                                  {new Intl.NumberFormat(isRTL ? "fa-IR" : "en-US").format(variant.price)}
                                </span>
                                {variant.oldPrice && <>
                                    <span className="text-xs sm:text-sm text-muted-foreground line-through">
                                      {new Intl.NumberFormat(isRTL ? "fa-IR" : "en-US").format(variant.oldPrice)}
                                    </span>
                                    <Badge variant="destructive" className="text-xs">
                                      -{Math.round((variant.oldPrice - variant.price) / variant.oldPrice * 100)}%
                                    </Badge>
                                  </>}
                              </div>
                            </div>
                            {selectedVariant === variant.id && <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-primary-foreground" />
                              </div>}
                            {!variant.inStock && <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-xl">
                                <span className="text-sm font-medium text-muted-foreground">
                                  {isRTL ? "ناموجود" : "Out of Stock"}
                                </span>
                              </div>}
                          </button>)}
                      </div>
                    </div>}
                </div>

                {/* Product Info - Sticky on Desktop */}
                <div ref={stickyRef} className="md:sticky md:top-24 md:self-start space-y-4 md:space-y-6 min-w-0">
                  {/* Breadcrumb */}
                  <nav className="mb-3 text-xs sm:text-sm text-muted-foreground flex items-center gap-2 flex-wrap min-w-0">
                    <Link to="/" className="hover:text-foreground transition-colors whitespace-nowrap">
                      {(isRTL || forceRTL) ? "خانه" : "Home"}
                    </Link>
                    <ChevronRight className={cn("w-3 h-3 sm:w-4 sm:h-4 shrink-0", (isRTL || forceRTL) && "rotate-180")} />
                    <Link to="/products" className="hover:text-foreground transition-colors whitespace-nowrap">
                      {(isRTL || forceRTL) ? "محصولات" : "Products"}
                    </Link>
                    <ChevronRight className={cn("w-3 h-3 sm:w-4 sm:h-4 shrink-0", (isRTL || forceRTL) && "rotate-180")} />
                    <span className="text-foreground line-clamp-1 min-w-0">{(isRTL || forceRTL) ? product.titleFa : product.title}</span>
                  </nav>

                  <div className="min-w-0">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 break-words">
                      {(isRTL || forceRTL) ? product.titleFa : product.title}
                    </h1>
                    
                    {/* Rating Summary */}
                    <a href="#reviews" className="inline-flex items-center gap-2 text-sm hover:text-primary transition-colors mb-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />)}
                      </div>
                      <span className="font-semibold">4.9</span>
                      <span className="text-muted-foreground">
                        {(isRTL || forceRTL) ? "(۱۲۰ نظر)" : "(120 reviews)"}
                      </span>
                    </a>

                    
                  </div>

                  <div className="space-y-2 min-w-0">
                    <div className="overflow-x-auto">
                      <Price current={getCurrentPrice()} old={getCurrentOldPrice()} className="text-xl sm:text-2xl whitespace-nowrap" />
                    </div>
                    {getCurrentOldPrice() && <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 font-medium break-words">
                        {(isRTL || forceRTL) ? "صرفه‌جویی شما: " : "You save: "}
                        {new Intl.NumberFormat((isRTL || forceRTL) ? "fa-IR" : "en-US").format(getCurrentOldPrice()! - getCurrentPrice())}
                        {" "}
                        {(isRTL || forceRTL) ? "تومان" : "Toman"}
                        {" "}
                        ({Math.round((getCurrentOldPrice()! - getCurrentPrice()) / getCurrentOldPrice()! * 100)}%)
                      </p>}
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    {((isRTL || forceRTL) ? product.featuresFa : product.features).map((feature, idx) => <div key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-foreground/80">{feature}</span>
                      </div>)}
                  </div>

                  {/* Quantity & Actions */}
                  <div className="space-y-4 min-w-0">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 md:mt-[100px]">
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

                    <div className="flex gap-2 sm:gap-3 min-w-0">
                      <Button size="lg" onClick={handleAddToCart} className="flex-1 min-w-0 text-sm sm:text-base">
                        <ShoppingCart className="ltr:mr-1 rtl:ml-1 h-4 w-4 shrink-0" />
                        <span className="truncate">{isRTL ? "خرید محصول" : "Buy Now"}</span>
                      </Button>
                    </div>

                  {/* Policy Microcopy */}
                  <p className="text-xs text-muted-foreground text-center break-words">
                    {(isRTL || forceRTL) ? "پشتیبانی ۲۴/۷ • تعویض حساب تضمینی • تحویل فوری" : "24/7 Support • Guaranteed Exchange • Fast Delivery"}
                  </p>
                  </div>

                  {/* Trust Badges */}
                  <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-border-glass min-w-0">
                    <div className="flex flex-col items-center text-center gap-1 sm:gap-2 min-w-0">
                      <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-primary shrink-0" />
                      <span className="text-xs text-muted-foreground break-words">
                        {(isRTL || forceRTL) ? "ارسال سریع" : "Fast Shipping"}
                      </span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-1 sm:gap-2 min-w-0">
                      <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary shrink-0" />
                      <span className="text-xs text-muted-foreground break-words">
                        {(isRTL || forceRTL) ? "گارانتی اصالت" : "Authentic Guarantee"}
                      </span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-1 sm:gap-2 min-w-0">
                      <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 text-primary shrink-0" />
                      <span className="text-xs text-muted-foreground break-words">
                        {(isRTL || forceRTL) ? "بازگشت آسان" : "Easy Returns"}
                      </span>
                    </div>
                  </div>
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
                        {(isRTL || forceRTL) ? "فهرست مطالب" : "Table of Contents"}
                      </span>
                      <ChevronDown className={cn("w-5 h-5 transition-transform", tocOpen && "rotate-180")} />
                    </button>
                    {tocOpen && <nav className="mt-3 space-y-2 p-4 glass rounded-lg">
                        <a href="#overview" className="block text-sm hover:text-primary transition-colors">
                          {(isRTL || forceRTL) ? "نگاهی کلی" : "Overview"}
                        </a>
                        <a href="#features" className="block text-sm hover:text-primary transition-colors">
                          {(isRTL || forceRTL) ? "ویژگی‌های کلیدی" : "Key Features"}
                        </a>
                        <a href="#usage" className="block text-sm hover:text-primary transition-colors">
                          {(isRTL || forceRTL) ? "نحوه استفاده" : "How to Use"}
                        </a>
                        <a href="#faq" className="block text-sm hover:text-primary transition-colors">
                          {(isRTL || forceRTL) ? "سوالات متداول" : "FAQ"}
                        </a>
                      </nav>}
                  </div>

                  {/* Desktop Sticky TOC */}
                  <nav className={cn("hidden md:block space-y-3", (isRTL || forceRTL) && "text-right")}>
                    <h3 className="font-bold text-lg mb-4">
                      {(isRTL || forceRTL) ? "فهرست مطالب" : "Table of Contents"}
                    </h3>
                    <a href="#overview" className={cn("block text-sm py-2 px-3 rounded-lg transition-colors hover:bg-surface-glass/50", activeSection === "overview" && "bg-surface-glass text-primary font-medium")}> 
                      {(isRTL || forceRTL) ? "نگاهی کلی" : "Overview"}
                    </a>
                    <a href="#features" className={cn("block text-sm py-2 px-3 rounded-lg transition-colors hover:bg-surface-glass/50", activeSection === "features" && "bg-surface-glass text-primary font-medium")}>
                      {(isRTL || forceRTL) ? "ویژگی‌های کلیدی" : "Key Features"}
                    </a>
                    <a href="#usage" className={cn("block text-sm py-2 px-3 rounded-lg transition-colors hover:bg-surface-glass/50", activeSection === "usage" && "bg-surface-glass text-primary font-medium")}>
                      {(isRTL || forceRTL) ? "نحوه استفاده" : "How to Use"}
                    </a>
                    <a href="#faq" className={cn("block text-sm py-2 px-3 rounded-lg transition-colors hover:bg-surface-glass/50", activeSection === "faq" && "bg-surface-glass text-primary font-medium")}>
                      {(isRTL || forceRTL) ? "سوالات متداول" : "FAQ"}
                    </a>
                  </nav>
                </div>

                {/* Description Content */}
                <div className={cn("prose prose-invert max-w-none", (isRTL || forceRTL) && "text-right")} dir={(isRTL || forceRTL) ? "rtl" : "ltr"}>
                  <section id="overview" className="scroll-mt-24 mb-12">
                    <h2 className="text-2xl font-bold mb-4">
                      {(isRTL || forceRTL) ? "نگاهی کلی" : "Overview"}
                    </h2>
                    <p className="text-foreground/80 leading-relaxed mb-4">
                      {(isRTL || forceRTL) ? product.descriptionFa : product.description}
                    </p>
                    <p className="text-foreground/80 leading-relaxed">
                      {(isRTL || forceRTL) ? "این محصول با استفاده از جدیدترین تکنولوژی‌های روز طراحی شده و برای ارائه بهترین تجربه کاربری بهینه‌سازی شده است. با خرید این محصول، شما از پشتیبانی کامل و به‌روزرسانی‌های منظم بهره‌مند خواهید شد." : "This product is designed using the latest technologies and optimized to provide the best user experience. With your purchase, you'll benefit from full support and regular updates."}
                    </p>
                  </section>

                  <section id="features" className="scroll-mt-24 mb-12">
                    <h2 className="text-2xl font-bold mb-4">
                      {(isRTL || forceRTL) ? "ویژگی‌های کلیدی" : "Key Features"}
                    </h2>
                    <ul className="space-y-3">
                      {((isRTL || forceRTL) ? product.featuresFa : product.features).map((feature, idx) => <li key={idx} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-foreground/80">{feature}</span>
                        </li>)}
                    </ul>
                  </section>

                  <section id="usage" className="scroll-mt-24 mb-12">
                    <h2 className="text-2xl font-bold mb-4">
                      {(isRTL || forceRTL) ? "نحوه استفاده" : "How to Use"}
                    </h2>
                    <div className="space-y-4 text-foreground/80">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          {(isRTL || forceRTL) ? "۱. شروع کار" : "1. Getting Started"}
                        </h3>
                        <p className="leading-relaxed">
                          {(isRTL || forceRTL) ? "پس از دریافت محصول، مراحل راه‌اندازی اولیه را طبق دستورالعمل موجود انجام دهید." : "After receiving the product, follow the initial setup instructions provided."}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          {(isRTL || forceRTL) ? "۲. پیکربندی" : "2. Configuration"}
                        </h3>
                        <p className="leading-relaxed">
                          {(isRTL || forceRTL) ? "تنظیمات محصول را بر اساس نیاز خود شخصی‌سازی کنید." : "Customize the product settings based on your needs."}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          {(isRTL || forceRTL) ? "۳. استفاده روزانه" : "3. Daily Use"}
                        </h3>
                        <p className="leading-relaxed">
                          {(isRTL || forceRTL) ? "از تمامی قابلیت‌های محصول در فعالیت‌های روزمره خود بهره‌مند شوید." : "Take advantage of all product features in your daily activities."}
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* FAQ Section */}
                  <section id="faq" className="scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-6">
                      {(isRTL || forceRTL) ? "سوالات متداول" : "Frequently Asked Questions"}
                    </h2>
                    <FaqAccordion items={faqs} />
                  </section>
                </div>
              </div>
            </SurfaceGlass>

            {/* Related Products */}
            {relatedProducts.length > 0 && <section className="space-y-6">
                <SectionHeader title={product.handle === "chatgpt-advanced" ? "دوره‌های پیشنهادی" : (isRTL ? "محصولات مرتبط" : "Related Products")} eyebrow={product.handle === "chatgpt-advanced" ? "آموزش بیشتر" : (isRTL ? "پیشنهادها" : "Suggestions")} />
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5 sm:gap-x-6 sm:gap-y-7 lg:gap-x-8 lg:gap-y-10">
                  {relatedProducts.map(prod => <ProductCard key={prod.id} id={prod.id} title={prod.title} image={prod.image} price={prod.price} oldPrice={prod.oldPrice} discountPct={prod.discountPct} onAdd={() => handleAddToCart()} />)}
                </div>
              </section>}

            {/* Related Blog Posts */}
            {relatedPosts.length > 0 && <section className="space-y-6">
                <SectionHeader title={product.handle === "chatgpt-advanced" ? "مقالات آموزشی" : (isRTL ? "مقالات مرتبط" : "Related Articles")} eyebrow={product.handle === "chatgpt-advanced" ? "یادگیری بیشتر" : (isRTL ? "مطالعه بیشتر" : "Read More")} />
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5 sm:gap-x-6 sm:gap-y-7 lg:gap-x-8 lg:gap-y-10">
                  {relatedPosts.map(post => <BlogCard key={post._id} post={post} />)}
                </div>
              </section>}
          </div>

          {/* Mobile Sticky Bottom Bar */}
          <div className="md:hidden fixed bottom-0 inset-x-0 z-50 glass border-t border-border-glass backdrop-blur-lg pb-safe">
            <div className="flex items-center gap-3 p-3 sm:p-4 min-w-0 max-w-full">
              <div className="flex flex-col shrink-0 min-w-0">
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {(isRTL || forceRTL) ? "قیمت:" : "Price:"}
                </span>
                <div className="min-w-0">
                  <Price current={getCurrentPrice()} old={getCurrentOldPrice()} className="text-base sm:text-lg" />
                </div>
              </div>
              <Button size="default" onClick={handleAddToCart} className="flex-1 min-w-0 h-11 text-sm sm:text-base">
                <ShoppingCart className="ltr:mr-1 rtl:ml-1 h-4 w-4 shrink-0" />
                <span className="truncate">{(isRTL || forceRTL) ? "خرید محصول" : "Buy Now"}</span>
              </Button>
            </div>
          </div>
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

        <FloatingDock onOpenChat={() => setChatOpen(true)} onOpenSupport={() => setSupportOpen(true)} onOpenCart={() => setCartOpen(true)} cartItemCount={cartItems.reduce((sum, item) => sum + item.qty, 0)} />

        <ChatbotPanel open={chatOpen} onClose={() => setChatOpen(false)} />
        <SupportPanel open={supportOpen} onClose={() => setSupportOpen(false)} />
        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cartItems} onUpdateQty={(id, qty) => setCartItems(prev => prev.map(item => item.id === id ? {
        ...item,
        qty
      } : item))} onRemoveItem={id => setCartItems(prev => prev.filter(item => item.id !== id))} onCheckout={() => toast({
        title: isRTL ? "پرداخت" : "Checkout",
        description: isRTL ? "در حال انتقال به صفحه پرداخت..." : "Redirecting to checkout..."
      })} />
      </div>
    </>;
};
export default ProductDetail;