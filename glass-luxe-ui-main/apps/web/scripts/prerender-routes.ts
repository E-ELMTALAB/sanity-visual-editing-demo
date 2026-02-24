import { mkdir, readFile, writeFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, "..");
const DIST_DIR = join(PROJECT_ROOT, "dist");
const MANIFEST_PATH = join(PROJECT_ROOT, "src/data/prerender/routes.json");
const DIST_INDEX = join(DIST_DIR, "index.html");
const REPORT_PATH = join(PROJECT_ROOT, "src/data/prerender/prerender-report.json");

type RouteManifest = {
  routes: string[];
};

type PageHead = {
  title: string;
  description: string;
  canonical: string;
  robots?: string;
  ogType?: string;
  ogImage?: string;
  structuredData?: string;
};

type ProductLike = {
  _id?: string;
  name?: string;
  title?: string;
  slug?: string | { current?: string };
  shortDescription?: unknown;
  description?: unknown;
  category?: unknown;
  seo?: {
    metaTitle?: string | null;
    metaDescription?: string | null;
    canonicalUrl?: string | null;
    robotsMeta?: string | null;
    openGraphTitle?: string | null;
    openGraphDescription?: string | null;
    openGraphImage?: unknown;
    structuredData?: string | null;
  };
};

type PostLike = {
  _id?: string;
  title?: string;
  slug?: string | { current?: string };
  excerpt?: unknown;
  seo?: {
    metaTitle?: string | null;
    metaDescription?: string | null;
    canonicalUrl?: string | null;
    robotsMeta?: string | null;
    openGraphTitle?: string | null;
    openGraphDescription?: string | null;
    openGraphImage?: unknown;
    structuredData?: string | null;
  };
};

type CollectionLike = {
  _id?: string;
  title?: string;
  slug?: string | { current?: string };
  description?: unknown;
  seo?: {
    metaTitle?: string | null;
    metaDescription?: string | null;
    canonicalUrl?: string | null;
    robotsMeta?: string | null;
    openGraphTitle?: string | null;
    openGraphDescription?: string | null;
    openGraphImage?: unknown;
    structuredData?: string | null;
  };
};

type CacheModule = {
  homepageCache?: {
    seoContent?: string;
    bestSellerProducts?: readonly ProductLike[];
    seo?: {
      metaTitle?: string | null;
      metaDescription?: string | null;
      canonicalUrl?: string | null;
      robotsMeta?: string | null;
      openGraphTitle?: string | null;
      openGraphDescription?: string | null;
      openGraphImage?: unknown;
      structuredData?: string | null;
    };
  };
  allProductsListCache?: readonly ProductLike[];
  productsCache?: Record<string, ProductLike>;
  postsCache?: Record<string, PostLike>;
  collectionsCache?: Record<string, CollectionLike>;
};

function normalizeRoute(route: string): string {
  const trimmed = route.trim();
  if (!trimmed) return "/";
  const prefixed = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  const clean = prefixed.replace(/\/+$/g, "");
  return clean || "/";
}

