import { defineLocations } from 'sanity/presentation'
import { resolveHref } from './sanity.links'

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