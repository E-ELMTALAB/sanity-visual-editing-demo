import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Clock, Facebook, Twitter, Linkedin, Link2, ChevronLeft, User } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer/Footer";
import { Button } from "@/components/ui/button";
import { BlogCard } from "@/components/Blog/BlogCard";
import { SurfaceGlass } from "@/components/ui/surface-glass";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { PortableText } from "@portabletext/react";
import { fetchFromSanity } from "@/lib/sanity.client.light";
import { validateSanityConfig } from "@/lib/sanity.config";
import { postBySlugQuery } from "@/lib/sanity.queries";
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

// Extract headings from markdown and create ToC structure
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

// PortableText components with proper IDs for scroll-spy
const portableTextComponents = {
  block: {
    normal: ({ children }: { children: React.ReactNode }) => (
      <p className="font-vazirmatn text-lg font-normal leading-[1.9] text-muted-foreground mb-6">{children}</p>
    ),
    h2: ({ children }: { children: React.ReactNode }) => {
      const text = children?.toString() || '';
      const id = `heading-${text.toLowerCase().replace(/\s+/g, '-').replace(/[^\u0600-\u06FFa-z0-9-]/g, '')}`;
      return (
        <h2 id={id} className="font-vazirmatn text-[28px] font-extrabold leading-[1.3] text-foreground mt-12 mb-6 scroll-mt-24">
          {children}
        </h2>
      );
    },
    h3: ({ children }: { children: React.ReactNode }) => {
      const text = children?.toString() || '';
      const id = `heading-${text.toLowerCase().replace(/\s+/g, '-').replace(/[^\u0600-\u06FFa-z0-9-]/g, '')}`;
      return (
        <h3 id={id} className="font-vazirmatn text-[22px] font-bold leading-[1.35] text-foreground mt-8 mb-4 scroll-mt-24">
          {children}
        </h3>
      );
    },
    blockquote: ({ children }: { children: React.ReactNode }) => (
      <blockquote className="font-vazirmatn border-r-4 border-primary pr-4 py-3 my-6 rounded-xl bg-primary/10 italic text-foreground">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: { children: React.ReactNode }) => (
      <ul className="font-vazirmatn text-lg font-normal leading-[1.7] text-muted-foreground list-disc pr-5 space-y-2 mb-6">{children}</ul>
    ),
    number: ({ children }: { children: React.ReactNode }) => (
      <ol className="font-vazirmatn text-lg font-normal leading-[1.7] text-muted-foreground list-decimal pr-5 space-y-2 mb-6">{children}</ol>
    ),
  },
  marks: {
    link: ({ children, value }: { children: React.ReactNode; value: { href?: string } }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline underline-offset-4 hover:no-underline"
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
          className="rounded-2xl my-6 ring-1 ring-white/12 w-full object-cover"
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
  const [activeHeading, setActiveHeading] = useState<string>("");
  const [headings, setHeadings] = useState<Array<{ level: number; text: string; id: string }>>([]);
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const articleRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const isConfigValid = validateSanityConfig();
    if (!isConfigValid || !slug) {
      setIsLoading(false);
      setFetchError("پیکربندی Sanity کامل نیست");
      return;
    }

    let isMounted = true;

    async function loadArticle() {
      try {
        setIsLoading(true);
        const result = await fetchFromSanity<any>(postBySlugQuery, { slug });

        if (!isMounted) return;

        if (!result) {
          setFetchError("مقاله مورد نظر یافت نشد");
          return;
        }

        setArticle(transformBlogPostDetail(result));

        const transformedRelated = Array.isArray(result?.relatedPosts)
          ? result.relatedPosts.map((item: any, index: number) => transformBlogPost(item, index))
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

  // Extract headings and set up scroll-spy
  useEffect(() => {
    if (article?.bodyMarkdown) {
      const extractedHeadings = extractHeadingsFromMarkdown(article.bodyMarkdown);
      setHeadings(extractedHeadings);
      // Set first heading as active by default
      if (extractedHeadings.length > 0) {
        setActiveHeading(extractedHeadings[0].id);
      }
    } else if (article?.body) {
      const updateHeadings = () => {
        if (!articleRef.current) return;
        const headingElements = articleRef.current.querySelectorAll("h2, h3");
        const extractedHeadings = Array.from(headingElements).map((heading, index) => {
          if (!heading.id) {
            heading.id = `heading-${index}`;
          }
          return {
            id: heading.id,
            text: heading.textContent?.trim() || "",
            level: parseInt(heading.tagName[1]),
          };
        }).filter(h => h.text);
        setHeadings(extractedHeadings);
        // Set first heading as active by default
        if (extractedHeadings.length > 0) {
          setActiveHeading(extractedHeadings[0].id);
        }
      };
      const timeout = setTimeout(updateHeadings, 200);
      return () => clearTimeout(timeout);
    } else {
      setHeadings([]);
    }
  }, [article]);

  // IntersectionObserver for scroll-spy
  useEffect(() => {
    if (!articleRef.current || headings.length === 0) return;

    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveHeading(entry.target.id);
        }
      });
    }, observerOptions);

    // Observe all headings
    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [headings]);

  // Reading progress
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const trackLength = documentHeight - windowHeight;
      const progress = Math.min((scrollTop / trackLength) * 100, 100);
      setReadingProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const top = element.offsetTop - offset;
      window.scrollTo({ top, behavior: "smooth" });
      setActiveHeading(id);
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground font-vazirmatn">در حال بارگذاری...</div>
      </div>
    );
  }

  if (!article || fetchError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4" dir="rtl">
        <h1 className="font-vazirmatn text-2xl font-bold text-foreground mb-4">مقاله یافت نشد</h1>
        <Button
          onClick={() => navigate("/blog")}
          className="glass border border-white/20"
        >
          بازگشت به مقالات
        </Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          {article?.seo?.metaTitle || (article ? `${article.title} - مجله SharifGPT` : "مجله SharifGPT")}
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
        <meta property="og:title" content={article?.seo?.openGraphTitle || article?.seo?.metaTitle || article?.title || "SharifGPT"} />
        <meta property="og:description" content={article?.seo?.openGraphDescription || article?.seo?.metaDescription || article?.excerpt || "مقاله‌ای از مجله SharifGPT"} />
        <meta property="og:url" content={article?.seo?.canonicalUrl || `${window.location.origin}/blog/${slug}`} />
        {(article?.seo?.openGraphImage || article?.cover) && (
          <meta property="og:image" content={article?.seo?.openGraphImage || article?.cover} />
        )}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article?.seo?.openGraphTitle || article?.seo?.metaTitle || article?.title || "SharifGPT"} />
        <meta name="twitter:description" content={article?.seo?.openGraphDescription || article?.seo?.metaDescription || article?.excerpt || "مقاله‌ای از مجله SharifGPT"} />
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

      <div className="min-h-screen flex flex-col" dir="rtl">
        <Header onSearch={() => {}} active="blog" />

        <main className="flex-1 pt-[84px]">
          <div className="w-full px-4 md:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center gap-2 font-vazirmatn text-sm font-normal leading-[1.4] max-w-[1400px] mx-auto">
              <Link
                to="/"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                خانه
              </Link>
              <ChevronLeft
                className={cn("w-4 h-4 text-muted-foreground", isRTL && "rotate-180")}
              />
              <Link
                to="/blog"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                مقالات
              </Link>
              <ChevronLeft
                className={cn("w-4 h-4 text-muted-foreground", isRTL && "rotate-180")}
              />
              <span className="text-foreground max-w-[200px] md:max-w-[400px] truncate">
                {article?.title}
              </span>
            </nav>

            {/* Two-Column Layout - Left Sidebar, Right Content */}
            <div className="max-w-[1400px] mx-auto flex gap-8 lg:gap-12">
              {/* LEFT SIDEBAR - Table of Contents */}
              <aside className="hidden lg:block w-[280px] shrink-0">
                <div className="sticky top-24">
                  <SurfaceGlass
                    variant="default"
                    className="p-6 rounded-2xl border border-white/20 backdrop-blur-xl"
                  >
                    <h3 className="font-vazirmatn text-lg font-bold leading-[1.4] text-foreground mb-4">
                      فهرست مطالب
                    </h3>
                    <nav className="space-y-1.5" dir="rtl">
                      {headings.length > 0 ? (
                        headings.map((heading) => (
                          <button
                            key={heading.id}
                            onClick={() => scrollToHeading(heading.id)}
                            className={cn(
                              "block w-full text-right py-2.5 px-4 rounded-lg transition-all duration-200 font-vazirmatn text-sm leading-[1.4]",
                              heading.level === 1
                                ? "font-semibold"
                                : heading.level === 2
                                ? "pr-4 font-medium"
                                : "pr-8 font-normal text-xs",
                              activeHeading === heading.id
                                ? "bg-primary/20 text-primary font-semibold shadow-sm"
                                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                            )}
                          >
                            {heading.text}
                          </button>
                        ))
                      ) : (
                        <p className="font-vazirmatn text-sm text-muted-foreground text-right py-2">
                          فهرست مطالب در دسترس نیست
                        </p>
                      )}
                    </nav>
                  </SurfaceGlass>
                </div>
              </aside>

              {/* RIGHT CONTENT - Main Article */}
              <article className="flex-1 min-w-0">
                {/* Cover Image */}
                {article?.cover && (
                  <div className="mb-8 relative rounded-3xl overflow-hidden aspect-[2/1] ring-1 ring-white/12">
                    <img
                      src={article.cover}
                      alt={article.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        backgroundImage:
                          "linear-gradient(to top, rgba(0,0,0,0.4), transparent, rgba(0,0,0,0.2))",
                      }}
                    />
                  </div>
                )}

                {/* Title */}
                <h1 className="font-vazirmatn text-[30px] md:text-[36px] lg:text-[48px] font-black leading-[1.2] text-foreground mb-6">
                  {article?.title}
                </h1>

                {/* Author Row */}
                <div className="flex items-center gap-3 mb-4">
                  {article?.author?.avatar ? (
                    <img
                      src={article.author.avatar}
                      alt={article.author?.name || ""}
                      loading="lazy"
                      className="w-10 h-10 rounded-full bg-white/10 ring-1 ring-white/20"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-white/10 ring-1 ring-white/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                  <span className="font-vazirmatn text-base font-medium leading-[1.4] text-foreground">
                    {article?.author?.name || "SharifGPT"}
                  </span>
                </div>

                {/* Meta Row */}
                <div className="flex flex-wrap items-center gap-4 mb-6 font-vazirmatn text-sm font-normal leading-[1.4] text-muted-foreground">
                  {article?.publishedAt && <span>{formatDate(article.publishedAt)}</span>}
                  <span className="text-white/30">•</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {article?.readTime ?? 0} دقیقه مطالعه
                  </span>
                </div>

                {/* Share Row */}
                <div className="flex items-center gap-3 pb-8 mb-8 border-b border-white/10">
                  <span className="font-vazirmatn text-sm font-normal leading-[1.4] text-muted-foreground">
                    اشتراک:
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleShare("copy")}
                      className="w-9 h-9 rounded-full glass border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
                      aria-label="Copy link"
                    >
                      <Link2 className="w-4 h-4 text-foreground" />
                    </button>
                    <button
                      onClick={() => handleShare("linkedin")}
                      className="w-9 h-9 rounded-full glass border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
                      aria-label="Share on LinkedIn"
                    >
                      <Linkedin className="w-4 h-4 text-foreground" />
                    </button>
                    <button
                      onClick={() => handleShare("facebook")}
                      className="w-9 h-9 rounded-full glass border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
                      aria-label="Share on Facebook"
                    >
                      <Facebook className="w-4 h-4 text-foreground" />
                    </button>
                    <button
                      onClick={() => handleShare("twitter")}
                      className="w-9 h-9 rounded-full glass border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
                      aria-label="Share on Twitter"
                    >
                      <Twitter className="w-4 h-4 text-foreground" />
                    </button>
                  </div>
                </div>

                {/* Tags Row */}
                {article?.tags && article.tags.length > 0 && (
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
                  className="prose-blog font-vazirmatn"
                  dir="rtl"
                >
                  {article?.bodyMarkdown && article.bodyMarkdown.trim() ? (
                    <EnhancedMarkdownRenderer content={article.bodyMarkdown} />
                  ) : article?.body && Array.isArray(article.body) && article.body.length > 0 ? (
                    <PortableText value={article.body} components={portableTextComponents} />
                  ) : (
                    <p className="font-vazirmatn text-lg text-muted-foreground text-center py-8">
                      محتوای این مقاله در دسترس نیست.
                    </p>
                  )}
                </div>
              </article>
            </div>

            {/* Related Posts Section */}
            {relatedPosts.length > 0 && (
              <section className="mt-16 pt-12 border-t border-white/10 max-w-[1400px] mx-auto">
                <h2 className="font-vazirmatn text-2xl md:text-[30px] font-bold leading-[1.3] text-foreground mb-8 text-right">
                  مقالات مرتبط
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedPosts.slice(0, 4).map(post => (
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
            magazine: "/magazine",
            courses: "/courses",
            pricing: "/pricing",
            support: "/support",
          }}
          socials={[]}
        />
      </div>

      <style>{`
        .prose-blog h2 {
          font-family: 'Vazirmatn', sans-serif;
          font-size: 28px;
          font-weight: 800;
          line-height: 1.3;
          color: hsl(var(--foreground));
          margin-top: 3rem;
          margin-bottom: 1.5rem;
          scroll-margin-top: 6rem;
        }

        .prose-blog h3 {
          font-family: 'Vazirmatn', sans-serif;
          font-size: 22px;
          font-weight: 700;
          line-height: 1.35;
          color: hsl(var(--foreground));
          margin-top: 2rem;
          margin-bottom: 1rem;
          scroll-margin-top: 6rem;
        }

        .prose-blog p {
          font-family: 'Vazirmatn', sans-serif;
          font-size: 18px;
          font-weight: 400;
          line-height: 1.9;
          color: hsl(var(--muted-foreground));
          margin-bottom: 1.5rem;
        }

        .prose-blog ul,
        .prose-blog ol {
          font-family: 'Vazirmatn', sans-serif;
          font-size: 18px;
          font-weight: 400;
          line-height: 1.7;
          color: hsl(var(--muted-foreground));
          padding-right: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .prose-blog li {
          margin-bottom: 0.5rem;
        }

        .prose-blog blockquote {
          font-family: 'Vazirmatn', sans-serif;
          border-right: 4px solid hsl(var(--primary));
          background: hsl(var(--primary) / 0.1);
          border-radius: 12px;
          padding: 1rem 1.5rem;
          margin: 2rem 0;
          font-style: italic;
        }

        .prose-blog blockquote p {
          margin: 0;
          color: hsl(var(--foreground));
        }

        .prose-blog code {
          font-family: 'Courier New', monospace;
          font-size: 0.875em;
          color: hsl(var(--primary));
        }

        .prose-blog pre {
          font-family: 'Courier New', monospace;
          background: hsl(var(--surface-glass));
          border: 1px solid hsl(var(--border-glass));
          border-radius: 16px;
          padding: 1.5rem;
          margin: 2rem 0;
          overflow-x: auto;
        }

        .prose-blog pre code {
          color: hsl(var(--foreground));
        }

        .prose-blog a {
          color: hsl(var(--primary));
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .prose-blog a:hover {
          text-decoration: none;
        }
      `}</style>
    </>
  );
}
