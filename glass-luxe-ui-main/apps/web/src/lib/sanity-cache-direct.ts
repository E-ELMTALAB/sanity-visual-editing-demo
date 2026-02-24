/**
 * Direct cache access layer for build-time Sanity data.
 *
 * Every exported function maps to exactly one cache export — no query-string
 * pattern matching, no silent fallbacks to the network.
 *
 * In visual-editing / dev mode the functions fall back to the GROQ-based
 * fetcher so Sanity Studio preview keeps working.
 */

import { PROXY_ENABLED, proxySanityCDNUrl } from './proxy.config'

// ---------------------------------------------------------------------------
// Cache singleton
// ---------------------------------------------------------------------------

type CacheModule = typeof import('../data/sanity-cache/index')

let cache: CacheModule | null = null
let loadPromise: Promise<CacheModule | null> | null = null

function isProduction(): boolean {
  return (
    import.meta.env.PROD ||
    import.meta.env.VITE_SANITY_CACHE_ONLY === 'true' ||
    import.meta.env.VITE_SANITY_CACHE_ONLY === '1'
  )
}

function isVisualEditing(): boolean {
  if (typeof window === 'undefined') return false
  const inPresentation = window !== window.parent || !!window.opener
  const hasPreviewCookie = document.cookie.includes('__sanity_preview_token=')
  return inPresentation && hasPreviewCookie
}

async function getCache(): Promise<CacheModule | null> {
  if (cache) return cache
  if (!loadPromise) {
    loadPromise = import('../data/sanity-cache/index')
      .then((m) => {
        cache = m
        return m
      })
      .catch(() => null)
  }
  return loadPromise
}

// ---------------------------------------------------------------------------
// CDN URL proxy transform (reused from the old sanity-cache.ts)
// ---------------------------------------------------------------------------

function transformCdnUrls<T>(data: T): T {
  if (!PROXY_ENABLED || !data) return data

  if (typeof data === 'string') {
    if (data.includes('cdn.sanity.io')) {
      return proxySanityCDNUrl(data) as unknown as T
    }
    return data
  }

  if (Array.isArray(data)) {
    return data.map((item) => transformCdnUrls(item)) as unknown as T
  }

  if (typeof data === 'object' && data !== null) {
    const transformed: any = {}
    for (const [key, value] of Object.entries(data)) {
      transformed[key] = transformCdnUrls(value)
    }
    return transformed as T
  }

  return data
}

// ---------------------------------------------------------------------------
// Visual-editing fallback (lazy-loaded so it's tree-shaken in production)
// ---------------------------------------------------------------------------

async function veFetch<T>(query: string, params?: Record<string, any>): Promise<T | null> {
  const { fetchFromSanityVisualEditing } = await import('./sanity.client.visual-editing')
  return fetchFromSanityVisualEditing<T>(query, params)
}

// ---------------------------------------------------------------------------
// Helpers shared by the dev-mode fallback path
// ---------------------------------------------------------------------------

async function devFetch<T>(query: string, params?: Record<string, any>): Promise<T | null> {
  if (isVisualEditing()) return veFetch<T>(query, params)

  // In dev mode (non-production, non-visual-editing), use the light client
  const { fetchFromSanity } = await import('./sanity.client.light')
  return fetchFromSanity<T>(query, params)
}

// ---------------------------------------------------------------------------
// Public API — one function per data need
// ---------------------------------------------------------------------------

/** Full homepage singleton (heroSlides, bestSellerProducts, editorialBanners, etc.) */
export async function getHomepageData(): Promise<any | null> {
  if (!isProduction() || isVisualEditing()) {
    const { homePageQuery } = await import('./sanity.queries')
    return devFetch<any>(homePageQuery)
  }
  const c = await getCache()
  return c?.homepageCache ? transformCdnUrls(c.homepageCache) : null
}

/** Featured products list (up to 8) */
export async function getFeaturedProducts(): Promise<any[] | null> {
  if (!isProduction() || isVisualEditing()) {
    const { featuredProductsQuery } = await import('./sanity.queries')
    return devFetch<any[]>(featuredProductsQuery)
  }
  const c = await getCache()
  return c?.featuredProductsCache ? transformCdnUrls(c.featuredProductsCache as any[]) : null
}

/** Featured courses list (up to 6) */
export async function getFeaturedCourses(): Promise<any[] | null> {
  if (!isProduction() || isVisualEditing()) {
    const { featuredCoursesQuery } = await import('./sanity.queries')
    return devFetch<any[]>(featuredCoursesQuery)
  }
  const c = await getCache()
  return c?.featuredCoursesCache ? transformCdnUrls(c.featuredCoursesCache as any[]) : null
}

/** Featured blog posts (up to 6) */
export async function getFeaturedPosts(): Promise<any[] | null> {
  if (!isProduction() || isVisualEditing()) {
    const { featuredPostsQuery } = await import('./sanity.queries')
    return devFetch<any[]>(featuredPostsQuery)
  }
  const c = await getCache()
  return c?.featuredPostsCache ? transformCdnUrls(c.featuredPostsCache as any[]) : null
}

