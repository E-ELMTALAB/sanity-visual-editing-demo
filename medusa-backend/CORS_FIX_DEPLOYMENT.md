# CORS Fix for Production Deployment

## 🎯 The Problem

Your `simple-payment` endpoint was failing with CORS errors on Railway production:
```
Access to fetch at 'https://backend-production-ea59.up.railway.app/store/simple-payment' 
from origin 'https://sanity-visual-editing-demo-6nkq5y4oy.vercel.app' 
has been blocked by CORS policy: Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## ✅ What Was Fixed

### 1. **Updated `src/middleware/global-cors.ts`**
   - Changed `applyCorsHeaders` to accept both `req` and `res` parameters
   - Added dynamic origin checking based on `STORE_CORS` environment variable
   - Now supports wildcard (`*`), exact matches, and regex patterns

### 2. **Updated `src/api/store/simple-payment/route.ts`**
   - Added explicit CORS header application to POST and OPTIONS methods
   - Imported and used `applyCorsHeaders` and `handleCorsPreflight` functions
   - Ensures CORS headers are always sent, even if middleware fails

### 3. **Updated `src/middlewares.ts`** (Previously)
   - Added dynamic origin checking in middleware
   - Respects `STORE_CORS`, `ADMIN_CORS`, and `AUTH_CORS` environment variables

## 🚀 How to Deploy the Fix

### **Step 1: Set Environment Variables on Railway**

Go to your Railway dashboard → Medusa Backend Service → Variables tab:

**Add/Update these variables:**
```env
# Allow all domains (for testing)
STORE_CORS=*

# OR specify your Vercel app (recommended for production)
STORE_CORS=https://sanity-visual-editing-demo-6nkq5y4oy.vercel.app,https://yourdomain.com

# Other CORS settings (optional)
ADMIN_CORS=*
AUTH_CORS=*
```

### **Step 2: Redeploy the Backend**

1. **Push your changes to GitHub** (if using Git deployment):
   ```bash
   git add .
   git commit -m "Fix CORS for simple-payment endpoint"
   git push
   ```

2. **Or trigger a manual redeploy** on Railway:
   - Go to your Medusa service on Railway
   - Click "Deploy" → "Deploy Latest"

### **Step 3: Verify the Fix**

Test the endpoint with curl:
```bash
# Test from your Vercel app origin
curl -X OPTIONS https://backend-production-ea59.up.railway.app/store/simple-payment \
  -H "Origin: https://sanity-visual-editing-demo-6nkq5y4oy.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v

# You should see these headers in the response:
# Access-Control-Allow-Origin: https://sanity-visual-editing-demo-6nkq5y4oy.vercel.app
# Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD
# Access-Control-Allow-Headers: Content-Type, Authorization, ...
```

## 🔍 Troubleshooting

### **If CORS errors persist:**

1. **Check Railway environment variables:**
   - Ensure `STORE_CORS` is set correctly
   - No extra spaces or quotes around the value
   - For multiple domains: `domain1.com,domain2.com` (comma-separated)

2. **Check the logs:**
   ```bash
   # On Railway, view the logs to see if CORS middleware is running
   # You should see no errors related to CORS
   ```

3. **Test with wildcard (temporarily):**
   ```env
   STORE_CORS=*
   ```
   This allows all domains. If this works, the issue is with your specific domain configuration.

4. **Verify the origin in the error:**
   - Check that the origin in your Vercel app matches EXACTLY what's in `STORE_CORS`
   - Include the protocol: `https://` not just `sanity-visual-editing-demo-6nkq5y4oy.vercel.app`

### **If middleware isn't working:**

The simple-payment route now has **explicit CORS headers** in the route handler itself. This means:
- ✅ It works even if the middleware fails
- ✅ It always sends CORS headers
- ✅ OPTIONS requests are properly handled

## 📋 Production Checklist

- [ ] Set `STORE_CORS` environment variable on Railway
- [ ] Add your Vercel app domain to `STORE_CORS`
- [ ] Push code changes to trigger redeploy
- [ ] Test OPTIONS request (preflight) works
- [ ] Test POST request works
- [ ] Verify in browser console no CORS errors

## 🔐 Security Recommendations

### **Development:**
```env
STORE_CORS=*
```

### **Production:**
```env
# Specify exact domains only
STORE_CORS=https://sanity-visual-editing-demo-6nkq5y4oy.vercel.app,https://www.yourdomain.com
```

### **Multiple Environments:**
```env
# Allow both production and preview URLs
STORE_CORS=https://sanity-visual-editing-demo-6nkq5y4oy.vercel.app,https://*.vercel.app
```

## 📚 Files Changed

1. ✅ `src/middleware/global-cors.ts` - Enhanced with origin checking
2. ✅ `src/api/store/simple-payment/route.ts` - Explicit CORS headers
3. ✅ `src/middlewares.ts` - Dynamic CORS in middleware

## 🎉 Expected Result

After deployment, your frontend should be able to:
- ✅ Make POST requests to `/store/simple-payment`
- ✅ Pass preflight OPTIONS requests
- ✅ No CORS errors in browser console
- ✅ Payments process successfully

## 🚨 Important Notes

1. **The fix is deployed in your code** - You just need to set the `STORE_CORS` environment variable on Railway
2. **Backend restart required** - After setting env vars, Railway will auto-restart
3. **Explicit CORS handling** - The simple-payment route now handles CORS itself, not relying solely on middleware
4. **Test in production** - After deployment, test from your Vercel app, not just locally

---

**Need help?** Check the logs on Railway to see what's happening with the CORS headers.

