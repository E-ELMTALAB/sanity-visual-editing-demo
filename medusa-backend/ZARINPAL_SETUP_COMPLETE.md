# ✅ Zarinpal Payment Gateway - Setup Complete!

Your Zarinpal payment gateway integration is now complete and ready to use!

## 📦 What's Been Added

### 1. Payment Provider Module
- **Location**: `src/modules/payment-zarinpal/`
- **Files**:
  - `index.ts` - Module entry point
  - `service.ts` - Payment provider service with all Zarinpal API integrations
  - `README.md` - Module documentation

### 2. API Routes
- **Location**: `src/api/store/zarinpal/`
- **Endpoints**:
  - `POST /store/zarinpal/verify` - Verify payment after customer returns
  - `GET /store/zarinpal/status` - Check payment session status

### 3. Configuration Updates
- ✅ Updated `src/lib/constants.ts` with Zarinpal environment variables
- ✅ Updated `medusa-config.js` to load Zarinpal payment provider
- ✅ Added `axios` dependency for API calls

### 4. Documentation
- 📖 `ZARINPAL_INTEGRATION_GUIDE.md` - Complete integration guide
- 📖 `ZARINPAL_QUICK_START.md` - 5-minute quick start guide
- 📖 `src/modules/payment-zarinpal/README.md` - Module documentation

### 5. Testing Tools
- 🧪 `test-zarinpal.ps1` - PowerShell test script for Windows

## 🚀 Next Steps

### Step 1: Configure Environment Variables

Add these to your `medusa-backend/.env` file:

```env
# Zarinpal Payment Gateway
ZARINPAL_MERCHANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
ZARINPAL_SANDBOX=true
ZARINPAL_CALLBACK_URL=http://localhost:3000/checkout/callback
```

**Where to get Merchant ID:**
1. Go to [Zarinpal Dashboard](https://www.zarinpal.com/panel)
2. Navigate to Settings → API & Webhooks
3. Copy your Merchant ID

### Step 2: Restart Your Backend

```bash
cd medusa-backend
pnpm dev
```

Look for logs confirming Zarinpal is loaded.

### Step 3: Enable in Medusa Admin

1. Open http://localhost:9000/app
2. Go to **Settings** → **Regions**
3. Select your region (e.g., Iran - IRR)
4. Under **Payment Providers**, enable **Zarinpal**
5. Click **Save**

### Step 4: Test the Integration

Run the test script:

```bash
cd medusa-backend
.\test-zarinpal.ps1
```

This will create a test cart and generate a Zarinpal payment URL.

## 💳 Test Cards (Sandbox Mode)

When testing in sandbox mode, use these test credentials:

- **Card Number**: `5022-2910-0000-0000`
- **CVV2**: `123` (any 3-4 digits)
- **Expiry Date**: `12/30` (any future date)

## 🔄 How It Works

### Backend Flow:

1. **Initialize Payment** (`initiatePayment`)
   - Customer creates cart and proceeds to checkout
   - Medusa calls Zarinpal API to request payment
   - Returns `authority` code and payment URL

2. **Customer Payment**
   - Customer is redirected to Zarinpal payment page
   - Completes payment using their card
   - Zarinpal redirects back to your callback URL

3. **Verify Payment** (`authorizePayment`)
   - Your frontend calls `/store/zarinpal/verify`
   - Backend verifies payment with Zarinpal using authority code
   - Returns `ref_id` (tracking number) on success

4. **Complete Order**
   - Frontend calls `/store/carts/:id/complete`
   - Order is created in Medusa

### Currency Handling:

Zarinpal works with Iranian Rial (IRR):
- Medusa stores amounts in smallest unit (e.g., 10,000 Rials = 100,000)
- Module automatically converts to Rials for Zarinpal API
- **Important**: Set your region currency to `IRR` in Medusa Admin

## 🛠️ Frontend Integration

### Basic Example (React/Next.js):

```typescript
// Initialize payment
const initPayment = async (cartId: string) => {
  // Create payment collection
  const collectionRes = await fetch(
    `${MEDUSA_URL}/store/carts/${cartId}/payment-collection`,
    { method: 'POST' }
  );
  const { payment_collection } = await collectionRes.json();

  // Create Zarinpal session
  const sessionRes = await fetch(
    `${MEDUSA_URL}/store/payment-collections/${payment_collection.id}/payment-sessions`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider_id: 'zarinpal' })
    }
  );
  const { payment_session } = await sessionRes.json();

  // Redirect to Zarinpal
  window.location.href = payment_session.data.payment_url;
};

// Handle callback
const handleCallback = async (authority: string, status: string, cartId: string) => {
  if (status !== 'OK') {
    // Payment cancelled
    return { success: false, message: 'Payment cancelled' };
  }

  // Verify payment
  const verifyRes = await fetch(`${MEDUSA_URL}/store/zarinpal/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ authority, Status: status, cart_id: cartId })
  });
  
  const result = await verifyRes.json();
  
  if (result.success) {
    // Complete order
    await fetch(`${MEDUSA_URL}/store/carts/${cartId}/complete`, {
      method: 'POST'
    });
    
    return { success: true, ref_id: result.data.ref_id };
  }
  
  return { success: false, message: result.error };
};
```

## 🔒 Security Best Practices

1. **Never expose sensitive data**:
   - Don't commit `.env` file
   - Keep `ZARINPAL_MERCHANT_ID` secret

2. **Always use HTTPS in production**:
   - Update callback URL to use `https://`

