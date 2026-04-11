// Hero-only query for critical LCP image - fetched immediately
export const heroSlideQuery = `
  *[_type == "home"][0]{
    _id,
    _type,
    // Hero Section only
    heroSlides[]{
      _key,
      title,
      subtitle,
      buttonText,
      buttonHref,
      image{
        ...,
        asset->
      }
    }
  }
`

// Home singleton query - Main homepage content
export const homePageQuery = `
  *[_type == "home"][0]{
    _id,
    _type,
    // Hero Section
    heroSlides[]{
      _key,
      title,
      subtitle,
      buttonText,
      buttonHref,
      image{
        ...,
        asset->
      }
    },
    
    // Best Seller Products (references) - _key is on the array item, then dereference
    "bestSellerProducts": bestSellerProducts[]{
      _key,
      ...@->{
        _id,
        name,
        slug,
        image{
          ...,
          asset->
        },
        category,
        badges,
        "slug": slug.current
      }
    },
    
    // Editorial Banners
    editorialBanners[]{
      _key,
      id,
      title,
      subtitle,
      ctaText,
      ctaLink,
      backgroundImage,
      order
    },
    
    // Collections Banner
    collectionsBanner{
      title,
      subtitle,
      image,
      ctaText,
      ctaLink,
      featuredCollection->{
        _id,
        title,
        "slug": slug.current
      }
    },
    
    // Special Offers (Discounted Products)
    discountedProducts[]{
      _key,
      name,
      description,
      originalPrice,
      discountedPrice,
      discountPercentage,
      image,
      "slug": slug.current
    },
    
    // Social Media Products (references) - _key is on the array item, then dereference
    "socialMediaProducts": socialMediaProducts[]{
      _key,
      ...@->{
        _id,
      name,
        slug,
        image{
          ...,
          asset->
        },
        category,
        badges,
      price,
      originalPrice,
      discountPercentage,
        rating,
        reviewCount,
      "slug": slug.current
      }
    },
    
    // Educational Products
    educationalProducts[]{
      _key,
      name,
      description,
      price,
      originalPrice,
      discountPercentage,
      category,
      image,
      duration,
      "slug": slug.current
    },
    
    // Bestselling Courses (references) - _key is on the array item, then dereference
    "bestsellingCourses": bestsellingCourses[]{
      _key,
      ...@->{
        _id,
      title,
        shortDescription,
        longDescription,
      price,
      originalPrice,
        discountPercentage,
      duration,
        totalSessions,
        totalStudents,
      rating,
      reviewCount,
      category,
      level,
        featuredImage{
          ...,
          asset->
        },
        instructor->{
          _id,
          name,
          title,
          image
        },
      "slug": slug.current
      }
    },
    
    // Magazine Posts (Blog Posts) - _key is on the array item, then dereference
    "magazinePosts": magazinePosts[]{
      _key,
      ...@->{
      _id,
      title,
      slug,
      excerpt,
      coverImage,
      publishedAt,
      readTime,
      category,
      "slug": slug.current
      }
    },
    
    // Featured Blogs - _key is on the array item, then dereference
    "featuredBlogs": featuredBlogs[]{
      _key,
      ...@->{
      _id,
      title,
      slug,
      excerpt,
      coverImage,
      publishedAt,
      readTime,
      category,
      "slug": slug.current
      }
    },

    // SEO Content Section
    seoContent,
    
    // SEO Fields
    seo{
      metaTitle,
      metaDescription,
      canonicalUrl,
      robotsMeta,
      openGraphTitle,
      openGraphDescription,
      openGraphImage{
        ...,
        asset->
      },
      structuredData
    }
  }
`

// Fallback queries for when Home singleton is empty

// Query for Product documents (for Best Sellers and Tabbed Products)
export const allProductsQuery = `
  *[_type == "product"] | order(_createdAt desc) {
    _id,
    name,
    description,
    image,
    category,
    collectionType,
    badges,
    price,
    originalPrice,
    discountPercentage,
    rating,
    reviewCount,
    inStock,
    "slug": slug.current
  }
`

// Query for featured products (best sellers fallback)
export const featuredProductsQuery = `
  *[_type == "product"] | order(_createdAt desc) [0...8] {
    _id,
    name,
    image,
    category,
    badges,
    price,
    originalPrice,
    discountPercentage,
    rating,
    reviewCount,
    inStock,
    "slug": slug.current
  }
`

// Query for products by category (for Tabbed Product Grid)
export const productsByCategoryQuery = `
  *[_type == "product" && category == $category] | order(_createdAt desc) [0...8] {
    _id,
    name,
    image,
    category,
    badges,
    price,
    originalPrice,
    discountPercentage,
    rating,
    reviewCount,
    inStock,
    "slug": slug.current
  }
`

// Query for Course documents (fallback)
export const allCoursesQuery = `
  *[_type == "course" && isPublished == true] | order(_createdAt desc) {
    _id,
    title,
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
    duration,
    totalSessions,
    badge,
    instructor->{
      name,
      avatar
    },
    "slug": slug.current
  }
`

// Query for featured courses (fallback)
export const featuredCoursesQuery = `
  *[_type == "course" && isPublished == true && isFeatured == true] | order(_createdAt desc) [0...6] {
    _id,
    title,
    shortDescription,
    price,
    originalPrice,
    rating,
    reviewCount,
    totalStudents,
    featuredImage,
    category,
    level,
    duration,
    instructor->{
      name,
      avatar
    },
    "slug": slug.current
  }
`

