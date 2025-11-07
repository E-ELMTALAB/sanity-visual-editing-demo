# UI Customization Guide - Safely Changing Your Website Appearance

## Understanding Your Sanity Visual Editing Setup

Your website uses **Sanity's Visual Editing** feature, which allows content editors to edit content directly on the live website. This is achieved through a clever architecture:

### Architecture Overview

1. **Display Components** (e.g., `SharifHomePage.tsx`, `ProductCard.tsx`)
   - These render the actual UI that users see
   - You can freely modify these for styling and layout changes

2. **Overlay Components** (e.g., `HeroPromoOverlay.tsx`, `ProductsOverlay.tsx`)
   - Hidden components that contain `data-sanity-*` attributes
   - These enable Sanity's visual editing to work
   - **DO NOT modify these** unless you understand the implications

3. **Data Flow**
   - Sanity data → Page component → Display Component + Overlay Component
   - Both components receive the same data props

## ✅ What You CAN Safely Change

### 1. **Styling & CSS Classes**
You can modify any CSS classes, Tailwind utilities, or inline styles in display components:

```tsx
// ✅ SAFE: Change styling in SharifHomePage.tsx
<div className="bg-gradient-to-r from-blue-600 to-purple-600"> // Change colors
<div className="text-4xl md:text-5xl font-bold"> // Change typography
<div className="rounded-2xl shadow-2xl"> // Change borders/shadows
```

### 2. **Layout & Structure**
You can rearrange elements, change grid layouts, add/remove containers:

```tsx
// ✅ SAFE: Change layout structure
<section className="mb-12"> // Change spacing
<div className="grid grid-cols-1 md:grid-cols-3 gap-4"> // Change grid
```

### 3. **Component Appearance**
Modify:
- Colors, backgrounds, gradients
- Font sizes, weights, families
- Spacing (padding, margins)
- Borders, shadows, rounded corners
- Animations and transitions
- Responsive breakpoints

### 4. **UI Components**
You can modify or replace UI components like:
- `components/ui/*` (Button, Card, Dialog, etc.)
- `components/product-card.tsx`
- `components/footer.tsx`
- `components/header.tsx`

## ❌ What You Should NOT Change

### 1. **Overlay Components**
**NEVER modify** files in `components/site/*/Overlay.tsx`:
- `HeroPromoOverlay.tsx`
- `ProductsOverlay.tsx`
- `ProductOverlay.tsx`
- `CourseOverlay.tsx`
- `CollectionOverlay.tsx`
- `FAQOverlay.tsx`
- etc.

These contain the `data-sanity-*` attributes that enable visual editing.

### 2. **Data Structure & Props**
**DO NOT change**:
- Prop names in display components
- Data field names (e.g., `title`, `description`, `imageUrl`)
- The structure of data passed from pages

### 3. **Sanity Queries**
**DO NOT modify** `lib/sanity.queries.ts` unless you're adding new fields.

### 4. **Visual Editing Setup**
**DO NOT modify**:
- `components/visual-editing/AppVisualEditing.tsx`
- `components/visual-editing/AppSharifProviders.tsx`
- `app/layout.tsx` (the visual editing imports)

## 🎯 Best Practices for UI Changes

### Step-by-Step Process

1. **Identify the Component to Change**
   ```bash
   # Example: Want to change homepage hero section?
   # Edit: components/site/home/SharifHomePage.tsx
   ```

2. **Make Your UI Changes**
   - Modify CSS classes
   - Change colors, spacing, typography
   - Rearrange layout
   - Add animations

3. **Keep Props Intact**
   ```tsx
   // ✅ GOOD: Props stay the same, only styling changes
   export default function SharifHomePage({
     topBannerSlides,  // Keep these prop names
     heroSlides,       // Keep these prop names
     // ... other props
   }: SharifHomePageProps) {
     return (
       <div className="NEW_STYLING_HERE">
         {/* Your new UI */}
       </div>
     )
   }
   ```

4. **Test Visual Editing**
   - After changes, test that Sanity visual editing still works
   - Open your site in Sanity Studio's visual editing mode
   - Verify you can still edit content

### Example: Changing Homepage Hero Section

