import { draftMode } from 'next/headers'
import { getClient } from 'lib/sanity.client'
import { readToken } from 'lib/sanity.api'
import { courseBySlugQuery, faqsByPageQuery } from 'lib/sanity.queries'
import { urlForImage, toProxiedUrl } from 'lib/sanity.image'
import type { CoursePayload, FAQ } from 'types'
import CourseOverlay from 'components/site/course/CourseOverlay'
import FAQOverlay from 'components/site/product/FAQOverlay'
import type { Metadata } from 'next'

// @ts-ignore - TypeScript may not resolve this import correctly due to dynamic route folder naming
import CoursePageClient from './page-client'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const isDraft = draftMode().isEnabled
  const client = getClient(isDraft ? { token: readToken } : undefined)
  const course = await client.fetch<CoursePayload | null>(courseBySlugQuery, { slug: params.slug })

  if (!course) {
    return {
      title: 'دوره یافت نشد',
      description: 'دوره مورد نظر یافت نشد',
    }
  }

  const imageUrl = course.featuredImage ? toProxiedUrl(urlForImage(course.featuredImage)?.url()) : undefined
  const ogImageUrl = course.seo?.openGraphImage ? toProxiedUrl(urlForImage(course.seo.openGraphImage)?.url()) : imageUrl

  return {
    title: course.seo?.metaTitle || course.title || 'دوره آموزشی',
    description: course.seo?.metaDescription || course.shortDescription || '',
    openGraph: {
      title: course.seo?.openGraphTitle || course.title || '',
      description: course.seo?.openGraphDescription || course.shortDescription || '',
      images: ogImageUrl ? [{ url: ogImageUrl }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: course.seo?.openGraphTitle || course.title || '',
      description: course.seo?.openGraphDescription || course.shortDescription || '',
      images: ogImageUrl ? [ogImageUrl] : [],
    },
    robots: {
      index: course.seo?.robotsMeta?.includes('noindex') ? false : true,
      follow: course.seo?.robotsMeta?.includes('nofollow') ? false : true,
    },
  }
}

export default async function CoursePage({ params }: { params: { slug: string } }) {
  const isDraft = draftMode().isEnabled
  const client = getClient(isDraft ? { token: readToken } : undefined)
  
  // Fetch course data and FAQs
  const course = await client.fetch<CoursePayload | null>(courseBySlugQuery, { slug: params.slug })
  const faqs = await client.fetch<FAQ[]>(faqsByPageQuery, { pageLocation: 'course-detail' })
  
  // Transform image URLs
  const transformedCourse = course ? {
    ...course,
    imageUrl: course.featuredImage ? toProxiedUrl(urlForImage(course.featuredImage)?.url()) : null,
    instructor: course.instructor ? {
      ...course.instructor,
      imageUrl: course.instructor.image ? toProxiedUrl(urlForImage(course.instructor.image)?.url()) : null,
    } : undefined,
    relatedCourses: course.relatedCourses?.map(rc => ({
      ...rc,
      imageUrl: rc.featuredImage ? toProxiedUrl(urlForImage(rc.featuredImage)?.url()) : null,
    })),
  } : null

  // Generate structured data
  let structuredData = {}
  if (course) {
    structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: course.title,
      description: course.shortDescription || course.longDescription,
      provider: {
        '@type': 'Organization',
        name: 'SharifGPT',
        url: 'https://sharifgpt.com',
      },
      ...(course.instructor && {
        instructor: {
          '@type': 'Person',
          name: course.instructor.name,
          ...(course.instructor.bio && { description: course.instructor.bio }),
        },
      }),
      ...(course.price && {
        offers: {
          '@type': 'Offer',
          price: course.price,
          priceCurrency: 'IRR',
          availability: 'https://schema.org/InStock',
        },
      }),
      ...(course.rating && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: course.rating,
          reviewCount: course.reviewCount || 0,
        },
      }),
    }
  }

  return (
    <>
      {/* Structured Data */}
      {course && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}
      
      {/* Hidden overlays for Visual Editing */}
      <CourseOverlay course={course} />
      <FAQOverlay faqs={faqs || []} />
      
      {/* Client component with actual UI */}
      <CoursePageClient 
        courseData={transformedCourse} 
        faqsData={faqs || []}
      />
    </>
  )
}