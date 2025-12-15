const getBackendUrl = () => import.meta.env.VITE_MEDUSA_BACKEND_URL || 'https://backend.sharifgpt.com';
const getPublishableKey = () => import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY || 'pk_2243c4f7a1f70eb2bb9b354ad7b22be869fca2633214edd7ee70637412a67bd4';

export interface CartItemInput {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
  selectedOption?: string;
  sanity_slug?: string;
  variant_id?: string;
  option_name?: string;
}

export async function createMedusaCart(items: CartItemInput[], customerEmail?: string, customerPhone?: string) {
  const response = await fetch(`${getBackendUrl()}/store/cart/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-publishable-api-key': getPublishableKey(),
    },
    body: JSON.stringify({ items, customer_email: customerEmail, customer_phone: customerPhone }),
  });
  
  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    let errorData: any = {};
    try {
      errorData = JSON.parse(errorText);
    } catch {
      errorData = { error: errorText || `HTTP ${response.status}` };
    }
    throw new Error(errorData.error || errorData.message || 'Failed to create cart');
  }
  
  return await response.json();
}

export async function initiatePayment(cartId: string, customerEmail?: string, customerPhone?: string) {
  const response = await fetch(`${getBackendUrl()}/store/cart/initiate-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-publishable-api-key': getPublishableKey(),
    },
    body: JSON.stringify({ cart_id: cartId, customer_email: customerEmail, customer_phone: customerPhone }),
  });
  
  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    let errorData: any = {};
    try {
      errorData = JSON.parse(errorText);
    } catch {
      errorData = { error: errorText || `HTTP ${response.status}` };
    }
    throw new Error(errorData.error || errorData.message || 'Failed to initiate payment');
  }
  
  return await response.json();
}

export async function verifyPayment(authority: string, status: string, cartId: string) {
  console.log('[MEDUSA-VERIFY] ========== PAYMENT VERIFICATION STARTED ==========');
  console.log('[MEDUSA-VERIFY] Backend URL:', `${getBackendUrl()}/store/zarinpal/verify`);
  console.log('[MEDUSA-VERIFY] Authority:', authority);
  console.log('[MEDUSA-VERIFY] Status:', status || 'not provided');
  console.log('[MEDUSA-VERIFY] Cart ID:', cartId);
  console.log('[MEDUSA-VERIFY] Cart ID type:', typeof cartId);
  
  // Match exact format from sharifgpt-website: Status can be undefined if empty
  const requestBody: any = {
    authority,
    cart_id: cartId
  };
  
  // Only include Status if it has a value (matches sharifgpt-website behavior)
  if (status) {
    requestBody.Status = status;
  }
  
  console.log('[MEDUSA-VERIFY] Request body:', JSON.stringify(requestBody, null, 2));
  console.log('[MEDUSA-VERIFY] Making fetch request...');

  try {
    const response = await fetch(`${getBackendUrl()}/store/zarinpal/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': getPublishableKey(),
      },
      body: JSON.stringify(requestBody),
    });
    
    console.log('[MEDUSA-VERIFY] Response status:', response.status);
    console.log('[MEDUSA-VERIFY] Response ok:', response.ok);
    console.log('[MEDUSA-VERIFY] Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      console.error('[MEDUSA-VERIFY] ❌ Payment verification failed');
      console.error('[MEDUSA-VERIFY] Error status:', response.status);
      console.error('[MEDUSA-VERIFY] Error text:', errorText);
      
      let errorData: any = {};
      try {
        errorData = JSON.parse(errorText);
        console.error('[MEDUSA-VERIFY] Error data:', errorData);
      } catch {
        errorData = { error: errorText || `HTTP ${response.status}` };
      }
      
      // Return error object instead of throwing to match sharifgpt-website behavior
      return {
        success: false,
        error: errorData.error || errorData.message || `HTTP ${response.status}`,
        details: errorData
      };
    }
    
    const result = await response.json();
    console.log('[MEDUSA-VERIFY] ✅ Payment verified successfully');
    console.log('[MEDUSA-VERIFY] Verification success:', result.success);
    console.log('[MEDUSA-VERIFY] Ref ID:', result.data?.ref_id);
    console.log('[MEDUSA-VERIFY] Card PAN:', result.data?.card_pan);
    console.log('[MEDUSA-VERIFY] Amount:', result.data?.amount);
    console.log('[MEDUSA-VERIFY] Currency:', result.data?.currency_code);
    console.log('[MEDUSA-VERIFY] Items count:', result.data?.items?.length || 0);
    console.log('[MEDUSA-VERIFY] Status:', result.data?.status);
    console.log('[MEDUSA-VERIFY] Full response:', JSON.stringify(result, null, 2));
    console.log('[MEDUSA-VERIFY] =========================================');
    
    return result;
  } catch (error: any) {
    console.error('[MEDUSA-VERIFY] ❌ Payment verification error:', error.message);
    console.error('[MEDUSA-VERIFY] Error stack:', error.stack);
    console.log('[MEDUSA-VERIFY] =========================================');
    
    // Return error object instead of throwing to match sharifgpt-website behavior
    return {
      success: false,
      error: error.message || 'خطا در پردازش پرداخت',
      details: error
    };
  }
}

