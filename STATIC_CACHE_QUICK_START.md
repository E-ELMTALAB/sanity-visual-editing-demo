# Static Sanity Cache - Quick Start & Testing

## ⚡ Quick Start (5 minutes)

### 1. Verify Setup
```bash
# Check files exist
ls -la scripts/cache-sanity-data.ts
ls -la lib/sanity-cache.ts
ls -la lib/sanity-cached-client.ts
ls -la public/sanity-cache/

# Verify package.json has prebuild
grep "prebuild" package.json
```

### 2. Test Cache Generation
```bash
# Generate cache manually
npm run cache:sanity

# You should see:
# ✅ Cache script starting...
# 🚀 SANITY BUILD-TIME CACHE FETCHER
# ...
# ✅ CACHE GENERATION COMPLETE!
# 📊 Total cache size: X.XXmb
```

### 3. Check Generated Files
```bash
ls -la public/sanity-cache/
# Should show: index.json, index.ts, homepage.json, etc.

# View cache size
du -sh public/sanity-cache/
```

### 4. Build Production
```bash
# Full build with cache generation
npm run build

# Logs should show:
# > prebuild running
# > cache-sanity-data.ts executing
# > ✅ Cache files generated
# > next build running
# > build complete ✓
```

### 5. Test Static Serving
```bash
# Start production server
npm start

# Visit: http://localhost:3000

# Check browser console - NO Sanity API calls should appear
# Check Network tab - NO requests to api.sanity.io
```

---

## 🧪 Verification Tests

### Test 1: Verify No API Calls

**What to check:**
1. Open DevTools (F12)
2. Go to Network tab
3. Reload page
4. Search for "api.sanity.io"
5. **Result**: Should find ZERO requests ✅

**If you see requests:**
- Cache may not have generated
- Run: `npm run cache:sanity`
- Rebuild: `npm run build`

### Test 2: Check Cache Files

```bash
# Should exist
test -f public/sanity-cache/index.json && echo "✅ index.json exists"
test -f public/sanity-cache/homepage.json && echo "✅ homepage.json exists"
test -f public/sanity-cache/allProducts.json && echo "✅ allProducts.json exists"
test -f public/sanity-cache/courses.json && echo "✅ courses.json exists"
test -f public/sanity-cache/blogPosts.json && echo "✅ blogPosts.json exists"
test -f public/sanity-cache/faqs.json && echo "✅ faqs.json exists"

# View size
ls -lh public/sanity-cache/ | grep -v "^d" | grep -v "total"
```

### Test 3: Verify Content Loads

```bash
# All pages should load instantly
curl -s http://localhost:3000/ > /dev/null && echo "✅ Homepage loads"
curl -s http://localhost:3000/products > /dev/null && echo "✅ Products page loads"
curl -s http://localhost:3000/courses > /dev/null && echo "✅ Courses page loads"
curl -s http://localhost:3000/blog > /dev/null && echo "✅ Blog page loads"
```

### Test 4: Check Lighthouse Performance

**Before caching:**
```
Performance: 55-65
LCP (Largest Contentful Paint): 2.5-3.5s
FCP (First Contentful Paint): 1.5-2.5s
CLS (Cumulative Layout Shift): 0.1-0.2
```

**After caching (expected):**
```
Performance: 90-98
LCP: 0.5-1.0s ⚡
FCP: 0.3-0.5s ⚡
CLS: 0.01-0.05 ⚡
```

**To test:**
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Run audit (Mobile or Desktop)
4. Compare scores

### Test 5: Verify Cache Loading

```typescript
// Add to a page temporarily to test
import { getCacheStatus, isCacheAvailable } from 'lib/sanity-cache'

export default function TestPage() {
  const available = isCacheAvailable()
  const status = getCacheStatus()
  
  return (
    <div>
      <h1>Cache Status</h1>
      <p>Available: {available ? '✅ Yes' : '❌ No'}</p>
      <p>Source: {status.source}</p>
      <p>Timestamp: {new Date(status.timestamp || 0).toISOString()}</p>
    </div>
  )
}
```

---

## 📊 Expected Results

### Cache Generation
```bash
npm run cache:sanity
```

