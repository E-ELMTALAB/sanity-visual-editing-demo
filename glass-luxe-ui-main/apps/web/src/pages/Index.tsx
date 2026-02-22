import { useState, lazy, Suspense, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
// Import Sanity modules statically (lazy-loading caused initialization issues)
import { fetchFromSanity } from "@/lib/sanity.client.unified";
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

// HeroGlow component - Reflect-style horizon + halo dome effect
// LCP SAFETY: This is purely decorative (aria-hidden, pointer-events-none, z-0)
// Hero text (h1/p) remains the LCP element, not this glow effect
function HeroGlow() {
  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
      role="presentation"
      style={{
        contain: 'paint',
        willChange: 'transform',
        transform: 'translateZ(0)',
      }}
    >
      {/* Horizon line with bloom layers - positioned at ~55% height */}
      <div className="absolute left-1/2 top-[55%] -translate-x-1/2 w-full max-w-[1100px]">
        {/* Bloom layer 2 - largest, softest (70-120px height, 40-70px blur) */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-full h-[100px]"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(210, 170, 255, 0.2) 20%, rgba(140, 120, 255, 0.25) 50%, rgba(210, 170, 255, 0.2) 80%, transparent 100%)',
            filter: 'blur(55px)',
            opacity: 0.20,
          }}
        />

        {/* Bloom layer 1 - medium (18-24px height, 12-18px blur) */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-full h-[20px]"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(210, 170, 255, 0.55) 20%, rgba(140, 120, 255, 0.6) 50%, rgba(210, 170, 255, 0.55) 80%, transparent 100%)',
            filter: 'blur(15px)',
            opacity: 0.55,
          }}
        />

        {/* Core horizon line (2px height) */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-full h-[2px]"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(210, 170, 255, 0.95) 20%, rgba(140, 120, 255, 0.95) 50%, rgba(210, 170, 255, 0.95) 80%, transparent 100%)',
          }}
        />
      </div>

      {/* Under-horizon reflection glow */}
      <div
        className="absolute left-1/2 top-[58%] -translate-x-1/2"
        style={{
          width: 'clamp(400px, 70vw, 800px)',
          height: 'clamp(200px, 35vh, 400px)',
          background: 'radial-gradient(circle, rgba(170, 140, 255, 0.35) 0%, rgba(170, 140, 255, 0.15) 30%, transparent 60%)',
          filter: 'blur(40px)',
          opacity: 0.6,
        }}
      />

      {/* Halo dome - inline SVG above horizon */}
      <svg
        className="absolute left-1/2 -translate-x-1/2 max-w-[900px] w-full h-[420px]"
        style={{
          top: 'calc(55% - 420px)',
          willChange: 'opacity',
        }}
        viewBox="0 0 900 420"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        role="presentation"
      >
        <defs>
          {/* Gaussian blur filters for glow effects */}
          <filter id="haloInnerBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 2 0"
              result="coloredBlur"
            />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="haloOuterBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="25" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1.5 0"
              result="coloredBlur"
            />
            <feMerge>
              <feMergeNode in="coloredBlur" />
            </feMerge>
          </filter>

          {/* Gradient for dome arcs */}
          <linearGradient id="domeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(210, 170, 255, 0.85)" stopOpacity="0.85" />
            <stop offset="50%" stopColor="rgba(140, 120, 255, 1)" stopOpacity="1" />
            <stop offset="100%" stopColor="rgba(210, 170, 255, 0.85)" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        {/* Outer haze - largest, softest (stroke 60-90, opacity ~0.12) */}
        <path
          d="M 50 400 Q 450 50 850 400"
          stroke="rgba(210, 170, 255, 0.5)"
          strokeWidth="75"
          fill="none"
          filter="url(#haloOuterBlur)"
          opacity="0.12"
          strokeLinecap="round"
        />

        {/* Inner glow - medium (stroke 14-22, opacity ~0.35) */}
        <path
          d="M 80 400 Q 450 80 820 400"
          stroke="rgba(140, 120, 255, 0.7)"
          strokeWidth="18"
          fill="none"
          filter="url(#haloInnerBlur)"
          opacity="0.35"
          strokeLinecap="round"
        />

        {/* Core arc - thin, high opacity (stroke 3-4) */}
        <path
          d="M 100 400 Q 450 100 800 400"
          stroke="url(#domeGradient)"
          strokeWidth="3.5"
          fill="none"
          opacity="0.95"
          strokeLinecap="round"
        />

        {/* Optional inner ring - second smaller arc */}
        <path
          d="M 120 400 Q 450 120 780 400"
          stroke="rgba(210, 170, 255, 0.6)"
          strokeWidth="2"
          fill="none"
          opacity="0.5"
          strokeLinecap="round"
        />

        {/* Subtle particles - 12 tiny dots in dome area (opacity max 0.15) */}
        <circle cx="200" cy="250" r="1.5" fill="rgba(210, 170, 255, 0.8)" opacity="0.12" />
        <circle cx="300" cy="200" r="1.2" fill="rgba(140, 120, 255, 0.8)" opacity="0.10" />
        <circle cx="450" cy="150" r="1.8" fill="rgba(210, 170, 255, 0.9)" opacity="0.15" />
        <circle cx="600" cy="200" r="1.3" fill="rgba(140, 120, 255, 0.8)" opacity="0.12" />
        <circle cx="700" cy="250" r="1.5" fill="rgba(210, 170, 255, 0.8)" opacity="0.10" />
        <circle cx="250" cy="300" r="1.0" fill="rgba(140, 120, 255, 0.7)" opacity="0.08" />
        <circle cx="400" cy="180" r="1.4" fill="rgba(210, 170, 255, 0.8)" opacity="0.13" />
        <circle cx="550" cy="220" r="1.2" fill="rgba(140, 120, 255, 0.8)" opacity="0.11" />
        <circle cx="650" cy="280" r="1.1" fill="rgba(210, 170, 255, 0.7)" opacity="0.09" />
        <circle cx="350" cy="240" r="1.3" fill="rgba(140, 120, 255, 0.8)" opacity="0.12" />
        <circle cx="500" cy="170" r="1.6" fill="rgba(210, 170, 255, 0.9)" opacity="0.14" />
        <circle cx="150" cy="320" r="1.0" fill="rgba(140, 120, 255, 0.7)" opacity="0.08" />
      </svg>
    </div>
  );
}

