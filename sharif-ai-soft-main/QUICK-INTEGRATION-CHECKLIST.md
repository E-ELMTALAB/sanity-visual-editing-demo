# ⚡ Quick Integration Checklist for New UI Folders

**Use this for rapid integration of new UI folders**

---

## 📋 Pre-Flight Checks (5 min)

- [ ] New UI folder in repository
- [ ] Has `package.json`
- [ ] Identify which page needs Sanity data
- [ ] Have Sanity Project ID ready

---

## 🚀 Integration Steps (30-45 min)

### 1. Install Dependencies
```bash
cd new-ui-folder
npm install @sanity/client @sanity/image-url
```

### 2. Copy Sanity Files

**Copy these 4 files from `sharif-ai-soft-main/src/lib/`:**
- ✅ `sanity.config.ts`
- ✅ `sanity.client.ts`
- ✅ `sanity.queries.ts` (update queries for your data)
- ✅ `sanity.image.ts`

### 3. Environment Setup
```bash
# Create files
cp .env.example .env

# Add to .env
VITE_SANITY_PROJECT_ID=your-project-id
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2023-06-21

# Update .gitignore
echo ".env" >> .gitignore
```

### 4. Update Target Component

**Pattern to follow:**
```typescript
// Imports
import { fetchFromSanity } from "@/lib/sanity.client"
import { yourQuery } from "@/lib/sanity.queries"

// Rename hardcoded → fallback
const fallbackData = [...]

// State
const [data, setData] = useState(fallbackData)

// Fetch
useEffect(() => {
  async function load() {
    const result = await fetchFromSanity(yourQuery)
    if (result) setData(result)
  }
  load()
}, [])

// CRITICAL: Pass as props to sub-components
<SubComponent items={data} />
```

### 5. Build Config

**Update `vite.config.ts`:**
```typescript
export default defineConfig({
  base: "/",  // ← ADD THIS
  // ... rest
})
```

**Create `vercel.json`:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "rewrites": [{"source": "/(.*)", "destination": "/index.html"}]
}
```

### 6. Test Locally
```bash
npm run dev      # Test development
npm run build    # Test production build
npm run preview  # Preview build
```

**Check console for:**
```
✅ [PAGE] ✅ Loaded X items from Sanity
```

### 7. Git Commit
```bash
git add .
git commit -m "Add Sanity integration for [page-name]"
git push origin your-branch
```

### 8. Deploy to Vercel

1. **Vercel → New Project**
2. **Root Directory:** `your-ui-folder-name` ← CRITICAL
3. **Environment Variables:** Add 3 vars
4. **Deploy**

### 9. Post-Deploy

1. **Add Vercel URL to Sanity CORS**
   - sanity.io/manage → API → CORS Origins
2. **Verify site works**
3. **Check console logs**

---

## 🚨 Critical Mistakes to Avoid

### ❌ #1: State Access in External Components
```typescript
// ❌ WRONG - Will cause ReferenceError
function SubComponent() {
  return <div>{stateVar}</div>
}

// ✅ CORRECT - Pass as prop
function SubComponent({ data }) {
  return <div>{data}</div>
}
<SubComponent data={stateVar} />
```

### ❌ #2: Missing `base` in vite.config
```typescript
// ❌ Will cause blank page on Vercel
export default defineConfig({
  // missing base: "/"
})

// ✅ Correct
export default defineConfig({
  base: "/",
})
```

### ❌ #3: Wrong Env Var Prefix
```typescript
// ❌ Won't work in Vite
process.env.SANITY_PROJECT_ID

// ✅ Correct for Vite
import.meta.env.VITE_SANITY_PROJECT_ID
```

### ❌ #4: Conflicting vercel.json
```json
// ❌ Don't use routes + rewrites
{
  "rewrites": [...],
  "routes": [...]  // ← REMOVE THIS
}

// ✅ Just rewrites
{
  "rewrites": [...]
}
```

### ❌ #5: Forgot Root Directory in Vercel
- Must set Root Directory to your folder name
- Otherwise Vercel deploys wrong folder

---

## ✅ Success Checklist

- [ ] Local dev works
- [ ] Build succeeds
- [ ] Vercel deployed
- [ ] Page loads
- [ ] Data from Sanity
- [ ] Images load
- [ ] No console errors
- [ ] Fallback works
- [ ] Mobile works

---

## 🔧 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Blank page | Check Root Directory + `base: "/"` |
| ReferenceError | Pass state as props |
| Env vars not working | Check prefix (VITE_) + redeploy |
| CORS error | Add URL to Sanity CORS |
| Images not loading | Use `getImageUrl()` function |

---

## 📞 Help Resources

1. Check `NEW-UI-INTEGRATION-GUIDE.md` for details
2. Compare with `sharif-ai-soft-main` working example
3. Check browser console (F12)
4. Check Vercel deployment logs

---

**Time:** ~30-45 minutes  
**Based on:** Successful `sharif-ai-soft-main` integration

**Good luck! 🚀**

