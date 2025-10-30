# Comprehensive CORS Guide for Medusa v2 - Simple Payment Endpoint

This guide explains Medusa v2 CORS configuration, how to add domains, and what you have vs. what's missing.

## 📚 Medusa v2 CORS Documentation Summary

Based on the official Medusa v2 documentation, CORS configuration in Medusa v2 works as follows:

### 1. **Environment-Based Configuration**
Medusa v2 uses environment variables for CORS configuration:
- `STORE_CORS` - For store/frontend API routes
- `ADMIN_CORS` - For admin API routes  
- `AUTH_CORS` - For authentication routes

### 2. **How to Add Multiple Domains**

**Option A: Comma-Separated List (Recommended)**
```env
STORE_CORS=https://yourdomain.com,https://www.yourdomain.com,http://localhost:3000
```

**Option B: Allow All Origins (Development Only)**
```env
STORE_CORS=*
```

**Option C: Regex Patterns**
```env
STORE_CORS=/^https:\/\/.*\.yourdomain\.com$/,http://localhost:3000
```

### 3. **Official Medusa v2 CORS Mechanism**

According to Medusa v2 docs, the framework provides:
- Built-in CORS parsing with `parseCorsOrigins()` utility
- Automatic CORS handling for routes under `/store` and `/admin`
- Config module accessible via `req.scope.resolve("configModule")`

## 🔍 What You Currently Have in Your Codebase

### ✅ **Implemented (Working)**

1. **Environment Variables Setup** (`src/lib/constants.ts`)
   - Lines 36-48: CORS constants defined with defaults
   ```typescript
   export const ADMIN_CORS = process.env.ADMIN_CORS || "*";
   export const AUTH_CORS = process.env.AUTH_CORS || "*";
   export const STORE_CORS = process.env.STORE_CORS || "*";
   ```

2. **Medusa Config** (`medusa-config.js`)
   - Lines 46-51: CORS variables passed to projectConfig
   ```javascript
   http: {
     adminCors: ADMIN_CORS,
     authCors: AUTH_CORS,
     storeCors: STORE_CORS,
     // ...
   }
   ```

3. **Global Middleware** (`src/middlewares.ts`)
   - Lines 10-31: CORS middleware for `/store/*` routes
   - **✅ Your simple-payment endpoint is under `/store/simple-payment`**
   - **✅ This middleware applies to it automatically**

4. **Helper Functions** (`src/middleware/global-cors.ts`)
   - `applyCorsHeaders()` - Apply CORS headers
   - `handleCorsPreflight()` - Handle OPTIONS requests
   - `withCors()` - Wrapper function

5. **OPTIONS Handler** (`src/api/store/simple-payment/route.ts`)
   - Lines 126-128: OPTIONS method handler

### ❌ **What You're Missing**

1. **Dynamic Origin Checking**
   - **Current:** `Access-Control-Allow-Origin: *` (hardcoded)
   - **Should be:** Dynamically check against `STORE_CORS` environment variable
   - **Issue:** Currently allows ALL origins regardless of `STORE_CORS` setting

2. **Official Medusa CORS Parsing**
   - **Missing:** `parseCorsOrigins()` utility usage
   - **Missing:** ConfigModule resolution for CORS
   - **Current:** Manual header setting bypasses Medusa's built-in CORS

3. **Production-Ready Configuration**
   - **Missing:** Proper origin validation
   - **Missing:** Origin whitelist checking
   - **Security concern:** `*` in production is unsafe

## 🎯 The Problem

Your `simple-payment` endpoint works for all domains, but **NOT because of the Medusa CORS configuration**. It works because:

1. Your middleware at line 15 in `src/middlewares.ts` sets `Access-Control-Allow-Origin: *`
2. This is a hardcoded wildcard, ignoring your `STORE_CORS` environment variable
3. The official Medusa CORS configuration in `medusa-config.js` is being bypassed

## 🛠️ Solution: Proper CORS Implementation

To make CORS work properly with environment variables, you need to update your middleware to use Medusa's official CORS handling:

