# Deployment Guide

This monorepo contains a web application and Sanity Studio that can be deployed separately.

## Architecture

- **apps/web/**: Vite + React application (builds to `dist/`)
- **apps/studio/**: Sanity Studio v3 (builds to `dist/`)
- **packages/sanity-schema/**: Shared Sanity schemas

## Cloudflare Pages (Web App)

**Build Command:** `npm run build:web`
**Build Output Directory:** `apps/web/dist`
**Root Directory:** `apps/web`

Environment Variables:
- `VITE_SANITY_PROJECT_ID`
- `VITE_SANITY_DATASET`
- `VITE_SANITY_API_VERSION`

## Vercel (Sanity Studio)

**Build Command:** `npm run build:studio`
**Build Output Directory:** `apps/studio/dist`
**Root Directory:** `apps/studio`

Environment Variables:
- `SANITY_STUDIO_PROJECT_ID`
- `SANITY_STUDIO_DATASET`
- `SANITY_STUDIO_TITLE` (optional)

## Development

```bash
# Install dependencies
npm install

# Develop web app
npm run dev:web

# Develop studio
npm run dev:studio

# Build both for testing
npm run check
```

## Important Notes

- The web app excludes Studio routes for performance
- Schemas are shared via the `sanity-schema` package
- Studio uses Sanity v3, web app uses Sanity v4 client libraries
