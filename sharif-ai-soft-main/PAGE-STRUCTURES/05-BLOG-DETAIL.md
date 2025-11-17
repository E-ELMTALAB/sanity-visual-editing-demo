# Blog Article Detail Page - Component Structure

## Page Hierarchy

```
BlogArticleDetailPage
├── Header (Sticky, Glassmorphism)
│   ├── Logo
│   ├── Desktop Navigation Menu
│   │   ├── Products Dropdown (Mega Menu)
│   │   │   └── 3-Column Grid
│   │   │       ├── Column 1: Applied AI
│   │   │       ├── Column 2: Text-to-Image & Video AI
│   │   │       └── Column 3: Programming & Other AI
│   │   ├── Courses Dropdown (Mega Menu)
│   │   │   └── 3-Column Grid
│   │   │       ├── Column 1: AI Fundamentals
│   │   │       ├── Column 2: Business
│   │   │       └── Column 3: Creative & Technical
│   │   ├── Enterprise Link
│   │   └── Blog Link
│   ├── Search Bar (Expandable)
│   ├── Contact Button
│   │   └── Online Status Indicator
│   └── Profile Section
│       ├── Profile Avatar
│       ├── Cart Icon
│       └── Profile Dropdown Menu
│           ├── User Info
│           │   ├── Avatar
│           │   ├── Name
│           │   └── Email
│           ├── Menu Items
│           │   ├── My Profile Link
│           │   └── My Orders Link
│           └── Logout Button
│
├── Breadcrumb Navigation (3-level)
│   ├── Home Link
│   ├── Separator (/)
│   ├── Blog Link
│   ├── Separator (/)
│   └── Article Title (current)
│
├── Article Container (Max-width: 4xl, Centered)
│   │
│   ├── Article Header Section (Hero with Overlay)
│   │   ├── Featured Image Background
│   │   │   └── Full-width Image (h-64 mobile, h-80 desktop)
│   │   ├── Dark Overlay (40% black opacity)
│   │   └── Header Content (Over image, bottom-aligned)
│   │       ├── Meta Row
│   │       │   ├── Category Badge (blue pill)
│   │       │   ├── Publish Date
│   │       │   ├── Separator (•)
│   │       │   └── Read Time
│   │       ├── Article Title (H1)
│   │       │   └── Large, bold text (2xl mobile, 4xl desktop)
│   │       └── Excerpt/Subtitle
│   │           └── Large opacity text
│   │
│   ├── Article Meta Bar (White background, bordered)
│   │   ├── Left Section: Author Info
│   │   │   ├── Author Avatar (rounded)
│   │   │   └── Author Details
│   │   │       ├── Author Name
│   │   │       └── Publication Date
│   │   └── Right Section: Tags
│   │       └── Tag Pills List
│   │           └── Tag Badge (repeated)
│   │               └── Format: "#tag-name"
│   │
│   ├── Article Body Section (Main Content)
│   │   ├── Content Container (Padding: 6-8)
│   │   └── Prose Styled Content
│   │       ├── Heading 2 (H2) - Sections
│   │       ├── Paragraphs (P)
│   │       │   └── Line height: 1.8
│   │       ├── Unordered Lists (UL)
│   │       │   └── List Items (LI)
│   │       ├── Ordered Lists (OL)
│   │       ├── Blockquotes (optional)
│   │       ├── Images (optional)
│   │       ├── Links (A)
│   │       └── Code Blocks (optional)
│   │
│   ├── Article Footer Section (Gray background)
│   │   ├── Left Section: Social Actions
│   │   │   ├── Like Button
│   │   │   │   ├── Heart Icon
│   │   │   │   └── Text: "پسندیدن"
│   │   │   └── Share Button
│   │   │       ├── Share Icon
│   │   │       └── Text: "اشتراک‌گذاری"
│   │   └── Right Section: Navigation
│   │       └── Back to Blog Link
│   │           └── Text: "بازگشت به بلاگ"
│   │
│   └── Related Articles Section
│       ├── Section Title: "مقالات مرتبط"
│       └── Articles Grid (1-3 columns)
│           └── Related Article Card (repeated, max 3)
│               ├── Featured Image
│               │   └── Image Display (h-40)
│               ├── Card Content
│               │   ├── Meta Row
│               │   │   ├── Category Badge (blue pill)
│               │   │   └── Read Time
│               │   ├── Article Title (2-line clamp)
│               │   ├── Excerpt Text (2-line clamp)
│               │   └── Read More Link
│               │       ├── Text: "ادامه مطلب"
│               │       └── Arrow Icon (←)
│               └── Hover Effects
│                   └── Shadow Increase
│
├── Footer (Blue background #3092BE)
│   ├── Grid Layout (1-2-3 columns)
│   │   ├── Company Section
│   │   │   ├── Company Name: "SharifGPT"
│   │   │   └── Description Text
│   │   ├── Quick Links Section
│   │   │   ├── Section Title
│   │   │   └── Links List
│   │   │       ├── Terms & Conditions
│   │   │       ├── Privacy Policy
│   │   │       └── About Us
│   │   └── Trust Badge Section
│   │       ├── Section Title
│   │       └── Badge Placeholder
│   └── Copyright Section
│       └── Copyright Text
│
└── Not Found State (If article doesn't exist)
    ├── Error Container (Centered)
    │   ├── Error Title: "مقاله یافت نشد"
    │   └── Back to Blog Link
    └── Background: Gray-50
```

