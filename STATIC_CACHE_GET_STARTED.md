# 🚀 GET STARTED NOW - Static Sanity Cache Commands

## Immediate Next Steps (Copy & Paste)

### Step 1: Generate Cache
```bash
npm run cache:sanity
```

Expected output:
```
✅ Cache script starting...
🚀 SANITY BUILD-TIME CACHE FETCHER
═══════════════════════════════════════════════════════════
ℹ️  Project: [your-project-id]
ℹ️  Dataset: production
📥 Fetching content...
💾 Saving to cache files...
✅ CACHE GENERATION COMPLETE!
📊 Total cache size: X.XXmB
```

### Step 2: Build Your Project
```bash
npm run build
```

Expected output:
```
> prebuild
✅ Cache script starting...
[cache generation output...]
✅ CACHE GENERATION COMPLETE!

> build (next build)
▲ Next.js [version]
- Compiling...
✓ Compiling client and server
✓ Generating static pages
Build succeeded!
```

### Step 3: Start Production Server
```bash
npm start
```

Expected output:
```
> next start
▲ Next.js [version]
- Ready on http://localhost:3000
```

### Step 4: Test Performance
1. Open http://localhost:3000
2. Open DevTools (F12)
3. Go to Network tab
4. Reload the page
5. **Search for "api.sanity.io"**
6. **Result should be: EMPTY ✅ (zero API calls)**

---

## Verification Commands

### Check Cache Files Generated
```bash
ls -lh public/sanity-cache/
```

Should show:
```
-rw-r--r--   index.json          (50KB)
-rw-r--r--   homepage.json       (45KB)
-rw-r--r--   allProducts.json    (1.2MB)
-rw-r--r--   categories.json     (8KB)
-rw-r--r--   courses.json        (85KB)
-rw-r--r--   blogPosts.json      (120KB)
-rw-r--r--   faqs.json           (15KB)
-rw-r--r--   collections.json    (12KB)
```

### Check Total Cache Size
```bash
du -sh public/sanity-cache/
```

Should show: **2-5MB** (typical)

### Verify No API Calls in Production
```bash
# Terminal 1: Start server
npm start

# Terminal 2: Check logs
curl -v http://localhost:3000 2>&1 | grep -i sanity
```

Should return: **Nothing** (no Sanity API requests)

---

## Testing Checklist

```bash
# ✅ Cache generated?
test -f public/sanity-cache/homepage.json && echo "✅ Cache exists"

# ✅ Build succeeds?
npm run build && echo "✅ Build successful"

# ✅ Server starts?
timeout 5 npm start && echo "✅ Server starts"

# ✅ Homepage loads?
curl -s http://localhost:3000 | grep -q "<html" && echo "✅ Homepage loads"

# ✅ Products page loads?
curl -s http://localhost:3000/products | grep -q "product" && echo "✅ Products page loads"
```

---

## Performance Check

### Before & After

**Check 1: Page Load Time**
```bash
# In DevTools Console
performance.timing.loadEventEnd - performance.timing.navigationStart
# Before: 2000-3000ms
# After: 100-500ms
```

**Check 2: Network Requests**
```bash
# In DevTools Network tab
# Count requests to api.sanity.io
# Before: 4-7 requests
# After: 0 requests ✅
```

**Check 3: Total Page Size**
```bash
# In DevTools Network tab
# Total transferred
# Before: 150-300KB per request
# After: ~50KB (just HTML) ✅
```

**Check 4: Lighthouse Score**
```bash
# In DevTools -> Lighthouse tab
# Run audit
# Before: 55-70
# After: 95+ ✅
```

---

## If Something Goes Wrong

### Issue: Cache not generating

```bash
# Step 1: Check environment variables
echo "Project ID: $NEXT_PUBLIC_SANITY_PROJECT_ID"
echo "Dataset: $NEXT_PUBLIC_SANITY_DATASET"

# Step 2: Try manual generation with verbose output
npm run cache:sanity -- --verbose

# Step 3: Check file permissions
chmod +x scripts/cache-sanity-data.ts

# Step 4: Check directory exists
mkdir -p public/sanity-cache
```

### Issue: API calls still happening

```bash
# Step 1: Check production mode
echo "NODE_ENV: $NODE_ENV"

# Step 2: Start in production mode explicitly
NODE_ENV=production npm start

# Step 3: Check cache files exist
ls -la public/sanity-cache/

# Step 4: Check browser console for errors
# Open DevTools -> Console tab
# Look for cache-related errors
```

### Issue: Stale data

