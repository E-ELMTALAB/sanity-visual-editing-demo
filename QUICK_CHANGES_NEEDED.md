# Quick Changes Needed for Slug-Based Routing

## 📁 Manual Step Required First

**In Windows File Explorer:**
1. Go to `sharifgpt-website/app/products/`
2. Delete the malformed `[slug\` folder if it exists
3. Rename the `[id]` folder to `[slug]`
4. Go to `sharifgpt-website/app/courses/`
5. Rename the `[id]` folder to `[slug]`

## ✏️ Code Changes for Product Page

After renaming folders, update `sharifgpt-website/app/products/[slug]/page.tsx`:

### Change 1: Update interface and params (lines 8-13)
```typescript
// OLD:
interface ProductPageProps {
  params: { id: string }
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = params

// NEW:
interface ProductPageProps {
  params: { slug: string }
}

export default function ProductPage({ params }: ProductPageProps) {
  const { slug } = params
```

### Change 2: Add Sanity fetch state (after line 25, before handleProfileClick)
```typescript
// ADD THESE NEW LINES:
const [sanityProduct, setSanityProduct] = useState<any>(null)
const [loading, setLoading] = useState(true)

useEffect(() => {
  fetch(`/api/products/${slug}`)
    .then((res) => res.json())
    .then((data) => {
      if (!data.error) {
        setSanityProduct(data)
      }
      setLoading(false)
    })
    .catch(() => setLoading(false))
}, [slug])
```

### Change 3: Update product object (line 70-99)
```typescript
// OLD:
const product = {
  id: Number.parseInt(id),
  title: "اکانت اسپاتیفای پریمیوم",
  description: "...",
  price: 250000,
  originalPrice: 350000,
  // ...rest

// NEW:
const product = {
  id: 1,
  title: sanityProduct?.name || "اکانت اسپاتیفای پریمیوم",
  description: sanityProduct?.description || "اسپاتیفای یکی از محبوب‌ترین...",
  price: sanityProduct?.discountedPrice || sanityProduct?.price || 250000,
  originalPrice: sanityProduct?.originalPrice || 350000,
  discount: sanityProduct?.discountPercentage || 30,
  rating: 4.5,
  reviews: 16,
  image: sanityProduct?.imageUrl || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-dPdgCWW6zllellUtmElnrpbQKerDIJ.png",
  // ... keep rest of hardcoded data (gallery, features, options, etc.)
}
```

### Change 4: Add loading state (after product object, before return statement)
```typescript
// ADD THIS BEFORE return statement:
if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">در حال بارگذاری محصول...</p>
      </div>
    </div>
  )
}
```

## ✏️ Code Changes for Course Page

Update `sharifgpt-website/app/courses/[slug]/page.tsx` similarly:

### Change 1: Update params (around line 9-10)
```typescript
// OLD:
export default function CourseDetailPage() {
  const params = useParams()
  const courseId = params.id as string

// NEW:
export default function CourseDetailPage() {
  const params = useParams()
  const courseSlug = params.slug as string
```

### Change 2: Add Sanity fetch (after line 15)
```typescript
// ADD:
const [sanityCourse, setSanityCourse] = useState<any>(null)
const [loading, setLoading] = useState(true)

useEffect(() => {
  fetch(`/api/courses/${courseSlug}`)
    .then((res) => res.json())
    .then((data) => {
      if (!data.error) {
        setSanityCourse(data)
      }
      setLoading(false)
    })
    .catch(() => setLoading(false))
}, [courseSlug])
```

### Change 3: Update course object (around line 49-112)
```typescript
// OLD:
const course = {
  id: Number.parseInt(courseId) || 1,
  title: "دوره جامع ChatGPT و هوش مصنوعی",
  // ...

// NEW:
const course = {
  id: 1,
  title: sanityCourse?.title || "دوره جامع ChatGPT و هوش مصنوعی",
  description: sanityCourse?.description || "آموزش کامل استفاده از ChatGPT...",
  price: sanityCourse?.price || 890000,
  originalPrice: sanityCourse?.originalPrice || 1200000,
  // Calculate discount from Sanity prices if available
  discount: sanityCourse?.originalPrice && sanityCourse?.price 
    ? Math.round(((sanityCourse.originalPrice - sanityCourse.price) / sanityCourse.originalPrice) * 100)
    : 26,
  rating: sanityCourse?.rating || 4.8,
  reviews: sanityCourse?.reviewCount || 156,
  image: sanityCourse?.imageUrl || "/ai-course-special-offer-banner-persian-text.jpg",
  duration: sanityCourse?.duration || "12 ساعت",
  students: sanityCourse?.students || 2847,
  instructor: {
    name: sanityCourse?.instructor || "دکتر احمد محمدی",
    // ... rest of hardcoded instructor data
  },
  level: sanityCourse?.level || "مقدماتی تا پیشرفته",
  // ... keep rest of hardcoded data
}
```

## ✅ What's Already Done

- ✅ GROQ queries created (`lib/sanity.queries.ts`)
- ✅ API routes created (`app/api/products/[slug]/route.ts` and `app/api/courses/[slug]/route.ts`)
- ✅ Slug fields added to all schemas
- ✅ Homepage links updated to use slugs

## 🚀 Testing

1. Rename folders as described above
2. Apply code changes
3. Restart your dev server
4. In Sanity Studio, ensure products/courses have slugs generated
5. Click a product/course from the homepage
6. Should see data from Sanity!

## ❓ Need Help?

If the files are too large to edit manually, I can create smaller helper scripts or use the write tool to create complete new files.

