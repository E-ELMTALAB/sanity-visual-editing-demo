import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer/Footer";
import { PageIntro } from "@/components/ui/page-intro";
import { Breadcrumb } from "@/components/ui/breadcrumb-component";
import { BlogGrid } from "@/components/Blog/BlogGrid";
import { BlogPost } from "@/components/Blog/BlogCard";
import { useDirection } from "@/contexts/DirectionContext";
import { toast } from "@/hooks/use-toast";
import { fetchFromSanity } from "@/lib/sanity.client";
import { validateSanityConfig } from "@/lib/sanity.config";
import { allPostsQuery } from "@/lib/sanity.queries";
import { transformBlogPost } from "@/lib/sanity.transformers";

export default function Blog() {
  const { isRTL } = useDirection();
  const [cartCount] = useState(0);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

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

  const footerLinks = {
    products: "/products",
    magazine: "/magazine",
    courses: "/courses",
    pricing: "/pricing",
    support: "/support",
  };

  const socialLinks = [
    { type: "Telegram" as const, href: "https://t.me/sharifgpt" },
    { type: "Instagram" as const, href: "https://instagram.com/sharifgpt" },
    { type: "X" as const, href: "https://x.com/sharifgpt" },
    { type: "YouTube" as const, href: "https://youtube.com/@sharifgpt" },
  ];

  const canonicalUrl = "https://sharifgpt.ai/blog";
  const siteUrl = "https://sharifgpt.ai";

  // JSON-LD for Blog
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "مقالات و راهنماها | SharifGPT",
    "description": "مقالات آموزشی، راهنماها و اخبار دنیای دیجیتال",
    "url": canonicalUrl,
    "publisher": {
      "@type": "Organization",
      "name": "SharifGPT",
      "url": siteUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.png`
      }
    }
  };

  useEffect(() => {
    const isConfigValid = validateSanityConfig();
    if (!isConfigValid) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    async function loadPosts() {
      try {
        setIsLoading(true);
        const response = await fetchFromSanity<any[]>(allPostsQuery);

        if (!isMounted) return;

        const transformed = (response ?? [])
          .map((item, index) => transformBlogPost(item, index))
          .filter((post) => post.slug && post.title);

        setPosts(transformed);
        setFetchError(null);
      } catch (error) {
        console.error("[BLOG] Failed to fetch posts from Sanity", error);
        if (isMounted) {
          setFetchError("خطا در بارگذاری مقالات");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>مقالات و راهنماها | SharifGPT</title>
        <meta 
          name="description" 
          content={isRTL 
            ? "مقالات آموزشی، راهنماها و اخبار دنیای دیجیتال - SharifGPT" 
            : "Educational articles, guides, and digital world news - SharifGPT"
          } 
        />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph */}
        <meta property="og:title" content="مقالات و راهنماها | SharifGPT" />
        <meta 
          property="og:description" 
          content={isRTL 
            ? "مقالات آموزشی، راهنماها و اخبار دنیای دیجیتال" 
            : "Educational articles, guides, and digital world news"
          } 
        />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="مقالات و راهنماها | SharifGPT" />
        <meta 
          name="twitter:description" 
          content={isRTL 
            ? "مقالات آموزشی، راهنماها و اخبار دنیای دیجیتال" 
            : "Educational articles, guides, and digital world news"
          } 
        />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(blogSchema)}
        </script>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header
          onSearch={handleSearch}
          active="blog"
          megaItems={{
            cols: [
              {
                title: "Credit Cards",
                titleFa: "کارت‌های اعتباری",
                links: [
                  { label: "Virtual Cards", labelFa: "کارت‌های مجازی", href: "/products/virtual-cards" },
                  { label: "Gift Cards", labelFa: "کارت‌های هدیه", href: "/products/gift-cards" },
                  { label: "Prepaid Cards", labelFa: "کارت‌های پیش‌پرداخت", href: "/products/prepaid-cards" },
                ]
              },
              {
                title: "AI Tools & Learning",
                titleFa: "ابزارهای هوش مصنوعی",
                links: [
                  { label: "ChatGPT Plus", labelFa: "چت‌جی‌پی‌تی پلاس", href: "/products/chatgpt" },
                  { label: "Midjourney", labelFa: "میدجرنی", href: "/products/midjourney" },
                  { label: "Claude Pro", labelFa: "کلاد پرو", href: "/products/claude" },
                  { label: "Online Courses", labelFa: "دوره‌های آنلاین", href: "/courses" },
                ]
              },
              {
                title: "Business & Professional",
                titleFa: "کسب‌وکار و حرفه‌ای",
                links: [
                  { label: "Cloud Storage", labelFa: "فضای ابری", href: "/products/cloud-storage" },
                  { label: "VPN Services", labelFa: "سرویس‌های VPN", href: "/products/vpn" },
                  { label: "Domain & Hosting", labelFa: "دامنه و هاستینگ", href: "/products/hosting" },
                ]
              }
            ],
            featured: {
              image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop",
              title: "Complete AI Mastery Course",
              titleFa: "دوره جامع تسلط بر هوش مصنوعی",
              href: "/courses/ai-mastery",
              badge: "30% OFF",
              badgeFa: "۳۰٪ تخفیف"
            }
          }}
        />

        <main className="flex-1 pt-[84px]">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 space-y-6 py-6">
            <Breadcrumb 
              path={[
                { label: isRTL ? "خانه" : "Home", href: "/" },
                { label: isRTL ? "بلاگ" : "Blog" }
              ]}
            />
            
            <PageIntro
              title={isRTL ? "مقالات و راهنماها" : "Articles & Guides"}
              subtitle={isRTL 
                ? "مقالات آموزشی، راهنماها و آخرین اخبار دنیای دیجیتال را در اینجا بخوانید" 
                : "Read educational articles, guides, and latest news from the digital world"
              }
            />

            {fetchError && !isLoading && (
              <p className="text-sm text-destructive text-center">{fetchError}</p>
            )}

            {/* Blog Grid */}
            <BlogGrid
              posts={posts}
              total={posts.length}
              shown={posts.length}
              loading={isLoading}
            />
          </div>
        </main>

        <Footer links={footerLinks} socials={socialLinks} />
      </div>
    </>
  );
}
