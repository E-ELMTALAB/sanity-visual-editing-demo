import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'bestsellingCourse',
  title: 'Bestselling Course',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Course Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'price',
      title: 'Price (Toman)',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'originalPrice',
      title: 'Original Price (Toman)',
      type: 'number',
      validation: (Rule) => Rule.positive(),
    }),
    defineField({
      name: 'instructor',
      title: 'Instructor Name',
      type: 'string',
    }),
    defineField({
      name: 'duration',
      title: 'Duration (e.g., "40 ساعت")',
      type: 'string',
    }),
    defineField({
      name: 'students',
      title: 'Number of Students',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'rating',
      title: 'Rating (0-5)',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(5),
    }),
    defineField({
      name: 'reviewCount',
      title: 'Number of Reviews',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'AI Fundamentals', value: 'ai-fundamentals' },
          { title: 'Web Development', value: 'web-development' },
          { title: 'Programming', value: 'programming' },
          { title: 'Data Science', value: 'data-science' },
          { title: 'Design', value: 'design' },
        ],
      },
    }),
    defineField({
      name: 'level',
      title: 'Course Level',
      type: 'string',
      options: {
        list: [
          { title: 'مقدماتی', value: 'beginner' },
          { title: 'متوسط', value: 'intermediate' },
          { title: 'پیشرفته', value: 'advanced' },
          { title: 'مقدماتی تا متوسط', value: 'beginner-intermediate' },
          { title: 'مقدماتی تا پیشرفته', value: 'beginner-advanced' },
        ],
      },
    }),
    defineField({
      name: 'image',
      title: 'Course Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'instructor',
      media: 'image',
    },
  },
})
