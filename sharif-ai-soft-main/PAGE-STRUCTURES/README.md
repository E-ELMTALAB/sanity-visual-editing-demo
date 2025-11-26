# Page Structures Documentation

This folder contains detailed component structure documentation for all main pages in the SharifGPT website.

## 📁 Files Overview

| File | Page Type | Description |
|------|-----------|-------------|
| `01-HOME-PAGE.md` | Landing Page | Main homepage with stories, hero slider, product sections, courses, and blog posts |
| `02-PRODUCTS-LIST.md` | Product Catalog | Products listing with filters, sorting, and FAQ section |
| `03-BLOG-LIST.md` | Blog Archive | Blog articles grid with category badges and metadata |
| `04-PRODUCT-DETAIL.md` | Product Single | Individual product page with tabs, pricing, cart, and related content |
| `05-BLOG-DETAIL.md` | Blog Single | Individual blog article with rich content, author info, and related articles |

## 🎯 Purpose

These documents serve as:
- **Component blueprints** for the new UI implementation
- **Reference guides** for developers
- **Structure maps** showing complete component hierarchies
- **Data flow documentation** for Sanity CMS integration

## 📊 What's Included

Each document contains:

### ✅ Complete Component Hierarchy
- Full tree structure from top-level container to leaf components
- Parent-child relationships
- Component nesting levels
- All interactive elements

### ✅ Component Details
- Component names and purposes
- Props and state requirements
- Conditional rendering logic
- Responsive behavior breakpoints

### ✅ Data Sources
- Sanity CMS schema fields needed
- Medusa backend integration points
- State management requirements
- API endpoints

### ✅ Interactive Elements
- User actions and flows
- State changes
- Form submissions
- Navigation patterns

### ✅ SEO Considerations
- Missing meta tags
- Structured data requirements
- Open Graph recommendations
- Performance optimizations

## 🔍 How to Use

### For Developers:
1. **Choose a page** to implement
2. **Read the structure** from top to bottom
3. **Follow the hierarchy** to create components
4. **Check data sources** for API/CMS integration
5. **Implement responsive behavior** per breakpoints
6. **Add SEO elements** from recommendations

### For Designers:
1. **Review component layouts**
2. **Understand information hierarchy**
3. **Check responsive breakpoints**
4. **Design component states** (hover, active, loading)

### For Project Managers:
1. **Estimate scope** from component counts
2. **Plan sprints** by page complexity
3. **Track progress** by completed components
4. **Validate completeness** against structure docs

## 📐 Component Patterns

### Common Components Across Pages:

#### **Header** (All pages)
- Logo
- Navigation menu with mega dropdowns
- Search bar
- Contact button
- Cart icon
- Profile dropdown

#### **Footer** (All pages)
- Company info
- Quick links
- Social media
- Trust badges
- Copyright

#### **Breadcrumbs** (All content pages)
- Home link
- Current location trail
- SEO-friendly structure

#### **Cards** (Multiple variations)
- Product cards
- Course cards
- Blog cards
- Related content cards

### Responsive Breakpoints:

```
Mobile:    < 640px  (sm)
Tablet:    640-1024px  (md-lg)
Desktop:   > 1024px  (xl+)
```

## 🔗 Integration Notes

### Sanity CMS Schemas Required:

1. **home** (singleton) - Homepage content
2. **product** - Product catalog
3. **course** - Course catalog
4. **post** - Blog articles
5. **faq** - FAQ items
6. **author** - Blog authors
7. **collection** - Product collections

### Key Medusa Backend Endpoints:

- `/api/products/prices` - Real-time product pricing
- `/store/products` - Product catalog
- `/store/cart` - Shopping cart operations

### State Management:

- **Cart Context** - Global cart state
- **Auth Context** - User authentication
- **Theme Context** - Dark/light mode (if applicable)

## ⚡ Performance Considerations

### Optimization Priorities:

1. **Lazy load images** - Use Next.js Image component
2. **Code splitting** - Dynamic imports for heavy components
3. **API caching** - Cache product prices and CMS content
4. **Prefetch** - Prefetch links on hover
5. **Virtualization** - For long product lists

### Critical Rendering Path:

1. Header (above fold)
2. Hero section (above fold)
3. Primary content
4. Related content
5. Footer (below fold)

## 🎨 Design System Integration

### Colors (from existing):
- Primary: `#3092BE` (Blue)
- Success: Green
- Warning: Yellow
- Danger: Red
- Gray scale: 50-900

### Typography:
- Headings: Bold, gradient text effects
- Body: 16px base, 1.8 line-height
- RTL support: Full right-to-left layout

### Effects:
- Glassmorphism (backdrop-blur)
- Gradient backgrounds
- Shadow layers
- Smooth transitions (300ms)
- Hover scale effects (1.05)

## 📝 Implementation Checklist

### Before Starting:
- [ ] Review all 5 structure documents
- [ ] Set up Sanity CMS connection
- [ ] Configure Medusa backend
- [ ] Set up state management
- [ ] Configure routing

### During Development:
- [ ] Create reusable component library
- [ ] Implement responsive layouts
- [ ] Add proper TypeScript types
- [ ] Include accessibility attributes
- [ ] Test on multiple devices
- [ ] Optimize images and assets

### Before Launch:
- [ ] Add all SEO meta tags
- [ ] Implement structured data
- [ ] Test social sharing
- [ ] Verify breadcrumbs
- [ ] Check mobile experience
- [ ] Performance audit
- [ ] Security review

## 🚀 Next Steps

1. **Review each page structure** thoroughly
2. **Create component library** based on common patterns
3. **Set up data fetching** from Sanity and Medusa
4. **Build pages incrementally** starting with Home
5. **Test and iterate** on each page
6. **Optimize and polish** before launch

## 📞 Support

For questions or clarifications about these structures:
- Reference the original `sharifgpt-website` implementation
- Check Sanity schema files in `/schemas`
- Review existing component implementations

---

**Last Updated:** November 9, 2025  
**Version:** 1.0  
**Status:** Complete ✅






