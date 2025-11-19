# Components Index - Quick Reference

## 🏗️ Shared Components (Used Across Multiple Pages)

### Header Components
```
Header (Fixed/Sticky)
├── Logo
├── NavigationMenu
│   ├── ProductsDropdown (Mega Menu, 3 columns)
│   ├── CoursesDropdown (Mega Menu, 3 columns)
│   ├── EnterpriseLink
│   └── BlogLink
├── SearchBar (Expandable)
├── ContactButton (with online status)
├── CartIcon (with count badge)
└── ProfileDropdown
    ├── UserAvatar
    ├── MenuItems
    └── LogoutButton
```

### Footer Components
```
Footer
├── CompanyInfoSection
├── QuickLinksSection
├── SocialMediaSection
├── TrustBadgeSection
└── CopyrightNotice
```

### Card Components
```
ProductCard
├── ProductImage
├── DiscountBadge
├── ProductTitle
├── RatingStars
├── PriceDisplay
└── ActionButton

CourseCard
├── CourseImage
├── CourseBadge
├── CourseTitle
├── InstructorInfo
├── PriceDisplay
├── RatingStars
└── EnrollButton

BlogCard
├── FeaturedImage
├── CategoryBadge
├── ArticleTitle
├── Excerpt
├── MetaInfo (date, read time)
└── ReadMoreLink
```

### Navigation Components
```
Breadcrumb
├── HomeLink
├── Separators
└── CurrentPage

MobileMenu
├── MenuToggle
├── MenuOverlay
└── MenuContent
```

### Utility Components
```
CartDropdown
├── CartItemsList
├── CartSummary
└── CheckoutButton

SupportWidget
├── WidgetIcon
├── ChatPanel
└── ContactForm

RobotAssistant
├── AssistantIcon
├── ChatWindow
└── MessageInput

LoadingSpinner
ErrorBoundary
NotFoundPage
Toast/Notification
```

---

## 📄 Page-Specific Components

### Home Page Only
```
StoriesSection
├── StoryCircle (repeated)
└── StoryViewerModal

HeroSection
├── IndependentSlider (Main)
├── IndependentSlider (Left Promo)
└── IndependentSlider (Right Promo)

CategoryNavigation
├── CategoryTabs
└── AnimatedUnderline

SpecialOffersSection (Red theme)
EducationalProductsSection (Green theme)
SocialMediaProductsSection (Pink theme)
BestsellingCoursesSection (Blue theme)
MagazineSection
```

### Products List Page Only
```
FiltersSidebar
├── CategoryFilters
├── PriceRangeFilters
└── RatingFilters

SortControls
├── SortDropdown
└── ResultsCounter

ProductsGrid (with responsive columns)
FAQAccordion
```

### Product Detail Page Only
```
ProductGallery
├── MainImage
└── ThumbnailStrip

ProductInfoCard (Glassmorphism)
├── ProductHeader
├── RatingSection
└── PricingCard

ProductTabs
├── TabHeaders
└── TabPanels
    ├── DescriptionPanel (ReactMarkdown)
    ├── FeaturesPanel
    └── FAQsPanel

RelatedProductsSection
RelatedArticlesSection

StickyFooterBar
├── ProductSummary
├── QuantityControls
└── AddToCartButton
```

### Blog Detail Page Only
```
ArticleHeroHeader (with image overlay)
├── FeaturedImage
├── DarkOverlay
└── HeaderContent

ArticleMetaBar
├── AuthorInfo
└── TagsList

ArticleBody (Prose styled)
├── RichTextContent
└── ContentElements (H2, P, UL, OL, etc.)

ArticleFooter
├── SocialActions (Like, Share)
└── BackToBlinkLink

RelatedArticlesSection (Max 3)
```

---

## 🎨 Component Variants & States

### Button Variants
- Primary (Blue gradient)
- Success (Green)
- Danger (Red)
- Ghost (Transparent)
- Disabled

### Card States
- Default
- Hover (shadow increase, scale)
- Loading (skeleton)
- Error
- Empty

### Input States
- Default
- Focus (ring, expanded)
- Error (red border)
- Disabled
- Success

