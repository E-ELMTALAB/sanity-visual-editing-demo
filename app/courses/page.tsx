import { draftMode } from 'next/headers'
import { getClient } from 'lib/sanity.client'
import { readToken } from 'lib/sanity.api'
import { allCoursesQuery, faqsByPageQuery } from 'lib/sanity.queries'
import { urlForImage } from 'lib/sanity.image'
import type { CoursePayload, FAQ } from 'types'
import type { Metadata } from 'next'

// @ts-ignore - TypeScript may not resolve this import correctly due to dynamic route folder naming
import CoursesPageClient from './page-client'
import CoursesListOverlay from '@/components/site/course/CoursesListOverlay'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'دوره‌های آموزشی آنلاین | SharifGPT',
    description: 'بهترین دوره‌های آموزشی هوش مصنوعی، برنامه‌نویسی، طراحی و دیجیتال مارکتینگ با اساتید مجرب. آموزش با گواهینامه معتبر',
    keywords: ['دوره آموزشی', 'هوش مصنوعی', 'برنامه‌نویسی', 'طراحی', 'آموزش آنلاین', 'ChatGPT', 'Python', 'UI/UX'],
    openGraph: {
      title: 'دوره‌های آموزشی آنلاین | SharifGPT',
      description: 'بهترین دوره‌های آموزشی هوش مصنوعی، برنامه‌نویسی، طراحی و دیجیتال مارکتینگ',
      type: 'website',
      url: 'https://sharifgpt.com/courses',
      siteName: 'SharifGPT',
      locale: 'fa_IR',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'دوره‌های آموزشی آنلاین',
      description: 'بهترین دوره‌های آموزشی با اساتید مجرب',
    },
    alternates: {
      canonical: 'https://sharifgpt.com/courses',
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function CoursesPage() {
  const isDraft = draftMode().isEnabled
  const client = getClient(isDraft ? { token: readToken } : undefined)

  // Fetch courses and FAQs
  const courses = await client.fetch<CoursePayload[]>(allCoursesQuery)
  const faqs = await client.fetch<FAQ[]>(faqsByPageQuery, { pageLocation: 'courses-listing' })

  // Transform course data with image URLs
  const transformedCourses = courses.map((course) => ({
    ...course,
    imageUrl: course.featuredImage ? urlForImage(course.featuredImage)?.url() : null,
    instructorName: course.instructor?.name || undefined,
  }))

  // Calculate category counts
  const categoryCounts: Record<string, number> = {}
  courses.forEach((course) => {
    if (course.category) {
      categoryCounts[course.category] = (categoryCounts[course.category] || 0) + 1
    }
  })

  const categories = [
    { id: 'all', name: 'همه دوره‌ها', value: 'all', count: courses.length },
    { id: 'ai', name: 'هوش مصنوعی', value: 'ai', count: categoryCounts['ai'] || 0 },
    { id: 'programming', name: 'برنامه‌نویسی', value: 'programming', count: categoryCounts['programming'] || 0 },
    { id: 'design', name: 'طراحی', value: 'design', count: categoryCounts['design'] || 0 },
    { id: 'marketing', name: 'دیجیتال مارکتینگ', value: 'marketing', count: categoryCounts['marketing'] || 0 },
    { id: 'business', name: 'کسب و کار', value: 'business', count: categoryCounts['business'] || 0 },
    { id: 'web-development', name: 'توسعه وب', value: 'web-development', count: categoryCounts['web-development'] || 0 },
    { id: 'data-science', name: 'داده و تحلیل', value: 'data-science', count: categoryCounts['data-science'] || 0 },
  ].filter((cat) => cat.id === 'all' || cat.count > 0) // Only show categories with courses

  // Generate structured data
  const collectionPageStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'دوره‌های آموزشی آنلاین',
    description: 'مجموعه کامل دوره‌های آموزشی SharifGPT در زمینه هوش مصنوعی، برنامه‌نویسی و فناوری',
    url: 'https://sharifgpt.com/courses',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: transformedCourses.slice(0, 10).map((course, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Course',
          name: course.title,
          description: course.shortDescription || course.longDescription,
          url: `https://sharifgpt.com/courses/${course.slug?.current}`,
          provider: {
            '@type': 'Organization',
            name: 'SharifGPT',
            url: 'https://sharifgpt.com',
          },
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
        },
      })),
    },
  }

  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'خانه',
        item: 'https://sharifgpt.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'دوره‌ها',
        item: 'https://sharifgpt.com/courses',
      },
    ],
  }

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionPageStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />

      {/* Hidden overlays for Visual Editing */}
      <CoursesListOverlay courses={transformedCourses} faqs={faqs} />

      {/* Client component with actual UI */}
      <CoursesPageClient coursesData={transformedCourses} faqsData={faqs} categoriesData={categories} />
    </>
  )
}