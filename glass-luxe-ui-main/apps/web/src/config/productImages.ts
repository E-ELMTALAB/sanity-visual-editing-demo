/**
 * Product Image Configuration
 * Maps product slugs to their image filenames in Arvan Cloud Storage
 * Fallback hierarchy: Local Assets → Arvan Cloud → Sanity CMS
 */

const ARVAN_BUCKET_URL = 'https://sharifgptwebsiteimages.s3.ir-thr-at1.arvanstorage.ir'

export interface ProductImageConfig {
  [productSlug: string]: {
    filename: string
    arvanUrl: string
  }
}

/**
 * Product slug to image filename mapping
 * All images are stored in /images/ folder in Arvan
 */
export const PRODUCT_IMAGES: ProductImageConfig = {
  // ChatGPT Products
  'chatgpt-pro': {
    filename: 'chatgpt-pro.webp',
    arvanUrl: `${ARVAN_BUCKET_URL}/images/chatgpt-pro.webp`
  },
  'chatgpt-plus': {
    filename: 'chatgpt-plus.webp',
    arvanUrl: `${ARVAN_BUCKET_URL}/images/chatgpt-plus.webp`
  },
  'chatgpt-plus-shared': {
    filename: 'chatgpt_shared.webp',
    arvanUrl: `${ARVAN_BUCKET_URL}/images/chatgpt_shared.webp`
  },

  // Claude
  'claude-pro': {
    filename: 'claude.webp',
    arvanUrl: `${ARVAN_BUCKET_URL}/images/claude.webp`
  },

  // Cursor
  'cursor-ai': {
    filename: 'cursor.webp',
    arvanUrl: `${ARVAN_BUCKET_URL}/images/cursor.webp`
  },

  // Copilot
  'github-copilot': {
    filename: 'copilot.webp',
    arvanUrl: `${ARVAN_BUCKET_URL}/images/copilot.webp`
  },

  // Communication/Streaming
  'telegram-premium': {
    filename: 'telegram.webp',
    arvanUrl: `${ARVAN_BUCKET_URL}/images/telegram.webp`
  },
  'spotify-premium': {
    filename: 'spotify.webp',
    arvanUrl: `${ARVAN_BUCKET_URL}/images/spotify.webp`
  },

  // Creative Tools
  'runway-ai': {
    filename: 'runway.webp',
    arvanUrl: `${ARVAN_BUCKET_URL}/images/runway.webp`
  },
  'midjourney-ai': {
    filename: 'midjourney.webp',
    arvanUrl: `${ARVAN_BUCKET_URL}/images/midjourney.webp`
  },
  'leonardo-ai': {
    filename: 'leonardo.webp',
    arvanUrl: `${ARVAN_BUCKET_URL}/images/leonardo.webp`
  },
  'kling-ai': {
    filename: 'kling.webp',
    arvanUrl: `${ARVAN_BUCKET_URL}/images/kling.webp`
  },

  // AI Models
  'grok-shared': {
    filename: 'grok.webp',
    arvanUrl: `${ARVAN_BUCKET_URL}/images/grok.webp`
  },
  'gemini-ultra': {
    filename: 'gemini.webp',
    arvanUrl: `${ARVAN_BUCKET_URL}/images/gemini.webp`
  },
  'google-ai-gemini': {
    filename: 'gemini.webp',
    arvanUrl: `${ARVAN_BUCKET_URL}/images/gemini.webp`
  },

  // Education/Productivity
  'gamma-account': {
    filename: 'gamma.webp',
    arvanUrl: `${ARVAN_BUCKET_URL}/images/gamma.webp`
  },
  'doulingo-plus-max': {
    filename: 'doulingo.webp',
    arvanUrl: `${ARVAN_BUCKET_URL}/images/doulingo.webp`
  },

  // Additional products mappings can be added here
  // Pattern: 'product-slug': { filename: 'imagefile.webp', arvanUrl: '...' }
}

/**
 * Get image configuration for a product
 * @param productSlug - The product slug to lookup
 * @returns Object with filename and arvanUrl, or null if not found
 */
export function getProductImageConfig(productSlug: string) {
  return PRODUCT_IMAGES[productSlug] || null
}

/**
 * Check if a product has a configured image
 * @param productSlug - The product slug to check
 */
export function hasProductImage(productSlug: string): boolean {
  return !!PRODUCT_IMAGES[productSlug]
}

/**
 * Get Arvan URL for a product
 * @param productSlug - The product slug
 */
export function getArvanImageUrl(productSlug: string): string | null {
  const config = PRODUCT_IMAGES[productSlug]
  return config?.arvanUrl || null
}

/**
 * Get local asset path for a product image
 * @param productSlug - The product slug
 */
export function getLocalAssetImagePath(productSlug: string): string | null {
  const config = PRODUCT_IMAGES[productSlug]
  return config ? `/assets/images/${config.filename}` : null
}
