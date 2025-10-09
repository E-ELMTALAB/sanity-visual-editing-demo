# Quick Guide: How to Add Products to Dropdown

## Step-by-Step Guide

### 1. Access Sanity Studio
```
http://localhost:3000/studio
```
or your production URL:
```
https://yourdomain.com/studio
```

### 2. Create a New Product
1. Click on **"Products"** in the left sidebar
2. Click **"+ Create"** button
3. Fill in the required fields

### 3. Required Fields

#### Product Name (Required)
```
Example: "ChatGPT Plus Subscription"
Persian: "اشتراک ChatGPT Plus"
```

#### Slug (Required)
```
Auto-generated from name or custom:
Example: "chatgpt-plus"
```

#### Category (Required) ⚠️ IMPORTANT
Must be **exactly one** of these values:
- `ai` - Will appear under "هوش مصنوعی" (AI)
- `social-media` - Will appear under "سوشیال مدیا" (Social Media)
- `music` - Will appear under "موسیقی" (Music)
- `educational` - Will appear under "آموزشی" (Educational)
- `sim-card` - Will appear under "سیمکارت" (SIM Card)

#### Price (Optional but recommended)
```
Example: 25000 (in Tomans)
```

#### Original Price (Optional)
```
Example: 35000 (for showing discounts)
```

#### Discount Percentage (Optional)
```
Example: 30 (will show 30% off)
```

### 4. Optional Fields

#### Description
```
Full product description (supports rich text)
```

#### Image
```
Upload product image (PNG, JPG, WebP)
Recommended size: 400x300px or larger
```

#### Features (Array)
```
- Feature 1
- Feature 2
- Feature 3
```

#### Badges (Array)
```
Examples:
- "پرفروش" (Best Seller)
- "جدید" (New)
- "پیشنهاد ویژه" (Special Offer)
```

#### Tags
```
For search and filtering
Examples: ai, chatgpt, openai, subscription
```

### 5. Advanced Fields

#### SEO Settings
```
- Meta Title
- Meta Description
- Keywords
- OG Image
```

#### Related Products
```
Link to other products
```

#### Related Blogs
```
Link to relevant blog posts
```

#### In Stock
```
Toggle: Yes/No
```

#### Rating & Review Count
```
Rating: 4.5 (out of 5)
Review Count: 42
```

## Examples

### Example 1: AI Product
```
Name: اشتراک ChatGPT Plus
Slug: chatgpt-plus-subscription
Category: ai ← IMPORTANT!
Price: 200000
Original Price: 250000
Discount: 20
Badges: ["پیشنهاد ویژه", "محبوب"]
```

### Example 2: Social Media Product
```
Name: اکانت اینستاگرام پریمیوم
Slug: instagram-premium
Category: social-media ← IMPORTANT!
Price: 180000
Original Price: 250000
Discount: 28
Badges: ["جدید"]
```

### Example 3: Music Product
```
Name: اکانت اسپاتیفای پریمیوم
Slug: spotify-premium
Category: music ← IMPORTANT!
Price: 250000
Original Price: 350000
Discount: 30
Badges: ["پرفروش"]
```

### Example 4: Educational Product
```
Name: دوره آموزش هوش مصنوعی
Slug: ai-training-course
Category: educational ← IMPORTANT!
Price: 450000
Original Price: 600000
Discount: 25
```

### Example 5: SIM Card Product
```
Name: سیمکارت مجازی آمریکا
Slug: usa-virtual-sim
Category: sim-card ← IMPORTANT!
Price: 120000
Original Price: 180000
Discount: 33
```

## Category Limits

⚠️ **Important:** The dropdown shows **maximum 4 products per category**

If you have more than 4 products in a category:
- First 4 will appear in dropdown
- Users can click "مشاهده همه →" to see all products

Products are ordered by: `_createdAt desc` (newest first)

## Testing Your Changes

### 1. Save the Product
Click **"Publish"** button in Sanity Studio

