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
// Sanity imports
import { fetchFromSanity } from "@/lib/sanity.client";
import { validateSanityConfig } from "@/lib/sanity.config";
import { homePageQuery, featuredProductsQuery, featuredCoursesQuery, featuredPostsQuery, productsByCategoryQuery } from "@/lib/sanity.queries";
import { fetchProductPrices, type ProductPrices } from "@/lib/medusa-prices";
import {
  transformHeroSlide,
  transformBestSellerProduct,
  transformEditorialBanner,
  transformSpecialOfferProduct,
  transformSocialMediaProduct,
  transformEducationalProduct,
  transformCourse,
  transformBlogPost,
  transformTabbedProduct,
  transformCollectionsBanner,
} from "@/lib/sanity.transformers";

// Code splitting for heavy components
const Footer = lazy(() => import("@/components/Footer/Footer").then((m) => ({ default: m.Footer })));
const FloatingDock = lazy(() =>
  import("@/components/FloatingDock/FloatingDock").then((m) => ({ default: m.FloatingDock })),
);
import { CartDrawer } from "@/components/FloatingDock/CartDrawer";
import { BestSellers } from "@/components/Products/BestSellers";
import { EditorialBanners } from "@/components/Products/EditorialBanners";
import { TabbedProductGrid } from "@/components/Products/TabbedProductGrid";
import { SocialMediaProductsGrid } from "@/components/Products/SocialMediaProductsGrid";
import { CollectionsBanner } from "@/components/Products/CollectionsBanner";
import { useDirection } from "@/contexts/DirectionContext";
import { useCart } from "@/contexts/cart-context";
import { toast } from "@/hooks/use-toast";
import EnhancedMarkdownRenderer from "@/components/EnhancedMarkdownRenderer";
import { SurfaceGlass } from "@/components/ui/surface-glass";
import { Users, Award, Shield, CheckCircle } from "lucide-react";
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
  const [showFooter, setShowFooter] = useState(false);
  const { state: cartState } = useCart();
  const footerTriggerRef = useRef<HTMLDivElement>(null);
  
  // Sanity data state
  const [isLoading, setIsLoading] = useState(true);
  const [heroSlide, setHeroSlide] = useState<any>(null);
  const [bestSellerProducts, setBestSellerProducts] = useState<any[]>([]);
  const [editorialBanners, setEditorialBanners] = useState<any[]>([]);
  const [specialOfferProducts, setSpecialOfferProducts] = useState<any[]>([]);
  const [socialMediaProducts, setSocialMediaProducts] = useState<any[]>([]);
  const [eduProducts, setEduProducts] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [magazinePosts, setMagazinePosts] = useState<any[]>([]);
  const [productPrices, setProductPrices] = useState<Record<string, ProductPrices>>({});
  const [tabbedProducts, setTabbedProducts] = useState<any[]>([]);
  const [collectionsBanner, setCollectionsBanner] = useState<any>(null);
  const [seoContent, setSeoContent] = useState<string | null>(null);
  const [seoContentLoaded, setSeoContentLoaded] = useState(false);

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

  // Fetch data from Sanity
  useEffect(() => {
    const isConfigValid = validateSanityConfig();
    
    if (!isConfigValid) {
      console.warn('[HOMEPAGE] Sanity not configured, using fallback data');
      setIsLoading(false);
      return;
    }

    // Note: Visual editing detection is handled in sanity.client.ts

    async function loadHomepageData() {
      try {
        setIsLoading(true);
        setSeoContentLoaded(false);

        const categoryMap: Record<string, string> = {
          ai: "ai",
          social: "social-media",
          music: "music",
          edu: "education",
          sim: "sim-card",
        };

        const [
          homeData,
          featuredProductsData,
          featuredCoursesData,
          featuredPostsData,
          tabbedProductGroups,
        ] = await Promise.all([
          fetchFromSanity<any>(homePageQuery),
          fetchFromSanity<any[]>(featuredProductsQuery),
          fetchFromSanity<any[]>(featuredCoursesQuery),
          fetchFromSanity<any[]>(featuredPostsQuery),
          Promise.all(
            Object.entries(categoryMap).map(async ([key, category]) => {
              try {
                const categoryProducts = await fetchFromSanity<any[]>(productsByCategoryQuery, { category });
                if (!categoryProducts?.length) {
                  return [];
                }
                return categoryProducts.map((p: any, i: number) => transformTabbedProduct(p, key, i));
              } catch (error) {
                console.error(`[HOMEPAGE] Failed to fetch category ${category}`, error);
                return [];
              }
            }),
          ),
        ]);

        if (homeData?.heroSlides?.length) {
          setHeroSlide(transformHeroSlide(homeData.heroSlides[0]));
        } else {
          setHeroSlide(null);
        }

        const sanitizedBestSellers = homeData?.bestSellerProducts?.filter((item: any) => item?._id) ?? [];
        if (sanitizedBestSellers.length) {
          setBestSellerProducts(sanitizedBestSellers.map((item: any, i: number) => transformBestSellerProduct(item, i)));
        } else if (featuredProductsData?.length) {
          setBestSellerProducts(featuredProductsData.map((p: any, i: number) => transformBestSellerProduct(p, i)));
        } else {
          setBestSellerProducts([]);
        }

        if (homeData?.editorialBanners?.length) {
          const transformed = [...homeData.editorialBanners]
            .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
            .map(transformEditorialBanner);
          setEditorialBanners(transformed);
        } else {
          setEditorialBanners([]);
        }

        if (homeData?.discountedProducts?.length) {
          setSpecialOfferProducts(homeData.discountedProducts.map((p: any, i: number) => transformSpecialOfferProduct(p, i)));
        } else {
          setSpecialOfferProducts([]);
        }

        if (homeData?.socialMediaProducts?.length) {
          setSocialMediaProducts(homeData.socialMediaProducts.map((p: any, i: number) => transformSocialMediaProduct(p, i)));
        } else {
          setSocialMediaProducts([]);
        }

        if (homeData?.educationalProducts?.length) {
          setEduProducts(homeData.educationalProducts.map((p: any, i: number) => transformEducationalProduct(p, i)));
        } else {
          setEduProducts([]);
        }

        if (homeData?.bestsellingCourses?.length) {
          setCourses(homeData.bestsellingCourses.map((c: any, i: number) => transformCourse(c, i)));
        } else if (featuredCoursesData?.length) {
          setCourses(featuredCoursesData.map((c: any, i: number) => transformCourse(c, i)));
        } else {
          setCourses([]);
        }

        const blogPostsSource =
          (homeData?.magazinePosts?.length ? homeData.magazinePosts : undefined) ??
          (homeData?.featuredBlogs?.length ? homeData.featuredBlogs : undefined) ??
          featuredPostsData;

        if (blogPostsSource?.length) {
          setMagazinePosts(blogPostsSource.map((p: any, i: number) => transformBlogPost(p, i)));
        } else {
          setMagazinePosts([]);
        }

        const flattenedTabbedProducts = tabbedProductGroups?.flat() ?? [];
        setTabbedProducts(flattenedTabbedProducts);

        if (homeData?.collectionsBanner) {
          setCollectionsBanner(transformCollectionsBanner(homeData.collectionsBanner));
        } else {
          setCollectionsBanner(null);
        }

        if (homeData?.seoContent && typeof homeData.seoContent === 'string') {
          const trimmedContent = homeData.seoContent.trim();
          console.log('[SEO Content] Setting content:', trimmedContent.substring(0, 50) + '...');
          setSeoContent(trimmedContent);
        } else {
          console.log('[SEO Content] No valid content found:', typeof homeData?.seoContent, homeData?.seoContent);
          setSeoContent(null);
        }
        setSeoContentLoaded(true);
      } catch (error) {
        console.error("[HOMEPAGE] ❌ Failed to fetch:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadHomepageData();

    // Refetch data when page becomes visible (e.g., when iframe loads in Presentation tool)
    // The client will automatically detect visual editing mode and use correct perspective
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Check if we're in an iframe (likely Presentation tool)
        const inIframe = typeof window !== 'undefined' && window !== window.parent
        if (inIframe) {
          console.log('[HOMEPAGE] Refetching data for visual editing mode');
          loadHomepageData();
        }
      }
    };

    // Listen for when the page becomes visible (e.g., when iframe loads)
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Fetch Medusa prices for homepage products
  useEffect(() => {
    const fetchHomepagePrices = async () => {
      if (!bestSellerProducts || bestSellerProducts.length === 0) return;

      const slugs = bestSellerProducts
        .map((p: any) => p.slug || p.handle)
        .filter(Boolean);

      if (slugs.length === 0) return;

      try {
        console.log('[HOMEPAGE] Fetching Medusa prices for homepage products:', slugs.length);
        const prices = await fetchProductPrices(slugs);
        setProductPrices(prices);
        console.log('[HOMEPAGE] ✅ Homepage prices fetched successfully');
      } catch (error) {
        console.error('[HOMEPAGE] ❌ Failed to fetch homepage prices:', error);
      }
    };

    fetchHomepagePrices();
  }, [bestSellerProducts]);
  const handleOpenCart = () => {
    toast({
      title: "سبد خرید",
      description: "سبد خرید شما باز شد",
    });
  };
  const handleSearch = (query: string) => {
    toast({
      title: "جستجو",
      description: `جستجو برای: ${query}`,
    });
  };
  const handleOpenProduct = (productId: string) => {
    toast({
      title: "محصول",
      description: `محصول ${productId} به سبد اضافه شد`,
    });
  };
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    toast({
      title: "دسته‌بندی",
      description: `دسته‌بندی به ${category} تغییر کرد`,
    });
  };
  const handleAddToCart = (productId: string) => {
    toast({
      title: "به سبد اضافه شد",
      description: `محصول ${productId} به سبد خرید اضافه شد`,
    });
  };
  const handleViewAllOffers = () => {
    toast({
      title: "تخفیفات ویژه",
      description: "مشاهده همه تخفیفات",
    });
  };
  const handleViewAllSocial = () => {
    toast({
      title: "محصولات سوشیال مدیا",
      description: "مشاهده همه محصولات سوشیال مدیا",
    });
  };

  const handleCollectionsBanner = () => {
    // Navigate to collection if ctaLink is available, otherwise show toast
    if (collectionsBanner?.ctaLink) {
      navigate(collectionsBanner.ctaLink);
    } else {
    toast({
      title: "کلکسیون‌های سوشیال مدیا",
      description: "مشاهده همه کلکسیون‌ها",
    });
    }
  };
  const handleViewAllEdu = () => {
    toast({
      title: "محصولات آموزشی",
      description: "مشاهده همه محصولات آموزشی",
    });
  };
  const handleViewAllCourses = () => {
    toast({
      title: "دوره‌ها",
      description: "مشاهده همه دوره‌ها",
    });
  };
  const handleViewCourse = (courseId: string) => {
    toast({
      title: "مشاهده دوره",
      description: `مشاهده جزئیات دوره ${courseId}`,
    });
  };
  const handleReadPost = (slug: string) => {
    toast({
      title: "مقاله",
      description: `خواندن مقاله: ${slug}`,
    });
  };
  const handleViewMagazine = () => {
    toast({
      title: "مجله",
      description: "مشاهده همه مقالات مجله",
    });
  };

  // Note: All hardcoded fallback data has been removed per SANITY_INTEGRATION_GUIDE.md
  // Sections will hide gracefully when Sanity data is unavailable (conditional rendering)
  
  // Header navigation items (not Sanity content - UI structure only)
  const megaItems = {
    cols: [
      {
        title: "راهکارهای هوش مصنوعی کسب‌وکار",
        titleFa: "راهکارهای هوش مصنوعی کسب‌وکار",
        links: [
          {
            label: "مدیریت پروژه",
            labelFa: "مدیریت پروژه",
            href: "/products?cat=project-management",
          },
          {
            label: "تحلیل داده",
            labelFa: "تحلیل داده",
            href: "/products?cat=data-analysis",
          },
          {
            label: "اتوماسیون",
            labelFa: "اتوماسیون",
            href: "/products?cat=automation",
          },
        ],
      },
      {
        title: "خلاقیت و فناوری",
        titleFa: "خلاقیت و فناوری",
        links: [
          {
            label: "تولید محتوا",
            labelFa: "تولید محتوا",
            href: "/products?cat=content",
          },
          {
            label: "تولید ویدیو",
            labelFa: "تولید ویدیو",
            href: "/products?cat=video",
          },
          {
            label: "گرافیک با AI",
            labelFa: "گرافیک با AI",
            href: "/products?cat=graphic",
          },
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
    <div className="min-h-screen relative">
      {/* Header */}
      <Header onSearch={handleSearch} megaItems={megaItems} />

      {/* Hero Section */}
      <ImageHero slide={heroSlide} />

      {/* Best Sellers Section - Only render when Sanity data exists */}
      {bestSellerProducts.length > 0 && (
      <BestSellers products={bestSellerProducts} productPrices={productPrices} onAdd={handleAddToCart} />
      )}

      {/* Editorial Banners Section - Only render when Sanity data exists */}
      {editorialBanners.length > 0 && (
      <EditorialBanners banners={editorialBanners} />
      )}

      {/* Special Offers Section - Only render when Sanity data exists */}
      {specialOfferProducts.length > 0 && (
        <SpecialOffers 
          products={specialOfferProducts} 
          onAdd={handleAddToCart}
          onViewAll={handleViewAllOffers}
          className="mx-[10px]"
        />
      )}

      {/* Tabbed Product Grid Section - Only render when Sanity data exists */}
      {tabbedProducts.length > 0 && (
      <TabbedProductGrid
        products={tabbedProducts}
        onAdd={handleAddToCart}
        onViewAll={(category) => {
          toast({
            title: "مشاهده همه",
            description: `مشاهده تمام محصولات ${category}`,
          });
        }}
      />
      )}

      {/* Social Media Products Grid - Only render when Sanity data exists */}
      {socialMediaProducts.length > 0 && (
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
      )}

      {/* Collections Banner - Only render when Sanity data exists */}
      {collectionsBanner && (
        <CollectionsBanner 
          onClick={handleCollectionsBanner} 
          className="mx-[10px]"
          title={collectionsBanner.title}
          subtitle={collectionsBanner.subtitle}
          image={collectionsBanner.image}
          imageSrcSet={collectionsBanner.imageSrcSet}
          ctaText={collectionsBanner.ctaText}
        />
      )}

      {/* Educational Products Slider - Only render when Sanity data exists */}
      {eduProducts.length > 0 && (
        <EduProductsSlider
          items={eduProducts}
          onAdd={handleAddToCart}
          onViewAll={handleViewAllEdu}
          rtl={isRTL}
        />
      )}

      {/* Courses Carousel - Only render when Sanity data exists */}
      {courses.length > 0 && (
      <CoursesCarousel
        courses={courses}
        onAdd={handleAddToCart}
        onView={handleViewCourse}
        onViewAll={handleViewAllCourses}
        className="mx-[10px]"
      />
      )}

      {/* Blogs Carousel - Only render when Sanity data exists */}
      {magazinePosts.length > 0 && (
      <BlogsCarousel
        posts={magazinePosts}
        onRead={handleReadPost}
        onViewAll={handleViewMagazine}
        className="mx-[10px]"
      />
      )}

      {/* Trust Elements Section */}
      <section className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Trust Element 1: Happy Customers */}
          <SurfaceGlass variant="default" className="p-8 text-center group hover:scale-105 transition-transform duration-300">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
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

          {/* Trust Element 2: Years of Experience */}
          <SurfaceGlass variant="default" className="p-8 text-center group hover:scale-105 transition-transform duration-300">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
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

          {/* Trust Element 3: Secure Transactions */}
          <SurfaceGlass variant="default" className="p-8 text-center group hover:scale-105 transition-transform duration-300">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
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

      {/* SEO Content Section - Only render when Sanity data exists and is loaded */}
      {seoContentLoaded && seoContent && (
        <section className="container mx-auto px-4 md:px-6 py-16">
          <SurfaceGlass variant="subtle" className="p-8 md:p-12">
            <div className="max-w-4xl mx-auto">
              <EnhancedMarkdownRenderer content={seoContent} />
            </div>
          </SurfaceGlass>
        </section>
      )}

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
          cartItemCount={cartState.itemCount}
        />
      </Suspense>

      <ChatbotPanel open={chatOpen} onClose={() => setChatOpen(false)} />

      <SupportPanel open={supportOpen} onClose={() => setSupportOpen(false)} />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
      />
    </div>
  );
};
export default Index;
