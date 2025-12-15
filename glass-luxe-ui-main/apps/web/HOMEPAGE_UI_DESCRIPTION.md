# Homepage - Complete UI Description

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
- **Secondary Text**: White at 70-72% opacity
- **Muted Text**: White at 60% opacity
- **Glass Surface**: White at 14% opacity with backdrop blur
- **Glass Border**: White at 35-42% opacity
- **Accent Colors**:
  - Green: `#30D158` (for promotional prices, educational products)
  - Red: `#FF453A` (for discount badges, special offers, urgent timers)
  - Magenta: `#FF5AC8` (for "hot" badges)
  - Yellow: `#FFD700` (for promotion highlights)

### Typography
- **Font Family**: Vazirmatn (Persian/RTL font) with fallback to Tahoma/Arial
- **Font Features**: OpenType features enabled (cv11, ss01)
- **Text Direction**: RTL (Right-to-Left) throughout the page
- **Antialiasing**: Enabled with smooth font rendering

### Glassmorphism Style
All main containers use glassmorphism with:
- **Backdrop blur**: 22px with 160% saturation
- **Background**: `hsla(0, 0%, 100%, 0.14)` (white at 14% opacity)
- **Border**: 1px solid `hsla(0, 0%, 100%, 0.35-0.42)` (white at 35-42% opacity)
- **Shadow**: 
  - Outer: `0 8px 34px rgba(0, 0, 0, 0.28)`
  - Inner highlight: `inset 0 1px 0 hsla(0, 0%, 100%, 0.10)`
- **Border Radius**: 1.25rem (20px) standard, 2rem (32px) for rounded-2xl, 1.5rem (24px) for rounded-3xl

---

## Page Structure (Top to Bottom)

### 1. Header Component
- Fixed at top
- Contains navigation, search, and menu functionality
- Glassmorphism styling with backdrop blur
- RTL layout

---

## Section 1: Hero Section

**Container Specifications:**
- **Min Height**: `92vh` (92% of viewport height)
- **Width**: Full width (`w-full`)
- **Overflow**: Hidden
- **Direction**: RTL
- **Mask**: Gradient mask from black at 82% to transparent at 100% (creates fade effect at bottom)

### Background Layers (from bottom to top)

#### Layer 1: Static Gradient Base (always visible)
- **Gradient**: `from-[#0b1024] via-[#0f152f] to-[#0c1028]`
- **Direction**: `bg-gradient-to-br` (bottom-right diagonal)
- **Position**: Absolute, `inset-0`, z-index: -10

#### Layer 2: Hero Image (deferred, loads after initial paint)
- **Conditional**: Only renders when `heroImage?.src` is available
- **Position**: Absolute, `inset-0`, z-index: -10
- **Object Fit**: `object-cover`
- **Object Position**: 
  - Mobile: `object-[20%_50%]` (shows left 20% of image)
  - Desktop: `object-[60%_50%]` (shows center-right 60% of image)
- **Filter**: `brightness(0.85)` (slightly darkened)
- **Loading**: Eager with `fetchPriority="high"`
- **Responsive Images**: Supports srcSet for different screen sizes

#### Layer 3: Overlay Gradient
- **Background**: `from-[#1E67C6]/60 via-transparent to-[#8B5CF6]/60`
- **Direction**: `bg-gradient-to-br` (bottom-right diagonal)
- **Blend Mode**: `mix-blend-soft-light`
- **Opacity**: 
  - Mobile: 85% (`opacity-85`)
  - Desktop: 60% (`md:opacity-60`)

#### Layer 4: Radial Gradient Overlay
- **Gradient**: Radial, 120% width × 80% height, positioned at 85% horizontal, 50% vertical
- **Stops**: 
  - 0%: `rgba(0,0,0,0.18)`
  - 60%: `rgba(0,0,0,0.55)`
  - 100%: `rgba(0,0,0,0.70)`
- **Purpose**: Darkens right side of hero for text contrast

### Hero Content

**Container:**
- **Max Width**: `max-w-screen-xl` (1280px)
- **Padding**: 
  - Horizontal: `px-4 sm:px-6 lg:px-8` (16px → 24px → 32px)
  - Vertical: `pt-28 pb-16 lg:py-24` (112px top, 64px bottom on mobile; 96px vertical on desktop)
