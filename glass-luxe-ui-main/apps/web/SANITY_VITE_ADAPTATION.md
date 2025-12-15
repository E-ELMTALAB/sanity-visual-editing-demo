# Sanity Integration for Vite/React - Adaptation from Next.js Guide

## Overview

This document explains how we've adapted the `SANITY_INTEGRATION_GUIDE.md` (written for Next.js) to work with our **Vite/React SPA**. The core principles remain the same, but the implementation differs due to architectural differences.

---

## Core Principles Comparison

### ✅ Principles We Follow

| Principle | Next.js (Guide) | Our Vite/React Implementation | Status |
|-----------|----------------|-------------------------------|--------|
| **No Inline Defaults** | Client components render only when Sanity data exists | ✅ Same - Using conditional rendering `{data.length > 0 && <Component />}` | ✅ **Compliant** |
| **Draft-Aware Fetching** | Use `draftMode().isEnabled` and preview tokens | ✅ Adapted - Using `isVisualEditing()` to detect iframe + preview tokens from URL | ✅ **Adapted** |
| **Proper GROQ Queries** | Include `_key`, `_id`, `_type` for Visual Editing | ✅ Same - All queries include these fields | ✅ **Compliant** |
| **Data Transformation** | Transform Sanity data before rendering | ✅ Same - Using transformer functions | ✅ **Compliant** |

### ⚠️ Principles That Differ

| Principle | Next.js (Guide) | Our Vite/React Implementation | Why Different |
|-----------|----------------|-------------------------------|---------------|
| **Server-First Rendering** | Fetch data server-side in App Router pages | ❌ **Client-Side Fetching** - Using `useEffect` in client components | Vite/React is a SPA with no SSR by default |
| **Client-Only UI** | Separate server components from client components | ❌ **All Client Components** - No RSC in Vite | Vite doesn't support React Server Components |
| **Overlay Markers** | Hidden server-rendered anchors with `data-sanity-*` | ⚠️ **Not Implemented** - Relying on stega metadata in content | No server rendering layer to attach markers |

---

## Implementation Differences

### 1. Data Fetching

**Next.js Approach (from guide):**
```typescript
// app/page.tsx (Server Component)
export default async function RootPage() {
  const isDraft = draftMode().isEnabled
  const client = getClient(isDraft ? { token: readToken } : undefined)
  const data = await client.fetch(homeQuery)
  
  return (
    <>
      <HomeOverlay discountedProducts={data.discountedProducts} />
      <HomePageClient homeData={data} />
    </>
  )
}
```

**Our Vite/React Approach:**
```typescript
// src/pages/Index.tsx (Client Component)
export default function Index() {
  const [data, setData] = useState([])
  
  useEffect(() => {
    async function loadData() {
      const homeData = await fetchFromSanity(homePageQuery)
      setCategories(homeData.categories || [])
      // ... more state updates
    }
    loadData()
  }, [])
  
  return (
    <>
      {categories.length > 0 && <CategoryRail categories={categories} />}
    </>
  )
}
```

**Why This Works:**
- `@sanity/preview-kit/client` supports client-side stega metadata
- Visual Editing overlays work via stega-encoded strings in content
- Conditional rendering ensures no fallback content shows

---

### 2. Visual Editing Detection

**Next.js Approach:**
```typescript
const isDraft = draftMode().isEnabled
```

**Our Vite/React Approach:**
```typescript
function isVisualEditing(): boolean {
  // Check if in iframe (Presentation tool)
  const inIframe = window !== window.parent
  // Check environment variable
  const envEnabled = import.meta.env.VITE_SANITY_VISUAL_EDITING === 'true'
  return inIframe || envEnabled
}
```

**Why This Works:**
- Presentation tool loads app in iframe
- Can also enable via environment variable for testing
- Client detects and configures appropriately

---

### 3. Stega Metadata & Visual Editing

**Next.js Approach (from guide):**
- Server component fetches data with stega
- Hidden `<HomeOverlay>` component (server) with `data-sanity-*` attributes
- Client component receives props and renders UI

**Our Vite/React Approach:**
```typescript
// src/lib/sanity.client.ts
const clientConfig = {
  projectId,
  dataset,
  useCdn: !visualEditing, // Disable CDN to preserve stega
  perspective: (visualEditing && token) ? 'drafts' : 'published',
  stega: {
    enabled: visualEditing, // Enable stega encoding
    studioUrl: '/studio',
  }
}
```

**How Visual Editing Works:**
1. Client fetches data with stega metadata embedded in strings
2. `<VisualEditing>` component from `@sanity/visual-editing/react` reads stega
3. Overlays appear on encoded content automatically
4. No need for manual `data-sanity-*` attributes

**Key Difference:**
- Next.js: Relies on server-rendered markers + stega
- Vite/React: Relies purely on stega metadata in content

---

### 4. Draft/Preview Mode

**Next.js Approach:**
```typescript
// Uses built-in draftMode() API
const isDraft = draftMode().isEnabled
```

