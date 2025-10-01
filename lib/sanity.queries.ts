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
    }
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
    tags,
    publishedAt,
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
    tags,
    body,
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
    description,
    longDescription,
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
      _type,
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
      _type,
      title,
      "slug": slug.current,
      excerpt,
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

// Course by slug query
export const courseBySlugQuery = groq`
  *[_type == "home"][0]{
    "course": bestsellingCourses[slug.current == $slug][0]{
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
    }
  }.course
`
