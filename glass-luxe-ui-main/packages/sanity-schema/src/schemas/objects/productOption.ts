import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'productOption',
  title: 'Product Option',
  type: 'object',
  fields: [
    defineField({ name: 'id', title: 'ID', type: 'string' }),
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'price', title: 'Price', type: 'number', validation: (Rule) => Rule.required() }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'price' },
    prepare({ title, subtitle }) {
      return { title, subtitle: subtitle ? `${subtitle} تومان` : '' }
    },
  },
})


