# 📦 Comprehensive Product Creation API

Complete API documentation for creating products in Medusa v2 with all possible parameters.

---

## 🔗 Endpoint

```
POST /admin/products/create-full
```

**Authentication:** Required (Admin JWT token)

**Content-Type:** `application/json`

---

## 📋 Request Body Structure

### Complete Example (All Parameters)

```json
{
  "title": "Premium Cotton T-Shirt",
  "subtitle": "Comfortable everyday wear",
  "description": "High-quality 100% organic cotton t-shirt with a modern fit. Perfect for casual occasions.",
  "handle": "premium-cotton-tshirt",
  "status": "published",
  "is_giftcard": false,
  "discountable": true,
  
  "type": "apparel",
  "collection_id": "pcol_01HJVN...",
  "category_ids": ["pcat_shirts", "pcat_men"],
  "tags": ["cotton", "organic", "casual", "bestseller"],
  
  "thumbnail": "https://example.com/images/tshirt-main.jpg",
  "images": [
    "https://example.com/images/tshirt-front.jpg",
    "https://example.com/images/tshirt-back.jpg",
    "https://example.com/images/tshirt-detail.jpg"
  ],
  
  "weight": 200,
  "length": 30,
  "height": 1,
  "width": 25,
  "origin_country": "US",
  "hs_code": "6109.10.00",
  "material": "100% Organic Cotton",
  
  "metadata": {
    "care_instructions": "Machine wash cold, tumble dry low",
    "sustainability": "GOTS certified",
    "season": "Spring/Summer 2025"
  },
  
  "options": [
    {
      "title": "Size",
      "values": ["XS", "S", "M", "L", "XL", "XXL"]
    },
    {
      "title": "Color",
      "values": ["Black", "White", "Navy", "Gray"]
    }
  ],
  
  "variants": [
    {
      "title": "Small / Black",
      "sku": "TSHIRT-BLK-S",
      "ean": "1234567890123",
      "barcode": "TSHIRT-BLK-S-001",
      "inventory_quantity": 100,
      "allow_backorder": false,
      "manage_inventory": true,
      "options": [
        { "option": "Size", "value": "S" },
        { "option": "Color", "value": "Black" }
      ],
      "prices": [
        {
          "currency_code": "usd",
          "amount": 2999
        },
        {
          "currency_code": "eur",
          "amount": 2799
        }
      ],
      "weight": 200,
      "metadata": {
        "color_hex": "#000000"
      }
    },
    {
      "title": "Medium / White",
      "sku": "TSHIRT-WHT-M",
      "inventory_quantity": 150,
      "options": [
        { "option": "Size", "value": "M" },
        { "option": "Color", "value": "White" }
      ],
      "prices": [
        {
          "currency_code": "usd",
          "amount": 2999
        }
      ]
    }
  ]
}
```

---

## 📖 Parameter Reference

### 🔹 Basic Information

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | string | ✅ **Yes** | Product name (displayed to customers) |
| `subtitle` | string | No | Short tagline or subtitle |
| `description` | string | No | Full product description (supports markdown) |
| `handle` | string | No | URL-friendly slug (auto-generated if not provided) |

**Example:**
```json
{
  "title": "Vintage Leather Jacket",
  "subtitle": "Timeless style meets modern comfort",
  "description": "Crafted from premium Italian leather...",
  "handle": "vintage-leather-jacket"
}
```

---

### 🔹 Status & Visibility

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `status` | enum | No | `"draft"` | Product status: `draft`, `proposed`, `published`, `rejected` |
| `is_giftcard` | boolean | No | `false` | Mark as gift card product |
| `discountable` | boolean | No | `true` | Allow discounts/promotions on this product |

**Example:**
```json
{
  "status": "published",
  "is_giftcard": false,
  "discountable": true
}
```

---

### 🔹 Organization & Categorization

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | string | No | Product type (e.g., "apparel", "electronics") |
| `collection_id` | string | No | ID of the collection this product belongs to |
| `category_ids` | string[] | No | Array of category IDs |
| `tags` | string[] | No | Array of tag strings for filtering |

**Example:**
```json
{
  "type": "electronics",
  "collection_id": "pcol_01SUMMER2025",
  "category_ids": ["pcat_smartphones", "pcat_android"],
  "tags": ["5G", "flagship", "camera-pro", "bestseller"]
}
```

---

