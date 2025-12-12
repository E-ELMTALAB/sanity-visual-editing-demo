import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Clock, Share2, Facebook, Twitter, Linkedin, Link2, ChevronLeft, ArrowRight, ArrowLeft, ChevronDown } from "lucide-react";
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
  bodyMarkdown?: string; // Markdown content for blog posts
  excerpt?: string;
  seo?: SeoMeta;
}

// Helper function to extract headings from markdown content (same as ProductDetail)
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

const portableTextComponents = {
  block: {
    normal: ({ children }: { children: React.ReactNode }) => (
      <p className="text-base leading-8 text-muted-foreground">{children}</p>
    ),
    h2: ({ children }: { children: React.ReactNode }) => (
      <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">{children}</h2>
    ),
    h3: ({ children }: { children: React.ReactNode }) => (
      <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">{children}</h3>
    ),
    blockquote: ({ children }: { children: React.ReactNode }) => (
      <blockquote className="border-r-4 border-primary/40 pr-4 py-2 my-6 italic text-foreground/80">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: { children: React.ReactNode }) => (
      <ul className="list-disc pr-5 space-y-2 text-muted-foreground">{children}</ul>
    ),
    number: ({ children }: { children: React.ReactNode }) => (
      <ol className="list-decimal pr-5 space-y-2 text-muted-foreground">{children}</ol>
    ),
  },
  marks: {
    link: ({ children, value }: { children: React.ReactNode; value: { href?: string } }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline underline-offset-4"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }: { value: any }) => {
      const imageUrl = value?.asset?.url
      const alt = value?.alt || ''
      return imageUrl ? (
        <img
          src={imageUrl}
          alt={alt}
          className="rounded-2xl my-6 ring-1 ring-white/10 w-full object-cover"
          loading="lazy"
        />
      ) : null
    },
  },
}
const springTransition = {
  type: "spring" as const,
  stiffness: 220,
  damping: 28,
};

