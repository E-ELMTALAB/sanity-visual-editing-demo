# 🛠️ Setup Instructions - Sharif AI Soft

Complete setup guide for the Sanity-integrated React application.

---

## 📦 Installation

### 1. Install Dependencies

```bash
cd sharif-ai-soft-main
npm install
```

**This will install:**
- React & React Router
- Vite build tool
- Shadcn UI components
- **Sanity Client** (`@sanity/client`)
- **Sanity Image URL Builder** (`@sanity/image-url`)
- All other UI and utility libraries

---

## 🔐 Environment Configuration

### 2. Create Environment File

```bash
cp .env.example .env
```

### 3. Configure Sanity Credentials

Edit `.env` and add your **Sanity Project ID**:

```env
VITE_SANITY_PROJECT_ID=your-actual-project-id-here
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2023-06-21
```

---

## 🔍 Finding Your Sanity Project ID

### Method 1: From Sanity Dashboard
1. Visit https://sanity.io/manage
2. Select your project
3. Copy the Project ID from settings

### Method 2: From sharifgpt-website Project
```bash
# Check the sharifgpt-website project
cat ../sharifgpt-website/lib/sanity.api.ts
# Look for projectId value
```

### Method 3: Using Sanity CLI
```bash
npx sanity debug --secrets
```

---

## 🎨 Sanity Studio Setup

### 4. Verify Course Data in Sanity

Your Sanity Studio should have:

1. **Home Singleton Document**
   - Open Sanity Studio
   - Navigate to "Home" document
   - Scroll to "Bestselling Courses" section

2. **Add Sample Courses** (if empty)
   - Click "Add Item" in Bestselling Courses
   - Fill in required fields:
     - Title: e.g., "دوره جامع ChatGPT"
     - Description: Brief course description
     - Price: e.g., 890000 (in Toman)
     - Duration: e.g., "40 ساعت"
     - Level: Select from dropdown
     - Slug: Auto-generated from title
     - Image: Upload course image (optional)

3. **Publish Changes**
   - Click "Publish" to make courses visible

---

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

The app will start at: http://localhost:8080

**Check Browser Console:**
- Open DevTools (F12)
- Look for Sanity logs:
  ```
  [HOME] Fetching courses from Sanity...
  [HOME] ✅ Loaded 3 courses from Sanity
  ```

---

## 🏗️ Building for Production

### Test Build Locally

```bash
# Clean previous builds
npm run clean

# Build for production
npm run build

# Preview production build
npm run preview
```

Visit http://localhost:4173 to test the production build.

---

## 📁 Project Structure

```
sharif-ai-soft-main/
├── src/
│   ├── lib/
│   │   ├── sanity.config.ts     # Sanity configuration
│   │   ├── sanity.client.ts     # Sanity client setup
│   │   ├── sanity.queries.ts    # GROQ queries
│   │   ├── sanity.image.ts      # Image URL builder
│   │   └── utils.ts             # Utility functions
│   ├── pages/
│   │   └── Home.tsx             # Homepage (fetches courses)
│   ├── components/
│   │   ├── CourseCard.tsx       # Course card component
│   │   ├── Header.tsx           # Site header
│   │   └── Footer.tsx           # Site footer
│   └── App.tsx                  # Main app component
├── .env                         # Environment variables (create this)
├── .env.example                 # Environment template
├── vercel.json                  # Vercel configuration
├── vite.config.ts               # Vite build config
├── package.json                 # Dependencies
├── SETUP.md                     # This file
└── DEPLOYMENT.md                # Deployment guide
```

---

## 🔧 Configuration Files

### vercel.json
- Configures Vercel deployment
- Sets up routing for SPA
- Defines build settings

### vite.config.ts
- Optimized production builds
- Code splitting configuration
- Sanity packages bundled separately

### .env
- **IMPORTANT:** Never commit this file!
- Contains your Sanity credentials
- Already in `.gitignore`

---

## 🧪 Testing

### 1. Test Sanity Connection

```bash
npm run dev
```

Open browser console and check for:
- ✅ `[HOME] Fetching courses from Sanity...`
- ✅ `[HOME] ✅ Loaded X courses from Sanity`

### 2. Test Without Sanity (Fallback)

If Sanity is not configured, the app will:
- Show a warning in console
- Display fallback courses (hardcoded)
- Still function normally

### 3. Test Production Build

```bash
npm run build
npm run preview
```

Check that:
- Build completes without errors
- Assets are optimized
- App loads quickly
- Courses display correctly

---

## ⚠️ Common Issues

### Issue: "Sanity not configured"

**Cause:** Missing or invalid environment variables

**Solution:**
```bash
# Check .env file exists
ls -la .env

# Verify content
cat .env

# Should show:
# VITE_SANITY_PROJECT_ID=your-id-here
```

### Issue: "No courses found in Sanity"

**Cause:** No courses in Sanity Home singleton

**Solution:**
1. Open Sanity Studio
2. Go to Home document
3. Add courses to "Bestselling Courses"
4. Publish changes

### Issue: Build fails with TypeScript errors

**Solution:**
```bash
# Check TypeScript errors
npm run type-check

# Fix any type errors in src/ files
```

### Issue: Courses not displaying

**Cause:** Multiple possible reasons

**Debug steps:**
1. Check browser console for errors
2. Verify Sanity Project ID is correct
3. Check network tab for failed requests
4. Test Sanity query in Vision tool (Sanity Studio)

---

## 📚 Learn More

### Sanity CMS
- [Sanity Documentation](https://www.sanity.io/docs)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Sanity Image URLs](https://www.sanity.io/docs/image-url)

### Vite
- [Vite Documentation](https://vitejs.dev/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

### React
- [React Documentation](https://react.dev/)
- [React Router](https://reactrouter.com/)

---

## ✅ Setup Checklist

Before deploying, make sure:

- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created with Sanity credentials
- [ ] Sanity Project ID is correct
- [ ] Courses added to Sanity Home singleton
- [ ] Local development works (`npm run dev`)
- [ ] Build succeeds (`npm run build`)
- [ ] Production preview works (`npm run preview`)
- [ ] No console errors
- [ ] Courses display correctly

---

## 🎉 Ready to Deploy!

Once all checkboxes are ✅, you're ready to deploy to Vercel!

See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions.

---

**Need Help?** Check console logs first, they provide detailed debugging info!

