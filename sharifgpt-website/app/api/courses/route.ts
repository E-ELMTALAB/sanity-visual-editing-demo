import { NextResponse } from 'next/server'
import { getClient } from '@/lib/sanity.client'
import { courseListQuery } from '@/lib/sanity.queries'

export async function GET() {
  try {
    const client = getClient()
    const courses = await client.fetch(courseListQuery)
    return NextResponse.json(courses)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
  }
}
