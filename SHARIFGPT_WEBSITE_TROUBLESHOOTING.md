# SharifGPT Website — Build & CSS/Tailwind Troubleshooting Guide

This guide documents the exact issues we hit and the fixes that made the SharifGPT website build and work (both locally and on Vercel). Use it as a checklist when you see similar symptoms.

## Symptoms you may see

- CSS/Tailwind not applying in the SharifGPT app.
- Vercel build fails with module resolution errors (e.g., "Cannot find module '@/lib/sanity.client'").
- Vercel build fails to find `sharifgpt-website/package.json`.
- Next.js tries to build files from the wrong project (root vs nested app).

## High-level root causes we found

1. Two Next.js projects in the same repo:
   - Root app: `sanity-visual-editing-demo` (Sanity demo)
   - Nested app: `sharifgpt-website/` (SharifGPT site)

2. Vercel building the wrong app (the root), while dependencies and code for SharifGPT lived in `sharifgpt-website/`.

3. A conflict between `vercel.json` and `.vercelignore`:
   - `vercel.json` told Vercel to build from `sharifgpt-website/`
   - `.vercelignore` was ignoring `sharifgpt-website/` entirely → Vercel could not find its `package.json`.

4. Missing `node_modules` for the nested app caused Tailwind (and other deps) not to load.

5. The nested app referenced Sanity utilities and types that only existed in the root app.

6. Several files in the nested app used deep relative imports (e.g., `../../../lib/...`) that pointed to the root app instead of the nested app. This broke Webpack module resolution in Vercel.

7. One incorrect import path in `sharifgpt-website/lib/sanity.client.ts` (`'lib/sanity.api'` instead of `'./sanity.api'`).

---

## Definitive fixes that worked

### 1) Build the correct app on Vercel (nested root)

Add `vercel.json` at the repo root to explicitly build `sharifgpt-website/`:

```json
{
  "installCommand": "cd sharifgpt-website && npm install",
  "buildCommand": "cd sharifgpt-website && npm run build",
  "devCommand": "cd sharifgpt-website && npm run dev",
  "outputDirectory": "sharifgpt-website/.next"
}
```

Notes:
- We removed `.vercelignore` because it conflicted with `vercel.json` by ignoring the very folder we needed to build.
- Alternatively, set Vercel Project Settings → Root Directory = `sharifgpt-website` (then you may not need `vercel.json`).

### 2) Ensure nested app dependencies are installed

When working locally:

```bash
cd sharifgpt-website
npm install  # or pnpm install if you use pnpm
npm run dev
```

Tailwind v4 is used via PostCSS plugin (`@tailwindcss/postcss`). Make sure `postcss.config.mjs` exists and `app/globals.css` includes Tailwind imports:

- `sharifgpt-website/postcss.config.mjs`:
```js
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}

export default config
```

- `sharifgpt-website/app/globals.css` should include:
```css
@import "tailwindcss";
@import "tw-animate-css";
```

If CSS still doesn’t apply locally, confirm `node_modules/` exists inside `sharifgpt-website/`.

### 3) Keep root app from interfering (optional but recommended)

In the root project (repo root), prevent the root app from watching/compiling the nested app:

- `next.config.mjs` (root):
```js
webpack: (config) => {
  config.watchOptions = {
    ...config.watchOptions,
    ignored: ['**/node_modules', '**/medusa-backend/**', '**/sharifgpt-website/**'],
  }
  return config
},
```

- `tsconfig.json` (root):
```json
{
  "exclude": ["node_modules", "medusa-backend", "sharifgpt-website"]
}
```

### 4) Bring required Sanity files into the nested app

Copy these from the root `lib/` to `sharifgpt-website/lib/`:
- `sanity.client.ts`
- `sanity.api.ts`
- `sanity.image.ts`
- `sanity.links.ts`
- `sanity.queries.ts`
- `fetchWithFallback.ts`

Also copy types from root to nested app:
- `types/index.ts` → `sharifgpt-website/types/index.ts`

Then fix import paths inside the nested app to reference the local copies (see Step 5).

### 5) Use `@/` path alias everywhere in the nested app

Replace deep relative imports with the alias. Examples:

- Before:
```ts
import { getClient } from '../../../lib/sanity.client'
import CartDropdown from '../../components/cart-dropdown'
import type { FAQ } from '../../../types'
```
- After:
```ts
import { getClient } from '@/lib/sanity.client'
import CartDropdown from '@/components/cart-dropdown'
import type { FAQ } from '@/types'
```

Confirm `tsconfig.json` in `sharifgpt-website/` defines the alias:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### 6) Fix incorrect local import in sanity client

In `sharifgpt-website/lib/sanity.client.ts`, ensure it imports the sibling file with a relative path:

- Before: `import { apiVersion, basePath, dataset, projectId } from 'lib/sanity.api'`
- After:  `import { apiVersion, basePath, dataset, projectId } from './sanity.api'`

### 7) Simplify server-side product page if needed

If the page was doing server-side Sanity queries that relied on missing utilities, you can simplify initially and move the querying to a client component or bring the missing utilities locally. Example of a minimal page:

```ts
export default function ProductsPage() {
  return <ProductsPageClient />
}
```

---

## Quick checklist (TL;DR)

- Choose the correct app to build on Vercel
  - Use `vercel.json` (above) or set Root Directory to `sharifgpt-website/` in Vercel.
  - Do NOT ignore `sharifgpt-website/` via `.vercelignore` if you intend to build it.
- Install deps in the nested app folder
  - `cd sharifgpt-website && npm install && npm run build`
- Ensure Tailwind v4 is wired via PostCSS and `app/globals.css` imports Tailwind
- Copy required `lib/` and `types/` files into `sharifgpt-website/`
- Replace deep relative imports with `@/` alias across the nested app
- Fix any remaining wrong imports (e.g., `./sanity.api`)
- Optionally keep the root app from watching/compiling the nested app

---

## Common errors and their fixes

- "Could not read package.json in /sharifgpt-website"
  - `.vercelignore` is ignoring the folder you’re trying to build. Remove it or configure properly.

- "Module not found: Can't resolve '@/lib/sanity.client'"
  - The file doesn’t exist in the nested app. Copy it into `sharifgpt-website/lib/` and fix imports.

- "Module not found: Can't resolve 'lib/sanity.api'"
  - Import path inside `sanity.client.ts` is wrong. Use `./sanity.api`.

- CSS/Tailwind not applying
  - `node_modules/` missing in `sharifgpt-website/` → `npm install`
  - Tailwind v4 requires PostCSS plugin and `@import "tailwindcss";` in `app/globals.css`

---

## Suggested commit messages

- Configure Vercel to build nested app: `Fix: Configure Vercel to build sharifgpt-website subdirectory`
- Add Sanity files to nested app: `Add missing Sanity client and type definitions to sharifgpt-website`
- Fix imports: `Fix: Replace relative imports with @/ aliases in sharifgpt-website`

---

## Final notes

- Keeping the two apps isolated (dependencies, imports, and build pipelines) is key.
- Prefer `@/` aliases over deep relative imports in the nested app.
- If you switch which app you deploy, align Vercel settings (`vercel.json` or Root Directory) accordingly.
