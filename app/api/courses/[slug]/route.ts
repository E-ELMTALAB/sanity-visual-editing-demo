import { NextResponse } from 'next/server'
import { getClient } from 'lib/sanity.client'
import { courseBySlugQuery } from 'lib/sanity.queries'
import { urlForImage } from 'lib/sanity.image'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const client = getClient()
    const course = await client.fetch(courseBySlugQuery, { slug: params.slug })
    
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }
    
    // Transform Sanity data to API response
    return NextResponse.json({
      _key: course._key,
      _type: course._type,
      title: course.title,
      description: course.description,
      category: course.category,
      price: course.price,
      originalPrice: course.originalPrice,
      instructor: course.instructor,
      duration: course.duration,
      students: course.students,
      rating: course.rating,
      reviewCount: course.reviewCount,
      level: course.level,
      imageUrl: course.image ? urlForImage(course.image)?.url() : null,
      slug: course.slug,
    })
  } catch (error) {
    console.error('Error fetching course:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

