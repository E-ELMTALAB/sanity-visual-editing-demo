import { NextRequest, NextResponse } from 'next/server'
import { getMedusaBackendUrl, MEDUSA_PUBLISHABLE_KEY } from '@/lib/proxy.server'

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

    const backend = getMedusaBackendUrl()
    const prices: Record<string, any> = {}

    // Fetch prices for each slug from Medusa
    for (const slug of slugs) {
      try {
        // Query Medusa Product Module for product by handle
        // Important: Must include fields=*variants.prices to get price data (Medusa v2 standard)
        const response = await fetch(`${backend}/store/products?handle=${slug}&fields=*variants.prices`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-publishable-api-key': MEDUSA_PUBLISHABLE_KEY
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
        // Following Medusa v2 standard: prices stored in smallest currency unit (Rials)
        prices[slug] = {
          product_id: product.id,
          variants: variants.map((variant: any) => {
            // Get price from standard Medusa prices array (currency_code + amount)
            const irrPrice = variant.prices?.find((p: any) => p.currency_code === 'irr')
            const priceInRials = irrPrice?.amount || 0
            const priceInToman = Math.round(priceInRials / 10)

            return {
              variant_id: variant.id,
              name: variant.title,
              sku: variant.sku,
              price: priceInToman, // Display price in Toman
              price_rials: priceInRials, // Actual price in Rials (from Medusa)
              currency: 'IRT', // Toman
              original_price: null, // Can be added to Medusa prices if needed
              discount_percentage: 0
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
