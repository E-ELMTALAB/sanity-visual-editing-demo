# Admin Panel Fix - Enable for API Key Management

## 🎯 The Problem

You're getting this error:
```
Publishable API key required in the request header: x-publishable-api-key. 
You can manage your keys in settings in the dashboard.
```

**Root Cause:** The admin panel is disabled in production, so you can't create or manage API keys.

## ✅ The Solution

### Step 1: Set Environment Variable on Railway

Add this environment variable in your Railway dashboard:

**Variable Name:** `MEDUSA_DISABLE_ADMIN`  
**Value:** `false`

### Step 2: Redeploy

Railway will automatically redeploy after you add the environment variable.

### Step 3: Access Admin Panel

After deployment, access the admin panel at:
```
https://backend-production-ea59.up.railway.app/app
```

### Step 4: Create a Publishable API Key

1. Login to the admin panel (use your admin credentials)
2. Go to **Settings** → **Publishable API Keys**
3. Click **Create Publishable API Key**
4. Give it a name (e.g., "Frontend Store Key")
5. Copy the generated key (starts with `pk_`)

### Step 5: Link the Key to Sales Channels

You need to link the API key to sales channels. Run this script locally or via Railway:

```bash
curl -X POST https://backend-production-ea59.up.railway.app/internal/link-publishable-key \
  -H "Content-Type: application/json" \
  -d '{"token": "YOUR_PUBLISHABLE_KEY_HERE"}'
```

### Step 6: Update Frontend

Add the API key to your frontend requests:

```javascript
const headers = {
  'Content-Type': 'application/json',
  'x-publishable-api-key': 'YOUR_PUBLISHABLE_KEY_HERE'
};
```

## 🔄 Alternative: Use Custom Routes (No API Key Needed)

If you don't want to set up API keys, you can use our custom routes that bypass the API key requirement:

**Your custom routes that work without API key:**
- `/store/cart/create`
- `/store/cart/complete`  
- `/store/simple-payment`
- `/store/zarinpal/*`
- `/store/cors-test-comprehensive`

These routes have been designed to work without any API key authentication.

## 📝 Current Status

✅ **Code Changes Made:**
- Changed `SHOULD_DISABLE_ADMIN` to default to `false` in constants.ts
- This enables admin by default

⚠️ **Railway Configuration Needed:**
- Set `MEDUSA_DISABLE_ADMIN=false` in Railway environment variables
- This ensures admin is enabled in production

## 🚀 Quick Check

After setting the environment variable on Railway, check if admin is working:

```bash
# Should return the admin dashboard HTML, not 404
curl https://backend-production-ea59.up.railway.app/app
```

## 📋 Summary

**To fix the "Publishable API key required" error:**

**Option A - Enable Admin (Recommended for Production):**
1. Add `MEDUSA_DISABLE_ADMIN=false` to Railway env vars
2. Access admin at `https://backend-production-ea59.up.railway.app/app`
3. Create API key in admin panel
4. Link key to sales channels
5. Use key in frontend requests

**Option B - Use Custom Routes (Simpler for Testing):**
- Just use `/store/simple-payment` - it works without API key
- Already integrated in your codebase

