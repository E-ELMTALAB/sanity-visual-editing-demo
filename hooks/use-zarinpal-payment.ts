/**
 * Zarinpal Payment Hook
 * Manages the complete payment flow from cart to Zarinpal gateway
 * Uses test endpoints that don't require publishable API key
 */

import { useState, useCallback } from 'react'
import { MedusaAPIError } from '@/lib/medusa-api'

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

    try {
      // Calculate total amount including additional services
      let totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      
      // Add additional services
      if (additionalServices) {
        if (additionalServices.insurance) totalAmount += 50000
        if (additionalServices.warranty) totalAmount += 75000
        if (additionalServices.priority) totalAmount += 100000
      }

      // Prepare items for the test endpoint
      const items = cartItems.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity
      }))

      // Add additional services as items if selected
      if (additionalServices) {
        if (additionalServices.insurance) {
          items.push({
            id: 9991,
            title: 'بیمه اکانت',
            price: 50000,
            quantity: 1
          })
        }
        if (additionalServices.warranty) {
          items.push({
            id: 9992,
            title: 'ضمانت کیفیت',
            price: 75000,
            quantity: 1
          })
        }
        if (additionalServices.priority) {
          items.push({
            id: 9993,
            title: 'پشتیبانی اولویت‌دار',
            price: 100000,
            quantity: 1
          })
        }
      }

      console.log('Initiating payment with test endpoint...')
      console.log('Items:', items)
      console.log('Total amount:', totalAmount)

      // Use the direct Medusa backend endpoint (CORS should be fixed)
      const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/store/simple-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items,
          customer_email: customerInfo.email,
          customer_phone: customerInfo.phone
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      console.log('Payment initiated successfully:', result)

      if (!result.success || !result.payment?.payment_url) {
        throw new Error(result.error || 'Payment URL not found in response')
      }

      setStatus({
        loading: false,
        error: null,
        resourceId: result.payment.resource_id,
      })

      return {
        success: true,
        paymentUrl: result.payment.payment_url,
        resourceId: result.payment.resource_id,
      }
    } catch (error) {
      console.error('Payment initiation failed:', error)
      
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
  }, [])

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
      if (!resourceId) {
        throw new Error('Resource ID is required for payment verification')
      }

      console.log('Verifying payment with test endpoint...')
      console.log('Authority:', authority)
      console.log('Status:', status)
      console.log('Resource ID:', resourceId)

      // Use the direct Medusa backend endpoint (CORS should be fixed)
      const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/store/simple-verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authority: authority,
          status: status,
          resource_id: resourceId
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
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
          ref_id: result.payment?.ref_id,
          card_pan: result.payment?.card_pan,
          amount: result.payment?.amount,
          currency_code: result.payment?.currency_code,
          status: result.payment?.status
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
