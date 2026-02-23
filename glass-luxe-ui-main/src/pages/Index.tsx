import { useState, lazy, Suspense, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Award, Shield, CheckCircle } from "lucide-react";
import TrustBadges from "@/components/TrustBadges";
import TestimonialsRow from "@/components/TestimonialsRow";
import { SurfaceGlass } from "@/components/ui/surface-glass";
import { Header } from "@/components/Header";
import { useDirection } from "@/contexts/DirectionContext";
import { useCart } from "@/contexts/cart-context";
import { useSiteWidePromotion } from "@/contexts/promotion-context";
import { toast } from "@/hooks/use-toast";
import type { ProductPrices } from "@/lib/medusa-prices";
import { PromotionBanner } from "@/components/Hero/PromotionBanner";
// Import Sanity modules statically (lazy-loading caused initialization issues)
import { fetchFromSanity } from "@/lib/sanity.client.light";
import { validateSanityConfig } from "@/lib/sanity.config";
import { 
  heroSlideQuery,
  homePageQuery, 
  featuredProductsQuery, 
  featuredCoursesQuery, 
  featuredPostsQuery, 
  productsByCategoryQuery, 
  faqsByPageQuery 
} from "@/lib/sanity.queries";
import * as transformers from "@/lib/sanity.transformers";
import { getImageUrl } from "@/lib/sanity.image";

// Lazy load heavy components - don't load until needed
const Footer = lazy(() => import("@/components/Footer/Footer").then((m) => ({ default: m.Footer })));
const FloatingDock = lazy(() => import("@/components/FloatingDock/FloatingDock").then((m) => ({ default: m.FloatingDock })));
const CartDrawer = lazy(() => import("@/components/FloatingDock/CartDrawer").then((m) => ({ default: m.CartDrawer })));
const ChatbotPanel = lazy(() => import("@/components/FloatingDock/ChatbotPanel").then((m) => ({ default: m.ChatbotPanel })));
const SupportPanel = lazy(() => import("@/components/FloatingDock/SupportPanel").then((m) => ({ default: m.SupportPanel })));

// Lazy load content sections - these will load after initial paint
const BestSellers = lazy(() => import("@/components/Products/BestSellers").then((m) => ({ default: m.BestSellers })));
const EditorialBanners = lazy(() => import("@/components/Products/EditorialBanners").then((m) => ({ default: m.EditorialBanners })));
const SpecialOffers = lazy(() => import("@/components/Products/SpecialOffers").then((m) => ({ default: m.SpecialOffers })));
const TabbedProductGrid = lazy(() => import("@/components/Products/TabbedProductGrid").then((m) => ({ default: m.TabbedProductGrid })));
const SocialMediaProductsGrid = lazy(() => import("@/components/Products/SocialMediaProductsGrid").then((m) => ({ default: m.SocialMediaProductsGrid })));
const CollectionsBanner = lazy(() => import("@/components/Products/CollectionsBanner").then((m) => ({ default: m.CollectionsBanner })));
const EduProductsSlider = lazy(() => import("@/components/Products/EduProductsSlider").then((m) => ({ default: m.EduProductsSlider })));
const BlogsCarousel = lazy(() => import("@/components/Blog/BlogsCarousel").then((m) => ({ default: m.BlogsCarousel })));
const FaqAccordion = lazy(() => import("@/components/Products/FaqAccordion").then((m) => ({ default: m.FaqAccordion })));
const EnhancedMarkdownRenderer = lazy(() => import("@/components/EnhancedMarkdownRenderer"));

