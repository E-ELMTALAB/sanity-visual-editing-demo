import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'discountedProduct',
  title: 'Discounted Product',
  type: 'object',
  fields: [
    defineField({ name: 'title', type: 'string', title: 'Title' }),
    defineField({ name: 'description', type: 'string', title: 'Description' }),
    defineField({ name: 'price', type: 'number', title: 'Price' }),
    defineField({ name: 'originalPrice', type: 'number', title: 'Original price' }),
    defineField({ name: 'discountPercentage', type: 'number', title: 'Discount (%)' }),
    defineField({ name: 'image', type: 'image', title: 'Image', options: { hotspot: true } }),
    defineField({ name: 'ctaText', type: 'string', title: 'Button text' }),
    defineField({ name: 'ctaHref', type: 'string', title: 'Button link (href)' }),
  ],
})


