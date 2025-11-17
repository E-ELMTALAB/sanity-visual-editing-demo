import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Clock, Share2, Facebook, Twitter, Linkedin, Link2, ChevronLeft, ArrowRight, ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer/Footer";
import { Button } from "@/components/ui/button";
import { BlogCard } from "@/components/Blog/BlogCard";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Mock article data (would come from Sanity in production)
const mockArticle = {
  title: "راهنمای جامع طراحی رابط کاربری با Figma",
  slug: "figma-ui-design-guide",
  cover: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=600&fit=crop",
  author: {
    name: "سارا احمدی",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
  },
  publishedAt: "2024-03-15T10:00:00Z",
  readTime: 12,
  tags: ["طراحی", "Figma", "UI/UX"],
  body: `
    <p>طراحی رابط کاربری یکی از مهم‌ترین بخش‌های توسعه محصولات دیجیتال است. در این مقاله، به بررسی جامع ابزار Figma و نحوه استفاده از آن برای طراحی رابط‌های کاربری حرفه‌ای می‌پردازیم.</p>

    <h2>مقدمه‌ای بر Figma</h2>
    <p>Figma یک ابزار طراحی مبتنی بر مرورگر است که امکان همکاری همزمان چندین نفر را فراهم می‌کند. این ویژگی باعث شده تا Figma به یکی از محبوب‌ترین ابزارهای طراحی در دنیا تبدیل شود.</p>

    <blockquote>
      <p>"طراحی خوب، طراحی نامرئی است" - جو اسپارانو</p>
    </blockquote>

    <h2>مزایای استفاده از Figma</h2>
    <p>Figma دارای مزایای متعددی است که آن را از سایر ابزارهای طراحی متمایز می‌کند:</p>

    <ul>
      <li>همکاری آنلاین و real-time</li>
      <li>عدم نیاز به نصب نرم‌افزار</li>
      <li>سیستم کامپوننت قدرتمند</li>
      <li>Auto Layout برای طراحی واکنش‌گرا</li>
      <li>پلاگین‌های متنوع و کاربردی</li>
    </ul>

    <h3>شروع با Figma</h3>
    <p>برای شروع کار با Figma، تنها کافی است به وب‌سایت آن مراجعه کرده و یک حساب کاربری رایگان ایجاد کنید. نسخه رایگان Figma برای اکثر پروژه‌ها کافی است.</p>

    <pre><code>// مثالی از کد CSS برای استایل دکمه
.button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 12px 24px;
  color: white;
  transition: transform 0.2s;
}

.button:hover {
  transform: scale(1.05);
}</code></pre>

    <h2>طراحی سیستم‌های طراحی</h2>
    <p>یکی از قدرتمندترین ویژگی‌های Figma، امکان ایجاد سیستم‌های طراحی (Design Systems) است. با استفاده از کامپوننت‌ها و استایل‌های مشترک، می‌توانید یک سیستم طراحی یکپارچه برای تیم خود ایجاد کنید.</p>

    <div class="callout callout-info">
      <strong>نکته:</strong> همیشه قبل از شروع طراحی، یک سیستم طراحی پایه ایجاد کنید. این کار باعث صرفه‌جویی در زمان و حفظ یکپارچگی طراحی می‌شود.
    </div>

    <h3>کامپوننت‌ها در Figma</h3>
    <p>کامپوننت‌ها اجزای قابل استفاده مجدد هستند که تغییرات در آن‌ها به صورت خودکار در تمام نمونه‌ها اعمال می‌شود. برای ایجاد کامپوننت:</p>

    <ol>
      <li>المان مورد نظر را انتخاب کنید</li>
      <li>از منو Create Component را انتخاب کنید (یا Ctrl+Alt+K)</li>
      <li>نام مناسبی برای کامپوننت انتخاب کنید</li>
      <li>از آن در طراحی‌های مختلف استفاده کنید</li>
    </ol>

    <h2>بهترین شیوه‌های طراحی</h2>
    <p>برای طراحی رابط‌های کاربری موثر، رعایت این نکات ضروری است:</p>

    <h3>1. سادگی و وضوح</h3>
    <p>رابط کاربری باید ساده و قابل فهم باشد. از ازدحام بصری پرهیز کنید و روی عناصر مهم تمرکز کنید.</p>

    <h3>2. ثبات و یکپارچگی</h3>
    <p>استفاده از الگوهای طراحی ثابت و یکپارچ، یادگیری و استفاده از محصول را آسان‌تر می‌کند.</p>

    <div class="callout callout-warning">
      <strong>هشدار:</strong> تغییرات بیش از حد در الگوهای طراحی می‌تواند باعث سردرگمی کاربران شود.
    </div>

    <h3>3. بازخورد بصری</h3>
    <p>همیشه برای اعمال کاربر بازخورد مناسب ارائه دهید. این بازخوردها می‌توانند شامل تغییر رنگ، انیمیشن یا پیام‌های موفقیت باشند.</p>

    <h2>نتیجه‌گیری</h2>
    <p>Figma ابزاری قدرتمند برای طراحی رابط کاربری است که با ویژگی‌های منحصر به فرد خود، فرآیند طراحی را بسیار ساده‌تر کرده است. با تمرین و تسلط بر این ابزار، می‌توانید طراحی‌های حرفه‌ای و زیبایی ایجاد کنید.</p>

    <p>امیدواریم این راهنما برای شما مفید بوده باشد. برای یادگیری بیشتر، پیشنهاد می‌کنیم دوره‌های آموزشی ما را بررسی کنید.</p>
  `
};
const relatedPosts = [{
  title: "اصول طراحی UI/UX برای مبتدیان",
  excerpt: "آشنایی با مفاهیم پایه طراحی رابط و تجربه کاربری",
  image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
  slug: "ui-ux-basics",
  readTime: 8,
  publishedAt: "2024-03-10"
}, {
  title: "رنگ‌شناسی در طراحی دیجیتال",
  excerpt: "نحوه انتخاب و استفاده از رنگ‌ها در طراحی محصولات دیجیتال",
  image: "https://images.unsplash.com/photo-1634942537034-2531766767d1?w=400&h=250&fit=crop",
  slug: "color-theory-design",
  readTime: 10,
  publishedAt: "2024-03-08"
}, {
  title: "طراحی واکنش‌گرا با Auto Layout",
  excerpt: "آموزش استفاده از Auto Layout در Figma برای طراحی رسپانسیو",
  image: "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?w=400&h=250&fit=crop",
  slug: "auto-layout-figma",
  readTime: 15,
  publishedAt: "2024-03-05"
}, {
  title: "کامپوننت‌های قابل استفاده مجدد",
  excerpt: "چگونه کامپوننت‌های موثر و قابل استفاده مجدد در Figma بسازیم",
  image: "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=400&h=250&fit=crop",
  slug: "reusable-components",
  readTime: 12,
  publishedAt: "2024-03-01"
}];
export default function BlogPost() {
  const {
    slug
  } = useParams();
  const [readingProgress, setReadingProgress] = useState(0);
  const [activeHeading, setActiveHeading] = useState("");
  const [headings, setHeadings] = useState<{
    id: string;
    text: string;
    level: number;
  }[]>([]);
  const articleRef = useRef<HTMLDivElement>(null);

  // Extract headings for ToC
  useEffect(() => {
    if (articleRef.current) {
      const headingElements = articleRef.current.querySelectorAll("h2, h3");
      const extractedHeadings = Array.from(headingElements).map((heading, index) => {
        const id = `heading-${index}`;
        heading.id = id;
        return {
          id,
          text: heading.textContent || "",
          level: parseInt(heading.tagName[1])
        };
      });
      setHeadings(extractedHeadings);
    }
  }, []);

  // Reading progress tracking
  useEffect(() => {
    const handleScroll = () => {
      if (!articleRef.current) return;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const trackLength = documentHeight - windowHeight;
      const progress = scrollTop / trackLength * 100;
      setReadingProgress(Math.min(progress, 100));

      // Update active heading
      const headingElements = articleRef.current.querySelectorAll("h2, h3");
      let currentHeading = "";
      headingElements.forEach(heading => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 150) {
          currentHeading = heading.id;
        }
      });
      setActiveHeading(currentHeading);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const top = element.offsetTop - offset;
      window.scrollTo({
        top,
        behavior: "smooth"
      });
    }
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = mockArticle.title;
  const handleShare = (platform: string) => {
    let url = "";
    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case "copy":
        navigator.clipboard.writeText(shareUrl);
        toast.success("لینک کپی شد");
        return;
    }
    if (url) {
      window.open(url, "_blank", "width=600,height=400");
    }
  };
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: mockArticle.title,
    image: mockArticle.cover,
    datePublished: mockArticle.publishedAt,
    dateModified: mockArticle.publishedAt,
    author: {
      "@type": "Person",
      name: mockArticle.author.name,
      image: mockArticle.author.avatar
    },
    publisher: {
      "@type": "Organization",
      name: "SharifGPT",
      logo: {
        "@type": "ImageObject",
        url: "https://sharifgpt.ai/logo.png"
      }
    },
    description: "راهنمای جامع طراحی رابط کاربری با Figma - آموزش گام به گام"
  };
  return <>
      <Helmet>
        <title>{mockArticle.title} - مجله SharifGPT</title>
        <meta name="description" content="راهنمای جامع طراحی رابط کاربری با Figma - آموزش گام به گام برای طراحان" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={mockArticle.title} />
        <meta property="og:image" content={mockArticle.cover} />
        <meta property="article:published_time" content={mockArticle.publishedAt} />
        <meta property="article:author" content={mockArticle.author.name} />
        {mockArticle.tags.map(tag => <meta key={tag} property="article:tag" content={tag} />)}
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      {/* Reading Progress Bar */}
      <motion.div className="fixed top-0 left-0 h-1 bg-gradient-to-r from-primary to-secondary z-50" style={{
      width: `${readingProgress}%`
    }} />

      <div className="min-h-screen flex flex-col">
        <Header onSearch={() => {}} active="blog" />

        <main className="flex-1 py-16">
          <div className="max-w-[1600px] px-4 md:px-6 lg:px-8 mx-[50px] my-[75px]">
            <div className="flex justify-center gap-12 lg:gap-16 xl:gap-20">
              {/* Main Content */}
              <article className="w-full max-w-[820px]">
                {/* Breadcrumb */}
                <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
                  <Link to="/" className="hover:text-foreground transition-colors">
                    خانه
                  </Link>
                  <ChevronLeft className="w-4 h-4" />
                  <Link to="/blog" className="hover:text-foreground transition-colors">
                    مقالات
                  </Link>
                  <ChevronLeft className="w-4 h-4" />
                  <span className="text-foreground">{mockArticle.title}</span>
                </nav>

                {/* Cover Image */}
                <motion.div initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} className="mb-8">
                  <img src={mockArticle.cover} alt={mockArticle.title} loading="lazy" className="w-full aspect-[2/1] object-cover rounded-3xl ring-1 ring-white/12" />
                </motion.div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-black mb-6">
                  {mockArticle.title}
                </h1>

                {/* Meta Row */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-8 border-b border-white/10">
                  <div className="flex items-center gap-4">
                    <img src={mockArticle.author.avatar} alt={mockArticle.author.name} loading="lazy" className="w-12 h-12 rounded-full ring-2 ring-white/20" />
                    <div>
                      <p className="font-semibold">{mockArticle.author.name}</p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{formatDate(mockArticle.publishedAt)}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {mockArticle.readTime} دقیقه
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Share Buttons */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground ml-2">اشتراک:</span>
                    <button onClick={() => handleShare("twitter")} className="p-2 glass rounded-lg hover:bg-surface-glass transition-colors" aria-label="Share on Twitter">
                      <Twitter className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleShare("facebook")} className="p-2 glass rounded-lg hover:bg-surface-glass transition-colors" aria-label="Share on Facebook">
                      <Facebook className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleShare("linkedin")} className="p-2 glass rounded-lg hover:bg-surface-glass transition-colors" aria-label="Share on LinkedIn">
                      <Linkedin className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleShare("copy")} className="p-2 glass rounded-lg hover:bg-surface-glass transition-colors" aria-label="Copy link">
                      <Link2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {mockArticle.tags.map(tag => <span key={tag} className="glass border border-white/20 rounded-full px-4 py-1.5 text-sm">
                      {tag}
                    </span>)}
                </div>

                {/* Article Body */}
                <div ref={articleRef} className="prose prose-invert prose-lg max-w-none" dangerouslySetInnerHTML={{
                __html: mockArticle.body
              }} />

                {/* Next/Prev Articles */}
                <div className="grid md:grid-cols-2 gap-4 mt-12 pt-12 border-t border-white/10">
                  <Link to="/blog/previous-article" className="glass border border-white/20 rounded-xl p-6 hover:border-primary/40 transition-all group">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <ArrowRight className="w-4 h-4" />
                      <span>مقاله قبلی</span>
                    </div>
                    <h3 className="font-bold group-hover:text-primary transition-colors">
                      اصول طراحی UI/UX برای مبتدیان
                    </h3>
                  </Link>

                  <Link to="/blog/next-article" className="glass border border-white/20 rounded-xl p-6 hover:border-primary/40 transition-all group text-left">
                    <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground mb-2">
                      <span>مقاله بعدی</span>
                      <ArrowLeft className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold group-hover:text-primary transition-colors">
                      رنگ‌شناسی در طراحی دیجیتال
                    </h3>
                  </Link>
                </div>
              </article>

              {/* Sidebar - Table of Contents */}
              <aside className="hidden lg:block w-[280px] xl:w-[320px] shrink-0">
                <div className="sticky top-24">
                  <div className="glass border border-white/20 rounded-xl p-6">
                    <h3 className="font-bold text-lg mb-4">فهرست مطالب</h3>
                    <nav className="space-y-2">
                      {headings.map(heading => <button key={heading.id} onClick={() => scrollToHeading(heading.id)} className={cn("w-full text-right px-3 py-2 rounded-lg transition-all text-sm", heading.level === 3 && "pr-6", activeHeading === heading.id ? "bg-primary/20 text-primary font-semibold" : "text-muted-foreground hover:bg-surface-glass hover:text-foreground")}>
                          {heading.text}
                        </button>)}
                    </nav>
                  </div>
                </div>
              </aside>
            </div>

            {/* Related Posts */}
            <section className="mt-16 w-full max-w-[820px] mx-auto">
              <h2 className="text-3xl font-bold mb-8">مقالات مرتبط</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedPosts.map(post => <BlogCard key={post.slug} post={{
                _id: post.slug,
                title: post.title,
                slug: post.slug,
                excerpt: post.excerpt,
                image: {
                  asset: {
                    url: post.image
                  }
                },
                readTime: post.readTime,
                publishedAt: post.publishedAt
              }} />)}
              </div>
            </section>
          </div>
        </main>

        <Footer links={{
        products: "/products",
        magazine: "/magazine",
        courses: "/courses",
        pricing: "/pricing",
        support: "/support"
      }} socials={[]} />
      </div>

      <style>{`
        .prose {
          color: hsl(var(--foreground));
        }

        .prose h2 {
          font-size: 1.875rem;
          font-weight: 800;
          margin-top: 3rem;
          margin-bottom: 1.5rem;
          color: hsl(var(--foreground));
          scroll-margin-top: 6rem;
        }

        .prose h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: hsl(var(--foreground));
          scroll-margin-top: 6rem;
        }

        .prose p {
          margin-bottom: 1.5rem;
          line-height: 1.875;
          color: hsl(var(--muted-foreground));
        }

        .prose ul, .prose ol {
          margin-bottom: 1.5rem;
          padding-right: 1.5rem;
        }

        .prose li {
          margin-bottom: 0.5rem;
          color: hsl(var(--muted-foreground));
        }

        .prose blockquote {
          border-right: 4px solid hsl(var(--primary));
          padding: 1rem 1.5rem;
          margin: 2rem 0;
          background: hsl(var(--primary) / 0.1);
          border-radius: 0.75rem;
          font-style: italic;
        }

        .prose blockquote p {
          margin: 0;
          color: hsl(var(--foreground));
        }

        .prose pre {
          background: hsl(var(--surface-glass));
          border: 1px solid hsl(var(--border-glass));
          border-radius: 1rem;
          padding: 1.5rem;
          margin: 2rem 0;
          overflow-x: auto;
          backdrop-filter: blur(12px);
        }

        .prose code {
          font-family: 'Courier New', monospace;
          font-size: 0.875em;
          color: hsl(var(--primary));
        }

        .prose pre code {
          color: hsl(var(--foreground));
        }

        .prose .callout {
          padding: 1.25rem;
          margin: 2rem 0;
          border-radius: 1rem;
          border: 1px solid;
          backdrop-filter: blur(12px);
        }

        .prose .callout-info {
          background: hsl(var(--primary) / 0.1);
          border-color: hsl(var(--primary) / 0.3);
        }

        .prose .callout-warning {
          background: hsl(45 100% 50% / 0.1);
          border-color: hsl(45 100% 50% / 0.3);
        }

        .prose .callout strong {
          color: hsl(var(--foreground));
        }

        .prose a {
          color: hsl(var(--primary));
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .prose a:hover {
          text-decoration: none;
        }
      `}</style>
    </>;
}