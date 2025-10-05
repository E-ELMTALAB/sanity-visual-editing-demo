import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'lesson',
  title: 'Lesson',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Lesson Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      description: 'e.g., "15 دقیقه"',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'isPreview',
      title: 'Free Preview',
      type: 'boolean',
      description: 'Can users preview this lesson for free?',
      initialValue: false,
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description: 'Link to video content',
    }),
    defineField({
      name: 'resources',
      title: 'Resources',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              type: 'string',
              title: 'Resource Title',
            }),
            defineField({
              name: 'file',
              type: 'file',
              title: 'File',
            }),
            defineField({
              name: 'url',
              type: 'url',
              title: 'External URL',
            }),
          ],
        },
      ],
      description: 'Downloadable resources for this lesson',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      duration: 'duration',
      isPreview: 'isPreview',
    },
    prepare({ title, duration, isPreview }) {
      return {
        title,
        subtitle: `${duration || 'No duration'}${isPreview ? ' • Free Preview' : ''}`,
      }
    },
  },
})
