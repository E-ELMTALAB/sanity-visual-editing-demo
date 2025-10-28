# 🚀 Medusa v2 API Development Guide

**Complete do's and don'ts for creating APIs in Medusa v2**, based on real-world implementation experience.

---

## 📋 Quick Reference

| Aspect | ✅ Do | ❌ Don't |
|--------|-------|----------|
| **Routes** | Use root-level paths like `/health`, `/diagnostics` | Use `/test/` paths (reserved in v2) |
| **Structure** | `src/api/endpoint/route.ts` | `src/api/routes/` nested structure |
| **Methods** | `export const GET`, `export const POST` | Express-style `router.get()` |
| **Tags** | Reference by existing tag IDs | Pass `{ value: "name" }` objects |
| **Variants** | Use proper DTOs with `product_id` | Mix variant creation with product creation |
| **Errors** | Throw MedusaError with proper format | Return generic 500 errors |
| **Auth** | Check `req.user` for admin routes | Assume all endpoints need auth |
| **Modules** | Use `req.scope.resolve(Modules.X)` | Import services directly |

---

## 🏗️ API Route Structure

### ✅ **Correct Structure**

```
medusa-backend/
├── src/
│   └── api/
│       ├── health/route.ts           # ✅ Working
│       ├── diagnostics/route.ts      # ✅ Working
│       ├── create-sample-product/route.ts  # ✅ Working
│       └── admin/
│           └── products/
│               └── create-full/route.ts
```

### ❌ **Avoid These Patterns**

```typescript
// ❌ DON'T: Use /test/ paths (reserved in Medusa v2)
export const GET = async (req, res) => {
  // This won't work in v2
}

// ❌ DON'T: Nest routes in routes/ folder
// medusa-backend/src/api/routes/store/products/route.ts

// ❌ DON'T: Use Express-style routing
// const router = Router()
// router.get('/endpoint', handler)
```

### ✅ **Correct Route Pattern**

```typescript
// ✅ DO: Use root-level API paths
import { MedusaRequest, MedusaResponse } from "@medusajs/framework"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    // Your logic here
    res.status(200).json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
```

---

## 🔧 Module Resolution & Services

### ✅ **Correct Module Usage**

```typescript
import { IProductModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

// ✅ DO: Use dependency injection pattern
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const productService: IProductModuleService = req.scope.resolve(Modules.PRODUCT)

  const [products, count] = await productService.listAndCountProducts()
  // ...
}
```

### ❌ **Avoid These Patterns**

```typescript
// ❌ DON'T: Import services directly (v2 uses DI)
import { ProductService } from "@medusajs/medusa"

// ❌ DON'T: Use v1 service instantiation
const productService = new ProductService({ ... })

// ❌ DON'T: Use old method signatures
const products = await productService.listProducts() // ❌ Wrong in v2
```

---

## 🏷️ Tags & Categories

### ✅ **Correct Tag Handling**

```typescript
// ✅ DO: Create tags first, then reference by ID
const tagService = req.scope.resolve(Modules.TAG)

// First, upsert tag by value
const tag = await tagService.upsertTags([
  { value: "wireless", type: "product" }
])

// Then use tag ID when creating product
const productData = {
  // ... other product fields
  tags: [{ id: tag.id }] // ✅ Reference by ID
}
```

### ❌ **Avoid This Pattern**

```typescript
// ❌ DON'T: Pass tag objects with value field
const productData = {
  tags: [
    { value: "wireless" },  // ❌ This causes "Tag with id undefined" error
    { value: "bluetooth" }
  ]
}
```

---

## 🎨 Product Variants

### ✅ **Correct Variant Creation**

```typescript
// ✅ DO: Create product first, then variants separately
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const productService: IProductModuleService = req.scope.resolve(Modules.PRODUCT)

  // 1. Create product first
  const products = await productService.createProducts(productData)
  const product = Array.isArray(products) ? products[0] : products

  // 2. Create variants with product_id
  const variantData = {
    product_id: product.id,
    title: "Midnight Black",
    sku: "HDPHN-BLK-001",
    metadata: {
      inventory_quantity: 100,
      prices: [{ currency_code: "usd", amount: 34999 }]
    }
  }

  const variants = await productService.createProductVariants(variantData)
}
```

### ❌ **Avoid These Patterns**

```typescript
// ❌ DON'T: Mix product and variant creation
const productWithVariants = {
  // product fields...
  variants: [ /* variant data */ ] // ❌ This doesn't work in v2
}

// ❌ DON'T: Create variants without product_id
const variantData = {
  title: "Color Variant"
  // Missing product_id! ❌
}
```

---

## 🖼️ Images & Media

### ✅ **Correct Image Handling**

```typescript
// ✅ DO: Use URLs or image objects with proper structure
const productData = {
  // ... other fields
  images: [
    "https://example.com/image1.jpg",  // ✅ String URLs work
    {
      url: "https://example.com/image2.jpg",
      position: 0  // ✅ Explicit positioning
    }
  ]
}
```