function normalizeSlug(value: unknown): string | null {
  if (typeof value === "string") {
    const cleaned = value.trim().replace(/^\/+|\/+$/g, "");
    return cleaned || null;
  }

  if (value && typeof value === "object" && "current" in (value as Record<string, unknown>)) {
    const current = (value as { current?: unknown }).current;
    if (typeof current === "string") {
      const cleaned = current.trim().replace(/^\/+|\/+$/g, "");
      return cleaned || null;
    }
  }

  return null;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildCanonical(route: string): string {
  const base = "https://sharifgpt.com";
  return route === "/" ? `${base}/` : `${base}${route}`;
}

function truncate(text: string, max: number): string {
  const value = text.trim();
  return value.length <= max ? value : `${value.slice(0, max - 1).trim()}…`;
}

function getOpenGraphImageFromUnknown(value: unknown): string | undefined {
  if (!value) return undefined;
  if (typeof value === "string") return value;

  if (typeof value === "object") {
    const candidate = value as Record<string, unknown>;
    if (typeof candidate.url === "string") return candidate.url;
    if (candidate.asset && typeof candidate.asset === "object") {
      const asset = candidate.asset as Record<string, unknown>;
      if (typeof asset.url === "string") return asset.url;
    }
  }

  return undefined;
}

function getPageHead(route: string, cache: CacheModule): PageHead {
  if (route === "/") {
    const seo = cache.homepageCache?.seo;
    return {
      title: seo?.metaTitle || "SharifGPT | محصولات و خدمات هوش مصنوعی",
      description: seo?.metaDescription || "SharifGPT - ارائه محصولات و خدمات هوش مصنوعی",
      canonical: seo?.canonicalUrl || "https://sharifgpt.com/",
      robots: seo?.robotsMeta || "index,follow",
      ogType: "website",
      ogImage: getOpenGraphImageFromUnknown(seo?.openGraphImage) || "/favicon.png",
      structuredData: seo?.structuredData || undefined,
    };
  }

  if (route === "/products") {
    return {
      title: "فروشگاه محصولات دیجیتال | SharifGPT",
      description: "فروشگاه محصولات دیجیتال SharifGPT - خرید اشتراک‌ها، سرویس‌ها و ابزارهای هوش مصنوعی",
      canonical: "https://sharifgpt.com/products",
      robots: "index,follow",
      ogType: "website",
      ogImage: "/favicon.png",
    };
  }

  if (route === "/blog") {
    return {
      title: "مجله SharifGPT | مقالات هوش مصنوعی",
      description: "جدیدترین مقالات، آموزش‌ها و اخبار هوش مصنوعی در مجله SharifGPT",
      canonical: "https://sharifgpt.com/blog",
      robots: "index,follow",
      ogType: "website",
      ogImage: "/favicon.png",
    };
  }

  if (route.startsWith("/products/")) {
    const slug = route.replace("/products/", "");
    const product = cache.productsCache?.[slug];
    const fallback = (cache.allProductsListCache || []).find((item) => normalizeSlug(item.slug) === slug);
    const source = product || fallback;
    const seo = source?.seo;
    const titleBase = source?.title || source?.name || "محصول";
    const descBase =
      extractTextFromPortable(source?.shortDescription) ||
      extractTextFromPortable(source?.description) ||
      "جزئیات محصول، ویژگی‌ها و شرایط خرید در SharifGPT";

    return {
      title: seo?.metaTitle || `${titleBase} | SharifGPT`,
      description: seo?.metaDescription || truncate(descBase, 155),
      canonical: seo?.canonicalUrl || buildCanonical(route),
      robots: seo?.robotsMeta || "index,follow",
      ogType: "product",
      ogImage: getOpenGraphImageFromUnknown(seo?.openGraphImage) || "/favicon.png",
      structuredData: seo?.structuredData || undefined,
    };
  }

  if (route.startsWith("/blog/")) {
    const slug = route.replace("/blog/", "");
    const post = cache.postsCache?.[slug];
    const seo = post?.seo;
    const titleBase = post?.title || "مقاله";
    const descBase = extractTextFromPortable(post?.excerpt) || "مطلبی از مجله SharifGPT";

    return {
      title: seo?.metaTitle || `${titleBase} | SharifGPT`,
      description: seo?.metaDescription || truncate(descBase, 155),
      canonical: seo?.canonicalUrl || buildCanonical(route),
      robots: seo?.robotsMeta || "index,follow",
      ogType: "article",
      ogImage: getOpenGraphImageFromUnknown(seo?.openGraphImage) || "/favicon.png",
      structuredData: seo?.structuredData || undefined,
    };
  }

  if (route.startsWith("/collections/")) {
    const slug = route.replace("/collections/", "");
    const collection = cache.collectionsCache?.[slug];
    const seo = collection?.seo;
    const titleBase = collection?.title || "کلکسیون";
    const descBase = extractTextFromPortable(collection?.description) || "کلکسیون محصولات در SharifGPT";

    return {
      title: seo?.metaTitle || `${titleBase} | SharifGPT`,
      description: seo?.metaDescription || truncate(descBase, 155),
      canonical: seo?.canonicalUrl || buildCanonical(route),
      robots: seo?.robotsMeta || "index,follow",
      ogType: "website",
      ogImage: getOpenGraphImageFromUnknown(seo?.openGraphImage) || "/favicon.png",
      structuredData: seo?.structuredData || undefined,
    };
  }

  return {
    title: "SharifGPT",
    description: "SharifGPT - محصولات و خدمات هوش مصنوعی",
    canonical: buildCanonical(route),
    robots: "index,follow",
    ogType: "website",
    ogImage: "/favicon.png",
  };
}

function stripMarkdown(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/[*_>#-]/g, " ")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTextFromPortable(value: unknown): string {
  if (typeof value === "string") return value;
  if (!value) return "";
  if (Array.isArray(value)) {
    return value
      .map((block) => {
        if (!block || typeof block !== "object") return "";
        const children = (block as Record<string, unknown>).children;
        if (!Array.isArray(children)) return "";
        return children
          .map((child) => {
            if (!child || typeof child !== "object") return "";
            const text = (child as Record<string, unknown>).text;
            return typeof text === "string" ? text : "";
          })
          .join(" ");
      })
      .join(" ");
  }
  return "";
}

function buildRouteContent(route: string, cache: CacheModule): string {
  if (route === "/") {
    const heroTitle = "خرید اکانت ChatGPT";
    const heroSubtitle = "اکانت‌های قانونی ChatGPT با تحویل آنی، اتصال پایدار و پشتیبانی واقعی.";
    const seoText = cache.homepageCache?.seoContent ? truncate(stripMarkdown(cache.homepageCache.seoContent), 500) : "";
    const featured = (cache.homepageCache?.bestSellerProducts || []).slice(0, 8);
    const featuredList = featured
      .map((item) => `<li>${escapeHtml(item.title || item.name || "محصول")}</li>`)
      .join("");

    return `
<section id="prerender-content" dir="rtl">
  <h1>${escapeHtml(heroTitle)}</h1>
  <p>${escapeHtml(heroSubtitle)}</p>
  ${seoText ? `<p>${escapeHtml(seoText)}</p>` : ""}
  ${featuredList ? `<h2>محصولات پیشنهادی</h2><ul>${featuredList}</ul>` : ""}
</section>`.trim();
  }

  if (route.startsWith("/products/")) {
    const slug = route.replace("/products/", "");
    const product = cache.productsCache?.[slug] || (cache.allProductsListCache || []).find((p) => normalizeSlug(p.slug) === slug);
    if (!product) return `<section id="prerender-content" dir="rtl"><h1>محصول</h1></section>`;
    const title = product.title || product.name || "محصول";
    const descSource =
      extractTextFromPortable(product.shortDescription) ||
      extractTextFromPortable(product.description) ||
      "جزئیات این محصول در صفحه ارائه شده است.";
    const desc = truncate(stripMarkdown(descSource), 400);
    const categoryText = extractTextFromPortable(product.category);
    const category = categoryText ? `<p>دسته‌بندی: ${escapeHtml(categoryText)}</p>` : "";
    return `
<section id="prerender-content" dir="rtl">
  <h1>${escapeHtml(title)}</h1>
  <p>${escapeHtml(desc)}</p>
  ${category}
</section>`.trim();
  }

  if (route.startsWith("/blog/")) {
    const slug = route.replace("/blog/", "");
    const post = cache.postsCache?.[slug];
    if (!post) return `<section id="prerender-content" dir="rtl"><h1>مقاله</h1></section>`;
    const title = post.title || "مقاله";
    const excerpt = truncate(stripMarkdown(extractTextFromPortable(post.excerpt) || "جزئیات مقاله در صفحه قابل مشاهده است."), 500);
    return `
<section id="prerender-content" dir="rtl">
  <h1>${escapeHtml(title)}</h1>
  <p>${escapeHtml(excerpt)}</p>
</section>`.trim();
  }

  if (route.startsWith("/collections/")) {
    const slug = route.replace("/collections/", "");
    const collection = cache.collectionsCache?.[slug];
    if (!collection) return `<section id="prerender-content" dir="rtl"><h1>کلکسیون</h1></section>`;
    const title = collection.title || "کلکسیون";
    const description = truncate(
      stripMarkdown(extractTextFromPortable(collection.description) || "جزئیات این کلکسیون در صفحه ارائه شده است."),
      450,
    );
    return `
<section id="prerender-content" dir="rtl">
  <h1>${escapeHtml(title)}</h1>
  <p>${escapeHtml(description)}</p>
</section>`.trim();
  }

  const staticTitleMap: Record<string, string> = {
    "/products": "فروشگاه محصولات",
    "/blog": "مجله و مقالات",
    "/about": "درباره ما",
    "/contact": "تماس با ما",
    "/support": "پشتیبانی",
    "/faq": "سوالات متداول",
    "/team/amir": "تیم - امیر",
    "/team/erfan": "تیم - عرفان",
    "/policies/refund-replacement": "قوانین تعویض و بازگشت",
  };

  const heading = staticTitleMap[route] || "SharifGPT";
  return `<section id="prerender-content" dir="rtl"><h1>${escapeHtml(heading)}</h1></section>`;
}

function buildPrerenderShell(_route: string, contentHtml: string): string {
  return contentHtml;
}

function setTagContent(html: string, matcher: RegExp, replacement: string): string {
  if (matcher.test(html)) {
    return html.replace(matcher, replacement);
  }
  return html;
}

function ensureTagBeforeHeadEnd(html: string, tag: string): string {
  if (html.includes(tag)) return html;
  return html.replace("</head>", `  ${tag}\n  </head>`);
}

function injectHead(baseHtml: string, head: PageHead): string {
  let html = baseHtml;

  html = setTagContent(html, /<title>.*?<\/title>/is, `<title>${escapeHtml(head.title)}</title>`);

  html = setTagContent(
    html,
    /<meta\s+name=["']description["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta name="description" content="${escapeHtml(head.description)}" />`,
  );

  html = setTagContent(
    html,
    /<meta\s+property=["']og:title["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta property="og:title" content="${escapeHtml(head.title)}" />`,
  );

  html = setTagContent(
    html,
    /<meta\s+property=["']og:description["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta property="og:description" content="${escapeHtml(head.description)}" />`,
  );

  html = setTagContent(
    html,
    /<meta\s+property=["']og:type["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta property="og:type" content="${escapeHtml(head.ogType || "website")}" />`,
  );

  html = setTagContent(
    html,
    /<meta\s+property=["']og:image["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta property="og:image" content="${escapeHtml(head.ogImage || "/favicon.png")}" />`,
  );

  html = setTagContent(
    html,
    /<meta\s+name=["']twitter:image["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta name="twitter:image" content="${escapeHtml(head.ogImage || "/favicon.png")}" />`,
  );

  html = setTagContent(
    html,
    /<meta\s+name=["']robots["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta name="robots" content="${escapeHtml(head.robots || "index,follow")}" />`,
  );

  const canonicalTag = `<link rel="canonical" href="${escapeHtml(head.canonical)}" />`;
  if (/<link\s+rel=["']canonical["']/i.test(html)) {
    html = html.replace(/<link\s+rel=["']canonical["']\s+href=["'][^"']*["']\s*\/?>/i, canonicalTag);
  } else {
    html = ensureTagBeforeHeadEnd(html, canonicalTag);
  }

  if (head.structuredData) {
    const jsonLdTag = `<script type="application/ld+json">${head.structuredData}</script>`;
    if (!html.includes(jsonLdTag)) {
      html = ensureTagBeforeHeadEnd(html, jsonLdTag);
    }
  }

  return html;
}

function getRouteFilePath(route: string): string {
  if (route === "/") {
    return join(DIST_DIR, "index.html");
  }
  return join(DIST_DIR, route.slice(1), "index.html");
}

async function loadManifest(): Promise<RouteManifest> {
  const content = await readFile(MANIFEST_PATH, "utf-8");
  const manifest = JSON.parse(content) as RouteManifest;
  if (!Array.isArray(manifest.routes)) {
    throw new Error("Invalid routes manifest: routes must be an array");
  }
  return manifest;
}

async function loadCacheModule(): Promise<CacheModule> {
  const mod = await import("../src/data/sanity-cache/index");
  return mod as CacheModule;
}

async function main() {
  const [manifest, cache, baseHtml] = await Promise.all([loadManifest(), loadCacheModule(), readFile(DIST_INDEX, "utf-8")]);
  const routes = manifest.routes.map(normalizeRoute);
  const report: Array<{ route: string; file: string; status: "ok" | "failed"; error?: string }> = [];

  for (const route of routes) {
    try {
      const head = getPageHead(route, cache);
      const prerenderContent = buildRouteContent(route, cache);
      const prerenderShell = buildPrerenderShell(route, prerenderContent);
      const htmlWithHead = injectHead(baseHtml, head);
      const htmlWithContent = htmlWithHead.replace(
        /<div id="root">[\s\S]*?<\/div>/,
        `<div id="root">${prerenderShell}</div>`,
      );

      const outPath = getRouteFilePath(route);
      await mkdir(dirname(outPath), { recursive: true });
      await writeFile(outPath, htmlWithContent, "utf-8");

      report.push({ route, file: outPath, status: "ok" });
      console.log(`[prerender] OK ${route} -> ${outPath}`);
    } catch (error) {
      report.push({
        route,
        file: getRouteFilePath(route),
        status: "failed",
        error: error instanceof Error ? error.message : String(error),
      });
      console.error(`[prerender] FAIL ${route}:`, error);
    }
  }

  await mkdir(dirname(REPORT_PATH), { recursive: true });
  await writeFile(
    REPORT_PATH,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        total: report.length,
        ok: report.filter((r) => r.status === "ok").length,
        failed: report.filter((r) => r.status === "failed").length,
        routes: report,
      },
      null,
      2,
    ),
    "utf-8",
  );

  const failedCount = report.filter((r) => r.status === "failed").length;
  if (failedCount > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("[prerender] Fatal error:", error);
  process.exit(1);
});


