# Sanity Sync Environment Variables

This document lists all environment variables needed for the Sanity → Medusa product synchronization system.

## Required Environment Variables

### Sanity Configuration
These variables are required to connect to your Sanity CMS:

```bash
# Your Sanity project ID (found in sanity.json or Sanity Studio settings)
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id

# Your Sanity dataset (usually "production")
NEXT_PUBLIC_SANITY_DATASET=production

# Sanity API token with read access to products
# Generate at: https://www.sanity.io/manage
SANITY_API_READ_TOKEN=sk...your-read-token
```

### Medusa Configuration
These variables are required to connect to your Medusa backend:

```bash
# Your Medusa backend URL (Railway URL or custom domain)
BACKEND_URL=https://your-backend.up.railway.app
# OR
MEDUSA_ADMIN_URL=https://your-backend.up.railway.app

# Medusa admin JWT token for API access
# Generate via: medusa user -e admin@example.com -p password
# Or use a service token
MEDUSA_ADMIN_TOKEN=your-admin-jwt-token
```

## Optional Environment Variables

### Sync Behavior
```bash
# Enable dry-run mode (preview changes without applying them)
# Default: false
SANITY_SYNC_DRY_RUN=true

# Deletion policy: hard (delete), soft (archive), or ignore
# Default: soft
SANITY_SYNC_DELETE=soft
```

### Webhook Configuration
```bash
# Secret for verifying Sanity webhook signatures
# Set the same value in Sanity webhook settings
SANITY_WEBHOOK_SECRET=your-webhook-secret
```

## How to Set on Railway

1. Go to your Railway project
2. Select the Medusa backend service
3. Go to "Variables" tab
4. Click "New Variable" for each variable above
5. Save and redeploy

## How to Test Locally

Create a `.env` file in the `medusa-backend` directory:

```bash
# Copy this template and fill in your values
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=
BACKEND_URL=http://localhost:9000
MEDUSA_ADMIN_TOKEN=
SANITY_SYNC_DRY_RUN=true
```

Then run:
```bash
cd medusa-backend
pnpm install
pnpm run sync:sanity:dry
```

## Generating Tokens

### Sanity Read Token
1. Go to https://www.sanity.io/manage
2. Select your project
3. Go to "API" → "Tokens"
4. Click "Add API token"
5. Name it (e.g., "Medusa Sync Read Token")
6. Set permissions to "Read"
7. Copy the token

### Medusa Admin Token
Option 1 - Via CLI:
```bash
cd medusa-backend
medusa user -e admin@example.com -p your-password
# Login to get JWT token
```

Option 2 - Via Admin Dashboard:
1. Go to your Medusa admin dashboard
2. Login as admin
3. Check browser developer tools → Network → Look for Authorization header
4. Copy the Bearer token

## Security Notes

- Never commit `.env` files to git
- Rotate tokens regularly
- Use different tokens for development and production
- Keep `SANITY_WEBHOOK_SECRET` secure and random
- Use read-only tokens when possible

## Troubleshooting

### "Missing environment variable: NEXT_PUBLIC_SANITY_DATASET"
- Ensure all Sanity variables are set in Railway
- Variable names are case-sensitive
- Redeploy after adding variables

### "Missing BACKEND_URL/MEDUSA_ADMIN_URL or MEDUSA_ADMIN_TOKEN"
- Set at least one of `BACKEND_URL` or `MEDUSA_ADMIN_URL`
- Ensure `MEDUSA_ADMIN_TOKEN` is a valid JWT
- Check token hasn't expired

### "Failed to sync: 401 Unauthorized"
- Token may be invalid or expired
- Regenerate admin token
- Ensure token has proper permissions
