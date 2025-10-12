/**
 * Product Migration Script
 * Migrates all products from Sanity CMS to Medusa backend
 * 
 * Usage:
 *   npm run migrate:products
 *   or
 *   npx tsx scripts/migrate-products-to-medusa.ts
 */

import { getClient } from '../lib/sanity.client'
import { createMedusaAdminClient } from '../lib/medusa.client'
import { ProductSyncService } from '../lib/services/product-sync.service'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

async function verifyConnections() {
  log('\n🔍 Verifying connections...', 'cyan')

  // Verify Sanity connection
  try {
    const sanityClient = getClient()
    const count = await sanityClient.fetch(`count(*[_type == "product"])`)
    log(`✅ Sanity connected: ${count} products found`, 'green')
  } catch (error: any) {
    log(`❌ Sanity connection failed: ${error.message}`, 'red')
    throw error
  }

  // Verify Medusa connection
  try {
    const medusaClient = createMedusaAdminClient()
    const { store } = await medusaClient.admin.store.retrieve()
    log(`✅ Medusa connected: ${store.name}`, 'green')
  } catch (error: any) {
    log(`❌ Medusa connection failed: ${error.message}`, 'red')
    log('💡 Make sure Medusa backend is running and MEDUSA_ADMIN_API_KEY is set', 'yellow')
    throw error
  }
}

async function migrateProducts() {
  log('\n' + '='.repeat(60), 'bright')
  log('🚀 PRODUCT MIGRATION: Sanity → Medusa', 'bright')
  log('='.repeat(60), 'bright')

  const startTime = Date.now()

  try {
    // Verify connections
    await verifyConnections()

    // Initialize sync service
    const syncService = new ProductSyncService()

    // Get current sync status
    log('\n📊 Checking sync status...', 'cyan')
    const status = await syncService.getSyncStatus()
    log(`   Total products: ${status.synced + status.notSynced + status.outdated}`, 'blue')
    log(`   ✅ Synced: ${status.synced}`, 'green')
    log(`   ⚠️  Outdated: ${status.outdated}`, 'yellow')
    log(`   ❌ Not synced: ${status.notSynced}`, 'red')

    // Confirm migration
    if (status.notSynced === 0 && status.outdated === 0) {
      log('\n✨ All products are already synced!', 'green')
      return
    }

    log(`\n🔄 Starting migration of ${status.notSynced + status.outdated} products...`, 'bright')

    // Sync all products
    const summary = await syncService.syncAllProducts()

    // Display results
    log('\n' + '='.repeat(60), 'bright')
    log('📊 MIGRATION SUMMARY', 'bright')
    log('='.repeat(60), 'bright')
    log(`Total products: ${summary.total}`, 'blue')
    log(`✅ Created: ${summary.created}`, 'green')
    log(`🔄 Updated: ${summary.updated}`, 'yellow')
    log(`⏭️  Skipped: ${summary.skipped}`, 'cyan')
    log(`❌ Errors: ${summary.errors}`, 'red')

    // Show errors if any
    if (summary.errors > 0) {
      log('\n⚠️  ERRORS:', 'red')
      summary.results
        .filter((r) => !r.success)
        .forEach((result) => {
          log(`   - ${result.sanityId}: ${result.error}`, 'red')
        })
    }

    // Show created products
    if (summary.created > 0) {
      log('\n✅ CREATED PRODUCTS:', 'green')
      summary.results
        .filter((r) => r.action === 'created')
        .forEach((result) => {
          log(`   - ${result.message} (${result.medusaProductId})`, 'green')
        })
    }

    // Show updated products
    if (summary.updated > 0) {
      log('\n🔄 UPDATED PRODUCTS:', 'yellow')
      summary.results
        .filter((r) => r.action === 'updated')
        .forEach((result) => {
          log(`   - ${result.message}`, 'yellow')
        })
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    log(`\n⏱️  Migration completed in ${duration}s`, 'bright')

    // Success summary
    if (summary.errors === 0) {
      log('\n✨ Migration completed successfully!', 'green')
    } else {
      log('\n⚠️  Migration completed with errors. Please review above.', 'yellow')
    }
  } catch (error: any) {
    log('\n❌ Migration failed:', 'red')
    log(error.message, 'red')
    if (error.stack) {
      log('\nStack trace:', 'red')
      console.error(error.stack)
    }
    process.exit(1)
  }
}

// Run migration
migrateProducts()
  .then(() => {
    log('\n✅ Script completed', 'green')
    process.exit(0)
  })
  .catch((error) => {
    log('\n❌ Script failed', 'red')
    console.error(error)
    process.exit(1)
  })