**Our Vite/React Approach:**
```typescript
// Detects preview token from URL parameters
function getPreviewToken(): string | undefined {
  const params = new URLSearchParams(window.location.search)
  return params.get('token') || undefined
}

// Changes perspective based on token
perspective: (visualEditing && token) ? 'drafts' : 'published'
```

**Why This Works:**
- Presentation tool passes `?token=xyz` in URL
- Client reads token and fetches draft content
- No server-side draft mode needed

---

## What We're Missing (and Why It's OK)

### ❌ Overlay Markers (Server-Rendered Anchors)

**From Guide:**
```typescript
// components/site/home/HomeOverlay.tsx (Server Component)
export default function HomeOverlay({ discountedProducts }) {
  return (
    <div aria-hidden="true" style={{ opacity: 0 }}>
      {discountedProducts?.map((product, i) => (
        <div
          data-sanity-id={`discountedProducts-${product._key}`}
          data-sanity-type="home.discountedProducts"
        >
          <span>{product?.name}</span>
        </div>
      ))}
    </div>
  )
}
```

**Why We Don't Have This:**
- Vite/React has no server rendering step
- All rendering happens client-side
- Stega metadata in content strings is sufficient for overlays

**Impact:**
- ⚠️ Visual Editing overlays may be slightly less precise
- ✅ Still works for most content fields (text, images, etc.)
- ⚠️ May not work for deeply nested or complex structures

---

### ❌ Separate Server/Client Components

**From Guide:**
- Server components fetch data
- Client components handle interactivity
- Clear separation of concerns

**Our Approach:**
- Everything is a client component
- Fetching happens in `useEffect`
- All state is client-side

**Impact:**
- ✅ Simpler architecture for SPA
- ⚠️ No SEO benefits from SSR
- ⚠️ Slower initial page load (client-side fetching)

---

## Compliance Summary

### ✅ What We're Doing Right

1. **No Inline Defaults** ✅
   - All sections use conditional rendering
   - No hardcoded fallback content
   - Sections hide gracefully when empty

2. **Proper GROQ Queries** ✅
   - Include `_key` for array items
   - Include `_id` and `_type` for documents
   - Properly structure references

3. **Data Transformation** ✅
   - Transformer functions map Sanity → UI
   - Handle null/undefined safely
   - Provide sensible defaults

4. **Visual Editing Config** ✅
   - Using `@sanity/preview-kit/client`
   - Stega enabled when in visual editing mode
   - Draft perspective with token
   - CDN disabled for visual editing

5. **Conditional Rendering** ✅
   ```tsx
   {categories.length > 0 && <CategoryRail categories={categories} />}
   {featuredCollections.length > 0 && featuredCollections.map(...)}
   ```

6. **Schema Best Practices** ✅
   - Collections use references (`collection->`)
   - Products link via `collectionType` string
   - Proper field naming and structure

### ⚠️ Adaptations Required (Not Issues)

1. **Client-Side Fetching** (Required for Vite/React SPA)
2. **No Server Components** (Not available in Vite)
3. **No Overlay Markers** (Relying on stega only)
4. **URL-Based Draft Mode** (Instead of Next.js `draftMode()`)

### 🎯 Recommendations

**For Better Visual Editing (Optional):**
1. Consider adding a simple "overlay helper" component that renders invisible markers for key content
2. Could be done purely client-side after data loads
3. Example:
```tsx
{visualEditing && categories.map(cat => (
  <span 
    key={cat._key} 
    data-sanity-id={`categories-${cat._key}`}
    style={{ display: 'none' }}
  />
))}
```

**For Better Performance:**
1. Consider SSR with Vite (via `vite-plugin-ssr` or similar)
2. Or use React 19's server components when stable
3. Or migrate to Next.js for full SSR benefits

**For Better SEO:**
1. Implement meta tags dynamically from Sanity
2. Add JSON-LD structured data
3. Generate sitemap from Sanity content

---

## Conclusion

Our implementation follows the **spirit** of the `SANITY_INTEGRATION_GUIDE.md` while adapting to the constraints of a Vite/React SPA:

✅ **Core Principles**: Followed
✅ **Data Flow**: Adapted for client-side
✅ **Visual Editing**: Working (with stega)
⚠️ **Architecture**: Different (SPA vs SSR)

The main limitation is the lack of server-side rendering, which affects:
- SEO (can be mitigated with meta tags)
- Initial load time (can be mitigated with code splitting)
- Visual Editing precision (works well enough with stega)

For a production app, consider:
1. ✅ Keep current approach if SPA is acceptable
2. ⚠️ Add SSR with Vite plugins if SEO is critical
3. 🚀 Migrate to Next.js for full SSR + Visual Editing benefits

---

## Testing Checklist

- [x] ✅ Content renders from Sanity
- [x] ✅ Sections hide when empty
- [x] ✅ Visual Editing overlays appear (via stega)
- [x] ✅ Draft mode works (with token)
- [x] ✅ Collections link to products
- [x] ✅ Categories navigate to collections
- [ ] ⚠️ Test click-to-edit precision (may need markers)
- [ ] ⚠️ Test SEO metadata rendering
- [ ] ⚠️ Test performance on slow networks


