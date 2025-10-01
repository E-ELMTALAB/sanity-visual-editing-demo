# Dynamic Routes with Sanity - Implementation Guide

## 🎯 Overview

Your homepage links to product and course pages using slugs like:
- `/products/spotify-premium` 
- `/courses/chatgpt-course`

This guide shows you how to connect these URLs to Sanity data.

## 📁 Folder Structure

```
sharifgpt-website/app/
├── products/
│   └── [slug]/
│       └── page.tsx → Fetches from Sanity by slug
└── courses/
    └── [slug]/
        └── page.tsx → Fetches from Sanity by slug
```

## 🔄 Two Approaches

### **Approach 1: Server-First (Recommended)**

Create a server component that fetches data and renders your client UI:

```typescript
// app/products/[slug]/page.tsx (Server Component)
import { getClient } from 'lib/sanity.client'
import { productBySlugQuery } from 'lib/sanity.queries'
import { urlForImage } from 'lib/sanity.image'
import { notFound } from 'next/navigation'
import ProductClient from './ProductClient'

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const client = getClient()
  const product = await client.fetch(productBySlugQuery, { slug: params.slug })
  
  if (!product) {
    notFound() // Show 404 if product not found
  }
  
  // Transform Sanity data to match your UI expectations
  const productData = {
    id: 1,
    title: product.name || 'Product',
    description: product.description || '',
    price: product.discountedPrice || product.price || 0,
    originalPrice: product.originalPrice || 0,
    discount: product.discountPercentage || 0,
    rating: 4.5,
    reviews: 16,
    image: product.image ? urlForImage(product.image)?.url() : '/placeholder.svg',
    category: product.category || 'default',
    // ... rest of the hardcoded data structure
  }
  
  return <ProductClient product={productData} />
}
```

Then move your existing UI to `ProductClient.tsx`:

```typescript
// app/products/[slug]/ProductClient.tsx (Client Component)
"use client"

export default function ProductClient({ product }: { product: any }) {
  // Your existing UI code stays exactly the same
  // Just replace hardcoded `product` with the prop
}
```

### **Approach 2: Direct Fetch in Client (Simpler but less optimal)**

Keep your existing page as-is, but fetch data client-side:

```typescript
"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function ProductPage() {
  const params = useParams()
  const slug = params.slug as string
  const [product, setProduct] = useState(null)
  
  useEffect(() => {
    // Fetch from API route that queries Sanity
    fetch(`/api/products/${slug}`)
      .then(res => res.json())
      .then(setProduct)
  }, [slug])
  
  if (!product) return <div>Loading...</div>
  
  // Your existing UI code
}
```

## 🎨 Recommended Quick Win: Hybrid Approach

For your case, I recommend this middle ground:

1. **Keep most hardcoded data** (for features, reviews, FAQs)
2. **Fetch only key info from Sanity** (name, price, image, description)
3. **Gradual migration** as you add more content to Sanity

Example:

```typescript
"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function ProductPage() {
  const params = useParams()
  const slug = params.slug as string
  const [sanityData, setSanityData] = useState(null)
  
  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then(res => res.json())
      .then(setSanityData)
  }, [slug])
  
  // Use Sanity data for dynamic fields, keep hardcoded for static content
  const product = {
    id: 1,
    title: sanityData?.name || "اکانت اسپاتیفای پریمیوم",
    description: sanityData?.description || "توضیحات پیش‌فرض",
    price: sanityData?.discountedPrice || 250000,
    originalPrice: sanityData?.originalPrice || 350000,
    discount: sanityData?.discountPercentage || 30,
    rating: 4.5, // Hardcoded for now
    reviews: 16, // Hardcoded for now
    image: sanityData?.imageUrl || "/placeholder.svg",
    category: sanityData?.category || 'default',
    // Static data stays hardcoded
    features: [
      "دسترسی به میلیون‌ها آهنگ",
      // ... rest of static features
    ],
    gallery: [
      "https://placehold.co/600x400/1DB954/FFFFFF?text=Spotify+1",
      // ... hardcoded gallery
    ],
    options: [
      { id: "1-month", name: "1 ماهه", price: 250000 },
      // ... hardcoded options
    ]
  }
  
  // Rest of your existing UI code
}
```

## 🔌 API Route Method (For Client Fetching)

If using client-side fetching, create API routes:

```typescript
// app/api/products/[slug]/route.ts
import { NextResponse } from 'next/server'
import { getClient } from 'lib/sanity.client'
import { productBySlugQuery } from 'lib/sanity.queries'
import { urlForImage } from 'lib/sanity.image'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const client = getClient()
  const product = await client.fetch(productBySlugQuery, { slug: params.slug })
  
  if (!product) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  
  return NextResponse.json({
    name: product.name,
    description: product.description,
    discountedPrice: product.discountedPrice,
    originalPrice: product.originalPrice,
    discountPercentage: product.discountPercentage,
    category: product.category,
    imageUrl: product.image ? urlForImage(product.image)?.url() : null,
  })
}
```

## ✅ My Recommendation for You

Given your current setup, I recommend:

1. **Start with API routes + client fetching** (Approach 2)
   - Minimal changes to your existing code
   - Easy to test and debug
   - Can migrate to server components later

2. **Create 2 API routes**:
   - `/api/products/[slug]/route.ts`
   - `/api/courses/[slug]/route.ts`

3. **Update your page params**:
   - Change `params: { id: string }` to `params: { slug: string }`
   - Fetch from API using the slug
   - Merge Sanity data with hardcoded data

4. **Gradual enhancement**:
   - Phase 1: Basic info (name, price, image) from Sanity
   - Phase 2: Add more fields (features, reviews) to Sanity later
   - Phase 3: Eventually migrate to full server components

## 🚀 Next Steps

Would you like me to:

A. **Create the API routes** for client-side fetching (quickest)
B. **Convert to server components** with full data fetching (best practice)
C. **Create a hybrid** example showing both approaches

Let me know and I'll implement it for you!

