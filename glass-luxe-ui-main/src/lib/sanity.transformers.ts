import { getImageUrl } from './sanity.image'

function slugifyValue(value?: string) {
  if (!value) return ''
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

function portableTextToPlainText(blocks: any): string {
  if (!Array.isArray(blocks)) return ''

  return blocks
    .map((block: any) => {
      if (block?._type !== 'block' || !Array.isArray(block?.children)) {
        return ''
      }
      return block.children.map((child: any) => child?.text || '').join('')
    })
    .join(' ')
    .trim()
}

export function transformProductListItem(product: any, index: number) {
  const price = typeof product?.price === 'number' ? product.price : 0
  const oldPrice = typeof product?.originalPrice === 'number' ? product.originalPrice : undefined
  const discountPctFromField = typeof product?.discountPercentage === 'number' ? product.discountPercentage : undefined
  const calculatedDiscount =
    !discountPctFromField && oldPrice && price
      ? Math.max(0, Math.round(((oldPrice - price) / oldPrice) * 100))
      : undefined

  return {
    id: product?._id || `product-${index}`,
    slug: product?.slug || product?.slug?.current || '',
    title: product?.name || 'محصول',
    image: product?.image ? getImageUrl(product.image, 800) : '',
    price,
    oldPrice,
    discountPct: discountPctFromField ?? calculatedDiscount,
    category: product?.category || '',
    categorySlug: slugifyValue(product?.category),
    badges: Array.isArray(product?.badges) ? product.badges : [],
    rating: typeof product?.rating === 'number' ? product.rating : 0,
    reviewCount: typeof product?.reviewCount === 'number' ? product.reviewCount : 0,
  }
}

export function transformFaqItem(faq: any) {
  return {
    q: faq?.question || '',
    a: faq?.answer || '',
  }
}

// Transform hero slide
export function transformHeroSlide(slide: any) {
  return {
    title: slide?.title || '',
    subtitle: slide?.subtitle || '',
    buttonText: slide?.buttonText || '',
    buttonHref: slide?.buttonHref || '#',
    image: slide?.image ? getImageUrl(slide.image, 1200) : '',
  }
}

// Transform best seller product
export function transformBestSellerProduct(product: any, index: number) {
  return {
    id: product?._id || `best-${index}`,
    title: product?.name || 'محصول',
    image: product?.featuredImage ? getImageUrl(product.featuredImage, 400) : '',
    oldPrice: undefined, // Prices come from Medusa
    price: 0, // Prices come from Medusa
    badge: product?.badge || undefined,
  }
}

// Transform editorial banner
export function transformEditorialBanner(banner: any) {
  return {
    id: banner?.id || banner?._key || 'banner-1',
    title: banner?.title || '',
    subtitle: banner?.subtitle || '',
    ctaText: banner?.ctaText || '',
    backgroundImage: banner?.backgroundImage ? getImageUrl(banner.backgroundImage, 1200) : '',
    onClick: () => {
      if (banner?.ctaLink) {
        window.location.href = banner.ctaLink
      }
    },
  }
}

// Transform category
export function transformCategory(category: any) {
  return {
    id: category?.id || category?._key || 'category-1',
    label: category?.label || '',
    image: category?.image ? getImageUrl(category.image, 400) : '',
  }
}

// Transform special offer product (discounted product)
export function transformSpecialOfferProduct(product: any, index: number) {
  const oldPrice = product?.originalPrice || 0
  const price = product?.discountedPrice || product?.price || 0
  const discountPct = product?.discountPercentage || (oldPrice > 0 ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0)

  return {
    id: product?._key || `offer-${index}`,
    title: product?.name || 'محصول',
    image: product?.image ? getImageUrl(product.image, 600) : '',
    oldPrice: oldPrice > 0 ? oldPrice : undefined,
    price,
    discountPct: discountPct > 0 ? discountPct : undefined,
  }
}

// Transform social media product
export function transformSocialMediaProduct(product: any, index: number) {
  return {
    id: product?._key || `social-${index}`,
    platform: 'Instagram' as const, // Default, can be enhanced later
    title: product?.name || 'محصول سوشیال مدیا',
    image: product?.image ? getImageUrl(product.image, 400) : '',
    price: product?.price || 0,
    rating: 5, // Default rating
  }
}

// Transform educational product
export function transformEducationalProduct(product: any, index: number) {
  return {
    id: product?._key || `edu-${index}`,
    provider: 'Coursera' as const, // Default, can be enhanced later
    title: product?.name || 'محصول آموزشی',
    image: product?.image ? getImageUrl(product.image, 400) : '',
    price: product?.price || 0,
    duration: product?.duration || '۶ ماه',
  }
}

// Transform course
export function transformCourse(course: any, index: number) {
  // Extract hours from duration string (e.g., "48 ساعت" -> 48)
  const durationMatch = course?.duration?.match(/\d+/)
  const hours = durationMatch ? parseInt(durationMatch[0]) : 0

  // Handle instructor (can be string or object)
  let instructorName = 'مدرس'
  let instructorAvatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop'
  
  if (typeof course?.instructor === 'string') {
    instructorName = course.instructor
  } else if (course?.instructor?.name) {
    instructorName = course.instructor.name
    instructorAvatar = course.instructor.avatar || instructorAvatar
  }

  return {
    id: course?._key || course?._id || `course-${index}`,
    title: course?.title || 'دوره آموزشی',
    instructor: {
      name: instructorName,
      avatar: instructorAvatar,
    },
    rating: course?.rating || 4.5,
    hours,
    image: course?.image || course?.featuredImage ? getImageUrl(course.image || course.featuredImage, 800) : '',
    price: course?.price || 0,
  }
}

// Transform blog post
export function transformBlogPost(post: any, index: number) {
  return {
    _id: post?._id || `post-${index}`,
    slug: post?.slug || `post-${index}`,
    title: post?.title || 'مقاله',
    excerpt: Array.isArray(post?.excerpt) ? portableTextToPlainText(post.excerpt) : post?.excerpt || '',
    readTime: post?.readTime || 5,
    image: {
      asset: {
        url: post?.coverImage ? getImageUrl(post.coverImage, 800) : '',
      },
    },
    category: post?.category || 'tutorials',
    publishedAt: post?.publishedAt || new Date().toISOString(),
  }
}

export function transformBlogPostDetail(post: any) {
  return {
    _id: post?._id || '',
    slug: post?.slug || post?.slug?.current || '',
    title: post?.title || '',
    cover: post?.coverImage ? getImageUrl(post.coverImage, 1600) : '',
    author: {
      name: post?.author || '',
      avatar: post?.authorAvatar ? getImageUrl(post.authorAvatar, 400) : '',
    },
    publishedAt: post?.publishedAt || '',
    readTime: post?.readTime || 5,
    tags: Array.isArray(post?.tags) ? post.tags : [],
    body: Array.isArray(post?.body) ? post.body : [],
    excerpt: Array.isArray(post?.excerpt) ? portableTextToPlainText(post.excerpt) : post?.excerpt || '',
    category: post?.category || '',
  }
}

export function transformCollectionDetail(collection: any) {
  return {
    _id: collection?._id || '',
    title: collection?.title || '',
    heroTitle: collection?.heroTitle || collection?.title || '',
    heroSubtitle: collection?.heroSubtitle || '',
    cover: collection?.coverImage ? getImageUrl(collection.coverImage, 2000) : '',
    products: Array.isArray(collection?.products)
      ? collection.products.map((product: any, index: number) =>
          transformProductListItem(product, index),
        )
      : [],
    faq: Array.isArray(collection?.faq) ? collection.faq : [],
    slug: collection?.slug || collection?.slug?.current || '',
  }
}

// Transform tabbed product (from Product document)
export function transformTabbedProduct(product: any, category: string, index: number) {
  return {
    id: product?._id || `tab-${category}-${index}`,
    title: product?.name || 'محصول',
    image: product?.featuredImage ? getImageUrl(product.featuredImage, 600) : '',
    oldPrice: undefined, // Prices come from Medusa
    price: 0, // Prices come from Medusa
    discountPct: undefined,
    category,
  }
}

// Transform collections banner
export function transformCollectionsBanner(banner: any) {
  if (!banner) return null
  
  return {
    title: banner?.title || '',
    subtitle: banner?.subtitle || '',
    image: banner?.image ? getImageUrl(banner.image, 1200) : '',
    ctaText: banner?.ctaText || '',
    ctaLink: banner?.ctaLink || banner?.featuredCollection?.slug ? `/collections/${banner.featuredCollection.slug}` : '/collections',
  }
}

