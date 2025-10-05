# FAQ Sanity Integration - Complete

This document details the FAQ (Frequently Asked Questions) system integrated with Sanity CMS, designed for reusability across multiple pages.

## ✅ Completed Implementation

### 1. **FAQ Document Schema with SEO**

**File**: `schemas/documents/faq.ts`

Comprehensive FAQ schema with page location selector:

#### **Content Fields**
- `question` - The FAQ question (max 200 characters)
- `answer` - Detailed answer (text field)
- `category` - Optional categorization (General, Payment, Shipping, Account, etc.)

#### **Settings**
- `pageLocations` - **Multi-select array** to specify which pages display this FAQ
  - Products Page
  - Courses Page  
  - Home Page
  - About Page
  - Contact Page
  - Checkout Page
  - Cart Page
  - Blog Page
- `order` - Display order (lower numbers appear first)
- `isActive` - Toggle to show/hide FAQ
- `tags` - Tags for internal organization

#### **SEO Fields**
- `includeInStructuredData` - Include in FAQ Schema.org markup
- `keywords` - SEO keywords related to the FAQ

#### **Features**
- Organized into 3 groups: Content, SEO, Settings
- Custom preview showing question, category, order, and active status
- Multiple orderings (by display order, alphabetically)

### 2. **FAQ Queries**

**File**: `lib/sanity.queries.ts`

```typescript
// Fetch FAQs by page location (e.g., 'products')
export const faqsByPageQuery

// Fetch all FAQs (for management)
export const allFaqsQuery
```

The `faqsByPageQuery` filters by:
- Page location match
- Active status (only active FAQs)
- Sorted by order, then creation date

### 3. **TypeScript Types**

**File**: `types/index.ts`

```typescript
export interface FAQ {
  _id?: string
  _key?: string
  question?: string
  answer?: string
  category?: string
  order?: number
  pageLocations?: string[]
  isActive?: boolean
  tags?: string[]
  seo?: {
    includeInStructuredData?: boolean
    keywords?: string[]
  }
}
```

### 4. **Visual Editing Components**

#### **FAQOverlay** (`components/site/product/FAQOverlay.tsx`)
Server component that:
- Renders invisible anchors for each FAQ
- Includes all editable fields as children
- Proper data attributes for Visual Editing
- Enables click-to-edit in Sanity Studio

#### **Updated ProductsPageClient** (`app/products/page-client.tsx`)
- Accepts `faqsData` prop from server
- Transforms Sanity FAQ data to component format
- Conditionally renders FAQ section (hides when empty)
- Maintains expandable/collapsible functionality

#### **Updated Server Page** (`app/products/page.tsx`)
- Fetches FAQs with `faqsByPageQuery` filtered by 'products'
- Passes FAQ data to both overlay and client components
- Draft mode support for Visual Editing

### 5. **Schema Registration**

**File**: `sanity.config.ts`

Added FAQ schema to Sanity Studio configuration.

## 🎯 Key Features

### **Multi-Page Support**
The FAQ schema is designed for **reusability**:
- One FAQ can appear on multiple pages
- Easy to select target pages from dropdown
- Centralized FAQ management
- Consistent answers across site

### **SEO Optimization**

✅ **FAQ Schema.org Support**: 
- Toggle to include/exclude FAQs in structured data
- Generates proper FAQ rich snippets for Google
- Keywords field for search optimization

✅ **Structured Data Ready**:
```json
{
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "Question text",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Answer text"
    }
  }]
}
```

### **Content Management**
- **Categorization**: Group FAQs by category
- **Display Order**: Control which FAQs appear first
- **Active/Inactive**: Toggle visibility without deleting
- **Tags**: Internal organization
- **Preview**: See question, category, order at a glance

### **Visual Editing**
- Click-to-edit in Sanity Studio
- Real-time preview
- Draft mode support
- Proper stega metadata

## 📋 How to Use

### **Creating FAQs in Sanity Studio**

1. Navigate to **FAQ** document type
2. Fill in the **Content** tab:
   - Question (keep under 200 characters)
   - Answer (detailed response)
   - Category (optional)

3. Switch to **Settings** tab:
   - Select pages where FAQ should appear
   - Set display order (0 = first)
   - Ensure "Active" is checked

4. Switch to **SEO** tab:
   - Enable "Include in Structured Data"
   - Add relevant keywords

5. Publish!

### **Example FAQ Creation**

```typescript
{
  question: "چگونه محصولات را خریداری کنم؟",
  answer: "برای خرید محصولات، ابتدا محصول مورد نظر را انتخاب کرده...",
  category: "general",
  pageLocations: ["products", "home", "checkout"],
  order: 1,
  isActive: true,
  seo: {
    includeInStructuredData: true,
    keywords: ["خرید", "پرداخت", "سفارش"]
  }
}
```

