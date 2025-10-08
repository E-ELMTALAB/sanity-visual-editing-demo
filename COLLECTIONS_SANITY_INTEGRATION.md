# Collections Sanity Integration - Complete

This document explains the complete Sanity CMS integration for collection pages, following the Sanity Integration Guide principles.

## ✅ What Has Been Implemented

### 1. **Collection Document Schema**

**File**: `schemas/documents/collection.ts`

A new `collection` document type with:
- **Content Fields**:
  - Title and Slug
  - Collection Key (unique identifier like "chatbot-ai", "ai-tools")
  - Hero Title and Hero Subtitle
  - Cover Image with alt text
  - FAQ Section (array of Q&A items)
- **SEO Fields**:
  - Meta Title and Description
  - Canonical URL
  - Meta Robots
  - Open Graph Title, Description, and Image

### 2. **Product Schema Enhancement**

**File**: `schemas/documents/product.ts`

Added a new field:
```typescript
collectionType: string (optional)
```
- This field contains the collection key (e.g., "chatbot-ai")
- When a product has this field set, it will appear on that collection page
- Leave empty if the product is not part of any collection

### 3. **GROQ Queries**

**File**: `lib/sanity.queries.ts`

New queries added:
```typescript
// Fetch a collection by slug
export const collectionBySlugQuery

// Get all collections
export const allCollectionsQuery

// Get collection slugs for static generation
export const collectionPaths

// Fetch products by collection type
export const productsByCollectionTypeQuery
```

### 4. **TypeScript Types**

**File**: `types/index.ts`

New interfaces:
```typescript
export interface CollectionFAQItem {
  question?: string
  answer?: string
}

export interface CollectionPayload {
  _id?: string
  _key?: string
  title?: string
  slug?: { current?: string }
  key?: string
  heroTitle?: string
  heroSubtitle?: string
  coverImage?: Image
  faq?: CollectionFAQItem[]
  seo?: { ... }
}
```

Updated `ProductDoc` to include:
```typescript
collectionType?: string
```

### 5. **Visual Editing Overlay**

**File**: `components/site/collection/CollectionOverlay.tsx`

Server component that enables Visual Editing:
- Renders invisible anchors for collection metadata
- Includes all editable fields
- Enables click-to-edit in Sanity Studio
- Proper `data-sanity-*` attributes for overlay mapping

### 6. **Server-Side Collection Page**

**File**: `app/collections/[slug]/page.tsx`

Fully integrated with Sanity:
- Draft-aware fetching with preview tokens
- Fetches collection data and filtered products
- SEO metadata generation from Sanity
- Passes data to both overlay and client components

### 7. **Client Component**

**File**: `app/collections/[slug]/page-client.tsx`

Updated to work with Sanity data:
- Accepts `collection` and `products` from props
- Transforms Sanity data for rendering
- Filtering by category, features, tags, and price
- Sorting by popular, price, and newest
- Pagination support
- Responsive design with mobile filters

### 8. **Schema Registration**

**File**: `sanity.config.ts`

Collection schema registered in Sanity Studio configuration.

---

## 🚀 How to Use

### Step 1: Create a Collection in Sanity Studio

1. Go to Sanity Studio (usually at `/studio`)
2. Create a new **Collection** document
3. Fill in the required fields:
   - **Title**: Display name (e.g., "Chatbot AIs")
   - **Slug**: URL slug (e.g., "chatbot-ai")
   - **Collection Key**: Unique identifier (e.g., "chatbot-ai")
   - **Hero Title**: Main heading for the hero section
   - **Hero Subtitle**: Description text
   - **Cover Image**: Background image for the hero
   - **FAQ**: Add questions and answers (optional)
   - **SEO Settings**: Fill in meta tags for better SEO
4. Publish the collection

### Step 2: Add Products to the Collection

1. Go to **Products** in Sanity Studio
2. For each product you want in the collection:
   - Open or create a product
   - Find the **Collection Type** field
   - Enter the collection key (e.g., "chatbot-ai")
   - Save and publish
3. Products with matching collection type will automatically appear on that collection page

### Step 3: Access the Collection Page

Navigate to: `/collections/[your-slug]`

Example: `/collections/chatbot-ai`

---

## 📊 Features

### Dynamic Filtering
- **Category**: Filter by product category
- **Features**: Filter by product features
- **Tags**: Filter by product tags
- **Price**: Filter by price ranges (in Tomans)

### Sorting Options
- **Popular**: Sort by review count
- **Price: Low → High**: Cheapest first
- **Price: High → Low**: Most expensive first
- **Newest**: Latest products first

