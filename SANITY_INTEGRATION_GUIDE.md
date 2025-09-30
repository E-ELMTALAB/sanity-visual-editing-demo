# Sanity Visual Editing Integration Guide

This document outlines the complete workflow for integrating Sanity CMS with Next.js components, ensuring Visual Editing overlays work correctly and content renders reliably.

## Core Principles

1. **Server-First Rendering**: Fetch Sanity data server-side in App Router pages for reliable stega metadata
2. **Client-Only UI**: Keep complex UI logic in client components to avoid RSC serialization issues
3. **No Inline Defaults**: Client components render only when Sanity data exists (no fallback content)
4. **Overlay Markers**: Include hidden server-rendered anchors for Visual Editing to attach to
5. **Draft-Aware Fetching**: Use `draftMode().isEnabled` and preview tokens for live updates

## Step-by-Step Implementation

### 1. Define Content Models

Create Sanity schemas as **standalone objects** (not inline):

```typescript
// schemas/objects/discountedProduct.ts
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'discountedProduct',
  title: 'Discounted Product',
  type: 'object',
  fields: [
    defineField({ name: 'name', type: 'string', title: 'Product Name', validation: (Rule) => Rule.required() }),
    defineField({ name: 'description', type: 'text', title: 'Description', rows: 2 }),
    defineField({ name: 'category', type: 'string', title: 'Category' }),
    defineField({ name: 'originalPrice', type: 'number', title: 'Original Price' }),
    defineField({ name: 'discountedPrice', type: 'number', title: 'Discounted Price' }),
    defineField({ name: 'discountPercentage', type: 'number', title: 'Discount %' }),
    defineField({ name: 'image', type: 'image', title: 'Image', options: { hotspot: true } }),
  ],
})
```

Add to parent document (e.g., `home` singleton):
```typescript
// schemas/singletons/home.ts
defineField({
  name: 'discountedProducts',
  title: 'Discounted Products',
  type: 'array',
  of: [defineArrayMember({ type: 'discountedProduct' })],
})
```

Register both in `sanity.config.ts`:
```typescript
import discountedProduct from 'schemas/objects/discountedProduct'
import home from 'schemas/singletons/home'
types: [/* ... */, home, discountedProduct]
```

### 2. Create GROQ Queries

Include `_key` for Visual Editing overlays (helps with array item identification):

```typescript
// lib/sanity.queries.ts
export const homeQuery = groq`
  *[_type == "home"][0]{
    discountedProducts[]{
      _key,
      name,
      description,
      category,
      originalPrice,
      discountedPrice,
      discountPercentage,
      image
    }
  }
`
```

**Note**: `_type` is optional but can be useful for debugging. The critical field is `_key` for array items.

### 3. Define TypeScript Types

```typescript
// types/index.ts
import type { Image } from 'sanity'

export interface DiscountedProduct {
  _key?: string
  name?: string
  description?: string
  category?: string
  originalPrice?: number
  discountedPrice?: number
  discountPercentage?: number
  image?: Image
}
```

### 4. Create Default Content (Optional)

For when Sanity is empty - use empty array so sections hide gracefully:

```typescript
// lib/defaults/discountedProducts.ts
import { type DiscountedProduct } from 'types'

export const defaultDiscountedProducts: DiscountedProduct[] = []
```

**Note**: With empty defaults and conditional rendering in the client component, sections will hide when no content exists rather than showing placeholder data.

### 5. Server-Side Data Fetching

Fetch data in the App Router page and pass to both overlay and client components:

```typescript
// app/page.tsx
import { draftMode } from 'next/headers'
import { getClient } from 'lib/sanity.client'
import { readToken } from 'lib/sanity.api'
import { homeQuery } from 'lib/sanity.queries'
import HomePageClient from '@/app/page' // Your existing client component
import HomeOverlay from 'components/site/home/HomeOverlay'

export default async function RootPage() {
  const isDraft = draftMode().isEnabled
  const client = getClient(isDraft ? { token: readToken } : undefined)
  const data = await client.fetch<any | null>(homeQuery)
  const discountedProducts = data?.discountedProducts || []

  return (
    <>
      <HomeOverlay discountedProducts={discountedProducts} />
      <HomePageClient homeData={{ discountedProducts }} />
    </>
  )
}
```