## Content Rendering

### Current Implementation:
- Uses `dangerouslySetInnerHTML` for HTML content
- Static sample articles in component state

### For Production (Recommended):
Use **ReactMarkdown** or **Sanity Portable Text**:

```
Article Body
├── ReactMarkdown Component
│   ├── Props
│   │   ├── remarkPlugins: [remarkGfm]
│   │   └── components (custom renderers)
│   │       ├── h2: Custom H2 Component
│   │       ├── p: Custom Paragraph
│   │       ├── ul/ol: Custom List
│   │       ├── li: Custom List Item
│   │       ├── a: Custom Link
│   │       ├── img: Custom Image
│   │       └── code: Custom Code Block
│   └── Content: article.content (markdown string)
```

## Data Sources

### Current (Static):
- Hardcoded articles array (4 samples)
- Categories: spotify, youtube, cards, ai-tools
- Fields: id, title, excerpt, content (HTML), category, date, readTime, image, author, tags

### For Production (Sanity CMS):
Fetch from `post` document type:
- `title`
- `slug`
- `excerpt` or `overview`
- `body` (Portable Text or Markdown)
- `category` or `tags[]`
- `publishedAt`
- `estimatedReadingTime`
- `coverImage` (with alt text)
- `author` (reference to `author` document)
  - `name`
  - `avatar`
  - `bio`
- `seo` object
  - `metaTitle`
  - `metaDescription`
  - `canonicalUrl`
  - `openGraphTitle`
  - `openGraphDescription`
  - `openGraphImage`
  - `structuredData` (Article JSON-LD)

## Related Articles Logic

### Current:
- Filters out current article
- Takes first 3 remaining articles

### For Production:
Should fetch based on:
1. Same category/tags
2. Similar topics
3. Author's other posts
4. Manually selected related posts (from Sanity)
5. Most recent/popular posts as fallback

## Interactive Elements

### Like Button:
- Toggle like state
- Update like count
- Save to user preferences
- Show animation on click

### Share Button:
- Open share modal/panel
- Share options:
  - Copy link
  - Share to Twitter/X
  - Share to LinkedIn
  - Share to Telegram
  - Share to WhatsApp
- Show success notification

### Tags:
- Clickable tags
- Filter/navigate to tag archive page
- Show all articles with same tag

## Responsive Behavior

### Desktop:
- Max-width container (4xl)
- 3-column related articles grid
- Full-size hero image (h-80)
- Spacious padding

### Tablet:
- 2-column related articles grid
- Medium hero image (h-64)

### Mobile:
- Single column layout
- 1-column related articles grid
- Smaller hero image (h-64)
- Reduced padding

## SEO Requirements

### Critical Missing Elements:

1. **Dynamic Meta Tags**:
```html
<title>{article.seo.metaTitle || article.title} | SharifGPT Blog</title>
<meta name="description" content={article.seo.metaDescription || article.excerpt} />
<link rel="canonical" href={article.seo.canonicalUrl} />
```

2. **Open Graph Tags**:
```html
<meta property="og:type" content="article" />
<meta property="og:title" content={article.seo.openGraphTitle} />
<meta property="og:description" content={article.seo.openGraphDescription} />
<meta property="og:image" content={article.coverImage} />
<meta property="article:published_time" content={article.publishedAt} />
<meta property="article:modified_time" content={article.updatedAt} />
<meta property="article:author" content={article.author.name} />
<meta property="article:tag" content={tag} /> (for each tag)
```

3. **Twitter Card Tags**:
```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={article.title} />
<meta name="twitter:description" content={article.excerpt} />
<meta name="twitter:image" content={article.coverImage} />
```

4. **Structured Data (JSON-LD)**:
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "article.title",
  "image": "article.coverImage",
  "datePublished": "article.publishedAt",
  "dateModified": "article.updatedAt",
  "author": {
    "@type": "Person",
    "name": "article.author.name",
    "url": "author.website"
  },
  "publisher": {
    "@type": "Organization",
    "name": "SharifGPT",
    "logo": { ... }
  },
  "description": "article.excerpt",
  "mainEntityOfPage": "article.url"
}
```

5. **Breadcrumb Structured Data**:
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "/" },
    { "@type": "ListItem", "position": 2, "name": "Blog", "item": "/blog" },
    { "@type": "ListItem", "position": 3, "name": "Article Title", "item": "/blog/slug" }
  ]
}
```

## Additional Features to Consider

### Reading Experience:
- Table of contents (for long articles)
- Reading progress bar
- Font size controls
- Dark mode toggle
- Print button

### Engagement:
- Comments section
- Related products (if applicable)
- Newsletter signup CTA
- Author bio card
- Social follow buttons

### Performance:
- Lazy load images
- Optimize cover image (multiple sizes)
- Preload related articles
- Cache article content


