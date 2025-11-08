# 🎯 New UI Integration Guide - Complete Workflow

**Based on successful integration of `sharif-ai-soft-main`**

This document explains everything we did to integrate a new UI folder and make it work with Sanity CMS on Vercel. Use this as a blueprint for future UI integrations.

---

## 📋 Overview: What We Did

Starting point: A new UI folder (`sharif-ai-soft-main`) with React + Vite + Shadcn UI  
Goal: Connect it to Sanity CMS and deploy to Vercel  
Result: ✅ Fully functional website with dynamic course content from Sanity

---

## 🔄 Complete Integration Process

### Phase 1: Initial Assessment (5 minutes)

**What we checked:**
1. ✅ Project structure (Vite + React)
2. ✅ Existing `package.json` dependencies
3. ✅ Build configuration (`vite.config.ts`)
4. ✅ Entry points (`index.html`, `main.tsx`)
5. ✅ Component structure (pages, components)

**Key findings:**
- Uses Vite as build tool
- React Router for navigation
- Shadcn UI components
- TypeScript
- Homepage has hardcoded course data

---

### Phase 2: Sanity Integration (30 minutes)

#### Step 1: Install Dependencies

**Added to `package.json`:**
```json
{
  "dependencies": {
    "@sanity/client": "^6.22.2",
    "@sanity/image-url": "^1.0.2"
  }
}
```

**Command:**
```bash
npm install
```

---

#### Step 2: Create Sanity Configuration Files

**Created in `src/lib/`:**

**`sanity.config.ts`** - Project configuration
```typescript
export const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || 'placeholder'
export const dataset = import.meta.env.VITE_SANITY_DATASET || 'production'
export const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2023-06-21'

export function validateSanityConfig() {
  // Validation logic
}
```

**`sanity.client.ts`** - Client setup
```typescript
import { createClient } from '@sanity/client'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
})

export async function fetchFromSanity<T>(query: string, params?: Record<string, any>): Promise<T | null> {
  // Fetch with error handling
}
```

**`sanity.queries.ts`** - GROQ queries
```typescript
export const homeCoursesQuery = `
  *[_type == "home"][0]{
    bestsellingCourses[]{
      _key,
      title,
      description,
      price,
      // ... all fields
    }
  }
`
```

**`sanity.image.ts`** - Image URL builder
```typescript
import imageUrlBuilder from '@sanity/image-url'

export function urlForImage(source: SanityImageSource) {
  return builder.image(source).auto('format').fit('max')
}
```

---

#### Step 3: Environment Configuration

**Created `.env.example`:**
```env
VITE_SANITY_PROJECT_ID=your-project-id-here
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2023-06-21
```

**Updated `.gitignore`:**
```
.env
.env.local
.env.*.local
```

**⚠️ Important:** 
- All environment variables for Vite MUST start with `VITE_`
- They are exposed to the browser (public)
- Only use for read-only Sanity access

---

#### Step 4: Update Homepage Component

**Modified `src/pages/Home.tsx`:**

1. **Added imports:**
```typescript
import { fetchFromSanity } from "@/lib/sanity.client"
import { homeCoursesQuery } from "@/lib/sanity.queries"
import { getImageUrl } from "@/lib/sanity.image"
import { validateSanityConfig } from "@/lib/sanity.config"
```

2. **Renamed hardcoded courses:**
```typescript
const fallbackCourses = [ /* existing courses */ ]
```

3. **Created transformer function:**
```typescript
function transformSanityCourse(sanityCourse: any) {
  // Map Sanity data structure to component format
  return {
    slug: sanityCourse.slug,
    title: sanityCourse.title,
    image: sanityCourse.image ? getImageUrl(sanityCourse.image, 400) : undefined,
    // ... more fields
  }
}
```

4. **Added state management:**
```typescript
const [featuredCourses, setFeaturedCourses] = useState(fallbackCourses)
const [isLoadingCourses, setIsLoadingCourses] = useState(true)
const [sanityError, setSanityError] = useState<string | null>(null)
```

