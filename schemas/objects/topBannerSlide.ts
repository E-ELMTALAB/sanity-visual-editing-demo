import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'topBannerSlide',
  title: 'Top Banner Slide',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
    }),
    defineField({
      name: 'buttonHref',
      title: 'Button Link',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Background Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          description: 'SEO-friendly alt text for accessibility',
          validation: (Rule) => Rule.required(),
        }),
        defineField({ name: 'caption', type: 'string', title: 'Caption' }),
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      description: 'SEO settings for this banner slide',
      fields: [
        defineField({
          name: 'heading',
          type: 'string',
          title: 'SEO Heading',
          description: 'Heading tag for this slide (H1-H6)',
          options: {
            list: [
              { title: 'H1', value: 'h1' },
              { title: 'H2', value: 'h2' },
              { title: 'H3', value: 'h3' },
              { title: 'H4', value: 'h4' },
              { title: 'H5', value: 'h5' },
              { title: 'H6', value: 'h6' },
            ],
          },
          initialValue: 'h2',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      media: 'image',
    },
  },
})

