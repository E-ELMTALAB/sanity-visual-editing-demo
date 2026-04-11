import { useState, lazy, Suspense, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Helmet } from "@/components/Helmet";
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
import { TrustStatsBar } from "@/components/TrustStatsBar";
import { QuickSummaryTrustBar } from "@/components/QuickSummaryTrustBar";
import { SeoContentCard } from "@/components/SeoContentCard";
import { PromoBanner } from "@/components/PromoBanner";

// Lazy PromoBanner that loads after LCP window (5s or user interaction)
const LazyPromoBanner = () => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const loadBanner = () => setShouldRender(true);
    let hasInteracted = false;

    const onInteraction = () => {
      if (hasInteracted) return;
      hasInteracted = true;
      loadBanner();
      window.removeEventListener('scroll', onInteraction);
      window.removeEventListener('pointerdown', onInteraction);
      window.removeEventListener('keydown', onInteraction);
    };

    // Load on user interaction (scroll, click, keydown)
    window.addEventListener('scroll', onInteraction, { passive: true, once: true });
    window.addEventListener('pointerdown', onInteraction, { passive: true, once: true });
    window.addEventListener('keydown', onInteraction, { once: true });

    // Fallback: load after 5 seconds (after LCP window)
    setTimeout(loadBanner, 5000);
  }, []);

  if (!shouldRender) {
    return null; // No placeholder to avoid layout shift
  }

  return <PromoBanner />;
};

// Deferred TrustBadges - loads after LCP to prevent swap
const DeferredTrustBadges = () => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const loadBadges = () => setShouldRender(true);
    let hasInteracted = false;

    const onInteraction = () => {
      if (hasInteracted) return;
      hasInteracted = true;
      loadBadges();
      window.removeEventListener('scroll', onInteraction);
      window.removeEventListener('pointerdown', onInteraction);
      window.removeEventListener('keydown', onInteraction);
    };

    // Load on user interaction
    window.addEventListener('scroll', onInteraction, { passive: true, once: true });
    window.addEventListener('pointerdown', onInteraction, { passive: true, once: true });
    window.addEventListener('keydown', onInteraction, { once: true });

    // Fallback: load after 5 seconds
    setTimeout(loadBadges, 5000);
  }, []);

  if (!shouldRender) {
    return null;
  }

  return (
    <div className="mt-4 sm:mt-6">
      <TrustBadges />
    </div>
  );
};
// Direct cache access — zero runtime Sanity API calls in production
import {
  getHomepageData,
  getFeaturedProducts,
  getFeaturedCourses,
  getFeaturedPosts,
  getProductsByCategory,
  getFaqsByPage,
} from "@/lib/sanity-cache-direct";
import * as transformers from "@/lib/sanity.transformers";
import { getImageUrl } from "@/lib/sanity.image";

// Lazy load heavy components - don't load until needed
const Footer = lazy(() => import("@/components/Footer/Footer").then((m) => ({ default: m.Footer })));
// FloatingDock moved to global App.tsx - appears on all pages
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
const HOMEPAGE_DEFAULT_TITLE = "SharifGPT | محصولات و خدمات هوش مصنوعی";
const HOMEPAGE_DEFAULT_DESCRIPTION = "SharifGPT - ارائه محصولات و خدمات هوش مصنوعی";

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

// HeroGlow component removed - using single hero-halo div with pseudo-elements instead

// Hero component: lightweight gradient background only, no image

