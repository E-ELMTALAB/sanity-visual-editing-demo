/**
 * Sanity cache reader for build-time cached data
 * Imports cached data that was fetched at build time
 * 
 * FEATURES:
 * - Pre-loads cache eagerly when module is imported (prevents race conditions)
 * - Uses singleton promise pattern to ensure cache loads only once
 * - Validates homepage cache has all required fields
 * - Provides detailed logging for cache hits/misses
 * - Transforms Sanity CDN URLs to proxy URLs when serving from cache
 */

import { PROXY_ENABLED, proxySanityCDNUrl, ORIGINAL_SANITY_CDN } from './proxy.config'

// Cache module state
let cacheModule: any = null;
let cacheLoadPromise: Promise<any> | null = null;

/**
 * Check if we should use cache (production build or cache-only mode)
 */
function shouldUseCache(): boolean {
  // Use cache in production builds OR if cache-only mode is enabled (for testing)
  const cacheOnlyMode = import.meta.env.VITE_SANITY_CACHE_ONLY === 'true' || import.meta.env.VITE_SANITY_CACHE_ONLY === '1';
  // In Vite, import.meta.env.PROD is true for production builds
  // MODE check is redundant - PROD is sufficient
  return import.meta.env.PROD || cacheOnlyMode;
}

/**
 * Transform all Sanity CDN URLs in an object to use the proxy
 * Recursively walks the object and transforms any strings that look like CDN URLs
 */
function transformCdnUrls<T>(data: T): T {
  if (!PROXY_ENABLED || !data) return data;
  
  if (typeof data === 'string') {
    // Check if this is a Sanity CDN URL
    if (data.includes('cdn.sanity.io')) {
      return proxySanityCDNUrl(data) as unknown as T;
    }
    return data;
  }
  
  if (Array.isArray(data)) {
    return data.map(item => transformCdnUrls(item)) as unknown as T;
  }
  
  if (typeof data === 'object' && data !== null) {
    const transformed: any = {};
    for (const [key, value] of Object.entries(data)) {
      transformed[key] = transformCdnUrls(value);
    }
    return transformed as T;
  }
  
  return data;
}

/**
 * Pre-load cache module eagerly when module is imported (in production)
 * This prevents race conditions by loading cache before any queries run
 */