### 🔹 Media & Images

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `thumbnail` | string | No | Main product image URL |
| `images` | string[] | No | Array of image URLs (displayed in order) |

**Example:**
```json
{
  "thumbnail": "https://cdn.example.com/products/phone-main.jpg",
  "images": [
    "https://cdn.example.com/products/phone-front.jpg",
    "https://cdn.example.com/products/phone-back.jpg",
    "https://cdn.example.com/products/phone-side.jpg",
    "https://cdn.example.com/products/phone-detail.jpg"
  ]
}
```

**Tips:**
- Use MinIO or CDN URLs for images
- Recommended image size: 1200x1200px
- First image in array becomes the primary image

---

### 🔹 Physical Properties

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `weight` | number | No | Weight in grams |
| `length` | number | No | Length in centimeters |
| `height` | number | No | Height in centimeters |
| `width` | number | No | Width in centimeters |
| `origin_country` | string | No | ISO 2-letter country code |
| `hs_code` | string | No | Harmonized System code for customs |
| `mid_code` | string | No | Manufacturer Identification code |
| `material` | string | No | Material composition |

**Example:**
```json
{
  "weight": 450,
  "length": 20,
  "height": 10,
  "width": 15,
  "origin_country": "CN",
  "hs_code": "8517.12.00",
  "material": "Aluminum, Glass, Plastic"
}
```

---

### 🔹 SEO & Metadata

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `metadata` | object | No | Custom key-value pairs for any additional data |

**Example:**
```json
{
  "metadata": {
    "seo_title": "Best Wireless Headphones 2025",
    "seo_description": "Premium noise-cancelling...",
    "brand": "AudioPro",
    "model": "AP-3000",
    "warranty": "2 years",
    "certifications": ["FCC", "CE", "RoHS"],
    "features": ["Bluetooth 5.3", "ANC", "40h battery"],
    "release_date": "2025-03-15"
  }
}
```

---

### 🔹 Product Options

Define attributes that create variants (e.g., Size, Color, Style).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✅ **Yes** | Option name |
| `values` | string[] | ✅ **Yes** | Possible values for this option |

**Example:**
```json
{
  "options": [
    {
      "title": "Size",
      "values": ["Small", "Medium", "Large", "X-Large"]
    },
    {
      "title": "Color",
      "values": ["Red", "Blue", "Green", "Black"]
    },
    {
      "title": "Material",
      "values": ["Cotton", "Polyester", "Blend"]
    }
  ]
}
```

---

### 🔹 Variants (Product Variations)

Each variant is a specific combination of options with its own SKU, price, and inventory.

#### Variant Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | string | ✅ **Yes** | Variant name (e.g., "Small / Red") |
| `sku` | string | No | Stock Keeping Unit (unique identifier) |
| `ean` | string | No | European Article Number (barcode) |
| `upc` | string | No | Universal Product Code |
| `barcode` | string | No | General barcode |
| `inventory_quantity` | number | No | Initial stock quantity (default: 0) |
| `allow_backorder` | boolean | No | Allow orders when out of stock (default: false) |
| `manage_inventory` | boolean | No | Track inventory for this variant (default: true) |
| `options` | object[] | No | Option-value pairs for this variant |
| `prices` | object[] | No | Prices in different currencies |
| `weight` | number | No | Weight in grams (overrides product weight) |
| `length` | number | No | Length in cm |
| `height` | number | No | Height in cm |
| `width` | number | No | Width in cm |
| `origin_country` | string | No | Origin country code |
| `hs_code` | string | No | Customs code |
| `mid_code` | string | No | Manufacturer code |
| `material` | string | No | Material composition |
| `metadata` | object | No | Custom variant data |

#### Variant Example

```json
{
  "variants": [
    {
      "title": "Large / Blue / Cotton",
      "sku": "SHIRT-LRG-BLU-COT",
      "ean": "5901234123457",
      "upc": "012345678905",
      "barcode": "SHIRT-LRG-BLU-001",
      "inventory_quantity": 250,
      "allow_backorder": false,
      "manage_inventory": true,
      "options": [
        { "option": "Size", "value": "Large" },
        { "option": "Color", "value": "Blue" },
        { "option": "Material", "value": "Cotton" }
      ],
      "prices": [
        {
          "currency_code": "usd",
          "amount": 3999,
          "min_quantity": 1,
          "max_quantity": 10
        },
        {
          "currency_code": "usd",
          "amount": 3499,
          "min_quantity": 11,
          "max_quantity": 50
        },
        {
          "currency_code": "eur",
          "amount": 3699
        },
        {
          "currency_code": "gbp",
          "amount": 3299
        }
      ],
      "weight": 180,
      "length": 28,
      "height": 1,
      "width": 20,
      "metadata": {
        "color_hex": "#0000FF",
        "pantone": "19-4052 TCX",
        "supplier": "TextileCo Inc",
        "lead_time_days": 7
      }
    }
  ]
}
```

