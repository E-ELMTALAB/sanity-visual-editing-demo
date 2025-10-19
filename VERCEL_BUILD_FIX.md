# Vercel Build Fix Documentation

## 🔍 Problem Identified

### Root Cause
Your repository contains **TWO separate Next.js projects**:
1. **Root Project**: `sanity-visual-editing-demo` (Sanity demo at repository root)
2. **Nested Project**: `sharifgpt-website/` (Your actual SharifGPT website)

### The Error
```
./sharifgpt-website/app/api/sync/products/[id]/route.ts:8:36
Type error: Cannot find module '@/lib/services/product-sync.service'
```

**Why this happened:**
- Vercel was building the ROOT project by default
- The root Next.js compiler was scanning ALL TypeScript files, including nested `sharifgpt-website/`
- When it found `sharifgpt-website/app/api/sync/products/[id]/route.ts`, it tried to compile it
- The file imports `@/lib/services/product-sync.service`
- In the root project context, `@/` resolves to the root directory, NOT `sharifgpt-website/`
- Therefore, it couldn't find `lib/services/product-sync.service.ts` (which only exists in `sharifgpt-website/`)

---

## ✅ Solution Implemented

I've created a **dual-approach solution** that gives you flexibility:

### Option 1: Build SharifGPT Website (Recommended)
Use `vercel.json` to tell Vercel to build from the `sharifgpt-website` folder.

### Option 2: Build Root Project (Ignore SharifGPT folder)
Keep building the root project but properly exclude the nested `sharifgpt-website` folder.

---

## 📝 Files Modified

### 1. **vercel.json** (NEW FILE)
```json
{
  "installCommand": "npm install --prefix sharifgpt-website",
  "buildCommand": "npm run build --prefix sharifgpt-website",
  "devCommand": "npm run dev --prefix sharifgpt-website",
  "outputDirectory": "sharifgpt-website/.next"
}
```
This tells Vercel to:
- Install dependencies in `sharifgpt-website/`
- Build the Next.js app in `sharifgpt-website/`
- Use the output from `sharifgpt-website/.next`

### 2. **.vercelignore** (REMOVED)
❌ Initially created but **REMOVED** because it conflicted with `vercel.json`.
- When `vercel.json` tells Vercel to build FROM `sharifgpt-website/`
- `.vercelignore` was preventing Vercel from accessing that folder
- Result: Build failed with "Could not read package.json"

### 3. **tsconfig.json** (MODIFIED)
```json
{
  "exclude": ["node_modules", "medusa-backend", "sharifgpt-website"]
}
```
Added `sharifgpt-website` to exclude list so TypeScript compiler ignores it.

### 4. **next.config.mjs** (MODIFIED)
```javascript
webpack: (config, { isServer }) => {
  config.watchOptions = {
    ...config.watchOptions,
    ignored: ['**/node_modules', '**/medusa-backend/**', '**/sharifgpt-website/**'],
  }
  return config
}
```
Added `sharifgpt-website` to webpack ignore list.

---

## 🚀 How to Deploy

### For SharifGPT Website (sharifgpt-website/)

**In Vercel Dashboard:**
1. Go to your project settings
2. Ensure `vercel.json` is being used (it should auto-detect)
3. Deploy

**Alternative: Set Root Directory in Vercel**
1. Go to Project Settings → General
2. Set "Root Directory" to `sharifgpt-website`
3. Click Save
4. Deploy

### For Root Sanity Demo Project

If you want to deploy the root project instead:
1. **Delete or rename** `vercel.json` (or set it in Vercel settings)
2. The exclusions in `.vercelignore`, `tsconfig.json`, and `next.config.mjs` will prevent conflicts
3. Deploy

---

## 🧪 Testing

### Test SharifGPT Website Build Locally:
```bash
cd sharifgpt-website
npm install
npm run build
npm start
```

### Test Root Project Build Locally:
```bash
# From repository root
npm install
npm run build
npm start
```

Both should now build without errors!

---

## 📋 Next Steps

1. **Choose which project to deploy:**
   - If deploying SharifGPT: Keep `vercel.json` as is
   - If deploying root Sanity demo: Remove/rename `vercel.json`

2. **Commit and push changes:**
   ```bash
   git add .
   git commit -m "Fix: Configure Vercel to build correct Next.js project"
   git push
   ```

3. **Deploy on Vercel:**
   - Push to trigger automatic deployment
   - Or manually redeploy in Vercel dashboard

---

## 🎯 Summary

**What was wrong:** 
- Vercel was building the root project but trying to compile files from the nested `sharifgpt-website/` folder with mismatched paths

**What was fixed:**
- Configured Vercel to build from `sharifgpt-website/` folder
- Added proper exclusions to prevent root project from processing nested project files
- Both projects can now coexist without conflicts

**Result:** 
✅ Clean builds without TypeScript errors
✅ CSS/Tailwind will work properly once deployed
✅ Both projects properly isolated

---

## ⚠️ Important Notes

1. **Two package.json files**: Each project has its own dependencies
   - Root: `package.json` (Sanity demo dependencies)
   - Nested: `sharifgpt-website/package.json` (SharifGPT dependencies)

2. **Two node_modules folders**: Each needs separate install
   - Root: `node_modules/`
   - Nested: `sharifgpt-website/node_modules/`

3. **CSS/Tailwind Issue**: The original issue you mentioned about CSS not working was because `sharifgpt-website/node_modules/` was missing. This should be resolved once Vercel runs `npm install --prefix sharifgpt-website`.

---

## 📞 Need Help?

If build still fails:
1. Check Vercel build logs for exact error
2. Verify which project you want to deploy
3. Ensure correct `vercel.json` configuration
4. Check that `.vercelignore` is committed to git