- **Position**: Relative, z-index: 10
- **Centering**: Flex container with `items-center justify-center`
- **Min Height**: `min-h-[70vh]` (70% viewport height)

**Content Box:**
- **Max Width**: `max-w-3xl` (768px)
- **Text Alignment**: Center
- **Layout**: Flex column, centered
- **Fixed Height**: `minHeight: '300px'` (prevents layout shift)

#### Badge Label (Top)
- **Display**: Inline block
- **Background**: `bg-white/10` (white at 10% opacity)
- **Backdrop**: `backdrop-blur-sm`
- **Padding**: `px-3 py-1` (12px horizontal, 4px vertical)
- **Border**: `border border-white/20`
- **Border Radius**: `rounded-full`
- **Text**: "بزرگترین ارائه‌دهنده اکانت های هوش مصنوعی"
- **Text Size**: 
  - Mobile: `text-xs` (12px)
  - Desktop: `text-sm` (14px)
- **Margin**: Below title (`mt-4` after title)

#### Main Title (H1)
- **Text**: "خرید اکانت ChatGPT"
- **Font Size**: 
  - Mobile: `text-7xl` (72px)
  - Small screens: `text-8xl` (96px)
  - Medium screens: `text-6xl` (60px)
  - Large screens: `text-7xl` (72px)
- **Weight**: `font-black` (900)
- **Line Height**: `leading-tight`
- **Color**: White (`text-white`)
- **Margin**: `mt-4` (16px top)

#### Subtitle
- **Text**: "اکانت‌های قانونی ChatGPT با تحویل آنی، اتصال پایدار و پشتیبانی واقعی برای تجربه‌ای بدون دغدغه."
- **Text Size**: 
  - Mobile: `text-xl` (20px)
  - Desktop: `text-lg lg:text-xl` (18px → 20px)
- **Color**: `text-white/90` (white at 90% opacity)
- **Line Height**: `leading-relaxed`
- **Max Width**: `max-w-xl` (576px)
- **White Space**: `whitespace-pre-line` (preserves line breaks)
- **Margin**: `mt-4` (16px top)

#### TrustBadges Component
- **Margin**: `mt-8` (32px top)
- **Layout**: Flex row, centered, `gap-6 md:gap-8` (24px → 32px)
- **Direction**: RTL
- **Justification**: 
  - Mobile: `justify-center`
  - Desktop: `lg:justify-start` (left-aligned on large screens)

**Each Trust Badge:**
- **Layout**: Flex column, centered items
- **Gap**: `gap-3` (12px)
- **Icon Container**:
  - **Relative positioning** for glow effect
  - **Glow Effect** (behind icon):
    - Background: Gradient `from-blue-500/30 to-purple-500/30`
    - Position: Absolute, `inset-0`
    - Border Radius: `rounded-full`
    - Blur: `blur-lg` (hover: `blur-xl`)
    - Opacity: 60% (hover: 80%)
    - Transition: `transition-all duration-300`
  - **Icon Circle**:
    - Size: `w-16 h-16 md:w-20 md:h-20` (64px → 80px)
    - Background: Gradient `from-blue-600 to-blue-800`
    - Border Radius: `rounded-full`
    - Display: Flex, centered
    - Color: White
    - Shadow: `shadow-lg shadow-blue-500/30`
    - Border: `border border-white/20`
    - Hover: `scale-110` (10% larger)
    - Transition: `transition-transform duration-300`
  - **Icon**: 
    - Size: `w-6 h-6` (24px)
    - Types: RefreshCw, Shield, Clock
- **Badge Text**:
  - Text: "تضمین تعویض", "اکانت‌های اصل", "پشتیبانی ۲۴/۷"
  - Size: `text-sm md:text-base` (14px → 16px)
  - Color: `text-white/90`
  - Weight: `font-medium`
  - Alignment: Center
  - White Space: `whitespace-nowrap`

---

## Section 2: Site-Wide Promotion Banner (Conditional)

**Container:**
- **Position**: Relative, z-index: 20
- **Max Width**: Container max-width with `mx-auto`
- **Padding**: `px-4 md:px-6` (16px → 24px)
- **Margin**: `-mt-8 mb-8` (negative top margin pulls it up into hero section)

