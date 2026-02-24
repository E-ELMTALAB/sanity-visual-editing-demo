import { PROXY_ENABLED, proxySanityCDNUrl } from './proxy.config';

type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];
type JsonObject = { [key: string]: JsonValue };

const jsonCache = new Map<string, Promise<unknown>>();

function transformCdnUrls<T>(data: T): T {
  if (!PROXY_ENABLED || !data) return data;

  if (typeof data === 'string') {
    if (data.includes('cdn.sanity.io')) {
      return proxySanityCDNUrl(data) as unknown as T;
    }
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => transformCdnUrls(item)) as unknown as T;
  }

  if (typeof data === 'object' && data !== null) {
    const transformed: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      transformed[key] = transformCdnUrls(value);
    }
    return transformed as T;
  }

  return data;
}

async function loadJson<T = unknown>(fileName: string): Promise<T | null> {
  if (!jsonCache.has(fileName)) {
    jsonCache.set(
      fileName,
      import(`../data/sanity-cache/${fileName}`, { with: { type: 'json' } })
        .then((m) => (m as { default: T }).default)
        .catch((error) => {
          console.warn(`[SANITY-CACHE] Missing cache file: ${fileName}`, error);
          return null;
        }),
    );
  }

  const data = await jsonCache.get(fileName);
  return (data as T | null) ?? null;
}

function slugFromParam(params?: Record<string, any>): string | null {
  if (!params?.slug) return null;
  return typeof params.slug === 'string' ? params.slug : null;
}

function pageSlugFromParam(params?: Record<string, any>): string | null {
  if (!params?.slug) return null;
  return typeof params.slug === 'string' ? params.slug : null;
}

function normalizeQuery(query: string): string {
  return query.replace(/\s+/g, ' ').trim();
}

