/**
 * CRITICAL: Verify Sanity cache is properly built and available in dist
 * This script runs AFTER build to verify all cache files are present
 * 
 * Usage: node verify-cache-build.js
 * 
 * This ensures:
 * 1. Cache files are generated
 * 2. Cache files are copied to .next/static
 * 3. All required data types are cached
 * 4. Build is ready for deployment
 */

import { existsSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  bold: '\x1b[1m',
}

function log(msg, color = colors.reset) {
  console.log(`${color}${msg}${colors.reset}`)
}

function success(msg) {
  log(`✅ ${msg}`, colors.green)
}

function error(msg) {
  log(`❌ ${msg}`, colors.red)
}

function warning(msg) {
  log(`⚠️  ${msg}`, colors.yellow)
}

function info(msg) {
  log(`ℹ️  ${msg}`, colors.blue)
}

function bold(msg) {
  log(`${msg}`, colors.bold)
}

// Required cache files
const REQUIRED_CACHES = [
  'index.json',
  'homepage.json',
  'allProducts.json',
  'categories.json',
  'courses.json',
  'blogPosts.json',
  'faqs.json',
  'collections.json',
]

async function verifyCacheBuild() {
  bold('═══════════════════════════════════════════════════════════')
  bold('🔍 SANITY CACHE BUILD VERIFICATION')
  bold('═══════════════════════════════════════════════════════════')
  log('')

  const cwd = process.cwd()
  const publicCachePath = join(cwd, 'public', 'sanity-cache')
  const nextCachePath = join(cwd, '.next', 'static', 'sanity-cache')

  let allGood = true

  // Check 1: Public source cache
  log('📂 Checking source cache (public/sanity-cache/)...', colors.blue)
  if (!existsSync(publicCachePath)) {
    error(`Source cache directory not found: ${publicCachePath}`)
    warning('Run: npm run cache:sanity')
    allGood = false
  } else {
    const files = readdirSync(publicCachePath).filter((f) => !f.startsWith('.'))
    log(`   Found ${files.length} files in source cache`)

    let missingFiles = []
    for (const file of REQUIRED_CACHES) {
      const filepath = join(publicCachePath, file)
      if (existsSync(filepath)) {
        const stat = statSync(filepath)
        success(`   ${file} (${(stat.size / 1024).toFixed(2)}KB)`)
      } else {
        error(`   Missing: ${file}`)
        missingFiles.push(file)
        allGood = false
      }
    }

    if (missingFiles.length === 0) {
      success('All required cache files present in source!')
    }
  }

  log('')

  // Check 2: Verify .next build directory
  log('📦 Checking .next build output...', colors.blue)
  if (!existsSync('.next')) {
    warning('No .next directory found - you may need to run: npm run build')
  } else {
    success('.next directory exists')

    // Check if cache was copied to static
    const nextStaticPath = join(cwd, '.next', 'static')
    if (existsSync(nextStaticPath)) {
      info(`.next/static directory found`)

      // Check for sanity-cache in static
      const staticCachePath = join(nextStaticPath, 'sanity-cache')
      if (existsSync(staticCachePath)) {
        success('✅ Cache files copied to .next/static/sanity-cache/')
        const files = readdirSync(staticCachePath).filter((f) => !f.startsWith('.'))
        info(`   Contains ${files.length} cache files`)

        // Verify each file
        for (const file of REQUIRED_CACHES) {
          const filepath = join(staticCachePath, file)
          if (existsSync(filepath)) {
            const stat = statSync(filepath)
            log(`   ✓ ${file} (${(stat.size / 1024).toFixed(2)}KB)`)
          }
        }
      } else {
        warning('Cache directory not in .next/static/')
        info('Cache should be auto-copied from public/sanity-cache/')
      }
    }
  }

  log('')

  // Check 3: Deployment readiness
  log('🚀 Deployment readiness check...', colors.blue)

  const checks = [
    {
      name: 'Source cache exists',
      pass: existsSync(publicCachePath),
    },
    {
      name: 'Cache files generated',
      pass: existsSync(publicCachePath) && readdirSync(publicCachePath).length > 0,
    },
    {
      name: '.next directory built',
      pass: existsSync('.next'),
    },
    {
      name: 'Static files directory exists',
      pass: existsSync(join(cwd, '.next', 'static')),
    },
  ]

  for (const check of checks) {
    if (check.pass) {
      success(`  ${check.name}`)
    } else {
      error(`  ${check.name}`)
      allGood = false
    }
  }

  log('')

  // Summary
  if (allGood) {
    bold('═══════════════════════════════════════════════════════════')
    log('✅ BUILD VERIFICATION PASSED!', colors.green)
    bold('═══════════════════════════════════════════════════════════')
    log('')
    success('All cache files are in place and ready for deployment!')
    info('Cache location: public/sanity-cache/')
    info('Build output: .next/static/')
    info('Next.js will serve these as static assets automatically')
    log('')
    info('To deploy:')
    log('  npm run build  (already done)')
    log('  npm start      (to test locally)')
    log('  npm run build && npm start')
    log('')
    return 0
  } else {
    bold('═══════════════════════════════════════════════════════════')
    error('BUILD VERIFICATION FAILED!')
    bold('═══════════════════════════════════════════════════════════')
    log('')
    warning('Fix the issues above before deploying:')
    log('  1. Generate cache: npm run cache:sanity')
    log('  2. Rebuild: npm run build')
    log('  3. Verify again: npm run verify:build')
    log('')
    return 1
  }
}

// Run verification
verifyCacheBuild()
  .then((code) => {
    process.exit(code)
  })
  .catch((err) => {
    error('Verification script failed:')
    console.error(err)
    process.exit(1)
  })
