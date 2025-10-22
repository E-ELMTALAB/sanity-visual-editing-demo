# Zarinpal Payment Provider for Medusa v2

This module integrates Zarinpal payment gateway with Medusa v2.

## Features

- Payment request and authorization
- Payment verification
- Sandbox mode for testing
- Automatic currency handling (IRR)
- Metadata support for customer info

## Configuration

Add the following environment variables:

```env
ZARINPAL_MERCHANT_ID=your-merchant-id
ZARINPAL_SANDBOX=true  # Set to false in production
ZARINPAL_CALLBACK_URL=http://localhost:3000/checkout/callback
```

## Usage

1. Customer initiates payment → Zarinpal payment URL is generated
2. Customer is redirected to Zarinpal payment page
3. After payment, customer is redirected back to your callback URL
4. Your frontend calls the verify endpoint with the authority code
5. Payment is verified and order is completed

## API Flow

### 1. Create Payment Session
When a customer creates a cart and proceeds to checkout, Medusa automatically calls `initiatePayment()`.

### 2. Customer Redirects to Zarinpal
Use the `payment_url` from the session data to redirect the customer.

### 3. Payment Verification
After customer returns from Zarinpal, call the verify endpoint:

```
POST /store/zarinpal/verify
{
  "authority": "A00000000000000000000000000123456",
  "status": "OK",
  "cart_id": "cart_123"
}
```

## Refunds

Zarinpal doesn't provide an automated refund API. Refunds must be processed manually through your Zarinpal dashboard.

## Testing

Use sandbox mode and Zarinpal's test cards:
- Test Card Number: 5022-2910-0000-0000
- CVV2: Any 3-4 digits
- Expiry: Any future date

## Error Codes

Common Zarinpal response codes:
- 100: Success
- 101: Already verified
- -9: Validation error
- -11: Request not found
- -21: Financial operation not found
- -50: Amount must be between 1,000 to 500,000,000 Rials
- -54: Request archived

For more codes, visit: https://docs.zarinpal.com/paymentGateway/error.html

