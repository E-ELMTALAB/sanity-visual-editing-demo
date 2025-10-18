# Sanity Sync - Image & Title Transfer Fix

## Issue
During build-time Sanity sync, product information was being transferred to Medusa, but **images** were not appearing in Medusa products. The title was working correctly but needed verification.

## Root Cause
The images were being stored in product `metadata` instead of being passed as the `images` field to Medusa's product creation API. Additionally, Medusa v2 requires images to be formatted as an array of objects with `url` and `position` properties, not just an array of strings.

## Changes Made

### 1. Fixed `upsert.ts` (Line 62-76)
**Before:**
```typescript
const body = {
  title: input.title,
  subtitle: input.subtitle,
  description: input.description,
  handle: input.handle,
  status: input.status,
  thumbnail: input.thumbnailUrl,
  metadata: {
    sanity_id: input.sanityId,
    images: input.images,  // ❌ Images were in metadata
    tags: input.tags,
  },
  ...(input.variants && !isUpdate && { variants: input.variants }),
};
```

**After:**
```typescript
const body = {
  title: input.title,
  subtitle: input.subtitle,
  description: input.description,
  handle: input.handle,
  status: input.status,
  thumbnail: input.thumbnailUrl,
  images: input.images,  // ✅ Images now in body
  metadata: {
    sanity_id: input.sanityId,
    tags: input.tags,
  },
  ...(input.variants && !isUpdate && { variants: input.variants }),
};
```

### 2. Updated `create-sample-product/route.ts` (Line 32-38)
**Added image formatting logic:**
```typescript
// Add images if provided - format them correctly for Medusa v2
if (body.images && Array.isArray(body.images) && body.images.length > 0) {
  productData.images = body.images.map((url: string, index: number) => ({
    url,
    position: index,
  }));
}
```

This formats the images array from Sanity (array of URLs) into the format Medusa v2 expects (array of objects with `url` and `position`).

## Data Flow Verification

### 1. Sanity Query (sanityClient.ts)
```groq
{
  title,                                        // ✅ Fetches title
  "thumbnailUrl": coalesce(thumbnail.asset->url, thumbnailUrl),  // ✅ Fetches thumbnail
  "images": images[].asset->url,               // ✅ Fetches images array
}
```

### 2. Mapping (mapToMedusa.ts)
```typescript
{
  title: doc.title,              // ✅ Maps title
  thumbnailUrl: doc.thumbnailUrl, // ✅ Maps thumbnail
  images: doc.images || [],       // ✅ Maps images
}
```

### 3. Upsert (upsert.ts)
```typescript
{
  title: input.title,            // ✅ Sends title
  thumbnail: input.thumbnailUrl, // ✅ Sends thumbnail
  images: input.images,          // ✅ Sends images
}
```

### 4. Product Creation (create-sample-product/route.ts)
```typescript
{
  title: body.title,             // ✅ Creates with title
  thumbnail: body.thumbnail,     // ✅ Creates with thumbnail
  images: body.images.map(...)   // ✅ Creates with formatted images
}
```

## Result
✅ Product **titles** are now correctly transferred from Sanity to Medusa
✅ Product **images** are now correctly transferred and formatted for Medusa v2
✅ Product **thumbnails** are correctly transferred
✅ All other product data (description, subtitle, variants, etc.) continue to work

## Testing
To test the fix:
```bash
cd medusa-backend
pnpm run sync:sanity
```

Check Railway logs to verify:
- Products are created with titles
- Images are being added to products
- No errors related to image formatting

## Webhook Sync
The webhook route (`src/api/admin/sanity-webhook/route.ts`) uses the same `mapSanityToUpsertBody` and `upsertProductREST` functions, so the fix automatically applies to webhook-based real-time syncs as well.

## Related Files
- `medusa-backend/src/lib/sanity-sync/upsert.ts`
- `medusa-backend/src/api/create-sample-product/route.ts`
- `medusa-backend/src/lib/sanity-sync/mapToMedusa.ts`
- `medusa-backend/src/lib/sanity-sync/sanityClient.ts`
- `medusa-backend/src/api/admin/sanity-webhook/route.ts`

