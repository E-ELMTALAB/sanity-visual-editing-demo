import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'collection',
  title: 'Collection',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // Content Fields
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'key',
      title: 'Collection Key',
      type: 'string',
      description: 'Unique identifier for this collection (e.g., "chatbot-ai", "ai-tools")',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      description: 'Main heading displayed in the hero section',
      group: 'content',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
      rows: 3,
      description: 'Subtitle text displayed in the hero section',
      group: 'content',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      description: 'Hero background image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          description: 'Important for SEO and accessibility',
        }),
      ],
      group: 'content',
    }),
    defineField({
      name: 'faq',
      title: 'FAQ Section',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'answer',
              title: 'Answer',
              type: 'text',
              rows: 4,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'question',
              subtitle: 'answer',
            },
          },
        },
      ],
      group: 'content',
    }),

    // SEO Fields
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      group: 'seo',
      fields: [
        defineField({
          name: 'metaTitle',
          type: 'string',
          title: 'Meta Title',
          description: 'SEO title (recommended: 50-60 characters)',
          validation: (Rule) => Rule.max(60).warning('Should be under 60 characters for optimal display'),
        }),
        defineField({
          name: 'metaDescription',
          type: 'text',
          title: 'Meta Description',
          rows: 3,
          description: 'SEO description (recommended: 150-160 characters)',
          validation: (Rule) => Rule.max(160).warning('Should be under 160 characters for optimal display'),
        }),
        defineField({
          name: 'canonicalUrl',
          type: 'url',
          title: 'Canonical URL',
          description: 'The canonical URL for this collection (leave empty to use default)',
        }),
        defineField({
          name: 'robotsMeta',
          type: 'string',
          title: 'Meta Robots',
          options: {
            list: [
              { title: 'index, follow (default)', value: 'index,follow' },
              { title: 'noindex, nofollow', value: 'noindex,nofollow' },
              { title: 'index, nofollow', value: 'index,nofollow' },
              { title: 'noindex, follow', value: 'noindex,follow' },
            ],
          },
          initialValue: 'index,follow',
        }),
        defineField({
          name: 'openGraphTitle',
          title: 'Open Graph Title',
          type: 'string',
          description: 'Title for social media sharing (recommended: 40-60 characters)',
          validation: (Rule) => Rule.max(60).warning('Should be under 60 characters for optimal display'),
        }),
        defineField({
          name: 'openGraphDescription',
          title: 'Open Graph Description',
          type: 'text',
          rows: 3,
          description: 'Description for social media sharing (recommended: 150-160 characters)',
          validation: (Rule) => Rule.max(160).warning('Should be under 160 characters for optimal display'),
        }),
        defineField({
          name: 'openGraphImage',
          title: 'Open Graph Image',
          type: 'image',
          description: 'Image for social media sharing (recommended: 1200x630px). Leave empty to use cover image.',
          options: { hotspot: true },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'key',
      media: 'coverImage',
    },
  },
})