**PromotionBanner Component (Hero Variant):**
- **Animation**: `animate-fadeIn`
- **Position**: Relative, overflow hidden
- **Border Radius**: `rounded-2xl` (24px)
- **Background**: Gradient `from-red-600/90 via-red-500/80 to-orange-500/90`
- **Border**: `border border-red-400/30`
- **Backdrop**: `backdrop-blur-sm`
- **Padding**: `p-6 md:p-8` (24px → 32px)

**Animated Background Elements:**
- **Element 1**: 
  - Position: Absolute, `-top-1/2 -right-1/4`
  - Size: `w-96 h-96` (384px)
  - Background: `bg-yellow-400/20`
  - Border Radius: `rounded-full`
  - Blur: `blur-3xl`
  - Animation: `animate-pulse`
- **Element 2**:
  - Position: Absolute, `-bottom-1/2 -left-1/4`
  - Size: `w-96 h-96` (384px)
  - Background: `bg-red-400/20`
  - Border Radius: `rounded-full`
  - Blur: `blur-3xl`
  - Animation: `animate-pulse` with 1s delay

**Content Layout:**
- **Container**: Flex, column on mobile, row on desktop
- **Items**: Centered, `justify-between`
- **Gap**: `gap-4` (16px)
- **Position**: Relative, z-index: 10

**Left Side - Promotion Info:**
- **Layout**: Flex, `items-center`, `gap-4`
- **Alignment**: 
  - Mobile: `text-center`
  - Desktop: `md:text-right`
- **Icon Container** (desktop only):
  - Display: Hidden on mobile (`hidden md:flex`)
  - Size: `w-16 h-16` (64px)
  - Background: `bg-white/20`
  - Backdrop: `backdrop-blur-sm`
  - Border Radius: `rounded-full`
  - Display: Flex, centered
  - **Gift Icon**: `w-8 h-8 text-white`
- **Text Content**:
  - **Badge**: 
    - Layout: Flex, `items-center`, `gap-2`
    - Justification: `justify-center md:justify-start`
    - Margin: `mb-1` (4px bottom)
    - **Sparkles Icon**: `w-5 h-5 text-yellow-300 animate-pulse`
    - **Text**: "پیشنهاد ویژه" (Special Offer)
      - Size: `text-sm`
      - Color: `text-yellow-200`
      - Weight: `font-medium`
  - **Title**:
    - Size: `text-2xl md:text-3xl` (24px → 30px)
    - Weight: `font-black`
    - Color: White
  - **Description** (if available):
    - Size: `text-sm`
    - Color: `text-white/80`
    - Margin: `mt-1`
    - Max Width: `max-w-md`

**Right Side - Countdown Timer:**
- **Conditional**: Only shown if promotion has `ends_at`
- **Layout**: Flex column, `items-center`, `gap-2`
- **Label**: "زمان باقی‌مانده:" (Time Remaining:)
  - Size: `text-sm`
  - Color: `text-white/80`
  - Weight: `font-medium`
- **CountdownTimer Component**:
  - Size: `lg`
  - Variant: `glass`
  - Show Labels: `true`

**Discount Badge (Corner):**
- **Position**: Absolute
  - Mobile: `-top-2 -left-2`
  - Desktop: `md:top-4 md:left-4`
- **Background**: `bg-yellow-400`
- **Text**: Red (`text-red-900`)
- **Weight**: `font-black`
- **Size**: `text-lg md:text-xl` (18px → 20px)
- **Padding**: `px-4 py-2` (16px horizontal, 8px vertical)
- **Border Radius**: `rounded-full`
- **Shadow**: `shadow-lg`
- **Animation**: `animate-fadeIn`

---

## Section 3: Best Sellers Section

**Container:**
- **Padding**: 
  - Vertical: `py-8 sm:py-10 lg:py-12` (32px → 40px → 48px)
  - Horizontal: `px-6 lg:px-[100px]` (24px → 100px)
- **Background**: Transparent
- **Max Width**: `max-w-[1400px]`, centered

### Section Header
- **Margin**: `mb-8` (32px bottom)
- **Text Alignment**: Center
- **Animation**: `animate-fadeIn`
- **Title**: "محصولات منتخب" (Featured Products)
  - Size: `text-3xl sm:text-4xl` (30px → 36px)
  - Weight: `font-extrabold`
  - Color: `text-foreground`
  - Margin: `mb-2` (8px bottom)
