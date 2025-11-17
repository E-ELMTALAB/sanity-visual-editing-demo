import { useState, lazy, Suspense, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Zap, Shield, Smartphone } from "lucide-react";
import chatgptPlusIcon from "@/assets/chatgpt-plus-icon.png";
import geminiIcon from "@/assets/gemini-icon.png";
import claudeLlmIcon from "@/assets/claude-llm-icon.png";
import perplexityIcon from "@/assets/perplexity-icon.png";
import { SurfaceGlass } from "@/components/ui/surface-glass";
import { SectionHeader } from "@/components/ui/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { Header } from "@/components/Header";
import ImageHero from "@/components/Hero/ImageHero";
import { CategoryTabs } from "@/components/CategoryTabs";
import { SpecialOffers } from "@/components/Products/SpecialOffers";
import { SocialMediaSlider } from "@/components/Products/SocialMediaSlider";
import { EduProductsSlider } from "@/components/Products/EduProductsSlider";
import { BestsellingCourses } from "@/components/Courses/BestsellingCourses";
import { CoursesCarousel } from "@/components/Courses/CoursesCarousel";
import { MagazineFeatured } from "@/components/Magazine/MagazineFeatured";
import { BlogsCarousel } from "@/components/Blog/BlogsCarousel";
import { ChatbotPanel } from "@/components/FloatingDock/ChatbotPanel";
import { SupportPanel } from "@/components/FloatingDock/SupportPanel";