const fallbackSeoContent = `
# خرید اکانت ChatGPT با ضمانت تعویض

در دنیای امروز که سرعت تحولات فناوری سرسام‌آور است، هوش مصنوعی از یک مفهوم تخیلی به ابزاری حیاتی برای پیشرفت و افزایش بهره‌وری تبدیل شده است. در قلب این انقلاب، ChatGPT قرار دارد؛ مدلی شگفت‌انگیز که توانایی درک، تحلیل و تولید زبان انسان را به سطحی بی‌سابقه رسانده است. از دانشجویان و برنامه‌نویسان گرفته تا تولیدکنندگان محتوا و مدیران کسب‌وکار، همگی می‌توانند از قدرت این ابزار بهره‌مند شوند.

اما برای کاربران ایران، محدودیت نسخه رایگان، مشکلات دسترسی و مانع پرداخت ارزی، استفاده حرفه‌ای را دشوار کرده است. در شریف‌جی‌پی‌تی ما راهکاری سریع، امن، مطمئن و همراه با ضمانت کامل ارائه کرده‌ایم.

## ⭐ تجربه حرفه‌ای ChatGPT با تحویل فوری و ضمانت تعویض

در شریف‌جی‌پی‌تی:

- اکانت ChatGPT Plus و مدل‌های پیشرفته‌تر را فوری دریافت می‌کنید.
- اکانت‌ها اورجینال و اختصاصی هستند.
- گارانتی تعویض و پشتیبانی ۲۴ ساعته واقعی ارائه می‌شود.
- با افزونه اختصاصی ما، بدون VPN و بدون دغدغه مسدود شدن، همیشه به ChatGPT وصل خواهید شد.

## خرید اشتراک چت جی پی تی پرمیوم

نسخه رایگان خوب است، اما برای استفاده حرفه‌ای محدودیت‌های جدی دارد:

- سرعت بسیار پایین در ساعات اوج مصرف
- پیام‌های مکرر «ChatGPT is at capacity»
- عدم دسترسی به مدل‌های جدید مثل GPT-4o
- نبود امکاناتی مثل آپلود فایل، وب‌گردی، ساخت GPT سفارشی و ...

برای هر کار حرفه‌ای—از تولید محتوا و مقاله‌نویسی تا تحلیل داده و برنامه‌نویسی—نسخه پرمیوم ضروری است.

## معرفی پلن‌های خرید اکانت ChatGPT

انتخاب پلن مناسب اولین گام برای تجربه حرفه‌ای است. در شریف‌جی‌پی‌تی سه سطح اشتراک ارائه می‌شود:

### 🔵 اکانت ChatGPT Plus (4o)

- بهترین انتخاب اقتصادی و پرفروش‌ترین پلن
- مبتنی بر مدل GPT-4o (Omni)
- سرعت بسیار بالا و قابلیت‌های چندوجهی: متن، تصویر، صدا
- دسترسی به DALL-E 3، وب‌گردی، تحلیل فایل‌های معمولی
- مناسب دانشجویان، فریلنسرها، نویسندگان و کاربران عمومی

### 🔵 اکانت ChatGPT 4.5

- انتخاب میانی برای حرفه‌ای‌هایی که قدرت بیشتر می‌خواهند
- نسخه تقویت‌شده و سریع‌تر از GPT-4o
- مناسب برنامه‌نویسان، تحلیل‌گران و فریلنسرهای حرفه‌ای
- محدودیت‌های استفاده بسیار بالاتر

### 🟣 اکانت ChatGPT 5

- پرچمدار و قدرتمندترین پلن
- مناسب شرکت‌ها، محققان و تیم‌های بزرگ
- قدرت استدلال و خلاقیت بسیار بالا

## 💰 هزینه اکانت چت جی پی تی

- اکانت ChatGPT Plus (یک ماهه): 20 دلار
- اکانت ChatGPT Pro (دسترسی مدل O3 Pro): 200 دلار

🎁 همه پلن‌ها همراه با یک ماه اشتراک رایگان Grok ارائه می‌شوند.

سرمایه‌گذاری روی ChatGPT صرفاً یک هزینه نیست — بلکه چندین برابر با صرفه‌جویی زمان و افزایش کیفیت خروجی برمی‌گردد.

## چرا شریف‌جی‌پی‌تی بهترین انتخاب است؟

1. **پشتیبانی واقعی ۲۴ ساعته**: تیم پشتیبانی ما واقعی، متخصص و همیشه در دسترس است—نه یک ربات.
2. **تضمین جایگزینی اکانت**: اگر اکانت شما مسدود شود، فوری یک اکانت جدید دریافت می‌کنید.
3. **افزونه اختصاصی برای اتصال بدون VPN**: اتصال مستقیم به ChatGPT بدون نیاز به VPN.

## نحوه خرید اکانت ChatGPT در ۳ مرحله

1. **انتخاب پلن**: پلن مناسب خود را از لیست محصولات بالای صفحه انتخاب کنید.
2. **پرداخت امن**: پرداخت از طریق درگاه معتبر زرین‌پال انجام می‌شود.
3. **دسترسی فوری**: پس از پرداخت، اطلاعات اکانت همان لحظه از طریق ربات تلگرام ارسال می‌شود.

و تمام — در کمتر از ۱ دقیقه وارد دنیای ChatGPT Pro می‌شوید.
`;

