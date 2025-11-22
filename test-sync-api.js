// Test script to sync Sanity products to Medusa
const fetch = require('node-fetch');

const BACKEND_URL = 'https://backend.sharifgpt.com';

// Sample product data (similar to what would come from Sanity)
const sampleProduct = {
  products: [
    {
      _id: "test-product-001",
      name: "ChatGPT Plus - تست",
      slug: { current: "chatgpt-plus-test" },
      description: "محصول تستی برای بررسی sync API",
      options: [
        {
          id: "1month",
          name: "1 ماهه",
          price: 100000 // 100,000 Toman
        },
        {
          id: "3month",
          name: "3 ماهه",
          price: 280000 // 280,000 Toman
        },
        {
          id: "6month",
          name: "6 ماهه",
          price: 500000 // 500,000 Toman
        }
      ]
    }
  ]
};

async function testSyncAPI() {
  console.log('🚀 Testing Medusa Sync API...\n');
  console.log('📦 Syncing product:', sampleProduct.products[0].name);
  console.log('🔗 Slug:', sampleProduct.products[0].slug.current);
  console.log('📊 Options:', sampleProduct.products[0].options.length);
  console.log('');

  try {
    const response = await fetch(`${BACKEND_URL}/admin/products/sync-from-sanity`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sampleProduct)
    });

    console.log('📡 Response Status:', response.status, response.statusText);
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Success:', data.message);
      console.log('\n📋 Results:');
      
      data.results.forEach((result, idx) => {
        console.log(`\n  Product ${idx + 1}:`);
        console.log(`    ✓ Sanity ID: ${result.sanity_id}`);
        console.log(`    ✓ Medusa ID: ${result.medusa_id}`);
        console.log(`    ✓ Handle: ${result.handle}`);
        
        if (result.variants && result.variants.length > 0) {
          console.log(`\n    Variants (${result.variants.length}):`);
          result.variants.forEach((v, vidx) => {
            console.log(`      ${vidx + 1}. ${v.title}`);
            console.log(`         SKU: ${v.sku}`);
            console.log(`         Price: ${v.price_toman.toLocaleString()} Toman (${v.price_rial.toLocaleString()} Rial)`);
            console.log(`         Variant ID: ${v.variant_id}`);
          });
        }
      });
      
      console.log('\n\n✨ Sync completed successfully!');
      console.log('\n📝 Next steps:');
      console.log('   1. Check Medusa Admin: https://backend.sharifgpt.com/app');
      console.log('   2. Verify product and variants appear correctly');
      console.log('   3. Test price fetch API: POST /api/products/prices');
      
    } else {
      console.log('❌ Error:', data.error);
      if (data.results) {
        console.log('\n📋 Details:', JSON.stringify(data.results, null, 2));
      }
    }
    
  } catch (error) {
    console.error('❌ Sync failed:', error.message);
    console.error('\nStack:', error.stack);
  }
}

// Run the test
testSyncAPI();






