# 🚀 Deployment Guide - Sharif AI Soft

This guide will help you deploy your Sanity-connected React app to Vercel.

---

## 📋 Pre-Deployment Checklist

### ✅ Step 1: Get Your Sanity Project ID

You need to find your Sanity Project ID. Here's how:

**Option A: From Sanity Dashboard**
1. Go to https://sanity.io/manage
2. Select your project (the same one used by `sharifgpt-website`)
3. Copy the Project ID from the project settings

**Option B: From sharifgpt-website**
1. Navigate to `sharifgpt-website/lib/sanity.api.ts`
2. Look for the `projectId` value or check environment variables
3. You can also check `sharifgpt-website/.env.local` if it exists

**Option C: From Sanity CLI**
```bash
npx sanity debug --secrets
```

---

### ✅ Step 2: Update Environment Variables Locally

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` and add your actual Sanity Project ID:**
   ```env
   VITE_SANITY_PROJECT_ID=your-actual-project-id-here
   VITE_SANITY_DATASET=production
   VITE_SANITY_API_VERSION=2023-06-21
   ```

3. **Test locally:**
   ```bash
   npm install
   npm run dev
   ```
   
   Visit http://localhost:8080 and check the browser console for Sanity logs.

---

### ✅ Step 3: Verify Sanity Data

1. Open your Sanity Studio (usually at `/studio` route or standalone)
2. Navigate to the "Home" singleton document
3. Scroll to the "Bestselling Courses" section
4. Make sure you have at least one course added there
5. Each course should have:
   - Title ✓
   - Description ✓
   - Price ✓
   - Duration ✓
   - Level ✓
   - Slug ✓
   - Image (optional)

---

## 🌐 Deploy to Vercel

### Method 1: Deploy via GitHub (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Add Sanity integration"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect it's a Vite project

3. **Configure Build Settings:**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Add Environment Variables:**
   In the Vercel project settings → Environment Variables, add:
   ```
   VITE_SANITY_PROJECT_ID = your-actual-project-id
   VITE_SANITY_DATASET = production
   VITE_SANITY_API_VERSION = 2023-06-21
   ```

5. **Deploy:**
   - Click "Deploy"
   - Wait for the build to complete
   - Your site will be live at `https://your-project.vercel.app`

---

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy to preview:**
   ```bash
   vercel
   ```

4. **Add environment variables:**
   ```bash
   vercel env add VITE_SANITY_PROJECT_ID
   # Enter your project ID when prompted
   
   vercel env add VITE_SANITY_DATASET
   # Enter: production
   
   vercel env add VITE_SANITY_API_VERSION
   # Enter: 2023-06-21
   ```

5. **Deploy to production:**
   ```bash
   vercel --prod
   ```

---

## ⚙️ Post-Deployment Configuration

### Configure Sanity CORS

After deploying, you need to allow your Vercel domain in Sanity:

1. Go to https://sanity.io/manage
2. Select your project
3. Go to Settings → API → CORS Origins
4. Click "Add CORS origin"
5. Add your Vercel URL: `https://your-project.vercel.app`
6. Check "Allow credentials" if needed
7. Save

---

## 🧪 Testing Your Deployment

1. **Visit your deployed URL**
2. **Open Browser DevTools** (F12)
3. **Check Console for logs:**
   - Look for `[HOME] Fetching courses from Sanity...`
   - Should see `[HOME] ✅ Loaded X courses from Sanity`

4. **If you see errors:**
   - Check that environment variables are set correctly in Vercel
   - Verify Sanity CORS is configured
   - Check that your Sanity project allows public read access
   - Review Sanity project ID matches your actual project

---

## 🔧 Troubleshooting

### Problem: "Sanity not configured" warning

**Solution:**
- Check environment variables in Vercel dashboard
- Make sure variable names start with `VITE_`
- Redeploy after adding environment variables

### Problem: Courses not loading

**Solution:**
1. Check Sanity Studio has courses in the Home singleton
2. Verify CORS settings in Sanity
3. Check browser console for specific errors
4. Test Sanity query in Vision tool (Sanity Studio)

### Problem: Build fails

**Solution:**
```bash
# Clean and rebuild locally first
npm run clean
npm install
npm run build
```

### Problem: Images not showing

**Solution:**
- Verify courses have images in Sanity
- Check image references are valid
- Ensure Sanity image URLs are accessible

---

## 📊 Monitoring

### Check Build Logs
- Vercel Dashboard → Your Project → Deployments → [Latest] → Build Logs

### Check Runtime Logs
- Vercel Dashboard → Your Project → Logs (real-time)

### Performance
- Vercel automatically provides analytics
- Check Core Web Vitals in Vercel dashboard

---

## 🔄 Continuous Deployment

Once set up via GitHub:
- Every push to `main` branch = automatic deployment
- Pull requests get preview deployments
- Rollback to previous deployment anytime in Vercel dashboard

---

## 📝 Important Notes

⚠️ **Environment Variables:**
- All Vite env vars starting with `VITE_` are PUBLIC
- They are exposed to the browser
- Never put sensitive tokens in VITE_ variables

⚠️ **Sanity Access:**
- Your Sanity project must allow public read access
- Configure CORS for your Vercel domain
- Use API tokens only for write operations (not in frontend)

⚠️ **Caching:**
- Vite production builds are cached aggressively
- Clear browser cache if you don't see updates
- Vercel edge network caches static assets

---

## 🎉 Success!

If everything is configured correctly:
- ✅ Your site loads fast on Vercel
- ✅ Courses display from Sanity
- ✅ Images load properly
- ✅ Navigation works smoothly
- ✅ Mobile responsive

---

## 🆘 Need Help?

1. Check browser console for errors
2. Check Vercel build logs
3. Test Sanity connection with Vision tool
4. Verify all environment variables
5. Review this guide step by step

---

**Built with:** React + Vite + Sanity CMS + Vercel
**Last Updated:** $(date)

