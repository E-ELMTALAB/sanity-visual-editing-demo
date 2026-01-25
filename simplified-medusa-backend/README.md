# simplified-medusa-backend

Minimal backend that provides products, price calculation, promotions and checkout—matching the exact structure of Medusa's commerce API. Fully configurable via `data.json`.

## Quick start

1. Install dependencies

```bash
cd simplified-medusa-backend
npm install
```

2. Run locally

```bash
PORT=3000 npm start
```

## Configuration

All products, variants, and promotions are stored in `data.json`. Edit this file to customize:
- Product details (title, description, images, variants, prices)
- Variant options, inventory, and pricing per currency
- Promotions (percentage/fixed discounts, active status, usage limits)

Example `data.json` structure matches Medusa's product schema exactly:
```json
{
  "products": [
    {
      "id": "prod_...",
      "title": "Product Name",
      "variants": [
        {
          "id": "var_...",
          "title": "Variant Title",
          "prices": [
            { "currency_code": "usd", "amount": 2999 }
          ]
        }
      ]
    }
  ],
  "promotions": [
    {
      "code": "SUMMER25",
      "type": "percentage",
      "value": 25
    }
  ]
}
```

## Environment

- `PORT` — port to listen on (default 3000)
- `STRIPE_SECRET_KEY` — optional; if set, `/checkout` returns `client_secret` for Stripe PaymentIntent. Otherwise returns mock `payment_url`
- `DEFAULT_TAX_RATE` — decimal tax rate (default `0.1` for 10%)
- `ADMIN_KEY` — admin API key for protected endpoints (default `admin-secret-key`)
 - `ZARINPAL_MERCHANT_ID` — optional; if set the `/checkout` route can create a Zarinpal PaymentRequest and return a `payment_url` to redirect the user
 - `ZARINPAL_CALLBACK_BASE` — base URL for Zarinpal callbacks (e.g. `https://backend.sharifgpt.com`)
 - `ZARINPAL_SANDBOX` — `true|false` (default `true`)
 - `ZARINPAL_CONVERSION_RATE` — required to convert USD (or other currencies) to IRR for Zarinpal (e.g. `420000`)
 - `FRONTEND_SUCCESS_URL` — frontend redirect after successful Zarinpal verification
 - `FRONTEND_FAILURE_URL` — frontend redirect after failed Zarinpal verification

## Client-Facing Endpoints

### Products

- `GET /products` — list all products with full structure (variants, prices, options)
- `GET /products/:id` — single product details

### Promotions

- `GET /promotions` — list all active promotions
- `GET /promotions/validate?code=CODE` — validate a promotion code

### Cart & Checkout

- `POST /cart` — calculate cart totals with optional promotion
  ```json
  {
    "items": [
      { "product_id": "prod_...", "variant_id": "var_...", "quantity": 2 }
    ],
    "promotion_code": "SUMMER25",
    "currency": "usd"
  }
  ```
  Returns: `{ lines, subtotal_cents, discount_cents, tax_cents, total_cents, currency, promotion }`

- `POST /checkout` — create order and payment
  ```json
  {
    "items": [...],
    "promotion_code": "SUMMER25",
    "currency": "usd",
    "customer_email": "user@example.com"
  }
  ```
  Returns: `{ order, client_secret }` (Stripe) or `{ order, payment_url }` (mock) or `{ order, payment_url, provider: 'zarinpal' }` (Zarinpal)

If you enable Zarinpal (`ZARINPAL_MERCHANT_ID` + `ZARINPAL_CONVERSION_RATE`), the route will create a Zarinpal payment request and return a `payment_url`. Zarinpal will redirect back to `/pay/zarinpal/callback?order_id=...&Authority=...&Status=OK` which the server verifies and then redirects to `FRONTEND_SUCCESS_URL` or `FRONTEND_FAILURE_URL`.

- `GET /orders/:id` — retrieve order details

### Admin Endpoints (Protected)

All admin endpoints require `X-Admin-Key: <ADMIN_KEY>` header.

- `GET /admin/data` — get entire data.json
- `POST /admin/products` — create/update product
- `DELETE /admin/products/:id` — delete product
- `POST /admin/promotions` — create/update promotion
- `DELETE /admin/promotions/:id` — delete promotion

Example:
```bash
curl -X POST http://localhost:3000/admin/products \
  -H "X-Admin-Key: admin-secret-key" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "prod_new",
    "title": "New Product",
    "variants": [...]
  }'
```

## Medusa Compatibility

This backend mirrors Medusa's structure:
- Products have multiple variants
- Variants have prices per currency
- Prices are stored in smallest unit (cents)
- Options define variant attributes
- Metadata stores additional fields (original_price, discount_percentage, etc.)

## Deploying to Liara

1. Push code to your Liara project
2. Set environment variables in Liara dashboard:
   - `PORT=3000`
   - `ADMIN_KEY=<your-secret>`
   - `STRIPE_SECRET_KEY=<optional>`
3. Deploy via Liara CLI or dashboard

## Docker

```bash
docker build -t simplified-medusa-backend .
docker run -p 3000:3000 \
  -e PORT=3000 \
  -e ADMIN_KEY=admin-secret-key \
  simplified-medusa-backend
```

## Testing

Start the server and test with curl:

```bash
# List products
curl http://localhost:3000/products

# Calculate cart with promotion
curl -X POST http://localhost:3000/cart \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"product_id": "prod_01HJW1234ABCDEF", "quantity": 2}],
    "promotion_code": "SUMMER25"
  }'

# Checkout
curl -X POST http://localhost:3000/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"product_id": "prod_01HJW1234ABCDEF", "quantity": 1}],
    "currency": "usd",
    "customer_email": "test@example.com"
  }'
```

