import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const backend = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'https://backend.sharifgpt.com'
    const publishableApiKey = 'pk_2243c4f7a1f70eb2bb9b354ad7b22be869fca2633214edd7ee70637412a67bd4'
    
    const response = await fetch(`${backend}/store/cart/create`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-publishable-api-key': publishableApiKey,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      let errorData: any = {}
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { error: errorText || `HTTP ${response.status}: ${response.statusText}` }
      }
      return NextResponse.json(
        { success: false, error: errorData.error || errorData.message || errorText || `HTTP ${response.status}: ${response.statusText}` },
        { status: response.status }
      )
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error: any) {
    console.error('[PROXY-CART-CREATE] Error:', error)
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

