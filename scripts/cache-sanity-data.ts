/**
 * Build-time script to fetch and cache all Sanity content
 * This runs BEFORE the Next.js build to ensure all data is available statically
 * 
 * Usage: tsx scripts/cache-sanity-data.ts
 * 
 * What it does:
 * 1. Fetches all homepage, product, course, blog, and FAQ data from Sanity
 * 2. Saves to public/sanity-cache/ as static JSON files
 * 3. These files are then served statically in production (NO runtime API calls)
 */

import { createClient } from '@sanity/client'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

// Get Sanity credentials from environment
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-06-21'
const readToken = process.env.SANITY_API_READ_TOKEN || ''

// Cache directory - served as static files
const CACHE_DIR = join(process.cwd(), 'public', 'sanity-cache')

// Color output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[36m',
  bold: '\x1b[1m',
}

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`)
}

function logError(message: string) {
  log(`❌ ${message}`, colors.red)
}

function logSuccess(message: string) {
  log(`✅ ${message}`, colors.green)
}

function logInfo(message: string) {
  log(`ℹ️  ${message}`, colors.blue)
}

function logWarning(message: string) {
  log(`⚠️  ${message}`, colors.yellow)
}

async function ensureCacheDirectory() {
  try {
    await mkdir(CACHE_DIR, { recursive: true })
    logSuccess(`Cache directory ready: ${CACHE_DIR}`)
  } catch (error) {
    logError(`Failed to create cache directory: ${error}`)
    throw error
  }
}

async function saveCache(filename: string, data: any) {
  try {
    const filepath = join(CACHE_DIR, filename)
    await writeFile(filepath, JSON.stringify(data, null, 2), 'utf-8')
    const size = JSON.stringify(data).length
    const sizeKB = (size / 1024).toFixed(2)
    logSuccess(`Cached: ${filename} (${sizeKB}KB)`)
  } catch (error) {
    logError(`Failed to save cache ${filename}: ${error}`)
    throw error
  }
}

async function main() {
  try {
    log('', colors.bold)
    log('═══════════════════════════════════════════════════════════', colors.bold)
    log('🚀 SANITY BUILD-TIME CACHE FETCHER', colors.bold)
    log('═══════════════════════════════════════════════════════════', colors.bold)
    log('', colors.bold)

    // Check credentials
    if (!projectId) {
      logWarning('NEXT_PUBLIC_SANITY_PROJECT_ID not set, skipping cache generation')
      logInfo('Cache generation is optional - builds will still work')
      return
    }

    logInfo(`Project: ${projectId}`)
    logInfo(`Dataset: ${dataset}`)
    logInfo(`API Version: ${apiVersion}`)
    log('')

    // Create Sanity client
    const client = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      ...(readToken && { token: readToken }),
    })

    logInfo('Connecting to Sanity API...')
    await ensureCacheDirectory()
    log('')

    // ===== QUERIES =====
    const queries = {
      // Homepage
      homepage: `{
        "hero": *[_type == "hero"][0],
        "settings": *[_type == "settings"][0],
        "topBanners": *[_type == "banner" && position == "top"] | order(order asc),
        "promoCards": *[_type == "promoCard"] | order(order asc),
        "discountedProducts": *[_type == "product" && discount > 0] | order(discount desc)[0:12],
        "socialMediaProducts": *[_type == "product" && category == "social-media"] | order(order asc)[0:8],
        "educationalProducts": *[_type == "product" && category == "education"] | order(order asc)[0:8],
      }`,

      // All products
      allProducts: `*[_type == "product"] {
        _id,
        _type,
        name,
        description,
        "slug": slug.current,
        price,
        originalPrice,
        discount,
        category,
        image,
        images[],
        "popular": popularity > 100,
      } | order(order asc)`,

      // All categories
      categories: `*[_type == "category"] {
        _id,
        name,
        "slug": slug.current,
        description,
        "productCount": count(*[_type == "product" && category == ^.slug.current]),
      } | order(order asc)`,

      // All courses
      courses: `*[_type == "course"] {
        _id,
        _type,
        name,
        description,
        "slug": slug.current,
        price,
        originalPrice,
        image,
        instructor,
        "lessonCount": count(lessons[]),
        "reviews": reviews,
        rating,
      } | order(order asc)`,

      // All blog posts
      blogPosts: `*[_type == "post"] {
        _id,
        _type,
        title,
        description,
        "slug": slug.current,
        publishedAt,
        author,
        mainImage,
        category,
      } | order(publishedAt desc)[0:50]`,

      // FAQs
      faqs: `*[_type == "faq"] {
        _id,
        question,
        answer,
        category,
        pageLocation,
      }`,

      // Collections
      collections: `*[_type == "collection"] {
        _id,
        _type,
        title,
        description,
        "slug": slug.current,
        image,
        "productCount": count(*[_type == "product" && references(^._id)]),
      } | order(order asc)`,
    }

    // ===== FETCH ALL DATA =====
    log('📥 Fetching content...', colors.blue)
    log('')

    const cache: Record<string, any> = {}
    let totalSize = 0

    for (const [key, query] of Object.entries(queries)) {
      try {
        log(`  Fetching ${key}...`)
        const data = await client.fetch(query)
        cache[key] = data
        const size = JSON.stringify(data).length
        totalSize += size
        log(`    ✓ ${key} (${(size / 1024).toFixed(2)}KB)`)
      } catch (error) {
        logWarning(`  Failed to fetch ${key}: ${error instanceof Error ? error.message : error}`)
        cache[key] = null
      }
    }

    log('')
    log('───────────────────────────────────────────────────────────')

    // ===== SAVE INDIVIDUAL CACHE FILES =====
    log('💾 Saving to cache files...', colors.blue)
    log('')

    for (const [key, data] of Object.entries(cache)) {
      if (data !== null) {
        await saveCache(`${key}.json`, data)
      }
    }

    // ===== SAVE COMBINED CACHE =====
    await saveCache('index.json', cache)

    log('')
    log('───────────────────────────────────────────────────────────')

    // ===== GENERATE TYPESCRIPT INDEX =====
    log('📝 Generating TypeScript exports...', colors.blue)

    const tsExports = `/**
 * Auto-generated file by scripts/cache-sanity-data.ts
 * Do NOT edit manually - will be overwritten on next build
 * 
 * This file provides type-safe access to all cached Sanity data
 */