5. **Fetch on mount:**
```typescript
useEffect(() => {
  const isConfigValid = validateSanityConfig()
  
  if (!isConfigValid) {
    console.warn('[HOME] Sanity not configured, using fallback')
    setIsLoadingCourses(false)
    return
  }

  async function loadCourses() {
    try {
      const data = await fetchFromSanity<{ bestsellingCourses?: any[] }>(homeCoursesQuery)
      
      if (data?.bestsellingCourses && data.bestsellingCourses.length > 0) {
        const transformed = data.bestsellingCourses.map(transformSanityCourse)
        setFeaturedCourses(transformed)
        console.log(`[HOME] ✅ Loaded ${transformed.length} courses from Sanity`)
      }
    } catch (error) {
      console.error('[HOME] ❌ Failed to fetch courses:', error)
    } finally {
      setIsLoadingCourses(false)
    }
  }

  loadCourses()
}, [])
```

6. **CRITICAL FIX - Component Props:**
```typescript
// Sub-components MUST receive data as props if defined outside main component
function MobileFeaturedCoursesCarousel({ courses }: { courses: any[] }) {
  // Use 'courses' prop instead of 'featuredCourses' state
  return (
    <div>
      {courses.map((course) => (
        <CourseCard {...course} />
      ))}
    </div>
  )
}

// Then pass state as prop:
<MobileFeaturedCoursesCarousel courses={featuredCourses} />
```

**⚠️ Critical Lesson Learned:**
> Components defined OUTSIDE the main component cannot access state directly. Always pass state as props!

---

### Phase 3: Build Configuration (15 minutes)

#### Step 1: Optimize `vite.config.ts`

**Added/Updated:**
```typescript
export default defineConfig(({ mode }) => ({
  base: "/",  // ← CRITICAL for Vercel
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: mode === "production" ? false : true,
    minify: mode === "production" ? "esbuild" : false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          ui: ["@radix-ui/react-accordion", "@radix-ui/react-dialog"],
          sanity: ["@sanity/client", "@sanity/image-url"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "@sanity/client"],
  },
}))
```

---

#### Step 2: Create `vercel.json`

**Final working configuration:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**⚠️ Lessons Learned:**
- ❌ Don't use `routes` with `rewrites` (causes conflict)
- ❌ Don't reference secrets with `@secret-name` syntax (use Vercel UI instead)
- ❌ Don't overcomplicate with unnecessary headers (keep it simple)
- ✅ Keep it minimal - just rewrites for SPA routing

---

#### Step 3: Update `package.json` Scripts

**Added useful commands:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:prod": "vite build --mode production",
    "preview": "vite preview",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf dist"
  }
}
```

---

### Phase 4: Local Testing (10 minutes)

**Commands run:**
```bash
# Install all dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with actual Sanity Project ID

# Test development build
npm run dev
# Visit http://localhost:8080
# Check browser console for Sanity logs

# Test production build
npm run build
npm run preview
# Visit http://localhost:4173
```

**What we verified:**
- ✅ Build completes without errors
- ✅ No TypeScript errors
- ✅ Assets properly bundled
- ✅ Code splitting working
- ✅ Console shows Sanity fetch logs
- ✅ Fallback courses work without Sanity

---

### Phase 5: Git Preparation (5 minutes)

**Commands:**
```bash
# Stage all changes
git add .

# Commit with descriptive message
git commit -m "Add Sanity integration with homepage courses - Production ready"

