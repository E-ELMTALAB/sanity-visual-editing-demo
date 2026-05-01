const e=`
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
`,t=`
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
`,r=`
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
`,a=`
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
`,i=`
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
`,s=`
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
`,o=`
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
`,c=`
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
`,n=`
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
`,u=`
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
`,l=`
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
`,g=`
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
`;export{s as allPostsQuery,t as allProductsQuery,u as collectionBySlugQuery,g as faqsByPageQuery,i as featuredCoursesQuery,o as featuredPostsQuery,r as featuredProductsQuery,e as homePageQuery,l as pageBySlugQuery,n as postBySlugQuery,c as productBySlugQuery,a as productsByCategoryQuery};