export const SANITY_CACHE = {
  ${Object.keys(cache)
    .map((key) => `${key}: require('./${key}.json')`)
    .join(',\n  ')}
}

export function getCachedData(key: string): any {
  return SANITY_CACHE[key as keyof typeof SANITY_CACHE] || null
}

export function isCacheAvailable(): boolean {
  return Object.values(SANITY_CACHE).some(data => data !== null)
}

// Individual exports for convenience
${Object.keys(cache)
  .map((key) => `export const cached${key.charAt(0).toUpperCase() + key.slice(1)} = SANITY_CACHE.${key}`)
  .join('\n')}
`

    const indexPath = join(CACHE_DIR, 'index.ts')
    await writeFile(indexPath, tsExports, 'utf-8')
    logSuccess('Generated TypeScript index exports')

    log('')
    log('═══════════════════════════════════════════════════════════', colors.bold)
    logSuccess('CACHE GENERATION COMPLETE!')
    log('═══════════════════════════════════════════════════════════', colors.bold)
    log('')
    log(`📊 Total cache size: ${(totalSize / 1024).toFixed(2)}KB`)
    log(`📁 Cache location: ${CACHE_DIR}`)
    log(`📚 Files cached: ${Object.keys(cache).length}`)
    log(`✨ Production builds will serve data statically with NO API calls!`)
    log('')
  } catch (error) {
    logError('Cache generation failed!')
    console.error(error)
    process.exit(1)
  }
}

// Run the script
main()
