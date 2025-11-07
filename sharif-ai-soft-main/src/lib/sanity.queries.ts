/**
 * Sanity GROQ Queries
 * Defines all queries for fetching data from Sanity CMS
 */

/**
 * Home Page Courses Query
 * Fetches the bestselling courses from the home singleton
 */
export const homeCoursesQuery = `
  *[_type == "home"][0]{
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
    }
  }
`

/**
 * All Courses Query
 * Fetches all published courses (alternative if you want to fetch from course documents instead)
 */
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
      name
    },
    "slug": slug.current
  }
`

/**
 * Featured Courses Query
 * Fetches only featured courses
 */
export const featuredCoursesQuery = `
  *[_type == "course" && isPublished == true && isFeatured == true] | order(_createdAt desc) {
    _id,
    title,
    shortDescription,
    price,
    originalPrice,
    featuredImage,
    rating,
    reviewCount,
    "slug": slug.current
  }
`

/**
 * Course by Slug Query
 * Fetches a single course by its slug
 */
export const courseBySlugQuery = `
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
    seo
  }
`

