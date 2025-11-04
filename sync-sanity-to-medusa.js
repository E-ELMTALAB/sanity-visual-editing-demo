/**
 * Bulk Sync Script: Sanity → Medusa
 * 
 * This script fetches ALL products from your Sanity CMS and creates them in Medusa.
 * After running this once, you can manage prices/discounts/variants in Medusa Admin Panel.
 * 
 * Usage:
 * 1. Install dependencies: npm install @sanity/client node-fetch
 * 2. Update your Sanity project details below
 * 3. Run: node sync-sanity-to-medusa.js
 */

const sanityClient = require('@sanity/client');
const fetch = require('node-fetch');

// ============================================
// CONFIGURATION - Update these values
// ============================================

const SANITY_CONFIG = {
  projectId: 'your-sanity-project-id',  // Find in sanity.config.ts
  dataset: 'production',                 // Usually 'production'
  token: 'your-sanity-token',           // Get from sanity.io/manage → API → Tokens
  useCdn: false
};

const MEDUSA_CONFIG = {
  syncApiUrl: 'https://backend.sharifgpt.com/store/products/sync-from-sanity',
  publishableKey: 'pk_2243c4f7a1f70eb2bb9b354ad7b22be869fca2633214edd7ee70637412a67bd4'
};

// ============================================
// MAIN SYNC FUNCTION
// ============================================

async function syncAllProductsFromSanity() {
  console.log('🚀 Starting Sanity → Medusa Product Sync...\n');

  try {
    // 1. Initialize Sanity client
    const sanity = sanityClient(SANITY_CONFIG);
    console.log('✓ Connected to Sanity');

    // 2. Fetch all products from Sanity
    console.log('📥 Fetching products from Sanity...');
    
    const products = await sanity.fetch(`
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
    
    if (error.message.includes('projectId')) {
      console.error('\n💡 Tip: Update your Sanity project ID in the script');
    }
    if (error.message.includes('token')) {
      console.error('\n💡 Tip: Create a Sanity API token at sanity.io/manage');
    }
    if (error.message.includes('fetch')) {
      console.error('\n💡 Tip: Install dependencies: npm install @sanity/client node-fetch');
    }
    
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