**Key Points**:
- Fetch with draft-aware client: `getClient(isDraft ? { token: readToken } : undefined)`
- Extract data with fallback: `data?.discountedProducts || []`
- Pass same data to both overlay (server) and client components

### 6. Hidden Overlay Component

Create a **server component** (no `"use client"`) with invisible anchors for Visual Editing:

```typescript
// components/site/home/HomeOverlay.tsx
interface HomeOverlayProps {
  discountedProducts: any[]
}

export default function HomeOverlay({ discountedProducts }: HomeOverlayProps) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0 }}>
      {discountedProducts?.map((product, i) => (
        <div
          key={`product-${i}`}
          data-sanity-id={product?._id || `discountedProducts-${product?._key}`}
          data-sanity-type="home.discountedProducts"
          data-sanity-index={i}
        >
          <span>{product?.name}</span>
          <span>{product?.description}</span>
          <span>{product?.originalPrice}</span>
          <span>{product?.discountedPrice}</span>
        </div>
      ))}
    </div>
  )
}
```

**Critical Details**:
- **Must be a server component** (renders with stega metadata intact)
- `data-sanity-id`: Use `_key` with array field prefix (e.g., `discountedProducts-${_key}`)
- `data-sanity-type`: Use dot notation path (e.g., `home.discountedProducts`)
- Include all editable fields as `<span>` children so overlays can map correctly

### 7. Client Component for UI

Update your **existing** client component to receive props and conditionally render:

```typescript
// sharifgpt-website/app/page.tsx
"use client"

import type { DiscountedProduct } from "types"

export default function HomePage({ 
  homeData 
}: { 
  homeData?: { discountedProducts?: DiscountedProduct[] } 
}) {
  const discountedProductsFromSanity = homeData?.discountedProducts || []
  
  // Transform Sanity data to component format
  const discountedProducts = discountedProductsFromSanity.map((dp, i) => ({
    id: i + 1,
    name: dp.name || '',
    description: dp.description || '',
    originalPrice: dp.originalPrice || 0,
    discountedPrice: dp.discountedPrice || 0,
    discountPercentage: dp.discountPercentage || 0,
    image: (dp as any)?.image?.asset?.url || '/placeholder.svg',
    category: dp.category || 'default',
  }))

  return (
    <>
      {/* Conditionally render section only when products exist */}
      {discountedProducts.length > 0 && (
        <section className="mb-16">
          <h2>Special Offers</h2>
          <div className="grid">
            {discountedProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
```

**Key Points**:
- **Must have `"use client"` directive** at top of file
- Accept data via props (not from context or hardcoded)
- Transform Sanity data to match existing component structure
- Conditionally render: `{data.length > 0 && <section>...</section>}`
- Remove all inline/hardcoded default data

### 8. Enable Visual Editing

Visual Editing configuration (should already be set up):

```typescript
// lib/sanity.client.ts
import { createClient } from 'next-sanity'

export function getClient(preview?: { token: string }) {
  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    perspective: 'published',
    stega: {
      enabled:
        process.env.NEXT_PUBLIC_SANITY_VISUAL_EDITING === 'true' ||
        process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview' ||
        typeof preview?.token === 'string',
      studioUrl: '/studio',
      logger: console,
      filter: (props) => {
        // Filter out specific fields that shouldn't have overlays
        if (props.sourcePath.at(0) === 'duration') return false
        return props.filterDefault(props)
      },
    },
  })
  if (preview) {
    return client.withConfig({
      token: preview.token,
      useCdn: false,
      ignoreBrowserTokenWarning: true,
      perspective: 'previewDrafts',
    })
  }
  return client
}
```

```typescript
// app/layout.tsx
import dynamic from 'next/dynamic'

const AppVisualEditing = dynamic(
  () => import('components/visual-editing/AppVisualEditing'), 
  { ssr: false }
)

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <AppVisualEditing />
      </body>
    </html>
  )
}
```