**Expected output:**
```
✅ Cache script starting...
🚀 SANITY BUILD-TIME CACHE FETCHER
═══════════════════════════════════════════════════════════
ℹ️  Project: your-project-id
ℹ️  Dataset: production
ℹ️  API Version: 2023-06-21
✅ Cache directory ready

📥 Fetching content...
  Fetching homepage...
    ✓ homepage (XX.XXkb)
  Fetching allProducts...
    ✓ allProducts (XXXXX.XXkb)
  Fetching categories...
    ✓ categories (X.XXkb)
  Fetching courses...
    ✓ courses (X.XXkb)
  Fetching blogPosts...
    ✓ blogPosts (XXX.XXkb)
  Fetching faqs...
    ✓ faqs (XX.XXkb)
  Fetching collections...
    ✓ collections (X.XXkb)

💾 Saving to cache files...
✅ Cached: homepage.json (XX.XXkB)
✅ Cached: allProducts.json (XXXXX.XXkB)
... [more files]
✅ Generated TypeScript index exports

═══════════════════════════════════════════════════════════
✅ CACHE GENERATION COMPLETE!
═══════════════════════════════════════════════════════════
📊 Total cache size: X.XXmB
📁 Cache location: /path/to/public/sanity-cache
📚 Files cached: 7
✨ Production builds will serve data statically with NO API calls!
```

### Build Output
```bash
npm run build
```

**Expected to see:**
```
> prebuild
✅ Cache script starting...
[cache generation output...]
✅ CACHE GENERATION COMPLETE!

> build (next build)
▲ Next.js [version]
- Compiling...
- Linting source code...
✓ Linting
✓ Compiling client and server
✓ Collecting page data
✓ Generating static pages
✓ Collecting build traces
Build succeeded!
```

---

## 🔍 Debugging

### If cache files don't generate

**Check 1: Sanity credentials**
```bash
echo "Project: $NEXT_PUBLIC_SANITY_PROJECT_ID"
echo "Dataset: $NEXT_PUBLIC_SANITY_DATASET"
echo "Has token: ${#SANITY_API_READ_TOKEN}"
```

**Check 2: File permissions**
```bash
ls -la scripts/cache-sanity-data.ts
chmod +x scripts/cache-sanity-data.ts
```

**Check 3: Try manually with verbose output**
```bash
tsx scripts/cache-sanity-data.ts 2>&1 | tee cache-debug.log
```

**Check 4: Verify directory exists**
```bash
mkdir -p public/sanity-cache
ls -la public/sanity-cache/
```

### If API calls still happen

**Check 1: Node environment**
```bash
# In production only (NODE_ENV must be production)
NODE_ENV=production npm start

# Check what's set
echo "NODE_ENV: $NODE_ENV"
echo "Environment: $(node -p 'process.env.NODE_ENV')"
```

**Check 2: Enable debug logging**
```typescript
// Add to lib/sanity-cache.ts or your page
console.debug('[SANITY-CACHE] Debug mode enabled')
```

**Check 3: Check browser Network tab**
```
Filter: api.sanity.io
Result should be EMPTY ✅
```

---

## 🚀 Deployment Checklist

- [ ] `npm run build` completes without errors
- [ ] `public/sanity-cache/` contains multiple `.json` files
- [ ] `npm start` runs successfully
- [ ] No API calls to Sanity in Network tab (DevTools)
- [ ] All pages load and display content correctly
- [ ] Lighthouse performance score improved (90+)
- [ ] Deploy to production with cache files included
- [ ] Verify cache was deployed
- [ ] Monitor performance in production

---

## 📈 Performance Metrics

### Before (Current - with API calls)
```
Page Load Time: 2-3 seconds
Time to Interactive: 2.5-3.5 seconds
API Calls per page: 4-7
Lighthouse: 55-70
CLS: Poor (images loading)
```

### After (Static Cache - expected)
```
Page Load Time: 0.2-0.5 seconds ⚡⚡⚡
Time to Interactive: 0.5-1.0 second ⚡⚡
API Calls per page: 0 ✅
Lighthouse: 95+ ✅
CLS: Excellent ✅
```

---

## 📝 Useful Commands

```bash
# Generate cache
npm run cache:sanity

# Build with cache
npm run build

# Test production build locally
npm run build && npm start

# Check cache files
ls -lh public/sanity-cache/

# View cache size
du -sh public/sanity-cache/

# Clear cache
rm -rf public/sanity-cache/*.json

# View specific cache
cat public/sanity-cache/homepage.json | head -20

# Pretty print cache
cat public/sanity-cache/homepage.json | jq '.' | head -50
```

---

## 🎯 Success Indicators

✅ Cache generation runs successfully
✅ Cache files appear in `public/sanity-cache/`
✅ Build completes without errors
✅ Website loads and displays all content
✅ Zero Sanity API calls in production
✅ Page load time reduced by 60-80%
✅ Lighthouse performance score 90+
✅ All content visible instantly

---

## ❓ Common Issues

| Issue | Solution |
|-------|----------|
| Cache files not generated | Run `npm run cache:sanity` manually |
| API calls still happening | Check `NODE_ENV=production` |
| Build fails | Check Sanity credentials in `.env` |
| Old data showing | Regenerate cache: `npm run build` |
| File size too large | Check product count, can be normal |

---

**You're ready to test!** Run `npm run build && npm start` to see your instant static cache in action! 🚀