- **Subtitle**: "پرفروش‌ترین محصولات ما" (Our Best Selling Products)
  - Size: `text-sm sm:text-base` (14px → 16px)
  - Color: `text-foreground/70`

### Product Grid
- **Container**: Centered flex
- **Grid**: 
  - Mobile: 1 column (`grid-cols-1`)
  - Small: 2 columns (`sm:grid-cols-2`)
  - Medium+: 4 columns (`md:grid-cols-4`)
- **Gap**: `gap-4 sm:gap-5 lg:gap-6` (16px → 20px → 24px)
- **Max Width**: `max-w-[1200px]`
- **Product Limit**: Maximum 8 products (2 rows × 4 columns)

**Product Cards:**
- Each card uses `ProductCard` component
- **Animation**: `animate-fadeIn` with staggered delay (`${index * 50}ms`)
- **Full width** within grid cell

**ProductCard Component Specifications:**
- **Container**: 
  - Border Radius: `rounded-3xl` (24px)
  - Overflow: Hidden
  - Cursor: Pointer
  - Ring: `ring-1 ring-white/10`
  - Transition: `hover:-translate-y-0.5` (lifts on hover), `active:translate-y-0 active:scale-[0.995]`
- **Image Container**:
  - Aspect Ratio: 3:4
  - Border Radius: `rounded-2xl`
  - Overflow: Hidden
  - **Image**:
    - Object Fit: `object-cover`
    - Ring: `ring-1 ring-white/12`
    - Transition: `group-hover:scale-[1.02]` (slight zoom on hover)
  - **Fade Gradient**: Bottom third has gradient from transparent to `black/18`
- **Info Box** (overlapping image):
  - Position: Absolute, `left-3 right-3 bottom-3`
  - Background: Glass effect
  - Border Radius: `rounded-3xl`
  - Padding: `px-4 py-4 md:px-5 md:py-4`
  - Border: `border border-white/35`
- **Title**:
  - Size: `text-[16px] md:text-[17px]`
  - Weight: `font-semibold`
  - Color: `text-white/95`
  - Line Clamp: 1 line
- **Discount Badge** (if applicable):
  - Position: Absolute, `top-3 right-3`, z-index: 20
  - Background: `bg-red-500`
  - Text: White
  - Padding: `px-2.5 py-1`
  - Border Radius: `rounded-full`
  - Size: `text-xs`
  - Weight: `font-bold`
  - Shadow: `shadow-lg`
- **Countdown Timer** (if promotion active):
  - Margin: `mt-2`
  - Uses `CompactCountdownTimer` component
- **Price Display**:
  - Layout: Flex, `items-center`, `justify-between`, `gap-3`
  - Margin: `mt-3`
  - **Original Price** (if discounted):
    - Size: `text-[12px]`
    - Color: `text-red-400/80`
    - Style: `line-through`
  - **Current Price**:
    - Layout: Flex column, `gap-0.5`
    - **Range Label** (if multiple variants): `text-xs md:text-sm text-white/80` ("قیمت از")
    - **Amount**: 
      - Size: `text-[17px] md:text-[18px]`
      - Weight: `font-bold`
      - Color: `text-green-400` (if discounted) or `text-white/95`
    - **Currency**: `text-[11px] md:text-xs text-white/70` ("تومان")
- **View Button**:
  - Text: "مشاهده" (View)
  - Padding: `px-3.5 py-2`
  - Border Radius: `rounded-full`
  - Size: `text-[13px]`
  - Weight: `font-medium`
  - Background: `bg-white/15`
  - Hover: `hover:bg-white/22`
  - Active: `active:bg-white/28`
  - Border: `border border-white/35`
  - Transition: `transition-colors duration-150`
  - White Space: `whitespace-nowrap`

---

## Section 4: Editorial Banners Section

**Container:**
- **Padding**: 
  - Vertical: `py-8 sm:py-10 lg:py-12`
  - Horizontal: `px-2 md:px-3 lg:px-4` (8px → 12px → 16px)
- **Background**: Transparent
- **Max Width**: `max-w-[1100px]`, centered