const HERO_TITLE = "خرید اکانت ChatGPT";
const HERO_SUBTITLE =
  "اکانت‌های قانونی ChatGPT با تحویل آنی، اتصال پایدار و پشتیبانی واقعی برای تجربه‌ای بدون دغدغه.";

// Type for Sanity data
interface SanityData {
  heroSlide: any;
  bestSellerProducts: any[];
  editorialBanners: any[];
  specialOfferProducts: any[];
  socialMediaProducts: any[];
  eduProducts: any[];
  courses: any[];
  magazinePosts: any[];
  tabbedProducts: any[];
  collectionsBanner: any;
  seoContent: string | null;
  faqs: Array<{ q: string; a: string }>;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    robotsMeta?: string;
    openGraphTitle?: string;
    openGraphDescription?: string;
    openGraphImage?: any;
    structuredData?: string;
  };
}

type HeroImage = { src: string; srcSet?: string };

// Single hero component: starts with lightweight gradient; optionally overlays deferred image
function HeroSection({ heroImage }: { heroImage?: HeroImage | null }) {
  return (
    <section 
      dir="rtl"
      className="relative min-h-[92vh] w-full overflow-hidden bg-transparent"
      style={{
        maskImage: 'linear-gradient(to bottom, black 82%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 82%, transparent 100%)',
        backgroundColor: 'transparent !important',
        backgroundImage: 'none !important',
        background: 'transparent !important'
      }}
    >
      {/* Hero-specific background REMOVED - Hero now inherits body/page background */}
      {/* Deferred hero image overlays when ready */}
      {heroImage?.src && (
        <picture className="absolute inset-0 h-full w-full -z-10">
          {heroImage.srcSet && (
            <source srcSet={heroImage.srcSet} sizes="100vw" />
          )}
          <img
            src={heroImage.src}
            srcSet={heroImage.srcSet}
            sizes={heroImage.srcSet ? "100vw" : undefined}
            alt="Hero background"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-[20%_50%] md:object-[60%_50%]"
            style={{ filter: 'brightness(0.85)' }}
          />
        </picture>
      )}
      
      {/* Overlay layers REMOVED - Hero inherits body background, no custom backgrounds */}

      {/* Content - Fixed dimensions to prevent CLS */}
      <div className="relative z-10 mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 pt-28 pb-16 lg:py-24">
        <div className="flex items-center justify-center min-h-[70vh]">
          <div 
            className="text-white text-center flex flex-col justify-center items-center max-w-3xl"
            style={{ minHeight: '300px' }} // Fixed height to prevent CLS
          >
            <span className="inline-block rounded-full bg-white/10 backdrop-blur-sm px-3 py-1 text-xs md:text-sm w-fit border border-white/20">
            بزرگترین ارائه‌دهنده اکانت های هوش مصنوعی 
            </span>
            <h1 className="mt-4 text-7xl sm:text-8xl md:text-6xl lg:text-7xl font-black leading-tight">
              {HERO_TITLE}
            </h1>
            <p className="mt-4 max-w-xl text-white/90 text-xl md:text-lg lg:text-xl leading-relaxed whitespace-pre-line">
              {HERO_SUBTITLE}
            </p>
            <TrustBadges />
          </div>
        </div>
      </div>
    </section>
  );
}

// Trust elements - static, no external deps
function TrustElements() {
  return (
      <section className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <SurfaceGlass variant="default" className="p-8 text-center group hover:scale-105 transition-transform duration-300">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
                <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-full">
                  <Users className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">+۱۰,۰۰۰</h3>
                <p className="text-gray-300 font-medium">کاربر راضی</p>
                <p className="text-sm text-gray-400">از ابزارهای هوش مصنوعی ما استفاده می‌کنند</p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
          </SurfaceGlass>

          <SurfaceGlass variant="default" className="p-8 text-center group hover:scale-105 transition-transform duration-300">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
                <div className="relative bg-gradient-to-r from-purple-500 to-pink-600 p-4 rounded-full">
                  <Award className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">۳+</h3>
                <p className="text-gray-300 font-medium">سال تجربه</p>
                <p className="text-sm text-gray-400">در ارائه راهکارهای دیجیتال و هوش مصنوعی</p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
          </SurfaceGlass>

          <SurfaceGlass variant="default" className="p-8 text-center group hover:scale-105 transition-transform duration-300">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
                <div className="relative bg-gradient-to-r from-green-500 to-blue-600 p-4 rounded-full">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">۱۰۰%</h3>
                <p className="text-gray-300 font-medium">امنیت پرداخت</p>
                <p className="text-sm text-gray-400">تراکنش‌های امن با پشتیبانی از همه کارت‌ها</p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
          </SurfaceGlass>
        </div>
      </section>
  );
}

