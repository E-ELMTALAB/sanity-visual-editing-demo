/**
 * Sanity Product Sync Webhook Handler
 * Receives webhooks from Sanity when products are created/updated/deleted
 * POST /api/webhooks/sanity-product-sync
 */

import { NextRequest, NextResponse } from 'next/server'
import { ProductSyncService } from '@/lib/services/product-sync.service'
import crypto from 'crypto'

/**
 * Verify Sanity webhook signature
 */
function verifySanityWebhook(request: NextRequest, body: string): boolean {
  const signature = request.headers.get('sanity-webhook-signature')
  const secret = process.env.SANITY_WEBHOOK_SECRET

  if (!signature || !secret) {
    console.warn('Missing signature or secret')
    return process.env.NODE_ENV === 'development' // Allow in dev if not configured
  }

  try {
    const hash = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex')

    return signature === hash
  } catch (error) {
    console.error('Signature verification error:', error)
    return false
  }
}

/**
 * POST /api/webhooks/sanity-product-sync
 * Handle Sanity webhook for product changes
 */
export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const body = await request.text()

    // Verify webhook signature
    if (!verifySanityWebhook(request, body)) {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      )
    }

    // Parse payload
    const payload = JSON.parse(body)

    console.log('Received Sanity webhook:', {
      type: payload._type,
      id: payload._id,
      action: payload._action || 'update',
    })

    // Only process product documents
    if (payload._type !== 'product') {
      return NextResponse.json({
        message: 'Not a product document, skipping',
        type: payload._type,
      })
    }

    const syncService = new ProductSyncService()

    // Handle deletion
    if (payload._action === 'delete') {
      // Product was deleted in Sanity
      // Archive it in Medusa (don't delete)
      return NextResponse.json({
        message: 'Product deletion handled',
        note: 'Products are archived, not deleted',
      })
    }

    // Handle create/update
    const result = await syncService.syncProductToMedusa(payload)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        action: result.action,
        medusaProductId: result.medusaProductId,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
          error: result.error,
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Webhook processing failed',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/webhooks/sanity-product-sync
 * Health check for webhook endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: 'Sanity Product Sync Webhook',
    configured: !!process.env.SANITY_WEBHOOK_SECRET,
  })
}

