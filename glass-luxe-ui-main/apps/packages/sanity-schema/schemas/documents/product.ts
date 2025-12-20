import { defineField, defineType } from 'sanity'
import productOption from '../objects/productOption'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
    { name: 'media', title: 'Media' },
    { name: 'relations', title: 'Relations' },
  ],
  fields: [
    // Content Fields
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'content'
    }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name', maxLength: 96 }, validation: (Rule) => Rule.required(), group: 'content' }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 8,
      group: 'content'
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      description: 'Concise Persian summary used for marketing copy or product listings.',
      group: 'content',
    }),
    
    defineField({ name: 'category', title: 'Category', type: 'string', group: 'content' }),
    defineField({ 
      name: 'collectionType', 
      title: 'Collection Type', 
      type: 'string',
      description: 'Collection key this product belongs to (e.g., "chatbot-ai", "ai-tools"). Leave empty if not part of a collection.',
      group: 'content'
    }),
    
    
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'content'
    }),
    defineField({ name: 'badges', title: 'Badges', type: 'array', of: [{ type: 'string' }], group: 'content' }),
    
    
    defineField({ name: 'rating', title: 'Rating (0-5)', type: 'number', group: 'content' }),
    defineField({ name: 'reviewCount', title: 'Review Count', type: 'number', group: 'content' }),
    
    // NOTE: Product options are now managed as variants in Medusa
    defineField({ 
      name: 'options', 
      title: 'Purchase Options (Legacy)', 
      type: 'array', 
      of: [{ type: productOption.name }], 
      group: 'content',
      description: '⚠️ Product options are now managed as variants in Medusa. This field is for backward compatibility only.',
      hidden: true,
    }),
    
    // Media Fields
    defineField({ 
      name: 'image', 
      title: 'Featured Image', 
      type: 'image', 
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Alt Text', description: 'Important for SEO and accessibility' }),
        defineField({ name: 'caption', type: 'string', title: 'Caption' }),
      ],
      group: 'media' 
    }),
    
    // Relations
    defineField({
      name: 'relatedProducts',
      title: 'Related Products',
      type: 'array',
      of: [{
        type: 'reference',
        to: [{ type: 'product' }],
        options: { disableNew: true }
      }],
      description: 'Select related products to display on this product page',
      group: 'relations'
    }),
    defineField({
      name: 'relatedBlogs',
      title: 'Related Blog Posts',
      type: 'array',
      of: [{
        type: 'reference',
        to: [{ type: 'post' }],
        options: { disableNew: true }
      }],
      description: 'Select related blog posts to display on this product page',
      group: 'relations'
    }),
    defineField({
      name: 'faqs',
      title: 'Product FAQs',
      type: 'array',
      of: [{
        type: 'object',
        name: 'faq',
        title: 'FAQ',
        fields: [
          defineField({
            name: 'question',
            title: 'Question',
            type: 'string',
            validation: (Rule) => Rule.required().max(200),
            description: 'The question (max 200 characters for better readability)',
          }),
          defineField({
            name: 'answer',
            title: 'Answer',
            type: 'text',
            rows: 4,
            validation: (Rule) => Rule.required(),
            description: 'The detailed answer to the question',
          }),
          defineField({
            name: 'isActive',
            title: 'Active',
            type: 'boolean',
            description: 'Toggle to show/hide this FAQ',
            initialValue: true,
          }),
          defineField({
            name: 'order',
            title: 'Display Order',
            type: 'number',
            description: 'Order in which this FAQ appears (lower numbers appear first)',
            initialValue: 0,
          }),
        ],
        preview: {
          select: {
            title: 'question',
            active: 'isActive',
            order: 'order',
          },
          prepare({ title, active, order }) {
            return {
              title: title || 'Untitled FAQ',
              subtitle: `Order: ${order} | ${active ? '✓ Active' : '✗ Inactive'}`,
            }
          },
        },
      }],
      description: 'Product-specific frequently asked questions that will appear on this product page',
      group: 'content'
    }),


    // SEO Fields
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      description: 'AI generated SEO title (recommended: 50-60 characters).',
      validation: (Rule) => Rule.max(60).warning('Should be under 60 characters for optimal display'),
      group: 'seo',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 3,
      description: 'AI generated meta description (recommended: 130-150 characters).',
      validation: (Rule) => Rule.max(160).warning('Should be under 160 characters for optimal display'),
      group: 'seo',
    }),
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      group: 'seo',
      fields: [
        defineField({
          name: 'metaTitle',
          type: 'string',
          title: 'Meta Title',
          description: 'SEO title (recommended: 50-60 characters)',
          validation: (Rule) => Rule.max(60).warning('Should be under 60 characters for optimal display')
        }),
        defineField({
          name: 'metaDescription',
          type: 'text',
          title: 'Meta Description',
          rows: 3,
          description: 'SEO description (recommended: 150-160 characters)',
          validation: (Rule) => Rule.max(160).warning('Should be under 160 characters for optimal display')
        }),
        defineField({ 
          name: 'canonicalUrl', 
          type: 'url', 
          title: 'Canonical URL',
          description: 'The canonical URL for this product (leave empty to use default)' 
        }),
        defineField({ 
          name: 'robotsMeta', 
          type: 'string', 
          title: 'Meta Robots', 
          options: { 
            list: [
              { title: 'index, follow (default)', value: 'index,follow' },
              { title: 'noindex, nofollow', value: 'noindex,nofollow' },
              { title: 'index, nofollow', value: 'index,nofollow' },
              { title: 'noindex, follow', value: 'noindex,follow' }
            ]
          },
          initialValue: 'index,follow'
        }),
        defineField({
          name: 'structuredData',
          title: 'Structured Data (JSON-LD)',
          type: 'text',
          rows: 8,
          description: 'Add custom Schema.org structured data for rich snippets (Product schema)',
        }),
        defineField({
          name: 'openGraphTitle',
          title: 'Open Graph Title',
          type: 'string',
          description: 'Title for social media sharing (recommended: 40-60 characters)',
          validation: (Rule) => Rule.max(60).warning('Should be under 60 characters for optimal display')
        }),
        defineField({
          name: 'openGraphDescription',
          title: 'Open Graph Description',
          type: 'text',
          rows: 3,
          description: 'Description for social media sharing (recommended: 150-160 characters)',
          validation: (Rule) => Rule.max(160).warning('Should be under 160 characters for optimal display')
        }),
        defineField({
          name: 'openGraphImage',
          title: 'Open Graph Image',
          type: 'image',
          description: 'Image for social media sharing (recommended: 1200x630px). Leave empty to use featured image.',
          options: { hotspot: true },
        }),
      ],
    }),
    
    // Tags for taxonomy
    defineField({ 
      name: 'tags', 
      title: 'Tags', 
      type: 'array', 
      of: [{ type: 'string' }],
      description: 'Tags for better categorization and SEO',
      group: 'seo'
    }),
    defineField({
      name: 'aiEnriched',
      title: 'AI Enriched',
      type: 'boolean',
      description: 'Set by the AI enrichment pipeline to avoid duplicate processing.',
      readOnly: true,
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
      media: 'image',
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle,
        media,
      }
    },
  },
})


