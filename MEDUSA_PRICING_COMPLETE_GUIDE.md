# Complete Guide: Medusa Pricing System

## ✅ System Overview

**ALL prices on the website come from Medusa backend ONLY.**  
No prices are stored in Sanity. Sanity only stores product content (name, description, images).

---

## 📊 How Prices Are Stored in Medusa

### Product Structure in Medusa

```
Product (handle: "chatgpt-plus")
  └── Variant (title: "1 Month")
       └── Prices Array
            └── { currency_code: "irr", amount: 2800000 }
```

### Price Format

- **Stored in:** Smallest currency unit (Rials for IRR)
- **Example:** 280,000 Tomans = 2,800,000 Rials
- **Medusa stores:** `amount: 2800000`
- **Frontend displays:** `280,000 تومان` (divides by 10)

---

## 🔄 Complete Price Flow

### 1. Admin Sets Price in Medusa

**Steps:**
1. Login to: `https://backend.sharifgpt.com/app`
2. Go to **Products**
3. Select product (e.g., "ChatGPT Plus")
4. Edit variant
5. Add price:
   - Currency: **IRR**
   - Amount: **2800000** (for 280,000 Tomans)
6. Save

**Result:** Price stored in Medusa database

---

### 2. Frontend Fetches Prices from Medusa

#### A. Products List Page (`/products`)

**Flow:**
```
Component Mounts
      ↓
useEffect runs
      ↓
Fetches ALL product slugs from Sanity
      ↓
POST /api/products/prices
Body: { slugs: ["chatgpt-plus", "claude-pro", ...] }
      ↓
API calls Medusa for each slug:
GET /store/products?handle=chatgpt-plus&fields=*variants.prices
      ↓
Returns: { variants: [{ prices: [{ currency_code: "irr", amount: 2800000 }] }] }
      ↓
Transforms: amount ÷ 10 = price in Tomans
      ↓
Sets state: productPrices[slug] = { variants: [{ price: 280000 }] }
      ↓
Renders: ProductCard with price from Medusa
```

**Code Location:**
- `sharifgpt-website/app/products/page-client.tsx` (lines 48-77)

---

#### B. Product Single Page (`/products/chatgpt-plus`)

**Flow:**
```
Server Component (page.tsx)
      ↓
Fetches product from Sanity (name, description, images)
      ↓
Passes productData to Client Component
      ↓
Client Component Mounts (page-client.tsx)
      ↓
useEffect runs (line 128)
      ↓
Extracts slug (handles both string and object):
  - If string: use directly
  - If object: access .current
      ↓
POST /api/products/prices
Body: { slugs: ["chatgpt-plus"] }
      ↓
API calls: GET /store/products?handle=chatgpt-plus&fields=*variants.prices
      ↓
Returns Medusa variants with prices
      ↓
setMedusaVariants([{ name: "1 Month", price: 280000, variant_id: "..." }])
      ↓
Component re-renders
      ↓
product.options built from medusaVariants
      ↓
selectedVariant = product.options[0]
      ↓
displayPrice = selectedVariant.price
      ↓
Displays: 280,000 تومان
```

**Code Locations:**
- Server: `sharifgpt-website/app/products/[slug]/page.tsx`
- Client: `sharifgpt-website/app/products/[slug]/page-client.tsx`
- API: `sharifgpt-website/app/api/products/prices/route.ts`

---

### 3. Add to Cart

**Flow:**
```
User clicks "افزودن به سبد"
      ↓
handleAddToCart() (line 59)
      ↓
Gets: selectedProductOption = product.options[selectedOption]
      ↓
Validates: price > 0
      ↓
Adds to cart with:
  - price: from Medusa variant
  - variant_id: Medusa variant ID
  - sanity_slug: for backend lookup
      ↓
Cart stores in localStorage
```

**Code Location:**
- `sharifgpt-website/app/products/[slug]/page-client.tsx` (lines 59-115)

---

### 4. Cart Display

**Flow:**
```
Cart Page loads
      ↓
Reads cart from localStorage (CartContext)
      ↓
Displays items with:
  - item.price (from Medusa when added)
  - item.quantity
  - Total = price × quantity
```

