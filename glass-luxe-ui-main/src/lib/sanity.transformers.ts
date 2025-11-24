import { buildResponsiveImageSet, getImageUrl, urlForImage } from './sanity.image'

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
    image: product?.image ? getImageUrl(product.image, 600) : '', // Reduced from 800 to 600 for better performance
    imageSrcSet: product?.image ? buildResponsiveImageSet(product.image, [400, 600, 800], { quality: 80 }).srcSet : '',
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
  // Check if image exists and has valid asset data
  const hasValidImage = slide?.image && (slide.image.asset?._ref || slide.image.asset?._id)
  
  const responsiveImage = hasValidImage
    ? buildResponsiveImageSet(slide.image, [640, 960, 1280, 1600], { quality: 75, maxWidth: 1600 }) // Limit to 1600px max for hero
    : null

  // Debug logging in development
  if (process.env.NODE_ENV === 'development' && slide?.image) {
    console.log('[transformHeroSlide] Image data:', {
      hasImage: !!slide.image,
      hasAsset: !!slide.image.asset,
      assetRef: slide.image.asset?._ref,
      assetId: slide.image.asset?._id,
      responsiveImage: !!responsiveImage,
      finalImage: responsiveImage?.src || (slide.image ? getImageUrl(slide.image, 1600) : '')
    })
  }

  return {
    title: slide?.title || '',
    subtitle: slide?.subtitle || '',
    buttonText: slide?.buttonText || '',
    buttonHref: slide?.buttonHref || '#',
    image: responsiveImage?.src || (hasValidImage ? getImageUrl(slide.image, 1600) : ''),
    imageSrcSet: responsiveImage?.srcSet,
  }
}

