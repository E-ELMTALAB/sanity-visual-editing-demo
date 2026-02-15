
import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({name: 'author', title: 'Author', type: 'string'}),
    defineField({name: 'role', title: 'Role/Company', type: 'string'}),
    defineField({name: 'quote', title: 'Quote', type: 'text'}),
    defineField({name: 'avatar', title: 'Avatar', type: 'image'}),
  ],
})