### ❌ **Avoid These Patterns**

```typescript
// ❌ DON'T: Use complex image objects without URLs
const productData = {
  images: [
    { position: 0 }  // ❌ Missing URL
  ]
}
```

---

## 🛡️ Error Handling

### ✅ **Proper Error Responses**

```typescript
import { MedusaError } from "@medusajs/framework/utils"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    // Your logic
  } catch (error) {
    console.error("Detailed error:", error)

    // ✅ DO: Include stack trace in development
    const isDev = process.env.NODE_ENV === "development"

    return res.status(500).json({
      success: false,
      error: error.message,
      ...(isDev && { stack: error.stack }),
      hint: "Check Railway logs for more details"
    })
  }
}
```

### ❌ **Avoid These Patterns**

```typescript
// ❌ DON'T: Generic 500 with no details
catch (error) {
  res.status(500).json({ error: "Something went wrong" })
}

// ❌ DON'T: Expose internal errors in production
catch (error) {
  res.status(500).json({ error: error.stack }) // ❌ Security risk
}
```

---

## 🔐 Authentication Patterns

### ✅ **Admin Endpoints (JWT Required)**

```typescript
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  // ✅ DO: Check for authenticated user
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" })
  }

  // Admin-only logic here
}
```

### ✅ **Public Endpoints (No Auth)**

```typescript
// ✅ DO: Create public endpoints for testing
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  // No auth check needed for diagnostics
  res.status(200).json({ status: "ok" })
}
```

---

## 📊 Response Formatting

### ✅ **Consistent Response Structure**

```typescript
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const result = await someOperation()

    return res.status(201).json({
      success: true,
      message: "Operation completed successfully",
      data: result,  // ✅ Structured data
      admin_url: `https://your-domain/app/products/${result.id}`,
      store_url: `https://your-domain/store/products/${result.handle}`
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
      hint: "Check your input data"
    })
  }
}
```

---

## 🚀 Deployment & Environment

### ✅ **Railway Configuration**

**In Railway Dashboard:**
1. **Root Directory:** Set to `medusa-backend` (not blank!)
2. **Environment Variables:** Configure all services:
   ```env
   DATABASE_URL=postgresql://...
   REDIS_URL=redis://...
   JWT_SECRET=your-secret
   STORE_CORS=https://your-frontend.com
   ```

3. **Build Logs:** Always check for compilation errors

### ❌ **Common Deployment Issues**

```bash
# ❌ DON'T: Leave root directory blank
# ❌ DON'T: Forget to set DATABASE_URL
# ❌ DON'T: Use old v1 package versions
# ❌ DON'T: Miss environment variable dependencies
```

---

## 🧪 Testing & Debugging

### ✅ **Testing Strategy**

```typescript
// ✅ DO: Create multiple test endpoints
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    tests: {},
    errors: []
  }

  // Test database connectivity
  try {
    const productService = req.scope.resolve(Modules.PRODUCT)
    await productService.listProducts()
    diagnostics.tests.database = "✅ Connected"
  } catch (error) {
    diagnostics.tests.database = "❌ Failed"
    diagnostics.errors.push({ test: "database", error: error.message })
  }

  res.status(200).json(diagnostics)
}
```

### ✅ **Debugging Tools**

```bash
# ✅ DO: Use Railway logs to debug 500 errors
# ✅ DO: Check if all environment variables are set
# ✅ DO: Verify module resolution works
# ✅ DO: Test endpoints incrementally
```

---

## 📚 Common Pitfalls & Solutions

### **1. Tag ID Errors**

**Problem:** `"Tag with id undefined not found"`

**Solution:**
```typescript
// ✅ DO: Create/find tags first, then use IDs
const tagService = req.scope.resolve(Modules.TAG)
const tag = await tagService.upsertTags([{ value: "wireless" }])

const productData = {
  tags: [{ id: tag.id }]  // ✅ Use ID, not value
}
```

---

### **2. Variant Option Mismatches**

**Problem:** Complex option structures causing errors

**Solution:**
```typescript
// ✅ DO: Keep variant options simple
const variantData = {
  product_id: product.id,
  title: "Color Variant",
  // ✅ Use Record<string, string> for options
  options: {
    Color: "Midnight Black"
  }
}
```

---

### **3. Module Resolution Errors**

**Problem:** `Cannot resolve module` errors

**Solution:**
```typescript
// ✅ DO: Use correct import paths
import { Modules } from "@medusajs/framework/utils"
import { IProductModuleService } from "@medusajs/framework/types"