# Push to branch
git push origin new-ui
```

**Files committed:**
```
✅ src/lib/sanity.*.ts (4 files)
✅ src/pages/Home.tsx (updated)
✅ package.json (updated)
✅ vite.config.ts (updated)
✅ vercel.json (created)
✅ .gitignore (updated)
✅ Documentation files
```

---

### Phase 6: Vercel Deployment (20 minutes)

#### Step 1: Initial Deployment Attempt

**Process:**
1. Go to https://vercel.com/new
2. Import GitHub repository
3. Select branch: `new-ui`
4. **CRITICAL:** Set Root Directory: `sharif-ai-soft-main`
5. Framework preset: Vite (auto-detected)

#### Step 2: Environment Variables

**Added in Vercel Dashboard → Settings → Environment Variables:**
```
VITE_SANITY_PROJECT_ID = actual-project-id-from-sanity
VITE_SANITY_DATASET = production
VITE_SANITY_API_VERSION = 2023-06-21
```

#### Step 3: Issues Encountered & Solutions

**Issue 1: "Secret references not found"**
- ❌ Problem: `vercel.json` had `"@sanity-project-id"` references
- ✅ Solution: Removed `env` section from `vercel.json`, added vars in UI instead

**Issue 2: Blank page after deploy**
- ❌ Problem: Assets returning 404
- ✅ Solution: Added `base: "/"` to `vite.config.ts`

**Issue 3: Still blank page**
- ❌ Problem: `routes` conflicting with `rewrites` in `vercel.json`
- ✅ Solution: Removed `routes`, kept only `rewrites`

**Issue 4: `ReferenceError: featuredCourses is not defined`**
- ❌ Problem: `MobileFeaturedCoursesCarousel` trying to access state from outside scope
- ✅ Solution: Pass `featuredCourses` as prop to the component

---

#### Step 4: Post-Deployment

**Configure Sanity CORS:**
1. Go to https://sanity.io/manage
2. Select project
3. API → CORS Origins
4. Add: `https://your-app.vercel.app`
5. Enable "Allow credentials"
6. Save

**Verify deployment:**
- ✅ Site loads
- ✅ Homepage displays
- ✅ Courses render
- ✅ Images load
- ✅ Console shows: `[HOME] ✅ Loaded X courses from Sanity`
- ✅ No errors in browser console

---

## 🎯 Step-by-Step Guide for Next UI

### Pre-Integration Checklist

- [ ] New UI folder added to repository
- [ ] UI uses React (or similar framework)
- [ ] Has `package.json` with dependencies
- [ ] Has build configuration
- [ ] Know which page needs Sanity data

---

### Integration Steps

#### 1️⃣ Analyze the UI (10 min)

```bash
# Check structure
cd new-ui-folder
ls -la

# Check build tool
cat package.json | grep -E "vite|webpack|next"

# Check entry point
cat package.json | grep "scripts"

# Identify data display pages
# Look for hardcoded data arrays
grep -r "const.*data.*=" src/
```

**Document:**
- Build tool: _________
- Entry point: _________
- Pages needing Sanity: _________
- Data structures: _________

---

#### 2️⃣ Install Sanity (5 min)

```bash
# Install dependencies
npm install @sanity/client @sanity/image-url

# Verify installation
npm list @sanity/client
```

---

#### 3️⃣ Create Sanity Config Files (15 min)

**Copy from `sharif-ai-soft-main/src/lib/`:**
- `sanity.config.ts` → Update env var names if needed
- `sanity.client.ts` → Copy as-is
- `sanity.queries.ts` → Update queries for your data
- `sanity.image.ts` → Copy as-is

**⚠️ Adjust for framework:**
- **Vite/React:** Use `import.meta.env.VITE_*`
- **Next.js:** Use `process.env.NEXT_PUBLIC_*`
- **CRA:** Use `process.env.REACT_APP_*`

---

#### 4️⃣ Environment Setup (5 min)

```bash
# Create .env.example
cat > .env.example << 'EOF'
VITE_SANITY_PROJECT_ID=your-project-id
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2023-06-21
EOF

# Update .gitignore
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
```

---

#### 5️⃣ Update Target Page Component (30 min)

**Follow this pattern:**