**Code Locations:**
- Context: `sharifgpt-website/contexts/cart-context.tsx`
- Page: `sharifgpt-website/app/cart/page.tsx`

---

### 5. Checkout & Payment

**Flow:**
```
User clicks "پرداخت"
      ↓
POST /store/cart/create
Body: { items: [{ variant_id, quantity, ... }] }
      ↓
Backend validates price:
  - Fetches variant from Medusa by variant_id
  - Gets REAL price from Medusa (not from user input!)
  - variant.prices.find(p => p.currency_code === 'irr').amount
      ↓
Creates cart with validated price
      ↓
POST /store/cart/initiate-payment
      ↓
Creates payment with Medusa price (secure!)
      ↓
Redirects to Zarinpal
      ↓
User pays
      ↓
Zarinpal redirects back
      ↓
POST /store/zarinpal/verify
      ↓
Verifies payment with Zarinpal API
      ↓
Success! ✅
```

**Code Locations:**
- Cart Creation: `medusa-backend/src/api/store/cart/create/route.ts` (line 196-204)
- Payment: `medusa-backend/src/api/store/cart/initiate-payment/route.ts`
- Verification: `medusa-backend/src/api/store/zarinpal/verify/route.ts`

---

## 🔐 Security Features

### Price Validation

**Frontend sends:**
```json
{
  "variant_id": "variant_01K...",
  "quantity": 1
}
```

**Backend validates:**
```typescript
// Backend fetches REAL price from Medusa (user can't fake this!)
const variant = await productModuleService.retrieveVariant(variant_id)
const realPrice = variant.prices.find(p => p.currency_code === 'irr').amount

// Uses real price, not user input!
cart.total = realPrice × quantity
```

**Result:** User cannot manipulate prices! 🔒

---

## 📝 How to Manage Prices

### For Admins: Setting Prices in Medusa

**Step 1: Login**
- URL: `https://backend.sharifgpt.com/app`
- Use admin credentials

**Step 2: Navigate to Product**
- Click **Products** in sidebar
- Find product by handle (e.g., "chatgpt-plus")

**Step 3: Edit Variant Price**
- Click on variant to expand
- Scroll to **"Prices"** section
- Click **"Add Price"** or **"Edit"**
- Select:
  - **Currency:** IRR
  - **Amount:** Enter in Rials (multiply Tomans by 10)
    - Example: 280,000 Tomans → Enter **2800000**
- Click **Save**

**Step 4: Verify**
- Price updates immediately
- No re-deployment needed
- Frontend fetches new price on next page load

---

## 🔧 Critical Implementation Details

### 1. Slug Format Handling

**Problem:** Sanity can return slug as string OR object  
**Solution:** Code handles both formats

```typescript
const slug = typeof productData?.slug === 'string' 
  ? productData.slug              // If string: "chatgpt-plus"
  : productData?.slug?.current    // If object: {current: "chatgpt-plus"}
```

**Locations:**
- Price fetch: `page-client.tsx` line 131
- Add to cart: `page-client.tsx` line 92

---

### 2. Medusa API Query

**CRITICAL:** Must include `fields` parameter!

```
Wrong: /store/products?handle=chatgpt-plus
Right: /store/products?handle=chatgpt-plus&fields=*variants.prices
```

**Without `fields=*variants.prices`:**
- Medusa returns variants WITHOUT prices
- Frontend shows 0 price

**Implementation:**
- `sharifgpt-website/app/api/products/prices/route.ts` line 48

---

### 3. Selected Option Logic

**State Management:**
```typescript
const [selectedOption, setSelectedOption] = useState<number>(0) // Index: 0, 1, 2...
```

**Option Building:**
```typescript
options: medusaVariants.map((v, idx) => ({
  id: idx,        // Must match selectedOption (0, 1, 2...)
  price: v.price  // From Medusa
}))
```

**Selection:**
```typescript
const selectedVariant = product.options[selectedOption]  // Array access by index
const displayPrice = selectedVariant?.price || 0
```

---

## 📍 Key Files Reference

### Frontend

