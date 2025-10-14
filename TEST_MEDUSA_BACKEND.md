# Testing Your Medusa Backend

## Quick Start

Replace `YOUR_RAILWAY_URL` with your actual Railway deployment URL (e.g., `https://your-app.railway.app`)

## 1. Health Check

**Test if the server is running:**

```bash
curl https://YOUR_RAILWAY_URL/health
```

Expected response:
```json
{
  "status": "ok"
}
```

## 2. Store API Endpoints

### Get All Products

```bash
curl https://YOUR_RAILWAY_URL/store/products
```

### Get Product by ID

```bash
curl https://YOUR_RAILWAY_URL/store/products/{product_id}
```

### Get All Collections

```bash
curl https://YOUR_RAILWAY_URL/store/collections
```

### Get Regions

```bash
curl https://YOUR_RAILWAY_URL/store/regions
```

## 3. Admin API Endpoints

**Note**: Admin endpoints require authentication. First, you need to create an admin user.

### Create Admin User (First Time Setup)

```bash
curl -X POST https://YOUR_RAILWAY_URL/admin/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "supersecret123"
  }'
```

### Login to Get Admin Token

```bash
curl -X POST https://YOUR_RAILWAY_URL/admin/auth \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "supersecret123"
  }'
```

Save the `access_token` from the response.

### List Products (Admin)

```bash
curl https://YOUR_RAILWAY_URL/admin/products \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Create a Product (Admin)

```bash
curl -X POST https://YOUR_RAILWAY_URL/admin/products \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Digital Product",
    "description": "A test digital product",
    "is_giftcard": false,
    "discountable": true,
    "metadata": {
      "isDigital": true
    }
  }'
```

## 4. Test Sanity Webhook Integration

### Send Test Webhook (Product Sync)

```bash
curl -X POST https://YOUR_RAILWAY_URL/store/webhooks/sanity-sync \
  -H "Content-Type: application/json" \
  -H "x-sanity-signature: YOUR_WEBHOOK_SECRET_HASH" \
  -d '{
    "_id": "test-product-123",
    "_type": "product",
    "name": "Test Product from Sanity",
    "slug": {
      "current": "test-product"
    },
    "medusaProductId": null
  }'
```

**Note**: The `x-sanity-signature` header needs to be a valid HMAC SHA256 hash. For testing, you might need to temporarily disable signature verification.

## 5. Using Browser

You can also test some endpoints directly in your browser:

- Health: `https://YOUR_RAILWAY_URL/health`
- Products: `https://YOUR_RAILWAY_URL/store/products`
- Collections: `https://YOUR_RAILWAY_URL/store/collections`
- Regions: `https://YOUR_RAILWAY_URL/store/regions`

## 6. Using Postman or Insomnia

### Import this collection:

1. Create a new collection
2. Set base URL as environment variable: `{{baseUrl}} = https://YOUR_RAILWAY_URL`
3. Add requests for each endpoint above

### Example Postman Collection Structure:

```
Medusa Backend Tests/
├── Health Check (GET /health)
├── Store/
│   ├── Get Products (GET /store/products)
│   ├── Get Product (GET /store/products/:id)
│   ├── Get Collections (GET /store/collections)
│   └── Get Regions (GET /store/regions)
├── Admin/
│   ├── Create Admin User (POST /admin/users)
│   ├── Login (POST /admin/auth)
│   ├── List Products (GET /admin/products)
│   └── Create Product (POST /admin/products)
└── Webhooks/
    └── Sanity Sync (POST /store/webhooks/sanity-sync)
```

## 7. Check Database Connection

If you get errors, check Railway logs:

1. Go to Railway Dashboard
2. Select your Medusa service
3. Click "Deployments" tab
4. Click "View Logs"

Look for:
- Database connection errors
- Migration status
- Server startup messages

## 8. Run Database Migrations

If the database isn't initialized, you might need to run migrations. You can do this by:

### Option A: Via Railway CLI

```bash
railway run npm run migrate
```

### Option B: Add to Dockerfile

The `start:railway` script already includes migrations:
```json
"start:railway": "npm run migrate && medusa start"
```

## 9. Seed Database (Optional)

To add sample data:

```bash
railway run npm run seed
```

## 10. Common Issues & Solutions

### Issue: "Database connection failed"
- **Solution**: Check that DATABASE_URL environment variable is set in Railway
- Verify PostgreSQL database is provisioned and running

### Issue: "CORS error when calling from frontend"
- **Solution**: Add your frontend URL to STORE_CORS environment variable
- Example: `STORE_CORS=https://yourdomain.vercel.app,http://localhost:3000`

### Issue: "Unauthorized" on admin endpoints
- **Solution**: Make sure you're logged in and using the access token
- Token should be sent as: `Authorization: Bearer YOUR_TOKEN`

### Issue: Webhook signature verification fails
- **Solution**: Ensure SANITY_WEBHOOK_SECRET matches your Sanity webhook secret
- For testing, you can temporarily disable verification in the code

## 11. Integration with Your Frontend

Once tested, update your frontend to use the Railway URL:

```typescript
// In your Next.js app
const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || 'https://YOUR_RAILWAY_URL'

// Fetch products
const products = await fetch(`${MEDUSA_BACKEND_URL}/store/products`)
```

## 12. Monitor Your Backend

### Railway Dashboard
- View real-time logs
- Monitor memory/CPU usage
- Check deployment status

### Log Important Events
Your backend logs will show:
- API requests
- Database queries
- Webhook events
- Errors and warnings

## Next Steps

1. ✅ Test health endpoint
2. ✅ Create admin user
3. ✅ Login and get token
4. ✅ Create test products
5. ✅ Test store endpoints
6. ✅ Configure Sanity webhooks
7. ✅ Update frontend to use Railway URL
8. ✅ Test end-to-end flow

## Success Indicators

Your backend is working correctly if:
- ✅ Health check returns 200 OK
- ✅ Can create and login admin user
- ✅ Can fetch products via store API
- ✅ Database migrations run successfully
- ✅ No errors in Railway logs
- ✅ Frontend can connect and fetch data

Happy testing! 🚀


