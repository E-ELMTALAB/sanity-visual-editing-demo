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
  console.log('[MEDUSA-CART] ========== CART CREATION STARTED ==========');
  console.log('[MEDUSA-CART] Backend URL:', `${getBackendUrl()}/store/cart/create`);
  console.log('[MEDUSA-CART] Items count:', items.length);
  console.log('[MEDUSA-CART] Customer email:', customerEmail || 'not provided');
  console.log('[MEDUSA-CART] Customer phone:', customerPhone || 'not provided');
  console.log('[MEDUSA-CART] Items:', items.map(item => ({
    id: item.id,
    title: item.title,
    price: item.price,
    quantity: item.quantity,
    sanity_slug: item.sanity_slug,
    variant_id: item.variant_id,
    option_name: item.option_name
  })));

  try {
    const response = await fetch(`${getBackendUrl()}/store/cart/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': getPublishableKey(),
      },
      body: JSON.stringify({ items, customer_email: customerEmail, customer_phone: customerPhone }),
    });
    
    console.log('[MEDUSA-CART] Response status:', response.status);
    console.log('[MEDUSA-CART] Response ok:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      console.error('[MEDUSA-CART] ❌ Cart creation failed');
      console.error('[MEDUSA-CART] Error status:', response.status);
      console.error('[MEDUSA-CART] Error text:', errorText);
      
      let errorData: any = {};
      try {
        errorData = JSON.parse(errorText);
        console.error('[MEDUSA-CART] Error data:', errorData);
      } catch {
        errorData = { error: errorText || `HTTP ${response.status}` };
      }
      throw new Error(errorData.error || errorData.message || 'Failed to create cart');
    }
    
    const result = await response.json();
    console.log('[MEDUSA-CART] ✅ Cart created successfully');
    console.log('[MEDUSA-CART] Cart ID:', result.cart?.id);
    console.log('[MEDUSA-CART] Cart total:', result.cart?.total);
    console.log('[MEDUSA-CART] Cart items count:', result.cart?.items?.length || 0);
    console.log('[MEDUSA-CART] Full response:', JSON.stringify(result, null, 2));
    console.log('[MEDUSA-CART] =========================================');
    
    return result;
  } catch (error: any) {
    console.error('[MEDUSA-CART] ❌ Cart creation error:', error.message);
    console.error('[MEDUSA-CART] Error stack:', error.stack);
    console.log('[MEDUSA-CART] =========================================');
    throw error;
  }
}

export async function initiatePayment(cartId: string, customerEmail?: string, customerPhone?: string) {
  console.log('[MEDUSA-PAYMENT] ========== PAYMENT INITIATION STARTED ==========');
  console.log('[MEDUSA-PAYMENT] Backend URL:', `${getBackendUrl()}/store/cart/initiate-payment`);
  console.log('[MEDUSA-PAYMENT] Cart ID:', cartId);
  console.log('[MEDUSA-PAYMENT] Cart ID type:', typeof cartId);
  console.log('[MEDUSA-PAYMENT] Customer email:', customerEmail || 'not provided');
  console.log('[MEDUSA-PAYMENT] Customer phone:', customerPhone || 'not provided');
  
  const requestBody = {
    cart_id: cartId,
    customer_email: customerEmail,
    customer_phone: customerPhone
  };
  console.log('[MEDUSA-PAYMENT] Request body:', JSON.stringify(requestBody, null, 2));

  try {
    const response = await fetch(`${getBackendUrl()}/store/cart/initiate-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': getPublishableKey(),
      },
      body: JSON.stringify(requestBody),
    });
    
    console.log('[MEDUSA-PAYMENT] Response status:', response.status);
    console.log('[MEDUSA-PAYMENT] Response ok:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      console.error('[MEDUSA-PAYMENT] ❌ Payment initiation failed');
      console.error('[MEDUSA-PAYMENT] Error status:', response.status);
      console.error('[MEDUSA-PAYMENT] Error text:', errorText);
      
      let errorData: any = {};
      try {
        errorData = JSON.parse(errorText);
        console.error('[MEDUSA-PAYMENT] Error data:', errorData);
      } catch {
        errorData = { error: errorText || `HTTP ${response.status}` };
      }
      throw new Error(errorData.error || errorData.message || 'Failed to initiate payment');
    }
    
    const result = await response.json();
    console.log('[MEDUSA-PAYMENT] ✅ Payment initiated successfully');
    console.log('[MEDUSA-PAYMENT] Payment authority:', result.payment?.authority);
    console.log('[MEDUSA-PAYMENT] Payment URL:', result.payment?.payment_url);
    console.log('[MEDUSA-PAYMENT] Payment session ID:', result.payment?.session_id);
    console.log('[MEDUSA-PAYMENT] Payment collection ID:', result.payment?.collection_id);
    console.log('[MEDUSA-PAYMENT] Payment amount:', result.payment?.amount);
    console.log('[MEDUSA-PAYMENT] Payment currency:', result.payment?.currency_code);
    console.log('[MEDUSA-PAYMENT] Full response:', JSON.stringify(result, null, 2));
    console.log('[MEDUSA-PAYMENT] =========================================');
    
    return result;
  } catch (error: any) {
    console.error('[MEDUSA-PAYMENT] ❌ Payment initiation error:', error.message);
    console.error('[MEDUSA-PAYMENT] Error stack:', error.stack);
    console.log('[MEDUSA-PAYMENT] =========================================');
    throw error;
  }
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
      // Match error format from sharifgpt-website API route
      throw new Error(errorData.error || `HTTP ${response.status}`);
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
    throw error;
  }
}

