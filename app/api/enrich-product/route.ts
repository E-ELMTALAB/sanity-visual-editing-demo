import { NextResponse } from 'next/server'

import { enrichProductById } from 'scripts/enrichment/enrichProducts'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    const documentId = body?.documentId

    if (!documentId || typeof documentId !== 'string') {
      return NextResponse.json(
        { ok: false, error: 'Request body must include a documentId string.' },
        { status: 400 },
      )
    }

    await enrichProductById(documentId)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('enrich-product API error', error)
    const message = error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ ok: false, error: 'Method not allowed' }, { status: 405 })
}

