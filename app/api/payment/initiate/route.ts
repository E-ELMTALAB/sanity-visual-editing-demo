import { NextRequest, NextResponse } from 'next/server'
import { getMedusaBackendUrl } from '@/lib/proxy.config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Forward the request to the Medusa backend (supports Cloudflare proxy)
    const backend = getMedusaBackendUrl()
    const response = await fetch(`${backend}/store/simple-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { 
          success: false, 
          error: errorData.error || `HTTP ${response.status}: ${response.statusText}` 
        },
        { status: response.status }
      )
    }

    const result = await response.json()
    return NextResponse.json(result)

  } catch (error) {
    console.error('Payment initiation proxy error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
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
