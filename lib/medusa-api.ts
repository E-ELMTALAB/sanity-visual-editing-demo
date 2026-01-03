/**
 * Medusa API Service Layer
 * Native fetch implementation for Medusa v2 API communication
 * No SDK dependency - direct HTTP calls
 * 
 * Supports Cloudflare proxy for bypassing internet filtering
 */

import { getMedusaBackendUrl, isProxyEnabled } from 'lib/proxy.config'

// Use proxy-aware URL getter
const MEDUSA_BACKEND_URL = getMedusaBackendUrl()
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  console.warn('NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY is not set. Some operations may fail.')
}

// Log proxy status in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('[Medusa API] Backend URL:', MEDUSA_BACKEND_URL)
  console.log('[Medusa API] Proxy enabled:', isProxyEnabled)
}

// Common headers for all API calls
const getHeaders = () => ({
  'Content-Type': 'application/json',
  ...(PUBLISHABLE_KEY && { 'x-publishable-api-key': PUBLISHABLE_KEY }),
})

// Error handling utility
class MedusaAPIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: any
  ) {
    super(message)
    this.name = 'MedusaAPIError'
  }
}

// Generic API call function with retry logic for proxy failures
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {},
  retryCount = 0
): Promise<T> {
  const url = `${MEDUSA_BACKEND_URL}${endpoint}`
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getHeaders(),
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new MedusaAPIError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData
      )
    }

    return await response.json()
  } catch (error) {
    if (error instanceof MedusaAPIError) {
      throw error
    }
    
    // Retry logic for network errors (useful when proxy might timeout)
    if (retryCount < 2 && isProxyEnabled) {
      console.warn(`[Medusa API] Retry ${retryCount + 1} for ${endpoint}`)
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)))
      return apiCall<T>(endpoint, options, retryCount + 1)
    }
    
    throw new MedusaAPIError(
      `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      0,
      error
    )
  }
}

// Region operations
export const regionAPI = {
  // Get all regions
  async list(): Promise<{ regions: any[] }> {
    return apiCall<{ regions: any[] }>('/store/regions')
  },

  // Get region by ID
  async retrieve(id: string): Promise<{ region: any }> {
    return apiCall<{ region: any }>(`/store/regions/${id}`)
  },

  // Find IRR region
  async findIRRRegion(): Promise<any> {
    const { regions } = await this.list()
    const irrRegion = regions.find(region => 
      region.currency_code === 'irr' || 
      region.currencies?.some((c: any) => c.code === 'irr')
    )
    
    if (!irrRegion) {
      throw new MedusaAPIError('IRR region not found. Please create a region with IRR currency.')
    }
    
    return irrRegion
  }
}

// Cart operations
export const cartAPI = {
  // Create new cart
  async create(data: {
    region_id: string
    email?: string
    metadata?: Record<string, any>
  }): Promise<{ cart: any }> {
    return apiCall<{ cart: any }>('/store/carts', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Retrieve cart
  async retrieve(id: string): Promise<{ cart: any }> {
    return apiCall<{ cart: any }>(`/store/carts/${id}`)
  },

  // Add line item to cart
  async addLineItem(
    cartId: string,
    data: {
      variant_id: string
      quantity: number
      metadata?: Record<string, any>
    }
  ): Promise<{ cart: any }> {
    return apiCall<{ cart: any }>(`/store/carts/${cartId}/line-items`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Update line item
  async updateLineItem(
    cartId: string,
    lineId: string,
    data: {
      quantity: number
      metadata?: Record<string, any>
    }
  ): Promise<{ cart: any }> {
    return apiCall<{ cart: any }>(`/store/carts/${cartId}/line-items/${lineId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Remove line item
  async removeLineItem(cartId: string, lineId: string): Promise<{ cart: any }> {
    return apiCall<{ cart: any }>(`/store/carts/${cartId}/line-items/${lineId}`, {
      method: 'DELETE',
    })
  },

  // Complete cart (create order)
  async complete(cartId: string): Promise<{ order: any }> {
    return apiCall<{ order: any }>(`/store/carts/${cartId}/complete`, {
      method: 'POST',
    })
  }
}

// Payment operations
export const paymentAPI = {
  // Create payment collection
  async createCollection(data: {
    cart_id: string
    region_id: string
    currency_code: string
    amount: number
    metadata?: Record<string, any>
  }): Promise<{ payment_collection: any }> {
    return apiCall<{ payment_collection: any }>('/store/payment-collections', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Create payment session
  async createSession(
    collectionId: string,
    data: {
      provider_id: string
      amount: number
      currency_code: string
      metadata?: Record<string, any>
    }
  ): Promise<{ payment_session: any }> {
    return apiCall<{ payment_session: any }>(
      `/store/payment-collections/${collectionId}/payment-sessions`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    )
  },

  // Verify Zarinpal payment
  async verifyZarinpal(data: {
    authority: string
    Status?: string
    cart_id?: string
    order_id?: string
  }): Promise<{ success: boolean; data?: any; error?: string }> {
    return apiCall<{ success: boolean; data?: any; error?: string }>(
      '/store/zarinpal/verify',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    )
  },

  // Check Zarinpal payment status
  async checkZarinpalStatus(cartId: string): Promise<{ success: boolean; payment_session?: any }> {
    return apiCall<{ success: boolean; payment_session?: any }>(
      `/store/zarinpal/status?cart_id=${cartId}`
    )
  }
}

// Product operations (for creating minimal products)
export const productAPI = {
  // Create product
  async create(data: {
    title: string
    handle: string
    description?: string
    thumbnail?: string
    status?: string
    metadata?: Record<string, any>
  }): Promise<{ product: any }> {
    return apiCall<{ product: any }>('/admin/products', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Create product variant
  async createVariant(
    productId: string,
    data: {
      title: string
      sku?: string
      prices: Array<{
        amount: number
        currency_code: string
      }>
      options?: Array<{
        option_id: string
        value: string
      }>
      metadata?: Record<string, any>
    }
  ): Promise<{ product: any }> {
    return apiCall<{ product: any }>(`/admin/products/${productId}/variants`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Find product by handle
  async findByHandle(handle: string): Promise<{ products: any[] }> {
    return apiCall<{ products: any[] }>(`/store/products?handle=${handle}`)
  }
}

// Export the backend URL for components that need direct access
export { MEDUSA_BACKEND_URL }

// Export error class for external use
export { MedusaAPIError }

// Export all APIs as default
export default {
  region: regionAPI,
  cart: cartAPI,
  payment: paymentAPI,
  product: productAPI,
}
