# Sanity Integration for Lovable - Complete Implementation Guide

## Overview

This guide provides a complete implementation for integrating Sanity CMS with Lovable's visual editor. This allows you to preview and edit your website's UI while seeing real content from Sanity, making the design process more realistic and efficient.

## Table of Contents

1. [Current Sanity Setup Analysis](#current-sanity-setup-analysis)
2. [Implementation Strategy](#implementation-strategy)
3. [Required Files and Code](#required-files-and-code)
4. [Configuration Steps](#configuration-steps)
5. [Usage in Lovable](#usage-in-lovable)
6. [Troubleshooting](#troubleshooting)
7. [Migration Plan](#migration-plan)

## Current Sanity Setup Analysis

### Existing Architecture

Your current setup uses:
- **Client**: `sanity.client.light.ts` - Production client with caching and proxy support
- **Config**: `sanity.config.ts` - Environment-based configuration
- **Queries**: `sanity.queries.ts` - GROQ queries for content types
- **Transformers**: `sanity.transformers.ts` - Data transformation functions

### Data Flow for Product Pages

```
URL Parameter (slug) → Sanity Query → fetchFromSanity() → transformProductDetail() → Component State
```

### Required Data Structure

```typescript
interface ProductDetailData {
  id: string;
  handle: string;
  title: string;
  titleFa: string;
  description: string;
  descriptionFa: string;
  image: string;
  images: string[];
  price: number;
  originalPrice?: number;
  category: string;
  categoryFa: string;
  inStock: boolean;
  badge?: ProductBadge;
  badges: string[];
  variants: ProductVariant[];
  features: string[];
  featuresFa: string[];
  rating?: number;
  reviewCount?: number;
  relatedProducts: RelatedProductCardData[];
  relatedPosts: BlogCardPost[];
  seo?: SeoMeta;
}
```

## Implementation Strategy

### Goals

1. **Create a separate test module** with hardcoded credentials for Lovable
2. **Maintain production compatibility** - no changes to existing production code
3. **Enable real content preview** in Lovable editor
4. **Provide graceful fallbacks** when Sanity is unavailable
5. **Support hot reloading** for content changes

### Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Lovable UI    │────│  Test Client     │────│   Sanity CMS    │
│   Components    │    │  (Hardcoded      │    │   (Production)  │
│                 │    │   Credentials)   │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │   Mock Data      │
                       │   Fallback       │
                       └──────────────────┘
```

### Key Features

- **Hardcoded credentials** for testing (replace with your actual values)
- **Automatic fallback** to mock data when Sanity unavailable
- **Real-time content** loading in Lovable preview
- **Zero impact** on production deployment
- **Easy credential management** for different environments

## Required Files and Code

### 1. Test Configuration (`src/lib/sanity-test-config.ts`)

```typescript
// HARDCODED CREDENTIALS FOR TESTING - REPLACE WITH YOUR ACTUAL VALUES
export const TEST_SANITY_CONFIG = {
  projectId: 'zrvdkcjy', 
  dataset: 'production',            
  apiVersion: '2023-06-21',          
} as const;

// Test environment flag
export const IS_SANITY_TEST_MODE = true;

// Validation function for test mode
export function validateTestSanityConfig() {
  const { projectId } = TEST_SANITY_CONFIG;

  if (!projectId || projectId === 'your-project-id-here') {
    console.warn(
      '⚠️ Test Sanity configuration incomplete:\n' +
      'Please update projectId in sanity-test-config.ts with your actual Sanity project ID\n' +
      'You can find this in your Sanity project settings at https://sanity.io/manage'
    );
    return false;
  }

  return true;
}

// CORS configuration for Lovable
export const TEST_CORS_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://lovable.dev',
  'https://*.lovable.dev',
  'https://*.lovableproject.com',
];
```

### 2. Test Client (`src/lib/sanity-test-client.ts`)

```typescript
import { createClient } from '@sanity/client';
import { TEST_SANITY_CONFIG, validateTestSanityConfig, IS_SANITY_TEST_MODE } from './sanity-test-config';

let testClient: any = null;
let hasLoggedTestClient = false;

function createTestClient() {
  if (!validateTestSanityConfig()) {
    throw new Error('Test Sanity configuration is invalid. Please check sanity-test-config.ts');
  }

  if (!testClient) {
    testClient = createClient({
      projectId: TEST_SANITY_CONFIG.projectId,
      dataset: TEST_SANITY_CONFIG.dataset,
      apiVersion: TEST_SANITY_CONFIG.apiVersion,
      useCdn: false, // Always use fresh data for testing
      perspective: 'published',
      // Add timeout for better error handling
      timeout: 30000, // 30 seconds
    });
  }

  if (!hasLoggedTestClient) {
    console.info('[SANITY-TEST] 🧪 Using test client →', `${TEST_SANITY_CONFIG.projectId}.${TEST_SANITY_CONFIG.dataset}`);
    console.info('[SANITY-TEST] 📡 API Version:', TEST_SANITY_CONFIG.apiVersion);
    hasLoggedTestClient = true;
  }

  return testClient;
}

export async function fetchFromSanityTest<T>(query: string, params?: Record<string, any>): Promise<T | null> {
  if (!IS_SANITY_TEST_MODE) {
    console.warn('[SANITY-TEST] Test mode disabled');
    return null;
  }

  try {
    const client = createTestClient();
    console.info('[SANITY-TEST] 🔍 Executing query:', query.substring(0, 100) + '...');
    if (params && Object.keys(params).length > 0) {
      console.info('[SANITY-TEST] 📝 Parameters:', params);
    }

    const result = await client.fetch<T>(query, params);
    console.info('[SANITY-TEST] ✅ Query executed successfully, returned:', Array.isArray(result) ? `${result.length} items` : 'single item');
    return result;
  } catch (error: any) {
    console.error('[SANITY-TEST] ❌ Query failed:', error.message);

    // Provide helpful error messages
    if (error.message?.includes('projectId')) {
      console.error('[SANITY-TEST] 💡 Check your projectId in sanity-test-config.ts');
    } else if (error.message?.includes('CORS')) {
      console.error('[SANITY-TEST] 💡 CORS error - add your Lovable domain to Sanity CORS settings');
    }

    throw error; // Re-throw to allow fallback handling
  }
}

export { createTestClient as testClient };
```

### 3. Test Queries (`src/lib/sanity-test-queries.ts`)

```typescript
// Import existing queries for reuse
export {
  productBySlugQuery,
  faqsByPageQuery,
  homePageQuery,
  featuredProductsQuery,
  featuredCoursesQuery,
  featuredPostsQuery,
} from './sanity.queries';

// Test-specific queries and helpers
export const TEST_PRODUCT_SLUGS = [
  'chatgpt-plus',
  'instagram-account',
  'coursera-premium',
  // Add your actual product slugs here for testing
] as const;

// Query for multiple products by slugs (useful for testing)
export const TEST_PRODUCTS_BY_SLUGS_QUERY = `
  *[_type == "product" && slug.current in $slugs]{
    _id,
    name,
    description,
    image{
      ...,
      asset->
    },
    price,
    category,
    "slug": slug.current
  }
`;

// Simple product existence check
export const TEST_PRODUCT_EXISTS_QUERY = `
  *[_type == "product" && slug.current == $slug][0]{
    _id,
    "exists": true,
    "slug": slug.current
  }
`;

// Debug query to list all available products
export const TEST_ALL_PRODUCTS_QUERY = `
  *[_type == "product"] | order(_createdAt desc) [0...10]{
    _id,
    name,
    "slug": slug.current,
    _createdAt
  }
`;
```

### 4. Test Transformers (`src/lib/sanity-test-transformers.ts`)

```typescript
// Import existing transformers
export {
  transformProductDetail,
  transformFaqItem,
  transformProductListItem,
  transformBlogPost,
} from './sanity.transformers';

// Test-specific transformation helpers
export function createTestProductData(slug: string): any {
  // Return comprehensive mock data for testing when Sanity is not available
  const productTitles: Record<string, { en: string; fa: string }> = {
    'chatgpt-plus': {
      en: 'ChatGPT Plus Subscription',
      fa: 'اشتراک ChatGPT Plus'
    },
    'instagram-account': {
      en: 'Instagram Business Account',
      fa: 'اکانت تجاری اینستاگرام'
    },
    'coursera-premium': {
      en: 'Coursera Premium Access',
      fa: 'دسترسی پرمیوم کورسرا'
    },
  };

  const titleData = productTitles[slug] || {
    en: `Test Product: ${slug}`,
    fa: `محصول آزمایشی: ${slug}`
  };

  return {
    id: `test-${slug}`,
    handle: slug,
    title: titleData.en,
    titleFa: titleData.fa,
    description: `This is a comprehensive test description for ${titleData.en}. It includes detailed information about features, benefits, and usage instructions.`,
    descriptionFa: `این یک توضیحات جامع آزمایشی برای ${titleData.fa} است. شامل اطلاعات دقیق درباره ویژگی‌ها، مزایا و دستورالعمل‌های استفاده می‌شود.`,
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&auto=format&fit=crop&q=80',
    ],
    price: 150000, // 150k Tomans
    originalPrice: 200000, // 200k Tomans (for discount display)
    category: 'digital-services',
    categoryFa: 'خدمات دیجیتال',
    inStock: true,
    badge: 'hot',
    badges: ['hot', 'featured'],
    variants: [
      {
        id: 'monthly',
        name: 'Monthly Plan',
        nameFa: 'پلن ماهانه',
        price: 150000,
        inStock: true,
      },
      {
        id: 'yearly',
        name: 'Yearly Plan',
        nameFa: 'پلن سالانه',
        price: 1500000,
        inStock: true,
      }
    ],
    features: [
      'Premium features included',
      '24/7 customer support',
      'Regular updates',
      'Secure payment',
    ],
    featuresFa: [
      'شامل ویژگی‌های پرمیوم',
      'پشتیبانی ۲۴ ساعته',
      'به‌روزرسانی‌های منظم',
      'پرداخت امن',
    ],
    rating: 4.8,
    reviewCount: 256,
    relatedProducts: [
      {
        id: 'related-1',
        title: 'Related Product 1',
        image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&auto=format&fit=crop',
        price: 100000,
        slug: 'related-product-1',
      }
    ],
    relatedPosts: [
      {
        _id: 'post-1',
        slug: 'blog-post-1',
        title: 'How to Use This Product',
        excerpt: 'A comprehensive guide to getting started...',
        image: { asset: { url: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&auto=format&fit=crop' } },
        category: 'tutorials',
        publishedAt: new Date().toISOString(),
        readTime: 5,
      }
    ],
    seo: {
      metaTitle: titleData.en,
      metaDescription: `Get access to ${titleData.en} with premium features and support.`,
      canonicalUrl: `https://yourwebsite.com/products/${slug}`,
      robotsMeta: 'index,follow',
      openGraphTitle: titleData.en,
      openGraphDescription: `Premium ${titleData.en} with all features included.`,
      openGraphImage: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&auto=format&fit=crop',
    }
  };
}

export async function fetchTestProduct(slug: string) {
  console.info('[SANITY-TEST] 🎯 Attempting to fetch product:', slug);

  // Try to fetch from Sanity first
  try {
    const { fetchFromSanityTest } = await import('./sanity-test-client');
    const { productBySlugQuery } = await import('./sanity-test-queries');
    const { transformProductDetail } = await import('./sanity-test-transformers');

    const result = await fetchFromSanityTest(productBySlugQuery, { slug });

    if (result) {
      console.info('[SANITY-TEST] ✅ Real data loaded from Sanity for:', slug);
      return transformProductDetail(result);
    }
  } catch (error) {
    console.warn('[SANITY-TEST] ⚠️ Sanity fetch failed, falling back to mock data:', error);
  }

  // Fallback to mock data
  console.info('[SANITY-TEST] 🤖 Using mock data for:', slug);
  return createTestProductData(slug);
}

// Helper to test Sanity connection
export async function testSanityConnection() {
  try {
    const { fetchFromSanityTest } = await import('./sanity-test-client');
    const { TEST_ALL_PRODUCTS_QUERY } = await import('./sanity-test-queries');

    const result = await fetchFromSanityTest(TEST_ALL_PRODUCTS_QUERY);
    return {
      success: true,
      data: result,
      message: `Successfully connected. Found ${Array.isArray(result) ? result.length : 0} products.`
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      message: 'Connection failed. Check your configuration.'
    };
  }
}
```

### 5. Test Hook (`src/hooks/use-test-product.ts`)

```typescript
import { useState, useEffect, useCallback } from 'react';
import { createTestProductData } from '@/lib/sanity-test-transformers';

interface UseTestProductResult {
  product: any | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  isUsingMockData: boolean;
}

export function useTestProduct(slug: string | undefined): UseTestProductResult {
  const [product, setProduct] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  const loadProduct = useCallback(async () => {
    if (!slug) {
      setError('شناسه محصول معتبر نیست');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Try to fetch from Sanity first
      try {
        const { fetchFromSanityTest } = await import('@/lib/sanity-test-client');
        const { productBySlugQuery } = await import('@/lib/sanity-test-queries');
        const { transformProductDetail } = await import('@/lib/sanity-test-transformers');

        console.info('[USE-TEST-PRODUCT] 🔍 Fetching from Sanity:', slug);
        const result = await fetchFromSanityTest(productBySlugQuery, { slug });

        if (result) {
          console.info('[USE-TEST-PRODUCT] ✅ Loaded real data from Sanity');
          setProduct(transformProductDetail(result));
          setIsUsingMockData(false);
          return;
        }
      } catch (sanityError) {
        console.warn('[USE-TEST-PRODUCT] ⚠️ Sanity fetch failed:', sanityError);
      }

      // Fallback to mock data
      console.info('[USE-TEST-PRODUCT] 🤖 Using mock data for:', slug);
      const mockProduct = createTestProductData(slug);
      setProduct(mockProduct);
      setIsUsingMockData(true);

    } catch (err: any) {
      console.error('[USE-TEST-PRODUCT] ❌ Failed to load product:', err);
      setError(err.message || 'خطا در بارگذاری اطلاعات محصول');
      setIsUsingMockData(true);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const refetch = useCallback(() => {
    loadProduct();
  }, [loadProduct]);

  return {
    product,
    isLoading,
    error,
    refetch,
    isUsingMockData,
  };
}
```

### 6. Test Hook for Multiple Products (`src/hooks/use-test-products.ts`)

```typescript
import { useState, useEffect, useCallback } from 'react';

interface UseTestProductsResult {
  products: any[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  isUsingMockData: boolean;
}

export function useTestProducts(limit: number = 8): UseTestProductsResult {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  const loadProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Try to fetch from Sanity first
      try {
        const { fetchFromSanityTest } = await import('@/lib/sanity-test-client');
        const { featuredProductsQuery } = await import('@/lib/sanity-test-queries');
        const { transformProductListItem } = await import('@/lib/sanity-test-transformers');

        console.info('[USE-TEST-PRODUCTS] 🔍 Fetching products from Sanity');
        const result = await fetchFromSanityTest(featuredProductsQuery);

        if (result && Array.isArray(result)) {
          const transformed = result.slice(0, limit).map((product: any, index: number) =>
            transformProductListItem(product, index)
          );
          console.info('[USE-TEST-PRODUCTS] ✅ Loaded real data from Sanity:', transformed.length, 'products');
          setProducts(transformed);
          setIsUsingMockData(false);
          return;
        }
      } catch (sanityError) {
        console.warn('[USE-TEST-PRODUCTS] ⚠️ Sanity fetch failed:', sanityError);
      }

      // Fallback to mock data
      console.info('[USE-TEST-PRODUCTS] 🤖 Generating mock products');
      const mockProducts = Array.from({ length: limit }, (_, index) => ({
        id: `mock-${index}`,
        title: `Mock Product ${index + 1}`,
        image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&auto=format&fit=crop',
        price: Math.floor(Math.random() * 500000) + 50000,
        oldPrice: Math.random() > 0.5 ? Math.floor(Math.random() * 800000) + 100000 : undefined,
        discountPct: Math.random() > 0.5 ? Math.floor(Math.random() * 50) + 10 : undefined,
        category: 'mock',
        slug: `mock-product-${index + 1}`,
        badges: Math.random() > 0.7 ? ['new'] : [],
      }));

      setProducts(mockProducts);
      setIsUsingMockData(true);

    } catch (err: any) {
      console.error('[USE-TEST-PRODUCTS] ❌ Failed to load products:', err);
      setError(err.message || 'خطا در بارگذاری محصولات');
      setIsUsingMockData(true);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const refetch = useCallback(() => {
    loadProducts();
  }, [loadProducts]);

  return {
    products,
    isLoading,
    error,
    refetch,
    isUsingMockData,
  };
}
```

### 7. Updated ProductDetail Component (`src/pages/ProductDetail.tsx`)

```typescript
// ... existing imports ...

// Replace the sanity imports with test imports
// import { fetchFromSanity } from "@/lib/sanity.client.light";
// import { validateSanityConfig } from "@/lib/sanity.config";
// import { productBySlugQuery, faqsByPageQuery } from "@/lib/sanity.queries";
// import { transformProductDetail, transformFaqItem } from "@/lib/sanity.transformers";

// New test imports
import { useTestProduct } from "@/hooks/use-test-product";

// ... existing component code ...

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isRTL } = useDirection();

  // Replace direct sanity calls with test hook
  const { product, isLoading, error, isUsingMockData } = useTestProduct(slug);

  // Add debug indicator for Lovable
  useEffect(() => {
    if (isUsingMockData) {
      console.info('[PRODUCT-DETAIL] 📊 Using mock data - configure Sanity credentials for real content');
    } else {
      console.info('[PRODUCT-DETAIL] ✅ Using real Sanity data');
    }
  }, [isUsingMockData]);

  // ... rest of component remains the same, but remove the old sanity loading logic ...

  // Remove this old logic:
  // useEffect(() => {
  //   const configValid = validateSanityConfig();
  //   if (!slug) {
  //     setError("شناسه محصول معتبر نیست");
  //     setIsLoading(false);
  //     return;
  //   }
  //   // ... rest of old sanity loading logic ...
  // }, [slug]);

  // Remove this old logic:
  // useEffect(() => {
  //   let isMounted = true;
  //   async function loadProduct() {
  //     // ... old sanity loading logic ...
  //   }
  //   loadProduct();
  //   return () => {
  //     isMounted = false;
  //   };
  // }, [slug]);

  // ... rest of component remains the same ...
```

## Configuration Steps

### Step 1: Get Your Sanity Credentials

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Select your project
3. Go to "API" tab
4. Copy your Project ID
5. Note your dataset name (usually "production")

### Step 2: Configure CORS in Sanity

1. In your Sanity project settings, go to "API" → "CORS origins"
2. Add these origins:
   - `http://localhost:3000` (for local development)
   - `http://localhost:5173` (for Vite dev server)
   - `https://lovable.dev`
   - `https://*.lovable.dev`
   - `https://*.lovableproject.com`

### Step 3: Update Test Configuration

In `src/lib/sanity-test-config.ts`, replace:
```typescript
export const TEST_SANITY_CONFIG = {
  projectId: 'your-project-id-here', // ← Replace with your actual project ID
  dataset: 'production',
  apiVersion: '2023-06-21',
};
```

### Step 4: Create Environment Variables (Optional)

Create a `.env.local` file in your project root:
```bash
# Sanity Test Configuration
VITE_SANITY_TEST_PROJECT_ID=your-project-id-here
VITE_SANITY_TEST_DATASET=production
VITE_SANITY_TEST_API_VERSION=2023-06-21
```

## Usage in Lovable

### Basic Product Loading

```typescript
// In any Lovable component
import { useTestProduct } from '@/hooks/use-test-product';

function ProductPreview({ slug }: { slug: string }) {
  const { product, isLoading, error, isUsingMockData } = useTestProduct(slug);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {isUsingMockData && <div style={{ background: 'yellow', padding: '8px' }}>⚠️ Using Mock Data</div>}
      <h1>{product?.title}</h1>
      <p>{product?.description}</p>
      <img src={product?.image} alt={product?.title} />
    </div>
  );
}
```

### Multiple Products Loading

```typescript
// For product grids
import { useTestProducts } from '@/hooks/use-test-products';

function ProductGrid() {
  const { products, isLoading, error, isUsingMockData } = useTestProducts(8);

  if (isLoading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {isUsingMockData && <div style={{ background: 'yellow', padding: '8px' }}>⚠️ Using Mock Data</div>}
      <div className="grid grid-cols-4 gap-4">
        {products.map(product => (
          <div key={product.id}>
            <img src={product.image} alt={product.title} />
            <h3>{product.title}</h3>
            <p>{product.price} تومان</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Testing Sanity Connection

```typescript
// Test if your Sanity credentials work
import { testSanityConnection } from '@/lib/sanity-test-transformers';

async function testConnection() {
  const result = await testSanityConnection();
  console.log(result);
  // { success: true, data: [...], message: "Successfully connected..." }
  // or { success: false, error: "...", message: "Connection failed..." }
}
```

## Troubleshooting

### Common Issues

#### 1. "Project ID not configured"
```
Error: Test Sanity configuration is invalid. Please check sanity-test-config.ts
```
**Solution**: Update `projectId` in `src/lib/sanity-test-config.ts` with your actual Sanity project ID.

#### 2. CORS Error
```
Access to fetch ... has been blocked by CORS policy
```
**Solution**: Add your Lovable domain to Sanity CORS settings (see Configuration Steps).

#### 3. "Using mock data" message always appears
**Solution**: Check that:
- Project ID is correct
- Dataset name matches your Sanity project
- CORS is configured
- You're not behind a firewall blocking Sanity

#### 4. Slow loading in Lovable
**Solution**: The test client doesn't use CDN for fresh data. This is normal for testing.

### Debug Commands

```typescript
// Check if Sanity connection works
import { testSanityConnection } from '@/lib/sanity-test-transformers';
const result = await testSanityConnection();
console.log(result);

// Check what products exist in your Sanity project
import { fetchFromSanityTest } from '@/lib/sanity-test-client';
import { TEST_ALL_PRODUCTS_QUERY } from '@/lib/sanity-test-queries';
const products = await fetchFromSanityTest(TEST_ALL_PRODUCTS_QUERY);
console.log('Available products:', products);
```

### Performance Tips

1. **Use mock data for UI design**: When designing UI, you can work with mock data
2. **Test with real data periodically**: Switch to real data to ensure your UI works with actual content
3. **Limit queries**: Don't fetch all products at once - use pagination
4. **Cache images**: Use Sanity's image optimization features

## Migration Plan

### Phase 1: Setup (1-2 hours)
1. Create all test files as described above
2. Configure your Sanity credentials
3. Test connection with `testSanityConnection()`

### Phase 2: Component Updates (2-4 hours)
1. Update ProductDetail component to use `useTestProduct`
2. Update any other components that fetch products
3. Test in Lovable with both mock and real data

### Phase 3: Production Safety (1 hour)
1. Ensure production code is unchanged
2. Add feature flags to disable test mode in production
3. Document the differences between test and production code

### Phase 4: Optimization (1-2 hours)
1. Add error boundaries
2. Implement loading states
3. Add retry logic for failed requests
4. Optimize image loading

## Benefits

✅ **Real Content in Lovable**: See actual product data while designing UI
✅ **Graceful Fallbacks**: Mock data when Sanity is unavailable
✅ **Zero Production Impact**: Test code doesn't affect production builds
✅ **Easy Configuration**: Simple credential setup
✅ **Developer Experience**: Better debugging and error messages
✅ **Performance**: Optimized for design/development workflow

## Security Notes

- **Never commit real credentials** to version control
- **Use environment variables** for sensitive data
- **Test credentials only** - not production keys
- **Regular rotation** of test credentials recommended

## Support

If you encounter issues:
1. Check the browser console for detailed error messages
2. Use `testSanityConnection()` to verify your setup
3. Ensure CORS is configured in Sanity
4. Check that your project ID and dataset are correct

---

**Implementation Checklist:**
- [ ] Create all 7 required files
- [ ] Update Sanity credentials in `sanity-test-config.ts`
- [ ] Configure CORS in Sanity dashboard
- [ ] Test connection with `testSanityConnection()`
- [ ] Update ProductDetail component
- [ ] Test in Lovable with real content
- [ ] Verify fallback to mock data works
- [ ] Deploy to production (test code won't affect production)
