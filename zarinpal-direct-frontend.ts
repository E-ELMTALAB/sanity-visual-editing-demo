/**
 * Zarinpal direct frontend payment helper
 *
 * This file is intended for testing only.
 * It creates a Zarinpal payment URL directly from the browser using
 * the amount received from the backend, and redirects the user to Zarinpal.
 *
 * WARNING: This is unsafe for production and should only be used in a test environment.
 */

const ZARINPAL_DIRECT_MERCHANT_ID = '34cb37f4-920c-49da-bfa0-229a91ed98bd'
const ZARINPAL_DIRECT_SANDBOX = true
const ZARINPAL_DIRECT_API_URL = 'https://api.zarinpal.com/pg/v4/payment/request.json'
const ZARINPAL_DIRECT_CHECKOUT_BASE = ZARINPAL_DIRECT_SANDBOX
  ? 'https://sandbox.zarinpal.com/pg/checkout/start/'
  : 'https://www.zarinpal.com/pg/checkout/start/'

export interface ZarinpalFrontendPaymentOptions {
  amount: number
  email: string
  phone: string
  description?: string
}

export async function createZarinpalPaymentUrl(
  options: ZarinpalFrontendPaymentOptions
): Promise<string> {
  if (typeof window === 'undefined') {
    throw new Error('Zarinpal direct payment can only be used in the browser')
  }

  const { amount, email, phone, description = 'پرداخت سفارش' } = options

  if (!amount || amount <= 0) {
    throw new Error('Amount must be a positive number')
  }
  if (!email || !email.includes('@')) {
    throw new Error('A valid email is required')
  }
  if (!phone) {
    throw new Error('A valid phone number is required')
  }

  const callbackUrl = `${window.location.origin}/payment/callback`
  const requestBody = {
    merchant_id: ZARINPAL_DIRECT_MERCHANT_ID,
    amount: Math.round(amount),
    callback_url: callbackUrl,
    description,
    metadata: {
      email,
      mobile: phone,
    },
    mobile: phone,
  }

  const response = await fetch(ZARINPAL_DIRECT_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })

  const data = await response.json().catch(() => ({ }))

  if (!response.ok || !data.data?.authority) {
    const errorMessage =
      data.errors?.[0]?.message ||
      data.data?.message ||
      data.error ||
      `Zarinpal request failed with status ${response.status}`
    throw new Error(errorMessage)
  }

  return `${ZARINPAL_DIRECT_CHECKOUT_BASE}${data.data.authority}`
}

export async function redirectToZarinpalPayment(
  options: ZarinpalFrontendPaymentOptions
): Promise<void> {
  const paymentUrl = await createZarinpalPaymentUrl(options)
  window.location.href = paymentUrl
}

// Example usage:
//
// import { redirectToZarinpalPayment } from './zarinpal-direct-frontend'
//
// async function onBuyClick() {
//   const backendPrice = await fetch('/api/price').then(res => res.json())
//   await redirectToZarinpalPayment({
//     amount: backendPrice.total,
//     email: 'customer@example.com',
//     phone: '+989123456789',
//     description: 'پرداخت سفارش'
//   })
// }

// Plain browser example:
//
// document.querySelector('#buy-button')?.addEventListener('click', async () => {
//   const backendPrice = Number((document.querySelector('#backend-price') as HTMLInputElement).value)
//   await redirectToZarinpalPayment({
//     amount: backendPrice,
//     email: 'customer@example.com',
//     phone: '+989123456789',
//   })
// })
