const requireEnv = (name: string): string => {
  const value = process.env[name]

  if (!value) {
    throw new Error(
      `[env] Missing required environment variable "${name}". Please add it to your .env.local or hosting provider settings.`,
    )
  }

  return value
}

const toNumber = (value: string | undefined, fallback: number): number => {
  if (!value) {
    return fallback
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export const SANITY_PROJECT_ID = requireEnv('SANITY_PROJECT_ID')
export const SANITY_DATASET = requireEnv('SANITY_DATASET')
export const SANITY_API_TOKEN = requireEnv('SANITY_API_TOKEN')
export const SANITY_API_VERSION = process.env.SANITY_API_VERSION || '2025-02-06'

export const OPENAI_API_KEY = requireEnv('OPENAI_API_KEY')
export const OPENAI_MODEL =
  process.env.OPENAI_PRODUCT_ENRICH_MODEL || process.env.OPENAI_MODEL || 'gpt-4.1-mini'

export const ENRICH_BATCH_LIMIT = toNumber(process.env.AI_ENRICH_BATCH_LIMIT, 10)
export const ENRICH_THROTTLE_MS = toNumber(process.env.AI_ENRICH_THROTTLE_MS, 300)




