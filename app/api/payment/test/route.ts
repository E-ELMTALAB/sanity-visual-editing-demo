import { NextRequest, NextResponse } from 'next/server'

export async function GET(_req: NextRequest) {
  try {
    const backend = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'https://backend.sharifgpt.com'
    return NextResponse.json({ success: true, backend })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Unknown error' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test the Medusa backend CORS endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/store/cors-test`, {
      method: 'GET',
    })

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Backend not accessible: ${response.status}` 
        },
        { status: 500 }
      )
    }

    const result = await response.json()
    return NextResponse.json({
      success: true,
      message: 'Payment proxy is working correctly',
      backend: result,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Payment test proxy error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Backend connection failed'
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
