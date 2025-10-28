import { defineField, defineType } from 'sanity'
import productOption from '../schemas/objects/productOption'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
    { name: 'media', title: 'Media' },
    { name: 'relations', title: 'Relations' },
    { name: 'sync', title: 'Medusa Sync' },
  ],
  fields: [
    // Content Fields
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required(), group: 'content' }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name', maxLength: 96 }, validation: (Rule) => Rule.required(), group: 'content' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 8, group: 'content' }),
    
    defineField({ name: 'category', title: 'Category', type: 'string', group: 'content' }),
    defineField({ 
      name: 'collectionType', 
      title: 'Collection Type', 
      type: 'string',
      description: 'Collection key this product belongs to (e.g., "chatbot-ai", "ai-tools"). Leave empty if not part of a collection.',
      group: 'content'
    }),
    
    // Pricing Fields - Synced to Medusa
    defineField({ 
      name: 'price', 
      title: 'Price (USD)', 
      type: 'number', 
      group: 'content',
      description: 'Current selling price in USD. This will be synced to Medusa backend.',
      validation: (Rule) => Rule.min(0).precision(2),
    }),
    defineField({ 
      name: 'originalPrice', 
      title: 'Original Price (USD)', 
      type: 'number', 
      group: 'content',
      description: 'Original price before discount in USD (optional). Used to show price comparison.',
      validation: (Rule) => Rule.min(0).precision(2),
    }),
    defineField({ 
      name: 'discountPercentage', 
      title: 'Discount Percentage', 
      type: 'number', 
      group: 'content',
      description: 'Discount percentage (0-100). Auto-calculated from price and originalPrice, or set manually.',
      validation: (Rule) => Rule.min(0).max(100),
    }),
    
    defineField({ name: 'features', title: 'Features', type: 'array', of: [{ type: 'string' }], group: 'content' }),
    defineField({ name: 'badges', title: 'Badges', type: 'array', of: [{ type: 'string' }], group: 'content' }),
    
    // NOTE: Stock status is now managed in Medusa
    defineField({ 
      name: 'inStock', 
      title: 'In Stock (Display Only)', 
      type: 'boolean', 
      initialValue: true, 
      group: 'content',
      description: '⚠️ This is for display only. Actual inventory is managed in Medusa backend.',
      readOnly: true,
    }),
    
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
    defineField({ 
      name: 'gallery', 
      title: 'Gallery', 
      type: 'array', 
      of: [{ 
        type: 'image',
        fields: [
          defineField({ name: 'alt', type: 'string', title: 'Alt Text' }),
          defineField({ name: 'caption', type: 'string', title: 'Caption' }),
        ],
      }],
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

    // Medusa Sync Fields
    defineField({
      name: 'medusaProductId',
      title: 'Medusa Product ID',
      type: 'string',
      description: 'Auto-generated: Product ID in Medusa backend',
      readOnly: true,
      group: 'sync',
    }),
    defineField({
      name: 'lastSyncedAt',
      title: 'Last Synced',
      type: 'datetime',
      description: 'Last time this product was synced with Medusa',
      readOnly: true,
      group: 'sync',
    }),
    defineField({
      name: 'syncStatus',
      title: 'Sync Status',
      type: 'string',
      options: {
        list: [
          { title: 'Not Synced', value: 'not_synced' },
          { title: 'Synced', value: 'synced' },
          { title: 'Outdated', value: 'outdated' },
          { title: 'Error', value: 'error' },
        ],
      },
      description: 'Current sync status with Medusa',
      readOnly: true,
      group: 'sync',
      initialValue: 'not_synced',
    }),

    // SEO Fields
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
  ],
  preview: {
    select: { 
      title: 'name', 
      subtitle: 'category', 
      media: 'image',
      syncStatus: 'syncStatus',
      medusaProductId: 'medusaProductId',
    },
    prepare({ title, subtitle, media, syncStatus, medusaProductId }) {
      const syncEmoji = {
        synced: '✅',
        not_synced: '⚠️',
        outdated: '🔄',
        error: '❌',
      }[syncStatus || 'not_synced']

      return {
        title: `${syncEmoji} ${title}`,
        subtitle: medusaProductId 
          ? `${subtitle} • Synced to Medusa` 
          : `${subtitle} • Not synced`,
        media,
      }
    },
  },
})


