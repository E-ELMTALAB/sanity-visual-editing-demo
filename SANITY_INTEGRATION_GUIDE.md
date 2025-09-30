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

Create Sanity schemas that represent your content structure:

```typescript
// schemas/documents/heroSlide.ts
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'heroSlide',
  title: 'Hero Slide',
  type: 'object',
  fields: [
    defineField({ name: 'title', type: 'string', title: 'Title' }),
    defineField({ name: 'subtitle', type: 'string', title: 'Subtitle' }),
    defineField({ name: 'buttonText', type: 'string', title: 'Button Text' }),
    defineField({ name: 'buttonHref', type: 'string', title: 'Button Link' }),
    defineField({ name: 'image', type: 'image', title: 'Image', options: { hotspot: true } }),
  ],
})
```

Register in `sanity.config.ts`:
```typescript
import heroSlide from 'schemas/documents/heroSlide'
types: [/* ... */, heroSlide]
```

### 2. Create GROQ Queries

Include `_key` and `_type` for Visual Editing overlays:

```typescript
// lib/sanity.queries.ts
export const heroSlidesQuery = groq`
  *[_type == "home"][0]{
    heroSlides[]{
      _key,
      _type,
      title,
      subtitle,
      buttonText,
      buttonHref,
      image
    }
  }
`
```

### 3. Define TypeScript Types

```typescript
// types/index.ts
export interface HeroSlide {
  _key?: string
  _type?: string
  title?: string
  subtitle?: string
  buttonText?: string
  buttonHref?: string
  image?: Image
}
```

### 4. Create Default Content

For when Sanity is empty (used server-side only):

```typescript
// lib/defaults/heroSlides.ts
import { type HeroSlide } from 'types'

export const defaultHeroSlides: HeroSlide[] = []
```

### 5. Server-Side Data Fetching

Create an App Router page that fetches in draft mode:

```typescript
// app/page.tsx
import { draftMode } from 'next/headers'
import { getClient } from 'lib/sanity.client'
import { readToken } from 'lib/sanity.api'
import { heroSlidesQuery } from 'lib/sanity.queries'
import HeroSlidesClient from 'components/site/HeroSlidesClient'
import HeroSlidesOverlay from 'components/site/HeroSlidesOverlay'

export default async function HomePage() {
  const isDraft = draftMode().isEnabled
  const client = getClient(isDraft ? { token: readToken } : undefined)
  const data = await client.fetch<any | null>(heroSlidesQuery)
  const slides = data?.heroSlides || []

  return (
    <>
      <HeroSlidesOverlay slides={slides} />
      <HeroSlidesClient slides={slides} />
    </>
  )
}
```

### 6. Hidden Overlay Component

Create a server component for Visual Editing anchors:

```typescript
// components/site/HeroSlidesOverlay.tsx
interface HeroSlidesOverlayProps {
  slides: any[]
}

export default function HeroSlidesOverlay({ slides }: HeroSlidesOverlayProps) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0 }}>
      {slides?.map((slide, i) => (
        <div
          key={`slide-${i}`}
          data-sanity-id={`heroSlides-${slide?._key}`}
          data-sanity-type="home.heroSlides"
          data-sanity-index={i}
        >
          <span>{slide?.title}</span>
          <span>{slide?.subtitle}</span>
          <span>{slide?.buttonText}</span>
        </div>
      ))}
    </div>
  )
}
```

### 7. Client Component for UI

Create a client component that renders only when data exists:

```typescript
// components/site/HeroSlidesClient.tsx
"use client"

interface HeroSlidesClientProps {
  slides: HeroSlide[]
}

export default function HeroSlidesClient({ slides }: HeroSlidesClientProps) {
  if (!slides?.length) return null

  return (
    <div className="hero-container">
      {slides.map((slide, i) => (
        <div key={i} className="slide-item">
          <h2>{slide.title}</h2>
          <p>{slide.subtitle}</p>
          <button>{slide.buttonText}</button>
        </div>
      ))}
    </div>
  )
}
```

### 8. Enable Visual Editing

Ensure Visual Editing is properly configured:

```typescript
// lib/sanity.client.ts
stega: {
  enabled:
    process.env.NEXT_PUBLIC_SANITY_VISUAL_EDITING === 'true' ||
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview' ||
    typeof preview?.token === 'string',
  studioUrl: '/studio',
  filter: (props) => {
    // Allow array items for overlays
    if (props.sourcePath.at(-1) === 'heroSlides') return true
    return props.filterDefault(props)
  },
}
```

```typescript
// app/layout.tsx
import { VisualEditing } from 'next-sanity'
import dynamic from 'next/dynamic'

const AppVisualEditing = dynamic(() => import('components/visual-editing/AppVisualEditing'), { ssr: false })

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
  return <VisualEditing studioUrl="/studio" />
}
```

## Testing Visual Editing

1. **Studio Setup**: In Sanity Studio, add content to your schema fields and publish
2. **Draft Mode**: Open the page via Studio "Presentation" → "Open preview" (enables draft mode)
3. **Overlays**: Hover over content fields to see blue outline boxes
4. **Click to Edit**: Click an overlay to jump back to Studio and edit that field

## Common Issues & Solutions

### Overlays Not Appearing
- Ensure `_key` is included in GROQ queries
- Use `data-sanity-id` with array prefix (e.g., `heroSlides-${_key}`)
- Use `data-sanity-type="home.heroSlides"` for array items
- Verify `NEXT_PUBLIC_SANITY_VISUAL_EDITING=true` or draft mode is active

### Build Errors
- Mark client components with `"use client"`
- Avoid server-only APIs in client components
- Ensure no circular dependencies in imports

### Content Not Rendering
- Verify schema is registered in `sanity.config.ts`
- Check GROQ query returns expected data structure
- Ensure client component receives props correctly

## Migration Pattern

When adding Sanity to existing components:

1. **Identify Content**: Determine what data needs to be editable
2. **Schema**: Create Sanity document/object types
3. **Query**: Add GROQ with `_key`/`_type`
4. **Types**: Define TypeScript interfaces
5. **Server Fetch**: Create App Router page that fetches data
6. **Overlay**: Add hidden server component for markers
7. **Client Render**: Update existing component to use props instead of hardcoded data
8. **Test**: Verify overlays appear in draft mode

This pattern ensures Visual Editing works reliably while maintaining existing UI/UX.