```typescript
// 1. Add imports
import { fetchFromSanity } from "@/lib/sanity.client"
import { yourDataQuery } from "@/lib/sanity.queries"
import { getImageUrl } from "@/lib/sanity.image"

// 2. Rename hardcoded data
const fallbackData = [ /* existing data */ ]

// 3. Create transformer
function transformSanityData(sanityItem: any) {
  return {
    // Map Sanity fields to component format
  }
}

// 4. Add state
const [data, setData] = useState(fallbackData)
const [isLoading, setIsLoading] = useState(true)

// 5. Fetch on mount
useEffect(() => {
  async function loadData() {
    try {
      const result = await fetchFromSanity(yourDataQuery)
      if (result) {
        const transformed = result.map(transformSanityData)
        setData(transformed)
      }
    } catch (error) {
      console.error('Failed to fetch:', error)
    } finally {
      setIsLoading(false)
    }
  }
  loadData()
}, [])

// 6. CRITICAL: Pass state as props to sub-components
function SubComponent({ items }: { items: any[] }) {
  return <div>{items.map(...)}</div>
}

// Usage:
<SubComponent items={data} />
```

**✅ Double-check:**
- All sub-components receive data as props
- No direct state access in external functions
- Fallback data works without Sanity
- Console logs for debugging

---

#### 6️⃣ Build Configuration (10 min)

**For Vite projects:**

Update `vite.config.ts`:
```typescript
export default defineConfig({
  base: "/",  // ← REQUIRED for Vercel
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          sanity: ["@sanity/client", "@sanity/image-url"],
        },
      },
    },
  },
})
```

Create `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**For Next.js projects:**

Update `next.config.js`:
```javascript
module.exports = {
  // Next.js handles SPA routing automatically
  // No vercel.json needed
}
```

---

#### 7️⃣ Test Locally (10 min)

```bash
# Install
npm install

# Create .env
cp .env.example .env
# Add real Sanity Project ID

# Test dev
npm run dev
# Check console for logs

# Test build
npm run build
npm run preview
```

**Verification checklist:**
- [ ] Build succeeds
- [ ] No TypeScript errors
- [ ] Console shows Sanity fetch
- [ ] Data displays correctly
- [ ] Images load
- [ ] Fallback works (wrong Project ID)

---

#### 8️⃣ Git Commit (5 min)

```bash
git add .
git commit -m "Add Sanity integration for [page-name]"
git push origin your-branch
```

---

#### 9️⃣ Deploy to Vercel (15 min)

**Deployment:**
1. Vercel Dashboard → New Project
2. Import repository
3. Select branch
4. **Root Directory:** `your-ui-folder-name`
5. Framework: Auto-detect
6. Environment Variables:
   - `VITE_SANITY_PROJECT_ID` = your-id
   - `VITE_SANITY_DATASET` = production
   - `VITE_SANITY_API_VERSION` = 2023-06-21
7. Deploy

**After deploy:**
1. Add Vercel URL to Sanity CORS
2. Test site
3. Check browser console
4. Verify data loads

---

## 🚨 Common Issues & Solutions

### Issue: Blank page on Vercel

**Checklist:**
1. ✅ Root Directory set correctly?
2. ✅ `base: "/"` in vite.config?
3. ✅ `vercel.json` has correct output directory?
4. ✅ Build logs show success?
5. ✅ Check browser Network tab for 404s

**Solution:**
- Check deployment logs
- Verify `dist` folder structure
- Test `npm run build` locally

---

### Issue: `ReferenceError: X is not defined`

**Cause:** Component trying to access state from outside scope

**Solution:**
```typescript
// ❌ Wrong
function SubComponent() {
  return <div>{stateVariable}</div>  // Can't access!
}

// ✅ Correct
function SubComponent({ data }) {
  return <div>{data}</div>
}

<SubComponent data={stateVariable} />
```

---

### Issue: Environment variables not working

**Checklist:**
1. ✅ Variables start with correct prefix?
   - Vite: `VITE_`
   - Next.js: `NEXT_PUBLIC_`
   - CRA: `REACT_APP_`
2. ✅ Variables added in Vercel Dashboard?
3. ✅ Redeployed after adding vars?

**Solution:** Add vars in Vercel, then redeploy

---

### Issue: Sanity CORS errors

**Solution:**
1. Go to Sanity Dashboard
2. API → CORS Origins
3. Add your Vercel URL
4. Enable credentials
5. Save

---

### Issue: Images not loading

**Checklist:**
1. ✅ Using `urlForImage()` or `getImageUrl()`?
2. ✅ Image exists in Sanity?
3. ✅ Image is published?

**Solution:**
```typescript
// ✅ Correct
const imageUrl = getImageUrl(sanityImage, 400)