function initializeCache(): void {
  // Only pre-load in production
  if (!shouldUseCache()) {
    return;
  }

  // Only initialize once
  if (cacheLoadPromise !== null) {
    return;
  }

  // Start loading cache immediately
  cacheLoadPromise = (async () => {
    try {
      // Try to import the generated cache index
      // This will only work if the cache was generated at build time
      const module = await import('../data/sanity-cache/index');
      cacheModule = module;
      
      console.info('[SANITY-CACHE] Pre-loaded build-time cache module');
      if (PROXY_ENABLED) {
        console.info('[SANITY-CACHE] Proxy enabled - CDN URLs will be transformed');
      }
      
      // Log cache metadata if available
      if (module?.cacheMetadata) {
        console.info(`[SANITY-CACHE] Cache metadata:`, {
          fetchedAt: module.cacheMetadata.fetchedAt,
          projectId: module.cacheMetadata.projectId,
          dataset: module.cacheMetadata.dataset,
          categories: module.cacheMetadata.categories,
        });
      }

      // Validate homepage cache has all required fields
      if (module?.homepageCache) {
        const homeData = module.homepageCache;
        const requiredFields = [
          'heroSlides',
          'bestSellerProducts',
          'editorialBanners',
          'collectionsBanner',
          'discountedProducts',
          'socialMediaProducts',
          'educationalProducts',
          'bestsellingCourses',
          'magazinePosts',
          'featuredBlogs',
          'seoContent',
        ];
        
        const missingFields = requiredFields.filter(field => !(field in homeData));
        if (missingFields.length > 0) {
          console.warn(`[SANITY-CACHE] Homepage cache missing fields: ${missingFields.join(', ')}`);
        } else {
          console.info('[SANITY-CACHE] Homepage cache validation passed - all fields present');
        }

        // Log data counts for debugging
        console.info('[SANITY-CACHE] Homepage data summary:', {
          heroSlides: homeData.heroSlides?.length || 0,
          bestSellerProducts: homeData.bestSellerProducts?.length || 0,
          editorialBanners: homeData.editorialBanners?.length || 0,
          discountedProducts: homeData.discountedProducts?.length || 0,
          socialMediaProducts: homeData.socialMediaProducts?.length || 0,
          educationalProducts: homeData.educationalProducts?.length || 0,
          bestsellingCourses: homeData.bestsellingCourses?.length || 0,
          magazinePosts: homeData.magazinePosts?.length || 0,
          featuredBlogs: homeData.featuredBlogs?.length || 0,
          hasCollectionsBanner: !!homeData.collectionsBanner,
          hasSeoContent: !!homeData.seoContent,
        });
      }

      // Validate all products list cache
      if (module?.allProductsListCache) {
        const listCount = Array.isArray(module.allProductsListCache) ? module.allProductsListCache.length : 0;
        console.info(`[SANITY-CACHE] All products list cache: ${listCount} products`);
        
        if (listCount === 0) {
          console.warn('[SANITY-CACHE] All products list cache is empty');
        }
      }

      // Validate products cache (detail pages)
      if (module?.productsCache) {
        const productCount = Object.keys(module.productsCache).length;
        console.info(`[SANITY-CACHE] Products cache (detail pages): ${productCount} products`);
        
        if (productCount === 0) {
          console.warn('[SANITY-CACHE] Products cache is empty');
        } else {
          // Log a sample of product slugs for debugging
          const sampleSlugs = Object.keys(module.productsCache).slice(0, 5);
          console.info(`[SANITY-CACHE] Sample product slugs: ${sampleSlugs.join(', ')}${productCount > 5 ? '...' : ''}`);
        }
      }

      // Validate product FAQs cache
      if (module?.productsFaqsCache) {
        const faqCount = Array.isArray(module.productsFaqsCache) ? module.productsFaqsCache.length : 0;
        console.info(`[SANITY-CACHE] Product FAQs cache: ${faqCount} FAQs`);
      }

      // Validate all posts list cache
      if (module?.allPostsListCache) {
        const listCount = Array.isArray(module.allPostsListCache) ? module.allPostsListCache.length : 0;
        console.info(`[SANITY-CACHE] All posts list cache: ${listCount} posts`);
        
        if (listCount === 0) {
          console.warn('[SANITY-CACHE] All posts list cache is empty');
        }
      }

      // Validate posts cache (detail pages)
      if (module?.postsCache) {
        const postCount = Object.keys(module.postsCache).length;
        console.info(`[SANITY-CACHE] Posts cache (detail pages): ${postCount} posts`);
        
        if (postCount === 0) {
          console.warn('[SANITY-CACHE] Posts cache is empty');
        } else {
          // Log a sample of post slugs for debugging
          const sampleSlugs = Object.keys(module.postsCache).slice(0, 5);
          console.info(`[SANITY-CACHE] Sample post slugs: ${sampleSlugs.join(', ')}${postCount > 5 ? '...' : ''}`);
        }
      }

      // Validate all collections list cache
      if (module?.allCollectionsListCache) {
        const listCount = Array.isArray(module.allCollectionsListCache) ? module.allCollectionsListCache.length : 0;
        console.info(`[SANITY-CACHE] All collections list cache: ${listCount} collections`);
        
        if (listCount === 0) {
          console.warn('[SANITY-CACHE] All collections list cache is empty');
        }
      }

      // Validate collections cache (detail pages)
      if (module?.collectionsCache) {
        const collectionCount = Object.keys(module.collectionsCache).length;
        console.info(`[SANITY-CACHE] Collections cache (detail pages): ${collectionCount} collections`);
        
        if (collectionCount === 0) {
          console.warn('[SANITY-CACHE] Collections cache is empty');
        } else {
          // Log a sample of collection slugs for debugging
          const sampleSlugs = Object.keys(module.collectionsCache).slice(0, 5);
          console.info(`[SANITY-CACHE] Sample collection slugs: ${sampleSlugs.join(', ')}${collectionCount > 5 ? '...' : ''}`);
        }
      }

      return module;
    } catch (error) {
      // Cache not available - that's okay, we'll use API
      console.warn('[SANITY-CACHE] Cache module not available, will use API');
      console.debug('[SANITY-CACHE] Error:', error);
      return null;
    }
  })();
}

/**
 * Load cache module - returns the pre-loaded promise or loads now
 */
async function loadCache(): Promise<any> {
  // If already loaded, return immediately
  if (cacheModule !== null) {
    return cacheModule;
  }

  // If pre-load is in progress, wait for it
  if (cacheLoadPromise) {
    return cacheLoadPromise;
  }

  // If not initialized yet (shouldn't happen in production, but handle it)
  if (shouldUseCache()) {
    initializeCache();
    if (cacheLoadPromise) {
      return cacheLoadPromise;
    }
  }

  // Fallback: try loading now (for non-production or if pre-load failed)
  try {
    cacheModule = await import('../data/sanity-cache/index');
    console.info('[SANITY-CACHE] Loaded build-time cache module (fallback)');
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
    console.warn('[SANITY-CACHE] Cache module not available, will use API');
    console.debug('[SANITY-CACHE] Error:', error);
    return null;
  }
}

// Initialize cache eagerly when module loads (in production)
// This runs immediately when the module is imported, ensuring cache is ready before queries
initializeCache();

