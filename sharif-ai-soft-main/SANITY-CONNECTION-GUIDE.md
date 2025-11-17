# 🔌 Sanity CMS Connection Guide - Production Ready

**How to connect a new UI to Sanity CMS based on working `sharif-ai-soft-main` integration**

---

## ✅ What We Did to Make It Work

### The Problem
- New UI had hardcoded course data
- Needed to fetch courses dynamically from Sanity
- Courses existed in Sanity but weren't displaying

### The Solution
- Installed Sanity client packages
- Created Sanity configuration files
- Updated Home component to fetch from Sanity
- **Critical Fix:** Implemented dual-query approach (Home singleton OR Course documents)
- Fixed component props issue (state must be passed as props)
- Configured build for Vercel deployment

### Result
✅ **Working connection fetching 3 courses from Sanity Course documents**

---

## 📋 Step-by-Step Connection Guide

### Step 1: Install Sanity Packages (2 min)

```bash
cd your-new-ui-folder
npm install @sanity/client @sanity/image-url
```

**What this does:** Adds Sanity client library and image optimization utilities

---

### Step 2: Create Sanity Configuration Files (10 min)

#### Create `src/lib/` folder structure:

**File: `src/lib/sanity.config.ts`**
```typescript
export const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || 'placeholder'
export const dataset = import.meta.env.VITE_SANITY_DATASET || 'production'
export const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2023-06-21'

export function validateSanityConfig() {
  const missingVars = []
  
  if (!import.meta.env.VITE_SANITY_PROJECT_ID || import.meta.env.VITE_SANITY_PROJECT_ID === 'placeholder') {
    missingVars.push('VITE_SANITY_PROJECT_ID')
  }
  
  if (missingVars.length > 0) {
    console.warn(
      `⚠️ Missing Sanity configuration: ${missingVars.join(', ')}\n` +
      'Please add these to your .env file.'
    )
    return false
  }
  
  return true
}
```

**File: `src/lib/sanity.client.ts`**
```typescript
import { createClient } from '@sanity/client'
import { projectId, dataset, apiVersion } from './sanity.config'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
  stega: {
    enabled: false,
  },
})

export async function fetchFromSanity<T>(query: string, params?: Record<string, any>): Promise<T | null> {
  try {
    const result = await client.fetch<T>(query, params)
    return result
  } catch (error) {
    console.error('[SANITY] Failed to fetch data:', error)
    return null
  }
}
```

**File: `src/lib/sanity.queries.ts`**
```typescript
// Query for Home singleton courses
export const homeCoursesQuery = `
  *[_type == "home"][0]{
    bestsellingCourses[]{
      _key,
      title,
      description,
      price,
      originalPrice,
      instructor,
      duration,
      students,
      rating,
      reviewCount,
      category,
      level,
      image,
      "slug": slug.current
    }
  }
`

// Query for Course documents (CRITICAL FALLBACK)
export const allCoursesQuery = `
  *[_type == "course" && isPublished == true] | order(_createdAt desc) {
    _id,
    title,
    shortDescription,
    price,
    originalPrice,
    discountPercentage,
    rating,
    reviewCount,
    totalStudents,
    featuredImage,
    category,
    level,
    duration,
    totalSessions,
    badge,
    instructor->{
      name
    },
    "slug": slug.current
  }
`
```

**File: `src/lib/sanity.image.ts`**
```typescript
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { client } from './sanity.client'

const builder = imageUrlBuilder(client)

export function urlForImage(source: SanityImageSource) {
  if (!source) {
    console.warn('[SANITY-IMAGE] No image source provided')
    return builder.image({} as SanityImageSource)
  }
  return builder.image(source).auto('format').fit('max')
}

export function getImageUrl(
  source: SanityImageSource,
  width: number = 800,
  height?: number
): string {
  const urlBuilder = urlForImage(source).width(width)
  
  if (height) {
    urlBuilder.height(height)
  }
  
  return urlBuilder.url() || ''
}
```

---

### Step 3: Environment Setup (3 min)

