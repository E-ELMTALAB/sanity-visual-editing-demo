import { HomeIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'home',
  title: 'Home',
  type: 'document',
  icon: HomeIcon,
  // Uncomment below to have edits publish automatically as you type
  // liveEdit: true,
  fields: [
    defineField({
      name: 'title',
      description: 'This field is the title of your personal website.',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
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
