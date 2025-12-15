# Product Detail Page - Complete UI Description

## Overall Design System & Theme

### Background
- **Base Background**: Dark gradient from `hsl(218, 45%, 4%)` at top (#060914 - very dark navy) to `hsl(229, 60%, 6%)` at bottom (#0A0F27 - deep indigo)
- **Ambient Lighting**: Three radial gradient spotlights with blur effects:
  - Blue spotlight: `rgba(40,130,255,0.45)` at 15% 10% position, 80% × 55% size
  - Purple spotlight: `rgba(160,90,255,0.42)` at 85% 30% position, 70% × 60% size
  - Cyan spotlight: `rgba(60,220,255,0.20)` at 30% 90% position, 60% × 70% size
  - All blurred at 40px with 115% saturation, 0.7 opacity
- **Subtle Noise Texture**: Very light noise overlay (0.035 opacity) with soft-light blend mode to prevent color banding

### Color Palette
- **Primary Blue**: `#6EA8FE` (hsl(212, 98%, 70%))
- **Primary Text**: White at 92% opacity (`rgba(255,255,255,0.92)`)
- **Secondary Text**: White at 72% opacity (`rgba(255,255,255,0.72)`)
- **Muted Text**: White at 60% opacity
- **Glass Surface**: White at 14% opacity with backdrop blur
- **Glass Border**: White at 42% opacity
- **Accent Colors**:
  - Green: `#30D158` (for promotional prices)
  - Red: `#FF453A` (for discount badges, urgent timers)
  - Magenta: `#FF5AC8` (for "hot" badges)

### Typography
- **Font Family**: Vazirmatn (Persian/RTL font) with fallback to Tahoma/Arial
- **Font Features**: OpenType features enabled (cv11, ss01)
- **Text Direction**: RTL (Right-to-Left) throughout the page
- **Antialiasing**: Enabled with smooth font rendering

### Glassmorphism Style
All main containers use glassmorphism with:
- **Backdrop blur**: 22px with 160% saturation
- **Background**: `hsla(0, 0%, 100%, 0.14)` (white at 14% opacity)
- **Border**: 1px solid `hsla(0, 0%, 100%, 0.42)` (white at 42% opacity)
- **Shadow**: 
  - Outer: `0 8px 34px rgba(0, 0, 0, 0.28)`
  - Inner highlight: `inset 0 1px 0 hsla(0, 0%, 100%, 0.10)`
- **Border Radius**: 1.25rem (20px) standard, 2rem (32px) for rounded-2xl

---

## Page Structure (Top to Bottom)

### 1. Header Component
- Fixed at top, height: 72px (pt-[72px] spacing accounts for this)
- Contains navigation and search functionality
- Glassmorphism styling

### 2. Main Content Container

**Container Specifications:**
- **Max Width**: 1200px, centered with auto margins
- **Padding**: 
  - Mobile: `px-4` (16px horizontal)
  - Tablet: `px-6` (24px horizontal)
  - Desktop: `px-8` (32px horizontal)
- **Vertical Spacing**: `py-6` (24px), `my-[25px]` (25px margin)
- **Bottom Padding**: 24px on mobile (`pb-24`), 40px on desktop (`md:pb-10`)
- **Direction**: RTL (right-to-left) throughout

---

## Section 1: Product Main Section

**Container:** `SurfaceGlass` component with `rounded-2xl` and padding:
- Mobile: `p-4` (16px)
- Tablet: `p-6` (24px)
- Desktop: `p-8` (32px)

### Layout Structure
**Desktop (md and up):**
- Two-column layout using flexbox
- Images column: 50% width (md) / 55% width (lg)
- Product info column: 50% width (md) / 45% width (lg)
- Gap between columns: `gap-8` (32px)
- Product info column is **sticky** at `top-[100px]` on scroll

**Mobile:**
- Stacked layout (flex-col)
- Images appear first, product info below
- No sticky behavior

---

### A. Product Images Section (Left side on desktop, top on mobile)

#### Main Product Image
- **Aspect Ratio**: 1:1 (square)
- **Border Radius**: `rounded-2xl` (24px)
- **Overflow**: Hidden
- **Background**: Glass effect class
- **Image Fit**: `object-cover object-top` (covers container, aligned to top)
- **Animation**: Fade transition when image changes (using framer-motion)

#### Product Badge Overlay
- **Position**: Absolute, positioned at `top-4 right-4` (RTL)
- **Badge Variants**:
  - "sale": Red accent background (`bg-accent-red/20`), red text, red border
  - "new": Green accent background (`bg-accent-green/20`), green text, green border  
  - "hot": Magenta accent background (`bg-accent-magenta/20`), magenta text, magenta border
- **Badge Text**: 
  - "sale" → "تخفیف" (Discount)
  - "new" → "جدید" (New)
  - "hot" → "داغ" (Hot)
- **Styling**: Rounded-full badge with glassmorphism, animated entrance

#### Variant Selection Grid
**Container:**
- Appears below main image
- Spacing: `mt-4` (16px top margin), `space-y-3` (12px vertical gap between variants)

**Variant Cards Grid:**
- **Layout**: 
  - Mobile: 1 column (`grid-cols-1`)
  - Tablet+: 2 columns (`sm:grid-cols-2`)
- **Gap**: `gap-3` (12px)
- **Each Variant Card**:
  - **Padding**: `p-4` (16px)
  - **Border Radius**: `rounded-xl` (12px)
  - **Border**: 2px solid
  - **States**:
    - **Default**: `border-border/50` (white at 15% opacity), `bg-surface-glass/30` (glass background)
    - **Hover**: Scale to 102% (`hover:scale-[1.02]`), border becomes `border-border`
    - **Active/Pressed**: Scale to 98% (`active:scale-[0.98]`)
    - **Selected**: 
      - Border: `border-primary` (blue)
      - Background: `bg-primary/10` (blue at 10% opacity)
      - Shadow: `shadow-lg shadow-primary/20` (large shadow with blue tint)
  - **Content Layout**:
    - Flex column, items aligned to start
    - Gap: `gap-2` (8px)
    - **Variant Name**: 
      - Font: `font-semibold`, `text-foreground`, `text-sm`
      - Line clamp: 2 lines max
    - **Price Display**:
      - Original price (if discounted): `text-xs`, `text-muted-foreground`, strikethrough
      - Final price: `text-base sm:text-lg`, `font-bold`
        - Discounted: `text-green-400`
        - Regular: `text-primary`
      - Currency: Persian number format, "تومان" suffix
  - **Selection Indicator**:
    - Absolute positioned at `top-2 right-2`
    - Circle: `w-6 h-6` (24px), `bg-primary`, `rounded-full`
    - Checkmark icon: `w-4 h-4` (16px), `text-primary-foreground` (white)
  - **Out of Stock Overlay**:
    - Absolute positioned, full inset
    - Background: `bg-background/80` (80% opacity backdrop)
    - Text: "ناموجود" (Out of Stock), centered
    - Card becomes 50% opacity and non-interactive

---

### B. Product Information Section (Right side on desktop, bottom on mobile)

**Container:** Sticky on desktop at `top-[100px]`, `w-full md:w-1/2 lg:w-[45%]`

#### Breadcrumb Navigation
- **Position**: Top of product info section
- **Text Size**: `text-xs sm:text-sm` (12px mobile, 14px desktop)
- **Color**: `text-muted-foreground` (white at 72% opacity)
- **Layout**: Flex row-reverse, `gap-2` (8px), `flex-wrap`
- **Items**: 
  - "خانه" (Home) → Link to "/"
  - ChevronRight icon (rotated 180° for RTL) → `w-3 h-3 sm:w-4 sm:h-4`
  - "محصولات" (Products) → Link to "/products"
  - ChevronRight icon (rotated 180°)
  - Current product title (truncated with `line-clamp-1`)
- **Hover State**: Text becomes `text-foreground` (full white)

#### Product Title
- **Font Size**: 
  - Mobile: `text-2xl` (24px)
  - Tablet: `text-3xl` (30px)
  - Desktop: `text-4xl` (36px)
- **Weight**: `font-bold`
- **Color**: `text-foreground` (white at 92% opacity)
- **Margin**: `mb-3` (12px bottom)
- **Text Alignment**: Right-aligned (RTL)
- **Line Breaks**: Allowed (`break-words`)

#### Rating Summary
- **Link**: Clickable, links to `#reviews` section
- **Layout**: Flex row-reverse, `gap-2` (8px), `items-center`
- **Stars**: 
  - 5 Star icons (`w-4 h-4`), `fill-yellow-500 text-yellow-500`
  - Displayed in reverse order (RTL)
- **Rating Number**: `font-semibold`, displays "۴.۹"
- **Review Count**: `text-muted-foreground`, displays "(۱۲۸ نظر)" (128 reviews)
- **Hover State**: Text changes to `text-primary` (blue)
- **Text Size**: `text-sm` (14px)

#### Promotion Badge (Conditional)
- **Appears**: Only when product has active promotion
- **Animation**: Fade in with scale animation (0.9 → 1.0)
- **Styling**: 
  - Background: `bg-red-500`
  - Text: White, `font-bold`
  - Padding: `px-3 py-1` (12px horizontal, 4px vertical)
  - Text Size: `text-sm` (14px)
  - Border Radius: Inherited from Badge component (rounded-full)
- **Text**: Shows discount percentage in Persian numbers, e.g., "۲۵٪ تخفیف ویژه" (25% Special Discount)
- **Margin**: `mb-3` (12px bottom)

#### Price Display
**Container:**
- Text alignment: Right-aligned
- Overflow: `overflow-x-auto` for long prices
- Visibility logic:
  - If product has variants: Hidden on mobile until variant selected, visible on desktop always
  - If no variants: Always visible

**Price Component:**
- **Size**: `text-xl sm:text-2xl` (20px mobile, 24px desktop)
- **Layout**: Flex items-baseline, `gap-2`, wraps if needed
- **Components** (left to right in RTL):
  
  1. **Discount Badge** (if applicable):
     - Background: `bg-red-500`
     - Text: White, `font-bold`
     - Padding: `px-2 py-1` (8px horizontal, 4px vertical)
     - Text Size: `text-xs`
     - Border Radius: `rounded-full`
     - Content: Discount percentage in Persian numbers + "%" symbol
     - Animation: Scales from 0.8 to 1.0 on appear
  
  2. **Current Price**:
     - Font Size: `text-2xl sm:text-3xl` (24px mobile, 30px desktop)
     - Weight: `font-bold`
     - Color: 
       - With promotion: `text-green-400`
       - Without promotion: `text-primary` (blue)
     - Number Format: Persian/Farsi numerals with thousand separators
  
  3. **Currency**: 
     - Text: "تومان"
     - Size: `text-sm` (14px)
     - Color: `text-muted-foreground` (white at 72% opacity)
     - Weight: `font-medium`
  
  4. **Original Price** (strikethrough, if discounted):
     - Font Size: `text-lg` (18px)
     - Color: `text-muted-foreground` with `opacity-60`
     - Style: `line-through`
     - Format: Persian numbers + "تومان"
  
  5. **Savings Indicator** (if discounted):
     - Text Size: `text-xs`
     - Color: `text-green-400`
     - Weight: `font-medium`
     - Content: "({savings amount} تومان صرفه‌جویی)" - savings in Persian numbers

#### Countdown Timer (Conditional - for time-limited promotions)
- **Appears**: Only when promotion has `endsAt` date
- **Container**:
  - Margin: `mt-3` (12px top)
  - Animation: Fade in from below (`opacity: 0, y: 10` → `opacity: 1, y: 0`)
- **Label**: 
  - Text: "پایان تخفیف:" (End of discount:)
  - Size: `text-sm` (14px)
  - Color: `text-muted-foreground`
  - Margin: `mb-2` (8px bottom)
- **Timer Component**:
  - Size: `md` variant
  - Variant: `default`
  - **Styling**:
    - Background: `bg-red-500/20` (red at 20% opacity)
    - Border: `border-red-500/40` (red at 40% opacity)
    - Text: `text-red-400`
    - Padding: `px-3 py-2` (12px horizontal, 8px vertical)
    - Border Radius: `rounded-lg` (8px)
    - Backdrop blur: `backdrop-blur-sm`
  - **Layout**: Flex row, `items-center`, `gap-2`
  - **Components**:
    - Clock icon: `w-4 h-4`, animated pulse
    - Time units (days, hours, minutes, seconds):
      - Displayed with Persian numerals
      - Padded to 2 digits with leading zero (Persian)
      - Separated by colons (:)
      - Labels: "روز", "ساعت", "دقیقه", "ثانیه"
    - **Urgent State** (if < 1 hour remaining):
      - Background: `bg-red-600/30`
      - Border: `border-red-500/60`
      - Text: `text-red-300`
      - Animation: Pulse animation added
  - **Direction**: LTR (for number display) but contained in RTL layout

#### Features List
- **Container**: Right-aligned, full width
- **Layout**: Vertical list, each feature in flex row-reverse
- **Each Feature Item**:
  - Flex layout: `flex-row-reverse`, `items-start`, `gap-2`, `justify-end`
  - Margin: `mb-2` (8px bottom)
  - Text Size: `text-sm` (14px)
  - **Check Icon**: 
    - Size: `w-4 h-4` (16px)
    - Color: `text-green-500`
    - Position: Shrink-0 (doesn't shrink), `mt-0.5` (small top offset)
  - **Feature Text**: 
    - Color: `text-foreground/80` (white at 80% opacity)
    - Right margin: 0 (RTL alignment)

#### Quantity Selector
- **Container**: 
  - Flex layout: `flex-row-reverse`, `items-center`, `gap-3 sm:gap-4`
  - Margin: `mt-6` (24px top), `md:mt-[100px]` (100px top on desktop)
- **Quantity Control**:
  - Container: Glass effect class (`glass`), `rounded-lg`
  - Layout: Flex row, `items-center`
  - **Minus Button**:
    - Padding: `px-3 sm:px-4 py-2`
    - Hover: `hover:bg-surface-glass`
    - Text: "-"
  - **Quantity Display**:
    - Padding: `px-4 sm:px-6 py-2`
    - Font: `font-semibold`
    - Shows current quantity number
  - **Plus Button**:
    - Padding: `px-3 sm:px-4 py-2`
    - Hover: `hover:bg-surface-glass`
    - Text: "+"

#### Buy Button
- **Visibility Logic**:
  - If product has variants: Hidden on mobile until variant selected, visible on desktop always
  - If no variants: Always visible
- **Button Specifications**:
  - Size: `lg` (large)
  - Variant: `default`
  - **Styling**:
    - Background: `bg-primary` (blue)
    - Text: `text-primary-foreground` (white)
    - Hover: `bg-primary/90` (blue at 90% opacity)
    - Shadow: `shadow-lg shadow-primary/30`
    - Height: `h-13` (52px)
    - Padding: `px-8 py-4` (32px horizontal, 16px vertical)
    - Border Radius: `rounded-xl` (12px)
    - Font: `font-semibold`, `text-base`
    - Active state: Scales to 95% (`active:scale-95`)
  - **Layout**: 
    - Full width on mobile (`flex-1`)
    - Contains ShoppingCart icon (`ml-1`, `h-4 w-4`)
    - Text: "خرید" (Buy)
    - Text truncates if too long
- **Container**: 
  - Flex layout: `gap-2 sm:gap-3`
  - Margin: `mt-6` (24px top)

#### Policy Microcopy
- **Text**: "تحویل فوری دیجیتال • پشتیبانی ۲۴ ساعته • ضمانت بازگشت وجه • دسترسی دائمی"
  - Translation: "Instant digital delivery • 24-hour support • Money-back guarantee • Lifetime access"
- **Styling**:
  - Text Size: `text-xs` (12px)
  - Color: `text-muted-foreground`
  - Alignment: `text-center` (but styled `text-right` via inline style)
  - Margin: `mt-6` (24px top)
  - Word wrapping: `break-words`

#### Trust Badges
- **Container**:
  - Grid: 3 columns (`grid-cols-3`)
  - Gap: `gap-3 sm:gap-4` (12px mobile, 16px desktop)
  - Padding: `pt-4 sm:pt-6` (16px mobile, 24px desktop)
  - Border: Top border (`border-t`), `border-border-glass`
- **Each Badge**:
  - Layout: Flex column, `items-center`, `text-center`, `gap-1 sm:gap-2`
  - **Icon**:
    - Size: `w-5 h-5 sm:w-6 sm:h-6` (20px mobile, 24px desktop)
    - Color: `text-primary` (blue)
    - Shrink-0 (doesn't shrink)
  - **Text**:
    - Size: `text-xs` (12px)
    - Color: `text-muted-foreground`
    - Word wrapping: `break-words`
  - **Three Badges**:
    1. Truck icon → "تحویل فوری" (Fast Delivery)
    2. Shield icon → "پرداخت امن" (Secure Payment)
    3. RefreshCw icon → "پشتیبانی کامل" (Full Support)

---

## Section 2: Description Section with Table of Contents

**Container:** `SurfaceGlass` with `rounded-2xl`, padding `p-6 md:p-8`

### Layout Structure
**Desktop:**
- Two-column grid: `grid-cols-[280px_1fr]`
- Gap: `gap-8` (32px)
- TOC column: Fixed 280px width, sticky at `top-24` (96px)

**Mobile:**
- Single column layout
- TOC is collapsible

---

### A. Table of Contents (TOC) Section

#### Mobile TOC (Collapsible)
- **Toggle Button**:
  - Full width: `w-full`
  - Layout: Flex, `items-center`, `justify-between`
  - Padding: `p-4` (16px)
  - Background: Glass effect
  - Border Radius: `rounded-lg` (8px)
  - Hover: `hover:bg-surface-glass/50`
  - **Text**: "فهرست مطالب" (Table of Contents)
    - Font: `font-semibold`
  - **Chevron Icon**: 
    - Size: `w-5 h-5` (20px)
    - Rotation: Rotates 180° when open (`rotate-180`)
    - Transition: `transition-transform`
- **Content Panel**:
  - Margin: `mt-3` (12px top)
  - Padding: `p-4` (16px)
  - Background: Glass effect
  - Border Radius: `rounded-lg` (8px)
  - Direction: RTL
  - **List**: 
    - Spacing: `space-y-1` (4px vertical gap)
    - **Each Link**:
      - Display: Block
      - Text Size: `text-sm` (14px)
      - Hover: `hover:text-primary`
      - Alignment: `text-right`
      - **Heading Levels**:
        - Level 1: `font-bold`
        - Level 2: `font-semibold`
        - Level 3: `pr-4 text-xs` (16px right padding, 12px text)
        - Level 4+: `pr-6 text-xs` (24px right padding, 12px text)
- **Empty State**: 
  - Text: "هیچ سرفصلی یافت نشد" (No headings found)
  - Size: `text-sm`
  - Color: `text-muted-foreground`
  - Alignment: `text-right`

#### Desktop TOC (Always Visible)
- **Title**: "فهرست مطالب" (Table of Contents)
  - Font: `font-bold text-lg`
  - Color: `text-foreground`
  - Margin: `mb-4` (16px bottom)
- **Navigation List**:
  - Layout: Vertical, `space-y-1` (4px gap)
  - Alignment: `text-right`, RTL direction
  - **Each Link**:
    - Display: Block
    - Padding: `py-2` (8px vertical)
    - Border Radius: `rounded-lg` (8px)
    - Hover: `hover:bg-surface-glass/50`
    - Text Size: `text-sm` (14px)
    - **Heading Levels**:
      - Level 1: `pr-3 font-bold text-base` (12px right padding, bold, 16px text)
      - Level 2: `pr-3 font-semibold` (12px right padding, semibold)
      - Level 3: `pr-6 text-xs` (24px right padding, 12px text)
      - Level 4+: `pr-9 text-xs` (36px right padding, 12px text)
    - **Active State** (when section is in view):
      - Background: `bg-surface-glass`
      - Text: `text-primary font-medium`
- **Empty State**: Same as mobile

---

### B. Description Content

- **Container**: 
  - Max width: None (full width of column)
  - Text alignment: Right-aligned (RTL)
  - Direction: RTL
- **Content**: 
  - Rendered using `EnhancedMarkdownRenderer` component
  - Supports full markdown syntax (headings, paragraphs, lists, links, images, etc.)
  - Text color: Inherits from theme (`text-foreground` for headings, `text-muted-foreground` for body)
  - Headings are automatically extracted and linked in TOC

#### FAQ Section (Conditional)
- **Appears**: If FAQs are available for the product
- **Section ID**: `#faq`
- **Scroll Margin**: `scroll-mt-24` (96px - accounts for sticky header)
- **Margin**: `mt-12` (48px top)
- **Title**: "سوالات متداول" (Frequently Asked Questions)
  - Font: `text-2xl font-bold`
  - Color: `text-white`
  - Margin: `mb-6` (24px bottom)
- **FAQ Accordion Component**:
  - Layout: Vertical stack, `space-y-4` (16px gap)
  - **Each FAQ Item**:
    - Container: `SurfaceGlass` component
    - Border Radius: Inherited from SurfaceGlass
    - Overflow: Hidden
    - **Question Button**:
      - Full width: `w-full`
      - Padding: `px-6 py-4` (24px horizontal, 16px vertical)
      - Layout: Flex, `items-center`, `justify-between`, `gap-4`
      - Alignment: `text-right` (RTL)
      - Hover: `hover:bg-surface-glass/50`
      - **Question Text**:
        - Size: `text-base` (16px)
        - Weight: `font-semibold`
        - Color: `text-foreground`
        - Flex: 1 (takes available space)
      - **Chevron Icon**:
        - Size: `h-5 w-5` (20px)
        - Color: `text-muted-foreground`
        - Rotation: Rotates 180° when expanded
        - Transition: `transition-transform duration-300`
    - **Answer Panel**:
      - Animation: Height animates from 0 to auto, opacity 0 to 1
      - Spring transition: `stiffness: 220, damping: 28`
      - **Answer Content**:
        - Padding: `px-6 pb-4 pt-2` (24px horizontal, 16px bottom, 8px top)
        - Text Size: `text-sm` (14px)
        - Color: `text-muted-foreground`
        - Line Height: `leading-relaxed`

---

## Section 3: Related Products

- **Conditional**: Only appears if related products exist
- **Container**: Section with `space-y-6` (24px vertical spacing)
- **Section Header**:
  - Title: "محصولات مرتبط" (Related Products)
  - Eyebrow: "ممکن است دوست داشته باشید" (You might like)
  - Uses `SectionHeader` component (centered, large title)
- **Product Grid**:
  - **Layout**:
    - Mobile: 1 column
    - Tablet: 2 columns (`sm:grid-cols-2`)
    - Desktop: 3 columns (`lg:grid-cols-3`)
  - **Gaps**:
    - Horizontal: `gap-x-4 sm:gap-x-6 lg:gap-x-8` (16px → 24px → 32px)
    - Vertical: `gap-y-5 sm:gap-y-7 lg:gap-y-10` (20px → 28px → 40px)
- **Product Cards**: 
  - Uses `ProductCard` component
  - Each card shows:
    - Product image (3:4 aspect ratio)
    - Product title
    - Price (with discount badge if applicable)
    - Countdown timer (if promotion is active)
    - "مشاهده" (View) button
  - Cards have hover effects (slight lift and scale)

---

## Section 4: Related Blog Posts

- **Conditional**: Only appears if related blog posts exist
- **Container**: Section with `space-y-6` (24px vertical spacing)
- **Section Header**:
  - Title: "مقالات مرتبط" (Related Articles)
  - Eyebrow: "اطلاعات بیشتر بدانید" (Learn more)
  - Uses `SectionHeader` component
- **Post Grid**:
  - Same grid structure as Related Products:
    - Mobile: 1 column
    - Tablet: 2 columns
    - Desktop: 3 columns
    - Same gap specifications
- **Blog Cards**: Uses `BlogCard` component

---

## Mobile Sticky Bottom Bar

**Conditional**: Only appears on mobile (`md:hidden`) when:
- Product has no variants, OR
- A variant has been selected

**Container:**
- Position: Fixed at bottom
- Full width: `inset-x-0`
- Z-index: `z-50` (above most content)
- Background: Glass effect (`glass`)
- Border: Top border (`border-t`), `border-border-glass`
- Backdrop blur: `backdrop-blur-lg`
- Safe area: `pb-safe` (accounts for iPhone notch/home indicator)

**Content:**
- Layout: Flex, `items-center`, `gap-3` (12px gap)
- Padding: `p-3 sm:p-4` (12px mobile, 16px tablet)
- **Price Display**:
  - Layout: Flex column, `shrink-0`
  - **Label**: "قیمت:" (Price:)
    - Size: `text-xs` (12px)
    - Color: `text-muted-foreground`
    - White-space: `whitespace-nowrap`
  - **Price Value**:
    - Layout: Flex, `items-baseline`, `gap-1`
    - **Amount**:
      - Size: `text-base sm:text-lg` (16px mobile, 18px tablet)
      - Weight: `font-bold`
      - Color: `text-primary` (blue)
      - Format: Persian numbers
    - **Currency**: "تومان"
      - Size: `text-xs` (12px)
      - Color: `text-muted-foreground`
- **Buy Button**:
  - Size: `sm` (small)
  - Variant: `default`
  - Flex: 1 (takes remaining space)
  - Height: `h-10` (40px)
  - Text Size: `text-sm` (14px)
  - Contains ShoppingCart icon and "خرید" text
  - Text truncates if needed

---

## Footer Component

- Standard site footer
- Contains links and social media icons
- Glassmorphism styling
- RTL layout

---

## Loading States

### Initial Loading
- **Container**: Full screen height (`min-h-screen`)
- **Layout**: Centered flex (`flex items-center justify-center`)
- **Text**: "در حال بارگذاری..." (Loading...)
- **Styling**: 
  - Animation: `animate-pulse`
  - Color: `text-muted-foreground`

### Error State
- **Container**: Full screen height, centered flex
- **Text**: Error message or "محصول یافت نشد" (Product not found)
- **Color**: `text-muted-foreground`

---

## Animations & Transitions

### Entrance Animations
- **Fade In**: Most elements use `animate-fadeIn` (0.2s ease-out)
- **Scale In**: Badges and promotional elements scale from 0.8 to 1.0
- **Slide Up**: Price components slide up from 10px below (y: 10 → 0)

### Hover Effects
- **Buttons**: Scale to 95% on active press
- **Variant Cards**: Scale to 102% on hover, 98% on active
- **Product Cards**: Lift slightly (`-translate-y-0.5`) on hover
- **Links**: Color transitions to primary blue

### Transitions
- **Spring Transitions**: Used for expandable/collapsible elements (stiffness: 220, damping: 28)
- **Duration**: Most transitions are 200-300ms
- **Easing**: ease-out for most animations

---

## Responsive Breakpoints

- **Mobile**: < 640px (base styles)
- **Tablet**: 640px+ (`sm:` prefix)
- **Desktop**: 768px+ (`md:` prefix)
- **Large Desktop**: 1024px+ (`lg:` prefix)

---

## Accessibility Features

- **Focus States**: All interactive elements have visible focus rings (`ring-2 ring-primary`)
- **ARIA Labels**: FAQ accordion uses proper ARIA attributes (`aria-expanded`, `aria-controls`)
- **Semantic HTML**: Proper heading hierarchy, navigation landmarks
- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Screen Reader Support**: Proper alt text for images, descriptive text for icons

---

## Special Features

### Promotion System
- Supports product-level promotions
- Displays discount percentage badge
- Shows countdown timer for time-limited offers
- Calculates and displays savings amount
- Applies discounts to variant prices

### Variant Selection
- Dynamic price updates based on selected variant
- Visual selection indicators
- Disabled state for out-of-stock variants
- Auto-selects lowest-priced variant on load

### SEO & Structured Data
- Product JSON-LD schema
- Breadcrumb JSON-LD schema
- Meta tags (title, description, Open Graph, Twitter Cards)
- Canonical URLs

### Performance Optimizations
- Lazy loading for images
- Code splitting for countdown timer
- Optimized animations (CSS where possible)
- Reduced motion support (respects user preferences)

---

## Technical Notes for Designer

1. **Glassmorphism**: The glass effect is achieved through backdrop-filter blur combined with semi-transparent backgrounds. Design elements should work with this translucent aesthetic.

2. **Dark Theme**: All colors are designed for dark backgrounds. Text contrast ratios meet WCAG AA standards.

3. **RTL Support**: The entire page is RTL (right-to-left) for Persian/Farsi language. Icons and number displays may be LTR within RTL containers.

4. **Responsive Design**: The layout shifts from stacked (mobile) to side-by-side (desktop). Product info becomes sticky on desktop.

5. **Color Usage**:
   - Blue (primary): Interactive elements, prices (non-promotional), trust badges
   - Green: Promotional prices, success states, "new" badges
   - Red: Discount badges, urgent countdown timers, "sale" badges
   - Magenta: "hot" badges

6. **Typography Hierarchy**:
   - H1 (Product Title): 24px → 36px responsive
   - H2 (Section Titles): 24px → 32px responsive
   - Body: 14px → 16px responsive
   - Small: 12px → 14px responsive

7. **Spacing System**: Uses Tailwind's spacing scale (4px increments). Common values: 4px, 8px, 12px, 16px, 24px, 32px, 48px.

8. **Border Radius**: Consistent use of rounded corners - 8px (lg), 12px (xl), 20px (2xl), 24px (3xl), full (rounded-full).

