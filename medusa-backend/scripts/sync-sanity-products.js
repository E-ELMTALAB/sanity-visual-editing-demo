/**
 * Sync Sanity Products to Medusa at Build Time
 * 
 * This script runs during backend build to sync all Sanity products to Medusa.
 * No tokens needed - uses public Sanity API.
 * Uses native fetch (Node.js 18+)
 */

// No need to import fetch - it's built-in to Node.js 18+

// Sanity public API configuration (no token needed for public content)
const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID || 'i0r5wnv8';
const SANITY_DATASET = process.env.SANITY_DATASET || 'production';
const SANITY_API_VERSION = '2023-06-21';

// Medusa configuration
const MEDUSA_BACKEND = process.env.BACKEND_URL || 'http://localhost:9000';
const PUBLISHABLE_KEY = process.env.MEDUSA_PUBLISHABLE_KEY || 
  'pk_2243c4f7a1f70eb2bb9b354ad7b22be869fca2633214edd7ee70637412a67bd4';

async function syncProducts() {
  console.log('\n🔄 [BUILD] Syncing Sanity products to Medusa...\n');

  try {
    // 1. Fetch products from Sanity using public HTTP API
    console.log('[BUILD] Fetching products from Sanity...');
    console.log(`[BUILD] Project: ${SANITY_PROJECT_ID}, Dataset: ${SANITY_DATASET}`);
    
    const sanityQuery = encodeURIComponent(`
      *[_type == "product"] {
        _id,
        name,
        slug,
        description,
        "imageUrl": image.asset->url,
        "thumbnail": image.asset->url,
        options[] {
          id,
          name,
          price
        }
      }
    `);
    
    const sanityUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${sanityQuery}`;
    
    const sanityResponse = await fetch(sanityUrl);
    
    if (!sanityResponse.ok) {
      throw new Error(`Sanity API error: ${sanityResponse.status}`);
    }
    
    const sanityData = await sanityResponse.json();
    const products = sanityData.result || [];
    
    console.log(`[BUILD] ✓ Found ${products.length} products in Sanity`);
    
    if (products.length === 0) {
      console.log('[BUILD] No products to sync. Skipping.');
      return;
    }

    // 2. Wait for Medusa to be ready (it might still be starting up)
    console.log('[BUILD] Waiting for Medusa to be ready...');
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
    
    // 3. Sync to Medusa
    console.log('[BUILD] Syncing to Medusa...');
    
    const syncUrl = `${MEDUSA_BACKEND}/store/products/sync-from-sanity`;
    
    const syncResponse = await fetch(syncUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': PUBLISHABLE_KEY
      },
      body: JSON.stringify({ products })
    });
    
    if (!syncResponse.ok) {
      const errorText = await syncResponse.text();
      console.error(`[BUILD] ⚠️  Sync failed: ${syncResponse.status}`);
      console.error(`[BUILD] Error: ${errorText}`);
      console.error('[BUILD] Continuing anyway - products can be synced later via API');
      return; // Don't fail the build
    }
    
    const result = await syncResponse.json();
    
    console.log(`[BUILD] ✅ Sync complete: ${result.message}`);
    
    if (result.results) {
      const successCount = result.results.filter((r) => r.success).length;
      console.log(`[BUILD] Successfully synced ${successCount}/${products.length} products`);
      
      result.results.forEach((r) => {
        if (r.success) {
          console.log(`[BUILD]   ✓ ${r.handle} (${r.variants?.length || 0} variants)`);
        } else {
          console.log(`[BUILD]   ✗ ${r.sanity_id}: ${r.error}`);
        }
      });
    }
    
    console.log('[BUILD] Product sync completed\n');
    
  } catch (error) {
    console.error('[BUILD] ⚠️  Sync error:', error.message);
    console.error('[BUILD] Continuing anyway - products can be synced later via webhook or manual script');
    // Don't fail the build even if sync fails
  }
}

// Run sync
syncProducts().catch(err => {
  console.error('[BUILD] Fatal error:', err);
  // Don't fail the build
  process.exit(0);
});

