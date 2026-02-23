import { mkdir, readFile, writeFile, stat } from "fs/promises";
import { createServer } from "http";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, "..");
const DIST_DIR = join(PROJECT_ROOT, "dist");
const MANIFEST_PATH = join(PROJECT_ROOT, "src/data/prerender/routes.json");
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
  name?: string;
  title?: string;
  slug?: string | { current?: string };
  shortDescription?: string;
  description?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    robotsMeta?: string;
    openGraphTitle?: string;
    openGraphDescription?: string;
    openGraphImage?: unknown;
    structuredData?: string;
  };
};

type PostLike = {
  title?: string;
  slug?: string | { current?: string };
  excerpt?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    robotsMeta?: string;
    openGraphTitle?: string;
    openGraphDescription?: string;
    openGraphImage?: unknown;
    structuredData?: string;
  };
};

type CollectionLike = {
  title?: string;
  slug?: string | { current?: string };
  description?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    robotsMeta?: string;
    openGraphTitle?: string;
    openGraphDescription?: string;
    openGraphImage?: unknown;
    structuredData?: string;
  };
};

type CacheModule = {
  homepageCache?: {
    seo?: {
      metaTitle?: string;
      metaDescription?: string;
      canonicalUrl?: string;
      robotsMeta?: string;
      openGraphTitle?: string;
      openGraphDescription?: string;
      openGraphImage?: unknown;
      structuredData?: string;
    };
  };
  allProductsListCache?: ProductLike[];
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

function ensureTrailingSlash(route: string): string {
  return route === "/" ? "/" : `${route}/`;
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
      source?.shortDescription ||
      source?.description ||
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
    const descBase = post?.excerpt || "مطلبی از مجله SharifGPT";

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
    const descBase = collection?.description || "کلکسیون محصولات در SharifGPT";

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

async function wait(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForStableContent(page: any): Promise<void> {
  const timeout = 7000;
  const interval = 150;
  const start = Date.now();
  let stableTicks = 0;
  let lastLength = -1;

  while (Date.now() - start < timeout) {
    const length = await page.evaluate(() => {
      const root = document.getElementById("root");
      return (root?.innerText || "").trim().length;
    });

    if (length > 120 && length === lastLength) {
      stableTicks += 1;
      if (stableTicks >= 3) return;
    } else {
      stableTicks = 0;
      lastLength = length;
    }

    await wait(interval);
  }
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

function getContentType(pathname: string): string {
  if (pathname.endsWith(".js")) return "application/javascript; charset=utf-8";
  if (pathname.endsWith(".css")) return "text/css; charset=utf-8";
  if (pathname.endsWith(".json")) return "application/json; charset=utf-8";
  if (pathname.endsWith(".svg")) return "image/svg+xml";
  if (pathname.endsWith(".png")) return "image/png";
  if (pathname.endsWith(".jpg") || pathname.endsWith(".jpeg")) return "image/jpeg";
  if (pathname.endsWith(".webp")) return "image/webp";
  if (pathname.endsWith(".woff2")) return "font/woff2";
  if (pathname.endsWith(".ico")) return "image/x-icon";
  return "text/html; charset=utf-8";
}

async function resolveDistFile(urlPath: string): Promise<string> {
  const cleanPath = urlPath.split("?")[0].split("#")[0];
  const rel = cleanPath.replace(/^\/+/, "");

  const candidateFile = join(DIST_DIR, rel);
  try {
    const s = await stat(candidateFile);
    if (s.isFile()) return candidateFile;
  } catch {
    // continue
  }

  if (!rel || rel.endsWith("/")) {
    const asIndex = join(DIST_DIR, rel, "index.html");
    try {
      const s = await stat(asIndex);
      if (s.isFile()) return asIndex;
    } catch {
      // continue
    }
  } else {
    const asDirIndex = join(DIST_DIR, rel, "index.html");
    try {
      const s = await stat(asDirIndex);
      if (s.isFile()) return asDirIndex;
    } catch {
      // continue
    }
  }

  // SPA fallback
  return join(DIST_DIR, "index.html");
}

async function startStaticServer(): Promise<{ origin: string; close: () => Promise<void> }> {
  const server = createServer(async (req, res) => {
    try {
      const requestPath = req.url || "/";
      const filePath = await resolveDistFile(requestPath);
      const body = await readFile(filePath);
      const contentType = getContentType(filePath);
      res.statusCode = 200;
      res.setHeader("Content-Type", contentType);
      res.end(body);
    } catch {
      res.statusCode = 500;
      res.end("Prerender server error");
    }
  });

  await new Promise<void>((resolve) => {
    server.listen(0, "127.0.0.1", () => resolve());
  });

  const addr = server.address();
  if (!addr || typeof addr === "string") {
    throw new Error("Failed to start prerender server");
  }

  return {
    origin: `http://127.0.0.1:${addr.port}`,
    close: async () =>
      new Promise<void>((resolve, reject) => {
        server.close((err) => (err ? reject(err) : resolve()));
      }),
  };
}

async function main() {
  const [{ chromium }, manifest, cache] = await Promise.all([
    import("playwright"),
    loadManifest(),
    loadCacheModule(),
  ]);

  const routes = manifest.routes.map(normalizeRoute);
  const staticServer = await startStaticServer();
  const browser = await chromium.launch({ headless: true });
  const report: Array<{ route: string; file: string; status: "ok" | "failed"; error?: string }> = [];

  try {
    for (const route of routes) {
      const context = await browser.newContext({
        viewport: { width: 1366, height: 900 },
      });
      const page = await context.newPage();

      try {
        const targetUrl = `${staticServer.origin}${ensureTrailingSlash(route)}`;
        await page.goto(targetUrl, { waitUntil: "networkidle", timeout: 20000 });
        await waitForStableContent(page);

        const rendered = await page.content();
        const head = getPageHead(route, cache);
        const htmlWithHead = injectHead(rendered, head);

        const outPath = getRouteFilePath(route);
        await mkdir(dirname(outPath), { recursive: true });
        await writeFile(outPath, htmlWithHead, "utf-8");

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
      } finally {
        await context.close();
      }
    }
  } finally {
    await staticServer.close();
    await browser.close();
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


