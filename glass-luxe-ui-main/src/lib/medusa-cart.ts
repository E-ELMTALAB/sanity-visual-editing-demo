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
  const response = await fetch(`${getBackendUrl()}/store/zarinpal/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-publishable-api-key': getPublishableKey(),
    },
    body: JSON.stringify({ authority, Status: status, cart_id: cartId }),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}`);
  }
  
  return await response.json();
}

