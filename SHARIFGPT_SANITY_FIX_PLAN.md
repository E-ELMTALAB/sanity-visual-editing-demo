# SharifGPT Sanity Integration Fix Plan

## Problem
All pages (homepage, /products, /blog, /courses) are using hardcoded data instead of fetching from Sanity CMS.

## Root Causes
1. Pages are pure client components with `"use client"` at the top
2. No server-side data fetching happening
3. No overlay components for Visual Editing
4. Data is hardcoded in arrays instead of coming from Sanity

## Solution Architecture

### Current Structure (WRONG ❌)
```
app/page.tsx → "use client" → hardcoded data
app/products/page.tsx → "use client" → hardcoded data
app/blog/page.tsx → "use client" → hardcoded data
app/courses/page.tsx → "use client" → hardcoded data
```

### Target Structure (CORRECT ✅)
```
app/page.tsx (SERVER) → fetch from Sanity → pass to:
  ├─ HomeOverlay (SERVER) → Visual Editing markers
  └─ HomePageClient (CLIENT) → receives props → renders UI

app/products/page.tsx (SERVER) → fetch from Sanity → pass to:
  ├─ ProductsOverlay (SERVER) → Visual Editing markers
  └─ ProductsPageClient (CLIENT) → receives props → renders UI

app/blog/page.tsx (SERVER) → fetch from Sanity → pass to:
  ├─ BlogOverlay (SERVER) → Visual Editing markers
  └─ BlogPageClient (CLIENT) → receives props → renders UI

app/courses/page.tsx (SERVER) → fetch from Sanity → pass to:
  ├─ CoursesOverlay (SERVER) → Visual Editing markers
  └─ CoursesPageClient (CLIENT) → receives props → renders UI
```

## Implementation Steps

### 1. Homepage (/)
- ✅ Query exists: `sharifHeroQuery`
- ❌ Need to create: server page.tsx wrapper
- ❌ Need to create: HomeOverlay component
- ❌ Need to rename: existing page.tsx → page-client.tsx
- ❌ Need to update: client component to accept Sanity props

### 2. Products Page (/products)
- ✅ Query exists: `productsListQuery`
- ❌ Need to update: page.tsx to fetch from Sanity
- ❌ Need to create: ProductsOverlay component
- ✅ Already has: page-client.tsx separation
- ❌ Need to update: client component to accept Sanity props

### 3. Blog Page (/blog)
- ✅ Query exists: `blogListQuery`
- ❌ Need to create: server page.tsx wrapper
- ❌ Need to create: BlogOverlay component
- ❌ Need to rename: existing page.tsx → page-client.tsx
- ❌ Need to update: client component to accept Sanity props

### 4. Courses Page (/courses)
- ✅ Query exists: `allCoursesQuery`
- ❌ Need to create: server page.tsx wrapper
- ❌ Need to create: CoursesOverlay component
- ❌ Need to rename: existing page.tsx → page-client.tsx
- ❌ Need to update: client component to accept Sanity props

## Detailed Changes Per Page

### Homepage
```typescript
// app/page.tsx (NEW - Server Component)
import { draftMode } from 'next/headers'
import { getClient } from '@/lib/sanity.client'
import { readToken } from '@/lib/sanity.api'
import { sharifHeroQuery } from '@/lib/sanity.queries'
import HomePageClient from './page-client'
import HomeOverlay from '@/components/site/home/HomeOverlay'

export default async function RootPage() {
  const isDraft = draftMode().isEnabled
  const client = getClient(isDraft ? { token: readToken } : undefined)
  const homeData = await client.fetch(sharifHeroQuery)
  
  return (
    <>
      <HomeOverlay homeData={homeData} />
      <HomePageClient homeData={homeData} />
    </>
  )
}
```

```typescript
// app/page-client.tsx (RENAMED from page.tsx)
"use client"
// ... existing component code but accept homeData as props
```

```typescript
// components/site/home/HomeOverlay.tsx (NEW)
export default function HomeOverlay({ homeData }: any) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0 }}>
      {homeData?.heroSlides?.map((slide: any, i: number) => (
        <div key={i} data-sanity-id={slide?._key} data-sanity-type="home.heroSlides">
          <span>{slide?.title}</span>
        </div>
      ))}
    </div>
  )
}
```

## Files to Create/Modify

### Create:
1. `components/site/home/HomeOverlay.tsx`
2. `components/site/product/ProductsOverlay.tsx`  
3. `components/site/blog/BlogOverlay.tsx`
4. `components/site/course/CoursesOverlay.tsx`

### Rename:
1. `app/page.tsx` → `app/page-client.tsx`
2. `app/blog/page.tsx` → `app/blog/page-client.tsx`
3. `app/courses/page.tsx` → `app/courses/page-client.tsx`

### Modify:
1. Create new `app/page.tsx` (server component)
2. Update `app/products/page.tsx` (add server fetching)
3. Create new `app/blog/page.tsx` (server component)
4. Create new `app/courses/page.tsx` (server component)
5. Update all client components to accept props

## Testing Checklist

After implementation:
- [ ] Homepage renders Sanity data
- [ ] Products page renders Sanity data
- [ ] Blog page renders Sanity data
- [ ] Courses page renders Sanity data
- [ ] Visual Editing overlays appear in Sanity Studio
- [ ] Clicking overlays opens correct fields
- [ ] No build errors
- [ ] No console errors