**Before:**
```tsx
<div className="absolute bottom-0 left-0 p-8 text-white max-w-2xl">
  <h1 className="text-4xl md:text-5xl font-bold mb-4">
    {slide.title}
  </h1>
</div>
```

**After (✅ SAFE):**
```tsx
<div className="absolute bottom-0 left-0 p-12 text-white max-w-3xl">
  <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-shadow-lg">
    {slide.title}
  </h1>
</div>
```

**What changed:**
- ✅ Padding: `p-8` → `p-12`
- ✅ Max width: `max-w-2xl` → `max-w-3xl`
- ✅ Font size: `text-4xl` → `text-5xl`
- ✅ Font weight: `font-bold` → `font-extrabold`
- ✅ Margin: `mb-4` → `mb-6`
- ✅ Added text shadow

**What stayed the same:**
- ✅ Prop name: `slide.title`
- ✅ Component structure
- ✅ Data flow

## 🔍 How to Identify Components

### Display Components (Safe to Modify)
- `components/site/home/SharifHomePage.tsx` - Homepage UI
- `components/site/blog/BlogIndex.tsx` - Blog listing UI
- `components/site/blog/BlogPost.tsx` - Blog post UI
- `components/product-card.tsx` - Product card UI
- `components/footer.tsx` - Footer UI
- `components/header.tsx` - Header UI
- `components/ui/*` - All UI primitives

### Overlay Components (Do NOT Modify)
- `components/site/home/HeroPromoOverlay.tsx`
- `components/site/product/ProductsOverlay.tsx`
- `components/site/product/ProductOverlay.tsx`
- `components/site/course/CourseOverlay.tsx`
- `components/site/collection/CollectionOverlay.tsx`
- `components/site/contact/ContactOverlay.tsx`
- `components/site/product/FAQOverlay.tsx`

## 🚨 Common Mistakes to Avoid

### ❌ Mistake 1: Changing Prop Names
```tsx
// ❌ BAD: Changed prop name
export default function SharifHomePage({ heroSlides: slides }) {
  // This breaks the data flow
}
```

### ❌ Mistake 2: Modifying Overlay Components
```tsx
// ❌ BAD: Don't add styling to overlay components
export default function HeroPromoOverlay({ heroSlides }) {
  return (
    <div className="bg-red-500"> {/* ❌ Don't do this */}
      {/* overlay content */}
    </div>
  )
}
```

### ❌ Mistake 3: Removing Data Fields
```tsx
// ❌ BAD: Don't remove fields that Sanity uses
<div>
  {slide.title} {/* ❌ Don't remove this */}
  {/* slide.subtitle removed - breaks visual editing */}
</div>
```

## ✅ Safe Modification Checklist

Before making changes, ask:

- [ ] Am I modifying a **display component** (not an overlay)?
- [ ] Am I keeping all **prop names** the same?
- [ ] Am I keeping all **data fields** accessible?
- [ ] Am I only changing **styling/layout** (CSS classes, structure)?
- [ ] Have I **tested visual editing** after my changes?

If all answers are YES, you're safe to proceed! 🎉

## 📝 Quick Reference

| Component Type | Location | Safe to Modify? |
|---------------|----------|----------------|
| Display Components | `components/site/*/*.tsx` (not Overlay) | ✅ YES |
| Overlay Components | `components/site/*/*Overlay.tsx` | ❌ NO |
| UI Primitives | `components/ui/*` | ✅ YES |
| Layout Components | `components/footer.tsx`, `components/header.tsx` | ✅ YES |
| Visual Editing | `components/visual-editing/*` | ❌ NO |
| Sanity Queries | `lib/sanity.queries.ts` | ⚠️ Only add fields |

## 🎨 Styling Resources

Your project uses:
- **Tailwind CSS** - Utility-first CSS framework
- **Custom CSS** - `styles/index.css`
- **Component Libraries** - `components/ui/*` (shadcn/ui style)

You can modify all of these for styling changes!

## Need Help?

If you're unsure about a change:
1. Check if the file is an "Overlay" component
2. Verify you're not changing prop names or data structure
3. Test visual editing after changes
4. When in doubt, ask or test in a development environment first

---

**Remember**: Sanity visual editing works by matching `data-sanity-*` attributes in overlay components with the actual content in display components. As long as the data structure and prop names stay the same, you can freely modify the appearance!

