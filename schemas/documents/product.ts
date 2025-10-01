import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name', maxLength: 96 }, validation: (Rule) => Rule.required() }),
    defineField({ name: 'description', title: 'Short Description', type: 'text', rows: 3 }),
    defineField({ name: 'longDescription', title: 'Long Description', type: 'text', rows: 8 }),
    defineField({ name: 'category', title: 'Category', type: 'string' }),
    defineField({ name: 'price', title: 'Price', type: 'number' }),
    defineField({ name: 'originalPrice', title: 'Original Price', type: 'number' }),
    defineField({ name: 'discountPercentage', title: 'Discount Percentage', type: 'number' }),
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'gallery', title: 'Gallery', type: 'array', of: [{ type: 'image' }] }),
    defineField({ name: 'features', title: 'Features', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'badges', title: 'Badges', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'inStock', title: 'In Stock', type: 'boolean', initialValue: true }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'category', media: 'image' },
  },
})


