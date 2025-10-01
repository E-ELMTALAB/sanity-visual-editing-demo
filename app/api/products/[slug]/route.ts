import { NextResponse } from 'next/server'
import { getClient } from 'lib/sanity.client'
import { productDocBySlugQuery } from 'lib/sanity.queries'
import { urlForImage } from 'lib/sanity.image'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const client = getClient()
    const product = await client.fetch(productDocBySlugQuery, { slug: params.slug })
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    // Transform Sanity data to API response
    return NextResponse.json({
      _id: product._id,
      _type: product._type,
      name: product.name,
      description: product.description,
      longDescription: product.longDescription,
      category: product.category,
      price: product.price,
      discountedPrice: product.discountPercentage && product.originalPrice && product.price
        ? product.price
        : undefined,
      originalPrice: product.originalPrice,
      discountPercentage: product.discountPercentage,
      imageUrl: product.image ? urlForImage(product.image)?.url() : null,
      galleryUrls: Array.isArray(product.gallery) ? product.gallery.map((img: any) => (img ? urlForImage(img)?.url() : null)) : [],
      features: product.features || [],
      badges: product.badges || [],
      inStock: product.inStock,
      rating: product.rating ?? null,
      reviewCount: product.reviewCount ?? 0,
      options: Array.isArray(product.options) ? product.options : [],
      slug: product.slug,
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

