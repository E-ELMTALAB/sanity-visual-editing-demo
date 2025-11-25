/**
 * Clear All Products from Medusa
 * 
 * This script deletes ALL products from your Medusa backend.
 * Use this to clean up before syncing your real Sanity products.
 * 
 * Usage:
 * 1. Run: node clear-medusa-products.js
 * 2. Confirm deletion when prompted
 * 3. All products will be removed from Medusa
 * 
 * WARNING: This is irreversible! Make sure you want to delete all products.
 */

const fetch = require('node-fetch');
const readline = require('readline');

const MEDUSA_BACKEND = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'https://backend.sharifgpt.com';
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || 
  'pk_2243c4f7a1f70eb2bb9b354ad7b22be869fca2633214edd7ee70637412a67bd4';

// Create readline interface for user confirmation
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function clearAllProducts() {
  console.log('🗑️  Medusa Product Cleanup Script\n');
  console.log('⚠️  WARNING: This will delete ALL products from Medusa!');
  console.log(`Backend: ${MEDUSA_BACKEND}\n`);

  try {
    // 1. Fetch all products
    console.log('📥 Fetching all products from Medusa...');
    
    const listResponse = await fetch(`${MEDUSA_BACKEND}/store/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': PUBLISHABLE_KEY
      }
    });

    if (!listResponse.ok) {
      throw new Error(`Failed to fetch products: ${listResponse.status} ${listResponse.statusText}`);
    }

    const listData = await listResponse.json();
    const products = listData.products || [];

    console.log(`✓ Found ${products.length} products in Medusa\n`);

    if (products.length === 0) {
      console.log('✨ No products to delete. Medusa is already clean!');
      rl.close();
      return;
    }

    // 2. Show what will be deleted
    console.log('📋 Products that will be deleted:');
    products.forEach((p, idx) => {
      console.log(`   ${idx + 1}. ${p.title} (${p.handle})`);
    });
    console.log('');

    // 3. Ask for confirmation
    const answer = await askQuestion('❓ Are you sure you want to delete ALL these products? (yes/no): ');
    
    if (answer.toLowerCase() !== 'yes') {
      console.log('\n❌ Deletion cancelled. No changes made.');
      rl.close();
      return;
    }

    // 4. Delete all products
    console.log('\n🗑️  Deleting products...\n');
    
    let successCount = 0;
    let failCount = 0;

    for (const product of products) {
      try {
        // Call delete product endpoint
        const deleteResponse = await fetch(`${MEDUSA_BACKEND}/admin/products/${product.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'x-publishable-api-key': PUBLISHABLE_KEY
          }
        });

        if (deleteResponse.ok) {
          console.log(`   ✓ Deleted: ${product.title}`);
          successCount++;
        } else {
          // Try store API endpoint instead
          const storeDeleteResponse = await fetch(`${MEDUSA_BACKEND}/store/products/${product.id}/delete`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-publishable-api-key': PUBLISHABLE_KEY
            }
          });

          if (storeDeleteResponse.ok) {
            console.log(`   ✓ Deleted: ${product.title}`);
            successCount++;
          } else {
            console.log(`   ✗ Failed to delete: ${product.title} (${deleteResponse.status})`);
            failCount++;
          }
        }
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
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
      console.log('⚠️  Some products could not be deleted.');
      console.log('   This might be because they require admin authentication.');
      console.log('   You can delete them manually in Medusa Admin Panel.\n');
    } else {
      console.log('🎉 Medusa is now clean and ready for fresh product sync!');
      console.log('\n📝 Next steps:');
      console.log('   1. Run: node sync-sanity-to-medusa.js');
      console.log('   2. Or set up Sanity webhook for automatic sync');
      console.log('   3. Your real Sanity products will be properly synced\n');
    }

    rl.close();

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    rl.close();
    process.exit(1);
  }
}

// Run the cleanup
clearAllProducts();







