/**
 * Product Synchronization Service
 * Handles syncing products between Sanity CMS and Medusa backend
 */

import { getClient } from '@/lib/sanity.client'
import { createMedusaAdminClient } from '@/lib/medusa.client'
import type { ProductDoc } from '@/types'

export interface SyncResult {
  success: boolean
  action: 'created' | 'updated' | 'skipped' | 'error'
  sanityId: string
  medusaProductId?: string
  message: string
  error?: string
}

export interface SyncSummary {
  total: number
  created: number
  updated: number
  skipped: number
  errors: number
  results: SyncResult[]
}

export class ProductSyncService {
  private sanityClient: ReturnType<typeof getClient>
  private medusaClient: ReturnType<typeof createMedusaAdminClient>

  constructor() {
    this.sanityClient = getClient()
    this.medusaClient = createMedusaAdminClient()
  }

  /**
   * Sync a single product from Sanity to Medusa
   */
  async syncProductToMedusa(sanityProduct: ProductDoc): Promise<SyncResult> {
    try {
      const { _id: sanityId, name, slug, medusaProductId } = sanityProduct

      if (!name || !slug?.current) {
        return {
          success: false,
          action: 'error',
          sanityId,
          message: 'Missing required fields (name or slug)',
          error: 'Missing name or slug',
        }
      }

      // Check if product already exists in Medusa
      if (medusaProductId) {
        return await this.updateMedusaProduct(sanityProduct)
      } else {
        return await this.createMedusaProduct(sanityProduct)
      }
    } catch (error: any) {
      console.error('Sync error:', error)
      return {
        success: false,
        action: 'error',
        sanityId: sanityProduct._id || 'unknown',
        message: 'Failed to sync product',
        error: error.message,
      }
    }
  }

  /**
   * Create a new product in Medusa
   */
  private async createMedusaProduct(sanityProduct: ProductDoc): Promise<SyncResult> {
    const { _id: sanityId, name, slug, category } = sanityProduct

    try {
      // Create product in Medusa
      const response = await this.medusaClient.admin.products.create({
        title: name || '',
        handle: slug?.current || '',
        status: 'draft',
        is_giftcard: false,
        discountable: true,
        metadata: {
          sanityId,
          isDigital: true,
          category: category || 'digital-products',
          lastSyncedAt: new Date().toISOString(),
        },
      })

      const medusaProduct = response.product

      // Create default variant (required)
      await this.medusaClient.admin.products.createVariant(medusaProduct.id, {
        title: 'Default',
        sku: slug?.current || `product-${Date.now()}`,
        manage_inventory: false,
        allow_backorder: true,
        prices: [
          {
            amount: 0, // Price will be synced separately
            currency_code: 'irr',
          },
        ],
      })

      // Update Sanity with Medusa product ID
      await this.updateSanityWithMedusaId(sanityId || '', medusaProduct.id)

      return {
        success: true,
        action: 'created',
        sanityId: sanityId || '',
        medusaProductId: medusaProduct.id,
        message: `Product created: ${name}`,
      }
    } catch (error: any) {
      console.error('Create error:', error)
      return {
        success: false,
        action: 'error',
        sanityId: sanityId || '',
        message: 'Failed to create product',
        error: error.message,
      }
    }
  }

  /**
   * Update existing product in Medusa
   */
  private async updateMedusaProduct(sanityProduct: ProductDoc): Promise<SyncResult> {
    const { _id: sanityId, name, slug, medusaProductId } = sanityProduct

    if (!medusaProductId) {
      return {
        success: false,
        action: 'error',
        sanityId: sanityId || '',
        message: 'No Medusa product ID provided',
      }
    }

    try {
      // Update product in Medusa
      await this.medusaClient.admin.products.update(medusaProductId, {
        title: name,
        handle: slug?.current,
        metadata: {
          sanityId,
          lastSyncedAt: new Date().toISOString(),
        },
      })

      return {
        success: true,
        action: 'updated',
        sanityId: sanityId || '',
        medusaProductId,
        message: `Product updated: ${name}`,
      }
    } catch (error: any) {
      console.error('Update error:', error)
      return {
        success: false,
        action: 'error',
        sanityId: sanityId || '',
        medusaProductId,
        message: 'Failed to update product',
        error: error.message,
      }
    }
  }

