import { NextRequest, NextResponse } from 'next/server'
import { getMedusaBackendUrl } from '@/lib/proxy.server'

export async function GET(_req: NextRequest) {
  try {
    const backend = getMedusaBackendUrl()
    return NextResponse.json({ success: true, backend })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Unknown error' }, { status: 500 })
  }
}


