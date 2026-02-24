import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "@/components/Helmet";
import { motion } from "framer-motion";
import { Clock, Facebook, Twitter, Linkedin, Link2, ChevronLeft, User } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer/Footer";
import { BlogCard } from "@/components/Blog/BlogCard";
import { SurfaceGlass } from "@/components/ui/surface-glass";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { PortableText } from "@portabletext/react";
import { getPostBySlug } from "@/lib/sanity-cache-direct";
import { transformBlogPost, transformBlogPostDetail } from "@/lib/sanity.transformers";
import EnhancedMarkdownRenderer from "@/components/EnhancedMarkdownRenderer";
import { useDirection } from "@/contexts/DirectionContext";

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

interface ArticleDetail {
  _id: string;
  slug: string;
  title: string;
  cover: string;
  author?: {
    name?: string;
    avatar?: string;
  };
  publishedAt?: string;
  readTime?: number;
  tags?: string[];
  body?: any[];
  bodyMarkdown?: string;
  excerpt?: string;
  seo?: SeoMeta;
}

interface BlogPost {
  slug: string;
  title: string;
  cover: string;
  excerpt?: string;
  publishedAt?: string;
  readTime?: number;
}

// Extract headings from markdown
const extractHeadingsFromMarkdown = (content: string): Array<{ level: number; text: string; id: string }> => {
  if (!content) return [];

  const lines = content.split('\n');
  const headings: Array<{ level: number; text: string; id: string }> = [];
  let headingCounter = 0;

  lines.forEach(line => {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      const id = `heading-${headingCounter++}`;
      headings.push({ level, text, id });
    }
  });

  return headings;
};

