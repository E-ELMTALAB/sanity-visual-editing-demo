# INTEGRATION GUIDE: Connect Your Client to Simplified Backend

## 🎯 Quick Reference

**Your client code:** Uses Sanity for content + attempts Medusa for commerce
**Our backend:** Provides simple commerce API (products, cart, checkout, payments)
**Effort:** ~30-60 minutes
**Risk:** Low

---

## 📋 Step-by-Step Integration

### Step 1: Deploy Backend to Liara (5 minutes)

```bash
# In simplified-medusa-backend/
git add .
git push liara main

# Or manually in Liara dashboard:
# 1. Create Node.js project
# 2. Connect your GitHub repo
# 3. Set env vars:
#    PORT=3000
#    ADMIN_KEY=your-secret
#    STRIPE_SECRET_KEY= (optional)
```

### Step 2: Update Environment Variables (2 minutes)

In your `.env.local`:
```env
# Point to new backend
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-liara-domain.com

# Keep your Sanity config
NEXT_PUBLIC_SANITY_PROJECT_ID=...
NEXT_PUBLIC_SANITY_DATASET=...
```

### Step 3: Simplify Payment Hook (15 minutes)

**File to update**: `/hooks/use-zarinpal-payment.ts`

**Replace the entire Medusa flow with**:
```typescript
export function useZarinpalPayment() {
  const [status, setStatus] = useState<PaymentStatus>({
    loading: false,
    error: null,
    resourceId: null,
  })

  const initiatePayment = useCallback(async (
    cartItems: Array<{
      id: number
      title: string
      price: number
      image?: string
      quantity: number
    }>,
    customerInfo: CustomerInfo
  ): Promise<PaymentResult> => {
    setStatus({ loading: true, error: null, resourceId: null })

    try {
      const BASE_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL

      // Simple checkout request
      const response = await fetch(`${BASE_URL}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            product_id: `prod_${item.id}`,  // Map your IDs
            quantity: item.quantity
          })),
          currency: 'usd',
          customer_email: customerInfo.email
        })
      })

      if (!response.ok) {
        throw new Error(`Checkout failed: ${response.statusText}`)
      }

      const data = await response.json()

      // Check if we have Stripe (client_secret) or mock payment
      if (data.client_secret) {
        // Stripe - client handles payment with Stripe.js
        return {
          success: true,
          resourceId: data.order.id,
          clientSecret: data.client_secret
        }
      } else {
        // Mock payment - redirect to payment URL
        return {
          success: true,
          paymentUrl: data.payment_url,
          resourceId: data.order.id
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed'
      setStatus({ loading: false, error: errorMessage, resourceId: null })
      return { success: false, error: errorMessage }
    }
  }, [])

  return { status, initiatePayment, resetStatus: () => setStatus({ loading: false, error: null, resourceId: null }) }
}
```

### Step 4: Update Cart Context (10 minutes)

**File**: `/contexts/cart-context.tsx`

The current context is fine for local state. Just ensure it works with your new checkout:

```typescript
// No changes needed to CartContext itself
// But update how it's used in checkout page

// In /app/checkout/page.tsx, update the payment handler:
const handlePayment = async () => {
  const { success, paymentUrl } = await initiatePayment(
    state.items,  // Use local cart context
    formData
  )
  
  if (success && paymentUrl) {
    window.location.href = paymentUrl  // Redirect to payment
  }
}
```

### Step 5: Update Checkout Page (10 minutes)

**File**: `/app/checkout/page.tsx`

**Change this section**:
```tsx
// OLD: Complex Medusa flow
const handlePayment = async () => {
  // ... many steps ...
}

// NEW: Simple checkout
const handlePayment = async () => {
  setIsProcessingPayment(true)
  
  try {
    const result = await initiatePayment(state.items, formData)
    
    if (result.success && result.paymentUrl) {
      // Redirect to payment page
      window.location.href = result.paymentUrl
    } else if (result.clientSecret) {
      // TODO: Integrate Stripe.js here if you want real payments
      console.log('Stripe client secret:', result.clientSecret)
    }
  } catch (error) {
    console.error('Payment error:', error)
    // Show error to user
  } finally {
    setIsProcessingPayment(false)
  }
}
```

### Step 6: Test Locally (5 minutes)

```bash
# Terminal 1: Run backend
cd simplified-medusa-backend
PORT=3000 npm start

