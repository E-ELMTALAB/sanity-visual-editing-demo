# API Quick Reference

## Base URL
```
http://localhost:3001 (local)
https://your-liara-domain.com (production)
```

## Authentication
Admin endpoints require the header:
```
X-Admin-Key: admin-secret-key
```

## 🛍️ Client Endpoints (Public)

### Products

**GET /products**
- List all products with variants, prices, options
- Query: `limit`, `offset`
- Returns: `{ products: [...], count, offset, limit }`

**GET /products/:id**
- Get single product with full details
- Returns: `{ product: {...} }`

### Promotions

**GET /promotions**
- List all active promotions
- Returns: `{ promotions: [...], count }`

**GET /promotions/validate?code=CODE**
- Validate a promotion code
- Returns: `{ valid: true, promotion: {...} }` or `{ valid: false }`

### Cart

**POST /cart**
```json
{
  "items": [
    {
      "product_id": "prod_...",
      "variant_id": "var_...",  // optional
      "quantity": 2
    }
  ],
  "promotion_code": "SUMMER25",  // optional
  "currency": "usd"  // optional, default usd
}
```
Returns: Cart totals with breakdown
```json
{
  "lines": [...],
  "subtotal_cents": 59998,
  "discount_cents": 15000,
  "promotion": {...},
  "tax_cents": 4500,
  "total_cents": 49498,
  "currency": "usd"
}
```

### Checkout

**POST /checkout**
```json
{
  "items": [{"product_id": "prod_...", "quantity": 1}],
  "promotion_code": "SUMMER25",  // optional
  "currency": "usd",
  "customer_email": "user@example.com"
}
```
Returns:
- **With Stripe**: `{ order: {...}, client_secret: "pi_..." }`
- **Without Stripe**: `{ order: {...}, payment_url: "http://..." }`
- **With Zarinpal**: `{ order: {...}, payment_url: "https://sandbox.zarinpal.com/pg/StartPay/{Authority}", provider: 'zarinpal' }`

### Orders

**GET /orders/:id**
- Retrieve order details
- Returns: `{ order: {...} }`

**GET /pay/mock/:orderId**
- Mock payment confirmation (for testing without Stripe)
- Marks order as `paid`

---

## 👨‍💼 Admin Endpoints (Protected)

All require `X-Admin-Key: admin-secret-key` header

### Data Management

**GET /admin/data**
- Get entire data.json (all products and promotions)
- Returns: `{ products: [...], promotions: [...] }`

### Product Management

**POST /admin/products**
```json
{
  "id": "prod_newid",
  "title": "New Product",
  "description": "...",
  "handle": "new-product",
  "status": "published",
  "variants": [
    {
      "id": "var_...",
      "title": "Variant Title",
      "sku": "SKU-001",
      "prices": [
        { "currency_code": "usd", "amount": 2999 },
        { "currency_code": "eur", "amount": 2699 }
      ],
      "inventory_quantity": 100
    }
  ]
}
```
Returns: `{ success: true, product: {...} }`

**DELETE /admin/products/:id**
- Delete a product
- Returns: `{ success: true, message: "...", product: {...} }`

### Promotion Management

**POST /admin/promotions**
```json
{
  "id": "promo_newid",
  "code": "SUMMER25",
  "type": "percentage",  // or "fixed"
  "value": 25,  // percentage value
  "value_cents": null,  // use for fixed discount
  "description": "25% off",
  "is_active": true,
  "max_uses": null,  // unlimited if null
  "current_uses": 0,
  "metadata": {}
}
```
Returns: `{ success: true, promotion: {...} }`

**DELETE /admin/promotions/:id**
- Delete a promotion
- Returns: `{ success: true, message: "...", promotion: {...} }`

---

## 📦 Data Structure (Medusa Compatible)

