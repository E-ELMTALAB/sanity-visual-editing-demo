import { NextRequest, NextResponse } from 'next/server'
import { getMedusaBackendUrl, MEDUSA_PUBLISHABLE_KEY } from '@/lib/proxy.server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const backend = getMedusaBackendUrl()
    const publishableApiKey = MEDUSA_PUBLISHABLE_KEY
    const response = await fetch(`${backend}/store/zarinpal/verify`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-publishable-api-key': publishableApiKey,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json({ success: false, error: errorData.error || `HTTP ${response.status}` }, { status: response.status })
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Unknown error' }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    },
  })
}