# Terminal 2: Run frontend
npm run dev

# Open http://localhost:3000/products
# Add item to cart
# Go to checkout
# Complete mock payment
```

---

## 🔀 Data Mapping Reference

### Product IDs
```
Frontend: 123
Backend expects: "prod_123" (or your ID from data.json)

Mapping:
const backendProductId = `prod_${frontendId}`
```

### Prices
```
Frontend: 29000 (Tomans)
Backend: 29999 (cents, for USD)

For display:
const displayPrice = totalCents / 100  // Convert to dollars
const tomanPrice = (totalCents / 100) * 40000  // If needed
```

### Items in Cart
```
Frontend item:
{
  id: 1,
  title: "Product Name",
  price: 29000,
  quantity: 2
}

Backend item:
{
  product_id: "prod_1",
  quantity: 2
}
```

---

## ✅ Verification Checklist

After integration:

- [ ] Backend deployed to Liara
- [ ] Environment variable points to new backend URL
- [ ] Product page loads (displays from Sanity) ✅
- [ ] Add to cart works (local state) ✅
- [ ] Checkout page loads ✅
- [ ] Mock payment completes ✅
- [ ] Order created successfully ✅

---

## 🐛 Troubleshooting

### Backend returns 404
**Fix**: Ensure `NEXT_PUBLIC_MEDUSA_BACKEND_URL` is set correctly
```bash
# Test:
curl https://your-liara-domain.com/products
```

### CORS errors
**Fix**: Backend has CORS enabled by default, but verify:
- Backend is running on correct port
- Frontend is using correct URL (no trailing slash)
- Check browser console for actual error

### Prices not displaying
**Fix**: Check price conversion:
- Backend returns cents (29999 = $299.99)
- Convert: `cents / 100` for dollars
- Or: `(cents / 100) * 40000` for Tomans (if applicable)

### Payment URL not working
**Fix**: Ensure backend is accessible from frontend
```bash
# Test from browser:
fetch('https://your-backend.com/').then(r => r.json())
```

---

## 🎛️ Configuration Options

### Use Mock Payments (Default)
No setup needed. `/pay/mock/:orderId` completes payment.

### Use Stripe Payments
Set in Liara environment:
```
STRIPE_SECRET_KEY=sk_test_...
```

Then in checkout response you'll get `client_secret` for Stripe.js integration.

### Add Your Products
Edit `simplified-medusa-backend/data.json`:
```json
{
  "products": [
    {
      "id": "prod_mycourse",
      "title": "Your Course Name",
      "variants": [{
        "id": "var_default",
        "title": "Default",
        "prices": [{ "currency_code": "usd", "amount": 29900 }]
      }]
    }
  ]
}
```

---

## 📱 Frontend Components (No Changes)

These stay the same:
- `/components/product-card.tsx` ✅
- `/app/products/page.tsx` ✅
- `/app/products/[slug]/page.tsx` ✅
- Cart UI components ✅
- Product filters ✅

Only `/hooks/use-zarinpal-payment.ts` and `/app/checkout/page.tsx` need updates.

---

## 🚀 Optional Enhancements

### Add Promotions
```typescript
// In checkout:
{
  items: [...],
  promotion_code: "SUMMER25",  // Add this
  currency: "usd",
  customer_email: "..."
}
```

### Support Multiple Currencies
```typescript
const currency = userRegion === 'US' ? 'usd' : 'eur'
```

### Track Inventory
Backend supports `manage_inventory` and `inventory_quantity` per variant.

---

## 📞 Support Resources

1. **Backend docs**: [simplified-medusa-backend/API.md](../simplified-medusa-backend/API.md)
2. **Data format**: [simplified-medusa-backend/MEDUSA_COMPATIBILITY.md](../simplified-medusa-backend/MEDUSA_COMPATIBILITY.md)
3. **Examples**: Run `bash simplified-medusa-backend/examples.sh`

---

## ✨ You're Ready!

Your client is built correctly. The integration is straightforward because:
- ✅ Data structures match exactly
- ✅ API format is similar to Medusa
- ✅ Only payment flow needs adjustment
- ✅ Product display unchanged
- ✅ Cart logic unchanged

**Estimated total time: 45-60 minutes** ⏱️

Good luck! 🎉