**Create `.env.example`:**
```env
# Sanity CMS Configuration
VITE_SANITY_PROJECT_ID=your-project-id-here
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2023-06-21
```

**Create `.env`:**
```env
VITE_SANITY_PROJECT_ID=actual-project-id
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2023-06-21
```

**Update `.gitignore`:**
```
.env
.env.local
.env.*.local
```

**⚠️ Important:** Replace `actual-project-id` with your real Sanity Project ID

---

### Step 4: Update Component with Dual-Query Approach (20 min)

**This is the CRITICAL part that made it work!**

```typescript
import { fetchFromSanity } from "@/lib/sanity.client"
import { homeCoursesQuery, allCoursesQuery } from "@/lib/sanity.queries"
import { getImageUrl } from "@/lib/sanity.image"
import { validateSanityConfig } from "@/lib/sanity.config"

// Rename hardcoded data to fallback
const fallbackCourses = [ /* your existing courses */ ]

// Transform function for Home singleton courses
function transformSanityCourse(sanityCourse: any) {
  const levelMap: Record<string, "مبتدی" | "متوسط" | "پیشرفته"> = {
    'beginner': 'مبتدی',
    'intermediate': 'متوسط',
    'advanced': 'پیشرفته',
    'beginner-intermediate': 'متوسط',
    'beginner-advanced': 'پیشرفته',
  }

  const durationMatch = sanityCourse.duration?.match(/\d+/)
  const durationHours = durationMatch ? parseInt(durationMatch[0]) : 8

  return {
    slug: sanityCourse.slug || `course-${sanityCourse._key}`,
    title: sanityCourse.title || 'دوره آموزشی',
    tags: sanityCourse.category ? [sanityCourse.category] : [],
    image: sanityCourse.image ? getImageUrl(sanityCourse.image, 400) : undefined,
    durationHours,
    level: levelMap[sanityCourse.level] || 'مبتدی',
    price: sanityCourse.price || 0,
    installments: sanityCourse.originalPrice ? true : false,
  }
}

// Transform function for Course documents
function transformCourseDocument(course: any) {
  const levelMap: Record<string, "مبتدی" | "متوسط" | "پیشرفته"> = {
    'beginner': 'مبتدی',
    'intermediate': 'متوسط',
    'advanced': 'پیشرفته',
    'beginner-intermediate': 'متوسط',
    'beginner-advanced': 'پیشرفته',
  }

  const durationMatch = course.duration?.match(/\d+/)
  const durationHours = durationMatch ? parseInt(durationMatch[0]) : 8

  return {
    slug: course.slug || `course-${course._id}`,
    title: course.title || 'دوره آموزشی',
    tags: course.category ? [course.category] : [],
    image: course.featuredImage ? getImageUrl(course.featuredImage, 400) : undefined,
    durationHours,
    level: levelMap[course.level] || 'مبتدی',
    price: course.price || 0,
    installments: course.originalPrice ? true : false,
  }
}

export default function YourPage() {
  const [courses, setCourses] = useState(fallbackCourses)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const isConfigValid = validateSanityConfig()
    
    if (!isConfigValid) {
      console.warn('[PAGE] Sanity not configured, using fallback')
      setIsLoading(false)
      return
    }

    async function loadCourses() {
      try {
        console.log('[PAGE] Fetching courses from Sanity...')
        setIsLoading(true)
        
        // Try home singleton first
        console.log('[PAGE] Trying home singleton query...')
        const homeData = await fetchFromSanity<{ bestsellingCourses?: any[] }>(homeCoursesQuery)
        
        if (homeData?.bestsellingCourses && homeData.bestsellingCourses.length > 0) {
          console.log(`[PAGE] ✅ Found ${homeData.bestsellingCourses.length} courses in home singleton`)
          const transformed = homeData.bestsellingCourses.map(transformSanityCourse)
          setCourses(transformed)
          console.log(`[PAGE] ✅ Loaded courses from home singleton`)
          return
        }
        
        // If home singleton is empty, try course documents
        console.log('[PAGE] Home singleton empty, trying course documents query...')
        const coursesData = await fetchFromSanity<any[]>(allCoursesQuery)
        
        if (coursesData && coursesData.length > 0) {
          console.log(`[PAGE] ✅ Found ${coursesData.length} course documents`)
          const transformed = coursesData.slice(0, 6).map(transformCourseDocument)
          setCourses(transformed)
          console.log(`[PAGE] ✅ Loaded courses from course documents`)
        } else {
          console.warn('[PAGE] ⚠️ No courses found, using fallback')
        }
      } catch (error) {
        console.error('[PAGE] ❌ Failed to fetch:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCourses()
  }, [])

  return (
    <div>
      {courses.map((course) => (
        <CourseCard {...course} key={course.slug} />
      ))}
    </div>
  )
}
```

