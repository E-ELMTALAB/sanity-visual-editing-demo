import { groq } from 'next-sanity'

export const homePageQuery = groq`
  *[_type == "home"][0]{
    _id,
    footer,
    overview,
    showcaseProjects[]->{
      _type,
      coverImage,
      overview,
      "slug": slug.current,
      tags,
      title,
    },
    title,
  }
`

export const homePageTitleQuery = groq`
  *[_type == "home"][0].title
`

export const pagesBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    body,
    overview,
    title,
    "slug": slug.current,
  }
`

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    client,
    coverImage,
    description,
    duration,
    overview,
    site,
    "slug": slug.current,
    tags,
    title,
  }
`

export const projectPaths = groq`
  *[_type == "project" && slug.current != null].slug.current
`

export const pagePaths = groq`
  *[_type == "page" && slug.current != null].slug.current
`

export const settingsQuery = groq`
  *[_type == "settings"][0]{
    footer,
    menuItems[]->{
      _type,
      "slug": slug.current,
      title
    },
    ogImage,
    robotsTxt,
  }
`

export const sharifHeroQuery = groq`
  *[_type=="home"][0]{
    topBannerSlides[]{
      _key,
      _type,
      title,
      subtitle,
      buttonText,
      buttonHref,
      image
    },
    heroSlides[]{
      _key,
      _type,
      title,
      subtitle,
      buttonText,
      buttonHref,
      image
    },
    promoCards[]{
      _key,
      _type,
      title,
      subtitle,
      buttonText,
      buttonHref,
      image
    },
    discountedProducts[]{
      _key,
      _type,
      name,
      description,
      category,
      originalPrice,
      discountedPrice,
      discountPercentage,
      image,
      "slug": slug.current
    },
    socialMediaProducts[]{
      _key,
      _type,
      name,
      description,
      category,
      price,
      originalPrice,
      discountPercentage,
      image,
      "slug": slug.current
    },
    educationalProducts[]{
      _key,
      _type,
      name,
      description,
      category,
      price,
      originalPrice,
      discountPercentage,
      image,
      "slug": slug.current
    },
    bestsellingCourses[]{
      _key,
      _type,
      title,
      description,
      price,
      originalPrice,
      instructor,
      duration,
      students,
      rating,
      reviewCount,
      category,
      level,
      image,
      "slug": slug.current
    },
    "magazinePosts": magazinePosts[]->{
      _id,
      title,
      "slug": slug.current,
      "excerpt": pt::text(excerpt),
      coverImage,
      tags,
      publishedAt,
      rating,
      reviewCount
    },
    "featuredBlogs": featuredBlogs[]->{
      _id,
      title,
      "slug": slug.current,
      "excerpt": pt::text(excerpt),
      coverImage,
      tags,
      publishedAt,
      author,
      rating,
      reviewCount,
      category
    },
    seo
  }
`

// Blog
export const blogListQuery = groq`
  *[_type == "post"]|order(publishedAt desc){
    _id,
    title,
    "slug": slug.current,
    excerpt,
    coverImage,
    category,
    tags,
    publishedAt,
    author,
    rating,
    reviewCount,
  }
`

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    coverImage,
    author,
    publishedAt,
    category,
    tags,
    body,
    rating,
    reviewCount,
    seo,
    relatedPosts[]->{
      _id,
      title,
      "slug": slug.current,
      excerpt,
      coverImage,
      category,
      publishedAt,
      author
    }
  }
`

export const postPaths = groq`
  *[_type == "post" && slug.current != null].slug.current
`

// Product document queries (first-class products)
export const productDocPaths = groq`
  *[_type == "product" && slug.current != null].slug.current
`

export const productDocBySlugQuery = groq`
  *[_type == "product" && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug,
    description,
    category,
    price,
    originalPrice,
    discountPercentage,
    image,
    gallery,
    features,
    badges,
    inStock,
    rating,
    reviewCount,
    options[]{ id, name, price },
    "relatedProducts": relatedProducts[]->{
      _id,
      name,
      "slug": slug.current,
      price,
      originalPrice,
      discountPercentage,
      image,
      category,
      rating,
      reviewCount
    },
    "relatedBlogs": relatedBlogs[]->{
      _id,
      title,
      "slug": slug.current,
      "excerpt": pt::text(excerpt),
      coverImage,
      publishedAt,
      tags
    },
    "slug": slug.current,
  }