---

### 🔹 Prices

Prices are defined per variant and support multiple currencies and quantity tiers.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `currency_code` | string | ✅ **Yes** | ISO currency code (e.g., "usd", "eur") |
| `amount` | number | ✅ **Yes** | Price in cents (e.g., 2999 = $29.99) |
| `min_quantity` | number | No | Minimum order quantity for this price |
| `max_quantity` | number | No | Maximum order quantity for this price |

**Example: Bulk Pricing**
```json
{
  "prices": [
    {
      "currency_code": "usd",
      "amount": 1999,
      "min_quantity": 1,
      "max_quantity": 9
    },
    {
      "currency_code": "usd",
      "amount": 1799,
      "min_quantity": 10,
      "max_quantity": 49
    },
    {
      "currency_code": "usd",
      "amount": 1499,
      "min_quantity": 50
    }
  ]
}
```

---

## 🚀 Usage Examples

### Example 1: Simple Product (Minimal Fields)

```json
{
  "title": "Basic White T-Shirt",
  "description": "Classic white cotton t-shirt",
  "status": "published",
  "variants": [
    {
      "title": "Default",
      "sku": "WHT-TSHIRT-001",
      "inventory_quantity": 100,
      "prices": [
        {
          "currency_code": "usd",
          "amount": 1999
        }
      ]
    }
  ]
}
```

### Example 2: Product with Multiple Variants

```json
{
  "title": "Classic Jeans",
  "description": "Comfortable denim jeans",
  "status": "published",
  "tags": ["denim", "casual"],
  "options": [
    {
      "title": "Size",
      "values": ["28", "30", "32", "34", "36"]
    },
    {
      "title": "Color",
      "values": ["Blue", "Black"]
    }
  ],
  "variants": [
    {
      "title": "30 / Blue",
      "sku": "JEANS-30-BLU",
      "inventory_quantity": 50,
      "options": [
        { "option": "Size", "value": "30" },
        { "option": "Color", "value": "Blue" }
      ],
      "prices": [
        { "currency_code": "usd", "amount": 5999 }
      ]
    },
    {
      "title": "32 / Black",
      "sku": "JEANS-32-BLK",
      "inventory_quantity": 75,
      "options": [
        { "option": "Size", "value": "32" },
        { "option": "Color", "value": "Black" }
      ],
      "prices": [
        { "currency_code": "usd", "amount": 5999 }
      ]
    }
  ]
}
```

### Example 3: Digital Product (No Physical Properties)

```json
{
  "title": "Premium WordPress Theme",
  "description": "Professional website theme with 50+ templates",
  "status": "published",
  "is_giftcard": false,
  "discountable": true,
  "type": "digital",
  "tags": ["wordpress", "theme", "digital-download"],
  "metadata": {
    "download_link": "https://downloads.example.com/theme-pro",
    "license_type": "single-site",
    "version": "2.5.0",
    "compatibility": "WordPress 6.0+"
  },
  "variants": [
    {
      "title": "Single Site License",
      "sku": "WP-THEME-SINGLE",
      "inventory_quantity": 9999,
      "manage_inventory": false,
      "prices": [
        { "currency_code": "usd", "amount": 5900 }
      ]
    }
  ]
}
```

### Example 4: Gift Card

```json
{
  "title": "Store Gift Card",
  "description": "Redeemable for any products in our store",
  "status": "published",
  "is_giftcard": true,
  "discountable": false,
  "options": [
    {
      "title": "Value",
      "values": ["$25", "$50", "$100", "$200"]
    }
  ],
  "variants": [
    {
      "title": "$25 Gift Card",
      "sku": "GIFTCARD-25",
      "inventory_quantity": 9999,
      "manage_inventory": false,
      "options": [
        { "option": "Value", "value": "$25" }
      ],
      "prices": [
        { "currency_code": "usd", "amount": 2500 }
      ]
    },
    {
      "title": "$50 Gift Card",
      "sku": "GIFTCARD-50",
      "inventory_quantity": 9999,
      "manage_inventory": false,
      "options": [
        { "option": "Value", "value": "$50" }
      ],
      "prices": [
        { "currency_code": "usd", "amount": 5000 }
      ]
    }
  ]
}
```

