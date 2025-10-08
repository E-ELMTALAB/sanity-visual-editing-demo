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

export interface TopBannerSlide {
  _key?: string
  _type?: string
  title?: string
  subtitle?: string
  buttonText?: string
  buttonHref?: string
  image?: Image
}

export interface HeroSlide {
  _key?: string
  _type?: string
  title?: string
  subtitle?: string
  buttonText?: string
  buttonHref?: string
  image?: Image
}

export interface PromoCard {
  _key?: string
  _type?: string
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

export interface ProductDoc {
  _id?: string
  _key?: string
  _type?: string
  name?: string
  description?: string
  longDescription?: string
  category?: string
  collectionType?: string
  price?: number
  originalPrice?: number
  discountPercentage?: number
  image?: Image
  gallery?: Image[]
  features?: string[]
  badges?: string[]
  inStock?: boolean
  slug?: {
    current?: string
  }
  rating?: number
  reviewCount?: number
  tags?: string[]
  seo?: {
    metaTitle?: string
    metaDescription?: string
    canonicalUrl?: string
    robotsMeta?: string
    structuredData?: string
    mainHeadingTag?: string
    sectionHeadingTag?: string
  }
}

export interface PostListItemPayload {
  _id?: string
  title?: string
  slug?: string
  excerpt?: PortableTextBlock[]
  coverImage?: Image
  category?: string
  tags?: string[]
  publishedAt?: string
  author?: string
  rating?: number
  reviewCount?: number
}

export interface PostPayload extends PostListItemPayload {
  body?: PortableTextBlock[]
  seo?: {
    metaTitle?: string
    metaDescription?: string
    canonicalUrl?: string
    robotsMeta?: string
    openGraphTitle?: string
    openGraphDescription?: string
    openGraphImage?: Image
    structuredData?: string
  }
  relatedPosts?: PostListItemPayload[]
}

export interface FAQ {
  _id?: string
  _key?: string
  _type?: string
  question?: string
  answer?: string
  category?: string
  order?: number
  pageLocations?: string[]
  isActive?: boolean
  tags?: string[]
  seo?: {
    includeInStructuredData?: boolean
    keywords?: string[]
  }
}

export interface Lesson {
  title?: string
  duration?: string
  description?: string
  isPreview?: boolean
  videoUrl?: string
}

export interface SyllabusModule {
  title?: string
  description?: string
  duration?: string
  order?: number
  lessons?: Lesson[]
  isLocked?: boolean
}

export interface Instructor {
  _id?: string
  name?: string
  slug?: {
    current?: string
  }
  title?: string
  bio?: string
  image?: Image
  experience?: string
  expertise?: string[]
  totalStudents?: number
  totalCourses?: number
  rating?: number
  email?: string
  website?: string
  socialMedia?: {
    linkedin?: string
    twitter?: string
    instagram?: string
    github?: string
    telegram?: string
  }
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
}

export interface CoursePayload {
  _id?: string
  title?: string
  slug?: {
    current?: string
  }
  shortDescription?: string
  longDescription?: string
  price?: number
  originalPrice?: number
  discountPercentage?: number
  category?: string
  level?: string
  language?: string
  duration?: string
  totalSessions?: number
  rating?: number
  reviewCount?: number
  totalStudents?: number
  features?: string[]
  requirements?: string[]
  learningOutcomes?: string[]
  targetAudience?: string[]
  syllabus?: SyllabusModule[]
  featuredImage?: Image
  videoPreview?: string
  gallery?: Image[]
  isPublished?: boolean
  isFeatured?: boolean
  badge?: string
  instructor?: Instructor
  relatedCourses?: CoursePayload[]
  relatedPosts?: PostListItemPayload[]
  seo?: {
    metaTitle?: string
    metaDescription?: string
    canonicalUrl?: string
    robotsMeta?: string
    structuredData?: string
    keywords?: string[]
    openGraphTitle?: string
    openGraphDescription?: string
    openGraphImage?: Image
    mainHeadingTag?: string
    sectionHeadingTag?: string
  }
}

export interface CollectionFAQItem {
  question?: string
  answer?: string
}

export interface CollectionPayload {
  _id?: string
  _key?: string
  title?: string
  slug?: {
    current?: string
  }
  key?: string
  heroTitle?: string
  heroSubtitle?: string
  coverImage?: Image
  faq?: CollectionFAQItem[]
  seo?: {
    metaTitle?: string
    metaDescription?: string
    canonicalUrl?: string
    robotsMeta?: string
    openGraphTitle?: string
    openGraphDescription?: string
    openGraphImage?: Image
  }
}
