# Testing Cache-Only Mode

This guide explains how to verify that your application is using cached data and not making API calls to Sanity.

## Method 1: Enable Cache-Only Mode (Recommended)

Cache-only mode will **block all API calls** and throw errors if a cache miss occurs. This is the best way to verify everything is working from cache.

### Step 1: Enable Cache-Only Mode

Create or update your `.env` file (or set environment variable):

```bash
# In .env file
VITE_SANITY_CACHE_ONLY=true
```

Or set it when running the dev server:

```bash
# Windows PowerShell
$env:VITE_SANITY_CACHE_ONLY="true"; npm run dev

# Windows CMD
set VITE_SANITY_CACHE_ONLY=true && npm run dev

# Linux/Mac
VITE_SANITY_CACHE_ONLY=true npm run dev
```

### Step 2: Build and Test

1. **First, ensure cache is generated:**
   ```bash
   npm run fetch:homepage
   ```

2. **Build for production:**
   ```bash
   npm run build
   ```

3. **Preview the production build:**
   ```bash
   npm run preview
   ```

4. **Test the application:**
   - Navigate to the homepage
   - Click on products
   - Navigate to product detail pages
   - Check the browser console

### Step 3: What to Look For

**✅ Success (Cache Working):**
- No errors in console
- Pages load instantly
- Console shows: `[SANITY] Using build-time cached data (no API calls)`
- Console shows: `[SANITY-CACHE] ✅ CACHE HIT` messages
- No network requests to `*.sanity.io` or your proxy endpoint

**❌ Failure (Cache Not Working):**
- Errors like: `🚫 CACHE-ONLY MODE: API call blocked`
- This means a cache miss occurred
- Check that:
  1. Build script ran successfully
  2. Cache files exist in `src/data/sanity-cache/`
  3. Query matches cache logic

### Step 4: Disable Cache-Only Mode

After testing, disable it:

```bash
# Remove from .env or set to false
VITE_SANITY_CACHE_ONLY=false
```

---

## Method 2: Check Browser Network Tab

### Step 1: Open Browser DevTools

1. Open your application in the browser
2. Press `F12` or right-click → "Inspect"
3. Go to the **Network** tab

### Step 2: Filter Network Requests

1. In the Network tab, use the filter box
2. Type: `sanity` or `api.sanity.io` or your proxy endpoint
3. This will show only Sanity-related requests

### Step 3: Navigate Your Site

1. **Reload the homepage** - Should see NO Sanity API calls
2. **Click on a product** - Should see NO Sanity API calls
3. **Navigate between pages** - Should see NO Sanity API calls

### Step 4: What to Look For

**✅ Success (No API Calls):**
- Network tab shows **zero requests** to Sanity
- All data loads instantly
- Console shows cache hit messages

**❌ Failure (API Calls Detected):**
- Network tab shows requests to:
  - `*.apicdn.sanity.io`
  - `*.api.sanity.io`
  - Your proxy endpoint (e.g., `sanityproxy.elmtalabx.workers.dev`)
- Console shows: `[SANITY] ⚠️ CACHE MISS → Fetching from API`
- This indicates a cache miss

---

## Method 3: Check Console Logs

The application logs detailed information about cache usage.

### Look for These Messages:

**Cache Hits (Good):**
```
[SANITY-CACHE] ✅ Pre-loaded build-time cache module
[SANITY-CACHE] ✅ CACHE HIT: homePageQuery
[SANITY-CACHE] ✅ CACHE HIT: productBySlugQuery (slug: chatgpt-plus)
[SANITY] Using build-time cached data (no API calls)
```

**Cache Misses (Bad):**
```
[SANITY-CACHE] ⚠️ CACHE MISS: homePageQuery (data is null)
[SANITY] ⚠️ CACHE MISS → Fetching from API: homePageQuery
[SANITY] Using direct browser client → https://...
```

**Cache-Only Mode (Testing):**
```
[SANITY] 🚫 CACHE-ONLY MODE ENABLED - All API calls will be blocked!
```

---

## Method 4: Verify Cache Files Exist

### Check Cache Directory

```bash
# Navigate to project
cd glass-luxe-ui-main

# Check if cache files exist
ls src/data/sanity-cache/

# Should see:
# - homepage.json
# - featured-products.json
# - products-map.json
# - products-faqs.json
# - index.ts
# - ... other cache files
```

### Verify Cache Content

```bash
# Check products cache
cat src/data/sanity-cache/products-map.json | head -50

# Should see JSON with product slugs as keys
```

---

## Troubleshooting

### Issue: Cache-Only Mode Shows Errors

**Solution:**
1. Run `npm run fetch:homepage` to regenerate cache
2. Check that all queries are matched in `sanity-cache.ts`
3. Verify cache files exist and are not empty

### Issue: Network Tab Shows API Calls

**Possible Causes:**
1. **Not in production mode** - Cache only works in `PROD` mode
   - Solution: Use `npm run build` and `npm run preview`
2. **Cache not generated** - Build script didn't run
   - Solution: Run `npm run fetch:homepage`
3. **Query not matched** - Query doesn't match cache logic
   - Solution: Check `sanity-cache.ts` query matching

### Issue: Console Shows Cache Misses

**Check:**
1. Is cache-only mode enabled? (Should block API calls)
2. Are cache files present?
3. Does the query match the cache logic?
4. Check browser console for detailed error messages

---

## Quick Test Checklist

- [ ] Cache files exist in `src/data/sanity-cache/`
- [ ] Build script ran successfully (`npm run fetch:homepage`)
- [ ] Production build created (`npm run build`)
- [ ] Cache-only mode enabled (`VITE_SANITY_CACHE_ONLY=true`)
- [ ] No errors in browser console
- [ ] No Sanity API calls in Network tab
- [ ] Console shows cache hit messages
- [ ] Pages load instantly

---

## Summary

**Best Testing Method:** Enable cache-only mode (`VITE_SANITY_CACHE_ONLY=true`) and test. If everything works without errors, your cache is working perfectly!

**Quick Verification:** Check browser Network tab - should see zero requests to Sanity.

**Production:** Cache-only mode is automatically enabled in production builds (cache is checked first, API is fallback).

