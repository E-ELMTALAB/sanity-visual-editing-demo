import { type PostListItemPayload, type PostPayload } from 'types'

const block = (text: string) => [{ _type: 'block', children: [{ _type: 'span', text }] }]

export const defaultPost: PostPayload = {
  title: 'Coming soon',
  slug: 'coming-soon',
  excerpt: block('Stay tuned for updates.'),
  coverImage: undefined,
  body: block('Content will arrive shortly.'),
  author: 'Editorial',
  publishedAt: new Date().toISOString(),
  tags: ['announcement'],
}

export const defaultPostList: PostListItemPayload[] = [
  {
    title: 'Welcome to the blog',
    slug: 'welcome',
    excerpt: block('Our latest updates will appear here.'),
    coverImage: undefined,
    tags: ['news'],
    publishedAt: new Date().toISOString(),
  },
]