### Banner Grid
- **Layout**: 
  - Mobile: 1 column (`grid-cols-1`)
  - Desktop: 3 columns (`md:grid-cols-3`)
- **Gap**: `gap-4 md:gap-5` (16px → 20px)

### Each Editorial Banner

**Container:**
- **Height**: 
  - Mobile: `h-[280px]`
  - Small: `sm:h-[320px]`
  - Medium+: `md:h-[360px]`
- **Border Radius**: `rounded-3xl` (24px)
- **Overflow**: Hidden
- **Cursor**: Pointer
- **Ring**: `ring-1 ring-white/10`
- **Animation**: `animate-fadeIn` with staggered delay (`${index * 100}ms`)

**Background Image:**
- **Position**: Absolute, `inset-0`
- **Object Fit**: `object-cover`
- **Transition**: `group-hover:scale-105` (5% zoom on hover)
- **Duration**: `duration-500`

**Dark Overlay:**
- **Position**: Absolute, `inset-0`
- **Gradient**: `from-black/70 via-black/50 to-transparent`
- **Direction**: Left to right (RTL: right to left)

**Content:**
- **Position**: Relative, z-index: 10
- **Height**: Full
- **Layout**: Flex column, `justify-center`
- **Padding**: 
  - Mobile: `px-8`
  - Medium: `md:px-12`
  - Large: `lg:px-16`
- **Alignment**: 
  - RTL: `items-end text-right`
  - LTR: `items-start text-left`

**Title:**
- **Size**: `text-3xl sm:text-4xl md:text-5xl` (30px → 36px → 48px)
- **Weight**: `font-extrabold`
- **Color**: White
- **Margin**: `mb-3 md:mb-4`
- **Filter**: `drop-shadow(0 0 20px rgba(0,0,0,0.5))`
- **Animation**: `animate-fadeIn` with delay

**Subtitle:**
- **Size**: `text-base sm:text-lg md:text-xl` (16px → 18px → 20px)
- **Color**: `text-white/90`
- **Margin**: `mb-6 md:mb-8`
- **Max Width**: `max-w-2xl`
- **Filter**: `drop-shadow(0 0 15px rgba(0,0,0,0.4))`
- **Animation**: `animate-fadeIn` with delay

**CTA Button:**
- **Background**: Glass effect
- **Padding**: `px-6 py-3`
- **Border Radius**: `rounded-full`
- **Border**: `border border-white/35`
- **Text**: White, `font-medium`
- **Hover**: `hover:bg-white/15`
- **Transition**: `transition-all duration-200`
- **Layout**: Flex, `items-center`, `gap-2`
- **Arrow Icon**: 
  - Size: `h-4 w-4`
  - Transition: `group-hover/btn:translate-x-1`
  - Rotation: 180° for RTL

---

## Section 5: Special Offers Section

**Container:**
- **Padding**: 
  - Vertical: `py-8 sm:py-10 lg:py-12`
  - Horizontal: `px-6 lg:px-[100px]`
- **Background**: Transparent
- **Overflow**: Hidden
- **Max Width**: `max-w-[1400px]`, centered

### Section Header
Uses `SectionHeader` component:
- **Title**: "منطقه تخفیفات" (Discount Zone)
- **Eyebrow**: "پیشنهادات ویژه شریف‌GPT" (Special SharifGPT Offers)
- **Margin**: `mb-6` (24px bottom)

### Carousel Container

**Navigation Buttons:**
- **Position**: Absolute, `top-1/2 -translate-y-1/2`
- **Size**: `w-10 h-10 sm:w-12 sm:h-12` (40px → 48px)
- **Border Radius**: `rounded-full`
- **Background**: Glass effect
- **Border**: `border border-white/35`
- **Z-index**: 30
- **Hover**: `hover:bg-accent-red/20 hover:border-accent-red/40`
- **Active**: `active:scale-95`
- **Icon**: 
  - Size: `h-5 w-5 sm:h-6 sm:w-6`
  - Color: `text-accent-red`
  - Rotated for RTL
- **Position**:
  - Previous: `ltr:left-2 rtl:right-2`
  - Next: `ltr:right-2 rtl:left-2`

