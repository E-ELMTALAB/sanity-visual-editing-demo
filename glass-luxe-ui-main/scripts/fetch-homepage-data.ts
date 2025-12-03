/**
 * Build-time script to fetch homepage data from Sanity API
 * This runs before vite build to cache all homepage content locally
 */

import { createClient } from '@sanity/client';
import { writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  homePageQuery,
  featuredProductsQuery,
  featuredCoursesQuery,
  featuredPostsQuery,
  productsByCategoryQuery,
  faqsByPageQuery,
  allProductsQuery,
  productBySlugQuery,
  allPostsQuery,
  postBySlugQuery,
  allCollectionsQuery,
  collectionBySlugQuery,
} from '../src/lib/sanity.queries';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get Sanity config from environment variables
const projectId = process.env.VITE_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
const dataset = process.env.VITE_SANITY_DATASET || process.env.SANITY_DATASET || 'production';
const apiVersion = process.env.VITE_SANITY_API_VERSION || process.env.SANITY_API_VERSION || '2023-06-21';

// Category map matching Index.tsx
const categoryMap: Record<string, string> = {
  ai: 'ai',
  social: 'social-media',
  music: 'music',
  edu: 'education',
  sim: 'sim-card',
};

// Cache directory
const CACHE_DIR = join(__dirname, '../src/data/sanity-cache');

async function ensureCacheDir() {
  try {
    await mkdir(CACHE_DIR, { recursive: true });
    console.log(`✅ Cache directory ready: ${CACHE_DIR}`);
  } catch (error) {
    console.error('❌ Failed to create cache directory:', error);
    throw error;
  }
}

async function saveToCache(filename: string, data: any) {
  const filePath = join(CACHE_DIR, filename);
  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`💾 Saved: ${filename}`);
}

