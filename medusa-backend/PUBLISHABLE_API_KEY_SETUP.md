# Publishable API Key Setup Guide

## Overview

The publishable API key is required for standard Medusa store API endpoints like:
- `/store/regions`
- `/store/carts`
- `/store/products`
- `/store/payment-collections`
- `/store/payment-collections/{id}/payment-sessions`

However, our custom routes (`/store/cart/create`, `/store/cart/complete`, `/store/zarinpal/verify`) are designed to work without the publishable API key for testing purposes.

## Quick Setup for Testing

### Option 1: Use Custom Routes (No API Key Required)

Our custom routes are designed to work without the publishable API key:

```bash
# Test custom cart creation
curl -X POST http://localhost:9000/store/cart/create \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "id": 1,
        "title": "Test Product",
        "price": 100000,
        "image": "test.jpg",
        "quantity": 1,
        "selectedOption": "Default"
      }
    ],
    "customer_email": "test@example.com",
    "customer_phone": "+989123456789"
  }'

# Test payment verification
curl -X POST http://localhost:9000/store/zarinpal/verify \
  -H "Content-Type: application/json" \
  -d '{
    "authority": "test_authority_123",
    "Status": "OK",
    "cart_id": "test_cart_123"
  }'
```

### Option 2: Set Up Publishable API Key (For Standard Medusa APIs)

If you want to use the standard Medusa store APIs, follow these steps:

#### Step 1: Create a Publishable API Key

1. Start your Medusa backend
2. Run the setup script:

```bash
cd medusa-backend
npm run seed
```

Or manually create the API key through the admin panel.

#### Step 2: Link the API Key to Sales Channels

```bash
# Set the publishable key in your environment
export PUBLISHABLE_KEY="pk_your_key_here"

# Link it to sales channels
curl -X POST http://localhost:9000/internal/link-publishable-key \
  -H "Content-Type: application/json" \
  -d '{"token": "pk_your_key_here"}'
```

#### Step 3: Use in Your Frontend

```javascript
// In your frontend API calls
const headers = {
  'Content-Type': 'application/json',
  'x-publishable-api-key': 'pk_your_key_here'
};

// Example: Create cart
const response = await fetch('http://localhost:9000/store/carts', {
  method: 'POST',
  headers: headers,
  body: JSON.stringify({
    region_id: 'region_id_here',
    email: 'customer@example.com'
  })
});
```

## Environment Variables

Add these to your `.env` file:

```env
# Required for Medusa backend
DATABASE_URL=postgresql://username:password@localhost:5432/medusa_db
JWT_SECRET=your-jwt-secret-here
COOKIE_SECRET=your-cookie-secret-here

# Optional: Publishable API Key (for standard store APIs)
PUBLISHABLE_KEY=pk_your_key_here

# CORS Configuration (for testing)
STORE_CORS=*
ADMIN_CORS=*
AUTH_CORS=*
```

## Testing Both Approaches

### Test Custom Routes (No API Key)

```bash
# Test CORS endpoint
curl http://localhost:9000/store/cors-test-comprehensive

# Test custom cart creation
curl -X POST http://localhost:9000/store/cart/create \
  -H "Content-Type: application/json" \
  -d '{"items": [{"id": 1, "title": "Test", "price": 100000, "quantity": 1}], "customer_email": "test@example.com"}'
```

### Test Standard Medusa APIs (With API Key)

```bash
# Get regions
curl -H "x-publishable-api-key: pk_your_key_here" http://localhost:9000/store/regions

# Create cart
curl -X POST http://localhost:9000/store/carts \
  -H "Content-Type: application/json" \
  -H "x-publishable-api-key: pk_your_key_here" \
  -d '{"region_id": "region_id", "email": "test@example.com"}'
```

## Frontend Integration

### Using Custom Routes (Recommended for Testing)

```javascript
// No API key required
const createCart = async (items, customerInfo) => {
  const response = await fetch('http://localhost:9000/store/cart/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      items: items,
      customer_email: customerInfo.email,
      customer_phone: customerInfo.phone
    })
  });
  return response.json();
};
```

### Using Standard Medusa APIs

```javascript
// API key required
const PUBLISHABLE_KEY = 'pk_your_key_here';

const createCart = async (regionId, email) => {
  const response = await fetch('http://localhost:9000/store/carts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-publishable-api-key': PUBLISHABLE_KEY
    },
    body: JSON.stringify({
      region_id: regionId,
      email: email
    })
  });
  return response.json();
};
```

## Troubleshooting

### "Publishable API key not found" Error

This means the API key hasn't been properly linked to sales channels. Run:

```bash
curl -X POST http://localhost:9000/internal/link-publishable-key \
  -H "Content-Type: application/json" \
  -d '{"token": "your_publishable_key"}'
```

### CORS Errors

Make sure your CORS environment variables are set:

```env
STORE_CORS=*
ADMIN_CORS=*
AUTH_CORS=*
```

### Custom Routes Not Working

Our custom routes should work without any API key. If they're not working, check:

1. CORS headers are properly set
2. The backend is running
3. The route files are in the correct location

## Recommendation

For **testing and development**, use our custom routes as they don't require API key setup and are simpler to use.

For **production**, consider using the standard Medusa APIs with proper API key management for better security and features.
