import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/products/prices
 * Fetch product prices from Medusa backend by Sanity slugs
 * 
 * Body:
 * {
 *   "slugs": ["chatgpt-plus", "claude-pro"]
 * }
 * 
 * Response:
 * {
 *   "prices": {
 *     "chatgpt-plus": {
 *       "variants": [
 *         {
 *           "name": "1 ماهه",
 *           "price": 100000,
 *           "price_rials": 1000000,
 *           "variant_id": "variant_01..."
 *         }
 *       ]
 *     }
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slugs } = body

    if (!slugs || !Array.isArray(slugs) || slugs.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Slugs array is required' },
        { status: 400 }
      )
    }

    const backend = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'https://backend.sharifgpt.com'
    const prices: Record<string, any> = {}

    // Fetch prices for each slug from Medusa
    for (const slug of slugs) {
      try {
        // Query Medusa Product Module for product by handle
        const response = await fetch(`${backend}/store/products?handle=${slug}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || 'pk_2243c4f7a1f70eb2bb9b354ad7b22be869fca2633214edd7ee70637412a67bd4'
          },
        })

        if (!response.ok) {
          console.warn(`[PRICE-FETCH] Product not found: ${slug}`)
          prices[slug] = {
            variants: [],
            error: 'Product not found'
          }
          continue
        }

        const data = await response.json()
        const products = data.products || []

        if (products.length === 0) {
          console.warn(`[PRICE-FETCH] No products returned for slug: ${slug}`)
          prices[slug] = {
            variants: [],
            error: 'Product not found'
          }
          continue
        }

        const product = products[0]
        const variants = product.variants || []

        // Transform variants to frontend-friendly format
        prices[slug] = {
          product_id: product.id,
          variants: variants.map((variant: any) => {
            // Find IRR price
            const irrPrice = variant.prices?.find(
              (p: any) => p.currency_code === 'irr'
            )
            
            const priceInRials = irrPrice?.amount || 0
            const priceInToman = Math.round(priceInRials / 10)

            return {
              variant_id: variant.id,
              name: variant.title,
              sku: variant.sku,
              price: priceInToman, // Display price in Toman
              price_rials: priceInRials, // Actual price in Rials
              currency: 'IRT', // Toman
              original_price: variant.metadata?.original_price_toman || null,
              discount_percentage: variant.metadata?.discount_percentage || 0
            }
          })
        }

      } catch (error: any) {
        console.error(`[PRICE-FETCH] Error fetching price for ${slug}:`, error.message)
        prices[slug] = {
          variants: [],
          error: error.message
        }
      }
    }

    return NextResponse.json({
      success: true,
      prices: prices
    })

  } catch (error: any) {
    console.error('[PRICE-FETCH] Error:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
