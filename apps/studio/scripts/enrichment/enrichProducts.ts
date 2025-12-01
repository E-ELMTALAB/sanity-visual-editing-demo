import { openai } from '../../lib/openaiClient'
import {
  ENRICH_BATCH_LIMIT,
  ENRICH_THROTTLE_MS,
  OPENAI_MODEL,
} from '../../lib/env.server'
import { sanityServerClient } from '../../lib/sanityServerClient'

export const TARGET_FIELDS = ['shortDescription', 'seoTitle', 'seoDescription', 'tags'] as const

export type TargetField = (typeof TARGET_FIELDS)[number]

export type ProductForEnrichment = {
  _id: string
  _rev?: string
  name?: string
  description?: string
  shortDescription?: string | null
  seoTitle?: string | null
  seoDescription?: string | null
  tags?: string[]
  aiEnriched?: boolean
}

export type GeneratedFields = {
  shortDescription: string | null
  seoTitle: string | null
  seoDescription: string | null
  tags: string[] | null
}

const PRODUCT_PROJECTION = `
  _id,
  _rev,
  name,
  description,
  shortDescription,
  seoTitle,
  seoDescription,
  tags,
  aiEnriched
`

const SYSTEM_PROMPT = [
  'You are an expert Persian marketing copywriter and SEO specialist.',
  'You receive a product description and must return JSON with the requested fields.',
  'Rules:',
  '- All text must be in fluent Persian (Farsi).',
  '- Reuse and emphasize important keywords from the description.',
  '- shortDescription: 1-2 engaging sentences.',
  '- seoTitle: <= 60 characters, natural and keyword-rich.',
  '- seoDescription: 130-160 characters, persuasive meta description.',
  '- tags: 5-10 concise Persian keywords as an array of strings.',
  '- If a requested field cannot be produced, set it to null.',
  '- Return ONLY valid JSON with the requested keys.',
].join('\n')

const normalizeString = (value: unknown): string | null => {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()
  return trimmed.length ? trimmed : null
}

const normalizeTags = (value: unknown): string[] | null => {
  if (!Array.isArray(value)) {
    return null
  }

  const cleaned = value
    .map((tag) => normalizeString(tag))
    .filter((tag): tag is string => Boolean(tag))

  if (!cleaned.length) {
    return null
  }

  return Array.from(new Set(cleaned))
}

export async function fetchProductsNeedingEnrichment(
  limit = ENRICH_BATCH_LIMIT,
): Promise<ProductForEnrichment[]> {
  const query = `
    *[
      _type == "product" &&
      defined(description) &&
      (aiEnriched != true)
    ] | order(_updatedAt asc)[0...$limit]{
      ${PRODUCT_PROJECTION}
    }
  `

  return sanityServerClient.fetch<ProductForEnrichment[]>(query, { limit })
}

export async function fetchProductById(documentId: string): Promise<ProductForEnrichment | null> {
  const query = `
    *[_id == $id][0]{
      ${PRODUCT_PROJECTION}
    }
  `

  return sanityServerClient.fetch<ProductForEnrichment | null>(query, { id: documentId })
}

export async function generateFieldsFromDescription(
  description: string,
  title: string | undefined,
  fieldsToFill: TargetField[],
): Promise<GeneratedFields> {
  if (!fieldsToFill.length) {
    return {
      shortDescription: null,
      seoTitle: null,
      seoDescription: null,
      tags: null,
    }
  }

  const requestedFields = JSON.stringify(fieldsToFill)
  const userPrompt = [
    `Product title (optional): ${title || 'N/A'}`,
    '',
    'Product description:',
    `"""${description}"""`,
    '',
    `Fields to fill: ${requestedFields}`,
    '',
    'Return a JSON object with this shape:',
    '{',
    '  "shortDescription": string | null,',
    '  "seoTitle": string | null,',
    '  "seoDescription": string | null,',
    '  "tags": string[] | null',
    '}',
    'Only include keys listed in "Fields to fill". For others, set null.',
  ].join('\n')

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: userPrompt },
  ] as const

  const completion = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    temperature: 0.3,
    response_format: { type: 'json_object' },
    messages,
  })

  const content = completion.choices[0]?.message?.content

  if (!content) {
    throw new Error('OpenAI returned an empty response for enrichment fields.')
  }

  let parsed: Record<string, unknown>

  try {
    parsed = JSON.parse(content)
  } catch (error) {
    console.error('Failed to parse OpenAI response. Raw output:', content)
    throw error
  }

  const result: GeneratedFields = {
    shortDescription: null,
    seoTitle: null,
    seoDescription: null,
    tags: null,
  }

  for (const field of fieldsToFill) {
    const value = parsed[field]

    if (field === 'tags') {
      result.tags = normalizeTags(value)
    } else {
      result[field] = normalizeString(value)
    }
  }

  return result
}

const isFieldMissing = (value: unknown): boolean => {
  if (value === undefined || value === null) {
    return true
  }

  if (typeof value === 'string') {
    return value.trim().length === 0
  }

  if (Array.isArray(value)) {
    return value.length === 0
  }

  return false
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function enrichSingleProduct(product: ProductForEnrichment): Promise<void> {
  if (!product.description) {
    console.warn(`Skipping product ${product._id} because it has no description.`)
    return
  }

  const missingFields = TARGET_FIELDS.filter((field) => {
    const value = (product as Record<string, unknown>)[field]
    return isFieldMissing(value)
  })

  if (missingFields.length === 0) {
    console.log(`Product ${product._id} already has all target fields.`)
    return
  }

  console.log(
    `Enriching product ${product._id} (${product.name || 'Untitled'}) → missing fields: ${missingFields.join(', ')}`,
  )

  const generated = await generateFieldsFromDescription(
    product.description,
    product.name,
    missingFields,
  )

  const patchData: Record<string, string | string[] | boolean> = {}

  for (const field of missingFields) {
    const value = generated[field]

    if (typeof value === 'string' && value.trim().length > 0) {
      patchData[field] = value.trim()
      continue
    }

    if (Array.isArray(value) && value.length > 0) {
      patchData[field] = value
    }
  }

  if (!Object.keys(patchData).length) {
    console.log(`OpenAI returned no usable data for product ${product._id}.`)
    return
  }

  patchData.aiEnriched = true

  let patch = sanityServerClient.patch(product._id)

  if (product._rev) {
    patch = patch.ifRevisionId(product._rev)
  }

  await patch.set(patchData).commit()
  console.log(`✅ Product ${product._id} enriched successfully.`)
}

export async function runEnrichment(limit = ENRICH_BATCH_LIMIT): Promise<void> {
  const products = await fetchProductsNeedingEnrichment(limit)

  if (!products.length) {
    console.log('No products need enrichment. ✅')
    return
  }

  console.log(`Found ${products.length} products to enrich.`)

  for (const product of products) {
    try {
      await enrichSingleProduct(product)
    } catch (error) {
      console.error(`Error enriching product ${product._id}`, error)
    }

    if (ENRICH_THROTTLE_MS > 0) {
      await delay(ENRICH_THROTTLE_MS)
    }
  }

  console.log('Finished AI enrichment run. 🎉')
}

export async function enrichProductById(documentId: string): Promise<void> {
  if (!documentId) {
    throw new Error('Document ID is required to run enrichment.')
  }

  const product = await fetchProductById(documentId)

  if (!product) {
    throw new Error(`Product with ID "${documentId}" was not found.`)
  }

  await enrichSingleProduct(product)
}

