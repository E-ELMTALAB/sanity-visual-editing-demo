# Static Sanity Content Caching - Complete Implementation Plan

## Current Status: ❌ NOT IMPLEMENTED

Your website currently **DOES NOT** have static caching from Sanity. Every page request makes runtime API calls to Sanity CMS.

### Current Flow (❌ Not Optimal)
```
User Request → Next.js Page → client.fetch() to Sanity API → API Response → Render Page
```

**Problems:**
- ⏱️ Network latency on every request
- 📊 API rate limits
- 🌐 Dependent on Sanity API availability
- 🐢 Slower page loads and Core Web Vitals

---

## ✅ Desired Flow (Static Caching)

```
[BUILD TIME]
nx build
  ↓
prebuild script runs: tsx scripts/cache-sanity-data.ts
  ↓
Fetch from Sanity API:
  - Homepage data
  - Products
  - Courses
  - Collections
  - FAQs
  - Blog posts
  - Categories
  ↓
Save to: dist/sanity-cache/ (JSON files)
  ↓
Next.js build continues with static cache available

[RUNTIME - Production]
User Request → Next.js Page
  ↓
Import from static JSON cache
  ↓
Instant content rendering
  ↓
NO API CALLS TO SANITY
  ↓
Perfect performance ✨
```

---

## What You Need to Do

### Phase 1: Create Build-Time Cache Script ⚙️

**File to create**: `scripts/cache-sanity-data.ts`

This script will:
1. Run BEFORE the build starts
2. Fetch all Sanity content
3. Save as static JSON files in `public/sanity-cache/`
4. Be embedded in the Next.js build output

**Content to fetch:**
- `homepage.json` - Hero, banners, promo cards
- `products.json` - All products
- `collections.json` - All collections
- `courses.json` - All courses
- `blog-posts.json` - All blog posts
- `faqs.json` - All FAQs by page
- `categories.json` - Product categories

### Phase 2: Update Build Process 🔨

**File to update**: `package.json`

Change from:
```json
"build": "next build"
```

To:
```json
"build": "tsx scripts/cache-sanity-data.ts && next build"
```

### Phase 3: Update Sanity Client 🔌

**File to update**: `lib/sanity.client.ts`

Modify to:
1. Check if cache exists in production
2. Match queries to cached data
3. Return cached data without API calls
4. Fallback to API only if cache missing

### Phase 4: Update Components 🎨

**How to use the cache in pages:**

Instead of:
```typescript
const data = await client.fetch(homepageQuery)
```

Use:
```typescript
import { getCachedData } from 'lib/sanity-cache'
const data = getCachedData('homepage') || {}
```

---

## Benefits When Implemented ✨

| Metric | Current | After Cache |
|--------|---------|------------|
| **API Calls per Page** | 2-5 per request | 0 (build time only) |
| **Page Load Time** | 1-3 seconds | ~100ms |
| **Lighthouse Performance** | 60-70 | 95+ |
| **Cost** | Higher API usage | Minimal |
| **Resilience** | Depends on Sanity | Works offline |

---

## Next Steps

1. **Create the cache script** - Fetch all Sanity content at build time
2. **Embed cache in public folder** - Make it part of the static output
3. **Update the build command** - Run fetch script before Next.js build
4. **Modify client to use cache** - Import cache instead of API calls
5. **Test in production** - Verify no Sanity API calls are made

---

## Questions to Answer Before Implementation

- ✅ Should dynamic content (like prices) also be cached? (Yes, at build time)
- ✅ How often should we rebuild? (Deploy strategy dependent)
- ✅ Should preview mode bypass cache? (Yes, always use API in draft mode)
- ✅ Where to store cache files? (In `public/sanity-cache/` for static serving)

---

## Implementation Files Needed

### New Files to Create:
1. `scripts/cache-sanity-data.ts` - The cache fetching script
2. `lib/sanity-cache.ts` - Cache management utilities
3. `public/sanity-cache/.gitkeep` - Cache directory placeholder

### Files to Modify:
1. `package.json` - Add prebuild script
2. `lib/sanity.client.ts` - Add cache checking logic
3. `app/page.tsx` - Use cache instead of API
4. Other page files - Use cache instead of API

---

## Example Implementation

### Cache Script Output
```
✅ Cache script starting...
🔗 Connecting to Sanity...
📥 Fetching homepage data...
📥 Fetching 150 products...
📥 Fetching 20 courses...
📥 Fetching 50 blog posts...
📥 Fetching 30 FAQs...
💾 Saved homepage.json
💾 Saved products.json
💾 Saved courses.json
💾 Saved blog-posts.json
💾 Saved faqs.json
✅ Cache complete! Ready to build...
```

### Runtime (No API Calls)
```
[homepage] ✅ Using static cache (updated 2 hours ago)
[products] ✅ Using static cache (1500+ items)
[courses] ✅ Using static cache (20 items)
[blog] ✅ Using static cache (50 items)

Build time: ~2.5MB cache files
Runtime performance: Instant ⚡
```

---

## Important Notes

⚠️ **Cache Strategy Considerations:**

1. **Build-time only**: Cache is generated during build, not runtime
2. **Static serving**: Cache files are served from `public/` as static assets
3. **No runtime fetches**: All data comes from cached JSON files
4. **Deployment**: Deploy cache files along with your app
5. **Rebuilds**: Update cache by re-running build process

---

## Implementation Ready?

Once you're ready, we'll:
1. Create the cache fetching script
2. Update your build process
3. Modify all pages to use cache
4. Test that NO API calls are made
5. Verify all content displays correctly

**Current Status**: Ready to implement ✅
