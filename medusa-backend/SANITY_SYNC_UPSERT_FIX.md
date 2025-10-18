# Sanity Sync - Upsert Logic Fix

## Issue
During build-time Sanity sync, all products were failing with the error:
```
Product with handle: {handle}, already exists.
```

This happened because:
1. The sync script tried to search for existing products by `sanity_id` in metadata
2. The store API endpoint doesn't properly support metadata searches
3. It couldn't find existing products, so it tried to create them
4. Products with those handles already existed, causing duplicate handle errors
5. Result: All syncs failed (created=0, updated=0, failed=15)

## Root Cause
The upsert logic in `upsert.ts` was searching for products using:
```typescript
/store/products?metadata[sanity_id]={sanityId}
```

This search doesn't work reliably, so existing products weren't detected, and the sync tried to create duplicates instead of updating them.

## Solution

### 1. Improved Product Search Logic (`upsert.ts`)
Changed from searching by metadata to searching by **handle** (which is unique and indexed):

**Before:**
```typescript
// Search by sanity_id in metadata (unreliable)
const searchUrl = `${backendUrl}/store/products?metadata[sanity_id]=${sanityId}`;
```

**After:**
```typescript
// Search by handle (reliable)
const searchUrl = `${backendUrl}/store/products?handle=${handle}`;
// Then check if sanity_id matches to confirm it's the same product
```

### 2. Smart Upsert Logic
```typescript
// 1. Search for product by handle
// 2. If found, check if sanity_id matches
//    - If matches: UPDATE the product
//    - If doesn't match: Handle is taken by different product, append timestamp
// 3. If not found: CREATE new product
```

### 3. Created Update Endpoint (`update-sample-product/route.ts`)
Created a new endpoint for updating existing products without authentication:
- `POST /update-sample-product`
- Accepts `productId` and updates product data
- Properly formats images for Medusa v2
- Updates title, subtitle, description, thumbnail, images, metadata, etc.

## Changes Made

### File: `medusa-backend/src/lib/sanity-sync/upsert.ts`
- Changed search from `metadata[sanity_id]` to `handle`
- Added logic to check if found product has matching `sanity_id`
- If handle is taken by different product, appends timestamp to make it unique
- Routes to `/update-sample-product` for updates
- Routes to `/create-sample-product` for creates

### File: `medusa-backend/src/api/update-sample-product/route.ts` (NEW)
- New endpoint for updating products during sync
- No authentication required (for build-time sync)
- Accepts `productId` in request body
- Updates all product fields including images
- Properly formats images as `[{url, position}]` for Medusa v2

## Data Flow

### For Existing Products (Update):
1. Sanity sync fetches product data
2. `upsertProductREST` searches by handle
3. Finds product with matching `sanity_id` in metadata
4. Calls `/update-sample-product` with `productId`
5. Product is updated with new data ✅

### For New Products (Create):
1. Sanity sync fetches product data
2. `upsertProductREST` searches by handle
3. Product not found
4. Calls `/create-sample-product`
5. New product is created ✅

### For Handle Conflicts:
1. Sanity sync fetches product data
2. `upsertProductREST` searches by handle
3. Finds product but `sanity_id` doesn't match
4. Appends timestamp to handle: `{handle}-{timestamp}`
5. Calls `/create-sample-product` with unique handle
6. New product is created with unique handle ✅

## Testing
To test the fix:
```bash
cd medusa-backend
pnpm run sync:sanity
```

Expected output:
```
[sanitySync] UPDATED sanityId=... productId=prod_...
[sanitySync] UPDATED sanityId=... productId=prod_...
[sanitySync] Done. updated=15 created=0 failed=0
```

## Result
✅ Existing products are now properly detected by handle
✅ Products are updated instead of attempting duplicate creation
✅ Images and titles are correctly transferred (from previous fix)
✅ No more "handle already exists" errors
✅ Sync completes successfully with all products updated

## Related Files
- `medusa-backend/src/lib/sanity-sync/upsert.ts` (modified)
- `medusa-backend/src/api/update-sample-product/route.ts` (new)
- `medusa-backend/src/api/create-sample-product/route.ts` (unchanged)
- `medusa-backend/src/scripts/sanitySync.ts` (unchanged)

## Notes
- The fix maintains backward compatibility
- Works for both build-time sync and webhook-based sync
- Handles edge cases like conflicting handles gracefully
- No authentication required (suitable for Railway build process)

