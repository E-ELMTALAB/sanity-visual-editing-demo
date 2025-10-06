import { defineField, defineType, defineArrayMember } from 'sanity'

export default defineType({
  name: 'syllabusModule',
  title: 'Syllabus Module',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Module Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Module Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'duration',
      title: 'Total Duration',
      type: 'string',
      description: 'e.g., "90 دقیقه" or "2 ساعت"',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which this module appears',
      initialValue: 0,
    }),
    defineField({
      name: 'lessons',
      title: 'Lessons',
      type: 'array',
      of: [defineArrayMember({ type: 'lesson' })],
    }),
    defineField({
      name: 'isLocked',
      title: 'Locked (Premium)',
      type: 'boolean',
      description: 'Is this module locked for premium users only?',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      duration: 'duration',
      lessonCount: 'lessons.length',
    },
    prepare({ title, duration, lessonCount }) {
      return {
        title,
        subtitle: `${duration || 'No duration'} | ${lessonCount || 0} lessons`,
      }
    },
  },
})