// Code splitting for heavy components
const Footer = lazy(() => import("@/components/Footer/Footer").then((m) => ({ default: m.Footer })));
const FloatingDock = lazy(() =>
  import("@/components/FloatingDock/FloatingDock").then((m) => ({ default: m.FloatingDock })),
);
import { CartDrawer, CartItem } from "@/components/FloatingDock/CartDrawer";
import { CategoryRail } from "@/components/CategoryRail";
import { BestSellers } from "@/components/Products/BestSellers";
import { EditorialBanners } from "@/components/Products/EditorialBanners";
import { TabbedProductGrid } from "@/components/Products/TabbedProductGrid";
import { SocialMediaProductsGrid } from "@/components/Products/SocialMediaProductsGrid";
import { CollectionsBanner } from "@/components/Products/CollectionsBanner";
import { useDirection } from "@/contexts/DirectionContext";
import { toast } from "@/hooks/use-toast";
import headphonesPortrait from "@/assets/headphones-portrait.jpg";
import smartwatchPortrait from "@/assets/smartwatch-portrait.jpg";
import sunglassesPortrait from "@/assets/sunglasses-portrait.jpg";
import instagramBanner from "@/assets/instagram-banner.png";
const springTransition = {
  type: "spring" as const,
  stiffness: 220,
  damping: 28,
};
const Index = () => {
  const { isRTL } = useDirection();
  const navigate = useNavigate();
  const [cartCount] = useState(3);
  const [activeCategory, setActiveCategory] = useState(isRTL ? "همه محصولات" : "All Products");
  const [chatOpen, setChatOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showFooter, setShowFooter] = useState(false);
  const footerTriggerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for Footer - delay rendering until near viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShowFooter(true);
        }
      },
      { rootMargin: "400px" }, // Load 400px before it enters viewport
    );

    if (footerTriggerRef.current) {
      observer.observe(footerTriggerRef.current);
    }

    return () => observer.disconnect();
  }, []);
  const categories = isRTL
    ? ["همه محصولات", "هوش مصنوعی", "سوشیال مدیا", "موسیقی", "آموزشی", "سیمکارت"]
    : ["All Products", "AI", "Social Media", "Music", "Education", "SIM Cards"];
  const handleOpenCart = () => {
    toast({
      title: isRTL ? "سبد خرید" : "Shopping Cart",
      description: isRTL ? "سبد خرید شما باز شد" : "Your cart has been opened",
    });
  };
  const handleSearch = (query: string) => {
    toast({
      title: isRTL ? "جستجو" : "Search",
      description: isRTL ? `جستجو برای: ${query}` : `Searching for: ${query}`,
    });
  };
  const handleOpenProduct = (productId: string) => {
    toast({
      title: isRTL ? "محصول" : "Product",
      description: isRTL ? `محصول ${productId} به سبد اضافه شد` : `Product ${productId} added to cart`,
    });
  };
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    toast({
      title: isRTL ? "دسته‌بندی" : "Category",
      description: isRTL ? `دسته‌بندی به ${category} تغییر کرد` : `Category changed to ${category}`,
    });
  };
  const handleAddToCart = (productId: string) => {
    toast({
      title: isRTL ? "به سبد اضافه شد" : "Added to Cart",
      description: isRTL ? `محصول ${productId} به سبد خرید اضافه شد` : `Product ${productId} added to cart`,
    });
  };
  const handleViewAllOffers = () => {
    toast({
      title: isRTL ? "تخفیفات ویژه" : "Special Offers",
      description: isRTL ? "مشاهده همه تخفیفات" : "View all special offers",
    });
  };
  const handleViewAllSocial = () => {
    toast({
      title: isRTL ? "محصولات سوشیال مدیا" : "Social Media Products",
      description: isRTL ? "مشاهده همه محصولات سوشیال مدیا" : "View all social media products",
    });
  };

  const handleCollectionsBanner = () => {
    toast({
      title: isRTL ? "کلکسیون‌های سوشیال مدیا" : "Social Media Collections",
      description: isRTL ? "مشاهده همه کلکسیون‌ها" : "View all collections",
    });
  };
  const handleViewAllEdu = () => {
    toast({
      title: isRTL ? "محصولات آموزشی" : "Educational Products",
      description: isRTL ? "مشاهده همه محصولات آموزشی" : "View all educational products",
    });
  };
  const handleViewAllCourses = () => {
    toast({
      title: isRTL ? "دوره‌ها" : "Courses",
      description: isRTL ? "مشاهده همه دوره‌ها" : "View all courses",
    });
  };
  const handleViewCourse = (courseId: string) => {
    toast({
      title: isRTL ? "مشاهده دوره" : "View Course",
      description: isRTL ? `مشاهده جزئیات دوره ${courseId}` : `Viewing course details ${courseId}`,
    });
  };
  const handleReadPost = (slug: string) => {
    toast({
      title: isRTL ? "مقاله" : "Article",
      description: isRTL ? `خواندن مقاله: ${slug}` : `Reading article: ${slug}`,
    });
  };
  const handleViewMagazine = () => {
    toast({
      title: isRTL ? "مجله" : "Magazine",
      description: isRTL ? "مشاهده همه مقالات مجله" : "View all magazine articles",
    });
  };

  const features = [
    {
      icon: Sparkles,
      title: isRTL ? "طراحی زیبا" : "Beautiful Design",
      description: isRTL
        ? "رابط کاربری شیشه‌ای و مدرن با الهام از iOS"
        : "Glass-inspired modern UI with iOS aesthetics",
    },
    {
      icon: Zap,
      title: isRTL ? "عملکرد سریع" : "Lightning Fast",
      description: isRTL ? "انیمیشن‌های روان با Framer Motion" : "Smooth animations powered by Framer Motion",
    },
    {
      icon: Shield,
      title: isRTL ? "دسترسی‌پذیر" : "Accessible",
      description: isRTL ? "استانداردهای WCAG AA و کنتراست عالی" : "WCAG AA compliant with excellent contrast",
    },
    {
      icon: Smartphone,
      title: isRTL ? "واکنش‌گرا" : "Responsive",
      description: isRTL ? "طراحی کاملا موبایل محور" : "Fully mobile-first design approach",
    },
  ];
  const products = [
    {
      id: 1,
      name: isRTL ? "محصول پرفروش" : "Best Seller",
      badge: "sale" as const,
      oldPrice: 500000,
      currentPrice: 350000,
    },
    {
      id: 2,
      name: isRTL ? "محصول جدید" : "New Arrival",
      badge: "new" as const,
      currentPrice: 420000,
    },
    {
      id: 3,
      name: isRTL ? "محصول محبوب" : "Hot Item",
      badge: "hot" as const,
      oldPrice: 380000,
      currentPrice: 299000,
    },
  ];
  const specialOfferProducts = [
    {
      id: "offer-1",
      title: isRTL ? "هدفون بی‌سیم پریمیوم با نویزکنسلینگ" : "Premium Wireless Headphones with ANC",
      image: headphonesPortrait,
      oldPrice: 3200000,
      price: 2240000,
      discountPct: 30,
    },
    {
      id: "offer-2",
      title: isRTL ? "ساعت هوشمند نسل پنجم با GPS" : "Smart Watch Gen 5 with GPS",
      image: smartwatchPortrait,
      oldPrice: 4500000,
      price: 2700000,
      discountPct: 40,
    },
    {
      id: "offer-3",
      title: isRTL ? "عینک آفتابی UV400 کلاسیک" : "Classic UV400 Sunglasses",
      image: sunglassesPortrait,
      oldPrice: 950000,
      price: 665000,
      discountPct: 30,
    },
    {
      id: "offer-4",
      title: isRTL ? "کیف چرم طبیعی دست‌دوز" : "Handcrafted Leather Bag",
      image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop",
      oldPrice: 2800000,
      price: 1680000,
      discountPct: 40,
    },
    {
      id: "offer-5",
      title: isRTL ? "کفش اسپرت مردانه حرفه‌ای" : "Professional Men's Sneakers",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop",
      oldPrice: 1800000,
      price: 1260000,
      discountPct: 30,
    },
    {
      id: "offer-6",
      title: isRTL ? "عطر مردانه لوکس فرانسوی" : "Luxury French Men's Perfume",
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=600&fit=crop",
      oldPrice: 2500000,
      price: 1500000,
      discountPct: 40,
    },
    {
      id: "offer-7",
      title: isRTL ? "کوله‌پشتی لپ‌تاپ ضدآب" : "Waterproof Laptop Backpack",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop",
      oldPrice: 1200000,
      price: 840000,
      discountPct: 30,
    },
    {
      id: "offer-8",
      title: isRTL ? "دوربین دیجیتال بدون آینه 24MP" : "24MP Mirrorless Digital Camera",
      image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&h=600&fit=crop",
      oldPrice: 18000000,
      price: 12600000,
      discountPct: 30,
    },
  ];
  const socialMediaProducts = [
    {
      id: "social-1",
      platform: "Instagram" as const,
      title: isRTL ? "بسته ۱۰۰۰ فالوور واقعی اینستاگرام" : "1000 Real Instagram Followers Package",
      image: geminiIcon,
      price: 850000,
      rating: 5,
    },
    {
      id: "social-2",
      platform: "TikTok" as const,
      title: isRTL ? "افزایش ۵۰۰۰ بازدید تیک‌تاک" : "5000 TikTok Views Boost",
      image: "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=600&h=600&fit=crop",
      price: 450000,
      rating: 4,
    },
    {
      id: "social-3",
      platform: "Telegram" as const,
      title: isRTL ? "۲۰۰۰ ممبر تلگرام با گارانتی" : "2000 Telegram Members Guaranteed",
      image: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=600&h=600&fit=crop",
      price: 1200000,
      rating: 5,
    },
    {
      id: "social-4",
      platform: "X" as const,
      title: isRTL ? "۱۵۰۰ فالوور توییتر (X) واقعی" : "1500 Real Twitter (X) Followers",
      image: "https://images.unsplash.com/photo-1611605698323-b1e99cfd37ea?w=600&h=600&fit=crop",
      price: 980000,
      rating: 4,
    },
    {
      id: "social-5",
      platform: "Instagram" as const,
      title: isRTL ? "افزایش ۱۰۰۰۰ لایک پست اینستاگرام" : "10000 Instagram Post Likes",
      image: "https://images.unsplash.com/photo-1598618588450-17f8552d3b96?w=600&h=600&fit=crop",
      price: 650000,
      rating: 5,
    },
    {
      id: "social-6",
      platform: "TikTok" as const,
      title: isRTL ? "بسته رشد تیک‌تاک - ۲۰۰۰ فالوور" : "TikTok Growth Package - 2000 Followers",
      image: "https://images.unsplash.com/photo-1635514569146-9a9607ecf303?w=600&h=600&fit=crop",
      price: 1350000,
      rating: 5,
    },
    {
      id: "social-7",
      platform: "Telegram" as const,
      title: isRTL ? "افزایش بازدید پست تلگرام - ۵۰۰۰" : "Telegram Post Views - 5000",
      image: "https://images.unsplash.com/photo-1614680376408-81e91ffe3db7?w=600&h=600&fit=crop",
      price: 380000,
      rating: 4,
    },
    {
      id: "social-8",
      platform: "X" as const,
      title: isRTL ? "بازنشر توییت - ۱۰۰۰ ریتوییت" : "Tweet Retweet - 1000 Retweets",
      image: "https://images.unsplash.com/photo-1611605698290-a8b0e1b94723?w=600&h=600&fit=crop",
      price: 720000,
      rating: 5,
    },
  ];
  const eduProducts = [
    {
      id: "edu-1",
      provider: "Coursera" as const,
      title: isRTL ? "اشتراک ۶ ماهه Coursera Plus" : "Coursera Plus 6-Month Subscription",
      image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&h=600&fit=crop",
      price: 4500000,
      duration: isRTL ? "۶ ماه" : "6 Months",
    },
    {
      id: "edu-2",
      provider: "Udemy" as const,
      title: isRTL ? "بسته ۵ دوره پرفروش یودمی" : "Udemy 5 Best-Selling Courses Bundle",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=600&fit=crop",
      price: 2800000,
      duration: isRTL ? "دسترسی مادام‌العمر" : "Lifetime Access",
    },
    {
      id: "edu-3",
      provider: "YouTube Premium" as const,
      title: isRTL ? "یوتیوب پریمیوم - ۱۲ ماهه" : "YouTube Premium - 12 Months",
      image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600&h=600&fit=crop",
      price: 1950000,
      duration: isRTL ? "۱ سال" : "1 Year",
    },
    {
      id: "edu-4",
      provider: "Skillshare" as const,
      title: isRTL ? "اشتراک سالانه Skillshare Premium" : "Skillshare Premium Annual Subscription",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=600&fit=crop",
      price: 3200000,
      duration: isRTL ? "۱ سال" : "1 Year",
    },
    {
      id: "edu-5",
      provider: "Coursera" as const,
      title: isRTL ? "دوره تخصصی علم داده - ۳ ماهه" : "Data Science Specialization - 3 Months",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=600&fit=crop",
      price: 2400000,
      duration: isRTL ? "۳ ماه" : "3 Months",
    },
    {
      id: "edu-6",
      provider: "Udemy" as const,
      title: isRTL ? "دوره جامع برنامه‌نویسی فول‌استک" : "Complete Full-Stack Programming Course",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=600&fit=crop",
      price: 980000,
      duration: isRTL ? "دسترسی مادام‌العمر" : "Lifetime Access",
    },
    {
      id: "edu-7",
      provider: "YouTube Premium" as const,
      title: isRTL ? "یوتیوب پریمیوم خانوادگی - ۶ ماه" : "YouTube Premium Family - 6 Months",
      image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&h=600&fit=crop",
      price: 2700000,
      duration: isRTL ? "۶ ماه" : "6 Months",
    },
    {
      id: "edu-8",
      provider: "Skillshare" as const,
      title: isRTL ? "بسته طراحی گرافیک و UI/UX" : "Graphic Design & UI/UX Bundle",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=600&fit=crop",
      price: 1800000,
      duration: isRTL ? "۶ ماه" : "6 Months",
    },
  ];
  const courses = [
    {
      id: "course-1",
      title: isRTL
        ? "دوره جامع React و Next.js - از مقدماتی تا پیشرفته"
        : "Complete React & Next.js - Beginner to Advanced",
      instructor: {
        name: isRTL ? "محمد احمدی" : "Mohammad Ahmadi",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
      },
      rating: 4.9,
      hours: 48,
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop",
      price: 3200000,
    },
    {
      id: "course-2",
      title: isRTL ? "آموزش Python برای علم داده و یادگیری ماشین" : "Python for Data Science & Machine Learning",
      instructor: {
        name: isRTL ? "سارا کریمی" : "Sara Karimi",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
      },
      rating: 4.8,
      hours: 62,
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=450&fit=crop",
      price: 4500000,
    },
    {
      id: "course-3",
      title: isRTL ? "دوره جامع UI/UX Design با Figma" : "Complete UI/UX Design with Figma",
      instructor: {
        name: isRTL ? "علی رضایی" : "Ali Rezaei",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
      },
      rating: 4.7,
      hours: 35,
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=450&fit=crop",
      price: 2800000,
    },
    {
      id: "course-4",
      title: isRTL ? "آموزش DevOps و Docker برای توسعه‌دهندگان" : "DevOps & Docker for Developers",
      instructor: {
        name: isRTL ? "رضا محمدی" : "Reza Mohammadi",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
      },
      rating: 4.6,
      hours: 28,
      image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=450&fit=crop",
      price: 2400000,
    },
    {
      id: "course-5",
      title: isRTL ? "مسیر کامل توسعه موبایل با React Native" : "Complete Mobile Development with React Native",
      instructor: {
        name: isRTL ? "مریم حسینی" : "Maryam Hosseini",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
      },
      rating: 4.9,
      hours: 54,
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=450&fit=crop",
      price: 3800000,
    },
    {
      id: "course-6",
      title: isRTL ? "دوره جامع TypeScript - از صفر تا صد" : "Complete TypeScript - Zero to Hero",
      instructor: {
        name: isRTL ? "امیر نوری" : "Amir Nouri",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
      },
      rating: 4.8,
      hours: 32,
      image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&h=450&fit=crop",
      price: 2200000,
    },
  ];
  const bestSellerProducts = [
    {
      id: "best-1",
      title: isRTL ? "اشتراک ChatGPT Plus - ۱ ماهه" : "ChatGPT Plus Subscription - 1 Month",
      image: chatgptPlusIcon,
      oldPrice: 450000,
      price: 380000,
      badge: "پرفروش",
    },
    {
      id: "best-2",
      title: isRTL ? "بسته ۱۰۰۰ فالوور اینستاگرام" : "1000 Instagram Followers Package",
      image: geminiIcon,
      price: 850000,
      badge: "پرفروش",
    },
    {
      id: "best-3",
      title: isRTL ? "Spotify Premium - ۳ ماهه" : "Spotify Premium - 3 Months",
      image: claudeLlmIcon,
      oldPrice: 720000,
      price: 580000,
      badge: "پرفروش",
    },
    {
      id: "best-4",
      title: isRTL ? "دوره کامل React - ۴۸ ساعت" : "Complete React Course - 48 Hours",
      image: perplexityIcon,
      price: 3200000,
      badge: "پرفروش",
    },
    {
      id: "best-5",
      title: isRTL ? "سیم‌کارت فعال اینترنت نامحدود" : "Active SIM Card Unlimited Internet",
      image: "https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=600&h=600&fit=crop",
      oldPrice: 1200000,
      price: 950000,
      badge: "پرفروش",
    },
    {
      id: "best-6",
      title: isRTL ? "Canva Pro - ۶ ماهه" : "Canva Pro - 6 Months",
      image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&h=600&fit=crop",
      price: 680000,
      badge: "پرفروش",
    },
    {
      id: "best-7",
      title: isRTL ? "Netflix Premium UHD - ۱ ماه" : "Netflix Premium UHD - 1 Month",
      image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=600&h=600&fit=crop",
      oldPrice: 550000,
      price: 420000,
      badge: "پرفروش",
    },
    {
      id: "best-8",
      title: isRTL ? "Adobe Creative Cloud - ۱ ماه" : "Adobe Creative Cloud - 1 Month",
      image: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=600&h=600&fit=crop",
      price: 2100000,
      badge: "پرفروش",
    },
  ];

  const editorialBanners = [
    {
      id: "banner-1",
      title: isRTL ? "ابزارهای هوش مصنوعی" : "AI Tools",
      subtitle: isRTL
        ? "دسترسی به قدرتمندترین ابزارهای هوش مصنوعی با قیمت مناسب و پشتیبانی ۲۴/۷"
        : "Access the most powerful AI tools with affordable pricing and 24/7 support",
      ctaText: isRTL ? "کشف بیشتر →" : "Discover More →",
      backgroundImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop",
      onClick: () => toast({ title: isRTL ? "ابزارهای هوش مصنوعی" : "AI Tools" }),
    },
    {
      id: "banner-2",
      title: isRTL ? "کلکسیون اینستاگرام" : "Instagram Collection",
      subtitle: isRTL
        ? "اکانت‌ها و سرویس‌های پرفروش اینستاگرام با تضمین کیفیت"
        : "Top Instagram accounts and services with quality guarantee",
      ctaText: isRTL ? "مشاهده کلکسیون →" : "View Collection →",
      backgroundImage: instagramBanner,
      onClick: () => navigate("/collections/instagram"),
    },
    {
      id: "banner-3",
      title: isRTL ? "دوره‌های آموزشی برتر" : "Premium Learning Courses",
      subtitle: isRTL
        ? "یادگیری از بهترین‌ها با دوره‌های حرفه‌ای و گواهی معتبر"
        : "Learn from the best with professional courses and valid certificates",
      ctaText: isRTL ? "کشف بیشتر →" : "Discover More →",
      backgroundImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=600&fit=crop",
      onClick: () => toast({ title: isRTL ? "دوره‌های آموزشی" : "Courses" }),
    },
  ];

  const tabbedProducts = [
    // AI Tools
    {
      id: "tab-ai-1",
      title: isRTL ? "ChatGPT Plus - ۱ ماهه" : "ChatGPT Plus - 1 Month",
      image: chatgptPlusIcon,
      oldPrice: 450000,
      price: 380000,
      category: "ai",
    },
    {
      id: "tab-ai-2",
      title: isRTL ? "Midjourney Pro - ۱ ماه" : "Midjourney Pro - 1 Month",
      image: "https://images.unsplash.com/photo-1686191128892-c15d90c48eb6?w=600&h=600&fit=crop",
      price: 920000,
      category: "ai",
      discountPct: 15,
    },
    {
      id: "tab-ai-3",
      title: isRTL ? "Claude Pro - ۱ ماهه" : "Claude Pro - 1 Month",
      image: "https://images.unsplash.com/photo-1676277791608-eee36a64d32d?w=600&h=600&fit=crop",
      price: 650000,
      category: "ai",
    },
    {
      id: "tab-ai-4",
      title: isRTL ? "Perplexity Pro - ۳ ماهه" : "Perplexity Pro - 3 Months",
      image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=600&h=600&fit=crop",
      oldPrice: 850000,
      price: 720000,
      category: "ai",
    },
    {
      id: "tab-ai-5",
      title: isRTL ? "Jasper AI - ۱ ماهه" : "Jasper AI - 1 Month",
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&h=600&fit=crop",
      price: 1200000,
      category: "ai",
      discountPct: 20,
    },
    {
      id: "tab-ai-6",
      title: isRTL ? "Copy.ai Pro - ۳ ماه" : "Copy.ai Pro - 3 Months",
      image: "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=600&h=600&fit=crop",
      price: 980000,
      category: "ai",
    },
    {
      id: "tab-ai-7",
      title: isRTL ? "Synthesia AI Video - ۱ ماه" : "Synthesia AI Video - 1 Month",
      image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&h=600&fit=crop",
      oldPrice: 2800000,
      price: 2100000,
      category: "ai",
    },
    {
      id: "tab-ai-8",
      title: isRTL ? "Runway ML Pro - ۱ ماه" : "Runway ML Pro - 1 Month",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=600&fit=crop",
      price: 1850000,
      category: "ai",
    },
    // Social Media
    {
      id: "tab-social-1",
      title: isRTL ? "۱۰۰۰ فالوور اینستاگرام" : "1000 Instagram Followers",
      image: geminiIcon,
      price: 850000,
      category: "social",
    },
    {
      id: "tab-social-2",
      title: isRTL ? "۵۰۰۰ بازدید تیک‌تاک" : "5000 TikTok Views",
      image: "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=600&h=600&fit=crop",
      price: 450000,
      category: "social",
      discountPct: 25,
    },
    {
      id: "tab-social-3",
      title: isRTL ? "۲۰۰۰ ممبر تلگرام" : "2000 Telegram Members",
      image: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=600&h=600&fit=crop",
      price: 1200000,
      category: "social",
    },
    {
      id: "tab-social-4",
      title: isRTL ? "۱۵۰۰ فالوور توییتر" : "1500 Twitter Followers",
      image: "https://images.unsplash.com/photo-1611605698323-b1e99cfd37ea?w=600&h=600&fit=crop",
      oldPrice: 1100000,
      price: 980000,
      category: "social",
    },
    {
      id: "tab-social-5",
      title: isRTL ? "۱۰۰۰۰ لایک اینستاگرام" : "10000 Instagram Likes",
      image: "https://images.unsplash.com/photo-1598618588450-17f8552d3b96?w=600&h=600&fit=crop",
      price: 650000,
      category: "social",
    },
    {
      id: "tab-social-6",
      title: isRTL ? "۲۰۰۰ فالوور تیک‌تاک" : "2000 TikTok Followers",
      image: "https://images.unsplash.com/photo-1635514569146-9a9607ecf303?w=600&h=600&fit=crop",
      price: 1350000,
      category: "social",
      discountPct: 30,
    },
    {
      id: "tab-social-7",
      title: isRTL ? "۵۰۰۰ بازدید پست تلگرام" : "5000 Telegram Post Views",
      image: "https://images.unsplash.com/photo-1614680376408-81e91ffe3db7?w=600&h=600&fit=crop",
      price: 380000,
      category: "social",
    },
    {
      id: "tab-social-8",
      title: isRTL ? "۱۰۰۰ ریتوییت" : "1000 Retweets",
      image: "https://images.unsplash.com/photo-1611605698290-a8b0e1b94723?w=600&h=600&fit=crop",
      price: 720000,
      category: "social",
    },
    // Music
    {
      id: "tab-music-1",
      title: isRTL ? "Spotify Premium - ۳ ماه" : "Spotify Premium - 3 Months",
      image: claudeLlmIcon,
      oldPrice: 720000,
      price: 580000,
      category: "music",
    },
    {
      id: "tab-music-2",
      title: isRTL ? "Apple Music - ۶ ماه" : "Apple Music - 6 Months",
      image: "https://images.unsplash.com/photo-1528143358888-6d3c7f67bd5d?w=600&h=600&fit=crop",
      price: 950000,
      category: "music",
      discountPct: 15,
    },
    {
      id: "tab-music-3",
      title: isRTL ? "YouTube Music Premium - ۱ سال" : "YouTube Music Premium - 1 Year",
      image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600&h=600&fit=crop",
      price: 1800000,
      category: "music",
    },
    {
      id: "tab-music-4",
      title: isRTL ? "Tidal HiFi - ۳ ماه" : "Tidal HiFi - 3 Months",
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=600&fit=crop",
      price: 1200000,
      category: "music",
    },
    {
      id: "tab-music-5",
      title: isRTL ? "Deezer Premium - ۶ ماه" : "Deezer Premium - 6 Months",
      image: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=600&h=600&fit=crop",
      oldPrice: 850000,
      price: 720000,
      category: "music",
    },
    {
      id: "tab-music-6",
      title: isRTL ? "SoundCloud Go+ - ۱ سال" : "SoundCloud Go+ - 1 Year",
      image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&h=600&fit=crop",
      price: 1450000,
      category: "music",
    },
    {
      id: "tab-music-7",
      title: isRTL ? "Pandora Premium - ۶ ماه" : "Pandora Premium - 6 Months",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=600&fit=crop",
      price: 980000,
      category: "music",
      discountPct: 20,
    },
    {
      id: "tab-music-8",
      title: isRTL ? "Amazon Music Unlimited - ۳ ماه" : "Amazon Music Unlimited - 3 Months",
      image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&h=600&fit=crop",
      price: 680000,
      category: "music",
    },
    // Education
    {
      id: "tab-edu-1",
      title: isRTL ? "دوره React - ۴۸ ساعت" : "React Course - 48 Hours",
      image: perplexityIcon,
      price: 3200000,
      category: "edu",
    },
    {
      id: "tab-edu-2",
      title: isRTL ? "Coursera Plus - ۶ ماه" : "Coursera Plus - 6 Months",
      image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&h=600&fit=crop",
      oldPrice: 4800000,
      price: 4200000,
      category: "edu",
    },
    {
      id: "tab-edu-3",
      title: isRTL ? "Udemy Business - ۱ سال" : "Udemy Business - 1 Year",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=600&fit=crop",
      price: 2800000,
      category: "edu",
      discountPct: 25,
    },
    {
      id: "tab-edu-4",
      title: isRTL ? "Skillshare Premium - ۱ سال" : "Skillshare Premium - 1 Year",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=600&fit=crop",
      price: 3200000,
      category: "edu",
    },
    {
      id: "tab-edu-5",
      title: isRTL ? "LinkedIn Learning - ۱ سال" : "LinkedIn Learning - 1 Year",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=600&fit=crop",
      price: 3800000,
      category: "edu",
    },
    {
      id: "tab-edu-6",
      title: isRTL ? "دوره Python - ۶۲ ساعت" : "Python Course - 62 Hours",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=600&fit=crop",
      oldPrice: 5000000,
      price: 4200000,
      category: "edu",
    },
    {
      id: "tab-edu-7",
      title: isRTL ? "MasterClass - ۱ سال" : "MasterClass - 1 Year",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=600&fit=crop",
      price: 5500000,
      category: "edu",
      discountPct: 30,
    },
    {
      id: "tab-edu-8",
      title: isRTL ? "دوره UI/UX با Figma" : "UI/UX Design with Figma",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=600&fit=crop",
      price: 2700000,
      category: "edu",
    },
    // SIM Cards
    {
      id: "tab-sim-1",
      title: isRTL ? "سیم‌کارت نامحدود ماهانه" : "Unlimited Monthly SIM",
      image: "https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=600&h=600&fit=crop",
      oldPrice: 1200000,
      price: 950000,
      category: "sim",
    },
    {
      id: "tab-sim-2",
      title: isRTL ? "بسته اینترنت ۱۰۰ گیگ" : "100GB Internet Package",
      image: "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?w=600&h=600&fit=crop",
      price: 580000,
      category: "sim",
      discountPct: 15,
    },
    {
      id: "tab-sim-3",
      title: isRTL ? "سیم‌کارت رومینگ اروپا" : "Europe Roaming SIM",
      image: "https://images.unsplash.com/photo-1606166679961-8763724c8133?w=600&h=600&fit=crop",
      price: 2800000,
      category: "sim",
    },
    {
      id: "tab-sim-4",
      title: isRTL ? "بسته صوتی نامحدود" : "Unlimited Voice Package",
      image: "https://images.unsplash.com/photo-1591696331111-ef9586a5b17a?w=600&h=600&fit=crop",
      price: 420000,
      category: "sim",
    },
    {
      id: "tab-sim-5",
      title: isRTL ? "سیم‌کارت آمریکا و کانادا" : "USA & Canada SIM",
      image: "https://images.unsplash.com/photo-1607988795691-3d0147b43231?w=600&h=600&fit=crop",
      oldPrice: 3500000,
      price: 2900000,
      category: "sim",
    },
    {
      id: "tab-sim-6",
      title: isRTL ? "بسته اینترنت ۲۰۰ گیگ" : "200GB Internet Package",
      image: "https://images.unsplash.com/photo-1589254065878-42c9da997008?w=600&h=600&fit=crop",
      price: 980000,
      category: "sim",
      discountPct: 20,
    },
    {
      id: "tab-sim-7",
      title: isRTL ? "سیم‌کارت جهانی" : "Global SIM Card",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=600&fit=crop",
      price: 4200000,
      category: "sim",
    },
    {
      id: "tab-sim-8",
      title: isRTL ? "بسته VIP اینترنت + صوت" : "VIP Internet + Voice Package",
      image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&h=600&fit=crop",
      price: 1650000,
      category: "sim",
    },
  ];

  const magazinePosts = [
    {
      _id: "post-1",
      slug: "future-of-ai-in-ecommerce",
      title: isRTL ? "آینده هوش مصنوعی در تجارت الکترونیک" : "The Future of AI in E-Commerce",
      excerpt: isRTL
        ? "هوش مصنوعی در حال تغییر چهره تجارت الکترونیک است. از پیش‌بینی رفتار مشتریان تا شخصی‌سازی تجربه خرید، AI ابزاری قدرتمند برای کسب‌وکارها است."
        : "AI is transforming e-commerce. From predicting customer behavior to personalizing shopping experiences, AI is a powerful tool for businesses.",
      readTime: 8,
      image: {
        asset: {
          url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop",
        },
      },
      category: "ai-tools",
      publishedAt: "2024-01-15",
    },
    {
      _id: "post-2",
      slug: "social-media-marketing-2024",
      title: isRTL ? "استراتژی‌های بازاریابی شبکه‌های اجتماعی در ۲۰۲۴" : "Social Media Marketing Strategies for 2024",
      excerpt: isRTL
        ? "بازاریابی در شبکه‌های اجتماعی به سرعت در حال تکامل است. در این مقاله به بررسی جدیدترین استراتژی‌ها و روندهای موثر برای افزایش فروش می‌پردازیم."
        : "Social media marketing is rapidly evolving. In this article, we explore the latest strategies and trends for boosting sales.",
      readTime: 6,
      image: {
        asset: {
          url: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&h=450&fit=crop",
        },
      },
      category: "tutorials",
      publishedAt: "2024-01-10",
    },
    {
      _id: "post-3",
      slug: "building-online-courses",
      title: isRTL ? "راهنمای ساخت دوره‌های آنلاین موفق" : "Guide to Building Successful Online Courses",
      excerpt: isRTL
        ? "ایجاد یک دوره آنلاین موفق نیازمند برنامه‌ریزی دقیق است. از انتخاب موضوع مناسب تا طراحی محتوای جذاب، همه چیز را در این راهنما یاد بگیرید."
        : "Creating a successful online course requires careful planning. From choosing the right topic to designing engaging content, learn it all in this guide.",
      readTime: 10,
      image: {
        asset: {
          url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=450&fit=crop",
        },
      },
      category: "tutorials",
      publishedAt: "2024-01-05",
    },
  ];
  const megaItems = {
    cols: [
      {
        title: "AI Business Solutions",
        titleFa: "راهکارهای هوش مصنوعی کسب‌وکار",
        links: [
          {
            label: "Project Management",
            labelFa: "مدیریت پروژه",
            href: "/products?cat=project-management",
          },
          {
            label: "Data Analysis",
            labelFa: "تحلیل داده",
            href: "/products?cat=data-analysis",
          },
          {
            label: "Automation",
            labelFa: "اتوماسیون",
            href: "/products?cat=automation",
          },
        ],
      },
      {
        title: "Creative & Technical",
        titleFa: "خلاقیت و فناوری",
        links: [
          {
            label: "Content Generation",
            labelFa: "تولید محتوا",
            href: "/products?cat=content",
          },
          {
            label: "Video Production",
            labelFa: "تولید ویدیو",
            href: "/products?cat=video",
          },
          {
            label: "Graphic Design AI",
            labelFa: "گرافیک با AI",
            href: "/products?cat=graphic",
          },
        ],
      },
    ],
    featured: {
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&auto=format&fit=crop",
      title: "Master ChatGPT: Advanced Techniques Course",
      titleFa: "دوره پیشرفته ChatGPT: تکنیک‌های حرفه‌ای",
      href: "/products/p1",
      badge: "Featured",
      badgeFa: "پیشنهاد ویژه",
    },
  };
  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <Header onSearch={handleSearch} megaItems={megaItems} />

      {/* Hero Section */}
      <ImageHero />

      {/* Category Rail */}
      <CategoryRail />

      {/* Best Sellers Section */}
      <BestSellers products={bestSellerProducts} onAdd={handleAddToCart} />

      {/* Editorial Banners Section */}
      <EditorialBanners banners={editorialBanners} />

      {/* Tabbed Product Grid Section */}
      <TabbedProductGrid
        products={tabbedProducts}
        onAdd={handleAddToCart}
        onViewAll={(category) => {
          toast({
            title: isRTL ? "مشاهده همه" : "View All",
            description: isRTL ? `مشاهده تمام محصولات ${category}` : `Viewing all ${category} products`,
          });
        }}
      />

      {/* Social Media Products Grid */}
      <SocialMediaProductsGrid
        products={socialMediaProducts.map((item) => ({
          id: item.id,
          title: item.title,
          image: item.image,
          price: item.price,
        }))}
        onAdd={handleAddToCart}
        onViewAll={handleViewAllSocial}
        className="mx-[10px]"
      />

      {/* Collections Banner */}
      <CollectionsBanner onClick={handleCollectionsBanner} className="mx-[10px]" />

      {/* Courses Carousel */}
      <CoursesCarousel
        courses={courses}
        onAdd={handleAddToCart}
        onView={handleViewCourse}
        onViewAll={handleViewAllCourses}
        className="mx-[10px]"
      />

      {/* Blogs Carousel */}
      <BlogsCarousel
        posts={magazinePosts}
        onRead={handleReadPost}
        onViewAll={handleViewMagazine}
        className="mx-[10px]"
      />

      {/* Footer Trigger Point */}
      <div ref={footerTriggerRef} className="h-px" />

      {/* Footer - Only render when near viewport */}
      {showFooter && (
        <Suspense fallback={<div className="h-20" />}>
          <Footer
            links={{
              products: "/products",
              magazine: "/magazine",
              courses: "/courses",
              pricing: "/pricing",
              support: "/support",
            }}
            socials={[
              {
                type: "Telegram",
                href: "https://t.me/sharifgpt",
              },
              {
                type: "Instagram",
                href: "https://instagram.com/sharifgpt",
              },
              {
                type: "X",
                href: "https://x.com/sharifgpt",
              },
              {
                type: "YouTube",
                href: "https://youtube.com/@sharifgpt",
              },
            ]}
          />
        </Suspense>
      )}

      {/* Floating UI */}
      <Suspense fallback={null}>
        <FloatingDock
          onOpenChat={() => setChatOpen(true)}
          onOpenSupport={() => setSupportOpen(true)}
          onOpenCart={() => setCartOpen(true)}
          cartItemCount={cartItems.reduce((sum, item) => sum + item.qty, 0)}
        />
      </Suspense>

      <ChatbotPanel open={chatOpen} onClose={() => setChatOpen(false)} />

      <SupportPanel open={supportOpen} onClose={() => setSupportOpen(false)} />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQty={(id, qty) => {
          setCartItems((items) =>
            items.map((item) =>
              item.id === id
                ? {
                    ...item,
                    qty,
                  }
                : item,
            ),
          );
        }}
        onRemoveItem={(id) => {
          setCartItems((items) => items.filter((item) => item.id !== id));
          toast({
            title: isRTL ? "محصول حذف شد" : "Item Removed",
            description: isRTL ? "محصول از سبد خرید شما حذف شد." : "Item removed from cart.",
          });
        }}
        onCheckout={() => {
          toast({
            title: isRTL ? "در حال انتقال به صفحه پرداخت" : "Redirecting to Checkout",
            description: isRTL ? "لطفاً منتظر بمانید..." : "Please wait...",
          });
        }}
      />
    </div>
  );
};
export default Index;