export default function BlogPost() {
  const {
    slug
  } = useParams();
  const navigate = useNavigate();
  const { isRTL } = useDirection();
  const [readingProgress, setReadingProgress] = useState(0);
  const [activeHeading, setActiveHeading] = useState("");
  const [tocOpen, setTocOpen] = useState(false);
  const [headings, setHeadings] = useState<{
    id: string;
    text: string;
    level: number;
  }[]>([]);
  const [tocHeadings, setTocHeadings] = useState<Array<{ level: number; text: string; id: string }>>([]);
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const articleRef = useRef<HTMLDivElement>(null);

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

  // Extract headings from content (enhanced version for both markdown and PortableText)
  useEffect(() => {
    if (article?.bodyMarkdown) {
      // For markdown content: extract directly from markdown
      const headings = extractHeadingsFromMarkdown(article.bodyMarkdown);
      setTocHeadings(headings);
      setHeadings(headings.map(h => ({ id: h.id, text: h.text, level: h.level })));
    } else if (article?.body) {
      // For PortableText content: wait for render then extract from DOM
      const updateHeadings = () => {
        if (!articleRef.current) return;

        // Find all h1, h2, h3, h4, h5, h6 elements within the article
        const headingElements = articleRef.current.querySelectorAll("h1, h2, h3, h4, h5, h6");

        const extractedHeadings = Array.from(headingElements).map((heading, index) => {
          // Generate unique ID if not present
          if (!heading.id) {
            heading.id = `heading-${index}`;
          }
          return {
            id: heading.id,
            text: heading.textContent?.trim() || "",
            level: parseInt(heading.tagName[1]) // h1=1, h2=2, etc.
          };
        }).filter(h => h.text); // Remove empty headings

        setHeadings(extractedHeadings);
        setTocHeadings(extractedHeadings.map(h => ({
          level: h.level,
          text: h.text,
          id: h.id
        })));
      };

      // Use a small delay to ensure PortableText has rendered
      const timeout = setTimeout(updateHeadings, 100);
      return () => clearTimeout(timeout);
    } else {
      // No content available
      setHeadings([]);
      setTocHeadings([]);
    }
  }, [article]);

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
  const shareTitle = article?.title || "";
  const prevPost = relatedPosts[0];
  const nextPost = relatedPosts[1];
  const remainingRelatedPosts = relatedPosts.slice(2);
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
        <div className="animate-pulse text-muted-foreground">در حال بارگذاری...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">{fetchError ?? "مقاله یافت نشد"}</div>
      </div>
    );
  }

  return <>
      <Helmet>
        <title>
          {article?.seo?.metaTitle || (article ? `${article.title} - مجله SharifGPT` : "مجله SharifGPT")}
        </title>
        <meta
          name="description"
          content={
            article?.seo?.metaDescription || article?.excerpt || "مقاله‌ای از مجله SharifGPT"
          }
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
        { (article?.seo?.openGraphImage || article?.cover) && (
          <meta property="og:image" content={article?.seo?.openGraphImage || article?.cover} />
        )}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article?.seo?.openGraphTitle || article?.seo?.metaTitle || article?.title || "SharifGPT"} />
        <meta name="twitter:description" content={article?.seo?.openGraphDescription || article?.seo?.metaDescription || article?.excerpt || "مقاله‌ای از مجله SharifGPT"} />
        { (article?.seo?.openGraphImage || article?.cover) && (
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
      <motion.div className="fixed top-0 left-0 h-1 bg-gradient-to-r from-primary to-secondary z-50" style={{
      width: `${readingProgress}%`
    }} />

      <div className="min-h-screen flex flex-col">
        <Header onSearch={() => {}} active="blog" />

        <main className="flex-1 py-16">
          <div className="max-w-[1600px] px-4 md:px-6 lg:px-8 mx-auto my-[75px]">
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
                  <span className="text-foreground">{article?.title}</span>
                </nav>

                {/* Cover Image */}
                <motion.div initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} className="mb-8">
                  {article?.cover && (
                    <img
                      src={article.cover}
                      alt={article.title}
                      loading="lazy"
                      className="w-full aspect-[2/1] object-cover rounded-3xl ring-1 ring-white/12"
                    />
                  )}
                </motion.div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-black mb-6">
                  {article?.title}
                </h1>

                {/* Meta Row */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-8 border-b border-white/10">
                  <div className="flex items-center gap-4">
                    {article?.author?.avatar && (
                      <img
                        src={article.author.avatar}
                        alt={article.author?.name || ""}
                        loading="lazy"
                        className="w-12 h-12 rounded-full ring-2 ring-white/20"
                      />
                    )}
                    <div>
                      <p className="font-semibold">{article?.author?.name}</p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        {article?.publishedAt && <span>{formatDate(article.publishedAt)}</span>}
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {article?.readTime ?? 0} دقیقه
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
                  {(article?.tags ?? []).map(tag => <span key={tag} className="glass border border-white/20 rounded-full px-4 py-1.5 text-sm">
                      {tag}
                    </span>)}
                </div>

                {/* Mobile TOC - positioned right above article content */}
                <div className="lg:hidden mb-6">
                  <button
                    onClick={() => setTocOpen(!tocOpen)}
                    className="w-full flex items-center justify-between p-4 glass rounded-lg hover:bg-surface-glass/50 transition-colors"
                  >
                    <span className="font-semibold">فهرست مطالب</span>
                    <ChevronDown className={cn("w-5 h-5 transition-transform", tocOpen && "rotate-180")} />
                  </button>
                  {tocOpen && (
                    <nav className="mt-3 space-y-1 p-4 glass rounded-lg" dir="rtl">
                      {tocHeadings.length > 0 ? (
                        tocHeadings.map((heading) => (
                          <button
                            key={heading.id}
                            onClick={() => {
                              scrollToHeading(heading.id);
                              setTocOpen(false);
                            }}
                            className={cn(
                              "block w-full text-right py-2 rounded-lg transition-colors text-sm",
                              heading.level === 1 ? "pr-3 font-bold text-base" :
                              heading.level === 2 ? "pr-3 font-semibold" :
                              heading.level === 3 ? "pr-6 text-xs" :
                              "pr-9 text-xs",
                              activeHeading === heading.id ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            {heading.text}
                          </button>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground text-right">
                          فهرست مطالب در دسترس نیست
                        </p>
                      )}
                    </nav>
                  )}
                </div>

                {/* Article Body */}
                <div ref={articleRef} className="prose prose-invert prose-lg max-w-none" dir="rtl">
                  {article?.bodyMarkdown && article.bodyMarkdown.trim() ? (
                    // Use EnhancedMarkdownRenderer for markdown content
                    <EnhancedMarkdownRenderer content={article.bodyMarkdown} />
                  ) : article?.body && Array.isArray(article.body) && article.body.length > 0 ? (
                    // Fallback to PortableText for Sanity rich text
                    <PortableText value={article.body} components={portableTextComponents} />
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      محتوای این مقاله در دسترس نیست.
                    </p>
                  )}
                </div>

                {(prevPost || nextPost) && (
                <div className="grid md:grid-cols-2 gap-4 mt-12 pt-12 border-t border-white/10">
                    {prevPost && (
                      <Link
                        to={`/blog/${prevPost.slug}`}
                        className="glass border border-white/20 rounded-xl p-6 hover:border-primary/40 transition-all group"
                      >
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <ArrowRight className="w-4 h-4" />
                      <span>مقاله قبلی</span>
                    </div>
                        <h3 className="font-bold group-hover:text-primary transition-colors line-clamp-2">
                          {prevPost.title}
                    </h3>
                  </Link>
                    )}

                    {nextPost && (
                      <Link
                        to={`/blog/${nextPost.slug}`}
                        className="glass border border-white/20 rounded-xl p-6 hover:border-primary/40 transition-all group text-left"
                      >
                    <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground mb-2">
                      <span>مقاله بعدی</span>
                      <ArrowLeft className="w-4 h-4" />
                    </div>
                        <h3 className="font-bold group-hover:text-primary transition-colors line-clamp-2">
                          {nextPost.title}
                    </h3>
                  </Link>
                    )}
                </div>
                )}
              </article>

              {/* Sidebar - Table of Contents (same style as ProductDetail) */}
              <aside className="hidden lg:block w-[280px] xl:w-[320px] shrink-0">
                <div className="sticky top-24">
                  <SurfaceGlass className="p-6">
                    <h3 className="font-bold text-lg mb-4 text-foreground">فهرست مطالب</h3>
                    <nav className="space-y-1" dir="rtl">
                      {tocHeadings.length > 0 ? (
                        tocHeadings.map((heading) => (
                          <button
                            key={heading.id}
                            onClick={() => scrollToHeading(heading.id)}
                            className={cn(
                              "block w-full text-right py-2 rounded-lg transition-colors",
                              heading.level === 1 ? "pr-3 font-bold text-base" :
                              heading.level === 2 ? "pr-3 font-semibold" :
                              heading.level === 3 ? "pr-6 text-xs" :
                              "pr-9 text-xs",
                              activeHeading === heading.id ? "bg-surface-glass text-primary font-medium" : "text-muted-foreground hover:bg-surface-glass/50 hover:text-foreground"
                            )}
                          >
                            {heading.text}
                          </button>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground text-right pr-3">
                          فهرست مطالب در دسترس نیست
                        </p>
                      )}
                    </nav>
                  </SurfaceGlass>
                </div>
              </aside>
            </div>

            {/* Related Posts */}
            {remainingRelatedPosts.length > 0 && (
            <section className="mt-16 w-full max-w-[820px] mx-auto">
              <h2 className="text-3xl font-bold mb-8">مقالات مرتبط</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {remainingRelatedPosts.map(post => (
                    <BlogCard key={post.slug} post={post} />
                  ))}
              </div>
            </section>
            )}
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