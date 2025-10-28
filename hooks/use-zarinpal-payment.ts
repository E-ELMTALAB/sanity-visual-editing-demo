/**
 * Zarinpal Payment Hook
 * Manages the complete payment flow from cart to Zarinpal gateway
 */

import { useState, useCallback } from 'react'
import { regionAPI, cartAPI, paymentAPI } from '@/lib/medusa-api'
import { convertCartItemsToMedusa } from '@/lib/medusa-product-helper'
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
      // Step 1: Get IRR region
      console.log('Getting IRR region...')
      const irrRegion = await regionAPI.findIRRRegion()
      console.log('IRR region found:', irrRegion.id)

      // Step 2: Create Medusa cart
      console.log('Creating Medusa cart...')
      const { cart } = await cartAPI.create({
        region_id: irrRegion.id,
        email: customerInfo.email,
        metadata: {
          customer_first_name: customerInfo.firstName,
          customer_last_name: customerInfo.lastName,
          customer_phone: customerInfo.phone,
          source: 'frontend',
        },
      })
      console.log('Cart created:', cart.id)

      // Step 3: Convert cart items to Medusa format and add to cart
      console.log('Converting cart items...')
      const medusaLineItems = await convertCartItemsToMedusa(cartItems)
      console.log('Converted line items:', medusaLineItems.length)

      // Add each line item to the cart
      for (const lineItem of medusaLineItems) {
        await cartAPI.addLineItem(cart.id, lineItem)
      }

      // Add additional services as line items if selected
      if (additionalServices) {
        const serviceItems = []
        
        if (additionalServices.insurance) {
          serviceItems.push({
            variant_id: 'service-insurance', // This would need to be created in Medusa
            quantity: 1,
            metadata: { service_type: 'insurance', source: 'frontend' },
          })
        }
        
        if (additionalServices.warranty) {
          serviceItems.push({
            variant_id: 'service-warranty',
            quantity: 1,
            metadata: { service_type: 'warranty', source: 'frontend' },
          })
        }
        
        if (additionalServices.priority) {
          serviceItems.push({
            variant_id: 'service-priority',
            quantity: 1,
            metadata: { service_type: 'priority', source: 'frontend' },
          })
        }

        // Add service items to cart
        for (const serviceItem of serviceItems) {
          try {
            await cartAPI.addLineItem(cart.id, serviceItem)
          } catch (error) {
            console.warn('Failed to add service item:', error)
            // Continue without the service item
          }
        }
      }

      // Step 4: Retrieve updated cart to get final total
      console.log('Retrieving updated cart...')
      const { cart: updatedCart } = await cartAPI.retrieve(cart.id)
      const totalAmount = updatedCart.total || 0
      console.log('Cart total:', totalAmount)

      // Step 5: Create payment collection
      console.log('Creating payment collection...')
      const { payment_collection } = await paymentAPI.createCollection({
        cart_id: cart.id,
        region_id: irrRegion.id,
        currency_code: 'irr',
        amount: totalAmount,
        metadata: {
          customer_email: customerInfo.email,
          customer_phone: customerInfo.phone,
          source: 'frontend',
        },
      })
      console.log('Payment collection created:', payment_collection.id)

      // Step 6: Create Zarinpal payment session
      console.log('Creating Zarinpal payment session...')
      const { payment_session } = await paymentAPI.createSession(
        payment_collection.id,
        {
          provider_id: 'pp_zarinpal_zarinpal',
          amount: totalAmount,
          currency_code: 'irr',
          metadata: {
            customer_email: customerInfo.email,
            customer_phone: customerInfo.phone,
            cart_id: cart.id,
            source: 'frontend',
          },
        }
      )
      console.log('Payment session created:', payment_session.id)

      // Step 7: Extract payment URL from session data
      const sessionData = payment_session.data
      if (!sessionData || !sessionData.payment_url) {
        throw new Error('Payment URL not found in session data')
      }

      setStatus({
        loading: false,
        error: null,
        cartId: cart.id,
      })

      return {
        success: true,
        paymentUrl: sessionData.payment_url,
        cartId: cart.id,
      }
    } catch (error) {
      console.error('Payment initiation failed:', error)
      
      let errorMessage = 'خطا در شروع فرآیند پرداخت'
      
      if (error instanceof MedusaAPIError) {
        if (error.status === 0) {
          errorMessage = 'خطا در اتصال به سرور. لطفاً اتصال اینترنت خود را بررسی کنید.'
        } else if (error.status === 400) {
          errorMessage = 'اطلاعات ارسالی نامعتبر است. لطفاً دوباره تلاش کنید.'
        } else if (error.status === 404) {
          errorMessage = 'منطقه IRR یافت نشد. لطفاً با پشتیبانی تماس بگیرید.'
        } else {
          errorMessage = `خطای سرور: ${error.message}`
        }
      } else if (error instanceof Error) {
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
