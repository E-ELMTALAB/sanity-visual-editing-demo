# Frontend Zarinpal Payment Integration Guide

## Overview

The payment system has been updated to build Zarinpal payment links **directly on the frontend** without requiring backend requests. This is completely safe as Zarinpal API endpoints are designed for frontend calls.

## Key Features

✅ **Frontend Payment Link Building** - No backend API call needed
✅ **VPN Warning Banner** - Clear instructions for users to disable VPN
✅ **Transaction Reference IDs** - Unique codes for customer support  
✅ **Secure Credential Storage** - Merchant ID stored in environment variables
✅ **LocalStorage Persistence** - Payment state between page redirects

## Implementation Details

### Files Created/Modified

1. **`src/lib/zarinpal-frontend.ts`** - Core payment link builder
   - Generates unique transaction reference IDs
   - Handles Zarinpal API communication
   - Manages localStorage for payment state
   - Formats reference IDs for display

2. **`src/components/checkout/VpnWarningBanner.tsx`** - VPN Warning Component
   - Displays prominent warning about VPN requirements
   - Shows step-by-step instructions
   - Located above payment methods on checkout page

3. **`src/components/checkout/TransactionReferenceDisplay.tsx`** - Reference Code Display
   - Shows transaction code to user
   - Copy button for easy code sharing
   - Support contact information

4. **`src/pages/Checkout.tsx`** - Updated checkout flow
   - Removed backend payment initiation
   - Integrated frontend Zarinpal payment builder
   - Added state management for transaction IDs
   - VPN warning and reference display integration

## Environment Variables Required

Add the following to your `.env` file (or deployment environment):

```env
# Zarinpal Merchant ID - Replace with your actual merchant ID
VITE_ZARINPAL_MERCHANT_ID=your-merchant-id-here
```

**Note:** We have a default fallback merchant ID but you MUST set your own merchant ID in environment variables for production.

## Payment Flow

### User Journey

1. **Checkout Page**
   - User sees prominent VPN warning banner
   - User fills contact information (email, phone)
   - User selects Zarinpal as payment method (default)

2. **Payment Initiation**
   - User clicks "پرداخت نهایی" (Final Payment)
   - Frontend generates unique transaction reference ID (e.g., `SG-1712950000000-ABC1D2E`)
   - Frontend calls Zarinpal API to request payment link
   - Frontend stores payment data in localStorage

3. **Reference Display**
   - Transaction code displayed to user
   - User can copy the code
   - User shown to turn off VPN

4. **Payment Redirect**
   - User redirected to Zarinpal payment gateway
   - (VPN disabled as per instructions)
   - User completes payment on Zarinpal

5. **After Payment**
   - User redirected to callback URL
   - Payment status verified
   - User can provide reference code to support

## Technical Specifications

### Transaction Reference ID Format
```
SG-[UNIX_TIMESTAMP]-[RANDOM_UPPERCASE_LETTERS]
Example: SG-1712950000000-ABC1D2E
```

### Data Stored in LocalStorage
```javascript
{
  pending_payment_authority: string,      // From Zarinpal
  pending_payment_cart_id: string,        // Cart ID or 'frontend-payment'
  pending_payment_reference_id: string,   // Transaction reference
  pending_payment_amount: string,         // Total amount in Rials
  pending_payment_email: string           // Customer email
}
```

### Zarinpal API Endpoints Used

- **Request Payment:**
  - URL: `https://api.zarinpal.com/pg/v4/payment/request.json`
  - Method: POST
  - Returns: `authority` code for payment link

- **Payment Gateway:**
  - URL: `https://www.zarinpal.com/pg/StartPay/{authority}`
  - Redirects user to payment interface

- **Verify Payment:**
  - Existing: `{backend}/store/zarinpal/verify`
  - Still available for payment verification after callback

## Callback Handling

After user completes payment on Zarinpal, they're redirected to:
```
{FRONTEND_URL}/checkout/payment-callback?Authority={authority}&Status={status}
```

The payment callback page should:
1. Read the `Authority` and `Status` parameters
2. Retrieve stored payment data from localStorage
3. Call backend verification endpoint if needed
4. Show payment confirmation or error

## Security Considerations

✅ **Safe for Frontend:** Zarinpal API is designed for frontend calls
✅ **CORS Headers:** Zarinpal API handles CORS properly
✅ **No API Keys Exposed:** Only merchant ID is needed (OK to expose)
✅ **Payment Verification:** Still done on backend for security
✅ **LocalStorage:** Used only for temporary state between redirects

## User Experience Improvements

### VPN Warning
- **Location:** Top of payment section on checkout
- **Styling:** Amber warning box with AlertCircle icon
- **Content:** Clear step-by-step instructions in Farsi

### Transaction Reference Code
- **Display:** Shows after payment initiation
- **Copyable:** One-click copy button
- **Support Info:** Included in banner

### Progress Indication
- **Loading State:** Button shows loading state during API call
- **Toast Notifications:** Success/error messages with reference code
- **Delay:** 1.5 second delay before redirect to show reference ID

## Troubleshooting

### Payment Link Not Generated
- Check `VITE_ZARINPAL_MERCHANT_ID` is set correctly
- Check browser console for specific Zarinpal error
- Verify internet connection and Zarinpal API availability

### VPN Block
- User must disable VPN as shown in banner
- Some ISPs may also block Zarinpal
- Instructions clearly state this requirement

### Reference ID Not Showing
- Check browser console for JavaScript errors
- Verify localStorage is enabled
- Check browser DevTools Application tab

## Manual Testing

```javascript
// In browser console, test the payment link builder:
import { buildZarinpalPaymentLink, generateTransactionReferenceId } from '@/lib/zarinpal-frontend'

const refId = generateTransactionReferenceId()
const result = await buildZarinpalPaymentLink(
  10000,                          // Amount in Rial
  'test@example.com',             // Email
  '09123456789',                  // Phone
  'cart-123',                     // Cart ID
  refId                           // Reference ID
)

console.log(result)
// Should show: { success: true, paymentUrl: '...', authority: '...' }
```

## Fallback to Backend (Future)

If frontend payment fails for any reason:
1. Backend endpoint `/store/cart/initiate-payment` still exists
2. Can be used as fallback by adding try/catch handling
3. Currently frontend method is attempted first

## Support

For issues or questions:
- Check browser console for detailed error logs
- Verify all environment variables are set
- Contact Zarinpal support if API issues persist
- Reference the transaction ID when reporting to customer support
