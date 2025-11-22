import { HomeIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'home',
  title: 'Home',
  type: 'document',
  icon: HomeIcon,
  // Uncomment below to have edits publish automatically as you type
  // liveEdit: true,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
    { name: 'settings', title: 'Settings' },
  ],
  fields: [
    // SEO Fields Group
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      group: 'seo',
      description: 'Homepage SEO optimization settings',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          description: 'SEO title for homepage (recommended: 50-60 characters)',
          validation: (Rule) => Rule.max(60).warning('Should be under 60 characters for optimal display')
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          description: 'SEO description for homepage (recommended: 150-160 characters)',
          validation: (Rule) => Rule.max(160).warning('Should be under 160 characters for optimal display')
        }),
        defineField({
          name: 'canonicalUrl',
          title: 'Canonical URL',
          type: 'url',
          description: 'Canonical URL for homepage (leave empty to use default)',
        }),
        defineField({
          name: 'robotsMeta',
          title: 'Meta Robots',
          type: 'string',
          options: {
            list: [
              { title: 'index, follow (default)', value: 'index,follow' },
              { title: 'noindex, nofollow', value: 'noindex,nofollow' },
              { title: 'index, nofollow', value: 'index,nofollow' },
              { title: 'noindex, follow', value: 'noindex,follow' }
            ]
          },
          initialValue: 'index,follow'
        }),
        defineField({
          name: 'structuredData',
          title: 'Structured Data (JSON-LD)',
          type: 'text',
          rows: 8,
          description: 'Add custom Schema.org structured data for homepage',
        }),
        defineField({
          name: 'openGraphTitle',
          title: 'Open Graph Title',
          type: 'string',
          description: 'Title for social media sharing (recommended: 60-90 characters)',
        }),
        defineField({
          name: 'openGraphDescription',
          title: 'Open Graph Description',
          type: 'text',
          rows: 2,
          description: 'Description for social media sharing (recommended: 100-200 characters)',
        }),
        defineField({
          name: 'openGraphImage',
          title: 'Open Graph Image',
          type: 'image',
          description: 'Image for social media sharing (recommended: 1200x630px)',
          options: { hotspot: true },
        }),
      ],
    }),

    defineField({
      name: 'heroSlides',
      title: 'Hero Slides (Main Slider)',
      description: 'Main hero slides displayed in the center section',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'heroSlide',
          title: 'Slide',
          fields: [
            defineField({ name: 'title', type: 'string', title: 'Title' }),
            defineField({ name: 'subtitle', type: 'string', title: 'Subtitle' }),
            defineField({ name: 'buttonText', type: 'string', title: 'Button text' }),
            defineField({ name: 'buttonHref', type: 'string', title: 'Button link (href)' }),
            defineField({ name: 'image', type: 'image', title: 'Image', options: { hotspot: true } }),
          ],
        }),
      ],
      group: 'content',
    }),
    defineField({
      name: 'discountedProducts',
      title: 'Discounted Products',
      description: 'Special offer products displayed in the "تخفیفات ویژه" section',
      type: 'array',
      validation: (Rule) => Rule.max(8),
      of: [
        defineArrayMember({
          type: 'discountedProduct',
        }),
      ],
      group: 'content',
    }),
    defineField({
      name: 'socialMediaProducts',
      title: 'Social Media Products',
      description: 'Popular social media subscriptions displayed in the "پرفروش‌ترین محصولات سوشیال مدیا" section',
      type: 'array',
      validation: (Rule) => Rule.max(10),
      of: [
        defineArrayMember({
          type: 'socialMediaProduct',
        }),
      ],
      group: 'content',
    }),
    defineField({
      name: 'educationalProducts',
      title: 'Educational Products',
      description: 'Educational subscriptions and courses displayed in the "پرفروش‌ترین محصولات آموزشی" section',
      type: 'array',
      validation: (Rule) => Rule.max(10),
      of: [
        defineArrayMember({
          type: 'educationalProduct',
        }),
      ],
      group: 'content',
    }),
    defineField({
      name: 'bestsellingCourses',
      title: 'Bestselling Courses',
      description: 'Top courses displayed in the "پرفروش‌ترین دوره‌ها" section',
      type: 'array',
      validation: (Rule) => Rule.max(6),
      of: [
        defineArrayMember({
          type: 'bestsellingCourse',
        }),
      ],
      group: 'content',
    }),
    defineField({
      name: 'magazinePosts',
      title: 'Magazine Featured Posts',
      description: 'Select blog posts to display in the SharifGPT Magazine section (max 3 posts)',
      type: 'array',
      validation: (Rule) => Rule.max(3),
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'post' }],
          options: {
            disableNew: true, // Only allow selecting existing blog posts
          }
        }),
      ],
      group: 'content',
    }),
    defineField({
      name: 'featuredBlogs',
      title: 'Featured Blog Posts',
      description: 'Select blog posts to display in the Featured Blogs section above social media (max 6 posts)',
      type: 'array',
      validation: (Rule) => Rule.max(6),
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'post' }],
          options: {
            disableNew: true, // Only allow selecting existing blog posts
          }
        }),
      ],
      group: 'content',
    }),
    // Best Seller Products (references to Product documents)
    defineField({
      name: 'bestSellerProducts',
      title: 'Best Seller Products',
      description: 'Select products to display in the Best Sellers section',
      type: 'array',
      validation: (Rule) => Rule.max(8),
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'product' }],
          options: {
            disableNew: true,
          }
        }),
      ],
      group: 'content',
    }),
    // Editorial Banners
    defineField({
      name: 'editorialBanners',
      title: 'Editorial Banners',
      description: 'Banner sections displayed in the homepage (max 3 banners)',
      type: 'array',
      validation: (Rule) => Rule.max(3),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'editorialBanner',
          title: 'Banner',
          fields: [
            defineField({ name: 'id', type: 'string', title: 'ID', validation: (Rule) => Rule.required() }),
            defineField({ name: 'title', type: 'string', title: 'Title', validation: (Rule) => Rule.required() }),
            defineField({ name: 'subtitle', type: 'string', title: 'Subtitle', validation: (Rule) => Rule.required() }),
            defineField({ name: 'ctaText', type: 'string', title: 'CTA Button Text', validation: (Rule) => Rule.required() }),
            defineField({ name: 'ctaLink', type: 'string', title: 'CTA Link (URL or route)', validation: (Rule) => Rule.required() }),
            defineField({ name: 'backgroundImage', type: 'image', title: 'Background Image', options: { hotspot: true }, validation: (Rule) => Rule.required() }),
            defineField({ name: 'order', type: 'number', title: 'Display Order', initialValue: 0 }),
          ],
        }),
      ],
      group: 'content',
    }),
    // Collections Banner
    defineField({
      name: 'collectionsBanner',
      title: 'Collections Banner',
      description: 'Banner promoting collections section',
      type: 'object',
      fields: [
        defineField({ name: 'title', type: 'string', title: 'Title' }),
        defineField({ name: 'subtitle', type: 'string', title: 'Subtitle' }),
        defineField({ name: 'image', type: 'image', title: 'Banner Image', options: { hotspot: true } }),
        defineField({ name: 'ctaText', type: 'string', title: 'CTA Button Text' }),
        defineField({ name: 'ctaLink', type: 'string', title: 'CTA Link (URL or route)' }),
        defineField({
          name: 'featuredCollection',
          title: 'Featured Collection',
          type: 'reference',
          to: [{ type: 'collection' }],
          options: {
            disableNew: true,
          }
        }),
      ],
      group: 'content',
    }),

    // SEO Content Section
    defineField({
      name: 'seoContent',
      title: 'SEO Content Section',
      description: 'Markdown content for SEO optimization (appears at bottom of homepage before footer)',
      type: 'text',
      rows: 20,
      group: 'content',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Homepage',
        subtitle: 'Home Content',
      }
    },
  },
})
