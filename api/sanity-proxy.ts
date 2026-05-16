import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@sanity/client'

const projectId = process.env.SANITY_PROJECT_ID
const dataset = process.env.SANITY_DATASET
const apiVersion = process.env.SANITY_API_VERSION || '2025-02-06'
const token = process.env.SANITY_API_TOKEN

if (!projectId || !dataset || !token) {
  throw new Error(
    '[sanity-proxy] Missing SANITY_PROJECT_ID, SANITY_DATASET or SANITY_API_TOKEN environment variables.',
  )
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
  perspective: 'published',
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
    const { query, params } = body

    if (typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Missing query string' })
    }

    const data = await client.fetch(query, params || {})

    return res.status(200).json({ success: true, data })
  } catch (error: any) {
    console.error('[sanity-proxy] Error executing query:', error)
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to execute Sanity query',
    })
  }
}


