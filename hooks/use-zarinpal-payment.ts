/**
 * Zarinpal Payment Hook
 * Manages the complete payment flow from cart to Zarinpal gateway
 */

import { useState, useCallback } from 'react'
import { paymentAPI } from '@/lib/medusa-api'

export interface CustomerInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export interface PaymentResult {
  success: boolean
  paymentUrl?: string
  cartId?: string
  error?: string
}

export interface PaymentStatus {
  loading: boolean
  error: string | null
  cartId: string | null
}

export function useZarinpalPayment() {
  const [status, setStatus] = useState<PaymentStatus>({
    loading: false,
    error: null,
    cartId: null,
  })

  const resetStatus = useCallback(() => {
    setStatus({
      loading: false,
      error: null,
      cartId: null,
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
    setStatus({ loading: true, error: null, cartId: null })

    try {
      console.log('Starting payment initiation using test endpoint...')
      console.log('Cart items:', cartItems)
      console.log('Customer info:', customerInfo)
      console.log('Additional services:', additionalServices)

      // Calculate total amount including additional services
      const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      let additionalTotal = 0
      if (additionalServices) {
        if (additionalServices.insurance) additionalTotal += 50000
        if (additionalServices.warranty) additionalTotal += 75000
        if (additionalServices.priority) additionalTotal += 100000
      }
      const totalAmount = cartTotal + additionalTotal

      console.log('Total amount calculated:', totalAmount)

      // Prepare items for the simple payment endpoint
      const paymentItems = cartItems.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
      }))

      // Use the simple payment endpoint that doesn't require publishable key
      const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
      const response = await fetch(`${MEDUSA_BACKEND_URL}/store/simple-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: paymentItems,
          customer_email: customerInfo.email,
          customer_phone: customerInfo.phone,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('Payment initiated successfully:', result)

      if (!result.success || !result.payment?.payment_url) {
        throw new Error(result.error || 'Payment URL not found in response')
      }

      setStatus({
        loading: false,
        error: null,
        cartId: result.payment.resource_id,
      })

      return {
        success: true,
        paymentUrl: result.payment.payment_url,
        cartId: result.payment.resource_id,
      }
    } catch (error) {
      console.error('Payment initiation failed:', error)
      
      let errorMessage = 'خطا در شروع فرآیند پرداخت'
      
      if (error instanceof Error) {
        errorMessage = error.message
      }

      setStatus({
        loading: false,
        error: errorMessage,
        cartId: null,
      })

      return {
        success: false,
        error: errorMessage,
      }
    }
  }, [])

  const checkPaymentStatus = useCallback(async (cartId: string) => {
    try {
      const result = await paymentAPI.checkZarinpalStatus(cartId)
      return result
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
    cartId?: string
  ) => {
    try {
      const result = await paymentAPI.verifyZarinpal({
        authority,
        Status: status,
        cart_id: cartId,
      })
      return result
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