// Query for Post documents (Blog posts fallback)
export const allPostsQuery = `
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    excerpt,
    coverImage,
    publishedAt,
    readTime,
    category,
    author,
    seo{
      metaTitle,
      metaDescription,
      canonicalUrl,
      robotsMeta,
      openGraphTitle,
      openGraphDescription,
      openGraphImage{
        ...,
        asset->
      },
      structuredData
    },
    "slug": slug.current
  }
`

// Query for featured posts (fallback)
export const featuredPostsQuery = `
  *[_type == "post"] | order(publishedAt desc) [0...6] {
    _id,
    title,
    excerpt,
    coverImage,
    publishedAt,
    readTime,
    category,
    author,
    seo{
      metaTitle,
      metaDescription,
      canonicalUrl,
      robotsMeta,
      openGraphTitle,
      openGraphDescription,
      openGraphImage{
        ...,
        asset->
      },
      structuredData
    },
    "slug": slug.current
  }
`

// Query for Collection documents
export const allCollectionsQuery = `
  *[_type == "collection"] | order(_createdAt desc) {
    _id,
    title,
    slug,
    coverImage,
    "slug": slug.current
  }
`

export const productBySlugQuery = `
  *[_type == "product" && slug.current == $slug][0]{
    _id,
    name,
    description,
    category,
    collectionType,
    badges,
    features,
    rating,
    reviewCount,
    price,
    originalPrice,
    discountPercentage,
    inStock,
    image,
    featuredImage{
      ...,
      asset->
    },
    gallery[]{
      _key,
      asset->,
      alt,
      caption
    },
    options[]{
      _key,
      id,
      name,
      price
    },
    relatedProducts[]->{
      _id,
      name,
      category,
      badges,
      price,
      originalPrice,
      discountPercentage,
      rating,
      reviewCount,
      image,
      featuredImage{
        ...,
        asset->
      },
      "slug": slug.current
    },
    relatedBlogs[]->{
      _id,
      title,
      coverImage,
      category,
      publishedAt,
      readTime,
      author,
      "slug": slug.current
    },
    faqs[]{
      _key,
      question,
      answer,
      isActive,
      order
    },
    seo{
      metaTitle,
      metaDescription,
      canonicalUrl,
      robotsMeta,
      openGraphTitle,
      openGraphDescription,
      openGraphImage{
        ...,
        asset->
      },
      structuredData
    },
    "slug": slug.current
  }
`

export const postBySlugQuery = `
  *[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    author,
    category,
    tags,
    rating,
    reviewCount,
    publishedAt,
    coverImage{
      ...,
      asset->
    },
    excerpt,
    body[]{
      ...,
      asset->
    },
    relatedPosts[]->{
      _id,
      title,
      coverImage,
      category,
      publishedAt,
      readTime,
      "slug": slug.current
    },
    seo{
      metaTitle,
      metaDescription,
      canonicalUrl,
      robotsMeta,
      openGraphTitle,
      openGraphDescription,
      openGraphImage{
        ...,
        asset->
      },
      structuredData
    },
    "slug": slug.current
  }
`

export const collectionBySlugQuery = `
  *[_type == "collection" && slug.current == $slug][0]{
    _id,
    title,
    heroTitle,
    heroSubtitle,
    coverImage{
      ...,
      asset->
    },
    key,
    faq[]{
      _key,
      question,
      answer
    },
    "products": *[_type == "product" && collectionType == ^.key] | order(_createdAt desc){
      _id,
      name,
      image,
      category,
      badges,
      price,
      originalPrice,
      discountPercentage,
      rating,
      reviewCount,
      inStock,
      "slug": slug.current
    },
    seo{
      metaTitle,
      metaDescription,
      canonicalUrl,
      robotsMeta,
      openGraphTitle,
      openGraphDescription,
      openGraphImage{
        ...,
        asset->
      },
      structuredData
    },
    "slug": slug.current
  }
`

export const pageBySlugQuery = `
  *[_type == "page" && slug.current == $slug][0]{
    _id,
    title,
    overview,
    body[]{
      ...,
      asset->
    },
    seo{
      metaTitle,
      metaDescription,
      canonicalUrl,
      robotsMeta,
      openGraphTitle,
      openGraphDescription,
      openGraphImage{
        ...,
        asset->
      },
      structuredData
    },
    "slug": slug.current
  }
`

export const instructorBySlugQuery = `
  *[_type == "instructor" && slug.current == $slug][0]{
    _id,
    name,
    title,
    bio,
    image{
      ...,
      asset->
    },
    experience,
    expertise,
    totalStudents,
    totalCourses,
    rating,
    email,
    website,
    socialMedia,
    "slug": slug.current
  }
`

export const faqsByPageQuery = `
  *[_type == "faq" && isActive == true &&
    (
      (defined(pageLocations) && $page in pageLocations) ||
      (defined(specificPages) && $pageUrl in specificPages)
    )
  ]
    | order(order asc){
      _id,
      question,
      answer,
      category,
      order
    }
`

export const allFaqsQuery = `
  *[_type == "faq" && isActive == true] | order(order asc){
    _id,
    question,
    answer,
    category,
    pageLocations,
    order
  }
`

// Query for promo banner (active banner)
export const promoBannerQuery = `
  *[_type == "promoBanner" && isActive == true] | order(order asc, _updatedAt desc)[0]{
    _id,
    _type,
    title,
    subtitle,
    description,
    buttonText,
    buttonLink,
    backgroundImage{
      ...,
      asset->
    },
    order,
    isActive,
    _updatedAt
  }
`


// Query for active testimonials (schema-compatible)
export const testimonialsQuery = `
  *[_type == "testimonial"] | order(_updatedAt desc){
    _id,
    _type,
    "name": author,
    "subtitle": role,
    quote,
    avatar{
      ...,
      asset->
    },
    _updatedAt
  }
`


