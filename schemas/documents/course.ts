import { defineField, defineType, defineArrayMember } from 'sanity'

export default defineType({
  name: 'course',
  title: 'Course',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'pricing', title: 'Pricing' },
    { name: 'details', title: 'Details' },
    { name: 'media', title: 'Media' },
    { name: 'seo', title: 'SEO' },
    { name: 'relations', title: 'Relations' },
  ],
  fields: [
    // Basic Content Fields
    defineField({
      name: 'title',
      title: 'Course Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      description: 'Brief course description (for cards and previews)',
      group: 'content',
    }),
    defineField({
      name: 'longDescription',
      title: 'Long Description',
      type: 'text',
      rows: 10,
      description: 'Detailed course description',
      group: 'content',
    }),
    
    // Heading Tag for SEO
    defineField({
      name: 'mainHeadingTag',
      title: 'Main Heading Tag',
      type: 'string',
      description: 'HTML heading tag for the course title (H1-H6)',
      options: {
        list: [
          { title: 'H1', value: 'h1' },
          { title: 'H2', value: 'h2' },
          { title: 'H3', value: 'h3' },
          { title: 'H4', value: 'h4' },
          { title: 'H5', value: 'h5' },
          { title: 'H6', value: 'h6' },
        ],
      },
      initialValue: 'h1',
      group: 'seo',
    }),
    defineField({
      name: 'sectionHeadingTag',
      title: 'Section Heading Tag',
      type: 'string',
      description: 'HTML heading tag for course sections (H2-H6)',
      options: {
        list: [
          { title: 'H2', value: 'h2' },
          { title: 'H3', value: 'h3' },
          { title: 'H4', value: 'h4' },
          { title: 'H5', value: 'h5' },
          { title: 'H6', value: 'h6' },
        ],
      },
      initialValue: 'h2',
      group: 'seo',
    }),
    
    // Pricing Fields
    defineField({
      name: 'price',
      title: 'Price (Toman)',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
      group: 'pricing',
    }),
    defineField({
      name: 'originalPrice',
      title: 'Original Price (Toman)',
      type: 'number',
      validation: (Rule) => Rule.positive(),
      description: 'Original price before discount',
      group: 'pricing',
    }),
    defineField({
      name: 'discountPercentage',
      title: 'Discount Percentage',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(100),
      description: 'Calculated automatically or set manually',
      group: 'pricing',
    }),
    
    // Course Details
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'هوش مصنوعی', value: 'ai' },
          { title: 'برنامه‌نویسی', value: 'programming' },
          { title: 'طراحی', value: 'design' },
          { title: 'بازاریابی', value: 'marketing' },
          { title: 'کسب و کار', value: 'business' },
          { title: 'توسعه وب', value: 'web-development' },
          { title: 'داده و تحلیل', value: 'data-science' },
        ],
      },
      group: 'details',
    }),
    defineField({
      name: 'level',
      title: 'Course Level',
      type: 'string',
      options: {
        list: [
          { title: 'مقدماتی', value: 'beginner' },
          { title: 'متوسط', value: 'intermediate' },
          { title: 'پیشرفته', value: 'advanced' },
          { title: 'مقدماتی تا پیشرفته', value: 'all-levels' },
        ],
      },
      group: 'details',
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      options: {
        list: [
          { title: 'فارسی', value: 'persian' },
          { title: 'انگلیسی', value: 'english' },
          { title: 'دوزبانه', value: 'bilingual' },
        ],
      },
      initialValue: 'persian',
      group: 'details',
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      description: 'e.g., "12 ساعت" or "40 ساعت"',
      group: 'details',
    }),
    defineField({
      name: 'totalSessions',
      title: 'Total Sessions',
      type: 'number',
      description: 'Number of video sessions/lessons',
      group: 'details',
    }),
    defineField({
      name: 'rating',
      title: 'Rating (0-5)',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(5),
      group: 'details',
    }),
    defineField({
      name: 'reviewCount',
      title: 'Number of Reviews',
      type: 'number',
      validation: (Rule) => Rule.min(0),
      group: 'details',
    }),
    defineField({
      name: 'totalStudents',
      title: 'Total Students Enrolled',
      type: 'number',
      validation: (Rule) => Rule.min(0),
      group: 'details',
    }),
    
    // Course Content Arrays
    defineField({
      name: 'features',
      title: 'Course Features',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Key benefits and features of the course',
      group: 'content',
    }),
    defineField({
      name: 'requirements',
      title: 'Requirements',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Prerequisites and requirements for the course',
      group: 'content',
    }),
    defineField({
      name: 'learningOutcomes',
      title: 'Learning Outcomes',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'What students will learn from this course',
      group: 'content',
    }),
    defineField({
      name: 'targetAudience',
      title: 'Target Audience',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Who this course is for',
      group: 'content',
    }),
    
    // Syllabus
    defineField({
      name: 'syllabus',
      title: 'Course Syllabus',
      type: 'array',
      of: [defineArrayMember({ type: 'syllabusModule' })],
      description: 'Course curriculum and modules',
      group: 'content',
    }),
    
    // Media Fields
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          description: 'SEO-friendly alt text',
          validation: (Rule) => Rule.required(),
        }),
        defineField({ name: 'caption', type: 'string', title: 'Caption' }),
      ],
      group: 'media',
    }),
    defineField({
      name: 'videoPreview',
      title: 'Preview Video URL',
      type: 'url',
      description: 'Course introduction/preview video',
      group: 'media',
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', type: 'string', title: 'Alt Text' }),
            defineField({ name: 'caption', type: 'string', title: 'Caption' }),
          ],
        },
      ],
      group: 'media',
    }),
    
    // Status & Display
    defineField({
      name: 'isPublished',
      title: 'Published',
      type: 'boolean',
      description: 'Is this course visible to users?',
      initialValue: true,
      group: 'details',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured Course',
      type: 'boolean',
      description: 'Display as featured course',
      initialValue: false,
      group: 'details',
    }),
    defineField({
      name: 'badge',
      title: 'Badge',
      type: 'string',
      options: {
        list: [
          { title: 'پرفروش', value: 'bestseller' },
          { title: 'جدید', value: 'new' },
          { title: 'محبوب', value: 'popular' },
          { title: 'پیشنهاد ویژه', value: 'special-offer' },
        ],
      },
      group: 'details',
    }),
    
    // Relations
    defineField({
      name: 'instructor',
      title: 'Instructor',
      type: 'reference',
      to: [{ type: 'instructor' }],
      description: 'Course instructor',
      group: 'relations',
    }),
    defineField({
      name: 'relatedCourses',
      title: 'Related Courses',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'course' }],
        }),
      ],
      description: 'Courses to recommend on this course page',
      group: 'relations',
    }),
    defineField({
      name: 'relatedPosts',
      title: 'Related Blog Posts',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'post' }],
        }),
      ],
      description: 'Related blog articles',
      group: 'relations',
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
          validation: (Rule) => Rule.max(60).warning('Should be under 60 characters'),
        }),
        defineField({
          name: 'metaDescription',
          type: 'text',
          title: 'Meta Description',
          rows: 3,
          description: 'SEO description (recommended: 150-160 characters)',
          validation: (Rule) => Rule.max(160).warning('Should be under 160 characters'),
        }),
        defineField({
          name: 'canonicalUrl',
          type: 'url',
          title: 'Canonical URL',
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
              { title: 'noindex, follow', value: 'noindex,follow' },
            ],
          },
          initialValue: 'index,follow',
        }),
        defineField({
          name: 'structuredData',
          title: 'Structured Data (JSON-LD)',
          type: 'text',
          rows: 8,
          description: 'Custom Course Schema.org structured data',
        }),
        defineField({
          name: 'keywords',
          type: 'array',
          of: [{ type: 'string' }],
          title: 'SEO Keywords',
        }),
        defineField({
          name: 'openGraphTitle',
          title: 'Open Graph Title',
          type: 'string',
        }),
        defineField({
          name: 'openGraphDescription',
          title: 'Open Graph Description',
          type: 'text',
          rows: 2,
        }),
        defineField({
          name: 'openGraphImage',
          title: 'Open Graph Image',
          type: 'image',
          description: 'Image for social media sharing (1200x630px)',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'featuredImage',
      instructor: 'instructor.name',
    },
    prepare({ title, subtitle, media, instructor }) {
      return {
        title,
        subtitle: `${subtitle || 'No category'} | ${instructor || 'No instructor'}`,
        media,
      }
    },
  },
})
