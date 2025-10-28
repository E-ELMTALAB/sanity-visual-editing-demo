# Sanity Sync Testing Guide

## Prerequisites

Before testing, ensure you have:

1. ✅ Railway deployment is successful (check logs)
2. ✅ Sanity CMS with product documents
3. ✅ Environment variables configured

## Testing Methods

### Method 1: Quick Local Test (Dry-Run) ⚡

Test without affecting production data:

```bash
# 1. Navigate to medusa-backend
cd medusa-backend

# 2. Create a .env file with your credentials
cat > .env << 'EOF'
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=sk...your-token
BACKEND_URL=https://backend-production-ea59.up.railway.app
MEDUSA_ADMIN_TOKEN=your-admin-jwt-token
SANITY_SYNC_DRY_RUN=true
EOF

# 3. Install dependencies (if not already)
pnpm install

# 4. Run dry-run sync
pnpm run sync:sanity:dry
```

**Expected Output:**
```
[sanitySync] Fetching products (full)...
[sanitySync] DRY-RUN upsert sanityId=product-123 handle=awesome-product title="Awesome Product"
[sanitySync] DRY-RUN upsert sanityId=product-456 handle=cool-gadget title="Cool Gadget"
[sanitySync] Done. updated=0 created=0 failed=0
```

---

### Method 2: Test via Railway Deployment 🚀

The sync runs automatically after each Railway build.

**Steps:**

1. **Set Environment Variables in Railway:**
   - Go to Railway → Your Project → `medusa-backend` service
   - Click "Variables" tab
   - Add these variables:

   ```bash
   NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_READ_TOKEN=sk...your-token
   BACKEND_URL=https://backend-production-ea59.up.railway.app
   MEDUSA_ADMIN_TOKEN=your-admin-jwt-token
   ```

2. **Trigger a Redeploy:**
   - Click "Redeploy in Railway dashboard
   - OR push a small change to trigger rebuild

3. **Monitor Logs:**
   ```
   Railway Dashboard → Deployment Logs → Look for:
   
   ✅ Good signs:
   [sanitySync] Fetching products...
   [sanitySync] CREATED sanityId=product-123 productId=prod_abc
   [sanitySync] Done. updated=5 created=2 failed=0
   
   ❌ If sync is skipped:
   Skipping Sanity sync: missing envs
   ```

---

### Method 3: Manual Sync via Local CLI 💻

Run a real sync from your local machine:

```bash
cd medusa-backend

# Create .env with REAL credentials (not dry-run)
cat > .env << 'EOF'
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=sk...your-token
BACKEND_URL=https://backend-production-ea59.up.railway.app
MEDUSA_ADMIN_TOKEN=your-admin-jwt-token
# Note: SANITY_SYNC_DRY_RUN is NOT set
EOF

# Run REAL sync
pnpm run sync:sanity
```

**Expected Output:**
```
[sanitySync] Fetching products (full)...
[sanitySync] CREATED sanityId=product-123 productId=prod_01ABCDEF
[sanitySync] UPDATED sanityId=product-456 productId=prod_01GHIJKL
[sanitySync] Done. updated=5 created=2 failed=0
```

---

### Method 4: Test Sanity Products Exist 📊

Before syncing, verify you have products in Sanity:

**Option A: Using Sanity Studio**
1. Go to your Sanity Studio (e.g., `https://your-studio.sanity.studio`)
2. Check "Products" section
3. Ensure products have required fields: `title`, `slug`, `status`

**Option B: Using Sanity Vision (GROQ)**
1. Open Sanity Studio → Vision tab
2. Run this query:
   ```groq
   *[_type == "product" && (!defined(_deleted) || _deleted == false)]{
     _id,
     _updatedAt,
     title,
     slug,
     status
   }[0...5]
   ```
3. Verify results show your products

---

### Method 5: Verify Products in Medusa 🏪

After running sync, check if products were created:

**Option A: Medusa Admin Dashboard**
1. Go to `https://backend-production-ea59.up.railway.app/app`
2. Login with your admin credentials
3. Navigate to "Products"
4. Look for newly synced products

**Option B: Via API**
```bash
# List products via Store API
curl https://backend-production-ea59.up.railway.app/store/products

# Check specific product by handle
curl https://backend-production-ea59.up.railway.app/store/products/your-product-handle
```

---

## Troubleshooting

### Issue: "Missing environment variable: NEXT_PUBLIC_SANITY_DATASET"