**Carousel:**
- **Overflow**: Hidden
- **Layout**: Flex, `gap-4 sm:gap-6 lg:gap-8`
- **Touch**: `touch-pan-y` enabled

**Product Items:**
- **Flex Basis**:
  - Mobile: `flex-[0_0_75%]` (75% width)
  - Small: `sm:flex-[0_0_45%]` (45% width)
  - Medium: `md:flex-[0_0_38%]` (38% width)
  - Large: `lg:flex-[0_0_24%]` (24% width)
- **Product Limit**: Maximum 6 products
- **Animation**: `animate-fade-in` with staggered delay

**View All Button** (if `onViewAll` provided):
- **Container**: Centered, `mt-8`
- **Button Variant**: `viewAll`
- **Size**: `lg`
- **Width**: Full on mobile, auto on desktop
- **Border Radius**: `rounded-2xl`
- **Text**: "مشاهده همه"
- **Animation**: `animate-fade-in` with 300ms delay

---

## Section 6: Social Media Products Grid Section

**Container:**
- **Padding**: Same as Special Offers
- **Max Width**: `max-w-[1400px]`, centered

### Section Header
- **Title**: "پرفروش‌ترین محصولات سوشیال مدیا" (Best Selling Social Media Products)
  - Size: `text-3xl sm:text-4xl`
  - Weight: `font-extrabold`
  - Color: `text-white`
  - Margin: `mb-2`
- **Subtitle**: "اکانت‌های اینستاگرام، تیک‌تاک، تلگرام و بیشتر"
  - Size: `text-sm sm:text-base`
  - Color: `text-white/70`

### Carousel
Similar structure to Special Offers:
- **Product Width**: Same flex basis values
- **Product Limit**: Maximum 8 products
- **Navigation**: Same styling but with white icons instead of red
- **Hover**: `hover:bg-white/10`

**View All Link:**
- **Conditional**: Only shown if more than 8 products
- **Margin**: `mt-6`
- **Button**: Same as Special Offers

---

## Section 7: Collections Banner Section

**Container:**
- **Padding**: Same as Editorial Banners
- **Max Width**: `max-w-[1100px]`, centered

### Banner Container

**Structure:** Similar to Editorial Banners but with platform icons

**Platform Icons (Top):**
- **Layout**: Flex, `items-center`, `gap-3`, RTL-aware
- **Margin**: `mb-6`
- **Animation**: Slide down with delay
- **Each Icon Container**:
  - Size: `w-10 h-10` (40px)
  - Border Radius: `rounded-xl`
  - Background: Glass effect
  - Border: `border border-white/30`
  - Display: Flex, centered
  - **Icon Colors**:
    - Instagram: `text-pink-400`
    - TikTok: `text-cyan-400`
    - Telegram: `text-blue-400`

**Title, Subtitle, CTA:** Same styling as Editorial Banners

---

## Section 8: Educational Products Slider Section

**Container:**
- **Padding**: Same as other sections
- **Max Width**: `max-w-[1400px]`, centered

### Section Header
- **Title**: "مرکز آموزش هوش مصنوعی" (AI Education Center)
- **Eyebrow**: "برترین محصولات آموزشی" (Top Educational Products)

### Carousel
- **Product Width**:
  - Mobile: `flex-[0_0_100%]`
  - Small: `sm:flex-[0_0_calc(50%-12px)]`
  - Large: `lg:flex-[0_0_calc(33.333%-21.33px)]`
- **Navigation**: Same as other carousels but with green accent (`accent-green`)
- **Items**: Uses `EduProductCard` component (different from ProductCard)

**EduProductCard Specifications:**
- Similar to ProductCard but specialized for educational products
- Shows provider badge (Coursera, Udemy, etc.)
- Displays duration/learning time
- Green accent colors for educational theme

---

## Section 9: Blog Posts Carousel Section

**Container:**
- **Padding**: Same as other sections
- **Max Width**: `max-w-[1400px]`, centered

### Section Header
- **Title**: "مقالات منتخب" (Featured Articles)
- **Eyebrow**: "آخرین مطالب بلاگ" (Latest Blog Posts)

### Carousel
- **Product Width**: Same flex basis as Social Media Products
- **Navigation**: Same styling (white icons)
- **Items**: Uses `BlogCard` component

