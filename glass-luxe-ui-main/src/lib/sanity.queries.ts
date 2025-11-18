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
      image
    },
    
    // Best Seller Products (references) - _key is on the array item, then dereference
    "bestSellerProducts": bestSellerProducts[]{
      _key,
      ...@->{
        _id,
        name,
        slug,
        image,
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
    
    // Categories
    categories[]{
      _key,
      id,
      label,
      labelEn,
      image,
      "slug": slug.current,
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
    
    // Social Media Products
    socialMediaProducts[]{
      _key,
      name,
      description,
      price,
      originalPrice,
      discountPercentage,
      image,
      "slug": slug.current
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
    
    // Bestselling Courses
    bestsellingCourses[]{
      _key,
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
    }
  }
`

// Fallback queries for when Home singleton is empty

// Query for Product documents (for Best Sellers and Tabbed Products)
export const allProductsQuery = `
  *[_type == "product"] | order(_createdAt desc) {
    _id,
    name,
    slug,
    description,
    image,
    category,
    collectionType,
    badges,
    "slug": slug.current
  }
`

// Query for featured products (best sellers fallback)
export const featuredProductsQuery = `
  *[_type == "product"] | order(_createdAt desc) [0...8] {
    _id,
    name,
    slug,
    image,
    category,
    badges,
    "slug": slug.current
  }
`

// Query for products by category (for Tabbed Product Grid)
export const productsByCategoryQuery = `
  *[_type == "product" && category == $category] | order(_createdAt desc) [0...8] {
    _id,
    name,
    slug,
    image,
    category,
    badges,
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
    slug,
    excerpt,
    coverImage,
    publishedAt,
    readTime,
    category,
    "slug": slug.current
  }
`

// Query for featured posts (fallback)
export const featuredPostsQuery = `
  *[_type == "post"] | order(publishedAt desc) [0...6] {
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

