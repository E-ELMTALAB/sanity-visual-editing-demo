# Products Dropdown Architecture

## Component Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                         Header (page.tsx)                        │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              Navigation Menu                                │ │
│  │  [محصولات] [دوره‌ها] [فروش سازمانی] [بلاگ]              │ │
│  │      ↓ (hover)                                             │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │        ProductsDropdown Component                    │  │ │
│  │  │  ┌───────────┬───────────┬───────────┐              │  │ │
│  │  │  │  Category │ Category  │ Category  │              │  │ │
│  │  │  │    AI     │  Social   │   Music   │              │  │ │
│  │  │  │  ───────  │  ────────  │  ──────   │              │  │ │
│  │  │  │ Product 1 │ Product 1 │ Product 1 │              │  │ │
│  │  │  │ Product 2 │ Product 2 │ Product 2 │              │  │ │
│  │  │  │ Product 3 │ Product 3 │ Product 3 │              │  │ │
│  │  │  │ Product 4 │ Product 4 │ Product 4 │              │  │ │
│  │  │  │ View All→ │ View All→ │ View All→ │              │  │ │
│  │  │  └───────────┴───────────┴───────────┘              │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  1. User hovers over "محصولات" menu item                        │
└────────────────────────────┬────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│  2. ProductsDropdown component mounts                            │
│     - isOpen prop = true                                         │
└────────────────────────────┬────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│  3. useEffect hook triggers                                      │
│     - Calls fetchProducts() async function                       │
└────────────────────────────┬────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│  4. Sanity Client Request                                        │
│     getClient().fetch(productsListQuery)                         │
└────────────────────────────┬────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│  5. GROQ Query Execution                                         │
│     *[_type == "product"] | order(_createdAt desc)               │
└────────────────────────────┬────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│  6. Client-side Filtering                                        │
│     - Filter by: ai, social-media, music, educational, sim-card  │
│     - Limit: 4 products per category                             │
└────────────────────────────┬────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│  7. State Update                                                 │
│     setProducts(productsByCategory)                              │
│     setLoading(false)                                            │
└────────────────────────────┬────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│  8. Render Products                                              │
│     - Display products grouped by category                       │
│     - Show icons, names, and links                               │
└─────────────────────────────────────────────────────────────────┘
```

## File Dependencies

```
sharifgpt-website/
├── app/
│   ├── page.tsx ──────────────────┐
│   └── products/                  │
│       └── page.tsx ───────────┐  │
│                                │  │
│                          (imports)│
│                                │  │
├── components/                  ↓  ↓
│   └── ProductsDropdown.tsx ◄──┴──┘
│         │
│         │ (imports)
│         ↓
├── lib/
│   ├── sanity.queries.ts ◄──────┐
│   ├── sanity.client.ts ◄────┐  │
│   └── sanity.api.ts ◄───┐   │  │
│                          │   │  │
│                     (uses configs)
│                          │   │  │
└── .env.local ────────────┴───┴──┘
    (Environment Variables)
```

## Component Lifecycle

```
Mount Phase:
├─ 1. Component renders with loading = true
├─ 2. Shows loading spinner
├─ 3. useEffect hook runs
└─ 4. Fetches products from Sanity

Update Phase:
├─ 5. Receives product data
├─ 6. Filters by categories
├─ 7. Updates state (products, loading)
└─ 8. Re-renders with product list

Hover States:
├─ group-hover: Dropdown visibility
├─ hover:text-[#3092BE]: Link color
└─ hover:bg-gray-50: Background highlight
```

## Category Configuration

```typescript
Categories Array:
['ai', 'social-media', 'music', 'educational', 'sim-card']
        ↓
Category Mapping Functions:
├─ getCategoryIcon() ───→ SVG Icons
├─ getCategoryTitle() ──→ Persian Names
├─ getCategoryBgColor() ─→ Tailwind Classes
└─ Per Product:
   ├─ getProductIcon() ──→ Emoji Icons
   └─ getProductIconBg() ─→ Color Classes
```

## State Management

```
Component State:
┌──────────────────────────────────────────┐
│  products: Record<string, Product[]>     │
│  {                                        │
│    'ai': [Product, Product, ...],        │
│    'social-media': [Product, ...],       │
│    'music': [...],                        │
│    ...                                    │
│  }                                        │
└──────────────────────────────────────────┘
┌──────────────────────────────────────────┐
│  loading: boolean                         │
│  - true: Show loading spinner             │
│  - false: Show products or empty state    │
└──────────────────────────────────────────┘
```

## Styling Architecture

```
Dropdown Container:
├─ Position: absolute top-full right-0
├─ Width: 800px (fixed)
├─ Visibility: opacity-0 invisible → group-hover:opacity-100 visible
└─ Transition: all duration-300

Grid Layout:
├─ Display: grid grid-cols-3
├─ Gap: gap-8
└─ Padding: p-8

Category Headers:
├─ Icon Container: w-8 h-8 rounded-lg (color-coded)
├─ Title: text-lg font-bold
└─ Spacing: mb-6

Product Links:
├─ Layout: flex items-center
├─ Hover: text-[#3092BE] bg-gray-50
├─ Transition: transition-colors
└─ Padding: py-2 px-3
```

## Environment Variables Required

```
NEXT_PUBLIC_SANITY_PROJECT_ID=xxxxxxxxxxxxx
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-06-21 (optional)
SANITY_API_READ_TOKEN=skxxxxxxxxx (optional)
NEXT_PUBLIC_SANITY_VISUAL_EDITING=true (optional)
```

## Product Schema in Sanity

```typescript
Product Document:
{
  _id: string              // Unique identifier
  _type: 'product'         // Document type
  name: string             // Product name (displayed)
  slug: {                  // URL-friendly identifier
    current: string
  }
  category: string         // Must be one of 5 categories
  price: number           // Current price
  originalPrice?: number  // Optional original price
  discountPercentage?: number // Optional discount
  image?: ImageAsset      // Optional product image
  badges?: string[]       // Optional badges
  inStock: boolean        // Availability
  rating?: number         // User rating
  reviewCount?: number    // Number of reviews
  features?: string[]     // Product features
  tags?: string[]         // Search tags
  seo?: object           // SEO metadata
}
```

## Error Handling

```
Try-Catch Block:
┌────────────────────────────────────────┐
│  try {                                 │
│    ├─ Fetch products from Sanity       │
│    ├─ Filter by categories             │
│    └─ Update state                     │
│  }                                     │
│  catch (error) {                       │
│    ├─ Log error to console             │
│    └─ Leave products as empty {}       │
│  }                                     │
│  finally {                             │
│    └─ setLoading(false)                │
│  }                                     │
└────────────────────────────────────────┘

Empty State:
┌────────────────────────────────────────┐
│  if (Object.keys(products).length === 0) │
│    └─ Show "محصولاتی یافت نشد"         │
└────────────────────────────────────────┘
```

## Performance Optimization Opportunities

```
Current Implementation:
- Fetch all products
- Filter client-side
- No caching

Future Improvements:
1. Server-side filtering
   ├─ Create category-specific queries
   └─ Reduce data transfer

2. Implement caching
   ├─ React Query / SWR
   └─ Reduce Sanity API calls

3. Lazy loading
   ├─ Load on first hover
   └─ Cache for subsequent hovers

4. Pagination
   ├─ Show more products on demand
   └─ Reduce initial load time
```

---

**This architecture ensures:**
- ✅ Scalable component design
- ✅ Clean separation of concerns
- ✅ Maintainable code structure
- ✅ Type-safe implementation
- ✅ Responsive and performant UI