| File | Purpose | Lines |
|------|---------|-------|
| `sharifgpt-website/app/api/products/prices/route.ts` | Fetches prices from Medusa | 28-125 |
| `sharifgpt-website/app/products/page-client.tsx` | Products list with Medusa prices | 48-77, 1002-1027 |
| `sharifgpt-website/app/products/[slug]/page-client.tsx` | Product single page with Medusa prices | 128-179 |
| `sharifgpt-website/contexts/cart-context.tsx` | Cart state management | All |
| `sharifgpt-website/app/cart/page.tsx` | Cart display | 473, 494 |

### Backend

| File | Purpose | Lines |
|------|---------|-------|
| `medusa-backend/src/api/store/cart/create/route.ts` | Cart creation with price validation | 196-204 |
| `medusa-backend/src/api/store/cart/initiate-payment/route.ts` | Payment initiation | 93-151 |
| `medusa-backend/src/api/store/zarinpal/verify/route.ts` | Payment verification | 30-180 |

---

## 🎯 Requirements Checklist

For pricing to work correctly on any page:

### ✅ Frontend Requirements:

1. **Product must have handle** that matches between Sanity and Medusa
   - Sanity slug: `chatgpt-plus`
   - Medusa handle: `chatgpt-plus`

2. **API call must include fields parameter**
   - `fields=*variants.prices`

3. **Code must handle slug format**
   - Both string and object formats

4. **Component must be client-side**
   - Has `"use client"` directive
   - Can use useEffect and useState

### ✅ Backend Requirements:

1. **Product exists in Medusa** with correct handle
2. **Variants have prices** in IRR currency
3. **Amount in Rials** (smallest unit)
4. **Medusa backend accessible** via API

---

## 🧪 Testing Checklist

### Test Product Single Page:

1. Visit: `https://test.sharifgpt.com/products/chatgpt-plus`
2. Open console (F12)
3. Look for:
   ```
   [PRICE-FETCH] ✅ Medusa variants loaded
   [DISPLAY-LOGIC] displayPrice (final): [number > 0]
   ```
4. Verify price displays on page
5. Click "افزودن به سبد"
6. Verify no error alert

### Test Products List Page:

1. Visit: `https://test.sharifgpt.com/products`
2. Check product cards show prices
3. Prices should match Medusa admin

### Test Cart:

1. Add product to cart
2. Go to `/cart`
3. Verify price displays correctly
4. Verify total calculation is correct

### Test Checkout:

1. Proceed to checkout
2. Enter email and phone
3. Click payment button
4. Verify Zarinpal payment amount matches Medusa price
5. Complete payment
6. Verify success page

---

## 🔧 Troubleshooting

### Problem: Price shows 0 on product page

**Check:**
1. Console for `[PRICE-FETCH]` logs
2. If "No slug found" → Slug format issue
3. If "No prices found" → Product not in Medusa
4. If no logs at all → useEffect not running (TypeScript error)

**Solution:**
- Verify product exists in Medusa with correct handle
- Check Medusa variant has IRR price
- Hard refresh browser (Ctrl+Shift+R)

---

### Problem: "قیمت این محصول در دسترس نیست" alert

**Check:**
1. Console for `[ADD-TO-CART]` logs
2. Check: `product.options.length` should be > 0
3. Check: `selectedProductOption.price` should be > 0

**Solution:**
- Price fetch failed (see above)
- Or medusaVariants is empty

---

### Problem: Products list shows prices, but single page doesn't

**Check:**
- Slug format handling in `page-client.tsx`
- Console logs for slug type

**Solution:**
- Code must handle both string and object slug formats
- Already implemented in current version

---

## 🎨 Frontend Components That Display Prices

### 1. Product Card (Products List)
**File:** `components/product-card.tsx`  
**Props:** `price={medusaPrice}`  
**Display:** Shows price in Tomans with formatting

### 2. Product Single Page
**File:** `sharifgpt-website/app/products/[slug]/page-client.tsx`  
**Variable:** `displayPrice`  
**Display:** Shows selected variant price

### 3. Cart Page
**File:** `sharifgpt-website/app/cart/page.tsx`  
**Source:** `item.price` (from cart context)  
**Display:** Individual price + total

### 4. Checkout
**Source:** Cart total from localStorage  
**Backend:** Validates with real Medusa prices

---

