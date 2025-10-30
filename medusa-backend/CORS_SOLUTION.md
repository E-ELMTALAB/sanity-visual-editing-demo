# CORS Solution - What We Fixed

## 🎯 The Problem

The `simple-payment` endpoint on Railway was failing with CORS errors:
```
Access to fetch at 'https://backend-production-ea59.up.railway.app/store/simple-payment' 
from origin 'https://sanity-visual-editing-demo-6nkq5y4oy.vercel.app' 
has been blocked by CORS policy
```

After CORS was fixed, we started getting 400 Bad Request errors because some files were using the old function signature.

## ✅ The Solution

Implemented manual CORS handling using Medusa v2's `defineMiddlewares` system.

### Additional Fix
Updated all files that were using the old `applyCorsHeaders(res)` signature to the new `applyCorsHeaders(req, res)` signature for proper dynamic origin checking.

## 📁 Files Modified

### 1. `src/middleware/global-cors.ts`
**What was done:**
- Added `getAllowedOrigin()` function to dynamically check origins
- Updated `applyCorsHeaders()` to accept both `req` and `res` (backward compatible)
- Supports wildcard (`*`), exact matches, and regex patterns
- Reads from `STORE_CORS` environment variable

**Key change:**
```typescript
export const applyCorsHeaders = (reqOrRes: MedusaRequest | MedusaResponse, res?: MedusaResponse) => {
  // Handle both old signature (res only) and new signature (req, res)
  let req: MedusaRequest | null = null;
  let response: MedusaResponse;
  
  if (res) {
    // New signature: (req, res)
    req = reqOrRes as MedusaRequest;
    response = res;
  } else {
    // Old signature: (res) - backward compatibility
    response = reqOrRes as MedusaResponse;
  }
  
  // Get CORS config from environment variable
  const corsConfig = process.env.STORE_CORS || '*';
  const requestOrigin = req?.headers?.origin;
  
  // Get allowed origin based on config
  const allowedOrigin = getAllowedOrigin(requestOrigin, corsConfig);
  
  // Only set Access-Control-Allow-Origin if we have a valid origin
  if (allowedOrigin) {
    response.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  }
  
  // ... other CORS headers
};
```

### 2. `src/middlewares.ts`
**What was done:**
- Added dynamic origin checking to CORS middleware
- Applied to `/store/*`, `/admin/*`, and `/internal/*` routes
- Handles OPTIONS preflight requests
- Reads from environment variables: `STORE_CORS`, `ADMIN_CORS`, `AUTH_CORS`

**Key change:**
```typescript
function getAllowedOrigin(requestOrigin: string | undefined, corsConfig: string): string | undefined {
  if (corsConfig === '*' || !corsConfig) {
    return '*';
  }
  
  const origins = corsConfig.split(',').map(origin => origin.trim());
  
  if (!requestOrigin) {
    return undefined;
  }
  
  // Check exact matches
  if (origins.includes(requestOrigin)) {
    return requestOrigin;
  }
  
  // Check regex patterns
  for (const pattern of origins) {
    if (pattern.startsWith('/') && pattern.endsWith('/')) {
      try {
        const regex = new RegExp(pattern.slice(1, -1));
        if (regex.test(requestOrigin)) {
          return requestOrigin;
        }
      } catch (e) {
        console.warn(`Invalid CORS regex pattern: ${pattern}`);
      }
    }
  }
  
  return undefined;
}
```

### 3. `src/api/store/simple-payment/route.ts`
**What was done:**
- Added explicit CORS header application to POST and OPTIONS handlers
- Imported and used `applyCorsHeaders` and `handleCorsPreflight`
- Ensures CORS headers are always sent

**Key change:**
```typescript
import { applyCorsHeaders, handleCorsPreflight } from "../../../middleware/global-cors";

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  // Apply CORS headers
  applyCorsHeaders(req, res);
  
  // Handle preflight requests
  if (handleCorsPreflight(req, res)) {
    return;
  }
  
  // ... rest of handler
};

export const OPTIONS = async (req: MedusaRequest, res: MedusaResponse) => {
  // Apply CORS headers for preflight requests
  applyCorsHeaders(req, res);
  res.status(200).end();
};
```

## 🔑 Key Insights

### Medusa v2 CORS Behavior
- Medusa v2 does **NOT** automatically apply CORS from `medusa-config.js`
- The `http.storeCors` values are configuration only
- You must implement CORS manually using `defineMiddlewares`
- Our implementation now follows this pattern correctly

### Why It Works
1. **Dual-layer protection:** Middleware + explicit route handling
2. **Dynamic origin checking:** Respects environment variables
3. **Backward compatible:** Supports old and new function signatures
4. **Preflight handling:** OPTIONS requests properly handled
5. **Production-ready:** Supports wildcard, exact matches, and regex

## 🚀 How to Use

### Development (Allow All)
```env
STORE_CORS=*
```

### Production (Specific Domains)
```env
STORE_CORS=https://yourdomain.com,https://www.yourdomain.com
```

### Multiple Domains
```env
STORE_CORS=https://domain1.com,https://domain2.com,https://subdomain.example.com
```

### Regex Pattern
```env
STORE_CORS=/^https:\/\/.*\.yourdomain\.com$/,http://localhost:3000
```

## ✅ Result

- ✅ CORS headers properly set
- ✅ Preflight requests working
- ✅ Dynamic origin checking
- ✅ Respects environment variables
- ✅ Production-ready
- ✅ Backward compatible

## 📝 Summary

We implemented manual CORS handling using Medusa v2's `defineMiddlewares` system, adding:
1. Dynamic origin checking in middleware
2. Explicit CORS headers in route handlers
3. Backward compatibility with existing code
4. Proper preflight request handling

The solution follows Medusa v2's expected pattern and is ready for production use.

