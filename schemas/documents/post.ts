import { DocumentIcon, ImageIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
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
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
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


