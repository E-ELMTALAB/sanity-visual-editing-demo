import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'educationalProduct',
  title: 'Educational Product',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      initialValue: 'education',
      options: {
        list: [
          { title: 'Education', value: 'education' },
          { title: 'Online Courses', value: 'online-courses' },
          { title: 'Certification', value: 'certification' },
        ],
      },
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
      name: 'discountPercentage',
      title: 'Discount Percentage',
      type: 'number',
      description: 'Calculated or manually set',
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: 'image',
      title: 'Product Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'description',
      media: 'image',
    },
  },
})
