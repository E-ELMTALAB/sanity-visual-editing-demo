# Zarinpal Payment Gateway Integration Guide

This guide walks you through integrating Zarinpal payment gateway with your Medusa v2 backend.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation Steps](#installation-steps)
3. [Configuration](#configuration)
4. [Testing](#testing)
5. [Frontend Integration](#frontend-integration)
6. [Production Deployment](#production-deployment)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Medusa v2 backend set up and running
- Zarinpal merchant account ([Sign up here](https://www.zarinpal.com/))
- Node.js 22.x
- PostgreSQL database

---

## Installation Steps

### 1. Get Your Zarinpal Credentials

1. Log in to your [Zarinpal Dashboard](https://www.zarinpal.com/panel)
2. Navigate to **Settings** → **API & Webhooks**
3. Copy your **Merchant ID** (format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

### 2. Configure Environment Variables

Add these variables to your `.env` file in the `medusa-backend` directory:

```env
# Zarinpal Configuration
ZARINPAL_MERCHANT_ID=your-merchant-id-here
ZARINPAL_SANDBOX=true  # Set to false in production
ZARINPAL_CALLBACK_URL=http://localhost:3000/checkout/callback
```

### 3. Verify Installation

The Zarinpal module has already been created in `src/modules/payment-zarinpal/`. No additional installation needed!

### 4. Restart Medusa Backend

```bash
cd medusa-backend
pnpm dev
```

You should see logs indicating that the Zarinpal payment provider is loaded.

---

## Configuration

### Payment Module Configuration

The Zarinpal provider is already configured in `medusa-config.js`:

```javascript
{
  resolve: './src/modules/payment-zarinpal',
  id: 'zarinpal',
  options: {
    merchant_id: ZARINPAL_MERCHANT_ID,
    sandbox: ZARINPAL_SANDBOX,
    description: 'Payment for order',
    callback_url: ZARINPAL_CALLBACK_URL,
  },
}
```

### Sandbox vs Production Mode

**Sandbox Mode** (for testing):
- Set `ZARINPAL_SANDBOX=true`
- Uses test URLs: `https://sandbox.zarinpal.com`
- No real money is charged

**Production Mode**:
- Set `ZARINPAL_SANDBOX=false`
- Uses live URLs: `https://www.zarinpal.com`
- Real transactions are processed

---

## Testing

### Test with Sandbox Mode

1. **Enable Sandbox Mode**:
   ```env
   ZARINPAL_SANDBOX=true
   ZARINPAL_MERCHANT_ID=your-test-merchant-id
   ```

2. **Use Test Cards**:
   - Card Number: `5022-2910-0000-0000`
   - CVV2: Any 3-4 digits (e.g., `123`)
   - Expiry Date: Any future date (e.g., `12/30`)

### API Testing Flow

#### Step 1: Create a Cart
```bash
curl -X POST http://localhost:9000/store/carts \
  -H "Content-Type: application/json" \
  -d '{
    "region_id": "reg_01XXXXX",
    "email": "customer@example.com"
  }'
```

Response will contain `cart_id`.

#### Step 2: Add Items to Cart
```bash
curl -X POST http://localhost:9000/store/carts/{cart_id}/line-items \
  -H "Content-Type: application/json" \
  -d '{
    "variant_id": "variant_01XXXXX",
    "quantity": 1
  }'
```

#### Step 3: Initialize Payment Session
```bash
curl -X POST http://localhost:9000/store/carts/{cart_id}/payment-collection \
  -H "Content-Type: application/json"
```

#### Step 4: Select Zarinpal as Payment Provider
```bash
curl -X POST http://localhost:9000/store/payment-collections/{payment_collection_id}/payment-sessions \
  -H "Content-Type: application/json" \
  -d '{
    "provider_id": "zarinpal"
  }'
```

Response will contain:
```json
{
  "payment_session": {
    "id": "payses_01XXXXX",
    "data": {
      "authority": "A00000000000000000000000000123456",
      "payment_url": "https://sandbox.zarinpal.com/pg/StartPay/A00000000000000000000000000123456",
      "status": "pending"
    }
  }
}
```

#### Step 5: Redirect Customer to Payment URL
Redirect the customer to the `payment_url` from the response.

#### Step 6: Handle Callback
After payment, Zarinpal redirects to your callback URL with parameters:
- `Authority`: Payment authority code
- `Status`: `OK` (success) or `NOK` (failed)

Example callback URL:
```
http://localhost:3000/checkout/callback?Authority=A00000000000000000000000000123456&Status=OK
```

#### Step 7: Verify Payment
Call your verification endpoint from your frontend:

```bash
curl -X POST http://localhost:9000/store/zarinpal/verify \
  -H "Content-Type: application/json" \
  -d '{
    "authority": "A00000000000000000000000000123456",
    "Status": "OK",
    "cart_id": "cart_01XXXXX"
  }'
```

Success response:
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "ref_id": 123456789,
    "card_pan": "502229******0000",
    "cart_id": "cart_01XXXXX"
  }
}
```

#### Step 8: Complete the Order
After successful verification, complete the cart:

```bash
curl -X POST http://localhost:9000/store/carts/{cart_id}/complete
```

---

## Frontend Integration

### React/Next.js Example

```typescript
// app/checkout/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      // Get cart ID from your state/context
      const cartId = 'cart_01XXXXX';
      
      // Initialize payment collection
      const collectionRes = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_URL}/store/carts/${cartId}/payment-collection`,
        { method: 'POST' }
      );
      const { payment_collection } = await collectionRes.json();
      
      // Create Zarinpal payment session
      const sessionRes = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_URL}/store/payment-collections/${payment_collection.id}/payment-sessions`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ provider_id: 'zarinpal' })
        }
      );
      const { payment_session } = await sessionRes.json();
      
      // Redirect to Zarinpal payment page
      window.location.href = payment_session.data.payment_url;
      
    } catch (error) {
      console.error('Payment initialization failed:', error);
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Checkout</h1>
      <button 
        onClick={handlePayment} 
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Pay with Zarinpal'}
      </button>
    </div>
  );
}
```

### Callback Handler

```typescript
// app/checkout/callback/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function PaymentCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('verifying');

  useEffect(() => {
    const verifyPayment = async () => {
      const authority = searchParams.get('Authority');
      const paymentStatus = searchParams.get('Status');
      const cartId = localStorage.getItem('cart_id'); // Or from your state

      if (paymentStatus !== 'OK') {
        setStatus('failed');
        return;
      }

      try {
        // Verify payment
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_MEDUSA_URL}/store/zarinpal/verify`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              authority,
              Status: paymentStatus,
              cart_id: cartId,
            })
          }
        );

        const result = await response.json();

        if (result.success) {
          // Complete the order
          await fetch(
            `${process.env.NEXT_PUBLIC_MEDUSA_URL}/store/carts/${cartId}/complete`,
            { method: 'POST' }
          );

          setStatus('success');
          router.push(`/order-confirmation?ref_id=${result.data.ref_id}`);
        } else {
          setStatus('failed');
        }
      } catch (error) {
        console.error('Payment verification failed:', error);
        setStatus('error');
      }
    };

    verifyPayment();
  }, [searchParams, router]);

  return (
    <div>
      <h1>Payment Status</h1>
      {status === 'verifying' && <p>Verifying your payment...</p>}
      {status === 'success' && <p>Payment successful! Redirecting...</p>}
      {status === 'failed' && <p>Payment failed or was cancelled.</p>}
      {status === 'error' && <p>An error occurred. Please contact support.</p>}
    </div>
  );
}
```

---

## Production Deployment

### 1. Switch to Production Mode

Update your production environment variables:

```env
ZARINPAL_SANDBOX=false
ZARINPAL_MERCHANT_ID=your-production-merchant-id
ZARINPAL_CALLBACK_URL=https://yourdomain.com/checkout/callback
```

### 2. Configure CORS

Ensure your frontend domain is allowed in `STORE_CORS`:

```env
STORE_CORS=https://yourdomain.com
```

### 3. Enable Payment Provider in Medusa Admin

1. Log in to Medusa Admin
2. Navigate to **Settings** → **Regions**
3. Select your region (e.g., Iran - IRR)
4. Under **Payment Providers**, enable **Zarinpal**
5. Save changes

### 4. Test in Production

Before going fully live:
1. Create a test order with a small amount
2. Complete the payment flow
3. Verify the payment appears in your Zarinpal dashboard
4. Confirm the order is created in Medusa

---

## Troubleshooting

### Common Issues

#### 1. "Zarinpal merchant_id is required"
- **Solution**: Make sure `ZARINPAL_MERCHANT_ID` is set in your `.env` file
- Restart the Medusa backend after adding the variable

#### 2. Payment URL is not generated
- **Solution**: Check that the payment provider is enabled for your region in Medusa Admin
- Verify the cart has items and a valid region

#### 3. "Payment verification failed"
- **Possible causes**:
  - Authority code doesn't match
  - Payment amount mismatch
  - Payment already verified (code 101)
- **Solution**: Check Zarinpal logs in your dashboard

#### 4. CORS errors
- **Solution**: Add your frontend URL to `STORE_CORS` in `.env`:
  ```env
  STORE_CORS=http://localhost:3000,https://yourdomain.com
  ```

#### 5. Callback URL not working
- **Solution**: Ensure `ZARINPAL_CALLBACK_URL` matches your frontend callback route
- Verify the route is publicly accessible (not behind authentication)

### Zarinpal Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| 100 | Success | - |
| 101 | Already verified | Payment was already verified, this is OK |
| -9 | Validation error | Check request parameters |
| -11 | Request not found | Authority code invalid or expired |
| -21 | Financial operation not found | Payment not completed by user |
| -50 | Amount out of range | Amount must be 1,000-500,000,000 Rials |
| -54 | Request archived | Payment is too old (>45 minutes) |

Full list: https://docs.zarinpal.com/paymentGateway/error.html

### Enable Debug Logging

To see detailed Zarinpal logs:

```typescript
// In service.ts, logs are already enabled with this.logger_
// Check your Medusa backend logs for:
// - "Zarinpal payment request:"
// - "Zarinpal response:"
// - "Zarinpal authorize payment error:"
```

---

## Additional Resources

- [Zarinpal Official Documentation](https://docs.zarinpal.com/)
- [Zarinpal API Reference](https://docs.zarinpal.com/paymentGateway/)
- [Medusa Payment Module Docs](https://docs.medusajs.com/resources/commerce-modules/payment)
- [Test Zarinpal API in Postman](https://docs.zarinpal.com/paymentGateway/test.html)

---

## Support

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review Medusa backend logs
3. Check Zarinpal dashboard for payment status
4. Contact Zarinpal support for payment-specific issues

---

## Refunds

**Important**: Zarinpal doesn't provide an automated refund API. Refunds must be processed manually:

1. Log in to [Zarinpal Dashboard](https://www.zarinpal.com/panel)
2. Navigate to **Transactions**
3. Find the transaction to refund
4. Click **Refund** and follow the prompts

The Medusa backend will log refund requests, but you must complete them manually.

---

## Security Notes

- Never commit your `.env` file or expose your `ZARINPAL_MERCHANT_ID`
- Always use HTTPS in production
- Validate all payment amounts server-side
- Implement rate limiting on verification endpoints
- Log all payment attempts for audit purposes

---

## Next Steps

1. ✅ Install and configure Zarinpal module
2. ✅ Test in sandbox mode
3. ✅ Implement frontend integration
4. ✅ Test complete checkout flow
5. ✅ Switch to production mode
6. ✅ Go live!

Good luck with your Zarinpal integration! 🚀

