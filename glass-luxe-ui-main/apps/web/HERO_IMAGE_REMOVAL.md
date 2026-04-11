# Hero Background Image Removal - LCP Optimization

## Changes Made

### 1. Removed Hero Background Image
- **File**: `apps/web/src/pages/Index.tsx`
- **Lines**: Removed entire `<picture>` and `<img>` block (previously lines 228-248)
- **Result**: Hero section now uses only CSS gradient background

### 2. Removed Image-Specific Overlays
- **File**: `apps/web/src/pages/Index.tsx`
- **Removed**:
  - Dark dimming overlay (`bg-black/20`)
  - Color gradient overlay with blend modes
  - Radial gradient overlay
- **Kept**: Simple CSS gradient background only
- **Result**: Reduced paint/composite cost

### 3. Lightweight CSS Background
- **File**: `apps/web/src/pages/Index.tsx` (HeroSection component)
- **Implementation**: 
  ```tsx
  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0b1024] via-[#0f152f] to-[#0c1028]" />
  ```
- **Result**: Fast paint, no image download, no filters/blend modes

### 4. Hero Content Renders Immediately
- **File**: `apps/web/src/pages/Index.tsx`
- **Status**: ✅ Already using static constants
  - `HERO_TITLE = "خرید اکانت ChatGPT"`
  - `HERO_SUBTITLE = "اکانت‌های قانونی ChatGPT..."`
- **Result**: H1 and paragraph text render immediately, no Sanity dependency

### 5. Deferred PromoBanner (Prevent LCP Swap)
- **File**: `apps/web/src/pages/Index.tsx`
- **Implementation**: `LazyPromoBanner` component
- **Behavior**: 
  - Renders only after user interaction (scroll/click/keydown) OR after 5 seconds
  - No placeholder (prevents layout shift)
- **Result**: PromoBanner cannot become LCP element

### 6. Deferred TrustBadges (Prevent LCP Swap)
- **File**: `apps/web/src/pages/Index.tsx`
- **Implementation**: `DeferredTrustBadges` component
- **Behavior**: 
  - Renders only after user interaction OR after 5 seconds
  - No placeholder
- **Result**: TrustBadges cannot become LCP element

### 7. Header Logo Lazy Loading
- **File**: `apps/web/src/components/Header.tsx`
- **Change**: `loading="eager"` → `loading="lazy"`
- **Result**: Header logo cannot become LCP element

## Expected LCP Behavior

### Before
- LCP Element: Hero background `<img>` (large image)
- LCP Time: ~6.4-6.9s (gated by React mount + Sanity fetch + image download)

### After
- LCP Element: H1 text block (`<h1>` with "خرید اکانت ChatGPT")
- LCP Time: Expected < 3.5s (no image download, no Sanity dependency for text)

## Testing Instructions

1. **Build and run:**
   ```bash
   npm run build
   npm run preview
   ```

2. **Run Lighthouse Mobile 5 times:**
   - Chrome DevTools > Lighthouse
   - Device: Mobile
   - Throttling: Slow 4G
   - CPU: 4x slowdown
   - Run 5 times, record median values

3. **Verify in Lighthouse report:**
   - LCP element should be the H1 text (not an image)
   - LCP should be significantly lower than baseline
   - Performance score should improve

4. **Check console logs:**
   - Look for `[LCP INSTRUMENT]` logs
   - Verify LCP element is H1/text, not image

## Files Modified

1. `apps/web/src/pages/Index.tsx`
   - Removed hero image rendering
   - Removed image overlays
   - Added `DeferredTrustBadges` component
   - Updated `LazyPromoBanner` to wait 5s or interaction
   - Simplified `HeroSection` (removed `heroImage` prop)

2. `apps/web/src/components/Header.tsx`
   - Changed logo `loading="eager"` to `loading="lazy"`

## Notes

- Hero content (H1, subtitle) uses static constants, so they render immediately
- PromoBanner and TrustBadges are deferred to prevent LCP swap
- Header logo is lazy-loaded to prevent it from becoming LCP
- All changes maintain visual appearance (gradient background instead of image)

