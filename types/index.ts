import type { PortableTextBlock } from '@portabletext/types'
import type { Image } from 'sanity'

export interface MenuItem {
  _type: string
  slug?: string
  title?: string
}

export interface MilestoneItem {
  description?: string
  duration?: {
    start?: string
    end?: string
  }
  image?: Image
  tags?: string[]
  title?: string
}

export interface ShowcaseProject {
  _type: string
  coverImage?: Image
  overview?: PortableTextBlock[]
  slug?: string
  tags?: string[]
  title?: string
}

// Page payloads

export interface HomePagePayload {
  footer?: PortableTextBlock[]
  overview?: PortableTextBlock[]
  showcaseProjects?: ShowcaseProject[]
  title?: string
}

export interface PagePayload {
  body?: PortableTextBlock[]
  name?: string
  overview?: PortableTextBlock[]
  title?: string
  slug?: string
}

export interface ProjectPayload {
  client?: string
  coverImage?: Image
  description?: PortableTextBlock[]
  duration?: {
    start?: string
    end?: string
  }
  overview?: PortableTextBlock[]
  site?: string
  slug: string
  tags?: string[]
  title?: string
}

export interface SettingsPayload {
  footer?: PortableTextBlock[]
  menuItems?: MenuItem[]
  ogImage?: Image
}

export interface HeroSlide {
  title?: string
  subtitle?: string
  buttonText?: string
  buttonHref?: string
  image?: Image
}

export interface PromoCard {
  title?: string
  subtitle?: string
  buttonText?: string
  buttonHref?: string
  image?: Image
}

export interface DiscountedProduct {
  _key?: string
  _type?: string
  name?: string
  description?: string
  category?: string
  originalPrice?: number
  discountedPrice?: number
  discountPercentage?: number
  image?: Image
  slug?: string
}

export interface SocialMediaProduct {
  _key?: string
  _type?: string
  name?: string
  description?: string
  category?: string
  price?: number
  originalPrice?: number
  discountPercentage?: number
  image?: Image
  slug?: string
}

export interface EducationalProduct {
  _key?: string
  _type?: string
  name?: string
  description?: string
  category?: string
  price?: number
  originalPrice?: number
  discountPercentage?: number
  image?: Image
  slug?: string
}

export interface BestsellingCourse {
  _key?: string
  _type?: string
  title?: string
  description?: string
  price?: number
  originalPrice?: number
  instructor?: string
  duration?: string
  students?: number
  rating?: number
  reviewCount?: number
  category?: string
  level?: string
  image?: Image
  slug?: string
}

export interface PostListItemPayload {
  _id?: string
  title?: string
  slug?: string
  excerpt?: PortableTextBlock[]
  coverImage?: Image
  tags?: string[]
  publishedAt?: string
}

export interface PostPayload extends PostListItemPayload {
  author?: string
  body?: PortableTextBlock[]
}
