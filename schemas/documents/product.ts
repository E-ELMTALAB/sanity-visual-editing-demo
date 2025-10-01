import { defineField, defineType } from 'sanity'
import productOption from 'schemas/objects/productOption'

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
    defineField({
      name: 'relatedProducts',
      title: 'Related Products',
      type: 'array',
      of: [{
        type: 'reference',
        to: [{ type: 'product' }],
        options: {
          disableNew: true, // Only allow selecting existing products
        }
      }],
      description: 'Select related products to display on this product page'
    }),
    defineField({
      name: 'relatedBlogs',
      title: 'Related Blog Posts',
      type: 'array',
      of: [{
        type: 'reference',
        to: [{ type: 'post' }],
        options: {
          disableNew: true, // Only allow selecting existing blog posts
        }
      }],
      description: 'Select related blog posts to display on this product page'
    }),
    defineField({ name: 'rating', title: 'Rating (0-5)', type: 'number' }),
    defineField({ name: 'reviewCount', title: 'Review Count', type: 'number' }),
    defineField({ name: 'options', title: 'Purchase Options', type: 'array', of: [{ type: productOption.name }] }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'category', media: 'image' },
  },
})