```bash
# Regenerate cache
rm -rf public/sanity-cache/*
npm run build
npm start
```

---

## One-Command Setup

```bash
# Everything at once
npm run cache:sanity && npm run build && npm start
```

Then open http://localhost:3000 and verify no API calls!

---

## Continuous Deployment (CI/CD)

### GitHub Actions Example
```yaml
- name: Generate Sanity Cache
  run: npm run cache:sanity

- name: Build
  run: npm run build

- name: Deploy
  run: npm start
```

### Vercel (Automatic)
```bash
git push
# Vercel automatically:
# 1. Runs npm run build
# 2. Which runs npm run cache:sanity
# 3. Deploys with cache included
```

### Railway (Automatic)
```bash
git push
# Railway automatically:
# 1. Runs npm run build
# 2. Which runs npm run cache:sanity
# 3. Deploys with cache included
```

---

## Production Deployment

### Option 1: Vercel
```bash
# Just push to your main branch
git add .
git commit -m "Add static Sanity cache"
git push
# Vercel handles the rest ✅
```

### Option 2: Railway
```bash
# Just push to your main branch
git add .
git commit -m "Add static Sanity cache"
git push
# Railway handles the rest ✅
```

### Option 3: Docker
```dockerfile
# Dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build  # This runs cache:sanity automatically
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t my-app .
docker run -p 3000:3000 my-app
```

### Option 4: Self-Hosted
```bash
# SSH into your server
ssh user@your-server

# Clone or pull latest code
git clone [repo] my-app
cd my-app

# Install and build
npm install
npm run build  # This runs cache:sanity automatically

# Start production server
npm start
```

---

## Monitoring & Debugging

### Enable Debug Logging
```typescript
// Add to your page temporarily
import { getCacheStatus, isCacheAvailable } from 'lib/sanity-cache'

export default function DebugPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Cache Status</h2>
      <p>Available: {isCacheAvailable() ? '✅ Yes' : '❌ No'}</p>
      <p>Status: {JSON.stringify(getCacheStatus(), null, 2)}</p>
    </div>
  )
}
```

### Check Build Logs
```bash
# See cache generation details
npm run cache:sanity 2>&1 | tee cache.log

# View the log
cat cache.log

# Count how much was cached
grep "✅ Cached" cache.log | wc -l
```

### Monitor Network
```bash
# Open DevTools Network tab
# Filter by: api.sanity.io
# Result should be: No requests
```

---

## Success Indicators

You know it's working when you see:

✅ `npm run cache:sanity` completes successfully
✅ Cache files exist in `public/sanity-cache/`
✅ `npm run build` succeeds
✅ `npm start` runs without errors
✅ Page loads in DevTools (<500ms)
✅ Network tab shows NO api.sanity.io requests
✅ Homepage displays all content correctly
✅ Products/courses/blog all load instantly
✅ Lighthouse score is 95+
✅ No errors in browser console

---

## Quick Reference

```bash
# One-liners for common tasks:

# Generate cache
npm run cache:sanity

# Build with cache
npm run build

# Build and test locally
npm run build && npm start

# Check cache size
du -sh public/sanity-cache/

# Clear cache and rebuild
rm -rf public/sanity-cache/* && npm run build

# Test in production mode
NODE_ENV=production npm start

# Check for API calls
curl -s http://localhost:3000 | grep -i api.sanity

# View cache files
ls -lh public/sanity-cache/

# Pretty print a cache file
cat public/sanity-cache/homepage.json | jq .

# Count cached items
cat public/sanity-cache/allProducts.json | jq '. | length'
```

---

## Final Checklist Before Deploying

- [ ] Ran `npm run cache:sanity` successfully
- [ ] Cache files exist in `public/sanity-cache/`
- [ ] `npm run build` completes without errors
- [ ] `npm start` runs successfully
- [ ] Visited http://localhost:3000
- [ ] Checked Network tab: No api.sanity.io requests
- [ ] Checked Console: No errors
- [ ] Homepage displays correctly
- [ ] Products page displays correctly
- [ ] All pages load instantly
- [ ] Ready to deploy! 🚀

---

## You're Ready! 🎉

Everything is set up and ready to go!

**Next**: Run `npm run build && npm start` to see your instant performance improvements!

For detailed information, see:
- `STATIC_CACHING_SUMMARY.md` - Overview
- `STATIC_CACHE_IMPLEMENTATION_GUIDE.md` - Usage guide
- `STATIC_CACHE_QUICK_START.md` - Testing guide

**Your website now has production-ready static caching!** ⚡
