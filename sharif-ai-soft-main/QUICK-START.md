# ⚡ Quick Start Guide

**Get your Sanity-integrated app running in 5 minutes!**

---

## 🎯 Step 1: Find Your Sanity Project ID

Choose **ONE** method:

### Method A: From Sanity Dashboard
1. Go to https://sanity.io/manage
2. Select your project
3. Copy the Project ID

### Method B: From sharifgpt-website
```bash
# Open this file
E:\website-builder\vercel\sanity-visual-editing-demo\sharifgpt-website\lib\sanity.api.ts

# Look for:
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'YOUR-ID-HERE'
```

### Method C: Sanity CLI
```bash
npx sanity debug --secrets
```

---

## 🎯 Step 2: Install & Configure

```bash
# Navigate to project
cd sharif-ai-soft-main

# Install dependencies (takes ~1 minute)
npm install

# Create .env file
# Windows PowerShell:
Copy-Item .env.example .env

# OR manually create .env file with:
VITE_SANITY_PROJECT_ID=paste-your-id-here
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2023-06-21
```

---

## 🎯 Step 3: Add Courses to Sanity (if needed)

1. Open your Sanity Studio
2. Find the **"Home"** document (singleton)
3. Scroll to **"Bestselling Courses"** section
4. If empty, click **"Add Item"** and fill:
   - Title: دوره جامع ChatGPT
   - Description: آموزش کامل ChatGPT
   - Price: 890000
   - Duration: 40 ساعت
   - Level: beginner
   - Slug: (auto-generated)
5. Click **"Publish"**

---

## 🎯 Step 4: Test Locally

```bash
# Start development server
npm run dev
```

**Visit:** http://localhost:8080

**Check Browser Console (F12):**
```
✅ Look for: [HOME] ✅ Loaded 3 courses from Sanity
❌ If you see: [HOME] Sanity not configured
   → Check your .env file has correct Project ID
```

---

## 🎯 Step 5: Deploy to Vercel

### Option A: Via GitHub (Easiest)

```bash
# 1. Push to GitHub
git add .
git commit -m "Sanity integration complete"
git push origin main

# 2. Go to vercel.com
# 3. Click "Add New Project"
# 4. Import your repository
# 5. Add environment variables:
#    VITE_SANITY_PROJECT_ID = your-id
#    VITE_SANITY_DATASET = production
#    VITE_SANITY_API_VERSION = 2023-06-21
# 6. Click "Deploy"
```

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables when prompted
# Then deploy to production:
vercel --prod
```

---

## 🎯 Step 6: Configure CORS (After Deploy)

1. Go to https://sanity.io/manage
2. Select your project
3. Go to **Settings → API → CORS Origins**
4. Click **"Add CORS origin"**
5. Add your Vercel URL: `https://your-project.vercel.app`
6. Check **"Allow credentials"**
7. Click **"Save"**

---

## ✅ Success Checklist

After deployment, verify:

- [ ] Site loads at your Vercel URL
- [ ] Homepage displays courses
- [ ] Course images appear
- [ ] No console errors (F12)
- [ ] Courses match what's in Sanity
- [ ] Navigation works
- [ ] Mobile responsive

---

## 🚨 Troubleshooting

### "Sanity not configured"
→ Check `.env` file exists and has correct Project ID

### "No courses found"
→ Add courses to Sanity Home singleton

### Build fails
→ Run: `npm install` then `npm run build`

### CORS error
→ Add Vercel domain to Sanity CORS settings

### Courses not updating
→ Clear browser cache (Ctrl+Shift+R)

---

## 📚 Need More Help?

- **Setup Details:** See `SETUP.md`
- **Deployment Guide:** See `DEPLOYMENT.md`
- **Technical Details:** See `INTEGRATION-SUMMARY.md`
- **Console Logs:** Browser console has detailed debug info

---

## 🎉 You're Done!

**Total time:** ~5-10 minutes

Your Sanity-integrated app is now live! 🚀

---

**Quick Commands Reference:**

```bash
npm run dev       # Local development
npm run build     # Test build
npm run preview   # Preview production
vercel           # Deploy preview
vercel --prod    # Deploy production
```