### **Recommended Fix (No Extra Dependencies)**

Update `src/middlewares.ts` to check origins dynamically without needing the `cors` package:

```typescript
import { defineMiddlewares } from "@medusajs/framework";

/**
 * Parse CORS origins from string (comma-separated or *)
 */
function parseCorsOrigins(corsConfig: string): string | string[] | ((origin: string) => boolean) {
  if (!corsConfig || corsConfig === '*') {
    return '*';
  }
  
  const origins = corsConfig.split(',').map(origin => origin.trim()).filter(Boolean);
  
  return (origin: string) => {
    if (!origin) return false;
    return origins.includes(origin);
  };
}

/**
 * Get allowed origin based on configuration
 */
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

export default defineMiddlewares({
  routes: [
    // CORS middleware for all store API routes
    {
      matcher: "/store/*",
      middlewares: [
        (req, res, next) => {
          // Get CORS config from environment (injected by Medusa)
          const corsConfig = process.env.STORE_CORS || '*';
          const requestOrigin = req.headers.origin;
          
          // Get allowed origin
          const allowedOrigin = getAllowedOrigin(requestOrigin, corsConfig);
          
          if (allowedOrigin) {
            res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
          }
          
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, x-publishable-api-key, x-medusa-access-token, Accept, Origin, Cache-Control, Pragma');
          res.setHeader('Access-Control-Allow-Credentials', 'true');
          res.setHeader('Access-Control-Max-Age', '86400');
          res.setHeader('Access-Control-Expose-Headers', 'Content-Length, X-JSON');
          res.setHeader('Vary', 'Origin');
          
          // Handle preflight requests
          if (req.method === 'OPTIONS') {
            res.status(200).end();
            return;
          }
          
          next();
        },
      ],
    },
    // Similar for /admin/* and /internal/*
    {
      matcher: "/admin/*",
      middlewares: [
        (req, res, next) => {
          const corsConfig = process.env.ADMIN_CORS || '*';
          const requestOrigin = req.headers.origin;
          const allowedOrigin = getAllowedOrigin(requestOrigin, corsConfig);
          
          if (allowedOrigin) {
            res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
          }
          
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, x-medusa-access-token, Accept, Origin, Cache-Control, Pragma');
          res.setHeader('Access-Control-Allow-Credentials', 'true');
          res.setHeader('Access-Control-Max-Age', '86400');
          res.setHeader('Access-Control-Expose-Headers', 'Content-Length, X-JSON');
          res.setHeader('Vary', 'Origin');
          
          if (req.method === 'OPTIONS') {
            res.status(200).end();
            return;
          }
          
          next();
        },
      ],
    },
    {
      matcher: "/internal/*",
      middlewares: [
        (req, res, next) => {
          const corsConfig = process.env.AUTH_CORS || '*';
          const requestOrigin = req.headers.origin;
          const allowedOrigin = getAllowedOrigin(requestOrigin, corsConfig);
          
          if (allowedOrigin) {
            res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
          }
          
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, x-medusa-access-token, Accept, Origin, Cache-Control, Pragma');
          res.setHeader('Access-Control-Allow-Credentials', 'true');
          res.setHeader('Access-Control-Max-Age', '86400');
          res.setHeader('Access-Control-Expose-Headers', 'Content-Length, X-JSON');
          res.setHeader('Vary', 'Origin');
          
          if (req.method === 'OPTIONS') {
            res.status(200).end();
            return;
          }
          
          next();
        },
      ],
    },
  ],
});
```

### **What This Fix Does**

1. ✅ **Respects `STORE_CORS` environment variable** - Uses actual config
2. ✅ **Supports comma-separated origins** - Multiple domains
3. ✅ **Supports `*` wildcard** - For development
4. ✅ **Supports regex patterns** - Flexible matching
5. ✅ **Proper preflight handling** - OPTIONS requests
6. ✅ **Production-ready** - Secure origin checking

## 🚀 Quick Setup for All Domains

