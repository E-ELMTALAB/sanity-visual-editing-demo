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

    // Content Fields Group
    defineField({
      name: 'title',
      description: 'This field is the title of your personal website.',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'overview',
      description:
        'Used both for the <meta> description tag for SEO, and the personal website subheader.',
      title: 'Description',
      type: 'array',
      of: [
        // Paragraphs
        defineArrayMember({
          lists: [],
          marks: {
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'Url',
                  },
                ],
              },
            ],
            decorators: [
              {
                title: 'Italic',
                value: 'em',
              },
              {
                title: 'Strong',
                value: 'strong',
              },
            ],
          },
          styles: [],
          type: 'block',
        }),
      ],
      validation: (rule) => rule.max(155).required(),
      group: 'content',
    }),
    defineField({
      name: 'showcaseProjects',
      title: 'Showcase projects',
      description:
        'These are the projects that will appear first on your landing page.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'project' }],
        }),
      ],
      group: 'content',
    }),
    defineField({
      name: 'topBannerSlides',
      title: 'Top Banner Slides',
      description: 'Slides displayed in the top banner section (above main hero)',
      type: 'array',
      validation: (Rule) => Rule.max(5),
      of: [
        defineArrayMember({
          type: 'topBannerSlide',
        }),
      ],
      group: 'content',
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
      name: 'promoCards',
      title: 'Promo cards (side banners)',
      type: 'array',
      validation: (Rule) => Rule.max(2),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'promoCard',
          title: 'Card',
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
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title }) {
      return {
        subtitle: 'Home',
        title,
      }
    },
  },
})
