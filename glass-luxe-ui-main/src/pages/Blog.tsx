import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer/Footer";
import { PageIntro } from "@/components/ui/page-intro";
import { Breadcrumb } from "@/components/ui/breadcrumb-component";
import { BlogGrid } from "@/components/Blog/BlogGrid";
import { BlogPost } from "@/components/Blog/BlogCard";
import { useDirection } from "@/contexts/DirectionContext";
import { toast } from "@/hooks/use-toast";

// Mock data - replace with Sanity CMS query
const mockPosts: BlogPost[] = [
  {
    _id: "1",
    title: "راهنمای خرید کارت اعتباری مجازی",
    slug: "virtual-card-guide",
    image: {
      asset: {
        url: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop",
      },
    },
    excerpt: "همه چیز درباره کارت‌های اعتباری مجازی و نحوه استفاده از آن‌ها برای خریدهای آنلاین",
    category: "cards",
    readTime: 5,
    publishedAt: "2024-03-15",
  },
  {
    _id: "2",
    title: "آموزش استفاده از ChatGPT Plus",
    slug: "chatgpt-plus-tutorial",
    image: {
      asset: {
        url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
      },
    },
    excerpt: "راهنمای جامع استفاده از قابلیت‌های پیشرفته ChatGPT Plus",
    category: "ai-tools",
    readTime: 8,
    publishedAt: "2024-03-12",
  },
  {
    _id: "3",
    title: "بهترین روش‌های خرید اشتراک Spotify",
    slug: "spotify-subscription-guide",
    image: {
      asset: {
        url: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=600&h=400&fit=crop",
      },
    },
    excerpt: "چگونه اشتراک Spotify Premium را با کمترین قیمت تهیه کنیم",
    category: "spotify",
    readTime: 4,
    publishedAt: "2024-03-10",
  },
  {
    _id: "4",
    title: "مقایسه سرویس‌های VPN برتر",
    slug: "vpn-comparison",
    image: {
      asset: {
        url: "https://images.unsplash.com/photo-1563906267088-b029e7101114?w=600&h=400&fit=crop",
      },
    },
    excerpt: "بررسی و مقایسه کامل محبوب‌ترین سرویس‌های VPN در سال 2024",
    category: "tutorials",
    readTime: 10,
    publishedAt: "2024-03-08",
  },
  {
    _id: "5",
    title: "راهنمای اشتراک YouTube Premium",
    slug: "youtube-premium-guide",
    image: {
      asset: {
        url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop",
      },
    },
    excerpt: "تمام مزایا و روش‌های خرید اشتراک YouTube Premium",
    category: "youtube",
    readTime: 6,
    publishedAt: "2024-03-05",
  },
  {
    _id: "6",
    title: "آخرین اخبار دنیای هوش مصنوعی",
    slug: "ai-news-march-2024",
    image: {
      asset: {
        url: "https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=600&h=400&fit=crop",
      },
    },
    excerpt: "مروری بر آخرین پیشرفت‌های صنعت هوش مصنوعی در ماه گذشته",
    category: "ai-tools",
    readTime: 7,
    publishedAt: "2024-03-01",
  },
];

export default function Blog() {
  const { isRTL } = useDirection();
  const [cartCount] = useState(0);

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
    "name": isRTL ? "مقالات و راهنماها | SharifGPT" : "Articles & Guides | SharifGPT",
    "description": isRTL 
      ? "مقالات آموزشی، راهنماها و اخبار دنیای دیجیتال" 
      : "Educational articles, guides, and digital world news",
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

            {/* Blog Grid */}
            <BlogGrid
              posts={mockPosts}
              total={mockPosts.length}
              shown={mockPosts.length}
              loading={false}
            />
          </div>
        </main>

        <Footer links={footerLinks} socials={socialLinks} />
      </div>
    </>
  );
}
