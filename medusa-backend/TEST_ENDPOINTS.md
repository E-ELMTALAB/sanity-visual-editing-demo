# 🧪 Medusa Backend Test Endpoints

Comprehensive testing and diagnostic endpoints for your Medusa v2 backend.

## 📍 Available Endpoints

### 1. **Full Diagnostics** (Recommended First)
```bash
GET /store/diagnostics
```

**What it does:**
- ✅ Tests database connectivity
- ✅ Tests all core modules (Product, Region, Currency, Store)
- ✅ Shows configuration status (Database, Redis, MinIO, Resend, Stripe, Meilisearch)
- ✅ Lists available Medusa modules
- ✅ Provides overall health status

**Example:**
```bash
# Local
curl http://localhost:9000/store/diagnostics

# Railway
curl https://your-medusa.railway.app/store/diagnostics
```

**Response:**
```json
{
  "timestamp": "2025-10-14T14:30:00.000Z",
  "status": "✅ All Systems Operational",
  "environment": "production",
  "tests": {
    "database": {
      "status": "✅ Connected",
      "productsCount": 3,
      "sample": [...]
    },
    "regions": {
      "status": "✅ Available",
      "count": 2,
      "regions": [...]
    }
  },
  "config": {
    "database": { "configured": true },
    "redis": { "configured": true },
    "minio": { "configured": true }
  },
  "errors": []
}
```

---

### 2. **Database & Modules Test**
```bash
GET /store/test-database
```

**What it does:**
- Tests database connection through multiple modules
- Shows record counts for each module
- Provides success rate

**Example:**
```bash
curl https://your-medusa.railway.app/store/test-database
```

**Response:**
```json
{
  "database": { "connection": "✅ Connected" },
  "modules": [
    {
      "name": "Product Module",
      "status": "✅ Working",
      "totalRecords": 15
    },
    {
      "name": "Region Module",
      "status": "✅ Working",
      "totalRecords": 2
    }
  ],
  "summary": {
    "successfulModules": 5,
    "totalModules": 5,
    "successRate": "100%"
  }
}
```

---

### 3. **Redis Connection Test**
```bash
GET /store/test-redis
```

**What it does:**
- Tests Redis connectivity
- Performs SET/GET/DELETE operations
- Shows Redis version

**Example:**
```bash
curl https://your-medusa.railway.app/store/test-redis
```

**Response:**
```json
{
  "status": "✅ All Redis Tests Passed",
  "redis": {
    "configured": true,
    "version": "7.2.4"
  },
  "tests": [
    { "name": "Connection", "status": "✅ Connected" },
    { "name": "SET Operation", "status": "✅ Success" },
    { "name": "GET Operation", "status": "✅ Success" }
  ]
}
```

---

### 4. **List Products**
```bash
GET /store/test-products?limit=10&offset=0
```

**What it does:**
- Lists products with full details
- Supports pagination
- Shows variants, images, tags, categories

**Parameters:**
- `limit`: Number of products (default: 10)
- `offset`: Pagination offset (default: 0)

**Example:**
```bash
curl "https://your-medusa.railway.app/store/test-products?limit=5"
```

**Response:**
```json
{
  "success": true,
  "pagination": {
    "total": 25,
    "limit": 5,
    "offset": 0,
    "hasMore": true
  },
  "products": [
    {
      "id": "prod_123",
      "title": "Cool Product",
      "handle": "cool-product",
      "status": "published",
      "variants": [...],
      "images": [...]
    }
  ]
}
```

---

### 5. **Create Test Product**
```bash
POST /store/test-create
```

**What it does:**
- Creates a test product in your database
- Creates as draft status (won't appear in storefront)
- Useful for testing write operations

**Body:**
```json
{
  "title": "Test Product",
  "description": "Testing product creation",
  "price": 2999
}
```

**Example:**
```bash
curl -X POST https://your-medusa.railway.app/store/test-create \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Test Product",
    "description": "Created via API",
    "price": 1999
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Test product created successfully",
  "product": {
    "id": "prod_01JVMX...",
    "title": "My Test Product",
    "status": "draft",
    "handle": "test-1729000000"
  },
  "note": "This is a draft product. You can view it in the admin dashboard."
}
```

---

## 🚀 Quick Test Script

Test all endpoints at once:

```bash
#!/bin/bash
BASE_URL="https://your-medusa.railway.app"

echo "🧪 Testing Medusa Backend..."
echo ""

echo "1️⃣ Full Diagnostics:"
curl -s "$BASE_URL/store/diagnostics" | jq '.status, .tests.database.status, .config'
echo ""

echo "2️⃣ Database Test:"
curl -s "$BASE_URL/store/test-database" | jq '.summary'
echo ""

echo "3️⃣ Redis Test:"
curl -s "$BASE_URL/store/test-redis" | jq '.status, .redis.version'
echo ""

echo "4️⃣ List Products:"
curl -s "$BASE_URL/store/test-products?limit=3" | jq '.pagination, .products[].title'
echo ""

echo "✅ All tests complete!"
```

---

## 🎯 Testing Workflow

### Initial Deployment Test:
1. **Run Diagnostics** to check overall health
2. **Run Database Test** to verify all modules
3. **Run Redis Test** to verify cache/event bus

### Regular Testing:
1. **List Products** to verify data access
2. **Create Test Product** to verify write operations
3. **Check Admin Dashboard** at `/app`

### Troubleshooting:
If any test fails, check:
- Railway environment variables
- Database connection
- Redis connection
- Service logs in Railway

---

## 📊 Expected Results (Fresh Install)

**Diagnostics:**
```json
{
  "status": "✅ All Systems Operational",
  "tests": {
    "database": "✅ Connected",
    "regions": "✅ Available",
    "store": "✅ Available"
  },
  "config": {
    "database": { "configured": true },
    "redis": { "configured": true }
  }
}
```

**Note:** 
- Fresh database will have **0 products** until you seed or create them
- Regions might be 0 until initial setup is run
- All module tests should pass even with empty data

---

## 🔒 Security Note

These endpoints are in the `/store/` namespace (public-facing). In production, you may want to:

1. **Move to Admin namespace:**
   - Change paths from `src/api/store/` to `src/api/admin/`
   - Requires admin authentication

2. **Add API key protection:**
   ```typescript
   if (req.headers['x-api-key'] !== process.env.TEST_API_KEY) {
     return res.status(401).json({ error: "Unauthorized" });
   }
   ```

3. **Disable in production:**
   ```typescript
   if (process.env.NODE_ENV === "production") {
     return res.status(404).json({ error: "Not found" });
   }
   ```

---

## 🌐 Access URLs

### Railway Deployment:
```
Full Diagnostics: https://backend-production-ea59.up.railway.app/store/diagnostics
Database Test:    https://backend-production-ea59.up.railway.app/store/test-database
Redis Test:       https://backend-production-ea59.up.railway.app/store/test-redis
List Products:    https://backend-production-ea59.up.railway.app/store/test-products
Create Product:   https://backend-production-ea59.up.railway.app/store/test-create
```

### Local Development:
```
Full Diagnostics: http://localhost:9000/store/diagnostics
Database Test:    http://localhost:9000/store/test-database
Redis Test:       http://localhost:9000/store/test-redis
List Products:    http://localhost:9000/store/test-products
Create Product:   http://localhost:9000/store/test-create
```

---

**Ready to test!** 🎉

Start with `/store/diagnostics` to get a complete overview of your backend status.

