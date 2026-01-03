import { getMedusaBackendUrl, MEDUSA_PUBLISHABLE_KEY } from './proxy.config'

// Get backend URL through proxy when enabled
const getBackendUrl = () => getMedusaBackendUrl();
const getPublishableKey = () => import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY || MEDUSA_PUBLISHABLE_KEY;

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

/**
 * Create a Medusa cart with the given items
 * Routes through Cloudflare proxy when enabled for Iran filtering bypass
 */
export async function createMedusaCart(items: CartItemInput[], customerEmail?: string, customerPhone?: string) {
  const backendUrl = getBackendUrl();
  console.log('[MEDUSA-CART] Creating cart via:', backendUrl);
  
  const response = await fetch(`${backendUrl}/store/cart/create`, {
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

/**
 * Initiate payment for a cart
 * Routes through Cloudflare proxy when enabled for Iran filtering bypass
 */
export async function initiatePayment(cartId: string, customerEmail?: string, customerPhone?: string) {
  const backendUrl = getBackendUrl();
  console.log('[MEDUSA-CART] Initiating payment via:', backendUrl);
  
  const response = await fetch(`${backendUrl}/store/cart/initiate-payment`, {
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

/**
 * Verify Zarinpal payment
 * Routes through Cloudflare proxy when enabled for Iran filtering bypass
 */
export async function verifyPayment(authority: string, status: string, cartId: string) {
  const backendUrl = getBackendUrl();
  
  console.log('[MEDUSA-VERIFY] ========== PAYMENT VERIFICATION STARTED ==========');
  console.log('[MEDUSA-VERIFY] Backend URL:', `${backendUrl}/store/zarinpal/verify`);
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
    const response = await fetch(`${backendUrl}/store/zarinpal/verify`, {
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
      console.error('[MEDUSA-VERIFY] Payment verification failed');
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
    console.log('[MEDUSA-VERIFY] Payment verified successfully');
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
    console.error('[MEDUSA-VERIFY] Payment verification error:', error.message);
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