## 🚀 Deployment Notes

### When Prices Don't Update After Change:

**Browser Cache:**
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Or clear browser cache

**Vercel Edge Cache:**
- Prices are fetched dynamically (no static cache)
- Should update immediately

**API Cache:**
- `/api/products/prices` is serverless (no cache)
- Always fetches fresh data from Medusa

---

## 📦 Creating Products with Prices

### Method 1: Medusa Admin UI (Recommended)

**Steps:**
1. **Create Product**
   - Title: "ChatGPT Plus"
   - Handle: `chatgpt-plus` (must match Sanity slug!)
   - Description: Your content
   - Status: Published

2. **Add Options**
   - Click "Add Option"
   - Title: "Duration" (or "Subscription Type")
   - Values: "1 Month", "3 Months", "6 Months"
   - Medusa creates variants automatically

3. **Set Prices**
   - For each variant:
     - Click "Edit" → "Prices"
     - Add IRR price
     - Amount: In Rials (Tomans × 10)
     - Save

### Method 2: Via API

**Not recommended** - Admin UI is easier and safer

---

## 🔗 Handle Matching (CRITICAL!)

**The handle is the link between Sanity and Medusa.**

### Sanity:
```json
{
  "_type": "product",
  "name": "ChatGPT Plus",
  "slug": {
    "current": "chatgpt-plus"
  }
}
```

### Medusa:
```json
{
  "title": "ChatGPT Plus",
  "handle": "chatgpt-plus"
}
```

**MUST MATCH:**
- Sanity: `slug.current` = `"chatgpt-plus"`
- Medusa: `handle` = `"chatgpt-plus"`

If they don't match → Frontend can't find product → Price shows 0!

---

## 🎯 Summary

### What Happens When User Visits Product Page:

```
1. Server fetches product content from Sanity
   ↓
2. Client component mounts
   ↓
3. useEffect fetches prices from Medusa (by handle)
   ↓
4. Medusa returns variant prices in Rials
   ↓
5. Frontend converts to Tomans (÷ 10)
   ↓
6. Price displays on page
   ↓
7. User adds to cart with Medusa price
   ↓
8. Cart stores price locally
   ↓
9. Checkout validates price with Medusa backend
   ↓
10. Payment uses validated Medusa price
```

### Security:

✅ **Price at display:** From Medusa  
✅ **Price at add-to-cart:** From Medusa  
✅ **Price at checkout:** Validated with Medusa backend  
✅ **Price at payment:** Re-validated from Medusa  

**User cannot manipulate prices at any step!** 🔒

---

## 📋 Admin Workflow

### Adding a New Product:

1. **Create in Sanity** (optional - for content):
   - Name, description, images
   - Set slug: e.g., `new-product`

2. **Create in Medusa** (required - for pricing):
   - Same handle as Sanity slug
   - Add options and variants
   - Set IRR prices

3. **Verify on Frontend**:
   - Visit `/products/new-product`
   - Price should display from Medusa
   - Add to cart should work

### Updating Prices:

1. **Edit in Medusa Only**
   - Find product by handle
   - Edit variant price
   - Save

2. **Verify**:
   - Refresh product page
   - New price should display

**No code changes or re-deployment needed!**

---

## ⚙️ Technical Configuration

### Required Environment Variables:

**Frontend:**
```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://backend.sharifgpt.com
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_2243c4f7a1f70eb2bb9b354ad7b22be869fca2633214edd7ee70637412a67bd4
NEXT_PUBLIC_SANITY_PROJECT_ID=i0r5wnv8
NEXT_PUBLIC_SANITY_DATASET=production
```

**Backend:**
```env
BACKEND_URL=https://backend.sharifgpt.com
ZARINPAL_MERCHANT_ID=[your_merchant_id]
```

### API Endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/products/prices` | POST | Fetch prices from Medusa |
| `/store/products?handle=X&fields=*variants.prices` | GET | Medusa API (with prices) |
| `/store/cart/create` | POST | Create cart with price validation |
| `/store/cart/initiate-payment` | POST | Start payment |
| `/store/zarinpal/verify` | POST | Verify payment |

---

## 🐛 Debug Logs Guide

### Console Log Sections:

**1. [CLIENT]** - What data component receives
**2. [PRICE-FETCH]** - API call to fetch prices
**3. [PRODUCT-OBJECT]** - Building product options from Medusa
**4. [DISPLAY-LOGIC]** - Price calculation for display
**5. [ADD-TO-CART]** - Add to cart validation

### Normal Flow Should Show:

```
[CLIENT] productData.slug type: string
[CLIENT] productData.slug.current: chatgpt-plus (or direct string)
[PRICE-FETCH] Starting fetch for slug: chatgpt-plus
[PRICE-FETCH] ✅ Medusa variants loaded: [...]
[PRODUCT-OBJECT] medusaVariants length: 1+
[DISPLAY-LOGIC] displayPrice (final): [number > 0]
[ADD-TO-CART] ✅ Price validation passed: [number]
```

---

## 📊 Data Flow Diagram

```
┌─────────────┐
│   Sanity    │ (Content: name, description, images)
└──────┬──────┘
       │ slug
       ↓
┌─────────────────────────────────────────┐
│           Frontend                       │
│  ┌─────────────────────────────────┐   │
│  │ 1. Get slug from Sanity         │   │
│  │ 2. POST /api/products/prices    │   │
│  └────────────┬────────────────────┘   │
│               ↓                          │
│  ┌─────────────────────────────────┐   │
│  │ 3. GET /store/products?handle=X │   │
│  │    &fields=*variants.prices     │   │
│  └────────────┬────────────────────┘   │
└───────────────┼──────────────────────────┘
                ↓
┌─────────────────────────────────────────┐
│         Medusa Backend                   │
│  ┌─────────────────────────────────┐   │
│  │ Returns: variants with prices   │   │
│  │ {currency_code: "irr",          │   │
│  │  amount: 2800000}                │   │
│  └────────────┬────────────────────┘   │
└───────────────┼──────────────────────────┘
                ↓
┌─────────────────────────────────────────┐
│         Frontend Display                 │
│  • Convert: 2800000 ÷ 10 = 280000      │
│  • Display: 280,000 تومان               │
│  • Add to Cart: Stores 280000           │
│  • Checkout: Backend validates          │
└─────────────────────────────────────────┘
```

---

## 🎉 Success Criteria

### ✅ Everything Working When:

**Product Single Page:**
- [ ] Price displays from Medusa
- [ ] Price > 0
- [ ] Add to cart works without error
- [ ] Console shows successful price fetch

**Products List Page:**
- [ ] All products show prices from Medusa
- [ ] Prices match Medusa admin
- [ ] Price sorting works

**Cart:**
- [ ] Items show correct prices
- [ ] Total calculation correct
- [ ] Prices match product page

**Checkout & Payment:**
- [ ] Payment amount matches Medusa price
- [ ] Zarinpal shows correct amount
- [ ] Payment verification succeeds

---

## 🔄 Maintenance

### When Adding New Products:

1. Create in Sanity (content)
2. Create in Medusa with **same handle** (pricing)
3. Set IRR prices for variants
4. Verify on frontend

### When Updating Prices:

1. Edit in Medusa admin only
2. Update variant price in IRR
3. Save
4. Frontend updates automatically (on refresh)

### When Debugging:

1. Check console logs (F12)
2. Verify handle matching
3. Check Medusa admin for price
4. Test API directly: `/api/products/prices`

---

## 📚 Related Documentation

- **Medusa v2 Docs:** https://docs.medusajs.com/api/admin#products
- **Product Pricing:** https://docs.medusajs.com/resources/storefront-development/products/price
- **Store API:** https://docs.medusajs.com/api/store#products

---

## 🎓 Key Takeaways

1. **Single source of truth:** Medusa backend stores ALL prices
2. **Handle matching:** Sanity slug = Medusa handle (critical!)
3. **Smallest unit:** Prices stored in Rials, displayed as Tomans
4. **Fields parameter:** Required to get prices from Medusa API
5. **Format handling:** Code handles both string and object slugs
6. **Security:** Backend validates all prices, user can't fake them
7. **Real-time:** Price updates in Medusa reflect immediately (no rebuild)

---

**System is now production-ready!** 🚀








