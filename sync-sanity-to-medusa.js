/**
 * Bulk Sync Script: Sanity → Medusa
 * 
 * This script fetches ALL products from your Sanity CMS and creates them in Medusa.
 * It uses the SAME Sanity configuration as your frontend - completely automatic!
 * 
 * Usage:
 * 1. Install dependencies: npm install next-sanity node-fetch
 * 2. Run from project root: node sync-sanity-to-medusa.js
 * 
 * No configuration needed - it reads from the same files as your frontend!
 */

const { createClient } = require('next-sanity');
const fetch = require('node-fetch');

// ============================================
// CONFIGURATION - Uses environment variables (no imports needed)
// ============================================

// Read directly from environment variables (same as lib/sanity.api.ts does)
const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder';
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const SANITY_API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-06-21';
const SANITY_READ_TOKEN = process.env.SANITY_API_READ_TOKEN || '';

// Create Sanity client using the EXACT same method as frontend
const sanityClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  useCdn: false,
  token: SANITY_READ_TOKEN || undefined,  // Optional for public data
  perspective: 'published'
});

const MEDUSA_CONFIG = {
  syncApiUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL 
    ? `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/products/sync-from-sanity`
    : 'https://backend.sharifgpt.com/store/products/sync-from-sanity',
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || 
    'pk_2243c4f7a1f70eb2bb9b354ad7b22be869fca2633214edd7ee70637412a67bd4'
};

// ============================================
// MAIN SYNC FUNCTION
// ============================================

async function syncAllProductsFromSanity() {
  console.log('🚀 Starting Sanity → Medusa Product Sync...\n');

  try {
    // 0. Validate configuration
    if (!SANITY_PROJECT_ID || SANITY_PROJECT_ID === 'placeholder') {
      throw new Error('Sanity project ID not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID environment variable.');
    }
    
    console.log(`📋 Configuration (from environment variables):`);
    console.log(`   Sanity Project: ${SANITY_PROJECT_ID}`);
    console.log(`   Sanity Dataset: ${SANITY_DATASET}`);
    console.log(`   API Version: ${SANITY_API_VERSION}`);
    console.log(`   Medusa Backend: ${MEDUSA_CONFIG.syncApiUrl}`);
    console.log('');

    // 1. Sanity client already initialized (using same method as frontend)
    console.log('✓ Connected to Sanity (using next-sanity)');

    // 2. Fetch all products from Sanity (same client method as frontend)
    console.log('📥 Fetching products from Sanity...');
    
    const products = await sanityClient.fetch(`
      *[_type == "product"] {
        _id,
        name,
        slug,
        description,
        options[] {
          id,
          name,
          price
        }
      }
    `);

    console.log(`✓ Found ${products.length} products in Sanity\n`);

    if (products.length === 0) {
      console.log('⚠️  No products found in Sanity. Exiting.');
      return;
    }

    // 3. Show what will be synced
    console.log('📋 Products to sync:');
    products.forEach((p, idx) => {
      const optionCount = p.options?.length || 0;
      console.log(`   ${idx + 1}. ${p.name} (${optionCount} variants)`);
    });
    console.log('');

    // 4. Send to Medusa sync API
    console.log('📤 Syncing to Medusa...');
    
    const response = await fetch(MEDUSA_CONFIG.syncApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': MEDUSA_CONFIG.publishableKey
      },
      body: JSON.stringify({ products })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Sync API returned ${response.status}: ${errorText}`);
    }

    const result = await response.json();

    // 5. Show results
    console.log('\n✅ Sync Complete!');
    console.log(`   ${result.message}\n`);

    console.log('📊 Detailed Results:');
    result.results.forEach((r, idx) => {
      if (r.success) {
        console.log(`\n   ✓ Product ${idx + 1}: ${r.handle}`);
        console.log(`     Medusa ID: ${r.medusa_id}`);
        console.log(`     Variants: ${r.variants?.length || 0}`);
        
        if (r.variants?.length > 0) {
          r.variants.forEach(v => {
            console.log(`       - ${v.title}: ${v.price_toman.toLocaleString()} Toman`);
          });
        }
      } else {
        console.log(`\n   ✗ Product ${idx + 1}: FAILED`);
        console.log(`     Error: ${r.error}`);
      }
    });

    // 6. Next steps
    console.log('\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 Next Steps:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('1. Go to Medusa Admin: https://backend.sharifgpt.com/app');
    console.log('2. Navigate to Products');
    console.log('3. You will see all your Sanity products there');
    console.log('4. Click on each product to:');
    console.log('   - Update prices');
    console.log('   - Add/remove variants');
    console.log('   - Set up discounts');
    console.log('   - Manage inventory');
    console.log('');
    console.log('📝 From now on:');
    console.log('   - Keep content (descriptions, images) in Sanity');
    console.log('   - Manage prices & commerce in Medusa Admin');
    console.log('   - Frontend will fetch prices from Medusa automatically');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('\n❌ Sync Failed:', error.message);
    
    if (error.message.includes('project ID')) {
      console.error('\n💡 Tip: Your Sanity credentials are configured in lib/sanity.api.ts');
      console.error('   Make sure environment variables are set:');
      console.error('   - NEXT_PUBLIC_SANITY_PROJECT_ID');
      console.error('   - NEXT_PUBLIC_SANITY_DATASET (optional, defaults to "production")');
    }
    if (error.message.includes('Cannot find module')) {
      console.error('\n💡 Tip: Install dependencies: npm install next-sanity node-fetch');
    }
    
    console.error('\n📝 Note: This script uses the SAME Sanity config as your frontend');
    console.error('   If your frontend works, this should work too!');
    
    process.exit(1);
  }
}

// ============================================
// RUN THE SCRIPT
// ============================================

if (require.main === module) {
  syncAllProductsFromSanity();
}

module.exports = { syncAllProductsFromSanity };

