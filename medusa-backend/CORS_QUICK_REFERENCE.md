# CORS Quick Reference - Simple Payment Endpoint

## 🎯 Your Question

> "How can I add more domains to CORS and make simple-payment work for all domains?"

## ✅ Short Answer

Your `simple-payment` endpoint NOW respects the `STORE_CORS` environment variable. Update your `.env` file with allowed domains.

## 🚀 Quick Setup

### **Allow All Domains (Development)**
```env
STORE_CORS=*
```

### **Allow Specific Domains (Production)**
```env
STORE_CORS=https://yourstore.com,https://www.yourstore.com,http://localhost:3000
```

### **Allow Subdomains (Regex)**
```env
STORE_CORS=/^https:\/\/.*\.yourdomain\.com$/,http://localhost:3000
```

## 📍 What Changed

**Before:** Hardcoded `Access-Control-Allow-Origin: *` (ignored environment variables)

**After:** Dynamically checks `STORE_CORS` environment variable:
- ✅ Supports wildcard (`*`)
- ✅ Supports comma-separated domains
- ✅ Supports regex patterns
- ✅ Works for production

## 🔧 Files Modified

1. ✅ **`src/middlewares.ts`** - Now respects environment variables
2. ✅ **`CORS_COMPREHENSIVE_GUIDE.md`** - Complete documentation

## 📝 Environment Variables

Your `simple-payment` endpoint uses `STORE_CORS`:
```env
# For store/frontend routes (/store/*)
STORE_CORS=https://example.com,http://localhost:3000

# For admin routes (/admin/*)
ADMIN_CORS=https://admin.example.com

# For auth routes (/internal/*)
AUTH_CORS=https://example.com
```

## 🧪 Test It

1. Set environment variable:
   ```bash
   # In medusa-backend/.env
   STORE_CORS=https://example.com
   ```

2. Restart backend:
   ```bash
   cd medusa-backend
   npm run dev
   ```

3. Test with curl:
   ```bash
   # This will work
   curl -X POST http://localhost:9000/store/simple-payment \
     -H "Origin: https://example.com" \
     -H "Content-Type: application/json" \
     -d '{"items":[{"id":1,"title":"Test","price":10000,"quantity":1}]}'
   
   # This will fail (after update)
   curl -X POST http://localhost:9000/store/simple-payment \
     -H "Origin: https://blocked-domain.com" \
     -H "Content-Type: application/json" \
     -d '{"items":[{"id":1,"title":"Test","price":10000,"quantity":1}]}'
   ```

## 🎓 Key Points

1. **Your endpoint is at:** `/store/simple-payment`
2. **It's covered by:** The middleware at `matcher: "/store/*"`
3. **Environment variable:** `STORE_CORS`
4. **Default behavior:** Allows all origins (`*`) if not set
5. **After fix:** Respects your environment variable

## 📚 Documentation Links

- **Comprehensive Guide:** `CORS_COMPREHENSIVE_GUIDE.md`
- **Medusa v2 Docs:** https://docs.medusajs.com/learn/fundamentals/api-routes/cors
- **Configuration:** `medusa-config.js`

## ⚠️ Important Notes

1. **Development**: Use `STORE_CORS=*` for testing
2. **Production**: Use specific domains only
3. **Restart Required**: Environment changes need backend restart
4. **No Dependencies**: The fix uses built-in Node.js functionality
5. **Your Current Setup**: Already works, just wasn't respecting env vars before

## 🎉 Summary

**Question:** How to make simple-payment work for all domains?

**Answer:**
- **Development:** Set `STORE_CORS=*`
- **Production:** Set `STORE_CORS=https://domain1.com,https://domain2.com`
- **Multiple Domains:** Comma-separate them
- **Subdomains:** Use regex patterns

Your middleware now properly supports all these options!

