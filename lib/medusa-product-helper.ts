/**
 * Medusa Product Helper
 * Creates minimal Medusa products from Sanity data for payment processing
 * Maintains Sanity as source of truth while enabling Medusa payments
 */

import { productAPI } from './medusa-api'

export interface SanityProduct {
  _id: string
  title: string
  description?: string
  price: number
  image?: string
  options?: Array<{
    name: string
    value: string
  }>
}

export interface MedusaProduct {
  id: string
  handle: string
  title: string
  description?: string
  thumbnail?: string
  variants: Array<{
    id: string
    title: string
    sku?: string
    prices: Array<{
      amount: number
      currency_code: string
    }>
  }>
}

/**
 * Create or find Medusa product from Sanity data
 * Uses Sanity product ID as handle for consistency
 */
export async function ensureMedusaProduct(
  sanityProduct: SanityProduct,
  options?: { selectedOption?: string }
): Promise<{ variantId: string; productId: string }> {
  try {
    // First, try to find existing product by handle (Sanity ID)
    const existingProducts = await productAPI.findByHandle(sanityProduct._id)
    
    if (existingProducts.products.length > 0) {
      const product = existingProducts.products[0]
      const variant = product.variants?.[0]
      
      if (variant) {
        return {
          variantId: variant.id,
          productId: product.id,
        }
      }
    }

    // Product doesn't exist, create it
    console.log(`Creating Medusa product for Sanity product: ${sanityProduct.title}`)
    
    const productData = {
      title: sanityProduct.title,
      handle: sanityProduct._id, // Use Sanity ID as handle
      description: sanityProduct.description || '',
      thumbnail: sanityProduct.image || '',
      status: 'published',
      metadata: {
        sanity_id: sanityProduct._id,
        source: 'sanity',
      },
    }

    const { product } = await productAPI.create(productData)
    
    // Create variant with IRR pricing
    const variantTitle = options?.selectedOption 
      ? `${sanityProduct.title} - ${options.selectedOption}`
      : sanityProduct.title

    const variantData = {
      title: variantTitle,
      sku: `sanity-${sanityProduct._id}${options?.selectedOption ? `-${options.selectedOption}` : ''}`,
      prices: [
        {
          amount: sanityProduct.price * 100, // Convert to smallest currency unit (cents)
          currency_code: 'irr',
        },
      ],
      metadata: {
        sanity_id: sanityProduct._id,
        sanity_option: options?.selectedOption || '',
        source: 'sanity',
      },
    }

    const { product: productWithVariant } = await productAPI.createVariant(
      product.id,
      variantData
    )

    const variant = productWithVariant.variants?.[0]
    if (!variant) {
      throw new Error('Failed to create product variant')
    }

    return {
      variantId: variant.id,
      productId: product.id,
    }
  } catch (error) {
    console.error('Error ensuring Medusa product:', error)
    throw new Error(`Failed to create Medusa product: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Convert Sanity cart items to Medusa line items
 * Creates products in Medusa as needed
 */
export async function convertCartItemsToMedusa(
  cartItems: Array<{
    id: number
    title: string
    price: number
    image?: string
    quantity: number
    selectedOption?: string
  }>
): Promise<Array<{
  variant_id: string
  quantity: number
  metadata: {
    sanity_id: string
    sanity_option?: string
    source: 'sanity'
  }
}>> {
  const medusaLineItems = []

  for (const item of cartItems) {
    try {
      // Create Sanity product object from cart item
      const sanityProduct: SanityProduct = {
        _id: `cart-item-${item.id}`, // Use cart item ID as Sanity ID
        title: item.title,
        price: item.price,
        image: item.image,
        options: item.selectedOption ? [{
          name: 'option',
          value: item.selectedOption,
        }] : undefined,
      }

      // Ensure product exists in Medusa
      const { variantId } = await ensureMedusaProduct(sanityProduct, {
        selectedOption: item.selectedOption,
      })

      // Add to line items
      medusaLineItems.push({
        variant_id: variantId,
        quantity: item.quantity,
        metadata: {
          sanity_id: sanityProduct._id,
          sanity_option: item.selectedOption || '',
          source: 'sanity',
        },
      })
    } catch (error) {
      console.error(`Failed to convert cart item ${item.id}:`, error)
      // Continue with other items, but log the error
    }
  }

  return medusaLineItems
}

/**
 * Validate that all required fields are present
 */
export function validateSanityProduct(product: any): product is SanityProduct {
  return (
    typeof product === 'object' &&
    product !== null &&
    typeof product._id === 'string' &&
    typeof product.title === 'string' &&
    typeof product.price === 'number' &&
    product.price > 0
  )
}

/**
 * Convert price from IRR to smallest currency unit (cents)
 * Medusa stores prices in smallest currency unit
 */
export function convertPriceToSmallestUnit(price: number, currencyCode: string = 'irr'): number {
  // For IRR, we store in Rials (no conversion needed)
  // For other currencies, convert to cents
  if (currencyCode === 'irr') {
    return Math.round(price)
  }
  
  // For USD, EUR, etc., convert to cents
  return Math.round(price * 100)
}

/**
 * Convert price from smallest currency unit back to display format
 */
export function convertPriceFromSmallestUnit(price: number, currencyCode: string = 'irr'): number {
  if (currencyCode === 'irr') {
    return price
  }
  
  return price / 100
}
