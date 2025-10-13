# Medusa Backend Deployment Guide

## Overview

This guide documents the complete setup and deployment process for the Medusa e-commerce backend, including all issues encountered and their solutions during the Railway deployment process.

## Project Structure

```
medusa-backend/
├── Dockerfile              # Docker configuration for Railway
├── package.json           # Dependencies and scripts
├── medusa-config.js       # Medusa configuration
├── tsconfig.json          # TypeScript configuration
├── src/
│   ├── api/              # API routes and endpoints
│   ├── services/         # Business logic services
│   └── subscribers/      # Event handlers
└── data/
    └── seed.json         # Database seed data
```

## Issues Encountered & Solutions

### Issue 1: Package Lock Corruption

**Problem**: Railway deployment failed with `npm error Invalid Version:` due to corrupted `package-lock.json`.

**Root Cause**: The lockfile contained invalid version entries, causing npm to fail during dependency resolution.

**Solution**:
- Removed corrupted `package-lock.json` from repository
- Updated Dockerfile to skip lockfile generation with `--no-package-lock` flag
- Used `npm install` instead of `npm ci` for more flexible dependency resolution

**Files Changed**:
- Deleted: `medusa-backend/package-lock.json`
- Modified: `medusa-backend/Dockerfile`

### Issue 2: TypeScript Compilation Errors

**Problem**: Build failed with TypeScript errors in webhook and service files.

**Root Cause**: Incorrect return types in Express handlers and missing container property in service classes.

**Solution**:
- Fixed return types in webhook handlers to return `void` instead of `Response`
- Added proper container property typing in service classes
- Ensured all code paths properly handle responses

**Files Changed**:
- Modified: `medusa-backend/src/api/routes/store/webhooks/sanity-sync.ts`
- Modified: `medusa-backend/src/services/digital-fulfillment.ts`

### Issue 3: Admin Build Dependency Conflicts

**Problem**: `medusa-admin build` failed due to incompatible `ajv` package versions.

**Root Cause**: Using `--no-package-lock` caused npm to install conflicting dependency versions required by the admin UI build process.

**Solution**:
- Skip admin UI build during Docker build (only build server)
- Admin UI can be accessed via Medusa's hosted admin or built separately if needed

**Files Changed**:
- Modified: `medusa-backend/Dockerfile` (changed `npm run build` to `npm run build:server`)

## Current Dockerfile Configuration

```dockerfile
FROM node:18-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    bash

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies (production only)
FROM base AS dependencies
RUN npm install --production --legacy-peer-deps --no-package-lock
RUN cp -R node_modules /prod_node_modules

# Build application (server only, no admin)
FROM base AS build
COPY package.json ./
RUN npm install --legacy-peer-deps --no-package-lock
COPY . .
RUN npm run build:server

# Production image
FROM base AS production
ENV NODE_ENV=production

COPY --from=dependencies /prod_node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/medusa-config.js ./
COPY --from=build /app/package.json ./

# Expose ports
EXPOSE 9000
EXPOSE 7001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:9000/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"

# Start application
CMD ["npm", "start"]
```

## Key Build Script Changes

**Before (caused issues):**
```json
{
  "build": "cross-env npm run clean && npm run build:server && npm run build:admin"
}
```

**After (stable):**
```json
{
  "build": "cross-env npm run clean && npm run build:server"
}
```

## Environment Variables Required

Create a `.env` file in `medusa-backend/` with:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/medusa_db

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# Cookie Secret
COOKIE_SECRET=your-cookie-secret

# Store Configuration
STORE_CORS=http://localhost:3000,https://yourdomain.com

# Sanity Webhook (for product sync)
SANITY_WEBHOOK_SECRET=your-webhook-secret

# Admin Configuration
MEDUSA_ADMIN_URL=http://localhost:7000
```

## Railway Deployment Steps

1. **Connect Repository**: Connect your GitHub repository to Railway
2. **Environment Setup**: Railway will automatically detect the Dockerfile
3. **Database**: Provision a PostgreSQL database in Railway
4. **Environment Variables**: Set all required environment variables
5. **Deploy**: Push changes to trigger deployment

## Database Setup

Railway provides PostgreSQL databases. The connection string format is:
```
postgresql://[username]:[password]@[host]:[port]/[database]
```

## Admin Panel Access

Since we skip admin build in Docker, you can access the admin panel via:
- **Medusa Cloud Admin**: https://medusajs.com/admin
- **Local Development**: Run `npm run dev` and access `http://localhost:7000`

## API Endpoints Available

Once deployed, your Medusa backend provides:

- **Store API**: `https://your-domain.railway.app/store/`
- **Admin API**: `https://your-domain.railway.app/admin/`
- **Custom Webhooks**: `https://your-domain.railway.app/store/webhooks/sanity-sync`

## Sanity Integration

The webhook endpoint `/store/webhooks/sanity-sync` handles:
- Product creation and updates from Sanity
- Product archiving (soft delete)
- Signature verification for security

## Digital Product Fulfillment

The custom fulfillment service handles:
- Digital product delivery via email, download links, API keys
- Order processing for digital items
- Fulfillment record creation

## Troubleshooting

### Build Issues
1. **Clear Railway build cache** if you encounter persistent issues
2. **Check logs** in Railway dashboard for detailed error messages
3. **Verify environment variables** are correctly set

### Common Commands
```bash
# Local development
npm run dev

# Build for production
npm run build:server

# Seed database
npm run seed

# Run migrations
npm run migrate
```

## Performance Considerations

- The current Dockerfile installs all dependencies during build, which may be slower
- Consider using multi-stage builds to optimize layer caching
- Monitor memory usage on Railway (may need to upgrade plan for production)

## Security Notes

- Keep webhook secrets secure and rotate regularly
- Use HTTPS in production
- Configure proper CORS settings
- Implement rate limiting for API endpoints

## Future Improvements

1. **Package Lock Stability**: Generate a proper `package-lock.json` locally and commit it
2. **Admin UI Build**: Build admin UI separately or use hosted version
3. **Database Migrations**: Implement proper migration strategy
4. **Monitoring**: Add logging and monitoring for production

## Conclusion

The Medusa backend is now successfully deployable to Railway with a stable configuration that avoids the common dependency and build issues. The API is fully functional for e-commerce operations, with custom integrations for Sanity CMS and digital product fulfillment.
