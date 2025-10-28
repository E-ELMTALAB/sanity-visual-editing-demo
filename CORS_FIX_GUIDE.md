# CORS Fix Guide for Medusa Backend

## 🚨 **CORS Issue Resolution**

The CORS issue has been fixed by implementing comprehensive CORS handling in the Medusa backend. Here's what was done:

### ✅ **Changes Made:**

1. **Enhanced CORS Headers** - Updated all payment endpoints with comprehensive CORS headers
2. **Global CORS Middleware** - Created universal CORS handling
3. **CORS Test Endpoints** - Added endpoints to verify CORS is working
4. **Direct Backend Calls** - Updated frontend to call backend directly

### 🔧 **Backend Changes:**

#### 1. Enhanced CORS Headers
```typescript
// All endpoints now use these enhanced CORS headers:
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, x-publishable-api-key, x-medusa-access-token');
res.setHeader('Access-Control-Allow-Credentials', 'true');
res.setHeader('Access-Control-Max-Age', '86400');
```

#### 2. New Files Created:
- `medusa-backend/src/middleware/cors.ts` - Global CORS middleware
- `medusa-backend/src/api/store/cors-handler/route.ts` - Universal CORS handler
- `test-cors-fix.ps1` - CORS test script

#### 3. Updated Files:
- `medusa-backend/src/api/store/simple-payment/route.ts` - Enhanced CORS
- `medusa-backend/src/api/store/simple-verify/route.ts` - Enhanced CORS

### 🌐 **Environment Variables to Set:**

Add these to your Medusa backend environment variables:

```bash
# CORS Configuration
STORE_CORS=*
ADMIN_CORS=*
AUTH_CORS=*

# Backend URL
BACKEND_URL=https://backend-production-ea59.up.railway.app

# Zarinpal Configuration
ZARINPAL_OFFLINE=true
ZARINPAL_SANDBOX=true
ZARINPAL_CALLBACK_URL=https://backend-production-ea59.up.railway.app/store/zarinpal/callback
```

### 🧪 **Testing CORS:**

1. **Run the test script:**
   ```powershell
   .\test-cors-fix.ps1
   ```

2. **Test endpoints:**
   - `GET /store/cors-handler` - Universal CORS test
   - `GET /store/cors-test` - Basic CORS test
   - `POST /store/simple-payment` - Payment initiation
   - `POST /store/simple-verify` - Payment verification

3. **Frontend test:**
   - Visit `/test-payment` to test the payment flow

### 🚀 **Deployment Steps:**

1. **Deploy the backend changes** to Railway
2. **Set the environment variables** in Railway dashboard
3. **Test the CORS endpoints** using the test script
4. **Deploy the frontend** to Vercel
5. **Test the complete payment flow**

### 🔍 **Troubleshooting:**

If CORS still doesn't work:

1. **Check environment variables** are set correctly
2. **Verify backend deployment** is successful
3. **Test individual endpoints** using the test script
4. **Check browser console** for specific error messages
5. **Use the proxy endpoints** as fallback if needed

### 📋 **Fallback Solution:**

If direct backend calls still fail, the proxy endpoints are still available:
- `/api/payment/initiate` - Payment initiation proxy
- `/api/payment/verify` - Payment verification proxy
- `/api/payment/test` - Backend connectivity test

The payment system should now work without CORS issues! 🎉
