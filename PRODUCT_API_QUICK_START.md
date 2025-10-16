# 🚀 Product Creation API - Quick Start

Your comprehensive product creation API is ready! Here's how to use it.

---

## 📍 Endpoint

```
POST /admin/products/create-full
```

**URL:** `https://backend-production-ea59.up.railway.app/admin/products/create-full`

**Auth:** Admin JWT token required

---

## ⚡ Quick Examples

### 1. Simple Product (1 variant)

```bash
curl -X POST https://backend-production-ea59.up.railway.app/admin/products/create-full \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "title": "Blue Cotton T-Shirt",
    "description": "Comfortable cotton t-shirt",
    "status": "published",
    "tags": ["cotton", "casual"],
    "variants": [{
      "title": "Default",
      "sku": "TSHIRT-BLU-001",
      "inventory_quantity": 100,
      "prices": [{
        "currency_code": "usd",
        "amount": 2999
      }]
    }]
  }'
```

### 2. Product with Multiple Variants

```bash
curl -X POST https://backend-production-ea59.up.railway.app/admin/products/create-full \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d @example-product.json
```

*(See `example-product.json` for a complete example with colors, sizes, images, etc.)*

---

## 📦 What You Can Set

### ✅ Product Information
- Title, subtitle, description
- Handle (URL slug)
- Status (draft/published)
- Images and thumbnail
- Tags, categories, collections
- Physical properties (weight, dimensions)
- SEO metadata

### ✅ Product Variants
- Multiple variants per product
- SKU, EAN, UPC, barcode
- Inventory quantity
- Prices in multiple currencies
- Bulk pricing tiers
- Variant-specific options (Size, Color, etc.)
- Individual variant metadata

### ✅ Advanced Features
- Gift card products
- Discountable toggle
- Customs codes (HS code, origin country)
- Material composition
- Custom metadata for any additional fields

---

## 🎯 Use Cases

### 1. Import from CSV
Convert your CSV data to JSON and create products programmatically.

### 2. Connect to External System
Sync products from Shopify, WooCommerce, or any other platform.

### 3. Bulk Product Creation
Create hundreds of products via script.

### 4. Admin Panel Integration
Build a custom admin panel that uses this API.

### 5. Product Templates
Use the example JSON as templates for common product types.

---

## 📖 Full Documentation

See **`PRODUCT_API_DOCUMENTATION.md`** for:
- Complete parameter reference
- All field descriptions
- Multiple real-world examples
- Best practices
- Tips & tricks

---

## 🧪 Test It Now

1. **Get your admin token** (login to `/app` and get JWT from cookies/storage)
2. **Use the example file**:
   ```bash
   curl -X POST https://backend-production-ea59.up.railway.app/admin/products/create-full \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d @medusa-backend/example-product.json
   ```
3. **Check the result** in your admin dashboard at `/app`

---

## 💡 Pro Tips

### Pricing in Cents
Always use cents to avoid rounding errors:
- $29.99 = `2999`
- €45.50 = `4550`

### Auto-Generated Handles
If you don't provide a handle, it's auto-generated from the title:
- "Premium Headphones" → `premium-headphones`

### Default Variant
If you don't provide variants, a default one is created automatically.

### Metadata for Everything
Use `metadata` to store any custom fields:
```json
{
  "metadata": {
    "brand": "Nike",
    "season": "Spring 2025",
    "custom_field": "any value"
  }
}
```

---

## ✅ What's Been Deployed

✅ **Endpoint created**: `/admin/products/create-full`  
✅ **Documentation added**: `PRODUCT_API_DOCUMENTATION.md`  
✅ **Example file provided**: `example-product.json`  
✅ **TypeScript errors fixed**: Build passes successfully  
✅ **Pushed to Railway**: Auto-deploying now

---

## 🔗 Related Files

- **API Code**: `medusa-backend/src/api/admin/products/create-full/route.ts`
- **Full Docs**: `medusa-backend/PRODUCT_API_DOCUMENTATION.md`
- **Example**: `medusa-backend/example-product.json`

---

## 📊 Response Format

### Success (201)
```json
{
  "success": true,
  "message": "Product created successfully with all details",
  "product": {
    "id": "prod_01HJW...",
    "title": "Premium Wireless Headphones",
    "variants": [...],
    "images": [...],
    "created_at": "2025-10-16T..."
  },
  "admin_url": "https://backend.../app/products/prod_01HJW..."
}
```

### Error (400/500)
```json
{
  "success": false,
  "error": "Product title is required",
  "hint": "Check the console logs for more details"
}
```

---

## 🎉 You're Ready!

Once Railway finishes deploying (2-3 minutes), you can start creating products programmatically!

**Test it with:**
```bash
# Health check
curl https://backend-production-ea59.up.railway.app/health

# When ready, create a product
curl -X POST https://backend-production-ea59.up.railway.app/admin/products/create-full \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d @medusa-backend/example-product.json
```

---

**Happy coding! 🚀**

