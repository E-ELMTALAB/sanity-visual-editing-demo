import { NextRequest, NextResponse } from 'next/server'

export async function GET(_req: NextRequest) {
  try {
    const backend = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'https://backend.sharifgpt.com'
    return NextResponse.json({ success: true, backend })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Unknown error' }, { status: 500 })
  }
}


