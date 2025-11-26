# Blog List Page - Component Structure

## Page Hierarchy

```
BlogListPage
├── Header (Sticky, Glassmorphism)
│   ├── Logo
│   ├── Desktop Navigation Menu
│   │   ├── Products Dropdown (Mega Menu)
│   │   │   ├── 3-Column Grid
│   │   │   │   ├── Column 1: Credit Cards
│   │   │   │   │   ├── Section Icon
│   │   │   │   │   ├── Section Title
│   │   │   │   │   └── Product Links
│   │   │   │   ├── Column 2: Courses
│   │   │   │   │   ├── Section Icon
│   │   │   │   │   ├── Section Title
│   │   │   │   │   └── Course Links
│   │   │   │   └── Column 3: AI Tools
│   │   │   │       ├── Section Icon
│   │   │   │       ├── Section Title
│   │   │   │       └── Tool Links
│   │   ├── Enterprise Link
│   │   └── Blog Link
│   ├── Search Bar (Expandable)
│   ├── Contact Button
│   │   └── Online Status
│   ├── Cart Icon
│   └── Profile Dropdown
│       ├── Avatar
│       └── Menu Items
│
├── Breadcrumb Navigation
│   ├── Home Link
│   ├── Separator
│   └── Current Page (Blog)
│
├── Page Header Section
│   ├── Page Title: "مقالات و راهنماها"
│   └── Page Description
│
├── Main Content Container
│   └── Articles Grid (Responsive)
│       └── ArticleCard Component (repeated)
│           ├── Featured Image
│           │   └── Image (h-48, full-width)
│           ├── Card Content
│           │   ├── Meta Row
│           │   │   ├── Category Badge (blue pill)
│           │   │   └── Meta Info
│           │   │       ├── Publish Date
│           │   │       ├── Separator (•)
│           │   │       └── Read Time
│           │   ├── Article Title (2-line clamp)
│           │   ├── Excerpt Preview (3-line clamp)
│           │   └── Read More Link
│           │       ├── Link Text: "ادامه مطلب"
│           │       └── Arrow Icon (←)
│           └── Hover Effects
│               └── Shadow Increase
│
├── Footer (Same as other pages)
│   ├── Company Info
│   ├── Quick Links
│   ├── Social Media
│   └── Copyright
│
└── Floating Components
    └── Support Widget
```

## Component Grid Breakpoints

### Articles Grid:
- **Mobile**: 1 column
- **Tablet**: 2 columns
- **Desktop**: 3 columns

## Data Sources

### Current Implementation (Static):
- Hardcoded articles array (4 sample articles)
- Categories: spotify, youtube, cards, ai-tools

### For Production (Sanity CMS):
- Articles from `post` document type
- Fields needed:
  - `title`
  - `slug`
  - `excerpt`
  - `category` or `tags`
  - `publishedAt` (date)
  - `estimatedReadingTime`
  - `coverImage`
  - `author` (reference)

### Sample Categories:
- Spotify
- YouTube
- Cards (Virtual Credit Cards)
- AI Tools

## Missing Features (To Add):

### Filters:
- Category filter dropdown/tabs
- Search functionality
- Sort by (Latest, Popular, etc.)

### Pagination:
- Load more button
- Page numbers
- Infinite scroll

### Search:
- Search bar integration
- Search results page






