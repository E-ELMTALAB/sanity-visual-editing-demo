import { NextResponse } from 'next/server'
import { getClient } from 'lib/sanity.client'
import { allCoursesQuery } from 'lib/sanity.queries'

export async function GET() {
  try {
    const client = getClient()
    const courses = await client.fetch(allCoursesQuery)
    
    return NextResponse.json(courses || [])
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
  }
}
