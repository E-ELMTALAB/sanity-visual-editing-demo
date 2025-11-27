# Product Detail Page - Component Structure

## Page Hierarchy

```
ProductDetailPage
├── Header (Fixed, Glassmorphism)
│   ├── Logo
│   ├── Navigation Menu
│   ├── Search Bar
│   ├── Contact Button
│   ├── Cart Icon
│   │   └── Cart Dropdown Panel
│   │       ├── Cart Items List
│   │       ├── Cart Summary
│   │       └── Checkout Button
│   └── Profile Dropdown
│
├── Breadcrumb Navigation (4-level)
│   ├── Home Link
│   ├── Products Link
│   ├── Category Name
│   └── Product Title (current)
│
├── Main Product Section (2-Column Grid)
│   │
│   ├── Left Column: Product Images
│   │   ├── Main Featured Image
│   │   │   ├── Large Image Display (h-96)
│   │   │   ├── Hover Zoom Effect (scale-105)
│   │   │   ├── Rounded Corners
│   │   │   └── Shadow Effect
│   │   │
│   │   └── Mobile Product Summary (Mobile Only)
│   │       ├── Product Title
│   │       ├── Rating Section
│   │       │   ├── Star Display (5 stars)
│   │       │   ├── Review Count
│   │       │   └── Verified Badge
│   │       └── Pricing Card
│   │           ├── Current Price
│   │           ├── Discount Badge
│   │           ├── Original Price (strikethrough)
│   │           └── Savings Display
│   │
│   └── Right Column: Product Information
│       │
│       ├── Product Header Card (Glassmorphism)
│       │   ├── Decorative Background Elements
│       │   ├── Product Title (H1, gradient text)
│       │   ├── Rating Section
│       │   │   ├── Star Display Container
│       │   │   │   ├── 5 Star Icons
│       │   │   │   └── Numeric Rating
│       │   │   ├── Review Count Badge
│       │   │   └── Verified Badge (green)
│       │   │
│       │   └── Pricing Card (Gradient, blur effects)
│       │       ├── Decorative Elements
│       │       ├── Price Display Section
│       │       │   ├── Main Price (large, bold, gradient)
│       │       │   ├── Discount Badge (red pill)
│       │       │   └── Original Price Row
│       │       │       └── Strikethrough Price
│       │       └── Savings Display Box (green-themed)
│       │           ├── Icon
│       │           ├── Label: "صرفه‌جویی شما"
│       │           └── Savings Amount (calculated)
│
├── Tabs Section (Full Width)
│   ├── Tab Headers Bar
│   │   ├── Tab Button: "توضیحات" (Description) - default
│   │   ├── Tab Button: "ویژگی‌ها" (Features)
│   │   └── Tab Button: "سوالات متداول" (FAQs)
│   │
│   └── Tab Content Area
│       │
│       ├── Description Tab Panel
│       │   └── ReactMarkdown Renderer
│       │       ├── Rich Text Content
│       │       ├── Headings (H2, H3)
│       │       ├── Paragraphs
│       │       ├── Lists
│       │       └── Links
│       │
│       ├── Features Tab Panel
│       │   ├── Section Title
│       │   └── Features List
│       │       └── Feature Item (repeated)
│       │           ├── Checkmark Icon (green)
│       │           └── Feature Text
│       │
│       └── FAQs Tab Panel
│           ├── FAQ Accordion List
│           │   └── FAQ Item (repeated)
│           │       ├── Question Button
│           │       │   ├── Category Badge
│           │       │   │   ├── Badge: "عمومی" (General)
│           │       │   │   ├── Badge: "پرداخت" (Payment)
│           │       │   │   ├── Badge: "محصولات" (Products)
│           │       │   │   ├── Badge: "فنی" (Technical)
│           │       │   │   └── Badge: "خدمات" (Services)
│           │       │   ├── Question Text
│           │       │   └── Expand/Collapse Arrow Icon
│           │       └── Answer Panel (collapsible)
│           │           └── Answer Text
│           └── Empty State (if no FAQs)
│               └── "هیچ سوالی یافت نشد"
│
├── Related Products Section (Full Width)
│   ├── Section Container (white, rounded)
│   ├── Section Title: "محصولات مرتبط"
│   ├── Products Grid (1-2-4 columns)
│   │   └── Related Product Card (repeated)
│   │       ├── Product Image
│   │       │   ├── Image Display (h-48)
│   │       │   ├── Hover Scale Effect
│   │       │   └── Discount Badge (if applicable)
│   │       ├── Card Content
│   │       │   ├── Product Title (2-line clamp)
│   │       │   ├── Rating Display
│   │       │   │   ├── 5 Star Icons
│   │       │   │   └── Review Count
│   │       │   └── Price Section
│   │       │       ├── Current Price (blue)
│   │       │       └── Original Price (strikethrough)
│   │       └── Hover Border Effect (blue)
│   └── View All Button
│       └── Link to /products
│
├── Related Articles Section (Full Width)
│   ├── Section Container (white, rounded)
│   ├── Section Title: "مقالات مرتبط"
│   ├── Articles Grid (1-2-4 columns)
│   │   └── Related Article Card (repeated)
│   │       ├── Cover Image (optional)
│   │       │   └── Image Display (h-32)
│   │       ├── Card Content
│   │       │   ├── Article Title (2-line clamp)
│   │       │   ├── Meta Row
│   │       │   │   ├── Tag Badge (first tag)
│   │       │   │   └── Read Time
│   │       │   │       ├── Clock Icon
│   │       │   │       └── Time Text
│   │       │   └── Hover Color Change
│   │       └── Border Hover Effect
│   └── View All Button
│       └── Link to /blog
│
├── Sticky Footer Bar (Fixed at bottom)
│   ├── Product Summary Section (Left, 45% width)
│   │   ├── Product Title (truncated)
│   │   └── Price Display
│   │       ├── Current Price (blue, bold)
│   │       └── Original Price (strikethrough)
│   │
│   ├── Quantity Controls (Center)
│   │   ├── Glassmorphism Container
│   │   ├── Minus Button (−)
│   │   │   └── Minimum: 1
│   │   ├── Quantity Display
│   │   │   └── Current Quantity Number
│   │   └── Plus Button (+)
│   │       └── Increment Quantity
│   │
│   └── Add to Cart Button (Right)
│       ├── Default State
│       │   ├── Shopping Cart Icon
│       │   └── Text: "افزودن به سبد"
│       ├── Added State (after click)
│       │   ├── Checkmark Icon
│       │   ├── Text: "✨ اضافه شد!"
│       │   ├── Green Background
│       │   └── Pulse Animation
│       └── Hover Effects
│           ├── Scale Transform
│           └── Enhanced Shadow
│
├── Footer (Blue background)
│   ├── Company Info
│   │   ├── Logo
│   │   └── Description
│   ├── Useful Links
│   │   └── Links List
│   └── Trust Badge
│       └── Badge Placeholder
│
└── Success Notification (Temporary)
    └── Toast/Notification
        ├── Icon
        ├── Message: "محصول به سبد خرید اضافه شد"
        └── Auto-dismiss (3 seconds)
```