**BlogCard Component Specifications:**
- **Layout**: Vertical card
- **Image**: Top, aspect ratio varies
- **Content**: Title, excerpt, author, date
- **Styling**: Glass effect background
- **Hover**: Lift effect

**View All Button:**
- Same styling as other sections
- Animated with spring transition

---

## Section 10: FAQ Section (Conditional)

**Container:**
- **Padding**: `py-8 sm:py-10 lg:py-12`
- **Horizontal Margin**: `mx-[10px]`

**FaqAccordion Component:**
- Uses same component as Product Detail page
- Each FAQ item in `SurfaceGlass` container
- Expandable/collapsible with animation
- Question text: `font-semibold`, `text-base`
- Answer text: `text-sm`, `text-muted-foreground`

---

## Section 11: Trust Elements Section

**Container:**
- **Padding**: `px-4 md:px-6 py-16` (16px → 24px horizontal, 64px vertical)
- **Max Width**: Container max-width, centered

### Trust Cards Grid
- **Layout**: 
  - Mobile: 1 column (`grid-cols-1`)
  - Desktop: 3 columns (`md:grid-cols-3`)
- **Gap**: `gap-6` (24px)
- **Max Width**: `max-w-5xl`, centered

### Each Trust Card

**Container:**
- **Component**: `SurfaceGlass` with `variant="default"`
- **Padding**: `p-8` (32px)
- **Text Alignment**: Center
- **Hover**: `hover:scale-105` (5% larger)
- **Transition**: `transition-transform duration-300`
- **Group**: Hover effects on child elements

**Icon Container:**
- **Position**: Relative (for glow effect)
- **Glow Effect** (behind icon):
  - Position: Absolute, `inset-0`
  - Background: Gradient (varies per card):
    - Card 1: `from-blue-500/20 to-purple-500/20`
    - Card 2: `from-purple-500/20 to-pink-500/20`
    - Card 3: `from-green-500/20 to-blue-500/20`
  - Border Radius: `rounded-full`
  - Blur: `blur-xl` (hover: `blur-2xl`)
  - Opacity: 60% (hover: 80%)
  - Transition: `transition-all duration-300`
- **Icon Circle**:
  - Size: Fixed (not responsive in this component)
  - Background: Gradient (varies per card):
    - Card 1: `from-blue-500 to-purple-600`
    - Card 2: `from-purple-500 to-pink-600`
    - Card 3: `from-green-500 to-blue-600`
  - Padding: `p-4` (16px)
  - Border Radius: `rounded-full`
  - Display: Flex, centered
  - Color: White
  - Position: Relative

**Icon:**
- **Size**: `w-8 h-8` (32px)
- **Color**: White
- **Types**: Users, Award, Shield

**Content:**
- **Layout**: Flex column, centered, `space-y-4` (16px gap)
- **Number/Percentage**:
  - Size: `text-2xl`
  - Weight: `font-bold`
  - Color: White
  - Examples: "+۱۰,۰۰۰", "۳+", "۱۰۰%"
- **Main Label**:
  - Size: Medium
  - Weight: `font-medium`
  - Color: `text-gray-300`
  - Examples: "کاربر راضی", "سال تجربه", "امنیت پرداخت"
- **Description**:
  - Size: `text-sm`
  - Color: `text-gray-400`
  - Examples: "از ابزارهای هوش مصنوعی ما استفاده می‌کنند", etc.
- **Check Icon**:
  - Size: `w-5 h-5` (20px)
  - Color: `text-green-400`
  - Type: CheckCircle

---

## Section 12: SEO Content Section

**Container:**
- **Padding**: `px-4 md:px-6 py-16`
- **Max Width**: Container max-width, centered

### Content Box
- **Component**: `SurfaceGlass` with `variant="subtle"`
- **Padding**: `p-8 md:p-12` (32px → 48px)
- **Max Width**: `max-w-4xl`, centered

**Content:**
- **Renderer**: `EnhancedMarkdownRenderer`
- **Content**: Either from Sanity (`seoContent`) or fallback markdown text
- **Styling**: Full markdown support (headings, paragraphs, lists, links, etc.)
- **Text Colors**: Inherits from theme
- **RTL**: Right-aligned text

---

## Footer Section

