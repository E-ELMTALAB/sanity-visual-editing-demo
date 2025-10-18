/**
 * Product Sync API Endpoint
 * Allows manual triggering of product sync
 * GET  /api/sync/products - Get sync status
 * POST /api/sync/products - Trigger full sync
 */

import { NextRequest, NextResponse } from 'next/server'
import { ProductSyncService } from '@/lib/services/product-sync.service'

// Verify admin access (basic implementation)
function verifyAdminAccess(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const adminToken = process.env.ADMIN_SYNC_TOKEN

  if (!adminToken) {
    console.warn('ADMIN_SYNC_TOKEN not configured')
    return true // Allow in development if not configured
  }

  return authHeader === `Bearer ${adminToken}`
}

/**
 * GET /api/sync/products
 * Get current sync status
 */
export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    if (!verifyAdminAccess(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const syncService = new ProductSyncService()
    const status = await syncService.getSyncStatus()

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      status,
    })
  } catch (error: any) {
    console.error('Error getting sync status:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get sync status',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/sync/products
 * Trigger full product sync
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    if (!verifyAdminAccess(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const syncService = new ProductSyncService()
    const summary = await syncService.syncAllProducts()

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary,
    })
  } catch (error: any) {
    console.error('Error syncing products:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to sync products',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