// Hero component: lightweight gradient background only, no image
function HeroSection() {
  const navigate = useNavigate();

  // Ensure prehero is removed if it still exists (fallback cleanup)
  // EXPERIMENT C: Don't remove prehero immediately - let main.tsx handle it
  useEffect(() => {
    const experiment = import.meta.env.VITE_EXPERIMENT || 'baseline';

    if (experiment === 'C' || experiment === 'c') {
      // Don't remove prehero in Experiment C - let main.tsx handle it after 5s
      console.log('[EXPERIMENT C] React hero mounted, prehero will be removed by main.tsx after 5s or interaction');
      return;
    }

    const prehero = document.getElementById("prehero");
    if (prehero && prehero.parentNode) {
      if (import.meta.env.DEV || import.meta.env.VITE_DEBUG_LCP === 'true') {
        console.log('[LCP Debug] React hero mounted, removing prehero (fallback):', {
          timestamp: performance.now()
        });
      }
      prehero.remove();
    }
  }, []);

  // Animation is now handled via CSS keyframes (heroGlowFloat) - no JS needed
  // This respects prefers-reduced-motion automatically via CSS media query

  return (
    <section
      dir="rtl"
      className="relative min-h-[85vh] sm:min-h-[90vh] w-full overflow-hidden"
    >
      {/* Base gradient background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0b1024] via-[#0f152f] to-[#0c1028]" />

      {/* Reflect-style hero glow - horizon line + halo dome */}
      {/* LCP SAFETY: This is decorative only (aria-hidden, pointer-events-none, z-0) */}
      {/* Hero text (h1/p) remains the LCP element, not this glow effect */}
      <div
        style={{
          animation: 'heroGlowFloat 10s ease-in-out infinite alternate',
        }}
      >
        <HeroGlow />
      </div>

      {/* Vignette overlay for text contrast */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.35) 70%, rgba(0, 0, 0, 0.55) 100%),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.15) 0%, transparent 30%, transparent 70%, rgba(0, 0, 0, 0.25) 100%)
          `,
          opacity: 1,
        }}
      />

      {/* Content - Redesigned with proper spacing and balanced typography - z-10 ensures it's above background layers */}
      <div className="relative z-10 mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 pt-36 sm:pt-44 md:pt-52 pb-16 lg:pb-24">
        <div className="flex items-center justify-center min-h-[50vh] sm:min-h-[55vh]">
          <div
            className="text-white text-center flex flex-col justify-center items-center max-w-3xl w-full space-y-6"
          >
            {/* Badge / Tag above headline - 100% static for LCP (no animations) */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="font-vazirmatn text-xs sm:text-sm font-medium text-white/90">
                پلتفرم پیشرو در هوش مصنوعی
              </span>
            </div>

            {/* Main Headline - NO animation, renders immediately visible */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              {HERO_TITLE}
            </h1>

            {/* Subtitle - NO animation, renders immediately visible */}
            <p className="max-w-2xl text-white/90 text-base sm:text-lg md:text-xl leading-relaxed font-normal px-4">
              {HERO_SUBTITLE}
            </p>

            {/* Value Props / Trust Badges - Deferred until after LCP to prevent swap */}
            <DeferredTrustBadges />

            {/* Optional CTA Button - 100% static for LCP (hover effects only, no transitions on mount) */}
            <div className="mt-6 sm:mt-8">
              <button
                onClick={() => navigate("/products")}
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl border border-white/20 px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg font-bold text-white cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(30, 103, 198, 0.2) 100%)",
                  boxShadow: "0 8px 32px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 12px 40px rgba(139, 92, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
                }}
              >
                <span className="font-vazirmatn relative z-10">مشاهده محصولات</span>
                <span className="relative z-10">→</span>
                {/* Subtle shine effect on hover only - no transition on mount */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100"
                  style={{
                    background: "linear-gradient(120deg, transparent, rgba(255,255,255,0.1), transparent)"
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

    // BASELINE or EXPERIMENT C: Normal Sanity fetch
    const loadHeroSlide = async () => {
      const sanityStart = performance.now();
      console.log('[LCP INSTRUMENT] Sanity fetch START:', sanityStart, 'ms');

      try {
        const isConfigValid = validateSanityConfig();
        if (!isConfigValid) {
          console.warn('[HOMEPAGE] Sanity not configured, skipping hero fetch');
          return;
        }

        console.log('[HOMEPAGE] 🚀 Fetching hero slide immediately...');
        const heroData = await fetchFromSanity<any>(heroSlideQuery);

        const sanityEnd = performance.now();
        console.log('[LCP INSTRUMENT] Sanity fetch END:', sanityEnd, 'ms', 'Duration:', (sanityEnd - sanityStart).toFixed(2), 'ms');

        if (heroData?.heroSlides?.length) {
          const transformed = transformers.transformHeroSlide(heroData.heroSlides[0]);
          const heroSrcSetTime = performance.now();
          setHeroSlide(transformed);
          console.log('[LCP INSTRUMENT] heroSlide state SET (heroSrcSetTime):', heroSrcSetTime, 'ms', 'Image URL:', transformed.image || 'none');
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

  // Load remaining Sanity data off the critical path (deferred until after initial paint)
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

    // Use requestIdleCallback for better performance, fallback to setTimeout
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      requestIdleCallback(loadSanityData, { timeout: 2000 });
    } else {
      setTimeout(loadSanityData, 100);
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

    // Update robots meta - but ensure homepage always allows indexing
    // Skip if robotsMeta contains "noindex" on homepage to allow crawling
    if (seo.robotsMeta && !seo.robotsMeta.toLowerCase().includes('noindex')) {
      let robots = document.querySelector('meta[name="robots"]');
      if (!robots) {
        robots = document.createElement('meta');
        robots.setAttribute('name', 'robots');
        document.head.appendChild(robots);
      }
      robots.setAttribute('content', seo.robotsMeta);
    } else {
      // Ensure homepage has index, follow if Sanity tries to set noindex
      let robots = document.querySelector('meta[name="robots"]');
      if (!robots) {
        robots = document.createElement('meta');
        robots.setAttribute('name', 'robots');
        document.head.appendChild(robots);
      }
      robots.setAttribute('content', 'index, follow');
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
    const checkHeroImage = () => {
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

      // Keep checking until we have all metrics or timeout
      if (!metrics.heroLoadTime || !metrics.heroVisibleTime) {
        requestAnimationFrame(checkHeroImage);
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

      return () => observer.disconnect();
    } catch (error) {
      console.warn('[LCP INSTRUMENT] PerformanceObserver not supported:', error);
    }
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Header - lightweight, loads immediately */}
      <Header onSearch={handleSearch} megaItems={megaItems} />

      {/* Hero Section - gradient background only, no image */}
      <HeroSection />

      {/* Promo Banner - deferred until after LCP (5s or user interaction) */}
      <LazyPromoBanner />

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
