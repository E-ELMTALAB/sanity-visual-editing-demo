import { NextRequest, NextResponse } from 'next/server'

/**
 * Sanity Webhook Handler - Automatic Product Sync
 * 
 * This endpoint receives webhooks from Sanity when products are created/updated/deleted
 * and automatically syncs them to Medusa.
 * 
 * Webhook URL: https://your-domain.com/api/webhooks/sanity-sync
 */

const MEDUSA_SYNC_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL 
  ? `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/products/sync-from-sanity`
  : 'https://backend.sharifgpt.com/store/products/sync-from-sanity';

const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || 
  'pk_2243c4f7a1f70eb2bb9b354ad7b22be869fca2633214edd7ee70637412a67bd4';

// Simple secret for webhook verification (optional but recommended)
const WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET || 'your-webhook-secret';

export async function POST(request: NextRequest) {
  console.log('[SANITY-WEBHOOK] Received webhook');

  try {
    // 1. Verify webhook secret (optional security)
    const secretHeader = request.headers.get('sanity-webhook-secret');
    if (WEBHOOK_SECRET && secretHeader !== WEBHOOK_SECRET) {
      console.error('[SANITY-WEBHOOK] Invalid webhook secret');
      return NextResponse.json(
        { success: false, error: 'Invalid webhook secret' },
        { status: 401 }
      );
    }

    // 2. Parse webhook payload
    const payload = await request.json();
    console.log('[SANITY-WEBHOOK] Payload:', JSON.stringify(payload, null, 2));

    // 3. Extract product data from webhook
    // Sanity sends: { _id, _type, name, slug, ... }
    const product = payload;

    if (product._type !== 'product') {
      console.log('[SANITY-WEBHOOK] Not a product, ignoring');
      return NextResponse.json({ success: true, message: 'Not a product' });
    }

    // 4. Check if product was deleted
    if (payload._deleted || payload._rev === null) {
      console.log('[SANITY-WEBHOOK] Product deleted, skipping sync');
      // TODO: Handle product deletion in Medusa if needed
      return NextResponse.json({ 
        success: true, 
        message: 'Product deletion detected (not syncing to Medusa)' 
      });
    }

    // 5. Format product for Medusa sync API
    const formattedProduct = {
      _id: product._id,
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      options: product.options || []
    };

    console.log('[SANITY-WEBHOOK] Syncing product to Medusa:', formattedProduct.name);

    // 6. Send to Medusa sync API
    const syncResponse = await fetch(MEDUSA_SYNC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': PUBLISHABLE_KEY
      },
      body: JSON.stringify({ products: [formattedProduct] })
    });

    if (!syncResponse.ok) {
      const errorText = await syncResponse.text();
      throw new Error(`Medusa sync failed: ${syncResponse.status} ${errorText}`);
    }

    const syncResult = await syncResponse.json();
    console.log('[SANITY-WEBHOOK] Sync successful:', syncResult);

    return NextResponse.json({
      success: true,
      message: 'Product synced to Medusa successfully',
      result: syncResult
    });

  } catch (error: any) {
    console.error('[SANITY-WEBHOOK] Error:', error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, sanity-webhook-secret',
    },
  });
}