function HeroSection() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLElement | null>(null);

  return (
    <section
      ref={(el) => (heroRef.current = el)}
      dir="rtl"
      className="relative min-h-[85vh] sm:min-h-[90vh] w-full overflow-hidden isolate"
      style={{
        backgroundColor: "transparent",
        backgroundImage: "none",
        background: "transparent",
      }}
    >
      {/* Your existing heroGlow (keep) */}
      <div
        aria-hidden="true"
        className="heroGlow pointer-events-none absolute inset-0 z-0"
        style={{
          contain: "paint",
          willChange: "transform",
          transform: "translateZ(0)",
        }}
      />

      {/* Your existing vignette overlay (keep) */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0) 70%, transparent 100%),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.08) 0%, transparent 40%, transparent 100%)
          `,
          opacity: 1,
        }}
      />

      {/* Content (unchanged) */}
      <div className="relative z-10 mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 pt-36 sm:pt-44 md:pt-52 pb-16 lg:pb-24">
        <div className="flex items-center justify-center min-h-[50vh] sm:min-h-[55vh]">
          <div className="text-white text-center flex flex-col justify-center items-center max-w-3xl w-full space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="font-vazirmatn text-xs sm:text-sm font-medium text-white/90">
                پلتفرم پیشرو در هوش مصنوعی
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              {HERO_TITLE}
            </h1>

            <p className="max-w-2xl text-white/90 text-base sm:text-lg md:text-xl leading-relaxed font-normal px-4">
              {HERO_SUBTITLE}
            </p>

            <div className="mt-4 sm:mt-6">
              <div
                dir="rtl"
                className="flex flex-row flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8"
              >
                <div className="flex flex-col items-center gap-3 sm:gap-4 group">
                  <div className="relative">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl glass border border-white/20 flex items-center justify-center text-white shadow-lg group-hover:shadow-xl group-hover:brightness-110 transition-all duration-200 backdrop-blur-md">
                      <div className="text-white/95 group-hover:text-white transition-colors duration-200 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-refresh-cw w-full h-full"
                        >
                          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                          <path d="M21 3v5h-5" />
                          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                          <path d="M8 16H3v5" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <span className="text-white/90 text-xs sm:text-sm md:text-base font-medium text-center whitespace-nowrap">
                    تضمین تعویض
                  </span>
                </div>

                <div className="flex flex-col items-center gap-3 sm:gap-4 group">
                  <div className="relative">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl glass border border-white/20 flex items-center justify-center text-white shadow-lg group-hover:shadow-xl group-hover:brightness-110 transition-all duration-200 backdrop-blur-md">
                      <div className="text-white/95 group-hover:text-white transition-colors duration-200 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-shield w-full h-full"
                        >
                          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <span className="text-white/90 text-xs sm:text-sm md:text-base font-medium text-center whitespace-nowrap">
                    اکانت‌های اصل
                  </span>
                </div>

                <div className="flex flex-col items-center gap-3 sm:gap-4 group">
                  <div className="relative">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl glass border border-white/20 flex items-center justify-center text-white shadow-lg group-hover:shadow-xl group-hover:brightness-110 transition-all duration-200 backdrop-blur-md">
                      <div className="text-white/95 group-hover:text-white transition-colors duration-200 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-clock w-full h-full"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <span className="text-white/90 text-xs sm:text-sm md:text-base font-medium text-center whitespace-nowrap">
                    پشتیبانی ۲۴/۷
                  </span>
                </div>
              </div>
            </div>

            {/* <DeferredTrustBadges /> */}

            <div className="mt-6 sm:mt-8">
              <button
                onClick={() => navigate("/products")}
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl border border-white/20 px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg font-bold text-white cursor-pointer"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(30, 103, 198, 0.2) 100%)",
                  boxShadow:
                    "0 8px 32px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 12px 40px rgba(139, 92, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 8px 32px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
                }}
              >
                <span className="font-vazirmatn relative z-10">مشاهده محصولات</span>
                <span className="relative z-10">→</span>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100"
                  style={{
                    background: "linear-gradient(120deg, transparent, rgba(255,255,255,0.1), transparent)",
                  }}
                />
              </button>
            </div>
          </div>
        </div>
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
    const experiment = import.meta.env.VITE_EXPERIMENT || 'baseline';
    console.log('[EXPERIMENT] Mode:', experiment);

    // EXPERIMENT A: Static hero (no Sanity fetch)
    if (experiment === 'A' || experiment === 'a') {
      console.log('[EXPERIMENT A] Using static hero (no Sanity fetch)');
      const heroSrcSetTime = performance.now();
      setHeroSlide({
        image: '/assets/hero-ai-cubes.png', // Static fallback
        imageSrcSet: undefined,
      });
      console.log('[LCP INSTRUMENT] heroSlide state SET (heroSrcSetTime):', heroSrcSetTime, 'ms', 'Image URL: /assets/hero-ai-cubes.png');
      return;
    }

    // EXPERIMENT B: Gradient only (no hero image)
    if (experiment === 'B' || experiment === 'b') {
      console.log('[EXPERIMENT B] Gradient only (no hero image)');
      setHeroSlide(null); // No image
      return;
    }

    // BASELINE or EXPERIMENT C: Normal cache / Sanity fetch
    const loadHeroSlide = async () => {
      const sanityStart = performance.now();

      try {
        const heroData = await getHomepageData();

        const sanityEnd = performance.now();
        console.log('[LCP INSTRUMENT] Homepage cache read:', (sanityEnd - sanityStart).toFixed(2), 'ms');

        if (heroData?.heroSlides?.length) {
          const transformed = transformers.transformHeroSlide(heroData.heroSlides[0]);
          setHeroSlide(transformed);
        }
      } catch (error) {
        console.error("[HOMEPAGE] Failed to load hero slide:", error);
      }
    };

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

  // Load remaining data off the critical path (deferred until after initial paint)
  useEffect(() => {
    const loadSanityData = async () => {
      try {
        const categoryMap: Record<string, string> = {
          ai: "ai",
          social: "social-media",
          music: "music",
          edu: "education",
          sim: "sim-card",
        };

        const [homeData, featuredProductsData, featuredCoursesData, featuredPostsData, tabbedProductGroups, faqsData] =
          await Promise.all([
            getHomepageData(),
            getFeaturedProducts(),
            getFeaturedCourses(),
            getFeaturedPosts(),
            Promise.all(
              Object.entries(categoryMap).map(async ([key, category]) => {
                try {
                  const categoryProducts = await getProductsByCategory(category);
                  if (!categoryProducts?.length) return [];
                  return categoryProducts.map((p: any, i: number) => transformers.transformTabbedProduct(p, key, i));
                } catch (err) {
                  console.error(`[HOMEPAGE] Error loading category "${key}":`, err);
                  return [];
                }
              }),
            ),
            getFaqsByPage('home').catch(() => [] as any[]),
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

    // Use requestIdleCallback for better performance, fallback to setTimeout
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      requestIdleCallback(loadSanityData, { timeout: 2000 });
    } else {
      setTimeout(loadSanityData, 100);
    }
  }, []);

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
    // Track banner click event for GA4
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "banner_click",
      banner_name: "collections_banner",
      banner_position: "homepage_hero",
      banner_link: sanityData?.collectionsBanner?.ctaLink || "default_collections",
      page_location: window.location.href
    });

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

  // Track homepage view for GA4 - deferred to avoid blocking LCP
  useEffect(() => {
    const trackPageView = () => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "page_view",
        page_title: "Homepage - SharifGPT",
        page_location: window.location.href,
        page_path: window.location.pathname,
        page_type: "homepage"
      });
    };

    // Defer analytics to after LCP
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      requestIdleCallback(trackPageView, { timeout: 3000 });
    } else {
      setTimeout(trackPageView, 100);
    }
  }, []);

  // LCP Instrumentation - comprehensive timing and visibility tracking
  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    const reactMountTime = performance.now();
    console.log('[LCP INSTRUMENT] React mounted at:', reactMountTime, 'ms');

    const metrics = {
      reactMountTime,
      heroSrcSetTime: null as number | null,
      heroInDOMTime: null as number | null,
      heroVisibleTime: null as number | null,
      heroLoadTime: null as number | null,
      lcpTime: null as number | null,
      lcpElement: null as Element | null,
      lcpUrl: null as string | null,
    };

    // Track hero image src assignment and visibility
    // Guard against infinite RAF loops when no hero image is rendered.
    let rafId: number | null = null;
    const maxChecks = 120; // ~2s at 60fps
    let checks = 0;
    const checkHeroImage = () => {
      checks += 1;
      const heroImg = document.querySelector('img[data-lcp-hero]') as HTMLImageElement | null;

      if (heroImg) {
        const currentSrc = heroImg.src || heroImg.getAttribute('src') || '';

        // Track when src is set
        if (currentSrc && currentSrc !== '' && !metrics.heroSrcSetTime) {
          metrics.heroSrcSetTime = performance.now();
          console.log('[LCP INSTRUMENT] Hero img src SET:', metrics.heroSrcSetTime, 'ms', 'src:', currentSrc);
        }

        // Track when in DOM
        if (!metrics.heroInDOMTime) {
          metrics.heroInDOMTime = performance.now();
          console.log('[LCP INSTRUMENT] Hero img in DOM:', metrics.heroInDOMTime, 'ms');
        }

        // Track visibility using getBoundingClientRect + computedStyle
        if (!metrics.heroVisibleTime) {
          const rect = heroImg.getBoundingClientRect();
          const style = window.getComputedStyle(heroImg);
          const isVisible =
            rect.width > 0 &&
            rect.height > 0 &&
            style.display !== 'none' &&
            style.visibility !== 'hidden' &&
            style.opacity !== '0' &&
            rect.top < window.innerHeight &&
            rect.bottom > 0;

          if (isVisible) {
            metrics.heroVisibleTime = performance.now();
            console.log('[LCP INSTRUMENT] Hero img VISIBLE:', metrics.heroVisibleTime, 'ms', 'rect:', { width: rect.width, height: rect.height, top: rect.top });
          }
        }

        // Track when image finishes loading
        if (heroImg.complete && !metrics.heroLoadTime) {
          metrics.heroLoadTime = performance.now();
          console.log('[LCP INSTRUMENT] Hero img LOADED (complete):', metrics.heroLoadTime, 'ms');
        } else if (!heroImg.complete && !metrics.heroLoadTime) {
          heroImg.addEventListener('load', () => {
            metrics.heroLoadTime = performance.now();
            console.log('[LCP INSTRUMENT] Hero img LOADED (event):', metrics.heroLoadTime, 'ms');
          }, { once: true });
        }
      }

      // Keep checking until we have all metrics, but stop after max checks
      // so pages without data-lcp-hero don't run forever.
      if ((!metrics.heroLoadTime || !metrics.heroVisibleTime) && checks < maxChecks) {
        rafId = requestAnimationFrame(checkHeroImage);
      } else if (!heroImg && checks >= maxChecks) {
        console.log('[LCP INSTRUMENT] No hero image found after max checks, stopping observer loop');
      }
    };

    // Start checking after a short delay to allow React to render
    setTimeout(() => checkHeroImage(), 50);

    // Track LCP via PerformanceObserver
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const lcpEntry = entry as any;
          metrics.lcpTime = lcpEntry.startTime;
          metrics.lcpElement = lcpEntry.element;
          metrics.lcpUrl = lcpEntry.url;

          // Create short selector for LCP element
          let selector = '';
          if (lcpEntry.element) {
            const el = lcpEntry.element as Element;
            if (el.id) selector = `#${el.id}`;
            else if (el.className) selector = `.${el.className.split(' ')[0]}`;
            else selector = el.tagName.toLowerCase();
          }

          console.log('[LCP INSTRUMENT] LCP EVENT:', {
            lcpTime: metrics.lcpTime.toFixed(2),
            lcpElement: lcpEntry.element?.tagName,
            lcpSelector: selector,
            lcpUrl: metrics.lcpUrl,
            lcpSize: lcpEntry.size,
            timeFromReactMount: (metrics.lcpTime - metrics.reactMountTime).toFixed(2),
            timeFromHeroVisible: metrics.heroVisibleTime ? (metrics.lcpTime - metrics.heroVisibleTime).toFixed(2) : 'N/A',
            heroSrcSetTime: metrics.heroSrcSetTime ? metrics.heroSrcSetTime.toFixed(2) : 'N/A',
            heroInDOMTime: metrics.heroInDOMTime ? metrics.heroInDOMTime.toFixed(2) : 'N/A',
            heroVisibleTime: metrics.heroVisibleTime ? metrics.heroVisibleTime.toFixed(2) : 'N/A',
            heroLoadTime: metrics.heroLoadTime ? metrics.heroLoadTime.toFixed(2) : 'N/A',
          });
        }
      });

      observer.observe({ type: 'largest-contentful-paint', buffered: true });

      return () => {
        observer.disconnect();
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
        }
      };
    } catch (error) {
      console.warn('[LCP INSTRUMENT] PerformanceObserver not supported:', error);
    }
  }, []);

  return (
    <div className="min-h-screen relative">
      <Helmet>
        <title>{sanityData?.seo?.metaTitle || HOMEPAGE_DEFAULT_TITLE}</title>
        <meta
          name="description"
          content={sanityData?.seo?.metaDescription || HOMEPAGE_DEFAULT_DESCRIPTION}
        />
        <meta
          property="og:title"
          content={sanityData?.seo?.openGraphTitle || sanityData?.seo?.metaTitle || HOMEPAGE_DEFAULT_TITLE}
        />
        <meta
          property="og:description"
          content={sanityData?.seo?.openGraphDescription || sanityData?.seo?.metaDescription || HOMEPAGE_DEFAULT_DESCRIPTION}
        />
        <meta
          property="og:image"
          content={sanityData?.seo?.openGraphImage?.asset ? getImageUrl(sanityData.seo.openGraphImage, 1200) : "/favicon.png"}
        />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href={sanityData?.seo?.canonicalUrl || "https://sharifgpt.com/"} />
        {sanityData?.seo?.structuredData ? (
          <script type="application/ld+json">{sanityData.seo.structuredData}</script>
        ) : null}
      </Helmet>

      {/* Header - lightweight, loads immediately */}
      <Header onSearch={handleSearch} megaItems={megaItems} />

      {/* Hero Section - gradient background only, no image */}
      <HeroSection />

      {/* Promo Banner - deferred until after LCP (5s or user interaction) */}
      {/* <LazyPromoBanner /> */}

      {/* Site-wide Promotion Banner - from Medusa */}


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
              onViewAll={() => { }}
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
              onViewAll={() => { }}
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
              onViewAll={() => { }}
              rtl={isRTL}
            />
          )}

          {/* Blog Posts */}
          {sanityData.magazinePosts.length > 0 && (
            <BlogsCarousel
              posts={sanityData.magazinePosts}
              onRead={() => { }}
              onViewAll={() => { }}
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

      {/* Trust Stats Bar - Simple icon + number stats */}
      <TrustStatsBar />

      {/* Quick Summary Trust Bar */}
      <section className="container mx-auto px-4 md:px-6">
        <QuickSummaryTrustBar />
      </section>

      {/* SEO Content / Fallback - progressive reveal card */}
      <section className="container mx-auto px-4 md:px-6 py-16">
        <Suspense fallback={<SectionPlaceholder />}>
          <SeoContentCard>
            <EnhancedMarkdownRenderer content={sanityData?.seoContent || fallbackSeoContent} />
          </SeoContentCard>
        </Suspense>
      </section>

      {/* FAQ Section - Always show below SeoContentCard */}
      <Suspense fallback={<SectionPlaceholder />}>
        <FaqAccordion
          items={
            (dataLoaded && sanityData?.faqs && sanityData.faqs.length > 0)
              ? sanityData.faqs
              : [
                {
                  q: "چگونه می‌توانم محصولات را خریداری کنم؟",
                  a: "شما می‌توانید با مراجعه به صفحه محصولات، محصول مورد نظر خود را انتخاب کرده و به سبد خرید اضافه کنید. پس از تکمیل اطلاعات، پرداخت را انجام دهید."
                },
                {
                  q: "روش‌های پرداخت چیست؟",
                  a: "ما از روش‌های مختلف پرداخت مانند کارت‌های بانکی، پرداخت آنلاین و سایر روش‌های امن پشتیبانی می‌کنیم."
                },
                {
                  q: "آیا محصولات ضمانت دارند؟",
                  a: "بله، تمام محصولات ما دارای ضمانت کیفیت هستند. در صورت بروز هرگونه مشکل، می‌توانید با پشتیبانی تماس بگیرید."
                },
                {
                  q: "چگونه می‌توانم با پشتیبانی تماس بگیرم؟",
                  a: "شما می‌توانید از طریق صفحه تماس با ما، ایمیل یا چت آنلاین با تیم پشتیبانی در ارتباط باشید."
                }
              ]
          }
        />
      </Suspense>

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
      {/* FloatingDock moved to global App.tsx - appears on all pages */}

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