### **Using FAQs on Other Pages**

To add FAQs to any page:

```typescript
// 1. Import query and types
import { faqsByPageQuery } from 'lib/sanity.queries'
import type { FAQ } from 'types'

// 2. Fetch in server component
const faqs = await client.fetch<FAQ[]>(
  faqsByPageQuery, 
  { pageLocation: 'your-page-name' }  // e.g., 'courses', 'checkout'
)

// 3. Pass to overlay and client components
<FAQOverlay faqs={faqs || []} />
<YourPageClient faqsData={faqs || []} />
```

### **Visual Editing Workflow**

1. Open products page via Studio "Presentation" tab
2. Scroll to FAQ section
3. Hover over questions/answers to see blue overlays
4. Click to edit directly in Studio
5. Changes reflect in real-time

## 🏗️ Architecture

### **Data Flow**
```
Sanity Studio (Edit FAQ)
  ↓
FAQ Schema (with page selector & SEO)
  ↓
GROQ Query (filter by page location)
  ↓
Server Component (app/products/page.tsx)
  ↓
├─→ FAQOverlay (Visual Editing)
└─→ ProductsPageClient (UI Rendering)
```

### **Multi-Page Architecture**
```
FAQ Document
├─ pageLocations: ['products', 'courses', 'home']
│
├─→ Products Page (fetches where pageLocation = 'products')
├─→ Courses Page (fetches where pageLocation = 'courses')
└─→ Home Page (fetches where pageLocation = 'home')
```

## 🔍 SEO Benefits

### **FAQ Schema.org Markup**
FAQs with `seo.includeInStructuredData = true` can generate:
- Rich snippets in Google search
- FAQ accordion in search results
- Increased click-through rates
- Better search visibility

### **Implementation Example**
```typescript
// Generate FAQ structured data
const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs
    .filter(faq => faq.seo?.includeInStructuredData)
    .map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
}
```

## 🎨 Customization Options

### **Adding New Page Locations**

Edit `schemas/documents/faq.ts`:
```typescript
options: {
  list: [
    // ... existing pages
    { title: 'Your New Page', value: 'new-page' },
  ],
}
```

### **Adding New Categories**

Edit the `category` field:
```typescript
options: {
  list: [
    // ... existing categories
    { title: 'New Category', value: 'new-category' },
  ],
}
```

### **Custom Ordering**

FAQs are ordered by:
1. `order` field (ascending)
2. Creation date (ascending)

Set lower `order` values for higher priority FAQs.

## ✨ Best Practices

1. ✅ **Keep questions concise** (under 200 characters)
2. ✅ **Provide detailed answers** with helpful information
3. ✅ **Use categories** for better organization
4. ✅ **Set display order** thoughtfully (most important first)
5. ✅ **Enable structured data** for SEO benefits
6. ✅ **Add relevant keywords** for search optimization
7. ✅ **Use clear language** appropriate for your audience
8. ✅ **Regular updates** - mark outdated FAQs as inactive
9. ✅ **Cross-page consistency** - same answer across all pages
10. ✅ **Test Visual Editing** after adding new FAQs

## 🚀 Integration Guide Compliance

This implementation follows all patterns from `SANITY_INTEGRATION_GUIDE.md`:

✅ **Server-First Rendering**: Data fetched in server component  
✅ **Client-Only UI**: Interactive UI in client component  
✅ **No Inline Defaults**: Content comes from Sanity  
✅ **Overlay Markers**: Hidden server component for Visual Editing  
✅ **Draft-Aware Fetching**: Draft mode support  
✅ **Conditional Rendering**: FAQ section hides when empty  
✅ **SEO Optimization**: Structured data support  
✅ **Proper Types**: Full TypeScript coverage  
✅ **Query Optimization**: Filtered by page location  
✅ **Content Management**: Easy to edit in Studio  

## 📊 Current Implementation Status

- ✅ FAQ schema created with all SEO fields
- ✅ Multi-page location selector
- ✅ Queries for fetching by page
- ✅ TypeScript types defined
- ✅ Visual Editing overlay component
- ✅ Integrated into products page
- ✅ Conditional rendering
- ✅ Draft mode support
- ✅ Schema registered in config
- ✅ Documentation complete

## 🎉 Result

You now have a powerful, reusable FAQ system that:
- Works across multiple pages
- Provides excellent SEO benefits
- Supports Visual Editing
- Offers centralized management
- Includes comprehensive content controls

Add FAQs to any page in minutes by following the integration pattern! 🚀
