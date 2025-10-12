/**
 * Single Product Sync API
 * POST /api/sync/products/[id] - Sync specific product
 * GET  /api/sync/products/[id] - Verify product sync
 */

import { NextRequest, NextResponse } from 'next/server'
import { ProductSyncService } from '@/lib/services/product-sync.service'
import { getClient } from '@/lib/sanity.client'

/**
 * GET /api/sync/products/[id]
 * Verify sync status for a specific product
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const syncService = new ProductSyncService()
    const verification = await syncService.verifyProductSync(id)

    return NextResponse.json({
      success: true,
      productId: id,
      verification,
    })
  } catch (error: any) {
    console.error('Error verifying product sync:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to verify product sync',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/sync/products/[id]
 * Sync a specific product
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Fetch product from Sanity
    const sanityClient = getClient()
    const product = await sanityClient.fetch(
      `*[_type == "product" && _id == $id][0]`,
      { id }
    )

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found in Sanity' },
        { status: 404 }
      )
    }

    // Sync product
    const syncService = new ProductSyncService()
    const result = await syncService.syncProductToMedusa(product)

    if (result.success) {
      return NextResponse.json({
        success: true,
        result,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          result,
        },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error('Error syncing product:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to sync product',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

