import { useEffect, useState } from "react";
import { Helmet } from "@/components/Helmet";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer/Footer";
import { PageIntro } from "@/components/ui/page-intro";
import { Breadcrumb } from "@/components/ui/breadcrumb-component";
import { BlogGrid } from "@/components/Blog/BlogGrid";
import { BlogPost } from "@/components/Blog/BlogCard";
import { useDirection } from "@/contexts/DirectionContext";
import { toast } from "@/hooks/use-toast";
import { getAllPosts, getPageBySlug } from "@/lib/sanity-cache-direct";
import { transformBlogPost } from "@/lib/sanity.transformers";
import { getImageUrl } from "@/lib/sanity.image";

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

export default function Blog() {
  const { isRTL } = useDirection();
  const [cartCount] = useState(0);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [pageSeo, setPageSeo] = useState<SeoMeta | null>(null);

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
    magazine: "/blog",
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
    let isMounted = true;

    async function loadPosts() {
      try {
        setIsLoading(true);
        const response = await getAllPosts();
        const pageSeoResult = await getPageBySlug("blog");

        if (!isMounted) return;

        const transformed = (response ?? [])
          .map((item, index) => transformBlogPost(item, index))
          .filter((post) => post.slug && post.title);

        setPosts(transformed);
        setFetchError(null);

        if (pageSeoResult?.seo) {
          const seo = pageSeoResult.seo;
          setPageSeo({
            metaTitle: seo.metaTitle || "مقالات و راهنماها | SharifGPT",
            metaDescription: seo.metaDescription || "مقالات آموزشی، راهنماها و اخبار دنیای دیجیتال - SharifGPT",
            canonicalUrl: seo.canonicalUrl || canonicalUrl,
            robotsMeta: seo.robotsMeta || "",
            openGraphTitle: seo.openGraphTitle || seo.metaTitle || "مقالات و راهنماها | SharifGPT",
            openGraphDescription: seo.openGraphDescription || seo.metaDescription || "مقالات آموزشی، راهنماها و اخبار دنیای دیجیتال",
            openGraphImage: seo.openGraphImage ? getImageUrl(seo.openGraphImage, 1200) : undefined,
            structuredData: seo.structuredData || "",
          });
        }
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
        <title>{pageSeo?.metaTitle || "مقالات و راهنماها | SharifGPT"}</title>
        <meta
          name="description"
          content={pageSeo?.metaDescription || "مقالات آموزشی، راهنماها و اخبار دنیای دیجیتال - SharifGPT"}
        />
        <link rel="canonical" href={pageSeo?.canonicalUrl || canonicalUrl} />
        {pageSeo?.robotsMeta && <meta name="robots" content={pageSeo.robotsMeta} />}
        
        {/* Open Graph */}
        <meta property="og:title" content={pageSeo?.openGraphTitle || pageSeo?.metaTitle || "مقالات و راهنماها | SharifGPT"} />
        <meta
          property="og:description"
          content={pageSeo?.openGraphDescription || pageSeo?.metaDescription || "مقالات آموزشی، راهنماها و اخبار دنیای دیجیتال"}
        />
        <meta property="og:url" content={pageSeo?.canonicalUrl || canonicalUrl} />
        <meta property="og:type" content="website" />
        {pageSeo?.openGraphImage && <meta property="og:image" content={pageSeo.openGraphImage} />}
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageSeo?.openGraphTitle || pageSeo?.metaTitle || "مقالات و راهنماها | SharifGPT"} />
        <meta
          name="twitter:description"
          content={pageSeo?.openGraphDescription || pageSeo?.metaDescription || "مقالات آموزشی، راهنماها و اخبار دنیای دیجیتال"}
        />
        {pageSeo?.openGraphImage && <meta name="twitter:image" content={pageSeo.openGraphImage} />}

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(blogSchema)}
        </script>
        {pageSeo?.structuredData && (
          <script type="application/ld+json">
            {pageSeo.structuredData}
          </script>
        )}
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header
          onSearch={handleSearch}
          active="blog"
          megaItems={{
            cols: [
              {
                title: "کارت‌های اعتباری",
                titleFa: "کارت‌های اعتباری",
                links: [
                  { label: "کارت‌های مجازی", labelFa: "کارت‌های مجازی", href: "/products/virtual-cards" },
                  { label: "کارت‌های هدیه", labelFa: "کارت‌های هدیه", href: "/products/gift-cards" },
                  { label: "کارت‌های پیش‌پرداخت", labelFa: "کارت‌های پیش‌پرداخت", href: "/products/prepaid-cards" },
                ]
              },
              {
                title: "ابزارهای هوش مصنوعی",
                titleFa: "ابزارهای هوش مصنوعی",
                links: [
                  { label: "چت‌جی‌پی‌تی پلاس", labelFa: "چت‌جی‌پی‌تی پلاس", href: "/products/chatgpt" },
                  { label: "میدجرنی", labelFa: "میدجرنی", href: "/products/midjourney" },
                  { label: "کلاد پرو", labelFa: "کلاد پرو", href: "/products/claude" },
                  { label: "دوره‌های آنلاین", labelFa: "دوره‌های آنلاین", href: "/courses" },
                ]
              },
              {
                title: "کسب‌وکار و حرفه‌ای",
                titleFa: "کسب‌وکار و حرفه‌ای",
                links: [
                  { label: "فضای ابری", labelFa: "فضای ابری", href: "/products/cloud-storage" },
                  { label: "سرویس‌های VPN", labelFa: "سرویس‌های VPN", href: "/products/vpn" },
                  { label: "دامنه و هاستینگ", labelFa: "دامنه و هاستینگ", href: "/products/hosting" },
                ]
              }
            ],
            featured: {
              image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop",
              title: "دوره جامع تسلط بر هوش مصنوعی",
              titleFa: "دوره جامع تسلط بر هوش مصنوعی",
              href: "/courses/ai-mastery",
              badge: "۳۰٪ تخفیف",
              badgeFa: "۳۰٪ تخفیف"
            }
          }}
        />

        <main className="flex-1 pt-[84px]">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 space-y-6 py-6">
            <Breadcrumb
              path={[
                { label: "خانه", href: "/" },
                { label: "بلاگ" }
              ]}
            />
            
            <PageIntro
              title="مقالات و راهنماها"
              subtitle="مقالات آموزشی، راهنماها و آخرین اخبار دنیای دیجیتال را در اینجا بخوانید"
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
