import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'instructor',
  title: 'Instructor',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'social', title: 'Social & Contact' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // Basic Info
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'title',
      title: 'Professional Title',
      type: 'string',
      description: 'e.g., "دکترای هوش مصنوعی", "مدرس ارشد"',
      group: 'content',
    }),
    defineField({
      name: 'bio',
      title: 'Biography',
      type: 'text',
      rows: 5,
      description: 'Instructor biography and background',
      group: 'content',
    }),
    defineField({
      name: 'image',
      title: 'Profile Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          validation: (Rule) => Rule.required(),
        }),
      ],
      group: 'content',
    }),
    
    // Professional Info
    defineField({
      name: 'experience',
      title: 'Years of Experience',
      type: 'string',
      description: 'e.g., "10+ سال"',
      group: 'content',
    }),
    defineField({
      name: 'expertise',
      title: 'Areas of Expertise',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Specializations and skills',
      group: 'content',
    }),
    defineField({
      name: 'totalStudents',
      title: 'Total Students Taught',
      type: 'number',
      validation: (Rule) => Rule.min(0),
      group: 'content',
    }),
    defineField({
      name: 'totalCourses',
      title: 'Total Courses',
      type: 'number',
      validation: (Rule) => Rule.min(0),
      group: 'content',
    }),
    defineField({
      name: 'rating',
      title: 'Average Rating (0-5)',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(5),
      group: 'content',
    }),
    
    // Contact & Social
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      group: 'social',
    }),
    defineField({
      name: 'website',
      title: 'Personal Website',
      type: 'url',
      group: 'social',
    }),
    defineField({
      name: 'socialMedia',
      title: 'Social Media',
      type: 'object',
      group: 'social',
      fields: [
        defineField({
          name: 'linkedin',
          title: 'LinkedIn',
          type: 'url',
        }),
        defineField({
          name: 'twitter',
          title: 'Twitter/X',
          type: 'url',
        }),
        defineField({
          name: 'instagram',
          title: 'Instagram',
          type: 'url',
        }),
        defineField({
          name: 'github',
          title: 'GitHub',
          type: 'url',
        }),
        defineField({
          name: 'telegram',
          title: 'Telegram',
          type: 'url',
        }),
      ],
    }),
    
    // SEO
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
          validation: (Rule) => Rule.max(60).warning('Should be under 60 characters'),
        }),
        defineField({
          name: 'metaDescription',
          type: 'text',
          title: 'Meta Description',
          rows: 3,
          validation: (Rule) => Rule.max(160).warning('Should be under 160 characters'),
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'title',
      media: 'image',
      courses: 'totalCourses',
    },
    prepare({ title, subtitle, media, courses }) {
      return {
        title,
        subtitle: `${subtitle || 'Instructor'} | ${courses || 0} courses`,
        media,
      }
    },
  },
})