// PortableText components with spec styling
const portableTextComponents = {
  block: {
    normal: ({ children }: { children: React.ReactNode }) => (
      <p className="font-vazirmatn text-lg font-normal leading-[1.9] text-muted-foreground mb-6">{children}</p>
    ),
    h2: ({ children }: { children: React.ReactNode }) => {
      const id = `heading-${children?.toString().toLowerCase().replace(/\s+/g, '-')}`;
      return (
        <h2 id={id} className="font-vazirmatn text-[28px] font-extrabold leading-[1.3] text-foreground mt-12 mb-6 scroll-mt-24">
          {children}
        </h2>
      );
    },
    h3: ({ children }: { children: React.ReactNode }) => {
      const id = `heading-${children?.toString().toLowerCase().replace(/\s+/g, '-')}`;
      return (
        <h3 id={id} className="font-vazirmatn text-[22px] font-bold leading-[1.35] text-foreground mt-8 mb-4 scroll-mt-24">
          {children}
        </h3>
      );
    },
    blockquote: ({ children }: { children: React.ReactNode }) => (
      <blockquote className="font-vazirmatn border-r-4 border-primary pr-6 py-4 my-8 rounded-xl bg-primary/10 italic text-foreground">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: { children: React.ReactNode }) => (
      <ul className="font-vazirmatn list-disc pr-5 space-y-2 text-lg text-muted-foreground leading-[1.7] mb-6">{children}</ul>
    ),
    number: ({ children }: { children: React.ReactNode }) => (
      <ol className="font-vazirmatn list-decimal pr-5 space-y-2 text-lg text-muted-foreground leading-[1.7] mb-6">{children}</ol>
    ),
  },
  marks: {
    link: ({ children, value }: { children: React.ReactNode; value: { href?: string } }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-vazirmatn text-primary underline underline-offset-2 hover:no-underline"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }: { value: any }) => {
      const imageUrl = value?.asset?.url;
      const alt = value?.alt || '';
      return imageUrl ? (
        <img
          src={imageUrl}
          alt={alt}
          className="rounded-2xl my-8 ring-1 ring-white/10 w-full object-cover"
          loading="lazy"
        />
      ) : null;
    },
  },
};

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isRTL } = useDirection();
  const [readingProgress, setReadingProgress] = useState(0);
  const [activeHeading, setActiveHeading] = useState("");
  const [headings, setHeadings] = useState<Array<{ level: number; text: string; id: string }>>([]);
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const articleRef = useRef<HTMLDivElement>(null);

  // Fetch article
  useEffect(() => {
    if (!slug) {
      setIsLoading(false);
      setFetchError("آدرس مقاله نامعتبر است");
      return;
    }

    let isMounted = true;

    async function loadArticle() {
      try {
        setIsLoading(true);
        const result = await getPostBySlug(slug!);

        if (!isMounted) return;

        if (!result) {
          setFetchError("مقاله مورد نظر یافت نشد");
          return;
        }

        setArticle(transformBlogPostDetail(result));

        const transformedRelated = Array.isArray(result?.relatedPosts)
          ? result.relatedPosts.map((item: any, index: number) =>
              transformBlogPost(item, index)
            )
          : [];
        setRelatedPosts(transformedRelated);
        setFetchError(null);
      } catch (error) {
        console.error("[BLOG POST] Failed to fetch article", error);
        if (isMounted) {
          setFetchError("خطا در بارگذاری مقاله");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadArticle();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Extract headings from content (from DOM after render)
  useEffect(() => {
    if (!article) {
      setHeadings([]);
      return;
    }

    const updateHeadings = () => {
      if (!articleRef.current) return;

      const headingElements = articleRef.current.querySelectorAll("h2, h3");
      const extractedHeadings = Array.from(headingElements).map((heading, index) => {
        // Use existing ID or generate one
        if (!heading.id) {
          const text = heading.textContent?.trim() || "";
          const id = text
            .toLowerCase()
            .replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-zA-Z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim() || `heading-${index}`;
          heading.id = id;
        }
        return {
          id: heading.id,
          text: heading.textContent?.trim() || "",
          level: parseInt(heading.tagName[1]),
        };
      }).filter(h => h.text);

      setHeadings(extractedHeadings);
    };

    // Wait for content to render
    const timeout = setTimeout(updateHeadings, 200);
    return () => clearTimeout(timeout);
  }, [article]);

  // Reading progress and scroll spy
  useEffect(() => {
    const handleScroll = () => {
      if (!articleRef.current) return;
      
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const trackLength = documentHeight - windowHeight;
      const progress = Math.min((scrollTop / trackLength) * 100, 100);
      setReadingProgress(progress);

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

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call
    return () => window.removeEventListener("scroll", handleScroll);
  }, [article]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const top = element.offsetTop - offset;
      window.scrollTo({
        top,
        behavior: "smooth",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = article?.title || "";

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

  const structuredData = article
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        image: article.cover,
        datePublished: article.publishedAt,
        dateModified: article.publishedAt,
        author: {
          "@type": "Person",
          name: article.author?.name || "SharifGPT",
          image: article.author?.avatar,
        },
        publisher: {
          "@type": "Organization",
          name: "SharifGPT",
          logo: {
            "@type": "ImageObject",
            url: "https://sharifgpt.ai/logo.png",
          },
        },
        description: article.excerpt || article.title,
      }
    : null;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground font-vazirmatn">در حال بارگذاری...</div>
      </div>
    );
  }

  // 404 state
  if (!article || fetchError) {
    return (
      <div dir="rtl" className="min-h-screen flex flex-col">
        <Header onSearch={() => {}} active="blog" />
        <main className="flex-1 flex items-center justify-center pt-[84px] px-4">
          <div className="text-center max-w-md">
            <h1 className="font-vazirmatn text-2xl font-bold text-foreground mb-4">
              مقاله یافت نشد
            </h1>
            <p className="font-vazirmatn text-muted-foreground mb-6">
              {fetchError || "مقاله مورد نظر وجود ندارد."}
            </p>
            <SurfaceGlass className="inline-block">
              <Link
                to="/blog"
                className="font-vazirmatn px-6 py-3 rounded-lg hover:bg-surface-glass/50 transition-colors block"
              >
                بازگشت به مقالات
              </Link>
            </SurfaceGlass>
          </div>
        </main>
        <Footer
          links={{
            products: "/products",
            magazine: "/blog",
            courses: "/courses",
            pricing: "/pricing",
            support: "/support",
          }}
          socials={[]}
        />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          {article?.seo?.metaTitle || `${article.title} - مجله SharifGPT`}
        </title>
        <meta
          name="description"
          content={article?.seo?.metaDescription || article?.excerpt || "مقاله‌ای از مجله SharifGPT"}
        />
        <link
          rel="canonical"
          href={article?.seo?.canonicalUrl || `${window.location.origin}/blog/${slug}`}
        />
        {article?.seo?.robotsMeta && <meta name="robots" content={article.seo.robotsMeta} />}
        <meta property="og:type" content="article" />
        <meta
          property="og:title"
          content={article?.seo?.openGraphTitle || article?.seo?.metaTitle || article?.title || "SharifGPT"}
        />
        <meta
          property="og:description"
          content={article?.seo?.openGraphDescription || article?.seo?.metaDescription || article?.excerpt || "مقاله‌ای از مجله SharifGPT"}
        />
        <meta
          property="og:url"
          content={article?.seo?.canonicalUrl || `${window.location.origin}/blog/${slug}`}
        />
        {(article?.seo?.openGraphImage || article?.cover) && (
          <meta property="og:image" content={article?.seo?.openGraphImage || article?.cover} />
        )}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={article?.seo?.openGraphTitle || article?.seo?.metaTitle || article?.title || "SharifGPT"}
        />
        <meta
          name="twitter:description"
          content={article?.seo?.openGraphDescription || article?.seo?.metaDescription || article?.excerpt || "مقاله‌ای از مجله SharifGPT"}
        />
        {(article?.seo?.openGraphImage || article?.cover) && (
          <meta name="twitter:image" content={article?.seo?.openGraphImage || article?.cover} />
        )}
        {article?.publishedAt && (
          <meta property="article:published_time" content={article.publishedAt} />
        )}
        {article?.author?.name && (
          <meta property="article:author" content={article.author.name} />
        )}
        {(article?.tags ?? []).map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
        {structuredData && (
          <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        )}
        {article?.seo?.structuredData && (
          <script type="application/ld+json">{article.seo.structuredData}</script>
        )}
      </Helmet>

      {/* Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 z-50 transition-all duration-150"
        style={{
          width: `${readingProgress}%`,
          background: "linear-gradient(to right, hsl(var(--primary)), hsl(217 91% 60%))",
        }}
      />

      <div dir="rtl" className="min-h-screen flex flex-col">
        <Header onSearch={() => {}} active="blog" />

        <main className="flex-1 pt-[84px]">
          {/* Page Container */}
          <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center gap-2 font-vazirmatn text-sm font-normal leading-[1.4]">
              <Link
                to="/"
                className="text-muted-foreground hover:text-foreground transition-colors max-w-[200px] md:max-w-[400px] truncate"
              >
                خانه
              </Link>
              <ChevronLeft
                className={cn("w-4 h-4 text-muted-foreground", isRTL && "rotate-180")}
              />
              <Link
                to="/blog"
                className="text-muted-foreground hover:text-foreground transition-colors max-w-[200px] md:max-w-[400px] truncate"
              >
                مقالات
              </Link>
              <ChevronLeft
                className={cn("w-4 h-4 text-muted-foreground", isRTL && "rotate-180")}
              />
              <span className="text-foreground max-w-[200px] md:max-w-[400px] truncate">
                {article.title}
              </span>
            </nav>

            {/* Two-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 lg:gap-12">
              {/* Main Article Column */}
              <article>
                {/* Cover Image */}
                {article.cover && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative mb-8 rounded-3xl overflow-hidden ring-1 ring-white/12"
                  >
                    <img
                      src={article.cover}
                      alt={article.title}
                      className="w-full aspect-[2/1] object-cover"
                      loading="lazy"
                    />
                    {/* Overlay gradient */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.4), transparent, rgba(0,0,0,0.2))",
                      }}
                    />
                  </motion.div>
                )}

                {/* Title */}
                <h1 className="font-vazirmatn text-[30px] md:text-[36px] lg:text-[48px] font-black leading-[1.2] text-foreground mb-6">
                  {article.title}
                </h1>

                {/* Author Row */}
                <div className="flex items-center gap-3 mb-4">
                  {article.author?.avatar ? (
                    <img
                      src={article.author.avatar}
                      alt={article.author?.name || ""}
                      className="w-10 h-10 rounded-full ring-1 ring-white/20 bg-white/10 object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full ring-1 ring-white/20 bg-white/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                  <span className="font-vazirmatn text-base font-medium leading-[1.4] text-foreground">
                    {article.author?.name || "SharifGPT"}
                  </span>
                </div>

                {/* Meta Row */}
                <div className="flex items-center gap-4 mb-6 font-vazirmatn text-sm font-normal leading-[1.4] text-muted-foreground">
                  {article.publishedAt && (
                    <>
                      <span>{formatDate(article.publishedAt)}</span>
                      <span className="text-white/30">•</span>
                    </>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {article.readTime ?? 0} دقیقه
                  </span>
                </div>

                {/* Share Row */}
                <div className="flex items-center gap-3 pb-8 mb-8 border-b border-white/10">
                  <span className="font-vazirmatn text-sm font-normal leading-[1.4] text-muted-foreground">
                    اشتراک:
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleShare("twitter")}
                      className="w-9 h-9 rounded-full glass border border-white/20 hover:bg-white/10 transition-all flex items-center justify-center"
                      aria-label="Share on Twitter"
                    >
                      <Twitter className="w-4 h-4 text-foreground" />
                    </button>
                    <button
                      onClick={() => handleShare("facebook")}
                      className="w-9 h-9 rounded-full glass border border-white/20 hover:bg-white/10 transition-all flex items-center justify-center"
                      aria-label="Share on Facebook"
                    >
                      <Facebook className="w-4 h-4 text-foreground" />
                    </button>
                    <button
                      onClick={() => handleShare("linkedin")}
                      className="w-9 h-9 rounded-full glass border border-white/20 hover:bg-white/10 transition-all flex items-center justify-center"
                      aria-label="Share on LinkedIn"
                    >
                      <Linkedin className="w-4 h-4 text-foreground" />
                    </button>
                    <button
                      onClick={() => handleShare("copy")}
                      className="w-9 h-9 rounded-full glass border border-white/20 hover:bg-white/10 transition-all flex items-center justify-center"
                      aria-label="Copy link"
                    >
                      <Link2 className="w-4 h-4 text-foreground" />
                    </button>
                  </div>
                </div>

                {/* Tags Row */}
                {article.tags && article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {article.tags.map(tag => (
                      <span
                        key={tag}
                        className="font-vazirmatn text-sm font-normal leading-[1.4] text-foreground px-4 py-1.5 rounded-full glass border border-white/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Article Body */}
                <div
                  ref={articleRef}
                  className="prose prose-lg max-w-none font-vazirmatn"
                  dir="rtl"
                >
                  {article.bodyMarkdown && article.bodyMarkdown.trim() ? (
                    <EnhancedMarkdownRenderer content={article.bodyMarkdown} />
                  ) : article.body && Array.isArray(article.body) && article.body.length > 0 ? (
                    <PortableText value={article.body} components={portableTextComponents} />
                  ) : (
                    <p className="font-vazirmatn text-muted-foreground text-center py-8">
                      محتوای این مقاله در دسترس نیست.
                    </p>
                  )}
                </div>
              </article>

              {/* Sidebar - Table of Contents */}
              <aside className="hidden lg:block">
                <div className="sticky top-24">
                  <SurfaceGlass className="p-6 rounded-2xl border border-white/20">
                    <h3 className="font-vazirmatn text-lg font-bold leading-[1.4] text-foreground mb-4">
                      فهرست مطالب
                    </h3>
                    <nav className="space-y-1" dir="rtl">
                      {headings.length > 0 ? (
                        headings.map((heading) => (
                          <button
                            key={heading.id}
                            onClick={() => scrollToHeading(heading.id)}
                            className={cn(
                              "block w-full text-right py-2 px-3 rounded-lg transition-colors font-vazirmatn text-sm leading-[1.4]",
                              heading.level === 1
                                ? "font-bold"
                                : heading.level === 2
                                ? "pr-3"
                                : "pr-6 text-xs",
                              activeHeading === heading.id
                                ? "bg-primary/20 text-primary font-semibold"
                                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                            )}
                          >
                            {heading.text}
                          </button>
                        ))
                      ) : (
                        <p className="font-vazirmatn text-sm text-muted-foreground text-right">
                          فهرست مطالب در دسترس نیست
                        </p>
                      )}
                    </nav>
                  </SurfaceGlass>
                </div>
              </aside>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <section className="mt-16 pt-12 border-t border-white/10">
                <h2 className="font-vazirmatn text-2xl md:text-[30px] font-bold leading-[1.3] text-foreground mb-8">
                  مقالات مرتبط
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedPosts.map(post => (
                    <BlogCard key={post.slug} post={post} />
                  ))}
                </div>
              </section>
            )}
          </div>
        </main>

        <Footer
          links={{
            products: "/products",
            magazine: "/blog",
            courses: "/courses",
            pricing: "/pricing",
            support: "/support",
          }}
          socials={[]}
        />
      </div>

      {/* Prose Styles */}
      <style>{`
        .prose {
          color: hsl(var(--muted-foreground));
        }

        .prose h2 {
          font-family: 'Vazirmatn', sans-serif;
          font-size: 28px;
          font-weight: 800;
          line-height: 1.3;
          margin-top: 3rem;
          margin-bottom: 1.5rem;
          color: hsl(var(--foreground));
          scroll-margin-top: 6rem;
        }

        .prose h3 {
          font-family: 'Vazirmatn', sans-serif;
          font-size: 22px;
          font-weight: 700;
          line-height: 1.35;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: hsl(var(--foreground));
          scroll-margin-top: 6rem;
        }

        .prose p {
          font-family: 'Vazirmatn', sans-serif;
          font-size: 18px;
          font-weight: 400;
          line-height: 1.9;
          margin-bottom: 1.5rem;
          color: hsl(var(--muted-foreground));
        }

        .prose ul,
        .prose ol {
          font-family: 'Vazirmatn', sans-serif;
          font-size: 18px;
          font-weight: 400;
          line-height: 1.7;
          margin-bottom: 1.5rem;
          padding-right: 1.25rem;
        }

        .prose li {
          margin-bottom: 0.5rem;
          color: hsl(var(--muted-foreground));
        }

        .prose blockquote {
          font-family: 'Vazirmatn', sans-serif;
          border-right: 4px solid hsl(var(--primary));
          padding-right: 1.5rem;
          padding-top: 1rem;
          padding-bottom: 1rem;
          margin: 2rem 0;
          background: hsl(var(--primary) / 0.1);
          border-radius: 12px;
          font-style: italic;
        }

        .prose blockquote p {
          margin: 0;
          color: hsl(var(--foreground));
        }

        .prose pre {
          font-family: 'Courier New', monospace;
          background: hsl(var(--surface-glass));
          border: 1px solid hsl(var(--border-glass));
          border-radius: 16px;
          padding: 1.5rem;
          margin: 2rem 0;
          overflow-x: auto;
        }

        .prose code {
          font-family: 'Courier New', monospace;
          font-size: 0.875em;
          color: hsl(var(--primary));
        }

        .prose pre code {
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
    </>
  );
}
