import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'faq',
  title: 'FAQ (Frequently Asked Questions)',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
    { name: 'settings', title: 'Settings' },
  ],
  fields: [
    // Content Fields
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (Rule) => Rule.required().max(200),
      description: 'The question (max 200 characters for better readability)',
      group: 'content',
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
      description: 'The detailed answer to the question',
      group: 'content',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Optional category for grouping FAQs',
      options: {
        list: [
          { title: 'General', value: 'general' },
          { title: 'Payment', value: 'payment' },
          { title: 'Shipping', value: 'shipping' },
          { title: 'Account', value: 'account' },
          { title: 'Technical', value: 'technical' },
          { title: 'Products', value: 'products' },
          { title: 'Services', value: 'services' },
          { title: 'Other', value: 'other' },
        ],
      },
      group: 'content',
    }),

    // Settings - Page Location
    defineField({
      name: 'pageLocations',
      title: 'Show on Pages',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Select which page(s) this FAQ should appear on',
      validation: (Rule) => Rule.required().min(1),
      options: {
        list: [
          { title: 'Products Page', value: 'products' },
          { title: 'Courses Page', value: 'courses' },
          { title: 'Home Page', value: 'home' },
          { title: 'About Page', value: 'about' },
          { title: 'Contact Page', value: 'contact' },
          { title: 'Checkout Page', value: 'checkout' },
          { title: 'Cart Page', value: 'cart' },
          { title: 'Blog Page', value: 'blog' },
        ],
      },
      group: 'settings',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which this FAQ appears (lower numbers appear first)',
      initialValue: 0,
      group: 'settings',
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Toggle to show/hide this FAQ',
      initialValue: true,
      group: 'settings',
    }),

    // SEO Fields - Structured Data
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      group: 'seo',
      description: 'FAQ Schema.org structured data for rich snippets in search results',
      fields: [
        defineField({
          name: 'includeInStructuredData',
          title: 'Include in Structured Data',
          type: 'boolean',
          description: 'Include this FAQ in the page\'s FAQ Schema.org markup',
          initialValue: true,
        }),
        defineField({
          name: 'keywords',
          title: 'Keywords',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'Keywords related to this FAQ for better search optimization',
        }),
      ],
    }),
    
    // Metadata
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Tags for internal organization and filtering',
      group: 'settings',
    }),
  ],
  preview: {
    select: {
      title: 'question',
      subtitle: 'category',
      order: 'order',
      active: 'isActive',
    },
    prepare({ title, subtitle, order, active }) {
      return {
        title: title,
        subtitle: `${subtitle || 'No category'} | Order: ${order} | ${active ? '✓ Active' : '✗ Inactive'}`,
      }
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Question A-Z',
      name: 'questionAsc',
      by: [{ field: 'question', direction: 'asc' }],
    },
  ],
})