// Transform best seller product
export function transformBestSellerProduct(product: any, index: number) {
  return {
    id: product?._id || `best-${index}`,
    title: product?.name || 'محصول',
    image: product?.image ? getImageUrl(product.image, 400) : '',
    imageSrcSet: product?.image ? buildResponsiveImageSet(product.image, [300, 400, 600], { quality: 80 }).srcSet : '',
    oldPrice: undefined, // Prices come from Medusa
    price: 0, // Prices come from Medusa
    badge: product?.badge || undefined,
    badges: product?.badges || [],
    slug: product?.slug || '',
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

// Transform category (now linked to collections)
export function transformCategory(category: any) {
  const collection = category?.collection
  const customLabel = category?.label
  const customImage = category?.image
  
  // Use collection slug if available, otherwise fall back to collection key or _id
  const collectionSlug = collection?.slug?.current || collection?.slug || collection?.key || collection?._id
  
  return {
    id: collection?._id || category?._key || 'category-1',
    label: customLabel || collection?.title || 'Collection',
    image: customImage ? getImageUrl(customImage, 400) : (collection?.coverImage ? getImageUrl(collection.coverImage, 400) : ''),
    slug: collectionSlug,
    href: collectionSlug ? `/collections/${collectionSlug}` : '#',
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
    image: product?.image ? getImageUrl(product.image, 500) : '',
    imageSrcSet: product?.image ? buildResponsiveImageSet(product.image, [400, 500, 700], { quality: 80 }).srcSet : '',
    oldPrice: oldPrice > 0 ? oldPrice : undefined,
    price,
    discountPct: discountPct > 0 ? discountPct : undefined,
  }
}

// Transform social media product (now from product reference)
export function transformSocialMediaProduct(product: any, index: number) {
  const price = typeof product?.price === 'number' ? product.price : 0
  const oldPrice = typeof product?.originalPrice === 'number' ? product.originalPrice : undefined
  const discountPctFromField = typeof product?.discountPercentage === 'number' ? product.discountPercentage : undefined
  const calculatedDiscount =
    !discountPctFromField && oldPrice && price
      ? Math.max(0, Math.round(((oldPrice - price) / oldPrice) * 100))
      : undefined

  return {
    id: product?._id || `social-${index}`,
    slug: product?.slug || product?.slug?.current || '',
    platform: 'Instagram' as const, // Default, can be enhanced later
    title: product?.name || 'محصول سوشیال مدیا',
    image: product?.image ? getImageUrl(product.image, 350) : '',
    imageSrcSet: product?.image ? buildResponsiveImageSet(product.image, [300, 350, 500], { quality: 80 }).srcSet : '',
    price,
    oldPrice,
    discountPct: discountPctFromField ?? calculatedDiscount,
    badges: Array.isArray(product?.badges) ? product.badges : [],
    rating: typeof product?.rating === 'number' ? product.rating : 0,
    reviewCount: typeof product?.reviewCount === 'number' ? product.reviewCount : 0,
    category: product?.category || '',
  }
}

// Transform educational product
export function transformEducationalProduct(product: any, index: number) {
  return {
    id: product?._key || `edu-${index}`,
    provider: 'Coursera' as const, // Default, can be enhanced later
    title: product?.name || 'محصول آموزشی',
    image: product?.image ? getImageUrl(product.image, 350) : '',
    imageSrcSet: product?.image ? buildResponsiveImageSet(product.image, [300, 350, 500], { quality: 80 }).srcSet : '',
    price: product?.price || 0,
    duration: product?.duration || '۶ ماه',
  }
}

// Transform course (now from course reference)
export function transformCourse(course: any, index: number) {
  // Extract hours from duration string (e.g., "48 ساعت" -> 48) or use totalSessions
  const durationMatch = course?.duration?.match(/\d+/)
  const hours = durationMatch ? parseInt(durationMatch[0]) : (course?.totalSessions || 0)

  // Handle instructor (can be string or object)
  let instructorName = 'مدرس'
  let instructorAvatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&auto=format'
  
  if (typeof course?.instructor === 'string') {
    instructorName = course.instructor
  } else if (course?.instructor?.name) {
    instructorName = course.instructor.name
    instructorAvatar = course.instructor.image ? getImageUrl(course.instructor.image, 64) : instructorAvatar
  }

  const price = typeof course?.price === 'number' ? course.price : 0
  const oldPrice = typeof course?.originalPrice === 'number' ? course.originalPrice : undefined
  const discountPctFromField = typeof course?.discountPercentage === 'number' ? course.discountPercentage : undefined
  const calculatedDiscount =
    !discountPctFromField && oldPrice && price
      ? Math.max(0, Math.round(((oldPrice - price) / oldPrice) * 100))
      : undefined

  return {
    id: course?._id || `course-${index}`,
    slug: course?.slug || course?.slug?.current || '',
    title: course?.title || 'دوره آموزشی',
    description: course?.shortDescription || course?.description || '',
    instructor: {
      name: instructorName,
      avatar: instructorAvatar,
    },
    rating: typeof course?.rating === 'number' ? course.rating : 0,
    reviewCount: typeof course?.reviewCount === 'number' ? course.reviewCount : 0,
    hours,
    image: course?.featuredImage || course?.image ? getImageUrl(course.featuredImage || course.image, 600) : '',
    imageSrcSet: course?.featuredImage || course?.image ? buildResponsiveImageSet(course.featuredImage || course.image, [400, 600, 800], { quality: 80 }).srcSet : '',
    price,
    oldPrice,
    discountPct: discountPctFromField ?? calculatedDiscount,
    category: course?.category || '',
    level: course?.level || '',
    totalStudents: typeof course?.totalStudents === 'number' ? course.totalStudents : 0,
  }
}

// Transform blog post
export function transformBlogPost(post: any, index: number) {
  const slugValue =
    typeof post?.slug === 'string'
      ? post.slug
      : post?.slug?.current || ''

  return {
    _id: post?._id || `post-${index}`,
    slug: slugValue || `post-${index}`,
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
  const slugValue =
    typeof post?.slug === 'string'
      ? post.slug
      : post?.slug?.current || ''

  return {
    _id: post?._id || '',
    slug: slugValue,
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

export function transformProductDetail(product: any) {
  const gallery =
    Array.isArray(product?.gallery) && product.gallery.length > 0
      ? product.gallery
          .filter((image: any) => !!image)
          .map((image: any, index: number) => ({
            _key: image?._key || image?._id || `gallery-${index}`,
            url: getImageUrl(image, 1600),
            alt: image?.alt || product?.name || 'Product image',
          }))
      : product?.image
        ? [
            {
              _key: 'primary',
              url: getImageUrl(product.image, 1600),
              alt: product?.name || 'Product image',
            },
          ]
        : []

  const images = gallery.map((image: any) => image.url).filter(Boolean)
  if (images.length === 0 && product?.image) {
    images.push(getImageUrl(product.image, 1600))
  }

  const variants = Array.isArray(product?.options)
    ? product.options.map((option: any, index: number) => ({
        id: option?.id || option?._key || `variant-${index}`,
        name: option?.name || option?.label || `گزینه ${index + 1}`,
        nameFa: option?.nameFa || option?.name || option?.label || `گزینه ${index + 1}`,
        price: typeof option?.price === 'number' ? option.price : undefined,
        oldPrice:
          typeof option?.oldPrice === 'number'
            ? option.oldPrice
            : typeof option?.compareAtPrice === 'number'
              ? option.compareAtPrice
              : undefined,
        inStock: option?.inStock !== false,
      }))
    : []

  const badgeList = Array.isArray(product?.badges) ? product.badges.filter(Boolean) : []
  const primaryBadge =
    badgeList.find((badge: string) => ['sale', 'new', 'hot'].includes(badge)) ?? badgeList[0]

  return {
    id: product?._id || '',
    handle: product?.slug?.current || product?.slug || '',
    title: product?.name || '',
    titleFa: product?.titleFa || product?.name || '',
    description: product?.description || '',
    descriptionFa: product?.descriptionFa || product?.description || '',
    category: product?.category || '',
    categoryFa: product?.categoryFa || product?.category || '',
    image: images[0] || '',
    images,
    badges: badgeList,
    badge: primaryBadge,
    price: typeof product?.price === 'number' ? product.price : 0,
    originalPrice:
      typeof product?.originalPrice === 'number' ? product.originalPrice : undefined,
    discountPct: typeof product?.discountPercentage === 'number' ? product.discountPercentage : undefined,
    rating: typeof product?.rating === 'number' ? product.rating : undefined,
    reviewCount: typeof product?.reviewCount === 'number' ? product.reviewCount : undefined,
    inStock: product?.inStock !== false,
    features: Array.isArray(product?.features) ? product.features : [],
    featuresFa: Array.isArray(product?.featuresFa) ? product.featuresFa : Array.isArray(product?.features) ? product.features : [],
    gallery,
    variants,
    relatedProducts: Array.isArray(product?.relatedProducts)
      ? product.relatedProducts.map((item: any, index: number) => transformProductListItem(item, index))
      : [],
    relatedPosts: Array.isArray(product?.relatedBlogs)
      ? product.relatedBlogs.map((item: any, index: number) => transformBlogPost(item, index))
      : [],
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

  const responsiveImage = banner?.image
    ? buildResponsiveImageSet(banner.image, [640, 960, 1280, 1600], { quality: 70 })
    : null
  
  return {
    title: banner?.title || '',
    subtitle: banner?.subtitle || '',
    image: responsiveImage?.src || (banner?.image ? getImageUrl(banner.image, 1600) : ''),
    imageSrcSet: responsiveImage?.srcSet,
    ctaText: banner?.ctaText || '',
    ctaLink: banner?.ctaLink || (banner?.featuredCollection?.slug ? `/collections/${banner.featuredCollection.slug}` : '/collections'),
  }
}

// Transform featured collection with products (for homepage)
export function transformFeaturedCollection(featuredCollection: any) {
  const collection = featuredCollection?.collection
  if (!collection) return null
  
  const products = collection.products?.map((product: any) => ({
    id: product._id || '',
    title: product.name || '',
    image: product.image ? getImageUrl(product.image, 600) : '',
    price: product.price || 0,
    oldPrice: product.originalPrice || undefined,
    discountPct: product.discountPercentage || undefined,
    category: product.category || '',
    slug: product.slug || '',
    badges: product.badges || []
  })) || []
  
  return {
    _id: collection._id,
    _key: featuredCollection._key,
    title: featuredCollection.displayTitle || collection.heroTitle || collection.title || 'Collection',
    slug: collection.slug || '',
    key: collection.key || '',
    coverImage: collection.coverImage ? getImageUrl(collection.coverImage, 1200) : '',
    products,
    order: featuredCollection.order || 0,
    maxProducts: featuredCollection.maxProducts || 6,
  }
}

