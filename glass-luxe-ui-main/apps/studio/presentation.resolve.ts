import { defineLocations } from 'sanity/presentation'

// Simplified href resolver for studio (matches web app routes)
function resolveHref(documentType?: string, slug?: string): string | undefined {
  switch (documentType) {
    case 'home':
      return '/'
    case 'page':
      return slug ? `/${slug}` : undefined
    case 'project':
      return slug ? `/projects/${slug}` : undefined
    case 'post':
      return slug ? `/blog/${slug}` : undefined
    case 'product':
      return slug ? `/products/${slug}` : undefined
    case 'course':
      return slug ? `/courses/${slug}` : undefined
    case 'collection':
      return slug ? `/collections/${slug}` : undefined
    default:
      console.warn('Invalid document type:', documentType)
      return undefined
  }
}

export const locations = {
  home: defineLocations({
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    resolve: (doc) => ({
      locations: [
        {
          title: doc.title || 'Home',
          href: resolveHref('home') || '/',
        },
      ],
    }),
  }),
  page: defineLocations({
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    resolve: (doc) => ({
      locations: doc.slug
        ? [
            {
              title: doc.title || 'Untitled',
              href: resolveHref('page', doc.slug) || `/${doc.slug}`,
            },
          ]
        : [],
    }),
  }),
  post: defineLocations({
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    resolve: (doc) => ({
      locations: doc.slug
        ? [
            {
              title: doc.title || 'Untitled',
              href: resolveHref('post', doc.slug) || `/blog/${doc.slug}`,
            },
          ]
        : [],
    }),
  }),
  product: defineLocations({
    select: {
      title: 'name',
      slug: 'slug.current',
    },
    resolve: (doc) => ({
      locations: doc.slug
        ? [
            {
              title: doc.title || 'Untitled',
              href: resolveHref('product', doc.slug) || `/products/${doc.slug}`,
            },
          ]
        : [],
    }),
  }),
  course: defineLocations({
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    resolve: (doc) => ({
      locations: doc.slug
        ? [
            {
              title: doc.title || 'Untitled',
              href: resolveHref('course', doc.slug) || `/courses/${doc.slug}`,
            },
          ]
        : [],
    }),
  }),
  collection: defineLocations({
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    resolve: (doc) => ({
      locations: doc.slug
        ? [
            {
              title: doc.title || 'Untitled',
              href: resolveHref('collection', doc.slug) || `/collections/${doc.slug}`,
            },
          ]
        : [],
    }),
  }),
}