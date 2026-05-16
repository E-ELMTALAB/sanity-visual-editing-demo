/**
 * Zarinpal Payment Hook
 * Manages the complete payment flow from cart to Zarinpal gateway
 * Uses test endpoints that don't require publishable API key
 */

import { useState, useCallback } from 'react'
import { getMedusaBackendUrl } from '@/lib/proxy.config'

const PAYMENT_PROVIDER_MODE = process.env.NEXT_PUBLIC_PAYMENT_PROVIDER_MODE || 'medusa_legacy'
const SIMPLE_BACKEND_URL = 'https://backend-sharifgpt-website-production.up.railway.app'

export interface CustomerInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export interface PaymentResult {
  success: boolean
  paymentUrl?: string
  resourceId?: string
  error?: string
}

export interface PaymentStatus {
  loading: boolean
  error: string | null
  resourceId: string | null
}

export function useZarinpalPayment() {
  const [status, setStatus] = useState<PaymentStatus>({
    loading: false,
    error: null,
    resourceId: null,
  })

  const resetStatus = useCallback(() => {
    setStatus({
      loading: false,
      error: null,
      resourceId: null,
    })
  }, [])

  const ZARINPAL_DIRECT_MERCHANT_ID = '34cb37f4-920c-49da-bfa0-229a91ed98bd'
  const ZARINPAL_DIRECT_CALLBACK_PATH = '/payment/callback'
  const ZARINPAL_DIRECT_SANDBOX = true
  const ZARINPAL_DIRECT_API_URL = 'https://api.zarinpal.com/pg/v4/payment/request.json'
  const ZARINPAL_DIRECT_CHECKOUT_BASE = ZARINPAL_DIRECT_SANDBOX
    ? 'https://sandbox.zarinpal.com/pg/checkout/start/'
    : 'https://www.zarinpal.com/pg/checkout/start/'

  const createZarinpalFrontendPaymentUrl = useCallback(async (
    amount: number,
    customerInfo: CustomerInfo
  ): Promise<{ paymentUrl: string }> => {
    if (typeof window === 'undefined') {
      throw new Error('Cannot create Zarinpal payment URL on the server side')
    }

    const callbackUrl = `${window.location.origin}${ZARINPAL_DIRECT_CALLBACK_PATH}`

    const requestBody = {
      merchant_id: ZARINPAL_DIRECT_MERCHANT_ID,
      amount: Math.round(amount),
      callback_url: callbackUrl,
      description: 'پرداخت سفارش',
      metadata: {
        email: customerInfo.email,
        mobile: customerInfo.phone,
      },
      mobile: customerInfo.phone,
    }

    const response = await fetch(ZARINPAL_DIRECT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    const data = await response.json().catch(() => ({}))
    if (!response.ok || !data.data?.authority) {
      const errorMessage = data.errors?.[0]?.message || data.error || data.data?.message || 'Zarinpal direct payment request failed.'
      throw new Error(errorMessage)
    }

    return {
      paymentUrl: `${ZARINPAL_DIRECT_CHECKOUT_BASE}${data.data.authority}`,
    }
  }, [])


  const initiateSimpleBackendPayment = useCallback(async (
    items: Array<{ id: number; title: string; price: number; quantity: number }>,
    customerInfo: CustomerInfo
  ) => {
    const response = await fetch(`${SIMPLE_BACKEND_URL}/payment/initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
      }),
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok || !data?.success || !data?.payment?.payment_url) {
      throw new Error(data?.error?.message || data?.error || 'Simple backend initiation failed')
    }
    return data
  }, [])

  const initiatePayment = useCallback(async (
    cartItems: Array<{
      id: number
      title: string
      price: number
      image?: string
      quantity: number
      selectedOption?: string
    }>,
    customerInfo: CustomerInfo,
    additionalServices?: {
      insurance?: boolean
      warranty?: boolean
      priority?: boolean
    }
  ): Promise<PaymentResult> => {
    setStatus({ loading: true, error: null, resourceId: null })

    let totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    if (additionalServices) {
      if (additionalServices.insurance) totalAmount += 50000
      if (additionalServices.warranty) totalAmount += 75000
      if (additionalServices.priority) totalAmount += 100000
    }

    let cartId: string | null = null

    const items = cartItems.map(item => ({
      id: item.id,
      title: item.title,
      price: item.price,
      quantity: item.quantity
    }))

    if (additionalServices) {
      if (additionalServices.insurance) {
        items.push({ id: 9991, title: 'بیمه اکانت', price: 50000, quantity: 1 })
      }
      if (additionalServices.warranty) {
        items.push({ id: 9992, title: 'ضمانت کیفیت', price: 75000, quantity: 1 })
      }
      if (additionalServices.priority) {
        items.push({ id: 9993, title: 'پشتیبانی اولویت‌دار', price: 100000, quantity: 1 })
      }
    }

    console.log('Initiating payment with test endpoint...')
    console.log('Items:', items)
    console.log('Total amount:', totalAmount)

    try {
      if (PAYMENT_PROVIDER_MODE === 'simple_backend') {
        const simpleResult = await initiateSimpleBackendPayment(items, customerInfo)
        const simpleResourceId = simpleResult.payment.resource_id as string
        setStatus({ loading: false, error: null, resourceId: simpleResourceId })
        return { success: true, paymentUrl: simpleResult.payment.payment_url, resourceId: simpleResourceId }
      }

      const BASE_URL = getMedusaBackendUrl()
      const PK = 'pk_2243c4f7a1f70eb2bb9b354ad7b22be869fca2633214edd7ee70637412a67bd4'

      const regionsResponse = await fetch(`${BASE_URL}/store/regions`, {
        method: 'GET',
        headers: {
          'x-publishable-api-key': PK,
        }
      })

      if (!regionsResponse.ok) {
        throw new Error(`Failed to fetch regions: ${regionsResponse.statusText}`)
      }

      const regionsData = await regionsResponse.json()
      const regionId = regionsData.regions[0].id

      const cartResponse = await fetch(`${BASE_URL}/store/carts`, {
        method: 'POST',
        headers: {
          'x-publishable-api-key': PK,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          region_id: regionId,
          email: customerInfo.email
        })
      })

      if (!cartResponse.ok) {
        throw new Error(`Failed to create cart: ${cartResponse.statusText}`)
      }

      const cartData = await cartResponse.json()
      cartId = cartData.cart.id

      if (items.length > 0) {
        const firstItem = items[0]
        const lineItemResponse = await fetch(`${BASE_URL}/store/carts/${cartId}/line-items`, {
          method: 'POST',
          headers: {
            'x-publishable-api-key': PK,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            variant_id: 'variant_01K7GP9FB4RWKVS7ES39YKP2TR',
            quantity: firstItem.quantity
          })
        })

        if (!lineItemResponse.ok) {
          throw new Error(`Failed to add item to cart: ${lineItemResponse.statusText}`)
        }
      }

      const paymentCollectionResponse = await fetch(`${BASE_URL}/store/payment-collections`, {
        method: 'POST',
        headers: {
          'x-publishable-api-key': PK,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart_id: cartId
        })
      })

      if (!paymentCollectionResponse.ok) {
        throw new Error(`Failed to create payment collection: ${paymentCollectionResponse.statusText}`)
      }

      const paymentCollectionData = await paymentCollectionResponse.json()
      const paymentCollectionId = paymentCollectionData.payment_collection.id

      const response = await fetch(`${BASE_URL}/store/payment-collections/${paymentCollectionId}/payment-sessions`, {
        method: 'POST',
        headers: {
          'x-publishable-api-key': PK,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider_id: 'pp_zarinpal_zarinpal'
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const normalizedError = typeof errorData.error === 'string' ? errorData.error : errorData.error?.message
        throw new Error(normalizedError || `HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      console.log('Payment initiated successfully:', result)

      if (!result.payment_session?.data?.payment_url) {
        throw new Error('Payment URL not found in response')
      }

      setStatus({
        loading: false,
        error: null,
        resourceId: cartId,
      })

      return {
        success: true,
        paymentUrl: result.payment_session.data.payment_url,
        resourceId: cartId,
      }
    } catch (error) {
      console.error('Payment initiation failed:', error)

      try {
        if (PAYMENT_PROVIDER_MODE === 'medusa_legacy' || PAYMENT_PROVIDER_MODE === 'frontend_direct_test') {
          console.warn('Backend Zarinpal flow failed, falling back to frontend-only Zarinpal request')
        } else {
          throw error
        }
        const directResult = await createZarinpalFrontendPaymentUrl(totalAmount, customerInfo)

        setStatus({
          loading: false,
          error: null,
          resourceId: cartId,
        })

        return {
          success: true,
          paymentUrl: directResult.paymentUrl,
          resourceId: cartId || undefined,
        }
      } catch (directError) {
        console.error('Frontend Zarinpal fallback failed:', directError)
      }

      let errorMessage = 'خطا در شروع فرآیند پرداخت'
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('Network error')) {
          errorMessage = 'خطا در اتصال به سرور. لطفاً اتصال اینترنت خود را بررسی کنید.'
        } else if (error.message.includes('400')) {
          errorMessage = 'اطلاعات ارسالی نامعتبر است. لطفاً دوباره تلاش کنید.'
        } else {
          errorMessage = error.message
        }
      }

      setStatus({
        loading: false,
        error: errorMessage,
        resourceId: null,
      })

      return {
        success: false,
        error: errorMessage,
      }
    }
  }, [createZarinpalFrontendPaymentUrl, initiateSimpleBackendPayment])

  const checkPaymentStatus = useCallback(async (resourceId: string) => {
    try {
      // For test endpoints, we don't have a separate status check
      // The payment status is verified during the verification step
      return {
        success: true,
        message: 'Status check not available for test endpoints'
      }
    } catch (error) {
      console.error('Payment status check failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }, [])

  const verifyPayment = useCallback(async (
    authority: string,
    status: string,
    resourceId?: string
  ) => {
    try {
      console.log('[VERIFY-PAYMENT] ========== STARTING VERIFICATION ==========')
      console.log('[VERIFY-PAYMENT] authority:', authority)
      console.log('[VERIFY-PAYMENT] status:', status)
      console.log('[VERIFY-PAYMENT] resourceId (received):', resourceId)
      console.log('[VERIFY-PAYMENT] resourceId type:', typeof resourceId)
      
      if (!resourceId) {
        console.error('[VERIFY-PAYMENT] ❌ Resource ID is missing!')
        throw new Error('Resource ID is required for payment verification')
      }

      const isSimple = PAYMENT_PROVIDER_MODE === 'simple_backend'
      const BASE_URL = isSimple ? SIMPLE_BACKEND_URL : getMedusaBackendUrl()

      const requestBody = isSimple
        ? { authority: authority, Status: status, resource_id: resourceId }
        : { authority: authority, Status: status, cart_id: resourceId }

      console.log('[VERIFY-PAYMENT] Sending to backend:', isSimple ? `${BASE_URL}/payment/verify` : `${BASE_URL}/store/zarinpal/verify`)
      console.log('[VERIFY-PAYMENT] Request body:', requestBody)

      const response = await fetch(isSimple ? `${BASE_URL}/payment/verify` : `${BASE_URL}/store/zarinpal/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })
      
      console.log('[VERIFY-PAYMENT] Backend response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const normalizedError = typeof errorData.error === 'string' ? errorData.error : errorData.error?.message
        throw new Error(normalizedError || `HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      console.log('Payment verification result:', result)

      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Payment verification failed'
        }
      }

      return {
        success: true,
        data: {
          ref_id: result.data?.ref_id,
          card_pan: result.data?.card_pan,
          amount: result.data?.amount,
          currency_code: result.data?.currency_code,
          status: result.data?.status
        }
      }
    } catch (error) {
      console.error('Payment verification failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }, [])

  return {
    status,
    initiatePayment,
    checkPaymentStatus,
    verifyPayment,
    resetStatus,
  }
}