async function fetchHomepageData() {
  if (!projectId || projectId === 'placeholder') {
    console.warn('⚠️  Sanity project ID not configured. Skipping data fetch.');
    console.warn('   Set VITE_SANITY_PROJECT_ID or SANITY_PROJECT_ID environment variable.');
    return;
  }

  console.log('🚀 Starting homepage data fetch from Sanity...');
  console.log(`📦 Project: ${projectId}, Dataset: ${dataset}, API Version: ${apiVersion}`);

  // Create Sanity client
  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
    perspective: 'published',
  });

  try {
    await ensureCacheDir();

    // Fetch all homepage queries
    console.log('\n📥 Fetching homepage data...');
    const homeData = await client.fetch(homePageQuery);

    // Log detailed homepage structure
    if (!homeData) {
      console.warn('⚠️ homePageQuery returned null/undefined');
    } else {
      console.log('📊 Homepage data overview:');
      console.log('   - heroSlides:', Array.isArray(homeData.heroSlides) ? homeData.heroSlides.length : 0);
      console.log('   - bestSellerProducts:', Array.isArray(homeData.bestSellerProducts) ? homeData.bestSellerProducts.length : 0);
      console.log('   - editorialBanners:', Array.isArray(homeData.editorialBanners) ? homeData.editorialBanners.length : 0);
      console.log('   - collectionsBanner:', homeData.collectionsBanner ? 'present' : 'missing');
      console.log('   - discountedProducts:', Array.isArray(homeData.discountedProducts) ? homeData.discountedProducts.length : 0);
      console.log('   - socialMediaProducts:', Array.isArray(homeData.socialMediaProducts) ? homeData.socialMediaProducts.length : 0);
      console.log('   - educationalProducts:', Array.isArray(homeData.educationalProducts) ? homeData.educationalProducts.length : 0);
      console.log('   - bestsellingCourses:', Array.isArray(homeData.bestsellingCourses) ? homeData.bestsellingCourses.length : 0);
      console.log('   - magazinePosts:', Array.isArray(homeData.magazinePosts) ? homeData.magazinePosts.length : 0);
      console.log('   - featuredBlogs:', Array.isArray(homeData.featuredBlogs) ? homeData.featuredBlogs.length : 0);
      console.log('   - seoContent:', typeof homeData.seoContent === 'string' && homeData.seoContent.trim().length > 0 ? 'present' : 'empty');

      // Log a few sample items for debugging (without dumping everything)
      if (Array.isArray(homeData.bestSellerProducts) && homeData.bestSellerProducts.length > 0) {
        const sample = homeData.bestSellerProducts.slice(0, 3).map((p: any) => ({
          _id: p?._id,
          name: p?.name,
          slug: typeof p?.slug === 'string' ? p.slug : p?.slug?.current,
          category: p?.category,
        }));
        console.log('   - Sample bestSellerProducts:', sample);
      }

      if (Array.isArray(homeData.socialMediaProducts) && homeData.socialMediaProducts.length > 0) {
        const sample = homeData.socialMediaProducts.slice(0, 3).map((p: any) => ({
          _id: p?._id,
          name: p?.name,
          slug: typeof p?.slug === 'string' ? p.slug : p?.slug?.current,
          category: p?.category,
        }));
        console.log('   - Sample socialMediaProducts:', sample);
      }

      if (Array.isArray(homeData.magazinePosts) && homeData.magazinePosts.length > 0) {
        const sample = homeData.magazinePosts.slice(0, 3).map((p: any) => ({
          _id: p?._id,
          title: p?.title,
          slug: typeof p?.slug === 'string' ? p.slug : p?.slug?.current,
          category: p?.category,
        }));
        console.log('   - Sample magazinePosts:', sample);
      }
    }

    await saveToCache('homepage.json', homeData);

    console.log('\n📥 Fetching featured products...');
    const featuredProducts = await client.fetch(featuredProductsQuery);
    console.log(`📊 featuredProducts count: ${featuredProducts?.length || 0}`);
    if (Array.isArray(featuredProducts) && featuredProducts.length > 0) {
      const sample = featuredProducts.slice(0, 5).map((p: any) => ({
        _id: p?._id,
        name: p?.name,
        slug: typeof p?.slug === 'string' ? p.slug : p?.slug?.current,
        category: p?.category,
      }));
      console.log('   - Sample featuredProducts:', sample);
    }
    await saveToCache('featured-products.json', featuredProducts);

    console.log('\n📥 Fetching featured courses...');
    const featuredCourses = await client.fetch(featuredCoursesQuery);
    console.log(`📊 featuredCourses count: ${featuredCourses?.length || 0}`);
    if (Array.isArray(featuredCourses) && featuredCourses.length > 0) {
      const sample = featuredCourses.slice(0, 3).map((c: any) => ({
        _id: c?._id,
        title: c?.title,
        slug: typeof c?.slug === 'string' ? c.slug : c?.slug?.current,
        category: c?.category,
        level: c?.level,
      }));
      console.log('   - Sample featuredCourses:', sample);
    }
    await saveToCache('featured-courses.json', featuredCourses);

    console.log('\n📥 Fetching featured posts...');
    const featuredPosts = await client.fetch(featuredPostsQuery);
    console.log(`📊 featuredPosts count: ${featuredPosts?.length || 0}`);
    if (Array.isArray(featuredPosts) && featuredPosts.length > 0) {
      const sample = featuredPosts.slice(0, 3).map((p: any) => ({
        _id: p?._id,
        title: p?.title,
        slug: typeof p?.slug === 'string' ? p.slug : p?.slug?.current,
        category: p?.category,
      }));
      console.log('   - Sample featuredPosts:', sample);
    }
    await saveToCache('featured-posts.json', featuredPosts);

    console.log('\n📥 Fetching products by category...');
    const categoryProductsMap: Record<string, any[]> = {};
    for (const [key, category] of Object.entries(categoryMap)) {
      try {
        console.log(`   Fetching category: ${key} (${category})...`);
        const products = await client.fetch(productsByCategoryQuery, { category });
        categoryProductsMap[key] = products;
        await saveToCache(`products-category-${key}.json`, products);
        const count = products?.length || 0;
        console.log(`   ✅ ${key}: ${count} products`);
        if (Array.isArray(products) && products.length > 0) {
          const sample = products.slice(0, 3).map((p: any) => ({
            _id: p?._id,
            name: p?.name,
            slug: typeof p?.slug === 'string' ? p.slug : p?.slug?.current,
            category: p?.category,
          }));
          console.log(`     - Sample ${key} products:`, sample);
        }
      } catch (error) {
        console.error(`   ❌ Error fetching category ${key}:`, error);
        categoryProductsMap[key] = [];
        await saveToCache(`products-category-${key}.json`, []);
      }
    }

    // Save combined category products map
    await saveToCache('category-products-map.json', categoryProductsMap);

    console.log('\n📥 Fetching FAQs...');
    const faqs = await client.fetch(faqsByPageQuery, { page: 'home' });
    console.log(`📊 FAQs count: ${faqs?.length || 0}`);
    if (Array.isArray(faqs) && faqs.length > 0) {
      const sample = faqs.slice(0, 3).map((f: any) => ({
        _id: f?._id,
        question: f?.question,
        category: f?.category,
      }));
      console.log('   - Sample FAQs:', sample);
    }
    await saveToCache('faqs-home.json', faqs);

    // Fetch all products (used for both listing page and to get slugs for detail pages)
    console.log('\n📥 Fetching all products...');
    const allProductsList = await client.fetch(allProductsQuery);
    console.log(`📊 All products count: ${allProductsList?.length || 0}`);
    if (Array.isArray(allProductsList) && allProductsList.length > 0) {
      const sample = allProductsList.slice(0, 5).map((p: any) => ({
        _id: p?._id,
        name: p?.name,
        slug: typeof p?.slug === 'string' ? p.slug : p?.slug?.current,
        category: p?.category,
      }));
      console.log('   - Sample products:', sample);
    }
    await saveToCache('all-products-list.json', allProductsList);

    // Fetch full detail for each product (for detail pages)
    console.log('\n📥 Fetching full details for product detail pages...');
    const productsMap: Record<string, any> = {};
    const productSlugs = allProductsList?.map((p: any) => p.slug).filter(Boolean) || [];

    console.log(`📦 Fetching full details for ${productSlugs.length} products...`);
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < productSlugs.length; i++) {
      const slug = productSlugs[i];
      try {
        const productDetail = await client.fetch(productBySlugQuery, { slug });
        if (productDetail) {
          productsMap[slug] = productDetail;
          successCount++;
        } else {
          console.warn(`   ⚠️ Product "${slug}" returned null/undefined`);
          errorCount++;
        }
        
        // Log progress every 10 products
        if ((i + 1) % 10 === 0 || i === productSlugs.length - 1) {
          console.log(`   Progress: ${i + 1}/${productSlugs.length} products fetched (${successCount} success, ${errorCount} errors)`);
        }
      } catch (error) {
        console.error(`   ❌ Error fetching product "${slug}":`, error);
        errorCount++;
      }
    }

    await saveToCache('products-map.json', productsMap);
    console.log(`💾 Saved ${Object.keys(productsMap).length} products to cache`);
    if (errorCount > 0) {
      console.warn(`⚠️ ${errorCount} products failed to fetch`);
    }

    // Fetch product FAQs
    console.log('\n📥 Fetching product FAQs...');
    const productFaqs = await client.fetch(faqsByPageQuery, { page: 'products' });
    console.log(`📊 Product FAQs count: ${productFaqs?.length || 0}`);
    if (Array.isArray(productFaqs) && productFaqs.length > 0) {
      const sample = productFaqs.slice(0, 3).map((f: any) => ({
        _id: f?._id,
        question: f?.question,
        category: f?.category,
      }));
      console.log('   - Sample product FAQs:', sample);
    }
    await saveToCache('products-faqs.json', productFaqs);

    // Fetch all blog posts for listing page
    console.log('\n📥 Fetching all blog posts for listing page...');
    const allPostsList = await client.fetch(allPostsQuery);
    console.log(`📊 All posts count: ${allPostsList?.length || 0}`);
    if (Array.isArray(allPostsList) && allPostsList.length > 0) {
      const sample = allPostsList.slice(0, 5).map((p: any) => ({
        _id: p?._id,
        title: p?.title,
        slug: typeof p?.slug === 'string' ? p.slug : p?.slug?.current,
        category: p?.category,
      }));
      console.log('   - Sample posts:', sample);
    }
    await saveToCache('all-posts-list.json', allPostsList);

    // Fetch full detail for each blog post (for detail pages)
    console.log('\n📥 Fetching full details for blog post detail pages...');
    const postsMap: Record<string, any> = {};
    const postSlugs = allPostsList?.map((p: any) => p.slug).filter(Boolean) || [];

    console.log(`📦 Fetching full details for ${postSlugs.length} blog posts...`);
    let postSuccessCount = 0;
    let postErrorCount = 0;

    for (let i = 0; i < postSlugs.length; i++) {
      const slug = postSlugs[i];
      try {
        const postDetail = await client.fetch(postBySlugQuery, { slug });
        if (postDetail) {
          postsMap[slug] = postDetail;
          postSuccessCount++;
        } else {
          console.warn(`   ⚠️ Post "${slug}" returned null/undefined`);
          postErrorCount++;
        }
        
        // Log progress every 10 posts
        if ((i + 1) % 10 === 0 || i === postSlugs.length - 1) {
          console.log(`   Progress: ${i + 1}/${postSlugs.length} posts fetched (${postSuccessCount} success, ${postErrorCount} errors)`);
        }
      } catch (error) {
        console.error(`   ❌ Error fetching post "${slug}":`, error);
        postErrorCount++;
      }
    }

    await saveToCache('posts-map.json', postsMap);
    console.log(`💾 Saved ${Object.keys(postsMap).length} blog posts to cache`);
    if (postErrorCount > 0) {
      console.warn(`⚠️ ${postErrorCount} posts failed to fetch`);
    }

    // Fetch all collections for listing page
    console.log('\n📥 Fetching all collections for listing page...');
    const allCollectionsList = await client.fetch(allCollectionsQuery);
    console.log(`📊 All collections count: ${allCollectionsList?.length || 0}`);
    if (Array.isArray(allCollectionsList) && allCollectionsList.length > 0) {
      const sample = allCollectionsList.slice(0, 5).map((c: any) => ({
        _id: c?._id,
        title: c?.title,
        slug: typeof c?.slug === 'string' ? c.slug : c?.slug?.current,
      }));
      console.log('   - Sample collections:', sample);
    }
    await saveToCache('all-collections-list.json', allCollectionsList);

    // Fetch full detail for each collection (for detail pages)
    console.log('\n📥 Fetching full details for collection detail pages...');
    const collectionsMap: Record<string, any> = {};
    const collectionSlugs = allCollectionsList?.map((c: any) => c.slug).filter(Boolean) || [];

    console.log(`📦 Fetching full details for ${collectionSlugs.length} collections...`);
    let collectionSuccessCount = 0;
    let collectionErrorCount = 0;

    for (let i = 0; i < collectionSlugs.length; i++) {
      const slug = collectionSlugs[i];
      try {
        const collectionDetail = await client.fetch(collectionBySlugQuery, { slug });
        if (collectionDetail) {
          collectionsMap[slug] = collectionDetail;
          collectionSuccessCount++;
        } else {
          console.warn(`   ⚠️ Collection "${slug}" returned null/undefined`);
          collectionErrorCount++;
        }
        
        // Log progress every 5 collections (usually fewer than products/posts)
        if ((i + 1) % 5 === 0 || i === collectionSlugs.length - 1) {
          console.log(`   Progress: ${i + 1}/${collectionSlugs.length} collections fetched (${collectionSuccessCount} success, ${collectionErrorCount} errors)`);
        }
      } catch (error) {
        console.error(`   ❌ Error fetching collection "${slug}":`, error);
        collectionErrorCount++;
      }
    }

    await saveToCache('collections-map.json', collectionsMap);
    console.log(`💾 Saved ${Object.keys(collectionsMap).length} collections to cache`);
    if (collectionErrorCount > 0) {
      console.warn(`⚠️ ${collectionErrorCount} collections failed to fetch`);
    }

    // Save metadata
    const metadata = {
      fetchedAt: new Date().toISOString(),
      projectId,
      dataset,
      apiVersion,
      categories: Object.keys(categoryMap),
    };
    await saveToCache('metadata.json', metadata);

    // Create TypeScript index file that exports all cache data
    const indexContent = `/**
 * Auto-generated cache index file
 * This file is generated by scripts/fetch-homepage-data.ts
 * DO NOT EDIT MANUALLY
 */

export const homepageCache = ${JSON.stringify(homeData, null, 2)} as const;

export const featuredProductsCache = ${JSON.stringify(featuredProducts, null, 2)} as const;

export const featuredCoursesCache = ${JSON.stringify(featuredCourses, null, 2)} as const;

export const featuredPostsCache = ${JSON.stringify(featuredPosts, null, 2)} as const;

export const categoryProductsCache = ${JSON.stringify(categoryProductsMap, null, 2)} as const;

export const faqsHomeCache = ${JSON.stringify(faqs, null, 2)} as const;

export const allProductsListCache = ${JSON.stringify(allProductsList, null, 2)} as const;

export const productsCache = ${JSON.stringify(productsMap, null, 2)} as const;

export const productsFaqsCache = ${JSON.stringify(productFaqs, null, 2)} as const;

export const allPostsListCache = ${JSON.stringify(allPostsList, null, 2)} as const;

export const postsCache = ${JSON.stringify(postsMap, null, 2)} as const;

export const allCollectionsListCache = ${JSON.stringify(allCollectionsList, null, 2)} as const;

export const collectionsCache = ${JSON.stringify(collectionsMap, null, 2)} as const;

export const cacheMetadata = ${JSON.stringify(metadata, null, 2)} as const;
`;
    await writeFile(join(CACHE_DIR, 'index.ts'), indexContent, 'utf-8');
    console.log('💾 Saved: index.ts (TypeScript cache exports)');

    console.log('\n✅ Homepage data fetch completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Homepage: ${homeData ? '✓' : '✗'}`);
    console.log(`   - Featured Products: ${featuredProducts?.length || 0}`);
    console.log(`   - Featured Courses: ${featuredCourses?.length || 0}`);
    console.log(`   - Featured Posts: ${featuredPosts?.length || 0}`);
    console.log(`   - Category Products: ${Object.keys(categoryProductsMap).length} categories`);
    console.log(`   - FAQs: ${faqs?.length || 0}`);
    console.log(`   - All Products (listing): ${allProductsList?.length || 0}`);
    console.log(`   - Products (detail pages): ${Object.keys(productsMap).length}`);
    console.log(`   - Product FAQs: ${productFaqs?.length || 0}`);
    console.log(`   - All Posts (listing): ${allPostsList?.length || 0}`);
    console.log(`   - Posts (detail pages): ${Object.keys(postsMap).length}`);
    console.log(`   - All Collections (listing): ${allCollectionsList?.length || 0}`);
    console.log(`   - Collections (detail pages): ${Object.keys(collectionsMap).length}`);
    console.log(`\n📁 Cache location: ${CACHE_DIR}`);
  } catch (error) {
    console.error('\n❌ Error fetching homepage data:', error);
    process.exit(1);
  }
}

// Run the script
fetchHomepageData().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