const CATEGORY_KEY_MAP: Record<string, string> = {
  ai: 'ai',
  'social-media': 'social',
  music: 'music',
  education: 'edu',
  'sim-card': 'sim',
}

/** Products filtered by Sanity category value */
export async function getProductsByCategory(category: string): Promise<any[] | null> {
  if (!isProduction() || isVisualEditing()) {
    const { productsByCategoryQuery } = await import('./sanity.queries')
    return devFetch<any[]>(productsByCategoryQuery, { category })
  }
  const c = await getCache()
  const map = c?.categoryProductsCache as Record<string, any[]> | undefined
  if (!map) return null
  const key = CATEGORY_KEY_MAP[category] || category
  const data = map[key]
  return data ? transformCdnUrls(data) : null
}

/** FAQs by page location */
export async function getFaqsByPage(page: string): Promise<any[] | null> {
  if (!isProduction() || isVisualEditing()) {
    const { faqsByPageQuery } = await import('./sanity.queries')
    return devFetch<any[]>(faqsByPageQuery, { page })
  }
  const c = await getCache()
  if (page === 'home') {
    return c?.faqsHomeCache ? transformCdnUrls(c.faqsHomeCache as any[]) : null
  }
  if (page === 'products') {
    return c?.productsFaqsCache ? transformCdnUrls(c.productsFaqsCache as any[]) : null
  }
  return null
}

/** All products list (for /products page) */
export async function getAllProducts(): Promise<any[] | null> {
  if (!isProduction() || isVisualEditing()) {
    const { allProductsQuery } = await import('./sanity.queries')
    return devFetch<any[]>(allProductsQuery)
  }
  const c = await getCache()
  return c?.allProductsListCache ? transformCdnUrls(c.allProductsListCache as any[]) : null
}

/** Single product by slug (for /products/:slug detail page) */
export async function getProductBySlug(slug: string): Promise<any | null> {
  if (!isProduction() || isVisualEditing()) {
    const { productBySlugQuery } = await import('./sanity.queries')
    return devFetch<any>(productBySlugQuery, { slug })
  }
  const c = await getCache()
  const map = c?.productsCache as Record<string, any> | undefined
  if (!map) return null
  return map[slug] ? transformCdnUrls(map[slug]) : null
}

/** All blog posts list (for /blog page) */
export async function getAllPosts(): Promise<any[] | null> {
  if (!isProduction() || isVisualEditing()) {
    const { allPostsQuery } = await import('./sanity.queries')
    return devFetch<any[]>(allPostsQuery)
  }
  const c = await getCache()
  return c?.allPostsListCache ? transformCdnUrls(c.allPostsListCache as any[]) : null
}

/** Single blog post by slug (for /blog/:slug detail page) */
export async function getPostBySlug(slug: string): Promise<any | null> {
  if (!isProduction() || isVisualEditing()) {
    const { postBySlugQuery } = await import('./sanity.queries')
    return devFetch<any>(postBySlugQuery, { slug })
  }
  const c = await getCache()
  const map = c?.postsCache as Record<string, any> | undefined
  if (!map) return null
  return map[slug] ? transformCdnUrls(map[slug]) : null
}

/** All collections list */
export async function getAllCollections(): Promise<any[] | null> {
  if (!isProduction() || isVisualEditing()) {
    const { allCollectionsQuery } = await import('./sanity.queries')
    return devFetch<any[]>(allCollectionsQuery)
  }
  const c = await getCache()
  return c?.allCollectionsListCache ? transformCdnUrls(c.allCollectionsListCache as any[]) : null
}

/** Single collection by slug (for /collections/:slug page) */
export async function getCollectionBySlug(slug: string): Promise<any | null> {
  if (!isProduction() || isVisualEditing()) {
    const { collectionBySlugQuery } = await import('./sanity.queries')
    return devFetch<any>(collectionBySlugQuery, { slug })
  }
  const c = await getCache()
  const map = c?.collectionsCache as Record<string, any> | undefined
  if (!map) return null
  return map[slug] ? transformCdnUrls(map[slug]) : null
}

/** Promo banner data */
export async function getPromoBanner(): Promise<any | null> {
  if (!isProduction() || isVisualEditing()) {
    const { promoBannerQuery } = await import('./sanity.queries')
    return devFetch<any>(promoBannerQuery)
  }
  const c = await getCache()
  return c?.promoBannerCache ? transformCdnUrls(c.promoBannerCache) : null
}

/** Testimonials list */
export async function getTestimonials(): Promise<any[] | null> {
  if (!isProduction() || isVisualEditing()) {
    const { testimonialsQuery } = await import('./sanity.queries')
    return devFetch<any[]>(testimonialsQuery)
  }
  const c = await getCache()
  return c?.testimonialsCache ? transformCdnUrls(c.testimonialsCache as any[]) : null
}

/** Page SEO data by slug (for generic pages like /products, /blog) */
export async function getPageBySlug(slug: string): Promise<any | null> {
  if (!isProduction() || isVisualEditing()) {
    const { pageBySlugQuery } = await import('./sanity.queries')
    return devFetch<any>(pageBySlugQuery, { slug })
  }
  // No specific cache for generic pages — return null in production
  // (SEO is handled by the prerender script's head injection)
  return null
}