**Solution:**
```bash
# Verify all Sanity env vars are set
echo $NEXT_PUBLIC_SANITY_PROJECT_ID
echo $NEXT_PUBLIC_SANITY_DATASET
echo $SANITY_API_READ_TOKEN

# Or check in Railway dashboard → Variables
```

### Issue: "Missing BACKEND_URL or MEDUSA_ADMIN_TOKEN"

**Solution:**
```bash
# Generate admin token (run on Railway or locally)
cd medusa-backend
npx medusa user -e admin@example.com -p yourpassword

# Copy the JWT token and set as MEDUSA_ADMIN_TOKEN
```

### Issue: "Failed to sync: 401 Unauthorized"

**Causes:**
- Invalid or expired `MEDUSA_ADMIN_TOKEN`
- Token doesn't have admin permissions

**Solution:**
```bash
# Regenerate token with proper admin role
# Login to Medusa admin dashboard
# Check browser DevTools → Network → Authorization header
# Copy Bearer token
```

### Issue: "No products from Sanity"

**Causes:**
- No products in Sanity
- Products are draft/disabled
- GROQ query filters them out

**Solution:**
```bash
# Check Sanity directly
# Run Vision query (see Method 4)
# Ensure products have status="published" or remove filter
```

### Issue: Sync runs but products not appearing in Medusa

**Check:**
1. Look for errors in sync logs: `failed=X`
2. Check product handle isn't duplicate
3. Verify `sanity_id` in product metadata:
   ```bash
   curl https://backend-production-ea59.up.railway.app/admin/products \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

---

## Testing Checklist

- [ ] **Dry-run test** - Verify script works without changes
- [ ] **Single product test** - Sync 1 product and verify in Medusa
- [ ] **Multiple products test** - Sync all products
- [ ] **Update test** - Modify a product in Sanity, sync again, verify update
- [ ] **Tag test** - Add tags to Sanity product, verify they're created in Medusa
- [ ] **Variant test** (if using) - Add variants, verify pricing
- [ ] **Incremental sync test** - Run sync twice, verify only changed products sync
- [ ] **Railway build test** - Trigger deployment, verify auto-sync in logs

---

## Quick Diagnostic Commands

```bash
# Check if sync script exists
ls -la medusa-backend/src/scripts/sanitySync.ts

# Check if dependencies are installed
cd medusa-backend && pnpm list @sanity/client tsx cross-env

# Test Sanity connection
curl "https://${NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v1/data/query/${NEXT_PUBLIC_SANITY_DATASET}?query=*%5B_type%3D%3D%22product%22%5D%5B0%5D" \
  -H "Authorization: Bearer ${SANITY_API_READ_TOKEN}"

# Test Medusa API
curl https://backend-production-ea59.up.railway.app/health
```

---

## Expected Flow

1. **First Sync (Clean Slate)**
   - All Sanity products → CREATE in Medusa
   - Tags automatically created
   - Checkpoint saved

2. **Second Sync (No Changes)**
   - Checkpoint loaded
   - No products changed since checkpoint
   - "No products from Sanity" or all skipped

3. **Second Sync (With Changes)**
   - Only changed products fetched
   - Updated in Medusa (matched by `sanity_id`)
   - Checkpoint updated

---

## Success Criteria

✅ **Sync is working if:**
- Dry-run shows expected products
- Real sync creates products in Medusa
- Products visible in Medusa admin
- Tags are created automatically
- Incremental syncs only update changed products
- Railway logs show successful sync after deployment

❌ **Sync needs fixing if:**
- "Missing environment variable" errors
- "401 Unauthorized" errors
- Products not appearing in Medusa
- All syncs fail with errors
- Railway logs show "Skipping Sanity sync"

---

## Next Steps After Successful Test

1. **Set up Sanity Webhook (Optional)**
   - Sanity Studio → API → Webhooks
   - URL: `https://backend-production-ea59.up.railway.app/admin/sanity-webhook`
   - Secret: Set `SANITY_WEBHOOK_SECRET` in Railway
   - Events: Product Create/Update/Delete

2. **Monitor Production Syncs**
   - Check Railway logs after each deployment
   - Verify product counts match Sanity

3. **Customize Mapping (Optional)**
   - Edit `src/lib/sanity-sync/mapToMedusa.ts`
   - Add custom fields, pricing logic, etc.

---

## Support

If you encounter issues:
1. Check Railway deployment logs
2. Review `SANITY_SYNC_GUIDE.md` and `SANITY_SYNC_ENV_VARS.md`
3. Run dry-run locally to isolate the issue
4. Verify all environment variables are correct