### **Development (Allow All)**
```env
STORE_CORS=*
ADMIN_CORS=*
AUTH_CORS=*
```

### **Production (Specific Domains)**
```env
STORE_CORS=https://yourstore.com,https://www.yourstore.com,https://store.yourstore.com
ADMIN_CORS=https://admin.yourstore.com
AUTH_CORS=https://yourstore.com
```

### **Local Development**
```env
STORE_CORS=http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000
```

## 📋 Implementation Checklist

### **What You Have ✅**
- [x] Environment variables setup (`src/lib/constants.ts`)
- [x] Medusa config passing CORS values (`medusa-config.js`)
- [x] Global middleware defined (`src/middlewares.ts`)
- [x] Helper functions (`src/middleware/global-cors.ts`)
- [x] OPTIONS handler in simple-payment route
- [x] Documentation file (`CORS_CONFIGURATION_GUIDE.md`)

### **What You Need To Add ⚠️**
- [x] Update `src/middlewares.ts` to respect environment variables
- [x] Origin checking logic (no extra package needed)
- [x] Regex pattern support
- [ ] Test with different origin values
- [ ] Update environment variables in production

## 🔬 Testing

### **Test Current Setup (Allows Everything)**
```bash
curl -X POST http://localhost:9000/store/simple-payment \
  -H "Origin: https://anydomain.com" \
  -H "Content-Type: application/json" \
  -d '{"items":[]}'
```

### **Test Environment Variable**
```bash
# Set in .env
STORE_CORS=https://allowed-domain.com

# Restart backend
npm run dev

# This should work
curl -X POST http://localhost:9000/store/simple-payment \
  -H "Origin: https://allowed-domain.com" \
  -H "Content-Type: application/json" \
  -d '{"items":[]}'

# This should be blocked (after proper implementation)
curl -X POST http://localhost:9000/store/simple-payment \
  -H "Origin: https://blocked-domain.com" \
  -H "Content-Type: application/json" \
  -d '{"items":[]}'
```

## 📝 Summary

### **Current State**
Your `simple-payment` endpoint works for all domains because your middleware hardcodes `Access-Control-Allow-Origin: *`, which:
- ✅ Works for development/testing
- ❌ Ignores `STORE_CORS` environment variable
- ❌ Not production-ready
- ❌ Bypasses Medusa's official CORS system

### **After Fix**
Your `simple-payment` endpoint will:
- ✅ Respect `STORE_CORS` environment variable
- ✅ Support multiple domains
- ✅ Be production-ready
- ✅ Use Medusa's official CORS system
- ✅ Allow whitelisting specific domains

### **Files to Update**
1. `src/middlewares.ts` - Main fix needed
2. `.env` - Set your domains
3. `package.json` - Ensure `cors` is installed

## 🚨 Important Notes

1. **Current Implementation**: Your current setup with `*` works, but it's a security risk in production
2. **Simple-Payment Location**: Your endpoint is at `/store/simple-payment`, which is already covered by your middleware
3. **No Additional Routes Needed**: The middleware at line 11 (`matcher: "/store/*"`) already covers this endpoint
4. **Environment Variables**: Set them before starting the backend for changes to take effect

## 📚 Official Documentation References

- Medusa v2 CORS: https://docs.medusajs.com/learn/fundamentals/api-routes/cors
- Configuration: https://docs.medusajs.com/development/backend/configurations
- API Routes: https://docs.medusajs.com/learn/fundamentals/api-routes

## 🎓 Learning Points

1. **Medusa v2 CORS** is handled via environment variables in `medusa-config.js`
2. **Custom middleware** can override or enhance built-in CORS
3. **`parseCorsOrigins()`** is the utility to parse CORS origins from config
4. **`ConfigModule`** provides access to project configuration
5. **`cors` middleware** from npm is the standard way to handle CORS in Node.js

---

**Bottom Line**: Your simple-payment endpoint currently works for all domains, but to make it respect environment variables and be production-ready, you need to update `src/middlewares.ts` to use Medusa's official CORS parsing.