// Loading placeholder for lazy sections
const SectionPlaceholder = () => (
  <div className="w-full h-64 flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

// Header navigation items
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

const Index = () => {
  const { isRTL } = useDirection();
  const navigate = useNavigate();
  const { state: cartState } = useCart();
  const footerTriggerRef = useRef<HTMLDivElement>(null);
  // Promotions from Medusa
  const siteWidePromotion = useSiteWidePromotion();
  
  // UI state
  const [chatOpen, setChatOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  const [showDynamicContent, setShowDynamicContent] = useState(false);
  
  // Hero slide state - loaded immediately for LCP
  const [heroSlide, setHeroSlide] = useState<{ image: string; imageSrcSet?: string } | null>(null);
  
  // Sanity data state - starts empty, loads after paint
  const [sanityData, setSanityData] = useState<SanityData | null>(null);
  const [medusaPrices, setMedusaPrices] = useState<Record<string, ProductPrices>>({});
  const [dataLoaded, setDataLoaded] = useState(false);

  // Load hero slide immediately (critical for LCP) - no requestIdleCallback
  useEffect(() => {
    const loadHeroSlide = async () => {
      try {
        const isConfigValid = validateSanityConfig();
        if (!isConfigValid) {
          console.warn('[HOMEPAGE] Sanity not configured, skipping hero fetch');
          return;
        }

        console.log('[HOMEPAGE] 🚀 Fetching hero slide immediately...');
        const heroData = await fetchFromSanity<any>(heroSlideQuery);
        
        if (heroData?.heroSlides?.length) {
          const transformed = transformers.transformHeroSlide(heroData.heroSlides[0]);
          setHeroSlide(transformed);
          console.log('[HOMEPAGE] ✅ Hero slide loaded:', transformed.image ? 'with image' : 'no image');
        } else {
          console.warn('[HOMEPAGE] No hero slide data found');
        }
      } catch (error) {
        console.error("[HOMEPAGE] Failed to fetch hero slide:", error);
      }
    };

    // Fetch hero immediately - no delay
    loadHeroSlide();
  }, []);

  // Preload hero image when available
  useEffect(() => {
    if (!heroSlide?.image) return;

    // Check if preload link already exists
    const existingPreload = document.querySelector('link[rel="preload"][as="image"][data-hero-preload]');
    if (existingPreload) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = heroSlide.image;
    link.setAttribute('fetchpriority', 'high');
    link.setAttribute('data-hero-preload', 'true');
    
    if (heroSlide.imageSrcSet) {
      link.setAttribute('imagesrcset', heroSlide.imageSrcSet);
      link.setAttribute('imagesizes', '100vw');
    }
    
    document.head.appendChild(link);
    console.log('[HOMEPAGE] ✅ Preload link added for hero image');
  }, [heroSlide?.image, heroSlide?.imageSrcSet]);

  // Load remaining Sanity data off the critical path (idle)
  useEffect(() => {
    const loadSanityData = async () => {
      try {
        const isConfigValid = validateSanityConfig();
        if (!isConfigValid) {
          console.warn('[HOMEPAGE] Sanity not configured');
          setDataLoaded(true);
          return;
        }

        const categoryMap: Record<string, string> = {
          ai: "ai",
          social: "social-media",
          music: "music",
          edu: "education",
          sim: "sim-card",
        };

        console.log('[HOMEPAGE] 🔄 Starting data fetch...');
        console.log('[HOMEPAGE] Category map:', categoryMap);

        const [homeData, featuredProductsData, featuredCoursesData, featuredPostsData, tabbedProductGroups, faqsData] = 
          await Promise.all([
            fetchFromSanity<any>(homePageQuery),
            fetchFromSanity<any[]>(featuredProductsQuery),
            fetchFromSanity<any[]>(featuredCoursesQuery),
            fetchFromSanity<any[]>(featuredPostsQuery),
            Promise.all(
              Object.entries(categoryMap).map(async ([key, category]) => {
                try {
                  console.log(`[HOMEPAGE] 📦 Fetching products for tab "${key}" (Sanity category: "${category}")`);
                  const categoryProducts = await fetchFromSanity<any[]>(productsByCategoryQuery, { category });
                  console.log(`[HOMEPAGE] 📦 Category "${key}" returned:`, categoryProducts?.length || 0, 'products');
                  if (categoryProducts?.length) {
                    console.log(`[HOMEPAGE] 📦 First product in "${key}":`, categoryProducts[0]);
                  }
                  if (!categoryProducts?.length) {
                    console.log(`[HOMEPAGE] ⚠️ No products found for category "${key}" (Sanity: "${category}")`);
                    return [];
                  }
                  const transformed = categoryProducts.map((p: any, i: number) => transformers.transformTabbedProduct(p, key, i));
                  console.log(`[HOMEPAGE] ✅ Transformed ${transformed.length} products for "${key}":`, transformed);
                  return transformed;
                } catch (err) {
                  console.error(`[HOMEPAGE] ❌ Error fetching category "${key}":`, err);
                  return [];
                }
              }),
            ),
            fetchFromSanity<any[]>(faqsByPageQuery, { page: 'home' }).catch((err) => {
              console.warn('[HOMEPAGE] Failed to fetch FAQs:', err);
              return [];
            }),
          ]);
        
        console.log('[HOMEPAGE] 📊 Raw tabbedProductGroups:', tabbedProductGroups);

        // Transform data
        // Note: heroSlide is already loaded separately, but we keep it here for consistency
        const heroSlideFromHome = homeData?.heroSlides?.length 
          ? transformers.transformHeroSlide(homeData.heroSlides[0]) 
          : null;
        
        // Update hero slide if not already set (fallback in case immediate fetch failed)
        if (!heroSlide && heroSlideFromHome) {
          setHeroSlide(heroSlideFromHome);
        }

        const sanitizedBestSellers = homeData?.bestSellerProducts?.filter((item: any) => item?._id) ?? [];
        const bestSellerProducts = sanitizedBestSellers.length
          ? sanitizedBestSellers.map((item: any, i: number) => transformers.transformBestSellerProduct(item, i))
          : featuredProductsData?.length
            ? featuredProductsData.map((p: any, i: number) => transformers.transformBestSellerProduct(p, i))
            : [];

        const editorialBanners = homeData?.editorialBanners?.length
          ? [...homeData.editorialBanners].sort((a: any, b: any) => (a.order || 0) - (b.order || 0)).map(transformers.transformEditorialBanner)
          : [];

        const specialOfferProducts = homeData?.discountedProducts?.length
          ? homeData.discountedProducts.map((p: any, i: number) => transformers.transformSpecialOfferProduct(p, i))
          : [];

        const socialMediaProducts = homeData?.socialMediaProducts?.length
          ? homeData.socialMediaProducts.map((p: any, i: number) => transformers.transformSocialMediaProduct(p, i))
          : [];

        const eduProducts = homeData?.educationalProducts?.length
          ? homeData.educationalProducts.map((p: any, i: number) => transformers.transformEducationalProduct(p, i))
          : [];

        const courses = homeData?.bestsellingCourses?.length
          ? homeData.bestsellingCourses.map((c: any, i: number) => transformers.transformCourse(c, i))
          : featuredCoursesData?.length
            ? featuredCoursesData.map((c: any, i: number) => transformers.transformCourse(c, i))
            : [];

        const blogPostsSource = homeData?.magazinePosts?.length 
          ? homeData.magazinePosts 
          : homeData?.featuredBlogs?.length 
            ? homeData.featuredBlogs 
            : featuredPostsData;
        const magazinePosts = blogPostsSource?.length
          ? blogPostsSource.map((p: any, i: number) => transformers.transformBlogPost(p, i))
          : [];

        let tabbedProducts = tabbedProductGroups?.flat() ?? [];
        console.log('[HOMEPAGE] 📊 Final flattened tabbedProducts:', tabbedProducts);
        console.log('[HOMEPAGE] 📊 tabbedProducts count:', tabbedProducts.length);
        
        // Fallback: If no products found by category, use featured products and distribute across categories
        if (tabbedProducts.length === 0 && featuredProductsData?.length > 0) {
          console.log('[HOMEPAGE] ⚠️ No category products found, using fallback with featured products');
          const categoryKeys = Object.keys(categoryMap);
          tabbedProducts = featuredProductsData.map((p: any, i: number) => {
            // Assign products to categories in round-robin fashion
            const categoryKey = categoryKeys[i % categoryKeys.length];
            return transformers.transformTabbedProduct(p, categoryKey, i);
          });
          console.log('[HOMEPAGE] 📊 Fallback tabbedProducts:', tabbedProducts);
        }
        
        if (tabbedProducts.length > 0) {
          console.log('[HOMEPAGE] 📊 Sample tabbed product:', tabbedProducts[0]);
          console.log('[HOMEPAGE] 📊 Categories in tabbedProducts:', [...new Set(tabbedProducts.map((p: any) => p.category))]);
        }
        
        const collectionsBanner = homeData?.collectionsBanner
          ? transformers.transformCollectionsBanner(homeData.collectionsBanner)
          : null;

        const seoContent = homeData?.seoContent && typeof homeData.seoContent === 'string'
          ? homeData.seoContent.trim()
          : null;

        const faqs = faqsData?.length
          ? faqsData.map((faq: any) => transformers.transformFaqItem(faq))
          : [];

        setSanityData({
          heroSlide: heroSlideFromHome || heroSlide,
          bestSellerProducts,
          editorialBanners,
          specialOfferProducts,
          socialMediaProducts,
          eduProducts,
          courses,
          magazinePosts,
          tabbedProducts,
          collectionsBanner,
          seoContent,
          faqs,
          seo: homeData?.seo || undefined,
        });
        setDataLoaded(true);
        setShowDynamicContent(true);
      } catch (error) {
        console.error("[HOMEPAGE] Failed to fetch Sanity data:", error);
        setDataLoaded(true);
      }
      };

    const schedule = () => {
      loadSanityData();
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(schedule, { timeout: 1500 });
    } else {
      setTimeout(schedule, 0);
    }
  }, []);

  // Set title and description from Sanity SEO data (directly in document head, no Helmet)
  useEffect(() => {
    if (!sanityData?.seo) return;

    const seo = sanityData.seo;
    
    // Update document title
    if (seo.metaTitle) {
      document.title = seo.metaTitle;
    }

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    if (seo.metaDescription) {
      metaDescription.setAttribute('content', seo.metaDescription);
    }

    // Update Open Graph title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    if (seo.openGraphTitle || seo.metaTitle) {
      ogTitle.setAttribute('content', seo.openGraphTitle || seo.metaTitle || '');
    }

    // Update Open Graph description
    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescription);
    }
    if (seo.openGraphDescription || seo.metaDescription) {
      ogDescription.setAttribute('content', seo.openGraphDescription || seo.metaDescription || '');
    }

    // Update canonical URL
    if (seo.canonicalUrl) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', seo.canonicalUrl);
    }

    // Update robots meta
    if (seo.robotsMeta) {
      let robots = document.querySelector('meta[name="robots"]');
      if (!robots) {
        robots = document.createElement('meta');
        robots.setAttribute('name', 'robots');
        document.head.appendChild(robots);
      }
      robots.setAttribute('content', seo.robotsMeta);
    }

    // Update Open Graph image
    if (seo.openGraphImage?.asset) {
      const ogImageUrl = getImageUrl(seo.openGraphImage, 1200);
      
      let ogImage = document.querySelector('meta[property="og:image"]');
      if (!ogImage) {
        ogImage = document.createElement('meta');
        ogImage.setAttribute('property', 'og:image');
        document.head.appendChild(ogImage);
      }
      ogImage.setAttribute('content', ogImageUrl);
    }

    // Add structured data if available
    if (seo.structuredData) {
      let structuredDataScript = document.querySelector('script[type="application/ld+json"]');
      if (!structuredDataScript) {
        structuredDataScript = document.createElement('script');
        structuredDataScript.setAttribute('type', 'application/ld+json');
        document.head.appendChild(structuredDataScript);
      }
      structuredDataScript.textContent = seo.structuredData;
    }
  }, [sanityData?.seo]);

  // Intersection Observer for Footer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShowFooter(true);
        }
      },
      { rootMargin: "400px" },
    );

    if (footerTriggerRef.current) {
      observer.observe(footerTriggerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Event handlers
  const handleSearch = useCallback((query: string) => {
    toast({ title: "جستجو", description: `جستجو برای: ${query}` });
  }, []);

  const handleAddToCart = useCallback((productId: string) => {
    toast({ title: "به سبد اضافه شد", description: `محصول ${productId} به سبد خرید اضافه شد` });
  }, []);

  const handleCollectionsBanner = useCallback(() => {
    if (sanityData?.collectionsBanner?.ctaLink) {
      navigate(sanityData.collectionsBanner.ctaLink);
    } else {
      toast({ title: "کلکسیون‌های سوشیال مدیا", description: "مشاهده همه کلکسیون‌ها" });
    }
  }, [navigate, sanityData]);

  const bestSellerSlugs = useMemo(() => {
    if (!sanityData?.bestSellerProducts?.length) {
      return [];
    }
    return sanityData.bestSellerProducts.reduce<string[]>((acc, item) => {
      const slug = item.slug || item.handle;
      if (slug) {
        acc.push(slug);
      }
      return acc;
    }, []);
  }, [sanityData?.bestSellerProducts]);

  const socialProductSlugs = useMemo(() => {
    if (!sanityData?.socialMediaProducts?.length) {
      return [];
    }
    return sanityData.socialMediaProducts.reduce<string[]>((acc, item) => {
      const slug = item.slug || item.handle;
      if (slug) {
        acc.push(slug);
      }
      return acc;
    }, []);
  }, [sanityData?.socialMediaProducts]);

  const tabbedProductSlugs = useMemo(() => {
    if (!sanityData?.tabbedProducts?.length) {
      console.log('[HOMEPAGE] 📊 No tabbed products for slug extraction');
      return [];
    }
    const slugs = sanityData.tabbedProducts.reduce<string[]>((acc, item) => {
      const slug = item.slug || item.handle;
      if (slug) {
        acc.push(slug);
      }
      return acc;
    }, []);
    console.log('[HOMEPAGE] 📊 Extracted tabbedProductSlugs:', slugs);
    return slugs;
  }, [sanityData?.tabbedProducts]);

  const medusaSlugs = useMemo(() => {
    const combined = [...bestSellerSlugs, ...socialProductSlugs, ...tabbedProductSlugs];
    return Array.from(new Set(combined));
  }, [bestSellerSlugs, socialProductSlugs, tabbedProductSlugs]);

  // Defer Medusa price fetch to explicit user interaction (no idle fallback) to keep it out of LCP chains
  useEffect(() => {
    if (!medusaSlugs.length) {
      return;
    }

    let cancelled = false;
    let hasInteracted = false;

    const loadPrices = async () => {
      if (cancelled) return;
      try {
        const { fetchProductPrices } = await import("@/lib/medusa-prices");
        const prices = await fetchProductPrices(medusaSlugs);
        if (!cancelled) {
          setMedusaPrices(prices);
        }
      } catch (error) {
        console.error("[HOMEPAGE] Failed to fetch Medusa prices:", error);
        if (!cancelled) {
          setMedusaPrices({});
        }
      }
    };

    const onFirstInteraction = () => {
      if (hasInteracted) return;
      hasInteracted = true;
      loadPrices();
      window.removeEventListener("scroll", onFirstInteraction);
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
    };

    // Trigger only on user interaction
    window.addEventListener("scroll", onFirstInteraction, { passive: true, once: true });
    window.addEventListener("pointerdown", onFirstInteraction, { passive: true, once: true });
    window.addEventListener("keydown", onFirstInteraction, { passive: true, once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("scroll", onFirstInteraction);
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
    };
  }, [medusaSlugs.join("|")]);

  return (
    <div className="min-h-screen relative">
      {/* Header - lightweight, loads immediately */}
      <Header onSearch={handleSearch} megaItems={megaItems} />

      {/* Hero Section - single instance; gradient is LCP, image swaps in lazily */}
      <HeroSection
        heroImage={
          heroSlide?.image
            ? { src: heroSlide.image, srcSet: heroSlide.imageSrcSet }
            : null
        }
      />

      {/* Site-wide Promotion Banner - from Medusa */}
      {siteWidePromotion && (
        <div className="container mx-auto px-4 md:px-6 -mt-8 mb-8 relative z-20">
          <PromotionBanner promotion={siteWidePromotion} variant="hero" />
        </div>
      )}

      {/* <TestimonialsRow /> */}

      {/* Dynamic content sections - only render when data is loaded */}
      {dataLoaded && sanityData && (
        <Suspense fallback={<SectionPlaceholder />}>
          {/* Best Sellers */}
          {sanityData.bestSellerProducts.length > 0 && (
            <BestSellers products={sanityData.bestSellerProducts} productPrices={medusaPrices} onAdd={handleAddToCart} />
          )}

          {/* Editorial Banners */}
          {sanityData.editorialBanners.length > 0 && (
            <EditorialBanners banners={sanityData.editorialBanners} />
          )}

          {/* Special Offers */}
          {sanityData.specialOfferProducts.length > 0 && (
            <SpecialOffers 
              products={sanityData.specialOfferProducts} 
              productPrices={medusaPrices}
              onAdd={handleAddToCart}
              onViewAll={() => {}}
              className="mx-[10px]"
            />
          )}

          {/* Tabbed Product Grid - Commented out for now
          {sanityData.tabbedProducts.length > 0 && (
            <TabbedProductGrid
              products={sanityData.tabbedProducts}
              productPrices={medusaPrices}
              onAdd={handleAddToCart}
              onViewAll={() => {}}
            />
          )}
          */}

          {/* Social Media Products */}
          {sanityData.socialMediaProducts.length > 0 && (
            <SocialMediaProductsGrid
              products={sanityData.socialMediaProducts.map((item) => ({
                id: item.id,
                title: item.title,
                image: item.image,
                price: item.price,
                slug: item.slug || item.handle,
              }))}
              productPrices={medusaPrices}
              onAdd={handleAddToCart}
              onViewAll={() => {}}
              className="mx-[10px]"
            />
          )}

          {/* Collections Banner */}
          {sanityData.collectionsBanner && (
            <CollectionsBanner 
              onClick={handleCollectionsBanner} 
              className="mx-[10px]"
              title={sanityData.collectionsBanner.title}
              subtitle={sanityData.collectionsBanner.subtitle}
              image={sanityData.collectionsBanner.image}
              imageSrcSet={sanityData.collectionsBanner.imageSrcSet}
              ctaText={sanityData.collectionsBanner.ctaText}
            />
          )}

          {/* Educational Products */}
          {sanityData.eduProducts.length > 0 && (
            <EduProductsSlider
              items={sanityData.eduProducts}
              onAdd={handleAddToCart}
              onViewAll={() => {}}
              rtl={isRTL}
            />
          )}

          {/* Blog Posts */}
          {sanityData.magazinePosts.length > 0 && (
            <BlogsCarousel
              posts={sanityData.magazinePosts}
              onRead={() => {}}
              onViewAll={() => {}}
              className="mx-[10px]"
            />
          )}

          {/* FAQ Section */}
          {sanityData.faqs.length > 0 && (
            <div className="mx-[10px] py-8 sm:py-10 lg:py-12">
              <FaqAccordion items={sanityData.faqs} />
            </div>
          )}
        </Suspense>
      )}

      {/* Trust Elements - Static, always visible */}
      <TrustElements />

      {/* SEO Content / Fallback */}
      <section className="container mx-auto px-4 md:px-6 py-16">
        <SurfaceGlass variant="subtle" className="p-8 md:p-12">
          <div className="max-w-4xl mx-auto">
            <Suspense fallback={<SectionPlaceholder />}>
              <EnhancedMarkdownRenderer content={sanityData?.seoContent || fallbackSeoContent} />
            </Suspense>
          </div>
        </SurfaceGlass>
      </section>

      {/* Footer Trigger Point */}
      <div ref={footerTriggerRef} className="h-px" />

      {/* Footer - Lazy loaded */}
      {showFooter && (
        <Suspense fallback={<div className="h-20" />}>
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
              { type: "X", href: "https://x.com/sharifgpt" },
              { type: "YouTube", href: "https://youtube.com/@sharifgpt" },
            ]}
          />
        </Suspense>
      )}

      {/* Floating UI - Lazy loaded */}
      {/* <Suspense fallback={null}>
        <FloatingDock
          onOpenChat={() => setChatOpen(true)}
          onOpenSupport={() => setSupportOpen(true)}
          onOpenCart={() => setCartOpen(true)}
          cartItemCount={cartState.itemCount}
        />
      </Suspense> */}

      {/* <Suspense fallback={null}>
      <ChatbotPanel open={chatOpen} onClose={() => setChatOpen(false)} />
      </Suspense> */}

      <Suspense fallback={null}>
      <SupportPanel open={supportOpen} onClose={() => setSupportOpen(false)} />
      </Suspense>

      <Suspense fallback={null}>
        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      </Suspense>
    </div>
  );
};

export default Index;
