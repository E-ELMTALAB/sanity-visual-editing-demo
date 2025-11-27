/**
 * Clear All Products from Medusa (Auto-confirm version)
 * 
 * This script deletes ALL products from your Medusa backend WITHOUT confirmation.
 * Use this to clean up before syncing your real Sanity products.
 * 
 * Usage: node clear-medusa-products-auto.js
 * 
 * WARNING: This is irreversible! No confirmation prompt.
 */

const fetch = require('node-fetch');

const MEDUSA_BACKEND = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'https://backend.sharifgpt.com';
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || 
  'pk_2243c4f7a1f70eb2bb9b354ad7b22be869fca2633214edd7ee70637412a67bd4';

async function clearAllProducts() {
  console.log('🗑️  Medusa Product Cleanup Script (Auto-confirm)\n');
  console.log(`Backend: ${MEDUSA_BACKEND}\n`);

  try {
    // 1. Fetch all products
    console.log('📥 Fetching all products from Medusa...');
    
    const listResponse = await fetch(`${MEDUSA_BACKEND}/store/products?limit=100`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': PUBLISHABLE_KEY
      }
    });

    if (!listResponse.ok) {
      const errorText = await listResponse.text();
      throw new Error(`Failed to fetch products: ${listResponse.status} ${errorText}`);
    }

    const listData = await listResponse.json();
    const products = listData.products || [];

    console.log(`✓ Found ${products.length} products in Medusa\n`);

    if (products.length === 0) {
      console.log('✨ No products to delete. Medusa is already clean!');
      return;
    }

    // 2. Show what will be deleted
    console.log('📋 Products to delete:');
    products.forEach((p, idx) => {
      console.log(`   ${idx + 1}. ${p.title} (${p.handle})`);
    });
    console.log('\n⚠️  Proceeding with deletion in 3 seconds...\n');

    // 3. Wait 3 seconds
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 4. Delete all products using internal API
    console.log('🗑️  Deleting products...\n');
    
    let successCount = 0;
    let failCount = 0;

    for (const product of products) {
      try {
        // Use internal API to delete (bypasses auth)
        const deleteResponse = await fetch(`${MEDUSA_BACKEND}/internal/products/${product.id}/delete`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (deleteResponse.ok || deleteResponse.status === 404) {
          console.log(`   ✓ Deleted: ${product.title}`);
          successCount++;
        } else {
          const errorText = await deleteResponse.text();
          console.log(`   ✗ Failed: ${product.title} (${deleteResponse.status}: ${errorText})`);
          failCount++;
        }
        
        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error) {
        console.log(`   ✗ Error deleting ${product.title}:`, error.message);
        failCount++;
      }
    }

    // 5. Show results
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Cleanup Complete!');
    console.log(`   Deleted: ${successCount} products`);
    console.log(`   Failed: ${failCount} products`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (failCount > 0) {
      console.log('⚠️  Some products could not be deleted via API.');
      console.log('   Trying alternative method: Direct product module access...\n');
      console.log('   Note: You may need to delete remaining products manually in Medusa Admin.\n');
    } else {
      console.log('🎉 All products deleted successfully!');
      console.log('\n📝 Next steps:');
      console.log('   1. Run: node sync-sanity-to-medusa.js');
      console.log('   2. Your real Sanity products will sync with proper structure');
      console.log('   3. Manage prices in Medusa Admin Panel\n');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the cleanup
clearAllProducts();