```typescript
// components/visual-editing/AppVisualEditing.tsx
"use client"
import { VisualEditing } from 'next-sanity'

export default function AppVisualEditing() {
  return <VisualEditing />
}
```

**Note**: Array items automatically get stega metadata - no special filter configuration needed for new array fields.

## Testing Visual Editing

1. **Studio Setup**: In Sanity Studio, add content to your schema fields and publish
2. **Draft Mode**: Open the page via Studio "Presentation" → "Open preview" (enables draft mode)
3. **Overlays**: Hover over content fields to see blue outline boxes
4. **Click to Edit**: Click an overlay to jump back to Studio and edit that field

## Common Issues & Solutions

### Overlays Not Appearing
- **Missing `_key`**: Ensure `_key` is included in GROQ queries for array items
- **Wrong `data-sanity-id`**: Use format `arrayFieldName-${_key}` (e.g., `discountedProducts-${_key}`)
- **Wrong `data-sanity-type`**: Use dot notation with parent type (e.g., `home.discountedProducts`)
- **Draft mode not enabled**: Open via Studio "Presentation" tab, or set `NEXT_PUBLIC_SANITY_VISUAL_EDITING=true`
- **Client component rendering**: Overlay component must be a **server component** (no `"use client"`)
- **Stega stripped**: Ensure data passes through server component first before client transformation

### Build Errors
- **Serialization errors**: Mark interactive components with `"use client"` at the very top
- **Module not found**: Check import paths use correct aliases (`@/` for sharifgpt-website)
- **Server-only APIs**: Don't use `draftMode()` or `getClient()` in client components
- **Circular dependencies**: Check imports don't create loops

### Content Not Rendering
- **Schema not registered**: Verify both object type and parent document are in `sanity.config.ts` types array
- **GROQ query issues**: Test query in Studio Vision tool to verify data structure
- **Props not passed**: Ensure App Router page passes data to client component via props
- **Conditional rendering**: Check `{data.length > 0 && ...}` condition is correct

### Visual Editing Works in Development But Not Production
- Set environment variable: `NEXT_PUBLIC_SANITY_VISUAL_EDITING=true` in production
- Or ensure `NEXT_PUBLIC_VERCEL_ENV=preview` is set for preview deployments

## Migration Checklist

When adding Sanity to existing components, follow these steps in order:

### ✅ Step-by-Step Checklist

- [ ] **1. Schema**: Create object type in `schemas/objects/` with all fields
- [ ] **2. Register Schema**: Add to parent document (e.g., `home.ts`) as array field
- [ ] **3. Register in Config**: Import and add both to `sanity.config.ts` types array
- [ ] **4. GROQ Query**: Add query with `_key` and all fields to `lib/sanity.queries.ts`
- [ ] **5. TypeScript Types**: Add interface to `types/index.ts` with `_key?` field
- [ ] **6. Defaults**: Create empty array in `lib/defaults/` (optional)
- [ ] **7. Server Fetch**: Update `app/page.tsx` to fetch data with draft-aware client
- [ ] **8. Overlay Component**: Create/update server component with `data-sanity-*` attributes
- [ ] **9. Props Flow**: Pass data from App Router page to both overlay and client components
- [ ] **10. Client Component**: Update to accept props, transform data, and conditionally render
- [ ] **11. Remove Hardcoded Data**: Delete all inline/default content from client component
- [ ] **12. Test in Studio**: Add content in Studio, publish, and verify it renders
- [ ] **13. Test Visual Editing**: Open in Presentation tab, verify overlays appear and work

### 🎯 Success Criteria

- ✅ Content renders when populated in Sanity
- ✅ Section hides gracefully when empty
- ✅ Blue overlays appear in Presentation mode
- ✅ Clicking overlays opens correct Studio field
- ✅ No build/TypeScript errors
- ✅ No hardcoded fallback content

This pattern ensures Visual Editing works reliably while maintaining existing UI/UX.
