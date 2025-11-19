# Products List Page - Component Structure

## Page Hierarchy

```
ProductsListPage
├── Header (Fixed, Glassmorphism, Auto-hide on scroll)
│   ├── Logo
│   ├── Desktop Navigation Menu
│   │   ├── Products Dropdown (Mega Menu)
│   │   │   ├── 3-Column Grid
│   │   │   │   ├── Column 1: AI Business Solutions
│   │   │   │   │   ├── Section Icon
│   │   │   │   │   ├── Section Title
│   │   │   │   │   └── Product Links List
│   │   │   │   ├── Column 2: AI Tools & Learning
│   │   │   │   │   ├── Section Icon
│   │   │   │   │   ├── Section Title
│   │   │   │   │   └── Product Links List
│   │   │   │   └── Column 3: Creative & Technical
│   │   │   │       ├── Section Icon
│   │   │   │       ├── Section Title
│   │   │   │       ├── Product Links List
│   │   │   │       └── Featured Course Badge
│   │   │   └── Hover Overlay Effect
│   │   ├── Blog Link
│   │   └── Enterprise Link
│   ├── Search Bar (Expandable on focus)
│   ├── Contact Section
│   │   ├── Contact Link
│   │   └── Online Status Indicator
│   ├── Cart Icon
│   └── Profile Dropdown
│       ├── Avatar
│       └── Menu Items
│
├── Breadcrumb Navigation
│   ├── Home Link
│   ├── Separator
│   └── Current Page (Products)
│
├── Page Header Section
│   ├── Page Title
│   └── Page Description
│
├── Main Content Container (2-Column Layout)
│   │
│   ├── Left Sidebar (25% width, Sticky)
│   │   ├── Filters Header
│   │   │   ├── Title
│   │   │   └── Toggle Button (Mobile)
│   │   │
│   │   ├── Category Filters Section
│   │   │   ├── Section Title
│   │   │   └── Category Buttons List
│   │   │       └── Category Button
│   │   │           ├── Category Name
│   │   │           └── Product Count
│   │   │
│   │   ├── Price Range Filters Section
│   │   │   ├── Section Title
│   │   │   └── Price Checkboxes List
│   │   │       └── Price Range Checkbox
│   │   │           ├── Checkbox Input
│   │   │           └── Range Label
│   │   │
│   │   └── Rating Filters Section
│   │       ├── Section Title
│   │       └── Rating Checkboxes List
│   │           └── Rating Checkbox
│   │               ├── Checkbox Input
│   │               ├── Star Display (5 stars)
│   │               └── "and up" Label
│   │
│   └── Right Content Area (75% width)
│       │
│       ├── Sort & View Controls Bar
│       │   ├── Sort Section
│       │   │   ├── Sort Label
│       │   │   └── Sort Dropdown
│       │   │       ├── Option: Popular (default)
│       │   │       ├── Option: Newest
│       │   │       ├── Option: Price Low to High
│       │   │       ├── Option: Price High to Low
│       │   │       └── Option: Highest Rating
│       │   └── Results Counter
│       │       └── Text: "Showing X of Y products"
│       │
│       ├── Products Grid (Responsive)
│       │   └── ProductCard Component (repeated)
│       │       ├── Product Image
│       │       │   └── Discount Badge (if applicable)
│       │       ├── Product Title
│       │       ├── Product Description (truncated)
│       │       ├── Rating Display
│       │       │   ├── Star Icons (5 stars)
│       │       │   └── Review Count
│       │       ├── Price Section
│       │       │   ├── Current Price (from Medusa)
│       │       │   ├── Original Price (strikethrough)
│       │       │   └── Discount Percentage Badge
│       │       ├── Features List (bullets)
│       │       └── View Product Button
│       │
│       └── FAQ Section
│           ├── Section Title
│           └── FAQ Accordion List
│               └── FAQ Item
│                   ├── Question Button
│                   │   ├── Category Badge
│                   │   ├── Question Text
│                   │   └── Expand/Collapse Icon
│                   └── Answer Panel (expandable)
│                       └── Answer Text
│
├── Footer (Same as other pages)
│   ├── Company Info
│   ├── Quick Links
│   ├── Social Media Links
│   └── Copyright
│
└── Floating Components
    ├── Support Widget
    └── Back to Top Button (appears on scroll)
```

## Component Grid Breakpoints

### Products Grid:
- **Mobile**: 2 columns
- **Tablet**: 3 columns
- **Desktop**: 4 columns
- **XL Desktop**: 4 columns

### Filters Sidebar:
- **Mobile**: Hidden (toggle to show)
- **Desktop**: Always visible, sticky position

## Data Sources

### From Sanity CMS:
- Products list from `product` document type
- FAQ data from `faq` document type (filtered by `pageLocation: 'products'`)

### From Medusa Backend:
- Real-time pricing for all products
- Variant information
- Discount calculations
- Stock status

### State Management:
- Selected category (URL query param)
- Sort option (local state)
- Filter visibility (mobile state)
- Expanded FAQ index (local state)