export async function getCachedData<T>(
  query: string,
  params?: Record<string, any>,
): Promise<T | null> {
  const normalizedQuery = normalizeQuery(query);

  // Home singleton
  if (normalizedQuery.includes('_type == "home"') && normalizedQuery.includes('[0]')) {
    const home = await loadJson<T>('homepage.json');
    if (home !== null) {
      console.info('[SANITY-CACHE] CACHE HIT: homePageQuery');
      return transformCdnUrls(home);
    }
    console.warn('[SANITY-CACHE] CACHE MISS: homePageQuery');
    return null;
  }

  // Products by category
  if (normalizedQuery.includes('_type == "product"') && normalizedQuery.includes('category == $category') && params?.category) {
    const categoryMap = await loadJson<Record<string, unknown>>('category-products-map.json');
    if (!categoryMap) {
      console.warn('[SANITY-CACHE] CACHE MISS: productsByCategoryQuery (category map not found)');
      return null;
    }

    const categoryKeys: Record<string, string> = {
      ai: 'ai',
      'social-media': 'social',
      music: 'music',
      education: 'edu',
      'sim-card': 'sim',
    };
    const key = categoryKeys[String(params.category)] || String(params.category);
    const data = (categoryMap[key] as T) ?? null;
    if (data !== null) {
      console.info(`[SANITY-CACHE] CACHE HIT: productsByCategoryQuery (${String(params.category)})`);
      return transformCdnUrls(data);
    }
    console.warn(`[SANITY-CACHE] CACHE MISS: productsByCategoryQuery (${String(params.category)})`);
    return null;
  }

  // All products list
  if (
    normalizedQuery.includes('_type == "product"') &&
    !normalizedQuery.includes('[0') &&
    !normalizedQuery.includes('slug.current == $slug') &&
    !normalizedQuery.includes('category == $category') &&
    !params?.slug &&
    !params?.category
  ) {
    const list = await loadJson<T>('all-products-list.json');
    if (list !== null) {
      console.info('[SANITY-CACHE] CACHE HIT: allProductsQuery');
      return transformCdnUrls(list);
    }
    console.warn('[SANITY-CACHE] CACHE MISS: allProductsQuery');
    return null;
  }

  // Featured products
  if (normalizedQuery.includes('_type == "product"') && normalizedQuery.includes('[0...8]') && !params?.category) {
    const featured = await loadJson<T>('featured-products.json');
    if (featured !== null) {
      console.info('[SANITY-CACHE] CACHE HIT: featuredProductsQuery');
      return transformCdnUrls(featured);
    }
    console.warn('[SANITY-CACHE] CACHE MISS: featuredProductsQuery');
    return null;
  }

  // Featured courses
  if (normalizedQuery.includes('_type == "course"') && normalizedQuery.includes('isFeatured == true') && normalizedQuery.includes('[0...6]')) {
    const courses = await loadJson<T>('featured-courses.json');
    if (courses !== null) {
      console.info('[SANITY-CACHE] CACHE HIT: featuredCoursesQuery');
      return transformCdnUrls(courses);
    }
    console.warn('[SANITY-CACHE] CACHE MISS: featuredCoursesQuery');
    return null;
  }

  // All posts list
  if (
    normalizedQuery.includes('_type == "post"') &&
    !normalizedQuery.includes('[0') &&
    !normalizedQuery.includes('slug.current == $slug') &&
    !params?.slug
  ) {
    const list = await loadJson<T>('all-posts-list.json');
    if (list !== null) {
      console.info('[SANITY-CACHE] CACHE HIT: allPostsQuery');
      return transformCdnUrls(list);
    }
    console.warn('[SANITY-CACHE] CACHE MISS: allPostsQuery');
    return null;
  }

  // Featured posts
  if (normalizedQuery.includes('_type == "post"') && normalizedQuery.includes('[0...6]')) {
    const featured = await loadJson<T>('featured-posts.json');
    if (featured !== null) {
      console.info('[SANITY-CACHE] CACHE HIT: featuredPostsQuery');
      return transformCdnUrls(featured);
    }
    console.warn('[SANITY-CACHE] CACHE MISS: featuredPostsQuery');
    return null;
  }

  // FAQs by page
  if (normalizedQuery.includes('_type == "faq"') && params?.page === 'home') {
    const faqs = await loadJson<T>('faqs-home.json');
    if (faqs !== null) {
      console.info('[SANITY-CACHE] CACHE HIT: faqsByPageQuery (home)');
      return transformCdnUrls(faqs);
    }
    console.warn('[SANITY-CACHE] CACHE MISS: faqsByPageQuery (home)');
    return null;
  }

  if (normalizedQuery.includes('_type == "faq"') && params?.page === 'products') {
    const faqs = await loadJson<T>('products-faqs.json');
    if (faqs !== null) {
      console.info('[SANITY-CACHE] CACHE HIT: faqsByPageQuery (products)');
      return transformCdnUrls(faqs);
    }
    console.warn('[SANITY-CACHE] CACHE MISS: faqsByPageQuery (products)');
    return null;
  }

  // Product detail by slug
  if (normalizedQuery.includes('_type == "product"') && normalizedQuery.includes('slug.current == $slug') && params?.slug) {
    const slug = slugFromParam(params);
    const map = await loadJson<Record<string, unknown>>('products-map.json');
    const data = slug && map ? (map[slug] as T) ?? null : null;
    if (data !== null) {
      console.info(`[SANITY-CACHE] CACHE HIT: productBySlugQuery (${slug})`);
      return transformCdnUrls(data);
    }
    console.warn(`[SANITY-CACHE] CACHE MISS: productBySlugQuery (${slug ?? 'unknown'})`);
    return null;
  }

  // Post detail by slug
  if (normalizedQuery.includes('_type == "post"') && normalizedQuery.includes('slug.current == $slug') && params?.slug) {
    const slug = slugFromParam(params);
    const map = await loadJson<Record<string, unknown>>('posts-map.json');
    const data = slug && map ? (map[slug] as T) ?? null : null;
    if (data !== null) {
      console.info(`[SANITY-CACHE] CACHE HIT: postBySlugQuery (${slug})`);
      return transformCdnUrls(data);
    }
    console.warn(`[SANITY-CACHE] CACHE MISS: postBySlugQuery (${slug ?? 'unknown'})`);
    return null;
  }

  // All collections list
  if (
    normalizedQuery.includes('_type == "collection"') &&
    !normalizedQuery.includes('slug.current == $slug') &&
    !params?.slug
  ) {
    const list = await loadJson<T>('all-collections-list.json');
    if (list !== null) {
      console.info('[SANITY-CACHE] CACHE HIT: allCollectionsQuery');
      return transformCdnUrls(list);
    }
    console.warn('[SANITY-CACHE] CACHE MISS: allCollectionsQuery');
    return null;
  }

  // Collection detail by slug
  if (normalizedQuery.includes('_type == "collection"') && normalizedQuery.includes('slug.current == $slug') && params?.slug) {
    const slug = slugFromParam(params);
    const map = await loadJson<Record<string, unknown>>('collections-map.json');
    const data = slug && map ? (map[slug] as T) ?? null : null;
    if (data !== null) {
      console.info(`[SANITY-CACHE] CACHE HIT: collectionBySlugQuery (${slug})`);
      return transformCdnUrls(data);
    }
    console.warn(`[SANITY-CACHE] CACHE MISS: collectionBySlugQuery (${slug ?? 'unknown'})`);
    return null;
  }

  // Page SEO by slug (from pages-map)
  if (normalizedQuery.includes('_type == "page"') && normalizedQuery.includes('slug.current == $slug') && params?.slug) {
    const slug = pageSlugFromParam(params);
    const pagesMap = await loadJson<Record<string, unknown>>('pages-map.json');
    const data = slug && pagesMap ? (pagesMap[slug] as T) ?? null : null;
    if (data !== null) {
      console.info(`[SANITY-CACHE] CACHE HIT: pageBySlugQuery (${slug})`);
      return transformCdnUrls(data);
    }
    console.warn(`[SANITY-CACHE] CACHE MISS: pageBySlugQuery (${slug ?? 'unknown'})`);
    return null;
  }

  // Promo banner
  if (normalizedQuery.includes('_type == "promoBanner"')) {
    const promo = await loadJson<T>('promo-banner.json');
    if (promo !== null) {
      console.info('[SANITY-CACHE] CACHE HIT: promoBannerQuery');
      return transformCdnUrls(promo);
    }
    console.warn('[SANITY-CACHE] CACHE MISS: promoBannerQuery');
    return null;
  }

  // Testimonials
  if (normalizedQuery.includes('_type == "testimonial"')) {
    const testimonials = await loadJson<T>('testimonials.json');
    if (testimonials !== null) {
      console.info('[SANITY-CACHE] CACHE HIT: testimonialsQuery');
      return transformCdnUrls(testimonials);
    }
    console.warn('[SANITY-CACHE] CACHE MISS: testimonialsQuery');
    return null;
  }

  console.warn('[SANITY-CACHE] CACHE MISS: Query not matched to any cache file');
  return null;
}

export function isCacheAvailable(): boolean {
  // Route-based cache lives as static JSON chunks and can be lazily loaded.
  // We return true here to indicate cache path is available in runtime.
  return true;
}
