/**
 * Sanity cache reader for build-time cached data
 * Imports cached data that was fetched at build time
 */

// Dynamically import cache - this will be bundled at build time
let cacheModule: any = null;
let cacheLoadAttempted = false;

/**
 * Load cache module (lazy import)
 */
async function loadCache(): Promise<any> {
  if (cacheLoadAttempted) {
    return cacheModule;
  }

  cacheLoadAttempted = true;

  try {
    // Try to import the generated cache index
    // This will only work if the cache was generated at build time
    cacheModule = await import('../data/sanity-cache/index');
    console.info('[SANITY-CACHE] ✅ Loaded build-time cache module');
    // Log cache metadata if available
    if (cacheModule?.cacheMetadata) {
      console.info(`[SANITY-CACHE] Cache metadata:`, {
        fetchedAt: cacheModule.cacheMetadata.fetchedAt,
        projectId: cacheModule.cacheMetadata.projectId,
        dataset: cacheModule.cacheMetadata.dataset,
        categories: cacheModule.cacheMetadata.categories,
      });
    }
    return cacheModule;
  } catch (error) {
    // Cache not available - that's okay, we'll use API
    console.warn('[SANITY-CACHE] ⚠️ Cache module not available, will use API');
    console.debug('[SANITY-CACHE] Error:', error);
    return null;
  }
}

/**
 * Check if we should use cache (production build)
 */
function shouldUseCache(): boolean {
  // Use cache in production builds (not in dev mode)
  return import.meta.env.PROD && import.meta.env.MODE === 'production';
}

/**
 * Get cached data for a query with detailed logging
 */
export async function getCachedData<T>(
  query: string,
  params?: Record<string, any>
): Promise<T | null> {
  if (!shouldUseCache()) {
    console.debug('[SANITY-CACHE] Cache disabled (dev mode)');
    return null;
  }

  const cache = await loadCache();
  if (!cache) {
    console.warn('[SANITY-CACHE] ⚠️ Cache module not available, falling back to API');
    return null;
  }

  // Normalize query for matching (remove whitespace)
  const normalizedQuery = query.replace(/\s+/g, ' ').trim();

  // Map query to cache export with detailed logging
  // 1. Homepage query
  if (normalizedQuery.includes('_type == "home"') && normalizedQuery.includes('[0]')) {
    const data = (cache.homepageCache as T) || null;
    if (data !== null) {
      console.info('[SANITY-CACHE] ✅ CACHE HIT: homePageQuery');
    } else {
      console.warn('[SANITY-CACHE] ⚠️ CACHE MISS: homePageQuery (data is null)');
    }
    return data;
  }

  // 2. Products by category query (has category param) - check this FIRST as it's more specific
  if (normalizedQuery.includes('_type == "product"') && normalizedQuery.includes('category == $category') && params?.category) {
    const categoryMap = cache.categoryProductsCache;
    if (categoryMap && typeof categoryMap === 'object') {
      // Map category names to cache keys
      const categoryKeys: Record<string, string> = {
        ai: 'ai',
        'social-media': 'social',
        music: 'music',
        education: 'edu',
        'sim-card': 'sim',
      };
      const key = categoryKeys[params.category] || params.category;
      const data = (categoryMap[key] as T) || null;
      if (data !== null) {
        console.info(`[SANITY-CACHE] ✅ CACHE HIT: productsByCategoryQuery (category: ${params.category})`);
      } else {
        console.warn(`[SANITY-CACHE] ⚠️ CACHE MISS: productsByCategoryQuery (category: ${params.category}, key: ${key})`);
      }
      return data;
    }
    console.warn(`[SANITY-CACHE] ⚠️ CACHE MISS: productsByCategoryQuery (category map not available)`);
    return null;
  }

  // 3. Featured products query (no category param, has [0...8])
  if (normalizedQuery.includes('_type == "product"') && normalizedQuery.includes('[0...8]') && !params?.category) {
    const data = (cache.featuredProductsCache as T) || null;
    if (data !== null) {
      console.info('[SANITY-CACHE] ✅ CACHE HIT: featuredProductsQuery');
    } else {
      console.warn('[SANITY-CACHE] ⚠️ CACHE MISS: featuredProductsQuery (data is null)');
    }
    return data;
  }

  // 4. Featured courses query (has isFeatured == true and [0...6])
  if (normalizedQuery.includes('_type == "course"') && normalizedQuery.includes('isFeatured == true') && normalizedQuery.includes('[0...6]')) {
    const data = (cache.featuredCoursesCache as T) || null;
    if (data !== null) {
      console.info('[SANITY-CACHE] ✅ CACHE HIT: featuredCoursesQuery');
    } else {
      console.warn('[SANITY-CACHE] ⚠️ CACHE MISS: featuredCoursesQuery (data is null)');
    }
    return data;
  }

  // 5. Featured posts query (has [0...6])
  if (normalizedQuery.includes('_type == "post"') && normalizedQuery.includes('[0...6]')) {
    const data = (cache.featuredPostsCache as T) || null;
    if (data !== null) {
      console.info('[SANITY-CACHE] ✅ CACHE HIT: featuredPostsQuery');
    } else {
      console.warn('[SANITY-CACHE] ⚠️ CACHE MISS: featuredPostsQuery (data is null)');
    }
    return data;
  }

  // 6. FAQs by page query (has page param)
  if (normalizedQuery.includes('_type == "faq"') && params?.page === 'home') {
    const data = (cache.faqsHomeCache as T) || null;
    if (data !== null) {
      console.info('[SANITY-CACHE] ✅ CACHE HIT: faqsByPageQuery (page: home)');
    } else {
      console.warn('[SANITY-CACHE] ⚠️ CACHE MISS: faqsByPageQuery (page: home, data is null)');
    }
    return data;
  }

  // Query not matched - log for debugging
  console.warn('[SANITY-CACHE] ⚠️ CACHE MISS: Query not matched to any cache entry');
  console.debug('[SANITY-CACHE] Query snippet:', normalizedQuery.substring(0, 100) + '...');
  if (params) {
    console.debug('[SANITY-CACHE] Params:', params);
  }
  return null;
}

/**
 * Check if cache is available
 */
export function isCacheAvailable(): boolean {
  return shouldUseCache() && cacheModule !== null;
}

