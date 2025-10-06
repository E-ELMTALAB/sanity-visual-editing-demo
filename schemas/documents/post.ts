import { DocumentIcon, ImageIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
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
      validation: (rule) => rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      description:
        'Short summary used for list views and meta description. Aim for ~155 chars.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          lists: [],
          styles: [],
          marks: {
            annotations: [],
            decorators: [
              { title: 'Italic', value: 'em' },
              { title: 'Strong', value: 'strong' },
            ],
          },
        }),
      ],
      validation: (rule) => rule.max(155),
      group: 'content',
    }),
    
    // Heading Tag for SEO
    defineField({
      name: 'mainHeadingTag',
      title: 'Main Heading Tag',
      type: 'string',
      description: 'HTML heading tag for the post title (H1-H6)',
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
      initialValue: 'h1',
      group: 'seo',
    }),
    defineField({
      name: 'sectionHeadingTag',
      title: 'Section Heading Tag',
      type: 'string',
      description: 'HTML heading tag for post sections (H2-H6)',
      options: {
        list: [
          { title: 'H2', value: 'h2' },
          { title: 'H3', value: 'h3' },
          { title: 'H4', value: 'h4' },
          { title: 'H5', value: 'h5' },
          { title: 'H6', value: 'h6' },
        ],
      },
      initialValue: 'h2',
      group: 'seo',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Alt text' }),
        defineField({ name: 'caption', type: 'string', title: 'Caption' }),
      ],
      group: 'content',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      group: 'content',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      group: 'content',
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      description: 'Rating out of 5 (e.g., 4.5)',
      validation: (rule) => rule.min(0).max(5),
      group: 'content',
    }),
    defineField({
      name: 'reviewCount',
      title: 'Review Count',
      type: 'number',
      description: 'Number of reviews or views',
      validation: (rule) => rule.min(0),
      group: 'content',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          marks: {
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  { name: 'href', type: 'url', title: 'Url' },
                ],
              },
            ],
          },
          styles: [],
        }),
        defineArrayMember({
          type: 'image',
          icon: ImageIcon,
          name: 'image',
          title: 'Image',
          options: { hotspot: true },
          preview: { select: { imageUrl: 'asset.url', title: 'caption' } },
          fields: [
            defineField({ name: 'caption', type: 'string', title: 'Caption' }),
            defineField({ name: 'alt', type: 'string', title: 'Alt text' }),
          ],
        }),
        defineField({ type: 'youtube' as any }),
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
          title: 'Meta Title',
          type: 'string',
          description: 'SEO title for this post (recommended: 50-60 characters). Leave empty to use post title.',
          validation: (Rule) => Rule.max(60).warning('Should be under 60 characters for optimal display'),
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          description: 'SEO description for this post (recommended: 150-160 characters). Leave empty to use excerpt.',
          validation: (Rule) => Rule.max(160).warning('Should be under 160 characters for optimal display'),
        }),
        defineField({
          name: 'canonicalUrl',
          title: 'Canonical URL',
          type: 'url',
          description: 'The canonical URL for this post (leave empty to use default)',
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
              { title: 'noindex, follow', value: 'noindex,follow' },
            ],
          },
          initialValue: 'index,follow',
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
          description: 'Image for social media sharing (recommended: 1200x630px). Leave empty to use cover image.',
          options: { hotspot: true },
        }),
        defineField({
          name: 'structuredData',
          title: 'Structured Data (JSON-LD)',
          type: 'text',
          rows: 8,
          description: 'Add custom Schema.org structured data for rich snippets (Article schema)',
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title', author: 'author' },
    prepare({ title, author }) {
      return {
        title: title,
        subtitle: author ? `Post by ${author}` : 'Post',
      }
    },
  },
})


