import { mkdir, writeFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import {
  allProductsListCache,
  postsCache,
  collectionsCache,
  cacheMetadata,
} from "../src/data/sanity-cache/index";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const OUTPUT_DIR = join(__dirname, "../src/data/prerender");
const OUTPUT_FILE = join(OUTPUT_DIR, "routes.json");

type SlugRecord = {
  slug?: string | { current?: string } | null;
};

function normalizeSlug(value: unknown): string | null {
  if (typeof value === "string") {
    const trimmed = value.trim().replace(/^\/+|\/+$/g, "");
    return trimmed || null;
  }

  if (value && typeof value === "object" && "current" in (value as Record<string, unknown>)) {
    const current = (value as { current?: unknown }).current;
    if (typeof current === "string") {
      const trimmed = current.trim().replace(/^\/+|\/+$/g, "");
      return trimmed || null;
    }
  }

  return null;
}

function toUniqueSortedRoutes(routes: Iterable<string>): string[] {
  return Array.from(
    new Set(
      Array.from(routes)
        .map((route) => route.trim())
        .filter(Boolean)
        .map((route) => (route.startsWith("/") ? route : `/${route}`))
        .map((route) => route.replace(/\/+$/g, "") || "/"),
    ),
  ).sort((a, b) => a.localeCompare(b));
}

async function main() {
  const staticRoutes = [
    "/",
    "/products",
    "/blog",
    "/about",
    "/contact",
    "/faq",
    "/support",
    "/policies/refund-replacement",
    "/team/erfan",
    "/team/amir",
  ];

  const productRoutes = (Array.isArray(allProductsListCache) ? allProductsListCache : [])
    .map((item) => normalizeSlug((item as SlugRecord).slug))
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => `/products/${slug}`);

  const postRoutes = Object.keys(postsCache || {})
    .map((slug) => normalizeSlug(slug))
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => `/blog/${slug}`);

  const collectionRoutes = Object.keys(collectionsCache || {})
    .map((slug) => normalizeSlug(slug))
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => `/collections/${slug}`);

  const routes = toUniqueSortedRoutes([
    ...staticRoutes,
    ...productRoutes,
    ...postRoutes,
    ...collectionRoutes,
  ]);

  const manifest = {
    generatedAt: new Date().toISOString(),
    source: {
      cacheFetchedAt: cacheMetadata?.fetchedAt || null,
      projectId: cacheMetadata?.projectId || null,
      dataset: cacheMetadata?.dataset || null,
    },
    counts: {
      total: routes.length,
      static: staticRoutes.length,
      products: productRoutes.length,
      posts: postRoutes.length,
      collections: collectionRoutes.length,
    },
    routes,
  };

  await mkdir(OUTPUT_DIR, { recursive: true });
  await writeFile(OUTPUT_FILE, JSON.stringify(manifest, null, 2), "utf-8");

  console.log("[prerender-routes] Generated route manifest");
  console.log("[prerender-routes] Output:", OUTPUT_FILE);
  console.log("[prerender-routes] Counts:", manifest.counts);
}

main().catch((error) => {
  console.error("[prerender-routes] Failed:", error);
  process.exit(1);
});


