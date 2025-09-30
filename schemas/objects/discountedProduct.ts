import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'discountedProduct',
  title: 'Discounted Product',
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
      options: {
        list: [
          { title: 'Applied AI', value: 'applied-ai' },
          { title: 'Text to Image', value: 'text-to-image' },
          { title: 'Programming AI', value: 'programming-ai' },
          { title: 'Text to Audio', value: 'text-to-audio' },
          { title: 'Social Media', value: 'social-media' },
          { title: 'Education', value: 'education' },
        ],
      },
    }),
    defineField({
      name: 'originalPrice',
      title: 'Original Price (Toman)',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'discountedPrice',
      title: 'Discounted Price (Toman)',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'discountPercentage',
      title: 'Discount Percentage',
      type: 'number',
      description: 'Calculated automatically or manually set',
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
