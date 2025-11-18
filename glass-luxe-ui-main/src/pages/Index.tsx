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
import {
  transformHeroSlide,
  transformBestSellerProduct,
  transformEditorialBanner,
  transformCategory,
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
  
  // Sanity data state
  const [isLoading, setIsLoading] = useState(true);
  const [heroSlide, setHeroSlide] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [bestSellerProducts, setBestSellerProducts] = useState<any[]>([]);
  const [editorialBanners, setEditorialBanners] = useState<any[]>([]);
  const [specialOfferProducts, setSpecialOfferProducts] = useState<any[]>([]);
  const [socialMediaProducts, setSocialMediaProducts] = useState<any[]>([]);
  const [eduProducts, setEduProducts] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [magazinePosts, setMagazinePosts] = useState<any[]>([]);
  const [tabbedProducts, setTabbedProducts] = useState<any[]>([]);
  const [collectionsBanner, setCollectionsBanner] = useState<any>(null);

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
        console.log('[HOMEPAGE] Fetching data from Sanity...');
        setIsLoading(true);
        
        // Try Home singleton first
        console.log('[HOMEPAGE] Trying home singleton query...');
        console.log('[HOMEPAGE] Query:', homePageQuery.substring(0, 200) + '...');
        const homeData = await fetchFromSanity<any>(homePageQuery);
        
        console.log('[HOMEPAGE] Query result:', homeData ? 'Data received' : 'null/undefined');
        
        if (homeData) {
          console.log('[HOMEPAGE] ✅ Found home singleton data', homeData);
          
          // Transform and set hero slide (use first slide)
          if (homeData.heroSlides && homeData.heroSlides.length > 0) {
            const transformed = transformHeroSlide(homeData.heroSlides[0]);
            setHeroSlide(transformed);
            console.log('[HOMEPAGE] ✅ Hero slide loaded');
          } else {
            console.log('[HOMEPAGE] ⚠️ No hero slides found');
          }
          
          // Transform and set categories
          if (homeData.categories && homeData.categories.length > 0) {
            const transformed = homeData.categories
              .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
              .map(transformCategory);
            setCategories(transformed);
            console.log('[HOMEPAGE] ✅ Categories loaded:', transformed.length);
          } else {
            console.log('[HOMEPAGE] ⚠️ No categories found');
          }
          
          // Transform and set best seller products
          if (homeData.bestSellerProducts && homeData.bestSellerProducts.length > 0) {
            const transformed = homeData.bestSellerProducts
              .filter((item: any) => item?._id) // Filter out null references
              .map((item: any, i: number) => transformBestSellerProduct(item, i));
            setBestSellerProducts(transformed);
            console.log('[HOMEPAGE] ✅ Best seller products loaded:', transformed.length);
          } else {
            // Fallback: try featured products (only if Home singleton is empty)
            const featuredProducts = await fetchFromSanity<any[]>(featuredProductsQuery);
            if (featuredProducts && featuredProducts.length > 0) {
              const transformed = featuredProducts.map((p: any, i: number) => transformBestSellerProduct(p, i));
              setBestSellerProducts(transformed);
              console.log('[HOMEPAGE] ✅ Best seller products loaded from fallback:', transformed.length);
            } else {
              console.log('[HOMEPAGE] ⚠️ No best seller products found');
            }
          }
          
          // Transform and set editorial banners
          if (homeData.editorialBanners && homeData.editorialBanners.length > 0) {
            const transformed = homeData.editorialBanners
              .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
              .map(transformEditorialBanner);
            setEditorialBanners(transformed);
            console.log('[HOMEPAGE] ✅ Editorial banners loaded:', transformed.length);
          } else {
            console.log('[HOMEPAGE] ⚠️ No editorial banners found');
          }
          
          // Transform and set special offer products
          if (homeData.discountedProducts && homeData.discountedProducts.length > 0) {
            const transformed = homeData.discountedProducts.map((p: any, i: number) => transformSpecialOfferProduct(p, i));
            setSpecialOfferProducts(transformed);
            console.log('[HOMEPAGE] ✅ Special offer products loaded:', transformed.length);
          } else {
            console.log('[HOMEPAGE] ⚠️ No special offer products found');
          }
          
          // Transform and set social media products
          if (homeData.socialMediaProducts && homeData.socialMediaProducts.length > 0) {
            const transformed = homeData.socialMediaProducts.map((p: any, i: number) => transformSocialMediaProduct(p, i));
            setSocialMediaProducts(transformed);
            console.log('[HOMEPAGE] ✅ Social media products loaded:', transformed.length);
          } else {
            console.log('[HOMEPAGE] ⚠️ No social media products found');
          }
          
          // Transform and set educational products
          if (homeData.educationalProducts && homeData.educationalProducts.length > 0) {
            const transformed = homeData.educationalProducts.map((p: any, i: number) => transformEducationalProduct(p, i));
            setEduProducts(transformed);
            console.log('[HOMEPAGE] ✅ Educational products loaded:', transformed.length);
          } else {
            console.log('[HOMEPAGE] ⚠️ No educational products found');
          }
          
          // Transform and set courses
          if (homeData.bestsellingCourses && homeData.bestsellingCourses.length > 0) {
            const transformed = homeData.bestsellingCourses.map((c: any, i: number) => transformCourse(c, i));
            setCourses(transformed);
            console.log('[HOMEPAGE] ✅ Courses loaded:', transformed.length);
          } else {
            // Fallback: try featured courses
            const featuredCourses = await fetchFromSanity<any[]>(featuredCoursesQuery);
            if (featuredCourses && featuredCourses.length > 0) {
              const transformed = featuredCourses.map((c: any, i: number) => transformCourse(c, i));
              setCourses(transformed);
              console.log('[HOMEPAGE] ✅ Courses loaded from fallback:', transformed.length);
            } else {
              console.log('[HOMEPAGE] ⚠️ No courses found');
            }
          }
          
          // Transform and set blog posts (use magazinePosts or featuredBlogs)
          const blogPosts = homeData.magazinePosts || homeData.featuredBlogs;
          if (blogPosts && blogPosts.length > 0) {
            const transformed = blogPosts.map((p: any, i: number) => transformBlogPost(p, i));
            setMagazinePosts(transformed);
            console.log('[HOMEPAGE] ✅ Magazine posts loaded:', transformed.length);
          } else {
            // Fallback: try featured posts
            const featuredPosts = await fetchFromSanity<any[]>(featuredPostsQuery);
            if (featuredPosts && featuredPosts.length > 0) {
              const transformed = featuredPosts.map((p: any, i: number) => transformBlogPost(p, i));
              setMagazinePosts(transformed);
              console.log('[HOMEPAGE] ✅ Magazine posts loaded from fallback:', transformed.length);
            } else {
              console.log('[HOMEPAGE] ⚠️ No magazine posts found');
            }
          }
          
          // Load tabbed products by category (AI, Social, Music, Education, SIM)
          const categoryMap: Record<string, string> = {
            'ai': 'ai',
            'social': 'social-media',
            'music': 'music',
            'edu': 'education',
            'sim': 'sim-card',
          };
          
          const allTabbedProducts: any[] = [];
          for (const [key, category] of Object.entries(categoryMap)) {
            const categoryProducts = await fetchFromSanity<any[]>(productsByCategoryQuery, { category });
            if (categoryProducts && categoryProducts.length > 0) {
              const transformed = categoryProducts.map((p: any, i: number) => transformTabbedProduct(p, key, i));
              allTabbedProducts.push(...transformed);
            }
          }
          setTabbedProducts(allTabbedProducts);
          console.log('[HOMEPAGE] ✅ Tabbed products loaded:', allTabbedProducts.length);
          
          // Transform and set collections banner
          if (homeData.collectionsBanner) {
            const transformed = transformCollectionsBanner(homeData.collectionsBanner);
            setCollectionsBanner(transformed);
            console.log('[HOMEPAGE] ✅ Collections banner loaded');
          } else {
            console.log('[HOMEPAGE] ⚠️ No collections banner found');
          }
          
          console.log('[HOMEPAGE] ✅ All data loaded from home singleton');
        } else {
          console.warn('[HOMEPAGE] ⚠️ No home singleton data found, using fallback');
        }
      } catch (error) {
        console.error('[HOMEPAGE] ❌ Failed to fetch:', error);
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

  // Note: All hardcoded fallback data has been removed per SANITY_INTEGRATION_GUIDE.md
  // Sections will hide gracefully when Sanity data is unavailable (conditional rendering)
  
  // Header navigation items (not Sanity content - UI structure only)
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
      <ImageHero slide={heroSlide} />

      {/* Category Rail */}
      <CategoryRail categories={categories.length > 0 ? categories : undefined} />

      {/* Best Sellers Section - Only render when Sanity data exists */}
      {bestSellerProducts.length > 0 && (
        <BestSellers products={bestSellerProducts} onAdd={handleAddToCart} />
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
              title: isRTL ? "مشاهده همه" : "View All",
              description: isRTL ? `مشاهده تمام محصولات ${category}` : `Viewing all ${category} products`,
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