## Data Flow

### From Sanity CMS:
- Product details (`product` document)
- Product images and gallery
- Features list
- Related products (references)
- Related blogs (references)
- FAQ data (filtered by product)

### From Medusa Backend:
- **Live pricing** (primary source of truth)
- Product variants/options
- Discount calculations
- Stock availability
- SKU information

### State Management:
- Selected tab (description/features/faqs)
- Quantity (default: 1, min: 1)
- Selected option/variant (default: first option)
- Selected image index (for gallery)
- Expanded FAQ index
- Cart state (from Context)
- "Added to cart" notification state

## Key Interactive Elements

### Price Fetching:
1. Component mounts
2. Fetch prices from `/api/products/prices` endpoint
3. Match variants by slug
4. Display price from Medusa (not Sanity)
5. Calculate discount if applicable
6. Show savings amount

### Add to Cart Flow:
1. User clicks "Add to Cart"
2. Validate price is not zero
3. Get selected variant info
4. Create cart item object with:
   - Product ID
   - Title
   - Price (from Medusa)
   - Image
   - Selected option name
   - Quantity
   - Sanity slug (for backend validation)
   - Variant ID (for Medusa)
5. Add to cart context
6. Show success animation
7. Update cart icon count

## Responsive Behavior

### Desktop (lg+):
- 2-column layout (images left, info right)
- Sticky footer bar at bottom
- All content visible

### Mobile (<lg):
- Single column layout
- Images at top
- Product info card shows below images
- Sticky footer bar remains
- Tabs full width

## SEO Opportunities

### Current Missing:
- Dynamic `<title>` tag
- Meta description
- Open Graph tags
- Product schema (JSON-LD)
- Canonical URL
- Image alt text optimization







