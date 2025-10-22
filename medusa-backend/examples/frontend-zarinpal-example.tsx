// ============================================
// Zarinpal Frontend Integration Example
// ============================================
// This is a complete example for Next.js/React
// Adapt it to your specific frontend framework

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// ============================================
// Configuration
// ============================================
const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';

// ============================================
// 1. Checkout Page Component
// ============================================
export function CheckoutPage({ cartId }: { cartId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleZarinpalPayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // Step 1: Initialize payment collection
      console.log('Creating payment collection...');
      const collectionResponse = await fetch(
        `${MEDUSA_BACKEND_URL}/store/carts/${cartId}/payment-collection`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!collectionResponse.ok) {
        throw new Error('Failed to create payment collection');
      }

      const { payment_collection } = await collectionResponse.json();
      console.log('Payment collection created:', payment_collection.id);

      // Step 2: Create Zarinpal payment session
      console.log('Creating Zarinpal payment session...');
      const sessionResponse = await fetch(
        `${MEDUSA_BACKEND_URL}/store/payment-collections/${payment_collection.id}/payment-sessions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            provider_id: 'zarinpal',
          }),
        }
      );

      if (!sessionResponse.ok) {
        throw new Error('Failed to create Zarinpal payment session');
      }

      const { payment_session } = await sessionResponse.json();
      console.log('Payment session created:', payment_session);

      // Save cart ID for later verification
      localStorage.setItem('zarinpal_cart_id', cartId);
      localStorage.setItem('zarinpal_authority', payment_session.data.authority);

      // Step 3: Redirect to Zarinpal payment page
      console.log('Redirecting to Zarinpal...');
      window.location.href = payment_session.data.payment_url;

    } catch (err: any) {
      console.error('Payment initialization error:', err);
      setError(err.message || 'Failed to initialize payment');
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      
      {error && (
        <div className="error-message" style={{ color: 'red', padding: '10px', marginBottom: '10px' }}>
          {error}
        </div>
      )}

      <button
        onClick={handleZarinpalPayment}
        disabled={loading}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          backgroundColor: loading ? '#ccc' : '#22c55e',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Processing...' : 'Pay with Zarinpal'}
      </button>
    </div>
  );
}

// ============================================
// 2. Callback Handler Component
// ============================================
export function ZarinpalCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed' | 'error'>('verifying');
  const [message, setMessage] = useState('Verifying your payment...');
  const [refId, setRefId] = useState<number | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get parameters from URL
        const authority = searchParams.get('Authority');
        const paymentStatus = searchParams.get('Status');
        
        // Get cart ID from localStorage
        const cartId = localStorage.getItem('zarinpal_cart_id');

        console.log('Callback received:', { authority, paymentStatus, cartId });

        if (!authority || !cartId) {
          setStatus('error');
          setMessage('Missing payment information');
          return;
        }

        // Check if payment was cancelled
        if (paymentStatus !== 'OK') {
          setStatus('failed');
          setMessage('Payment was cancelled or failed');
          return;
        }

        // Verify payment with backend
        console.log('Verifying payment...');
        const verifyResponse = await fetch(
          `${MEDUSA_BACKEND_URL}/store/zarinpal/verify`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              authority,
              Status: paymentStatus,
              cart_id: cartId,
            }),
          }
        );

        const verifyResult = await verifyResponse.json();
        console.log('Verification result:', verifyResult);

        if (!verifyResponse.ok || !verifyResult.success) {
          setStatus('failed');
          setMessage(verifyResult.error || 'Payment verification failed');
          return;
        }

        // Payment verified successfully
        setRefId(verifyResult.data.ref_id);
        setStatus('success');
        setMessage('Payment verified successfully!');

        // Complete the order
        console.log('Completing order...');
        const completeResponse = await fetch(
          `${MEDUSA_BACKEND_URL}/store/carts/${cartId}/complete`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const orderResult = await completeResponse.json();
        console.log('Order completed:', orderResult);

        // Clean up localStorage
        localStorage.removeItem('zarinpal_cart_id');
        localStorage.removeItem('zarinpal_authority');

        // Redirect to order confirmation page after 2 seconds
        setTimeout(() => {
          router.push(`/order-confirmation?ref_id=${verifyResult.data.ref_id}`);
        }, 2000);

      } catch (err: any) {
        console.error('Payment verification error:', err);
        setStatus('error');
        setMessage('An error occurred while verifying payment');
      }
    };

    verifyPayment();
  }, [searchParams, router]);

  return (
    <div className="callback-container" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: '400px',
      padding: '20px'
    }}>
      <h1>Payment Status</h1>
      
      {status === 'verifying' && (
        <div>
          <div className="spinner" style={{ 
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            animation: 'spin 1s linear infinite',
            margin: '20px auto'
          }} />
          <p>{message}</p>
        </div>
      )}

      {status === 'success' && (
        <div style={{ textAlign: 'center', color: '#22c55e' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>✓</div>
          <h2>Payment Successful!</h2>
          <p>{message}</p>
          {refId && <p>Reference ID: {refId}</p>}
          <p style={{ color: '#666', marginTop: '10px' }}>Redirecting to order confirmation...</p>
        </div>
      )}

      {status === 'failed' && (
        <div style={{ textAlign: 'center', color: '#ef4444' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>✗</div>
          <h2>Payment Failed</h2>
          <p>{message}</p>
          <button
            onClick={() => router.push('/checkout')}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </div>
      )}

      {status === 'error' && (
        <div style={{ textAlign: 'center', color: '#f59e0b' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠</div>
          <h2>Error</h2>
          <p>{message}</p>
          <button
            onClick={() => router.push('/checkout')}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Back to Checkout
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================
// 3. Payment Status Checker (Optional)
// ============================================
export function usePaymentStatus(cartId: string) {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${MEDUSA_BACKEND_URL}/store/zarinpal/status?cart_id=${cartId}`
      );

      if (!response.ok) {
        throw new Error('Failed to check payment status');
      }

      const result = await response.json();
      setStatus(result.payment_session);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { status, loading, error, checkStatus };
}

// ============================================
// 4. Usage in Your App
// ============================================

/*
// In your Next.js app/checkout/page.tsx
import { CheckoutPage } from '@/components/zarinpal-checkout';

export default function Checkout() {
  const cartId = 'cart_01XXXXX'; // Get from your cart context/state
  return <CheckoutPage cartId={cartId} />;
}

// In your Next.js app/checkout/callback/page.tsx
import { ZarinpalCallbackPage } from '@/components/zarinpal-checkout';

export default function Callback() {
  return <ZarinpalCallbackPage />;
}
*/

// ============================================
// 5. Environment Variables for Frontend
// ============================================

/*
Add to your frontend .env.local:

NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000

For production:
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-backend-domain.com
*/

// ============================================
// CSS Animation for Spinner (add to globals.css)
// ============================================

/*
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
*/