**⚠️ CRITICAL:** Pass state as props to external components:
```typescript
// ❌ WRONG
function SubComponent() {
  return <div>{courses}</div>  // Can't access state!
}

// ✅ CORRECT
function SubComponent({ items }) {
  return <div>{items}</div>
}

<SubComponent items={courses} />
```

---

### Step 5: Build Configuration (5 min)

**Update `vite.config.ts`:**
```typescript
export default defineConfig({
  base: "/",  // ← REQUIRED for Vercel
  // ... rest of config
})
```

**Create `vercel.json`:**
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

---

### Step 6: Deploy to Vercel (10 min)

1. **Push to GitHub:**
```bash
git add .
git commit -m "Add Sanity integration"
git push origin your-branch
```

2. **Vercel Dashboard:**
   - New Project → Import repository
   - **Root Directory:** `your-ui-folder-name` ← CRITICAL!
   - Framework: Vite (auto-detect)

3. **Environment Variables:**
Add these in Vercel → Settings → Environment Variables:
```
VITE_SANITY_PROJECT_ID = your-actual-project-id
VITE_SANITY_DATASET = production
VITE_SANITY_API_VERSION = 2023-06-21
```

4. **Deploy**

5. **Configure CORS:**
   - Go to sanity.io/manage
   - Your Project → API → CORS Origins
   - Add: `https://your-app.vercel.app`
   - Save

---

## 🎯 Critical Lessons Learned

### 1. Dual-Query Approach is Essential

**Why it matters:**
- Courses can be in Home singleton OR Course documents
- Don't assume one location
- Always implement fallback query

**The Pattern:**
```typescript
// Try home singleton first
const homeData = await fetch(homeCoursesQuery)
if (homeData?.bestsellingCourses?.length > 0) {
  return homeData.bestsellingCourses
}

// Fallback to course documents
const coursesData = await fetch(allCoursesQuery)
return coursesData
```

---

### 2. Different Data Structures Need Different Transformers

**Home Singleton Course:**
```typescript
{
  title: "Course Title",
  image: { _type: "image", asset: {...} },  // Direct image
  slug: { current: "course-slug" }
}
```

**Course Document:**
```typescript
{
  title: "Course Title",
  featuredImage: { _type: "image", asset: {...} },  // Different field name!
  slug: { current: "course-slug" }
}
```

**Solution:** Two transformer functions

---

### 3. State Must Be Passed as Props

**The Bug:**
```typescript
// Component defined OUTSIDE main component
function SubComponent() {
  return <div>{stateVariable}</div>  // ReferenceError!
}
```

**The Fix:**
```typescript
function SubComponent({ data }) {
  return <div>{data}</div>
}

<SubComponent data={stateVariable} />
```

---

### 4. Environment Variable Naming

**Framework-specific prefixes:**
- **Vite:** `VITE_*`
- **Next.js:** `NEXT_PUBLIC_*`
- **CRA:** `REACT_APP_*`

**⚠️ Wrong prefix = Variables won't work!**

---

## 🔍 Debugging Checklist

### If courses don't load:

**1. Check Console Logs:**
```javascript
// Should see:
[PAGE] Fetching courses from Sanity...
[PAGE] Trying home singleton query...
[PAGE] ✅ Found X course documents
[PAGE] ✅ Loaded courses from course documents
```

**2. If "Sanity not configured":**
- Check `.env` file exists
- Verify `VITE_SANITY_PROJECT_ID` is correct
- Restart dev server after changing `.env`

**3. If "No courses found":**
- Open Sanity Studio
- Check if courses exist in:
  - Home singleton → bestsellingCourses
  - OR Course documents with `isPublished: true`

**4. If "bestsellingCourses is null":**
- Courses are in Course documents, not Home singleton
- Dual-query approach will handle this automatically

---

## ✅ Success Criteria

Your Sanity connection is working when:

- ✅ `npm run dev` works locally
- ✅ Console shows: `✅ Loaded X courses from Sanity`
- ✅ Courses display on page
- ✅ `npm run build` succeeds
- ✅ Vercel deployment successful
- ✅ Production site loads courses
- ✅ No errors in browser console
- ✅ Fallback courses work if Sanity fails

---

## 📊 Data Flow Diagram

```
1. Page Component Mounts
   ↓
2. validateSanityConfig()
   ↓ (if valid)
3. Try homeCoursesQuery
   ↓
4a. If courses found → Transform & Display
   OR
4b. If empty → Try allCoursesQuery
   ↓
5. If courses found → Transform & Display
   OR
   If still empty → Use fallback courses
```

---

## 🎓 Key Takeaways

### What Made It Work:
1. ✅ Dual-query approach (Home singleton + Course documents)
2. ✅ Two transformer functions for different data structures
3. ✅ Proper state-to-props passing
4. ✅ Correct environment variable prefix (`VITE_`)
5. ✅ `base: "/"` in vite.config
6. ✅ Simple vercel.json (just rewrites)
7. ✅ Comprehensive error logging

### Common Mistakes to Avoid:
1. ❌ Assuming courses are always in one location
2. ❌ Using wrong env var prefix
3. ❌ Not passing state as props to external components
4. ❌ Forgetting `base: "/"` in vite.config
5. ❌ Not setting Root Directory in Vercel
6. ❌ Not configuring CORS in Sanity

---

## 🚀 Quick Reference

### Find Sanity Project ID:
```bash
# Option 1: From sharifgpt-website
cat ../sharifgpt-website/lib/sanity.api.ts | grep projectId

# Option 2: Sanity Dashboard
https://sanity.io/manage → Select Project
```

### Test Locally:
```bash
npm install
cp .env.example .env
# Edit .env with real Project ID
npm run dev
```

### Deploy:
```bash
git add .
git commit -m "Add Sanity integration"
git push origin branch-name
# Then configure in Vercel Dashboard
```

---

## 📞 Troubleshooting

| Problem | Solution |
|---------|----------|
| Blank page | Check `base: "/"` + Root Directory in Vercel |
| ReferenceError | Pass state as props to components |
| "Sanity not configured" | Check env vars have `VITE_` prefix |
| "No courses found" | Check both Home singleton AND Course documents |
| Images not loading | Use `getImageUrl()` function |
| CORS error | Add Vercel URL to Sanity CORS settings |

---

## 🎉 Result

With this setup, you have:
- ✅ Automatic course fetching from Sanity
- ✅ Dual-source support (Home singleton OR Course documents)
- ✅ Graceful fallback to hardcoded courses
- ✅ Production-ready deployment
- ✅ Comprehensive error handling
- ✅ Detailed debugging logs

**Tested and working on `sharif-ai-soft-main`!**

---

**Based on:** Successful production integration of `sharif-ai-soft-main`  
**Status:** ✅ Production Ready  
**Last Updated:** After successful Sanity connection

---

## 📚 Related Documentation

- `NEW-UI-INTEGRATION-GUIDE.md` - Complete integration workflow
- `QUICK-INTEGRATION-CHECKLIST.md` - Fast reference checklist
- `SETUP.md` - Initial setup instructions
- `DEPLOYMENT.md` - Vercel deployment details



