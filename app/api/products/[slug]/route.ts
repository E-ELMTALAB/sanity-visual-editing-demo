import { NextResponse } from 'next/server'
import { getClient } from 'lib/sanity.client'
import { productBySlugQuery } from 'lib/sanity.queries'
import { urlForImage } from 'lib/sanity.image'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const client = getClient()
    const product = await client.fetch(productBySlugQuery, { slug: params.slug })
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    // Transform Sanity data to API response
    return NextResponse.json({
      _key: product._key,
      _type: product._type,
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.discountedPrice || product.price,
      discountedPrice: product.discountedPrice,
      originalPrice: product.originalPrice,
      discountPercentage: product.discountPercentage,
      imageUrl: product.image ? urlForImage(product.image)?.url() : null,
      slug: product.slug,
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

