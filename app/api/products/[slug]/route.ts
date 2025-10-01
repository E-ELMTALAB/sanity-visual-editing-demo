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

    // Debug: log the product data to see if related content is present
    console.log('Product data:', {
      name: product.name,
      slug: product.slug,
      relatedProductsCount: Array.isArray(product.relatedProducts) ? product.relatedProducts.length : 'not array',
      relatedBlogsCount: Array.isArray(product.relatedBlogs) ? product.relatedBlogs.length : 'not array',
      relatedProducts: product.relatedProducts,
      relatedBlogs: product.relatedBlogs
    })
    
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
       relatedProducts: Array.isArray(product.relatedProducts) ? product.relatedProducts
         .filter((related: any) => related && related._id) // Filter out null/invalid references
         .map((related: any) => ({
           id: related._id,
           title: related.name || 'Untitled Product',
           slug: related.slug || '',
           price: related.price || 0,
           originalPrice: related.originalPrice || 0,
           discountPercentage: related.discountPercentage || 0,
           image: related.image ? urlForImage(related.image)?.url() : null,
           category: related.category || '',
           rating: related.rating || 0,
           reviewCount: related.reviewCount || 0
         })) : [],
       relatedBlogs: Array.isArray(product.relatedBlogs) ? product.relatedBlogs
         .filter((blog: any) => blog && blog._id) // Filter out null/invalid references
         .map((blog: any) => ({
           id: blog._id,
           title: blog.title || 'Untitled Blog',
           slug: blog.slug || '',
           excerpt: blog.excerpt || '',
           coverImage: blog.coverImage ? urlForImage(blog.coverImage)?.url() : null,
           publishedAt: blog.publishedAt || '',
           tags: blog.tags || []
         })) : [],
       slug: product.slug,
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