### Modal/Overlay States
- Hidden (opacity-0, invisible)
- Visible (opacity-100)
- Entering (transition)
- Exiting (transition)

---

## 📐 Responsive Grid Patterns

### Products Grid
- **Mobile**: 2 columns
- **Tablet**: 3 columns
- **Desktop**: 4 columns

### Courses Grid
- **Mobile**: 1 column
- **Tablet**: 2 columns
- **Desktop**: 3 columns

### Blog Grid
- **Mobile**: 1 column
- **Tablet**: 2 columns
- **Desktop**: 3 columns

### Related Items Grid
- **Mobile**: 1 column
- **Tablet**: 2 columns
- **Desktop**: 4 columns

---

## 🔄 State Management Components

### Context Providers
```
CartContext
├── CartState
├── addItem()
├── removeItem()
├── updateQuantity()
├── clearCart()
└── getTotal()

AuthContext
├── AuthState
├── login()
├── logout()
└── checkAuth()

ThemeContext (optional)
├── ThemeState
└── toggleTheme()
```

---

## 🎯 Interactive Patterns

### Dropdowns
- Mega Menu (Products, Courses)
- Profile Dropdown
- Cart Dropdown
- Sort Dropdown
- Category Dropdown

### Sliders/Carousels
- Hero Slider (auto-play)
- Independent Sliders (promo cards)
- Product Carousel (Swiper)
- Story Circles (horizontal scroll)

### Accordions
- FAQ Accordion
- Filter Accordion (mobile)
- Product Details Accordion

### Tabs
- Product Tabs (Description, Features, FAQs)
- Category Tabs (Home page)

### Modals
- Story Viewer Modal
- Image Lightbox Modal
- Cart Preview Modal
- Login/Register Modal
- Confirmation Modals

---

## 🚀 Performance-Critical Components

### Lazy Load Candidates
- Product images
- Course thumbnails
- Blog featured images
- Related content sections
- Comments section
- Heavy third-party widgets

### Virtualization Candidates
- Long product lists (100+ items)
- Infinite scroll blog archive
- Search results
- Category filters with many items

### Code-Split Candidates
- Admin/Dashboard pages
- Heavy editor components
- Chart/Analytics components
- PDF viewers
- Video players

---

## 🔍 SEO-Critical Components

### Meta Components
```
SEOHead
├── TitleTag
├── MetaDescription
├── CanonicalLink
├── OpenGraphTags
├── TwitterCardTags
└── StructuredData (JSON-LD)
```

### Schema Types Needed
- **WebSite** (Homepage)
- **Product** (Product pages)
- **Course** (Course pages)
- **BlogPosting** (Blog articles)
- **BreadcrumbList** (All pages)
- **Organization** (Footer)
- **FAQPage** (FAQ sections)

---

## 📦 Reusable UI Components (Atoms)

### Basic Elements
- Button
- Input
- Textarea
- Select
- Checkbox
- Radio
- Switch
- Badge
- Tag
- Avatar
- Icon
- Divider
- Spacer

### Feedback
- Alert
- Toast
- Tooltip
- Popover
- Progress
- Spinner
- Skeleton

### Layout
- Container
- Grid
- Flex
- Stack (VStack, HStack)
- Card
- Section
- Sidebar
- Modal

---

## 🎭 Animation Components

### Transitions
- Fade
- Slide
- Scale
- Rotate
- Flip

### Animations
- Pulse (notification badges)
- Spin (loading)
- Bounce (CTA buttons)
- Wave (skeleton loading)
- Shake (error states)

### Scroll Animations
- Fade In on Scroll
- Slide Up on Scroll
- Parallax Effects
- Sticky Elements
- Progress Indicators

---

**Quick Navigation:**
- [Home Page Structure](./01-HOME-PAGE.md)
- [Products List Structure](./02-PRODUCTS-LIST.md)
- [Blog List Structure](./03-BLOG-LIST.md)
- [Product Detail Structure](./04-PRODUCT-DETAIL.md)
- [Blog Detail Structure](./05-BLOG-DETAIL.md)
- [Full Documentation](./README.md)