**Conditional Loading:**
- Only loads when `showFooter` is true (triggered by Intersection Observer)
- Trigger point: 400px before footer comes into view
- **Lazy Loaded**: Using Suspense

**Footer Component:**
- Standard site footer
- Contains links, social media icons
- Glassmorphism styling
- RTL layout

---

## Loading Placeholders

### Section Placeholder
- **Container**: `w-full h-64`, centered flex
- **Spinner**: 
  - Size: `w-8 h-8` (32px)
  - Border: `border-2 border-primary border-t-transparent`
  - Border Radius: `rounded-full`
  - Animation: `animate-spin`

---

## Animations & Transitions

### Entrance Animations
- **Fade In**: `animate-fadeIn` (0.2s ease-out) - used on most sections
- **Staggered Fade**: Items animate with delay based on index
- **Slide Animations**: 
  - From below: `y: 20 → 0`
  - From sides: `x: -20/20 → 0` (RTL-aware)
- **Scale Animations**: 
  - Badges: `scale: 0.8 → 1.0`
  - Cards: `scale: 1 → 1.05` on hover

### Hover Effects
- **Cards**: Lift effect (`-translate-y-0.5`)
- **Buttons**: Scale to 95% on active
- **Trust Cards**: Scale to 105% on hover
- **Icons**: Scale to 110% on hover
- **Images**: Scale to 105% on hover

### Spring Transitions
- **Stiffness**: 220
- **Damping**: 28
- Used for expandable/collapsible elements

---

## Responsive Breakpoints

- **Mobile**: < 640px (base styles)
- **Small (sm)**: 640px+ (`sm:` prefix)
- **Medium (md)**: 768px+ (`md:` prefix)
- **Large (lg)**: 1024px+ (`lg:` prefix)
- **Extra Large (xl)**: 1280px+ (`xl:` prefix)

---

## Performance Optimizations

1. **Lazy Loading**: Most content sections are lazy-loaded with React Suspense
2. **Image Optimization**: Uses srcSet and sizes attributes for responsive images
3. **Deferred Loading**: Hero image loads after initial paint (doesn't block LCP)
4. **Price Fetching**: Medusa prices only load on user interaction (scroll, click, keypress)
5. **Code Splitting**: Components split into separate chunks
6. **Intersection Observer**: Footer only loads when near viewport

---

## Accessibility Features

- **Focus States**: All interactive elements have visible focus rings
- **ARIA Labels**: Navigation buttons and interactive elements properly labeled
- **Semantic HTML**: Proper heading hierarchy, navigation landmarks
- **Keyboard Navigation**: All carousels and interactive elements keyboard accessible
- **Screen Reader Support**: Proper alt text for images, descriptive text for icons

---

## Technical Notes for Designer

1. **Glassmorphism**: The glass effect is consistent across all cards and containers. Design elements should work with this translucent aesthetic.

2. **Dark Theme**: All colors are designed for dark backgrounds. Text contrast ratios meet WCAG AA standards.

3. **RTL Support**: The entire page is RTL (right-to-left) for Persian/Farsi language. Icons and number displays may be LTR within RTL containers.

4. **Responsive Design**: Layouts shift from single column (mobile) to multi-column (desktop). Product cards adapt their width in carousels.

5. **Color Usage**:
   - Blue (primary): Interactive elements, trust badges, main CTA buttons
   - Green: Promotional prices, educational products
   - Red: Discount badges, special offers, urgent promotions
   - Yellow: Promotion highlights, sparkles icons

6. **Typography Hierarchy**:
   - Hero Title: 72px → 96px (mobile) → 60px (tablet) → 72px (desktop)
   - Section Titles: 30px → 36px
   - Card Titles: 16px → 17px
   - Body Text: 14px → 16px
   - Small Text: 12px → 14px

7. **Spacing System**: Uses Tailwind's spacing scale (4px increments). Common values: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px.

8. **Border Radius**: Consistent use of rounded corners - 8px (lg), 12px (xl), 20px (2xl), 24px (3xl), full (rounded-full).

9. **Carousel Behavior**: All carousels support touch/swipe, keyboard navigation, and have visible navigation arrows on hover.

10. **Product Card Variations**: Different card styles for regular products, educational products, and blog posts, but maintain consistent glassmorphism theme.

