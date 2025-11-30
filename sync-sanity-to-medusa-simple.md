# Simple Guide: Sync Sanity Products to Medusa

## What This Does

**Takes ALL products from Sanity → Creates them in Medusa → You manage prices in Medusa Admin**

---

## Step-by-Step Instructions

### Option 1: Using the Script (Recommended)

#### Step 1: Install Dependencies
```bash
npm install @sanity/client node-fetch
```

#### Step 2: Update Configuration

Open `sync-sanity-to-medusa.js` and update these lines:

```javascript
const SANITY_CONFIG = {
  projectId: 'YOUR_PROJECT_ID',     // Get from sanity.config.ts
  dataset: 'production',             
  token: 'YOUR_SANITY_TOKEN',       // Create at sanity.io/manage → API
  useCdn: false
};
```

**How to get Sanity token:**
1. Go to https://sanity.io/manage
2. Select your project
3. Go to API → Tokens
4. Create new token with "Read" permission
5. Copy and paste it in the script

#### Step 3: Run the Script
```bash
node sync-sanity-to-medusa.js
```

**Expected output:**
```
🚀 Starting Sanity → Medusa Product Sync...
✓ Connected to Sanity
📥 Fetching products from Sanity...
✓ Found 10 products in Sanity

📋 Products to sync:
   1. ChatGPT Plus (3 variants)
   2. Claude Pro (2 variants)
   ...

📤 Syncing to Medusa...
✅ Sync Complete!
```

---

### Option 2: Manual Sync (If Script Doesn't Work)

#### Step 1: Get Your Products from Sanity

In Sanity Studio, run this query in Vision:
```groq
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
```

Copy the JSON result.

#### Step 2: Format and Send

Create a file `my-products.json`:
```json
{
  "products": [
    // Paste your Sanity products here
  ]
}
```

#### Step 3: Call API

**PowerShell:**
```powershell
$body = Get-Content my-products.json -Raw
$headers = @{
  "Content-Type" = "application/json"
  "x-publishable-api-key" = "pk_2243c4f7a1f70eb2bb9b354ad7b22be869fca2633214edd7ee70637412a67bd4"
}

Invoke-RestMethod -Uri "https://backend.sharifgpt.com/store/products/sync-from-sanity" `
  -Method POST -Headers $headers -Body $body
```

---

## After Sync is Complete

### 1. Check Medusa Admin
- Go to: https://backend.sharifgpt.com/app
- Login
- Navigate to **Products**
- You should see ALL your Sanity products!

### 2. Manage Prices & Variants
Now you can:
- ✅ Click any product
- ✅ Edit variant prices
- ✅ Add new variants
- ✅ Remove variants
- ✅ Set up discounts
- ✅ Manage inventory

### 3. Workflow Going Forward

**For Content (descriptions, images):**
- ✏️ Edit in Sanity
- Your frontend continues to use Sanity for content

**For Prices & Commerce:**
- 💰 Edit in Medusa Admin Panel
- Your frontend fetches prices from Medusa
- Backend validates all prices from Medusa

**Sync Again?**
- Only if you add NEW products in Sanity
- Or if product names/slugs change
- Not needed for price changes (those are in Medusa now)

---

## Troubleshooting

### "Products not showing in Medusa Admin"
- Check if sync completed successfully
- Check Railway logs for errors
- Verify products have valid slugs

### "Sync script fails"
- Verify Sanity credentials are correct
- Check internet connection
- Make sure @sanity/client is installed

### "Want to sync just ONE product"
- Use the test file: `test-sync-product.json`
- Modify it with your product data
- Call the API manually

---

## What Gets Created in Medusa

For each Sanity product:
```
Product: "ChatGPT Plus"
├── Handle: "chatgpt-plus" (from Sanity slug)
├── Description: (from Sanity)
└── Variants:
    ├── "1 month" - 100,000 Toman
    ├── "3 months" - 280,000 Toman
    └── "6 months" - 500,000 Toman
```

After sync, you can:
- Change prices in Medusa Admin
- Add "12 months" variant
- Set up "20% off" discount
- Everything managed in Medusa!

---

## Important Notes

1. **Run this script ONCE** (or when you add new products)
2. **Don't** keep syncing for every change
3. **Do** update prices in Medusa Admin Panel after first sync
4. **Sanity stays** your content management system
5. **Medusa becomes** your commerce management system

---

**Ready to sync? Run the script or follow manual steps above!**