### 2. Verify in Dropdown
1. Go to homepage: `http://localhost:3000`
2. Hover over "محصولات" menu
3. Check if your product appears in correct category
4. Verify product name, icon, and link

### 3. Check Product Page
Click on the product in dropdown
- Should navigate to: `/products/your-product-slug`
- Verify all details appear correctly

## Troubleshooting

### Product doesn't appear in dropdown
✅ **Check:**
1. Product is published (not draft)
2. Category is **exactly** one of the 5 supported values
3. Category name is lowercase and no spaces
4. Product has a valid slug

### Product appears in wrong category
✅ **Fix:**
1. Edit product in Sanity Studio
2. Change category field to correct value
3. Publish changes
4. Refresh browser

### Dropdown shows "محصولاتی یافت نشد"
✅ **Check:**
1. At least one product exists in Sanity
2. Products have correct category values
3. Products are published (not drafts)
4. Environment variables are set correctly

### Product link doesn't work
✅ **Check:**
1. Slug field is filled
2. Slug is URL-friendly (no spaces, special chars)
3. Product detail page exists at `/products/[slug]`

## Best Practices

### 1. Naming Convention
- Use clear, descriptive names
- Include brand names if applicable
- Use Persian for Persian audience

### 2. Categories
- Always use lowercase
- No spaces in category values
- Stick to the 5 supported categories

### 3. Pricing
- Use consistent currency (Tomans)
- Set original price to show discounts
- Calculate discount percentage correctly

### 4. Images
- Use high-quality images (min 400x300px)
- Optimize file size (< 200KB)
- Use WebP format for better performance

### 5. SEO
- Write unique descriptions
- Add relevant keywords
- Fill in meta tags

### 6. Organization
- Use consistent badge names
- Link related products
- Tag appropriately for search

## Batch Import (Advanced)

If you have many products to add, you can:

### Option 1: Use Sanity Import Tool
```bash
npx sanity dataset import products.ndjson production
```

### Option 2: Use Sanity API
```javascript
import { client } from './lib/sanity.client'

const products = [
  {
    _type: 'product',
    name: 'Product 1',
    category: 'ai',
    // ... other fields
  },
  // ... more products
]

products.forEach(async (product) => {
  await client.create(product)
})
```

## Product Data Template

Copy this template for quick product creation:

```json
{
  "_type": "product",
  "name": "Product Name Here",
  "slug": {
    "current": "product-slug-here"
  },
  "category": "ai",
  "price": 0,
  "originalPrice": 0,
  "discountPercentage": 0,
  "description": "Product description here",
  "features": [
    "Feature 1",
    "Feature 2",
    "Feature 3"
  ],
  "badges": ["Badge 1"],
  "inStock": true,
  "rating": 4.5,
  "reviewCount": 0
}
```

---

## Quick Reference Card

| Field | Required | Type | Example |
|-------|----------|------|---------|
| name | ✅ Yes | String | "ChatGPT Plus" |
| slug | ✅ Yes | Slug | "chatgpt-plus" |
| category | ✅ Yes | String | "ai" |
| price | ⚠️ Recommended | Number | 200000 |
| originalPrice | ❌ No | Number | 250000 |
| discountPercentage | ❌ No | Number | 20 |
| description | ⚠️ Recommended | Text | "Full description" |
| image | ⚠️ Recommended | Image | 400x300px |
| features | ❌ No | Array | ["Feature 1"] |
| badges | ❌ No | Array | ["پرفروش"] |
| inStock | ✅ Yes | Boolean | true |
| rating | ❌ No | Number | 4.5 |
| reviewCount | ❌ No | Number | 42 |

---

**Need Help?**
- Check `PRODUCTS_DROPDOWN_UPDATE.md` for technical details
- Check `DROPDOWN_ARCHITECTURE.md` for system architecture
- Check `DROPDOWN_IMPLEMENTATION_COMPLETE.md` for overview