### Other Features
- **Search**: Search within collection by name, category, or description
- **Pagination**: 24 products per page
- **Responsive Design**: Mobile-optimized with bottom sheet filters
- **SEO Optimized**: Full meta tags, Open Graph, and Twitter Cards
- **Visual Editing**: Click-to-edit support in Sanity Presentation mode

---

## 🎯 Visual Editing

### How to Test Visual Editing

1. **Create Content in Studio**:
   - Add collection with all fields
   - Add products with the collection type set

2. **Enable Draft Mode**:
   - In Sanity Studio, go to "Presentation" tab
   - Navigate to your collection page
   - Or set `NEXT_PUBLIC_SANITY_VISUAL_EDITING=true`

3. **Test Overlays**:
   - Hover over collection title, subtitle, etc.
   - You should see blue overlay boxes
   - Click to edit that specific field in Studio

4. **Edit and Preview**:
   - Make changes in Studio
   - See real-time updates in the preview

---

## 📝 Example Data Structure

### Example Collection
```typescript
{
  title: "Chatbot AIs",
  slug: { current: "chatbot-ai" },
  key: "chatbot-ai",
  heroTitle: "Best Chatbot AI Platforms",
  heroSubtitle: "Compare GPT, Gemini, Claude, and more in one place.",
  coverImage: { ... },
  faq: [
    {
      question: "How do chatbot plans differ?",
      answer: "Plans vary based on usage limits, features, and team options."
    }
  ],
  seo: {
    metaTitle: "Best Chatbot AI Platforms | Compare & Buy",
    metaDescription: "Compare pricing and features across top AI chatbots",
    robotsMeta: "index,follow"
  }
}
```

### Example Product with Collection Type
```typescript
{
  name: "ChatGPT Plus",
  slug: { current: "chatgpt-plus" },
  description: "Access to advanced ChatGPT models",
  category: "ai-chatbot",
  collectionType: "chatbot-ai",  // ← Links to collection
  price: 200000,
  originalPrice: 250000,
  discountPercentage: 20,
  features: ["Priority access", "Faster responses"],
  tags: ["ai", "chatbot", "gpt"],
  image: { ... },
  rating: 4.8,
  reviewCount: 150,
  inStock: true
}
```

---

## 🔄 Data Flow

```
Sanity Studio (Edit Collection & Products)
  ↓
Collection Schema + Product Schema (with collectionType)
  ↓
GROQ Queries (collectionBySlugQuery, productsByCollectionTypeQuery)
  ↓
Server Component (app/collections/[slug]/page.tsx)
  ↓
├─→ CollectionOverlay (Visual Editing markers)
└─→ CollectionPageClient (UI rendering with filters/sort)
```

---

## ✨ Best Practices

1. **Collection Keys**: Use consistent, URL-friendly keys (e.g., "chatbot-ai", "productivity-tools")
2. **Product Assignment**: Only add `collectionType` to products that truly belong to that collection
3. **SEO**: Always fill in SEO fields for better search visibility
4. **Images**: Use high-quality images with proper alt text
5. **FAQs**: Add relevant FAQs to improve user experience and SEO
6. **Testing**: Test in Presentation mode before publishing

---

## 🎉 Result

Your collection pages are now fully integrated with Sanity CMS with:
- ✅ Complete content management from Studio
- ✅ Visual Editing support with click-to-edit
- ✅ Dynamic product filtering based on `collectionType`
- ✅ Full SEO control
- ✅ Responsive, beautiful UI
- ✅ Professional content management workflow

---

## 🛠️ Troubleshooting

### Products Not Showing on Collection Page

**Check**:
1. Product's `collectionType` field matches the collection's `key`
2. Product is published in Sanity
3. Product's `inStock` is set to `true`
4. Collection's `key` field is set correctly

### Visual Editing Not Working

**Check**:
1. Draft mode is enabled (via Presentation tab or env var)
2. Collection and products are published
3. `NEXT_PUBLIC_SANITY_VISUAL_EDITING=true` is set
4. You're viewing the page through Studio's Presentation tab

### Collection Page Not Found

**Check**:
1. Collection's slug is correct
2. Collection is published
3. You're navigating to `/collections/[correct-slug]`

---

## 📚 Related Documentation

- [SANITY_INTEGRATION_GUIDE.md](./SANITY_INTEGRATION_GUIDE.md) - General integration principles
- [PRODUCTS_SANITY_INTEGRATION.md](./PRODUCTS_SANITY_INTEGRATION.md) - Product schema details
- [ROUTING_GUIDE.md](./ROUTING_GUIDE.md) - Routing structure

---

**Last Updated**: October 2025  
**Status**: ✅ Complete and Production-Ready