  /**
   * Update Sanity product with Medusa product ID
   */
  private async updateSanityWithMedusaId(sanityId: string, medusaProductId: string): Promise<void> {
    try {
      await this.sanityClient
        .patch(sanityId)
        .set({
          medusaProductId,
          lastSyncedAt: new Date().toISOString(),
        })
        .commit()
    } catch (error) {
      console.error('Error updating Sanity:', error)
    }
  }

  /**
   * Sync all products from Sanity to Medusa
   */
  async syncAllProducts(): Promise<SyncSummary> {
    console.log('Starting bulk product sync...')

    const summary: SyncSummary = {
      total: 0,
      created: 0,
      updated: 0,
      skipped: 0,
      errors: 0,
      results: [],
    }

    try {
      // Fetch all products from Sanity
      const products = await this.sanityClient.fetch<ProductDoc[]>(`
        *[_type == "product"]{
          _id,
          name,
          slug,
          description,
          category,
          price,
          originalPrice,
          discountPercentage,
          options,
          medusaProductId,
          inStock
        }
      `)

      summary.total = products.length
      console.log(`Found ${products.length} products to sync`)

      // Sync each product
      for (const product of products) {
        const result = await this.syncProductToMedusa(product)
        summary.results.push(result)

        if (result.success) {
          if (result.action === 'created') {
            summary.created++
          } else if (result.action === 'updated') {
            summary.updated++
          }
        } else {
          summary.errors++
        }

        // Add delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      console.log('Sync complete:', {
        total: summary.total,
        created: summary.created,
        updated: summary.updated,
        errors: summary.errors,
      })
    } catch (error) {
      console.error('Bulk sync error:', error)
    }

    return summary
  }

  /**
   * Get sync status for all products
   */
  async getSyncStatus(): Promise<{
    synced: number
    notSynced: number
    outdated: number
    products: any[]
  }> {
    try {
      const products = await this.sanityClient.fetch<ProductDoc[]>(`
        *[_type == "product"]{
          _id,
          name,
          slug,
          medusaProductId,
          lastSyncedAt,
          _updatedAt
        }
      `)

      let synced = 0
      let notSynced = 0
      let outdated = 0

      const productStatus = products.map((product) => {
        let status = 'not_synced'

        if (!product.medusaProductId) {
          notSynced++
          status = 'not_synced'
        } else if (product.lastSyncedAt && product._updatedAt) {
          const lastSync = new Date(product.lastSyncedAt as string)
          const lastUpdate = new Date(product._updatedAt as string)

          if (lastUpdate > lastSync) {
            outdated++
            status = 'outdated'
          } else {
            synced++
            status = 'synced'
          }
        } else {
          synced++
          status = 'synced'
        }

        return {
          sanityId: product._id,
          name: product.name,
          medusaProductId: product.medusaProductId,
          lastSyncedAt: product.lastSyncedAt,
          status,
        }
      })

      return {
        synced,
        notSynced,
        outdated,
        products: productStatus,
      }
    } catch (error) {
      console.error('Error getting sync status:', error)
      return {
        synced: 0,
        notSynced: 0,
        outdated: 0,
        products: [],
      }
    }
  }

  /**
   * Verify product exists in both systems
   */
  async verifyProductSync(sanityId: string): Promise<{
    exists: boolean
    synced: boolean
    sanityProduct: any
    medusaProduct: any
  }> {
    try {
      // Get product from Sanity
      const sanityProduct = await this.sanityClient.fetch<ProductDoc>(
        `*[_type == "product" && _id == $id][0]`,
        { id: sanityId }
      )

      if (!sanityProduct) {
        return {
          exists: false,
          synced: false,
          sanityProduct: null,
          medusaProduct: null,
        }
      }

      // Get product from Medusa
      if (sanityProduct.medusaProductId) {
        try {
          const { product: medusaProduct } = await this.medusaClient.admin.products.retrieve(
            sanityProduct.medusaProductId
          )

          return {
            exists: true,
            synced: true,
            sanityProduct,
            medusaProduct,
          }
        } catch (error) {
          return {
            exists: true,
            synced: false,
            sanityProduct,
            medusaProduct: null,
          }
        }
      }

      return {
        exists: true,
        synced: false,
        sanityProduct,
        medusaProduct: null,
      }
    } catch (error) {
      console.error('Verify error:', error)
      throw error
    }
  }
}

export const productSyncService = new ProductSyncService()