`

// Product queries (for products from all arrays)
export const productBySlugQuery = groq`
  *[_type == "home"][0]{
    "product": (
      discountedProducts[slug.current == $slug][0]{
        _key,
        _type,
        name,
        description,
        category,
        originalPrice,
        discountedPrice,
        discountPercentage,
        image,
        "slug": slug.current
      } ??
      socialMediaProducts[slug.current == $slug][0]{
        _key,
        _type,
        name,
        description,
        category,
        price,
        originalPrice,
        discountPercentage,
        image,
        "slug": slug.current
      } ??
      educationalProducts[slug.current == $slug][0]{
        _key,
        _type,
        name,
        description,
        category,
        price,
        originalPrice,
        discountPercentage,
        image,
        "slug": slug.current
      }
    )
  }.product
`

// Products listing query - fetch all product documents
export const productsListQuery = groq`
  *[_type == "product"] | order(_createdAt desc) {
    _id,
    _key,
    _type,
    name,
    slug,
    description,
    category,
    price,
    originalPrice,
    discountPercentage,
    image,
    features,
    badges,
    inStock,
    rating,
    reviewCount,
    tags,
    seo
  }
`

// Product categories query - get unique categories
export const productCategoriesQuery = groq`
  array::unique(*[_type == "product" && defined(category)].category)
`

// FAQ queries - fetch FAQs by page location
export const faqsByPageQuery = groq`
  *[_type == "faq" && $pageLocation in pageLocations && isActive == true] | order(order asc, _createdAt asc) {
    _id,
    _key,
    question,
    answer,
    category,
    order,
    pageLocations,
    tags,
    seo
  }
`

// All FAQs query
export const allFaqsQuery = groq`
  *[_type == "faq"] | order(order asc, _createdAt asc) {
    _id,
    _key,
    question,
    answer,
    category,
    order,
    pageLocations,
    isActive,
    tags,
    seo
  }
`

// Course queries
export const courseBySlugQuery = groq`
  *[_type == "course" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    shortDescription,
    longDescription,
    price,
    originalPrice,
    discountPercentage,
    category,
    level,
    language,
    duration,
    totalSessions,
    rating,
    reviewCount,
    totalStudents,
    features,
    requirements,
    learningOutcomes,
    targetAudience,
    syllabus[]{
      title,
      description,
      duration,
      order,
      lessons[]{
        title,
        duration,
        description,
        isPreview,
        videoUrl
      },
      isLocked
    },
    featuredImage,
    videoPreview,
    gallery,
    isPublished,
    isFeatured,
    badge,
    instructor->{
      _id,
      name,
      slug,
      title,
      bio,
      image,
      experience,
      expertise,
      totalStudents,
      totalCourses,
      rating,
      socialMedia
    },
    relatedCourses[]->{
      _id,
      title,
      slug,
      shortDescription,
      price,
      originalPrice,
      rating,
      reviewCount,
      featuredImage,
      category,
      level
    },
    relatedPosts[]->{
      _id,
      title,
      slug,
      excerpt,
      coverImage,
      publishedAt
    },
    seo
  }
`

// All courses query
export const allCoursesQuery = groq`
  *[_type == "course" && isPublished == true] | order(_createdAt desc) {
    _id,
    title,
    slug,
    shortDescription,
    price,
    originalPrice,
    discountPercentage,
    rating,
    reviewCount,
    totalStudents,
    featuredImage,
    category,
    level,
    badge,
    instructor->{
      name
    }
  }
`

// Featured courses query
export const featuredCoursesQuery = groq`
  *[_type == "course" && isPublished == true && isFeatured == true] | order(_createdAt desc) {
    _id,
    title,
    slug,
    shortDescription,
    price,
    originalPrice,
    featuredImage,
    rating,
    reviewCount
  }
`

// Instructor by ID query
export const instructorByIdQuery = groq`
  *[_type == "instructor" && _id == $instructorId][0]{
    _id,
    name,
    slug,
    title,
    bio,
    image,
    experience,
    expertise,
    totalStudents,
    totalCourses,
    rating,
    email,
    website,
    socialMedia,
    seo
  }
`

// Collection queries
export const collectionBySlugQuery = groq`
  *[_type == "collection" && slug.current == $slug][0]{
    _id,
    _key,
    title,
    slug,
    key,
    heroTitle,
    heroSubtitle,
    coverImage,
    faq[]{
      question,
      answer
    },
    seo
  }
`

export const collectionPaths = groq`
  *[_type == "collection" && slug.current != null].slug.current
`

export const allCollectionsQuery = groq`
  *[_type == "collection"] | order(_createdAt desc) {
    _id,
    title,
    slug,
    key,
    heroTitle,
    heroSubtitle,
    coverImage
  }
`

// Products by collection type
export const productsByCollectionTypeQuery = groq`
  *[_type == "product" && collectionType == $collectionType && inStock == true] | order(_createdAt desc) {
    _id,
    _key,
    _type,
    name,
    slug,
    description,
    category,
    collectionType,
    price,
    originalPrice,
    discountPercentage,
    image,
    features,
    badges,
    inStock,
    rating,
    reviewCount,
    tags
  }
`
