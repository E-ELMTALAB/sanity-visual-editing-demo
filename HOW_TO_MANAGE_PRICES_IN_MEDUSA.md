# How to Manage Product Prices in Medusa Admin Panel

## Overview

After products are synced from Sanity to Medusa, prices are stored in **variant metadata**. Here's how to view and update them.

---

## Current Price Storage (Our Implementation)

Prices are stored in variant metadata as:
```json
{
  "price_rials": 1000000,
  "price_toman": 100000,
  "sanity_option_id": "1month"
}
```

This is because Medusa v2's standard pricing requires regions and price lists, which is more complex than needed for your use case.

---

## How to Update Prices in Medusa Admin

### Step 1: Access Medusa Admin
```
URL: https://backend.sharifgpt.com/app
```

### Step 2: Navigate to Products
1. Click **"Products"** in left sidebar
2. You'll see all synced products with images

### Step 3: Edit a Product
1. Click on a product (e.g., "ChatGPT Plus")
2. Scroll down to **"Variants"** section
3. You'll see all variants (1 ماهه, 3 ماهه, etc.)

### Step 4: Edit Variant Price via Metadata
1. Click on a variant to expand it
2. Scroll to **"Metadata"** section
3. You'll see JSON like:
   ```json
   {
     "price_rials": 1000000,
     "price_toman": 100000,
     "sanity_option_id": "1month",
     "synced_at": "2025-11-04T..."
   }
   ```

4. **Edit the prices:**
   - Change `price_toman` to your new price (e.g., 150000 for 150,000 Toman)
   - Update `price_rials` = price_toman × 10 (e.g., 1500000)

5. Click **"Save"** or **"Update"**

### Step 5: Verify Changes
- Price changes take effect immediately
- Frontend will fetch the new price
- Backend will use the new price for cart validation

---

## Example: Change Price from 100,000 to 150,000 Toman

### Before:
```json
{
  "price_rials": 1000000,
  "price_toman": 100000
}
```

### After Edit:
```json
{
  "price_rials": 1500000,
  "price_toman": 150000
}
```

### Result:
- ✅ Product now costs 150,000 Toman
- ✅ Backend validates against this price
- ✅ Frontend displays this price (after fetching from Medusa)

---

## Alternative: Update Prices via API (Easier for Bulk Updates)

If you have many products to update, you can create a simple API endpoint.

### Quick Price Update Script

Create `update-product-price.js`:

```javascript
const fetch = require('node-fetch');

async function updateVariantPrice(variantId, newPriceToman) {
  const priceRials = newPriceToman * 10;
  
  const response = await fetch(`https://backend.sharifgpt.com/admin/products/variants/${variantId}/update-price`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      price_toman: newPriceToman,
      price_rials: priceRials
    })
  });
  
  const result = await response.json();
  console.log('Price updated:', result);
}

// Usage:
updateVariantPrice('variant_01K...', 150000);
```

*Note: This endpoint doesn't exist yet. Let me know if you want me to create it for easier price management.*

---

## How to Add Discounts

### Method 1: Update Original Price in Metadata

Add `original_price_toman` to show discounts:

```json
{
  "price_rials": 800000,
  "price_toman": 80000,
  "original_price_toman": 100000,
  "discount_percentage": 20
}
```

Frontend will show: ~~100,000~~ **80,000 تومان** (20% off)

### Method 2: Use Medusa Discount Rules (Advanced)

1. Go to **Settings** → **Discounts**
2. Click **"Create Discount"**
3. Set:
   - Type: Percentage or Fixed amount
   - Value: e.g., 20%
   - Apply to: Specific products/collections
4. Save

---

## Summary of Price Management

### What's Synced from Sanity:
- ✅ Product name and description
- ✅ Product thumbnail image (NOW INCLUDED)
- ✅ Initial prices (from Sanity options)
- ✅ Variants for each option

### What You Manage in Medusa:
- 💰 **Prices**: Edit variant metadata (`price_toman`, `price_rials`)
- 🏷️ **Discounts**: Edit metadata or use Medusa Discounts
- 📦 **Inventory**: Manage stock levels
- ➕ **Add variants**: Create new subscription options

### What Stays in Sanity:
- 📝 **Content**: Descriptions, features, SEO
- 🖼️ **Images**: Main images and galleries
- 📊 **Marketing**: Tags, categories, badges

---

## Quick Reference: Price Update Locations

| Task | Location | Method |
|------|----------|--------|
| Update price | Medusa Admin → Product → Variant → Metadata | Edit JSON |
| Add discount | Medusa Admin → Settings → Discounts | Create discount rule |
| Update title/image | Re-sync from Sanity | Webhook or manual sync |
| Add new variant | Sanity → Add option → Publish | Webhook auto-syncs |

---

## After Next Deployment

Your products will have:
- ✅ Correct titles (from Sanity `name` field)
- ✅ Thumbnail images (from Sanity `image` field)
- ✅ Variants with prices
- ✅ All manageable in Medusa Admin

**Deploy backend → Products will sync with images → Manage prices in metadata!** 🚀