// ✅ DO: Use DI pattern
const service = req.scope.resolve(Modules.PRODUCT)
```

---

### **4. Environment Variable Issues**

**Problem:** Services fail to start due to missing config

**Solution:**
```typescript
// ✅ DO: Check all required env vars are set
const requiredEnvVars = [
  'DATABASE_URL',
  'REDIS_URL',
  'JWT_SECRET',
  'STORE_CORS'
]

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`)
  }
}
```

---

## 🎯 Best Practices Summary

### **✅ Always Do**

1. **Use root-level API paths** (`/diagnostics`, `/create-product`)
2. **Follow v2 module patterns** (`req.scope.resolve(Modules.X)`)
3. **Handle errors gracefully** with detailed messages
4. **Test incrementally** (create product → add variants → attach tags)
5. **Check Railway logs** for deployment issues
6. **Use proper TypeScript types** (`MedusaRequest`, `MedusaResponse`)
7. **Include helpful response data** (URLs, IDs, metadata)

### **❌ Never Do**

1. **Don't use `/test/` paths** (reserved in v2)
2. **Don't pass tag values directly** (use IDs after upserting)
3. **Don't mix product and variant creation**
4. **Don't expose stack traces in production**
5. **Don't assume old v1 patterns work in v2**
6. **Don't skip environment variable configuration**
7. **Don't ignore Railway build logs**

---

## 🔧 Quick Setup Checklist

### **Before Creating APIs**

- [ ] Railway `Root Directory` set to `medusa-backend`
- [ ] All environment variables configured
- [ ] Database and Redis URLs working
- [ ] Medusa v2 dependencies installed

### **When Creating New Endpoints**

- [ ] Use `src/api/endpoint/route.ts` structure
- [ ] Export `GET`, `POST` etc. (not Express router)
- [ ] Use `req.scope.resolve(Modules.X)` for services
- [ ] Handle errors with proper JSON responses
- [ ] Test with simple payloads first
- [ ] Check Railway logs if 500 errors occur

### **For Production**

- [ ] Add proper authentication where needed
- [ ] Validate input data
- [ ] Include error hints for debugging
- [ ] Monitor Railway logs regularly
- [ ] Keep environment variables updated

---

## 📈 Advanced Patterns

### **Tag Management Flow**

```typescript
// ✅ DO: Implement proper tag upsert flow
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { productId, tagNames } = req.body

  // 1. Upsert tags by name
  const tagService = req.scope.resolve(Modules.TAG)
  const tags = await tagService.upsertTags(
    tagNames.map(name => ({ value: name }))
  )

  // 2. Attach tags to product using IDs
  const productService = req.scope.resolve(Modules.PRODUCT)
  await productService.updateProducts(productId, {
    tags: tags.map(tag => ({ id: tag.id }))
  })

  res.status(200).json({ success: true })
}
```

### **Batch Operations**

```typescript
// ✅ DO: Handle batch operations properly
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { products } = req.body

  const results = []
  for (const productData of products) {
    try {
      const product = await productService.createProducts(productData)
      results.push({ success: true, product })
    } catch (error) {
      results.push({ success: false, error: error.message })
    }
  }

  res.status(200).json({ results })
}
```

---

## 🐛 Troubleshooting Guide

### **500 Internal Server Error**

**Common Causes:**
1. **Tag ID issues** - Remove tags and test, then add back properly
2. **Module resolution** - Check import paths and service names
3. **Environment variables** - Verify all required vars are set
4. **Database connection** - Check DATABASE_URL format

**Debug Steps:**
1. Check Railway build logs for compilation errors
2. Test simpler endpoint first (`/health` should work)
3. Remove complex fields (tags, variants) and test incrementally
4. Check error stack trace in development

### **404 Not Found**

**Common Causes:**
1. **Wrong path** - Use `/endpoint` not `/test/endpoint`
2. **Railway not deployed** - Check if latest commit is deployed
3. **Root directory** - Ensure Railway points to `medusa-backend`

### **Authentication Errors**

**Common Causes:**
1. **Missing auth** - Add `if (!req.user)` checks for admin routes
2. **Wrong token** - Use admin JWT, not publishable key
3. **CORS issues** - Configure STORE_CORS and ADMIN_CORS properly

---

## 📚 Resources

- **Medusa v2 Docs:** https://docs.medusajs.com/v2
- **API Reference:** https://docs.medusajs.com/v2/api-reference
- **Module Guide:** https://docs.medusajs.com/v2/advanced-development/modules
- **Railway Logs:** Check in your Railway dashboard

---

## 🎯 Key Takeaways

1. **Start Simple** - Create basic product first, add complexity later
2. **Check Railway Logs** - Always check for the real error messages
3. **Use Proper Patterns** - Follow v2 module and API patterns exactly
4. **Test Incrementally** - Add one feature at a time and test
5. **Handle Errors Gracefully** - Provide helpful error messages
6. **Monitor Deployments** - Check Railway dashboard for issues

---

*This guide is based on real Medusa v2 implementation experience and troubleshooting sessions.*




