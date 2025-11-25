# Home Page - Component Structure

## Page Hierarchy

```
HomePage
├── Header (Fixed, Glassmorphism)
│   ├── Logo
│   ├── Navigation Menu (Desktop)
│   │   ├── Products Link
│   │   ├── Courses Link
│   │   ├── Enterprise Link
│   │   └── Blog Link
│   ├── Search Bar (Expandable)
│   ├── Contact Button
│   │   └── Online Status Indicator
│   ├── Cart Icon
│   │   └── Item Count Badge
│   └── Profile Dropdown
│       ├── User Avatar
│       ├── Profile Menu Items
│       └── Logout Button
│
├── Mobile Menu Button (Mobile Only)
│
├── Main Content Container
│   │
│   ├── 1. Stories Section
│   │   ├── Section Title
│   │   └── Horizontal Scrollable Story Circles
│   │       ├── Story Circle
│   │       │   ├── Story Image
│   │       │   ├── Story Indicator
│   │       │   └── Story Title
│   │       └── Story Viewer Modal
│   │           ├── Story Content
│   │           └── Close Button
│   │
│   ├── 2. Hero Section (3-Column Grid)
│   │   ├── Left Column: Promo Card 1
│   │   │   ├── IndependentSlider Component
│   │   │   │   ├── Slide Image
│   │   │   │   ├── Slide Content (Title, Subtitle, Button)
│   │   │   │   ├── Navigation Arrows (on hover)
│   │   │   │   └── Slide Indicators (dots)
│   │   │   
│   │   ├── Center Column: Main Hero Slider
│   │   │   ├── IndependentSlider Component (larger)
│   │   │   │   ├── Slide Image
│   │   │   │   ├── Slide Content
│   │   │   │   ├── Navigation Arrows
│   │   │   │   └── Slide Indicators
│   │   │   
│   │   └── Right Column: Promo Card 2
│   │       └── IndependentSlider Component
│   │           ├── Slide Image
│   │           ├── Slide Content
│   │           ├── Navigation Arrows
│   │           └── Slide Indicators
│   │
│   ├── 3. Category Navigation Section
│   │   ├── Horizontal Scrollable Category Tabs
│   │   │   ├── Category Tab (All Products)
│   │   │   ├── Category Tab (AI)
│   │   │   ├── Category Tab (Social Media)
│   │   │   ├── Category Tab (Music)
│   │   │   ├── Category Tab (Educational)
│   │   │   └── Category Tab (SIM Card)
│   │   └── Animated Underline Indicator
│   │
│   ├── 4. Special Offers Section (تخفیفات ویژه)
│   │   ├── Section Title
│   │   ├── Red-themed Container (blur effect)
│   │   └── Product Grid (up to 8 items)
│   │       └── DiscountedProduct Card
│   │           ├── Product Image
│   │           ├── Discount Badge
│   │           ├── Product Title
│   │           ├── Price Display
│   │           └── Add to Cart Button
│   │
│   ├── 5. Social Media Products Section
│   │   ├── Section Title
│   │   ├── Pink/Magenta-themed Container
│   │   └── Horizontal Swiper Slider
│   │       └── SocialMediaProduct Card
│   │           ├── Product Image
│   │           ├── Product Title
│   │           ├── Price Display
│   │           ├── Rating Stars
│   │           └── Quick View Button
│   │
│   ├── 6. Educational Products Section
│   │   ├── Section Title
│   │   ├── Green-themed Container
│   │   └── Horizontal Swiper Slider
│   │       └── EducationalProduct Card
│   │           ├── Product Image
│   │           ├── Product Title
│   │           ├── Price Display
│   │           ├── Rating Stars
│   │           └── Quick View Button
│   │
│   ├── 7. Bestselling Courses Section
│   │   ├── Section Title
│   │   ├── Blue-themed Container
│   │   └── Course Grid (up to 6 items)
│   │       └── BestsellingCourse Card
│   │           ├── Course Image
│   │           ├── Course Title
│   │           ├── Instructor Name
│   │           ├── Price Display
│   │           ├── Rating Stars
│   │           ├── Student Count
│   │           └── Enroll Button
│   │
│   ├── 8. SharifGPT Magazine Section
│   │   ├── Section Title
│   │   ├── Section Subtitle
│   │   └── Blog Posts Grid (max 3)
│   │       └── Magazine Post Card
│   │           ├── Featured Image
│   │           ├── Post Title
│   │           ├── Post Excerpt
│   │           ├── Read Time
│   │           └── Read More Link
│   │
│   └── 9. Featured Blogs Section
│       ├── Section Title
│       └── Blog Posts Grid (max 6)
│           └── Featured Blog Card
│               ├── Featured Image
│               ├── Post Title
│               ├── Post Excerpt
│               ├── Author Info
│               ├── Publish Date
│               └── Read More Link
│
├── Footer
│   ├── Company Info Section
│   │   ├── Logo
│   │   └── Description Text
│   ├── Quick Links Section
│   │   └── Link List
│   ├── Newsletter Section
│   │   └── Subscription Form
│   ├── Social Media Links
│   └── Copyright Notice
│
└── Floating Components (Always Visible)
    ├── Robot Assistant Widget (Bottom-right)
    │   ├── Chat Icon
    │   ├── Chat Window
    │   └── Close Button
    ├── Support Widget (Bottom-right)
    │   ├── Support Icon
    │   ├── Support Panel
    │   └── Contact Form
    └── Cart Dropdown Panel (Slide-in)
        ├── Cart Items List
        │   └── Cart Item
        │       ├── Product Image
        │       ├── Product Title
        │       ├── Quantity Controls
        │       ├── Price Display
        │       └── Remove Button
        ├── Cart Summary
        │   ├── Subtotal
        │   ├── Discount
        │   └── Total
        └── Checkout Button
```

## Data Sources

### From Sanity CMS (`home` singleton):
- `topBannerSlides` - Story circles
- `heroSlides` - Main center slider
- `promoCards` - Left and right promo sliders
- `discountedProducts` - Special offers section
- `socialMediaProducts` - Social media products slider
- `educationalProducts` - Educational products slider
- `bestsellingCourses` - Courses grid
- `magazinePosts` - Magazine section (references to `post`)
- `featuredBlogs` - Featured blogs section (references to `post`)

### Dynamic Data:
- Products fetched from `/api/products`
- Courses fetched from Sanity
- Cart state from Context API





