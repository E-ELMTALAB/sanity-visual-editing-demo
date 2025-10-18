# 🚨 Website Not Loading - Complete Fix Guide

## Root Cause Identified ✅

**Problem**: Your `.env.local` file is **MISSING**

**Build Error**:
```
Error: Missing environment variable: NEXT_PUBLIC_SANITY_DATASET
at app/robots.ts
```

**What This Means**:
- Your website needs to connect to Sanity CMS to fetch content
- Sanity credentials are stored in `.env.local` file
- Without this file, the build fails and pages won't load
- This affects both development (`npm run dev`) and production builds

---

## 🔧 How to Fix

### Step 1: Get Your Sanity Credentials

You need these 3 values:

1. **NEXT_PUBLIC_SANITY_PROJECT_ID**
   - Where: https://www.sanity.io/manage
   - Select your project → Settings
   - Example: `abc123de`

2. **NEXT_PUBLIC_SANITY_DATASET**
   - Where: Same place as Project ID
   - Common values: `production`, `development`, `staging`
   - Use: `production`

3. **SANITY_API_READ_TOKEN** (optional but recommended)
   - Where: https://www.sanity.io/manage
   - Your project → API → Tokens → "Create new token"
   - Permissions: "Read" access
   - Example: `skAbcDef123456...`

### Step 2: Create `.env.local` File

Create a file named `.env.local` in your project root (same folder as `package.json`):

```env
# Sanity Configuration (REQUIRED)
NEXT_PUBLIC_SANITY_PROJECT_ID=your-actual-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=your-actual-read-token
NEXT_PUBLIC_SANITY_API_VERSION=2023-06-21

# Visual Editing (Optional)
NEXT_PUBLIC_SANITY_VISUAL_EDITING=false
```

**Replace**:
- `your-actual-project-id` → Your real Sanity Project ID
- `your-actual-read-token` → Your real Sanity API token

### Step 3: Test Locally

```bash
# Stop any running dev server (Ctrl+C)
npm run dev
```

Your website should now load at `http://localhost:3000`

---

## 📝 Quick Copy-Paste Template

**File**: `.env.local` (create this in your project root)

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=
NEXT_PUBLIC_SANITY_API_VERSION=2023-06-21
```

Fill in the empty values from your Sanity dashboard.

---

## 🔍 How to Find Your Sanity Credentials

### Option 1: Check Existing Config
Look in `sanity.config.ts` - sometimes the project ID is visible there:
```typescript
projectId: 'abc123de', // ← This is your project ID
dataset: 'production',  // ← This is your dataset
```

### Option 2: Sanity Dashboard
1. Go to https://www.sanity.io/manage
2. Login with your account
3. Click on your project
4. You'll see Project ID and Dataset name

### Option 3: Sanity CLI
```bash
cd your-project
npx sanity manage
# This opens your Sanity dashboard in browser
```

---

## 🚀 After Creating `.env.local`

### For Local Development:
```bash
npm run dev
# Website should load at http://localhost:3000
```

### For Production (Vercel/Railway):
You need to add the same environment variables to your hosting platform:

**Vercel**:
1. Go to vercel.com → Your project
2. Settings → Environment Variables
3. Add all 3 variables

**Railway**:
1. Go to railway.app → Your project
2. Click your service → Variables tab
3. Add all 3 variables

---

## ✅ Verification Checklist

After creating `.env.local`:

- [ ] File is named exactly `.env.local` (not `.env.local.txt`)
- [ ] File is in project root (same folder as `package.json`)
- [ ] All 3 required variables are set
- [ ] No quotes around values
- [ ] No spaces around `=` sign
- [ ] Values are YOUR actual credentials (not placeholders)
- [ ] Run `npm run dev`
- [ ] Website loads successfully
- [ ] No build errors in terminal

---

## 🛠️ Troubleshooting

### Issue: "Project not found"
**Fix**: Double-check your Project ID is correct

### Issue: "Dataset not found"
**Fix**: Make sure dataset name is exactly `production` (lowercase)

### Issue: "Unauthorized"
**Fix**: Check your API token has "Read" permissions

### Issue: Still getting error after creating `.env.local`
**Fix**: 
1. Stop the dev server (Ctrl+C)
2. Delete `.next` folder
3. Run `npm run dev` again

### Issue: Don't have Sanity account
**Fix**: You need to create one:
```bash
npm create sanity@latest
# Follow prompts to create new project
# Get credentials from dashboard
```

---

## 📌 Important Notes

1. **Never commit `.env.local` to Git**
   - It's already in `.gitignore`
   - Contains sensitive credentials
   - Each developer needs their own

2. **Different environments need different setup**
   - Local: `.env.local` file
   - Vercel: Environment Variables in dashboard
   - Railway: Variables in Railway dashboard

3. **Build vs Runtime**
   - Variables starting with `NEXT_PUBLIC_` are available in browser
   - Other variables are server-side only
   - Both are needed during build time

---

## 🎯 Summary

**Problem**: Missing `.env.local` file → Website can't connect to Sanity → Build fails

**Solution**: 
1. Get credentials from https://www.sanity.io/manage
2. Create `.env.local` file in project root
3. Add your Sanity credentials
4. Run `npm run dev`
5. ✅ Website loads!

---

## 🆘 Still Need Help?

If you're still stuck:

1. **Check you have a Sanity project**
   - Login to https://www.sanity.io/manage
   - Should see your project listed

2. **Check Sanity Studio works**
   - Go to http://localhost:3000/studio
   - Should load the Sanity Studio interface

3. **Check the exact error**
   - Run `npm run build`
   - Share the full error message

4. **Check file exists**
   ```bash
   ls -a | findstr env
   # Should show .env.local
   ```

---

Need the credentials? Check your Sanity account or create a new Sanity project!

