# Sanity → Medusa Product Sync Guide

## Overview

This system automatically synchronizes product data from Sanity CMS to Medusa v2 during build time and optionally via webhooks.

## Features

- **Build-time sync**: Runs automatically after Medusa build on Railway
- **Incremental sync**: Uses checkpoint timestamps to only sync changed products
- **Tag management**: Automatically creates and assigns product tags
- **Variant support**: Handles product variants with pricing and inventory
- **Webhook support**: Optional real-time sync via Sanity webhooks
- **Dry-run mode**: Test changes without affecting production data

## Environment Variables

### Required for Sanity
- `NEXT_PUBLIC_SANITY_PROJECT_ID`: Your Sanity project ID
- `NEXT_PUBLIC_SANITY_DATASET`: Your Sanity dataset (usually "production")
- `SANITY_API_READ_TOKEN`: Sanity read token with product access

### Required for Medusa
- `BACKEND_URL` or `MEDUSA_ADMIN_URL`: Your Medusa backend URL
- `MEDUSA_ADMIN_TOKEN`: Admin JWT token for API access

### Optional
- `SANITY_WEBHOOK_SECRET`: Secret for webhook signature verification
- `SANITY_SYNC_DRY_RUN`: Set to "true" to enable dry-run mode

## Usage

### Build-time Sync (Automatic)
The sync runs automatically after each Railway build if all required environment variables are set.

### Manual Sync
```bash
# Dry run (preview changes)
cd medusa-backend
SANITY_SYNC_DRY_RUN=true pnpm run sync:sanity:dry

# Real sync
pnpm run sync:sanity
```

### Webhook Setup (Optional)
1. In Sanity Studio, go to API → Webhooks
2. Add webhook URL: `https://your-backend-url/admin/sanity-webhook`
3. Set secret in `SANITY_WEBHOOK_SECRET` environment variable
4. Select "Product" document type and "Create/Update/Delete" operations

## Data Mapping

### Sanity → Medusa Fields
- `_id` → `metadata.sanity_id` (for idempotency)
- `title` → `title`
- `subtitle` → `subtitle`
- `description` → `description`
- `slug.current` → `handle`
- `status` → `status` (draft/published)
- `thumbnail.asset.url` → `thumbnail`
- `images[].asset.url` → `images`
- `tags[]` → product tags (created automatically)
- `price` → default variant price (in cents)
- `stock` → default variant inventory
- `variants[]` → product variants with pricing

### Product Variants
If no variants are specified in Sanity, a default variant is created with:
- Title: Product title
- Price: From `price` field (converted to cents)
- Inventory: From `stock` field

## Checkpoint System

The sync uses a checkpoint file (`.sanity-sync-checkpoint.json`) to track the last sync timestamp. This enables:
- Incremental syncs (only changed products)
- Resume capability after failures
- Performance optimization

## Error Handling

- Failed products are logged but don't stop the sync
- Tag creation failures are reported with details
- Network errors are retried with exponential backoff
- All errors are logged with structured output

## Monitoring

### Logs
The sync provides detailed logging:
```
[sanitySync] Fetching products since 2025-01-15T10:30:00Z...
[sanitySync] CREATED sanityId=product-123 productId=prod_abc123
[sanitySync] UPDATED sanityId=product-456 productId=prod_def456
[sanitySync] Done. updated=5 created=2 failed=0
```

### Railway Logs
Check Railway deployment logs to monitor sync execution and any errors.

## Troubleshooting

### Common Issues

1. **Missing environment variables**
   - Ensure all required env vars are set in Railway
   - Check that tokens have proper permissions

2. **Tag creation failures**
   - Verify `MEDUSA_ADMIN_TOKEN` has tag creation permissions
   - Check for duplicate tag names

3. **Product creation failures**
   - Ensure required fields (title, handle) are present
   - Check for duplicate handles

4. **Webhook not working**
   - Verify webhook URL is accessible
   - Check signature verification settings
   - Ensure webhook secret matches

### Debug Mode
Set `SANITY_SYNC_DRY_RUN=true` to preview changes without applying them.

## Security

- Webhook endpoints verify signatures when `SANITY_WEBHOOK_SECRET` is set
- Admin tokens are never logged
- All API calls use HTTPS
- Checkpoint files contain only timestamps (no sensitive data)

## Performance

- Syncs are batched to avoid overwhelming the API
- Incremental syncs only process changed products
- Failed products don't block successful ones
- Checkpoint system enables efficient resume

## Future Enhancements

- Inventory management integration
- Advanced variant mapping
- Bulk operations optimization
- Slack/email notifications
- Admin dashboard for sync status