// ❌ Wrong
const imageUrl = sanityImage.url  // Won't work!
```

---

## 📚 Key Takeaways

### ✅ Must-Do's

1. **Always pass state as props** to external components
2. **Use correct env var prefix** for your framework
3. **Add `base: "/"`** in vite.config for Vercel
4. **Keep vercel.json simple** - just rewrites
5. **Test build locally** before deploying
6. **Configure CORS** in Sanity after deploy
7. **Use fallback data** for graceful degradation

### ❌ Don't Do's

1. Don't access state from external function scopes
2. Don't use `routes` with `rewrites` in vercel.json
3. Don't reference secrets in vercel.json (use UI)
4. Don't commit `.env` files
5. Don't forget to set Root Directory in Vercel
6. Don't expose write tokens in frontend

### 🎯 Best Practices

1. **Logging:** Add console logs for debugging
2. **Error handling:** Use try-catch with fallbacks
3. **Type safety:** Use TypeScript interfaces
4. **Code splitting:** Separate Sanity into own chunk
5. **Documentation:** Update README with setup steps
6. **Testing:** Test both with and without Sanity

---

## 📋 Quick Reference

### File Structure Template
```
new-ui-folder/
├── src/
│   ├── lib/
│   │   ├── sanity.config.ts    ← Copy from sharif-ai-soft-main
│   │   ├── sanity.client.ts    ← Copy from sharif-ai-soft-main
│   │   ├── sanity.queries.ts   ← Update for your data
│   │   └── sanity.image.ts     ← Copy from sharif-ai-soft-main
│   └── pages/
│       └── YourPage.tsx        ← Update with Sanity fetch
├── .env.example                ← Create this
├── .gitignore                  ← Update this
├── vercel.json                 ← Create this
├── vite.config.ts              ← Update base: "/"
└── package.json                ← Add Sanity deps
```

### Essential Commands
```bash
# Setup
npm install @sanity/client @sanity/image-url
cp .env.example .env

# Test
npm run dev
npm run build
npm run preview

# Deploy
git add .
git commit -m "Add Sanity integration"
git push origin branch-name
```

### Sanity Project ID
```bash
# Find in sharifgpt-website
cat ../sharifgpt-website/lib/sanity.api.ts | grep projectId

# Or from Sanity Dashboard
https://sanity.io/manage → Select Project → Copy ID
```

---

## 🎉 Success Criteria

Your integration is complete when:

- ✅ Local development works (`npm run dev`)
- ✅ Production build succeeds (`npm run build`)
- ✅ Vercel deployment successful
- ✅ Homepage loads without errors
- ✅ Data fetches from Sanity
- ✅ Images display correctly
- ✅ Console shows success logs
- ✅ Fallback works without Sanity
- ✅ No errors in browser console
- ✅ Mobile responsive

---

## 📞 Troubleshooting Workflow

1. **Check browser console** (F12) first
2. **Check Vercel deployment logs** second
3. **Test build locally** (`npm run build`)
4. **Verify environment variables** in Vercel
5. **Check Sanity CORS** settings
6. **Compare with `sharif-ai-soft-main`** working example

---

**Last Updated:** Based on successful integration of `sharif-ai-soft-main`  
**Time to Complete:** ~2 hours for first integration, ~30 minutes after practice  
**Difficulty:** Medium (with this guide)

---

## 🚀 Next Steps

After reading this guide:

1. Identify next UI folder to integrate
2. Follow checklist step-by-step
3. Test thoroughly locally
4. Deploy to Vercel
5. Update this guide with any new learnings

**Good luck!** 🎯