### Product
```json
{
  "id": "prod_...",
  "title": "Product Name",
  "subtitle": "Subtitle",
  "description": "Long description",
  "handle": "product-slug",
  "status": "published",  // or "draft"
  "thumbnail": "https://image-url",
  "images": [
    { "id": "img_...", "url": "...", "position": 0 }
  ],
  "options": [
    {
      "id": "opt_...",
      "title": "Color",
      "values": [
        { "id": "val_...", "value": "Black" }
      ]
    }
  ],
  "variants": [
    {
      "id": "var_...",
      "title": "Black / Large",
      "sku": "PROD-BLK-L",
      "barcode": "...",
      "inventory_quantity": 100,
      "manage_inventory": true,
      "prices": [
        { "currency_code": "usd", "amount": 2999 },
        { "currency_code": "eur", "amount": 2699 }
      ],
      "options": [
        { "option_id": "opt_...", "value": "Black" }
      ],
      "metadata": {
        "original_price": 3999,
        "discount_percentage": 25
      }
    }
  ],
  "tags": [
    { "id": "tag_...", "value": "bestseller" }
  ],
  "metadata": {},
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-01-23T12:00:00Z"
}
```

### Promotion
```json
{
  "id": "promo_...",
  "code": "SUMMER25",
  "type": "percentage",
  "value": 25,
  "value_cents": null,
  "description": "25% off all products",
  "is_active": true,
  "max_uses": null,
  "current_uses": 0,
  "starts_at": "2025-01-01T00:00:00Z",
  "ends_at": "2025-12-31T23:59:59Z",
  "metadata": {}
}
```

---

## 💡 Examples

### Create product with curl
```bash
curl -X POST http://localhost:3001/admin/products \
  -H "X-Admin-Key: admin-secret-key" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "prod_new",
    "title": "New Product",
    "variants": [
      {
        "id": "var_new",
        "title": "Default",
        "sku": "NEW-001",
        "prices": [{"currency_code": "usd", "amount": 4999}]
      }
    ]
  }'
```

### Calculate cart
```bash
curl -X POST http://localhost:3001/cart \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"product_id": "prod_01HJW1234ABCDEF", "quantity": 2}
    ],
    "promotion_code": "SUMMER25",
    "currency": "usd"
  }'
```

### Checkout with Stripe (requires STRIPE_SECRET_KEY env var)
```bash
curl -X POST http://localhost:3001/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"product_id": "prod_...", "quantity": 1}],
    "currency": "usd",
    "customer_email": "user@example.com"
  }'
# Returns: { order: {...}, client_secret: "pi_..." }

### Checkout with Zarinpal
Set `ZARINPAL_MERCHANT_ID`, `ZARINPAL_CONVERSION_RATE`, and `ZARINPAL_CALLBACK_BASE` in environment.

Request body (optionally specify `payment_provider: "zarinpal"`):

```json
{
  "items": [{"product_id": "prod_...", "quantity": 1}],
  "currency": "usd",
  "payment_provider": "zarinpal",
  "customer_email": "user@example.com"
}
```

Response:

```json
{
  "order": {...},
  "payment_url": "https://sandbox.zarinpal.com/pg/StartPay/{Authority}",
  "provider": "zarinpal",
  "authority": "..."
}
```

Zarinpal will redirect back to `ZARINPAL_CALLBACK_BASE/pay/zarinpal/callback?order_id=...&Authority=...&Status=OK` and the server will verify the payment and redirect the user to `FRONTEND_SUCCESS_URL` or `FRONTEND_FAILURE_URL`.
```

---

## 📋 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3000 | Server port |
| `STRIPE_SECRET_KEY` | (empty) | Stripe API key (optional) |
| `DEFAULT_TAX_RATE` | 0.1 | Tax rate as decimal (10% = 0.1) |
| `ADMIN_KEY` | admin-secret-key | Admin API key |

---

## ⚙️ Configuration

All data is stored in `data.json`:
- Edit directly to modify products/promotions
- Changes saved via admin endpoints persist to disk
- On startup, data.json is loaded into memory

To reset to defaults:
1. Backup current `data.json`
2. Revert or edit as needed
3. Restart server