/**
 * Get cached data for a query with detailed logging
 * Automatically transforms CDN URLs to proxy URLs when proxy is enabled
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
    console.warn('[SANITY-CACHE] Cache module not available, falling back to API');
    return null;
  }

  // Normalize query for matching (remove whitespace)
  const normalizedQuery = query.replace(/\s+/g, ' ').trim();

  // Map query to cache export with detailed logging
  // 1. Homepage query
  if (normalizedQuery.includes('_type == "home"') && normalizedQuery.includes('[0]')) {
    const rawData = (cache.homepageCache as T) || null;
    if (rawData !== null) {
      console.info('[SANITY-CACHE] CACHE HIT: homePageQuery');
      // Transform CDN URLs to proxy URLs
      return transformCdnUrls(rawData);
    } else {
      console.warn('[SANITY-CACHE] CACHE MISS: homePageQuery (data is null)');
    }
    return rawData;
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
      const rawData = (categoryMap[key] as T) || null;

      if (rawData !== null) {
        const dataArray = rawData as any[];
        const count = Array.isArray(dataArray) ? dataArray.length : 0;

        if (count > 0) {
          console.info(`[SANITY-CACHE] CACHE HIT: productsByCategoryQuery (category: ${params.category}, key: ${key}, count: ${count})`);
          return transformCdnUrls(rawData);
        } else {
          console.warn(
            `[SANITY-CACHE] CACHE HIT (empty): productsByCategoryQuery (category: ${params.category}, key: ${key}) - cached array is empty`
          );
        }
      } else {
        console.warn(`[SANITY-CACHE] CACHE MISS: productsByCategoryQuery (category: ${params.category}, key: ${key})`);
      }

      return rawData;
    }
    console.warn(`[SANITY-CACHE] CACHE MISS: productsByCategoryQuery (category map not available)`);
    return null;
  }

  // 3. All products query (no limit, no category param, no slug param)
  if (normalizedQuery.includes('_type == "product"') && 
      !normalizedQuery.includes('[0') && // No array slice
      !normalizedQuery.includes('slug.current == $slug') && // Not product by slug
      !normalizedQuery.includes('category == $category') && // Not by category
      !params?.slug && 
      !params?.category) {
    const rawData = (cache.allProductsListCache as T) || null;
    if (rawData !== null) {
      const dataArray = rawData as any[];
      const count = Array.isArray(dataArray) ? dataArray.length : 0;
      console.info(`[SANITY-CACHE] CACHE HIT: allProductsQuery (count: ${count})`);
      return transformCdnUrls(rawData);
    } else {
      console.warn('[SANITY-CACHE] CACHE MISS: allProductsQuery (data is null)');
    }
    return rawData;
  }

  // 4. Featured products query (no category param, has [0...8])
  if (normalizedQuery.includes('_type == "product"') && normalizedQuery.includes('[0...8]') && !params?.category) {
    const rawData = (cache.featuredProductsCache as T) || null;
    if (rawData !== null) {
      console.info('[SANITY-CACHE] CACHE HIT: featuredProductsQuery');
      return transformCdnUrls(rawData);
    } else {
      console.warn('[SANITY-CACHE] CACHE MISS: featuredProductsQuery (data is null)');
    }
    return rawData;
  }

  // 5. Featured courses query (has isFeatured == true and [0...6])
  if (normalizedQuery.includes('_type == "course"') && normalizedQuery.includes('isFeatured == true') && normalizedQuery.includes('[0...6]')) {
    const rawData = (cache.featuredCoursesCache as T) || null;
    if (rawData !== null) {
      console.info('[SANITY-CACHE] CACHE HIT: featuredCoursesQuery');
      return transformCdnUrls(rawData);
    } else {
      console.warn('[SANITY-CACHE] CACHE MISS: featuredCoursesQuery (data is null)');
    }
    return rawData;
  }

  // 5a. All posts query (no limit, no slug param) - check BEFORE featured posts
  if (normalizedQuery.includes('_type == "post"') && 
      !normalizedQuery.includes('[0') && // No array slice
      !normalizedQuery.includes('slug.current == $slug') && // Not post by slug
      !params?.slug) {
    const rawData = (cache.allPostsListCache as T) || null;
    if (rawData !== null) {
      const dataArray = rawData as any[];
      const count = Array.isArray(dataArray) ? dataArray.length : 0;
      console.info(`[SANITY-CACHE] CACHE HIT: allPostsQuery (count: ${count})`);
      return transformCdnUrls(rawData);
    } else {
      console.warn('[SANITY-CACHE] CACHE MISS: allPostsQuery (data is null)');
    }
    return rawData;
  }

  // 6. Featured posts query (has [0...6])
  if (normalizedQuery.includes('_type == "post"') && normalizedQuery.includes('[0...6]')) {
    const rawData = (cache.featuredPostsCache as T) || null;
    if (rawData !== null) {
      console.info('[SANITY-CACHE] CACHE HIT: featuredPostsQuery');
      return transformCdnUrls(rawData);
    } else {
      console.warn('[SANITY-CACHE] CACHE MISS: featuredPostsQuery (data is null)');
    }
    return rawData;
  }

  // 7. FAQs by page query (has page param) - check for home first
  if (normalizedQuery.includes('_type == "faq"') && params?.page === 'home') {
    const rawData = (cache.faqsHomeCache as T) || null;
    if (rawData !== null) {
      console.info('[SANITY-CACHE] CACHE HIT: faqsByPageQuery (page: home)');
      return transformCdnUrls(rawData);
    } else {
      console.warn('[SANITY-CACHE] CACHE MISS: faqsByPageQuery (page: home, data is null)');
    }
    return rawData;
  }

  // 8. Product by slug query (has slug param)
  if (normalizedQuery.includes('_type == "product"') && 
      normalizedQuery.includes('slug.current == $slug') && 
      params?.slug) {
    const productsMap = cache.productsCache;
    if (productsMap && typeof productsMap === 'object') {
      const rawData = (productsMap[params.slug] as T) || null;
      
      if (rawData !== null) {
        console.info(`[SANITY-CACHE] CACHE HIT: productBySlugQuery (slug: ${params.slug})`);
        return transformCdnUrls(rawData);
      } else {
        console.warn(`[SANITY-CACHE] CACHE MISS: productBySlugQuery (slug: ${params.slug}) - product not found in cache`);
      }
      
      return rawData;
    }
    console.warn(`[SANITY-CACHE] CACHE MISS: productBySlugQuery (products map not available)`);
    return null;
  }

  // 9. Product FAQs query (has page: "products" param)
  if (normalizedQuery.includes('_type == "faq"') && params?.page === 'products') {
    const rawData = (cache.productsFaqsCache as T) || null;
    if (rawData !== null) {
      console.info('[SANITY-CACHE] CACHE HIT: faqsByPageQuery (page: products)');
      return transformCdnUrls(rawData);
    } else {
      console.warn('[SANITY-CACHE] CACHE MISS: faqsByPageQuery (page: products, data is null)');
    }
    return rawData;
  }

  // 10. Post by slug query (has slug param)
  if (normalizedQuery.includes('_type == "post"') && 
      normalizedQuery.includes('slug.current == $slug') && 
      params?.slug) {
    const postsMap = cache.postsCache;
    if (postsMap && typeof postsMap === 'object') {
      const rawData = (postsMap[params.slug] as T) || null;
      
      if (rawData !== null) {
        console.info(`[SANITY-CACHE] CACHE HIT: postBySlugQuery (slug: ${params.slug})`);
        return transformCdnUrls(rawData);
      } else {
        console.warn(`[SANITY-CACHE] CACHE MISS: postBySlugQuery (slug: ${params.slug}) - post not found in cache`);
      }
      
      return rawData;
    }
    console.warn(`[SANITY-CACHE] CACHE MISS: postBySlugQuery (posts map not available)`);
    return null;
  }

  // 11. All collections query (no limit, no slug param)
  if (normalizedQuery.includes('_type == "collection"') && 
      !normalizedQuery.includes('slug.current == $slug') && 
      !params?.slug) {
    const rawData = (cache.allCollectionsListCache as T) || null;
    if (rawData !== null) {
      const dataArray = rawData as any[];
      const count = Array.isArray(dataArray) ? dataArray.length : 0;
      console.info(`[SANITY-CACHE] CACHE HIT: allCollectionsQuery (count: ${count})`);
      return transformCdnUrls(rawData);
    } else {
      console.warn('[SANITY-CACHE] CACHE MISS: allCollectionsQuery (data is null)');
    }
    return rawData;
  }

  // 12. Collection by slug query (has slug param)
  if (normalizedQuery.includes('_type == "collection"') && 
      normalizedQuery.includes('slug.current == $slug') && 
      params?.slug) {
    const collectionsMap = cache.collectionsCache;
    if (collectionsMap && typeof collectionsMap === 'object') {
      const rawData = (collectionsMap[params.slug] as T) || null;
      
      if (rawData !== null) {
        console.info(`[SANITY-CACHE] CACHE HIT: collectionBySlugQuery (slug: ${params.slug})`);
        return transformCdnUrls(rawData);
      } else {
        console.warn(`[SANITY-CACHE] CACHE MISS: collectionBySlugQuery (slug: ${params.slug}) - collection not found in cache`);
      }
      
      return rawData;
    }
    console.warn(`[SANITY-CACHE] CACHE MISS: collectionBySlugQuery (collections map not available)`);
    return null;
  }

  // Query not matched - log for debugging
  console.warn('[SANITY-CACHE] CACHE MISS: Query not matched to any cache entry');
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
