# CORS Configuration Guide for Medusa Backend

This guide explains how to configure CORS (Cross-Origin Resource Sharing) for your Medusa backend to allow requests from any domain during testing.

## Quick Fix for Testing

To allow all domains for testing purposes, set these environment variables:

```bash
# Allow all origins for testing
STORE_CORS=*
ADMIN_CORS=*
AUTH_CORS=*
```

## Environment Variables

Add these to your `.env` file in the `medusa-backend` directory:

```env
# CORS Configuration - Allow all origins for testing
STORE_CORS=*
ADMIN_CORS=*
AUTH_CORS=*

# Backend URL
BACKEND_PUBLIC_URL=http://localhost:9000
# or for production:
# BACKEND_PUBLIC_URL=https://your-backend-domain.com

# Other required environment variables
DATABASE_URL=postgresql://username:password@localhost:5432/medusa_db
JWT_SECRET=your-jwt-secret-here
COOKIE_SECRET=your-cookie-secret-here
```

## Production Configuration

For production, replace `*` with specific domains:

```env
# Production CORS - specific domains only
STORE_CORS=https://yourdomain.com,https://www.yourdomain.com
ADMIN_CORS=https://admin.yourdomain.com
AUTH_CORS=https://yourdomain.com
```

## Testing CORS

1. **Test the CORS endpoint:**
   ```bash
   curl -X GET http://localhost:9000/store/cors-test-comprehensive
   ```

2. **Test preflight requests:**
   ```bash
   curl -X OPTIONS http://localhost:9000/store/cors-test-comprehensive \
     -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type"
   ```

3. **Test from browser console:**
   ```javascript
   fetch('http://localhost:9000/store/cors-test-comprehensive', {
     method: 'GET',
     headers: {
       'Content-Type': 'application/json'
     }
   })
   .then(response => response.json())
   .then(data => console.log('CORS Test:', data))
   .catch(error => console.error('CORS Error:', error));
   ```

## CORS Headers Applied

The following CORS headers are automatically applied to all API routes:

- `Access-Control-Allow-Origin: *` (allows all origins)
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD`
- `Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, x-publishable-api-key, x-medusa-access-token, Accept, Origin, Cache-Control, Pragma`
- `Access-Control-Allow-Credentials: true`
- `Access-Control-Max-Age: 86400` (24 hours)

## Troubleshooting

### Common CORS Issues

1. **"Access to fetch at '...' from origin '...' has been blocked by CORS policy"**
   - Solution: Ensure `STORE_CORS=*` is set in your environment variables
   - Restart the Medusa backend after changing environment variables

2. **Preflight requests failing**
   - Solution: Ensure OPTIONS method is handled (already implemented in our routes)
   - Check that `Access-Control-Allow-Methods` includes the method you're using

3. **Credentials not being sent**
   - Solution: Ensure `Access-Control-Allow-Credentials: true` is set (already implemented)
   - Make sure to include `credentials: 'include'` in your fetch requests

### Debug Steps

1. Check environment variables:
   ```bash
   echo $STORE_CORS
   echo $ADMIN_CORS
   echo $AUTH_CORS
   ```

2. Test the CORS endpoint:
   ```bash
   curl -v http://localhost:9000/store/cors-test-comprehensive
   ```

3. Check browser developer tools Network tab for CORS errors

4. Verify the Medusa backend is running with the correct environment variables

## Security Note

⚠️ **Important**: Allowing all origins (`*`) is only for testing purposes. In production, always specify the exact domains that should be allowed to access your API.

## Files Modified

The following files have been updated to support comprehensive CORS:

- `src/lib/constants.ts` - Updated CORS constants
- `src/middleware/cors.ts` - Enhanced CORS middleware
- `src/middleware/global-cors.ts` - New comprehensive CORS utilities
- `src/api/store/cart/create/route.ts` - Added CORS headers
- `src/api/store/cart/complete/route.ts` - Added CORS headers
- `src/api/store/zarinpal/verify/route.ts` - Added CORS headers
- `src/api/store/cors-test-comprehensive/route.ts` - New CORS test endpoint

## Next Steps

1. Set the environment variables as shown above
2. Restart your Medusa backend
3. Test the CORS functionality using the provided test endpoints
4. Verify that your frontend can now make requests to the backend without CORS errors
