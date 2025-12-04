# Sanity Build-Time Caching Implementation Guide

## Overview

This guide documents the complete process of implementing build-time data fetching and caching for Sanity CMS content. This approach dramatically improves page load times by pre-fetching all content during the build process and serving it from local cache files instead of making runtime API calls.

## Table of Contents

1. [Why Build-Time Caching?](#why-build-time-caching)
2. [Architecture Overview](#architecture-overview)
3. [Step-by-Step Implementation](#step-by-step-implementation)
4. [Common Mistakes and How to Avoid Them](#common-mistakes-and-how-to-avoid-them)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)
7. [Verification Checklist](#verification-checklist)

---

## Why Build-Time Caching?

### Problem
- Runtime Sanity API calls can be slow (network latency, API rate limits)
- Users experience delayed content loading
- Poor Core Web Vitals (LCP, FCP)
- Dependency on external API availability

### Solution
- Fetch all content during build time
- Store as local JSON/TypeScript files
- Serve instantly from cache in production
- Fallback to API only if cache unavailable

### Benefits
- ⚡ **Instant loading** - No network requests needed
- 🚀 **Better performance** - Improved LCP and FCP scores
- 💰 **Cost savings** - Fewer API calls
- 🛡️ **Resilience** - Works even if Sanity API is temporarily down

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    BUILD TIME                                │
│                                                               │
│  scripts/fetch-homepage-data.ts                              │
│         │                                                     │
│         ├─→ Fetch from Sanity API                            │
│         ├─→ Save to JSON files                               │
│         └─→ Generate TypeScript index.ts                     │
│                                                               │
│  Output: src/data/sanity-cache/                              │
│    ├─ homepage.json                                          │
│    ├─ featured-products.json                                 │
│    ├─ category-products-map.json                             │
│    └─ index.ts (exports all cache)                           │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    RUNTIME (Production)                      │
│                                                               │
│  src/lib/sanity-cache.ts                                     │
│         │                                                     │
│         ├─→ Eagerly pre-load cache module                    │
│         └─→ Match queries to cache exports                   │
│                                                               │
│  src/lib/sanity.client.light.ts                              │
│         │                                                     │
│         ├─→ Check cache first (production only)              │
│         └─→ Fallback to API if cache miss                    │
│                                                               │
│  src/pages/Index.tsx                                         │
│         │                                                     │
│         └─→ Use static imports (instant loading)              │
└─────────────────────────────────────────────────────────────┘
```

---

## Step-by-Step Implementation

### Step 1: Create Build-Time Fetch Script

**File**: `scripts/fetch-homepage-data.ts`

```typescript
import { createClient } from '@sanity/client';
import { writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  homePageQuery,
  featuredProductsQuery,
  featuredCoursesQuery,
  featuredPostsQuery,
  productsByCategoryQuery,
  faqsByPageQuery,
} from '../src/lib/sanity.queries';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get Sanity config from environment variables
const projectId = process.env.VITE_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
const dataset = process.env.VITE_SANITY_DATASET || process.env.SANITY_DATASET || 'production';
const apiVersion = process.env.VITE_SANITY_API_VERSION || process.env.SANITY_API_VERSION || '2023-06-21';

// Category map matching your component logic
const categoryMap: Record<string, string> = {
  ai: 'ai',
  social: 'social-media',
  music: 'music',
  edu: 'education',
  sim: 'sim-card',
};

// Cache directory
const CACHE_DIR = join(__dirname, '../src/data/sanity-cache');

async function ensureCacheDir() {
  try {
    await mkdir(CACHE_DIR, { recursive: true });
    console.log(`✅ Cache directory ready: ${CACHE_DIR}`);
  } catch (error) {
    console.error('❌ Failed to create cache directory:', error);
    throw error;
  }
}

async function saveToCache(filename: string, data: any) {
  const filePath = join(CACHE_DIR, filename);
  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`💾 Saved: ${filename}`);
}

async function fetchHomepageData() {
  if (!projectId || projectId === 'placeholder') {
    console.warn('⚠️  Sanity project ID not configured. Skipping data fetch.');
    return;
  }

  console.log('🚀 Starting homepage data fetch from Sanity...');

  // Create Sanity client
  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
    perspective: 'published',
  });

  try {
    await ensureCacheDir();

    // Fetch all queries
    const homeData = await client.fetch(homePageQuery);
    const featuredProducts = await client.fetch(featuredProductsQuery);
    const featuredCourses = await client.fetch(featuredCoursesQuery);
    const featuredPosts = await client.fetch(featuredPostsQuery);
    
    // Fetch category products
    const categoryProductsMap: Record<string, any[]> = {};
    for (const [key, category] of Object.entries(categoryMap)) {
      const products = await client.fetch(productsByCategoryQuery, { category });
      categoryProductsMap[key] = products;
      await saveToCache(`products-category-${key}.json`, products);
    }
    
    const faqs = await client.fetch(faqsByPageQuery, { page: 'home' });

    // Save all data
    await saveToCache('homepage.json', homeData);
    await saveToCache('featured-products.json', featuredProducts);
    await saveToCache('featured-courses.json', featuredCourses);
    await saveToCache('featured-posts.json', featuredPosts);
    await saveToCache('category-products-map.json', categoryProductsMap);
    await saveToCache('faqs-home.json', faqs);

    // Create TypeScript index file
    const indexContent = `/**
 * Auto-generated cache index file
 * DO NOT EDIT MANUALLY
 */

export const homepageCache = ${JSON.stringify(homeData, null, 2)} as const;
export const featuredProductsCache = ${JSON.stringify(featuredProducts, null, 2)} as const;
export const featuredCoursesCache = ${JSON.stringify(featuredCourses, null, 2)} as const;
export const featuredPostsCache = ${JSON.stringify(featuredPosts, null, 2)} as const;
export const categoryProductsCache = ${JSON.stringify(categoryProductsMap, null, 2)} as const;
export const faqsHomeCache = ${JSON.stringify(faqs, null, 2)} as const;
`;

    await writeFile(join(CACHE_DIR, 'index.ts'), indexContent, 'utf-8');
    console.log('✅ Homepage data fetch completed successfully!');
  } catch (error) {
    console.error('❌ Error fetching homepage data:', error);
    process.exit(1);
  }
}

fetchHomepageData().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
```

**Key Points:**
- ✅ Use environment variables for Sanity config
- ✅ Create cache directory if it doesn't exist
- ✅ Fetch all queries that your page needs
- ✅ Save both JSON files (for debugging) and TypeScript index (for imports)
- ✅ Include comprehensive logging

---

### Step 2: Create Cache Reader Module

**File**: `src/lib/sanity-cache.ts`

```typescript
// Cache module state
let cacheModule: any = null;
let cacheLoadPromise: Promise<any> | null = null;

function shouldUseCache(): boolean {
  return import.meta.env.PROD && import.meta.env.MODE === 'production';
}

/**
 * Pre-load cache module eagerly when module is imported
 * CRITICAL: This prevents race conditions by loading cache before queries run
 */
function initializeCache(): void {
  if (!shouldUseCache()) {
    return;
  }

  // Only initialize once (singleton pattern)
  if (cacheLoadPromise !== null) {
    return;
  }

  // Start loading cache immediately
  cacheLoadPromise = (async () => {
    try {
      const module = await import('../data/sanity-cache/index');
      cacheModule = module;
      console.info('[SANITY-CACHE] ✅ Pre-loaded build-time cache module');
      return module;
    } catch (error) {
      console.warn('[SANITY-CACHE] ⚠️ Cache module not available, will use API');
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

  // Fallback: try loading now
  if (shouldUseCache()) {
    initializeCache();
    if (cacheLoadPromise) {
      return cacheLoadPromise;
    }
  }

  return null;
}

// Initialize cache eagerly when module loads
initializeCache();

/**
 * Get cached data for a query with detailed logging
 */
export async function getCachedData<T>(
  query: string,
  params?: Record<string, any>
): Promise<T | null> {
  if (!shouldUseCache()) {
    return null;
  }

  const cache = await loadCache();
  if (!cache) {
    return null;
  }

  // Normalize query for matching
  const normalizedQuery = query.replace(/\s+/g, ' ').trim();

  // Map query to cache export
  if (normalizedQuery.includes('_type == "home"') && normalizedQuery.includes('[0]')) {
    return (cache.homepageCache as T) || null;
  }

  if (normalizedQuery.includes('_type == "product"') && normalizedQuery.includes('category == $category') && params?.category) {
    const categoryMap = cache.categoryProductsCache;
    const categoryKeys: Record<string, string> = {
      ai: 'ai',
      'social-media': 'social',
      music: 'music',
      education: 'edu',
      'sim-card': 'sim',
    };
    const key = categoryKeys[params.category] || params.category;
    return (categoryMap?.[key] as T) || null;
  }

  // Add more query matchers as needed...
  
  return null;
}

export function isCacheAvailable(): boolean {
  return shouldUseCache() && cacheModule !== null;
}
```

**Key Points:**
- ✅ **Eager initialization** - Start loading cache when module is imported
- ✅ **Singleton pattern** - Only load once, reuse the promise
- ✅ **Query matching** - Normalize queries and match to cache exports
- ✅ **Detailed logging** - Log cache hits/misses for debugging

---

### Step 3: Integrate with Sanity Client

**File**: `src/lib/sanity.client.light.ts`

```typescript
import { getCachedData, isCacheAvailable } from './sanity-cache';

export async function fetchFromSanity<T>(
  query: string,
  params?: Record<string, any>
): Promise<T | null> {
  if (!projectId || projectId === 'placeholder') {
    return null;
  }

  // In production, try to use cached data first
  if (import.meta.env.PROD) {
    const cached = await getCachedData<T>(query, params);
    if (cached !== null) {
      console.info('[SANITY] ✅ Using build-time cached data');
      return cached;
    }
    // Cache miss - fallback to API
    console.info(`[SANITY] ⚠️ CACHE MISS → Fetching from API`);
  }

  // Fallback to API (dev mode or cache miss)
  try {
    return await client.fetch<T>(query, params);
  } catch (error) {
    console.error('[SANITY] Client fetch failed:', error);
    return null;
  }
}
```

**Key Points:**
- ✅ Check cache first in production
- ✅ Fallback to API if cache unavailable
- ✅ Log cache usage for debugging

---

### Step 4: Update Component to Use Static Imports

**File**: `src/pages/Index.tsx`

```typescript
// ✅ CORRECT: Static imports for instant loading
import { fetchFromSanity } from "@/lib/sanity.client.light";
import { validateSanityConfig } from "@/lib/sanity.config";
import { 
  homePageQuery, 
  featuredProductsQuery, 
  // ... other queries
} from "@/lib/sanity.queries";
import * as transformers from "@/lib/sanity.transformers";

// ❌ WRONG: Dynamic imports add delay
// const { fetchFromSanity } = await import("@/lib/sanity.client.light");

const Index = () => {
  useEffect(() => {
    const loadSanityData = async () => {
      // ✅ CORRECT: Load immediately, no delays
      const data = await fetchFromSanity(homePageQuery);
      // ...
    };

    // ✅ CORRECT: Call immediately
    loadSanityData();

    // ❌ WRONG: These add unnecessary delays
    // requestIdleCallback(loadSanityData, { timeout: 1000 });
    // setTimeout(loadSanityData, 0);
  }, []);

  // ✅ CORRECT: Use Sanity data with fallbacks
  return (
    <h1>{slide?.title || HERO_TITLE}</h1>
    <p>{slide?.subtitle || HERO_SUBTITLE}</p>
  );
};
```

**Key Points:**
- ✅ Use **static imports** for Sanity modules
- ✅ Call data loading **immediately** in useEffect
- ✅ **No delays** - Remove `requestIdleCallback` and `setTimeout`
- ✅ Use **fallback values** when Sanity data is empty

---

### Step 5: Update Build Configuration

**File**: `package.json`

```json
{
  "scripts": {
    "prebuild": "tsx scripts/fetch-homepage-data.ts",
    "build": "vite build",
    "fetch:homepage": "tsx scripts/fetch-homepage-data.ts"
  },
  "devDependencies": {
    "tsx": "^4.19.2"
  }
}
```

**File**: `tsconfig.node.json`

```json
{
  "include": ["vite.config.ts", "scripts/**/*.ts"]
}
```

**File**: `.gitignore`

```
# Sanity build-time cache
src/data/sanity-cache/*.json
src/data/sanity-cache/*.ts
!src/data/sanity-cache/.gitkeep
```

**Key Points:**
- ✅ `prebuild` script runs before build
- ✅ Add `tsx` as dev dependency
- ✅ Include scripts directory in TypeScript config
- ✅ Ignore cache files in git (they're generated)

---

## Common Mistakes and How to Avoid Them

### ❌ Mistake 1: Race Condition - Cache Not Ready

**Problem:**
```typescript
// Cache loads lazily, but queries run immediately
const cache = await import('../data/sanity-cache/index'); // Too late!
const data = await getCachedData(query); // Cache not ready yet
```

**Solution:**
```typescript
// ✅ Eagerly pre-load cache when module is imported
function initializeCache(): void {
  if (!shouldUseCache()) return;
  if (cacheLoadPromise !== null) return; // Singleton
  
  cacheLoadPromise = (async () => {
    const module = await import('../data/sanity-cache/index');
    cacheModule = module;
    return module;
  })();
}

// Initialize immediately when module loads
initializeCache();
```

**Why it works:**
- Cache starts loading as soon as the module is imported
- Singleton pattern ensures it only loads once
- Queries wait for the pre-loaded promise

---

### ❌ Mistake 2: Dynamic Imports Add Delay

**Problem:**
```typescript
// ❌ Dynamic import adds network delay
const { fetchFromSanity } = await import("@/lib/sanity.client.light");
```

**Solution:**
```typescript
// ✅ Static import - instant, no delay
import { fetchFromSanity } from "@/lib/sanity.client.light";
```

**Why it works:**
- Static imports are bundled at build time
- No runtime network requests
- Data comes from cache anyway, so no need for lazy loading

---

### ❌ Mistake 3: Intentional Delays

**Problem:**
```typescript
// ❌ These add unnecessary delays
requestIdleCallback(loadSanityData, { timeout: 1000 });
setTimeout(loadSanityData, 0);
```

**Solution:**
```typescript
// ✅ Load immediately - data is from cache (instant)
useEffect(() => {
  loadSanityData(); // No delays needed!
}, []);
```

**Why it works:**
- Cache data is already available (no network delay)
- Loading immediately improves perceived performance
- No need to defer when data is instant

---

### ❌ Mistake 4: Missing Fallback Values

**Problem:**
```typescript
// ❌ If Sanity data is empty, shows nothing
<h1>{slide.title}</h1>
```

**Solution:**
```typescript
// ✅ Always provide fallbacks
<h1>{slide?.title || HERO_TITLE}</h1>
<p>{slide?.subtitle || HERO_SUBTITLE}</p>
```

**Why it works:**
- Ensures content always displays
- Graceful degradation if Sanity data is missing
- Better user experience

---

### ❌ Mistake 5: Incorrect Query Matching

**Problem:**
```typescript
// ❌ Exact string matching fails due to whitespace differences
if (query === 'homePageQuery') { // Never matches!
```

**Solution:**
```typescript
// ✅ Normalize query and use semantic matching
const normalizedQuery = query.replace(/\s+/g, ' ').trim();
if (normalizedQuery.includes('_type == "home"') && normalizedQuery.includes('[0]')) {
  return cache.homepageCache;
}
```

**Why it works:**
- Normalizes whitespace differences
- Matches semantic query structure
- More robust than exact string matching

---

### ❌ Mistake 6: Not Checking Production Mode

**Problem:**
```typescript
// ❌ Always tries to use cache, even in dev
const cached = await getCachedData(query);
```

**Solution:**
```typescript
// ✅ Only use cache in production
if (import.meta.env.PROD) {
  const cached = await getCachedData(query);
  if (cached !== null) return cached;
}
// Fallback to API in dev mode
```

**Why it works:**
- Dev mode always uses live API (fresh data)
- Production uses cache (fast, reliable)
- Clear separation of concerns

---

### ❌ Mistake 7: Forgetting to Run Prebuild Script

**Problem:**
```json
// ❌ No prebuild script - cache never generated
{
  "scripts": {
    "build": "vite build"
  }
}
```

**Solution:**
```json
// ✅ Prebuild script runs before build
{
  "scripts": {
    "prebuild": "tsx scripts/fetch-homepage-data.ts",
    "build": "vite build"
  }
}
```

**Why it works:**
- `prebuild` automatically runs before `build`
- Ensures cache is always fresh
- No manual steps needed

---

## Best Practices

### 1. Comprehensive Logging

Always include detailed logging to debug cache hits/misses:

```typescript
console.info('[SANITY-CACHE] ✅ CACHE HIT: homePageQuery');
console.warn('[SANITY-CACHE] ⚠️ CACHE MISS: Query not matched');
console.debug('[SANITY-CACHE] Query snippet:', normalizedQuery.substring(0, 100));
```

### 2. Validate Cache Data

Check that cached data has expected structure:

```typescript
if (module?.homepageCache) {
  const requiredFields = ['heroSlides', 'bestSellerProducts', ...];
  const missingFields = requiredFields.filter(field => !(field in module.homepageCache));
  if (missingFields.length > 0) {
    console.warn(`⚠️ Homepage cache missing fields: ${missingFields.join(', ')}`);
  }
}
```

### 3. Handle Empty Arrays

Distinguish between "cache miss" and "empty data":

```typescript
if (data !== null) {
  const count = Array.isArray(data) ? data.length : 0;
  if (count > 0) {
    console.info(`✅ CACHE HIT: ${count} items`);
  } else {
    console.warn(`⚠️ CACHE HIT (empty): Array is empty`);
  }
}
```

### 4. Category Mapping

Keep category mappings consistent between build script and cache reader:

```typescript
// In build script
const categoryMap = { ai: 'ai', social: 'social-media', ... };

// In cache reader
const categoryKeys = { ai: 'ai', 'social-media': 'social', ... };
```

### 5. Error Handling

Always handle errors gracefully:

```typescript
try {
  const cached = await getCachedData(query);
  if (cached !== null) return cached;
} catch (error) {
  console.warn('[SANITY-CACHE] Error loading cache:', error);
  // Fallback to API
}
```

### 6. Type Safety

Use TypeScript for type safety:

```typescript
export async function getCachedData<T>(
  query: string,
  params?: Record<string, any>
): Promise<T | null> {
  // ...
  return (cache.homepageCache as T) || null;
}
```

---

## Troubleshooting

### Issue: Cache Not Loading

**Symptoms:**
```
[SANITY-CACHE] ⚠️ Cache module not available, falling back to API
```

**Solutions:**
1. Check that `prebuild` script ran successfully
2. Verify cache files exist in `src/data/sanity-cache/`
3. Check that `index.ts` was generated
4. Verify environment variables are set correctly

### Issue: Cache Misses in Production

**Symptoms:**
```
[SANITY] ⚠️ CACHE MISS → Fetching from API
```

**Solutions:**
1. Check query matching logic - queries might not match
2. Verify query normalization is working
3. Check that params match expected format
4. Review cache exports match query structure

### Issue: Empty Arrays from Cache

**Symptoms:**
```
[SANITY-CACHE] ⚠️ CACHE HIT (empty): Array is empty
```

**Solutions:**
1. This is usually a **content issue**, not a cache issue
2. Check Sanity CMS - data might not be published
3. Verify query parameters are correct
4. Check category mappings match Sanity schema

### Issue: Race Condition

**Symptoms:**
```
Cache loads after queries run, causing API fallbacks
```

**Solutions:**
1. Ensure `initializeCache()` is called at module level
2. Use singleton promise pattern
3. Wait for `cacheLoadPromise` before queries

### Issue: TypeScript Errors

**Symptoms:**
```
Cannot find module '../data/sanity-cache/index'
```

**Solutions:**
1. Run `npm run fetch:homepage` to generate cache
2. Check `tsconfig.json` includes cache directory
3. Verify `index.ts` exists and exports are correct

---

## Verification Checklist

Before deploying, verify:

- [ ] Build script runs successfully (`npm run fetch:homepage`)
- [ ] Cache files are generated in `src/data/sanity-cache/`
- [ ] `index.ts` exports all required cache data
- [ ] Cache reader eagerly initializes on import
- [ ] All queries have matching cache logic
- [ ] Production mode check is correct (`import.meta.env.PROD`)
- [ ] Static imports are used (no dynamic imports)
- [ ] No intentional delays in data loading
- [ ] Fallback values are provided for all dynamic content
- [ ] Logging shows cache hits in production
- [ ] TypeScript compilation passes
- [ ] `.gitignore` excludes cache files
- [ ] `prebuild` script is in `package.json`

---

## Summary

Build-time caching for Sanity is a powerful optimization that can dramatically improve page load times. The key to success is:

1. **Eager cache loading** - Start loading cache when module imports
2. **Static imports** - No dynamic imports for instant loading
3. **No delays** - Load data immediately, cache is instant
4. **Fallback values** - Always provide defaults
5. **Comprehensive logging** - Debug cache hits/misses
6. **Query matching** - Robust semantic matching, not exact strings
7. **Error handling** - Graceful fallback to API

By following this guide and avoiding the common mistakes, you'll have a fast, reliable, and maintainable caching system.

---

## Additional Resources

- [Sanity Client Documentation](https://www.sanity.io/docs/js-client)
- [Vite Build Process](https://vitejs.dev/guide/build.html)
- [TypeScript Module Resolution](https://www.typescriptlang.org/docs/handbook/module-resolution.html)

