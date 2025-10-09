import { NextResponse } from 'next/server'
import { getClient } from 'lib/sanity.client'
import { productsListQuery } from 'lib/sanity.queries'

export async function GET() {
  try {
    const client = getClient()
    const products = await client.fetch(productsListQuery)
    
    return NextResponse.json(products || [])
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
