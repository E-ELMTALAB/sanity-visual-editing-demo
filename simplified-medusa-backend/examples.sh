#!/bin/bash

# Configuration & Testing Guide for simplified-medusa-backend
# This script demonstrates how to:
# 1. Configure products with variants and prices
# 2. Manage promotions
# 3. Test the full checkout flow

BACKEND_URL="http://localhost:3001"
ADMIN_KEY="admin-secret-key"

echo "============================================"
echo "📦 PRODUCT & PROMOTION MANAGEMENT EXAMPLES"
echo "============================================"

# Test if backend is running
echo -e "\n▶️  Checking backend..."
if ! curl -sS "${BACKEND_URL}/" > /dev/null; then
  echo "❌ Backend not running. Start it with: PORT=3001 npm start"
  exit 1
fi
echo "✅ Backend is running"

# 1. LIST ALL PRODUCTS
echo -e "\n1️⃣  LIST ALL PRODUCTS"
echo "   Command: curl ${BACKEND_URL}/products"
curl -sS "${BACKEND_URL}/products" | jq '.products | map({id, title, variant_count: (.variants | length)})'

# 2. CREATE/UPDATE A NEW PRODUCT
echo -e "\n\n2️⃣  CREATE OR UPDATE A PRODUCT"
echo "   Command: curl -X POST with X-Admin-Key header"
NEW_PRODUCT_ID="prod_customproduct_$(date +%s)"
NEW_PRODUCT=$(cat <<EOF
{
  "id": "${NEW_PRODUCT_ID}",
  "title": "Custom Product",
  "subtitle": "Created via admin endpoint",
  "description": "This product was created using the admin API",
  "handle": "custom-product",
  "status": "published",
  "is_giftcard": false,
  "discountable": true,
  "thumbnail": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
  "variants": [
    {
      "id": "var_custom_1",
      "title": "Single License",
      "sku": "CUSTOM-001",
      "inventory_quantity": 100,
      "manage_inventory": true,
      "allow_backorder": false,
      "prices": [
        { "currency_code": "usd", "amount": 4999 },
        { "currency_code": "eur", "amount": 4599 }
      ]
    }
  ]
}
EOF
)

curl -sS -X POST "${BACKEND_URL}/admin/products" \
  -H "X-Admin-Key: ${ADMIN_KEY}" \
  -H "Content-Type: application/json" \
  -d "${NEW_PRODUCT}" | jq '{success, product: {id: .product.id, title: .product.title}}'

# 3. LIST PROMOTIONS
echo -e "\n\n3️⃣  LIST ALL PROMOTIONS"
echo "   Command: curl ${BACKEND_URL}/promotions"
curl -sS "${BACKEND_URL}/promotions" | jq '.promotions | map({code, type, value, is_active})'

# 4. VALIDATE PROMOTION CODE
echo -e "\n\n4️⃣  VALIDATE PROMOTION CODE"
echo "   Command: curl ${BACKEND_URL}/promotions/validate?code=SUMMER25"
curl -sS "${BACKEND_URL}/promotions/validate?code=SUMMER25" | jq '.'

# 5. CREATE/UPDATE A PROMOTION
echo -e "\n\n5️⃣  CREATE OR UPDATE A PROMOTION"
echo "   Command: curl -X POST with X-Admin-Key header"
NEW_PROMO=$(cat <<EOF
{
  "id": "promo_custom_$(date +%s)",
  "code": "CUSTOM20",
  "type": "percentage",
  "value": 20,
  "description": "20% off custom promotion",
  "max_uses": 500,
  "current_uses": 0,
  "is_active": true,
  "metadata": {
    "campaign": "custom-campaign"
  }
}
EOF
)

curl -sS -X POST "${BACKEND_URL}/admin/promotions" \
  -H "X-Admin-Key: ${ADMIN_KEY}" \
  -H "Content-Type: application/json" \
  -d "${NEW_PROMO}" | jq '{success, promotion: {id: .promotion.id, code: .promotion.code}}'

# 6. CALCULATE CART WITH PROMOTION
echo -e "\n\n6️⃣  CALCULATE CART WITH PROMOTION"
echo "   Command: curl -X POST /cart with items and promotion_code"
CART=$(cat <<EOF
{
  "items": [
    {"product_id": "prod_01HJW1234ABCDEF", "quantity": 2},
    {"product_id": "prod_01HJW1234ABCDEH", "quantity": 1}
  ],
  "promotion_code": "SUMMER25",
  "currency": "usd"
}
EOF
)

curl -sS -X POST "${BACKEND_URL}/cart" \
  -H "Content-Type: application/json" \
  -d "${CART}" | jq '{
    subtotal: (.subtotal_cents / 100),
    discount: (.discount_cents / 100),
    promotion: .promotion.code,
    tax: (.tax_cents / 100),
    total: (.total_cents / 100),
    currency: .currency
  }'

# 7. CREATE ORDER / CHECKOUT
echo -e "\n\n7️⃣  CREATE ORDER (CHECKOUT)"
echo "   Command: curl -X POST /checkout"
CHECKOUT=$(cat <<EOF
{
  "items": [
    {"product_id": "prod_01HJW1234ABCDEF", "quantity": 1}
  ],
  "promotion_code": "WELCOME10",
  "currency": "usd",
  "customer_email": "customer@example.com"
}
EOF
)

ORDER=$(curl -sS -X POST "${BACKEND_URL}/checkout" \
  -H "Content-Type: application/json" \
  -d "${CHECKOUT}")

ORDER_ID=$(echo "${ORDER}" | jq -r '.order.id')

echo "${ORDER}" | jq '{
  order_id: .order.id,
  status: .order.status,
  total: (.order.total_cents / 100),
  subtotal: (.order.subtotal_cents / 100),
  discount: (.order.discount_cents / 100),
  promo: .order.promotion_code,
  has_payment_url: (.payment_url != null)
}'

# 8. RETRIEVE ORDER
echo -e "\n\n8️⃣  RETRIEVE ORDER DETAILS"
echo "   Command: curl ${BACKEND_URL}/orders/{id}"
curl -sS "${BACKEND_URL}/orders/${ORDER_ID}" | jq '.order | {id, status, total_cents, discount_cents, promotion_code, created_at}'

echo -e "\n\n============================================"
echo "✅ EXAMPLES COMPLETE"
echo "============================================"
echo -e "\n📖 Configuration Guide:\n"
echo "To customize products, prices, and promotions:"
echo "1. Edit data.json directly"
echo "2. Or use the admin endpoints:"
echo "   - POST /admin/products (create/update)"
echo "   - DELETE /admin/products/:id"
echo "   - POST /admin/promotions (create/update)"
echo "   - DELETE /admin/promotions/:id"
echo ""
echo "All admin endpoints require: X-Admin-Key: ${ADMIN_KEY}"
echo "============================================"
