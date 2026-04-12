/**
 * Zarinpal Frontend Payment Link Builder
 * This module handles building Zarinpal payment links directly on the frontend
 * Safe for use as Zarinpal API endpoints are designed for frontend calls
 */

// Zarinpal API Configuration
const ZARINPAL_API_URL = 'https://api.zarinpal.com/pg/v4/payment/request.json';
const ZARINPAL_PAYMENT_GATEWAY = 'https://www.zarinpal.com/pg/StartPay';

// Zarinpal Credentials - Keep in environment variables
const ZARINPAL_MERCHANT_ID = import.meta.env.VITE_ZARINPAL_MERCHANT_ID || 'e9b1abef-eb8d-4ce4-a47c-e95c9baad0d1';

interface ZarinpalPaymentRequest {
  merchant_id: string;
  amount: number;
  description: string;
  email: string;
  mobile: string;
  callback_url: string;
}

interface ZarinpalPaymentResponse {
  data: {
    authority: string;
    code: number;
  };
  errors?: any[];
}

interface ZarinpalPaymentLinkResult {
  success: boolean;
  paymentUrl?: string;
  authority?: string;
  referenceId?: string;
  error?: string;
}

/**
 * Generate a unique reference ID for the transaction
 * This will be shown to the user for support purposes
 */
export function generateTransactionReferenceId(): string {
  return `SG-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
}

/**
 * Build Zarinpal payment link and request
 * This is done entirely on the frontend - safe for public key
 */
export async function buildZarinpalPaymentLink(
  totalAmount: number,
  customerEmail: string,
  customerPhone: string,
  cartId: string,
  referenceId: string
): Promise<ZarinpalPaymentLinkResult> {
  try {
    console.log('[ZARINPAL-FRONTEND] ========== BUILDING PAYMENT LINK ==========');
    console.log('[ZARINPAL-FRONTEND] Amount:', totalAmount);
    console.log('[ZARINPAL-FRONTEND] Email:', customerEmail);
    console.log('[ZARINPAL-FRONTEND] Phone:', customerPhone);
    console.log('[ZARINPAL-FRONTEND] Reference ID:', referenceId);

    // Validate inputs
    if (!totalAmount || totalAmount < 1) {
      throw new Error('مبلغ پرداختی معتبر نیست');
    }

    if (!customerEmail || !customerPhone) {
      throw new Error('ایمیل و شماره تلفن الزامی است');
    }

    // Prepare callback URL - will receive authority and status
    const callbackUrl = `${window.location.origin}/checkout/payment-callback`;

    // Prepare payment request
    const paymentRequest: ZarinpalPaymentRequest = {
      merchant_id: ZARINPAL_MERCHANT_ID,
      amount: Math.round(totalAmount), // Zarinpal accepts amount in Rial
      description: `پرداخت حساب SharifGPT - ${referenceId}`,
      email: customerEmail,
      mobile: customerPhone,
      callback_url: callbackUrl,
    };

    console.log('[ZARINPAL-FRONTEND] Payment request prepared:', {
      merchant_id: paymentRequest.merchant_id,
      amount: paymentRequest.amount,
      description: paymentRequest.description,
      callback_url: paymentRequest.callback_url,
    });

    // Call Zarinpal API to request payment
    console.log('[ZARINPAL-FRONTEND] Making request to Zarinpal API...');
    const response = await fetch(ZARINPAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(paymentRequest),
    });

    if (!response.ok) {
      throw new Error(`درخواست به درگاه ناموفق بود: ${response.status}`);
    }

    const result: ZarinpalPaymentResponse = await response.json();

    console.log('[ZARINPAL-FRONTEND] Zarinpal response:', result);

    // Check for errors in response
    if (result.errors && result.errors.length > 0) {
      const errorMessage = result.errors[0]?.message || 'درخواست از درگاه ناموفق بود';
      console.error('[ZARINPAL-FRONTEND] Zarinpal error:', errorMessage);
      throw new Error(errorMessage);
    }

    // Extract authority from response
    if (!result.data?.authority) {
      throw new Error('دریافت کد مرجع از درگاه ناموفق بود');
    }

    const authority = result.data.authority;

    // Build the payment URL
    const paymentUrl = `${ZARINPAL_PAYMENT_GATEWAY}/${authority}`;

    console.log('[ZARINPAL-FRONTEND] ✅ Payment link created successfully');
    console.log('[ZARINPAL-FRONTEND] Authority:', authority);
    console.log('[ZARINPAL-FRONTEND] Payment URL:', paymentUrl);
    console.log('[ZARINPAL-FRONTEND] =========================================');

    // Store payment details in localStorage for verification after callback
    localStorage.setItem('pending_payment_authority', authority);
    localStorage.setItem('pending_payment_cart_id', cartId);
    localStorage.setItem('pending_payment_reference_id', referenceId);
    localStorage.setItem('pending_payment_amount', totalAmount.toString());
    localStorage.setItem('pending_payment_email', customerEmail);

    return {
      success: true,
      paymentUrl,
      authority,
      referenceId,
    };
  } catch (error: any) {
    console.error('[ZARINPAL-FRONTEND] ❌ Error building payment link:', error.message);
    return {
      success: false,
      error: error.message || 'خطا در ساخت لینک پرداخت',
    };
  }
}

/**
 * Format reference ID for display to user
 */
export function formatReferenceIdForDisplay(referenceId: string): string {
  return referenceId.toUpperCase();
}

/**
 * Get payment information from localStorage
 */
export function getPendingPaymentInfo() {
  return {
    authority: localStorage.getItem('pending_payment_authority'),
    cartId: localStorage.getItem('pending_payment_cart_id'),
    referenceId: localStorage.getItem('pending_payment_reference_id'),
    amount: localStorage.getItem('pending_payment_amount'),
    email: localStorage.getItem('pending_payment_email'),
  };
}

/**
 * Clear pending payment info from localStorage
 */
export function clearPendingPaymentInfo() {
  localStorage.removeItem('pending_payment_authority');
  localStorage.removeItem('pending_payment_cart_id');
  localStorage.removeItem('pending_payment_reference_id');
  localStorage.removeItem('pending_payment_amount');
  localStorage.removeItem('pending_payment_email');
}