---

## 📤 Response Format

### Success Response (201 Created)

```json
{
  "success": true,
  "message": "Product created successfully with all details",
  "product": {
    "id": "prod_01HJW...",
    "title": "Premium Cotton T-Shirt",
    "subtitle": "Comfortable everyday wear",
    "description": "High-quality 100% organic cotton...",
    "handle": "premium-cotton-tshirt",
    "status": "published",
    "thumbnail": "https://example.com/images/tshirt-main.jpg",
    "images": [...],
    "options": [...],
    "variants": [
      {
        "id": "variant_01HJW...",
        "title": "Small / Black",
        "sku": "TSHIRT-BLK-S",
        "inventory_quantity": 100,
        "prices": [...]
      }
    ],
    "tags": ["cotton", "organic"],
    "created_at": "2025-10-14T...",
    "updated_at": "2025-10-14T..."
  },
  "admin_url": "https://backend.railway.app/app/products/prod_01HJW..."
}
```

### Error Response (400/500)

```json
{
  "success": false,
  "error": "Product title is required",
  "details": "...",
  "hint": "Check the console logs for more details"
}
```

---

## 🔐 Authentication

This endpoint requires admin authentication. Include your admin JWT token:

```bash
curl -X POST https://your-backend.railway.app/admin/products/create-full \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -d @product.json
```

---

## 💡 Tips & Best Practices

### 1. **SKU Naming Convention**
```
CATEGORY-ATTRIBUTE1-ATTRIBUTE2-SEQUENCE
Example: TSHIRT-BLK-M-001
```

### 2. **Image Optimization**
- Use WebP format for better compression
- Recommended dimensions: 1200x1200px minimum
- Host on CDN for faster loading

### 3. **Pricing in Cents**
Always use cents to avoid floating-point errors:
- $29.99 = `2999`
- €45.50 = `4550`

### 4. **Inventory Management**
- Set `manage_inventory: true` for physical products
- Set `manage_inventory: false` for digital products
- Use `allow_backorder: true` for made-to-order items

### 5. **Metadata Usage**
Store any custom data:
```json
{
  "metadata": {
    "seo_keywords": "organic, cotton, sustainable",
    "vendor": "EcoTextiles Inc",
    "certifications": ["GOTS", "Fair Trade"],
    "care_instructions": "Machine wash cold"
  }
}
```

### 6. **Handle Generation**
Handles must be URL-safe. The API auto-generates from title if not provided:
- "Premium Cotton T-Shirt" → `premium-cotton-tshirt`
- Duplicates get timestamp: `premium-cotton-tshirt-1729000000`

---

## 🧪 Testing

### Test with cURL

```bash
curl -X POST https://backend-production-ea59.up.railway.app/admin/products/create-full \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Test Product",
    "description": "Testing the API",
    "status": "draft",
    "variants": [{
      "title": "Default",
      "sku": "TEST-001",
      "inventory_quantity": 10,
      "prices": [{
        "currency_code": "usd",
        "amount": 999
      }]
    }]
  }'
```

### Test with Postman

1. Create new POST request
2. URL: `https://your-backend/admin/products/create-full`
3. Headers:
   - `Content-Type: application/json`
   - `Authorization: Bearer YOUR_TOKEN`
4. Body (raw JSON): Paste product data
5. Send request

---

## 🔗 Related Endpoints

- `GET /admin/products` - List all products
- `GET /admin/products/:id` - Get single product
- `PUT /admin/products/:id` - Update product
- `DELETE /admin/products/:id` - Delete product
- `POST /admin/products/:id/variants` - Add variant to existing product

---

## 📚 Additional Resources

- **Medusa v2 Docs**: https://docs.medusajs.com/v2
- **Product Module**: https://docs.medusajs.com/v2/resources/commerce-modules/product
- **Admin API**: https://docs.medusajs.com/v2/api-reference/admin

---

**Ready to create products!** 🚀

Use this endpoint to programmatically populate your store with products from any source (CSV, external API, admin panel, etc.).