3. **Validate payments server-side**:
   - Never trust client-side payment status
   - Always verify with Zarinpal API

4. **Implement rate limiting**:
   - Protect verification endpoints from abuse

## 📊 Monitoring & Logging

The module logs important events:

```typescript
// Check logs for:
- "Zarinpal payment request:" - Request sent to Zarinpal
- "Zarinpal response:" - Response from Zarinpal
- "Zarinpal authorize payment error:" - Verification errors
- "Zarinpal refund requested" - Refund requests (manual processing needed)
```

View logs in your Medusa backend console.

## ⚠️ Important Notes

### Refunds
Zarinpal doesn't provide an automated refund API. To process refunds:

1. Log in to [Zarinpal Dashboard](https://www.zarinpal.com/panel)
2. Go to **Transactions**
3. Find the transaction
4. Click **Refund** and follow prompts

The module will log refund requests in Medusa for your records.

### Common Error Codes

| Code | Description | Action |
|------|-------------|--------|
| 100 | Success | ✅ Payment successful |
| 101 | Already verified | ✅ Payment already processed (OK) |
| -9 | Validation error | Check request parameters |
| -11 | Request not found | Authority invalid or expired |
| -50 | Amount out of range | Amount must be 1,000-500,000,000 Rials |
| -54 | Request archived | Payment expired (>45 minutes) |

Full list: https://docs.zarinpal.com/paymentGateway/error.html

## 🌐 Production Deployment

Before going live:

1. **Update environment variables**:
   ```env
   ZARINPAL_SANDBOX=false
   ZARINPAL_MERCHANT_ID=your-production-merchant-id
   ZARINPAL_CALLBACK_URL=https://yourdomain.com/checkout/callback
   ```

2. **Configure CORS**:
   ```env
   STORE_CORS=https://yourdomain.com
   ADMIN_CORS=https://admin.yourdomain.com
   ```

3. **Test with small amount first**: Create a real order with minimum amount to verify everything works

4. **Monitor transactions**: Keep an eye on Zarinpal dashboard for first few transactions

## 📞 Support & Resources

- **Full Guide**: [ZARINPAL_INTEGRATION_GUIDE.md](./ZARINPAL_INTEGRATION_GUIDE.md)
- **Quick Start**: [ZARINPAL_QUICK_START.md](./ZARINPAL_QUICK_START.md)
- **Zarinpal Docs**: https://docs.zarinpal.com/
- **Medusa Docs**: https://docs.medusajs.com/

## ✨ Features Included

- ✅ Payment request & authorization
- ✅ Payment verification
- ✅ Automatic currency conversion (IRR)
- ✅ Sandbox mode for testing
- ✅ Comprehensive error handling
- ✅ Payment status tracking
- ✅ Metadata support (email, mobile)
- ✅ Detailed logging
- ✅ Test card support
- ✅ API endpoints for status checks

## 🎉 You're All Set!

Your Zarinpal integration is ready to accept payments. Follow the **Next Steps** above to configure and test it.

Questions? Check the troubleshooting section in [ZARINPAL_INTEGRATION_GUIDE.md](./ZARINPAL_INTEGRATION_GUIDE.md).

---

**Happy selling! 🛍️**

