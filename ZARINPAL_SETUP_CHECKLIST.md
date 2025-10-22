# ✅ Zarinpal Integration - Complete Setup Checklist

Follow this checklist to get your Zarinpal payment gateway working.

---

## 📋 Backend Setup (Medusa)

### ✓ Step 1: Get Zarinpal Credentials

- [ ] Sign up or log in to [Zarinpal Dashboard](https://www.zarinpal.com/panel)
- [ ] Navigate to **Settings** → **API & Webhooks**
- [ ] Copy your **Merchant ID** (format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

### ✓ Step 2: Configure Environment Variables

- [ ] Open `medusa-backend/.env` file
- [ ] Add these variables:

```env
ZARINPAL_MERCHANT_ID=your-merchant-id-here
ZARINPAL_SANDBOX=true
ZARINPAL_CALLBACK_URL=http://localhost:3000/checkout/callback
```

> 💡 Use the template in `medusa-backend/ENV_ZARINPAL_TEMPLATE.txt`

### ✓ Step 3: Verify Installation

- [ ] All files created (check `medusa-backend/src/modules/payment-zarinpal/`)
- [ ] Dependencies installed (axios should be in `package.json`)
- [ ] Configuration updated (`medusa-config.js` includes Zarinpal)

### ✓ Step 4: Restart Backend

```bash
cd medusa-backend
pnpm dev
```

- [ ] Backend starts without errors
- [ ] Look for Zarinpal in the logs (should show provider is loaded)

### ✓ Step 5: Enable in Medusa Admin

- [ ] Open http://localhost:9000/app
- [ ] Log in to Medusa Admin
- [ ] Go to **Settings** → **Regions**
- [ ] Select your region (e.g., "Iran" with currency "IRR")
  - If no region exists, create one with currency **IRR** (Iranian Rial)
- [ ] Under **Payment Providers**, enable **Zarinpal**
- [ ] Click **Save**

---

## 🧪 Testing

### ✓ Step 6: Run Test Script

```bash
cd medusa-backend
.\test-zarinpal.ps1
```

- [ ] Script runs successfully
- [ ] Cart is created
- [ ] Product is added
- [ ] Zarinpal payment session is created
- [ ] Payment URL is generated

### ✓ Step 7: Test Payment Flow

- [ ] Copy the payment URL from test script output
- [ ] Open URL in browser
- [ ] Use test card credentials:
  - Card Number: `5022-2910-0000-0000`
  - CVV2: `123`
  - Expiry: `12/30`
- [ ] Complete the test payment
- [ ] Verify you're redirected to callback URL

---

## 💻 Frontend Setup

### ✓ Step 8: Create Callback Route

Create the callback page in your frontend app:

**For Next.js App Router:**
- [ ] Create `app/checkout/callback/page.tsx`
- [ ] Use the example from `medusa-backend/examples/frontend-zarinpal-example.tsx`

**For Next.js Pages Router:**
- [ ] Create `pages/checkout/callback.tsx`

### ✓ Step 9: Add Environment Variables

In your frontend `.env.local`:

```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
```

### ✓ Step 10: Implement Checkout Flow

- [ ] Create checkout page component
- [ ] Add "Pay with Zarinpal" button
- [ ] Implement payment initialization
- [ ] Implement callback handler
- [ ] Test complete flow end-to-end

### ✓ Step 11: Configure CORS

If you get CORS errors:

In `medusa-backend/.env`:
```env
STORE_CORS=http://localhost:3000
```

- [ ] Add your frontend URL to STORE_CORS
- [ ] Restart backend

---

## 🚀 Production Deployment

### ✓ Step 12: Get Production Credentials

- [ ] Request production Merchant ID from Zarinpal
- [ ] Verify your business with Zarinpal (if required)

### ✓ Step 13: Update Environment Variables

**Backend (Production):**
```env
ZARINPAL_MERCHANT_ID=your-production-merchant-id
ZARINPAL_SANDBOX=false
ZARINPAL_CALLBACK_URL=https://yourdomain.com/checkout/callback
STORE_CORS=https://yourdomain.com
```

**Frontend (Production):**
```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-backend-domain.com
```

### ✓ Step 14: Production Testing

- [ ] Deploy to staging/production
- [ ] Test with small real amount
- [ ] Verify payment appears in Zarinpal dashboard
- [ ] Confirm order is created in Medusa
- [ ] Test refund process (manual in Zarinpal dashboard)

---

## 🔍 Verification

### ✓ Final Checks

- [ ] Backend starts without errors
- [ ] Zarinpal provider appears in Medusa Admin
- [ ] Test payment completes successfully
- [ ] Order is created in Medusa after payment
- [ ] Callback URL works correctly
- [ ] No CORS errors in browser console
- [ ] Payment details saved correctly

---

## 📊 Monitoring

### ✓ Setup Monitoring

- [ ] Check Zarinpal dashboard regularly for transactions
- [ ] Monitor Medusa backend logs for errors
- [ ] Set up alerts for failed payments (optional)
- [ ] Track payment success rates

---

## 📚 Documentation Reference

| Document | Purpose |
|----------|---------|
| `ZARINPAL_SETUP_COMPLETE.md` | Overview of what was installed |
| `ZARINPAL_INTEGRATION_GUIDE.md` | Complete integration guide |
| `ZARINPAL_QUICK_START.md` | 5-minute quick start |
| `ENV_ZARINPAL_TEMPLATE.txt` | Environment variables template |
| `examples/frontend-zarinpal-example.tsx` | Frontend code examples |

---

## ❓ Troubleshooting

### Issue: "Payment provider not found"
- **Solution**: Check `ZARINPAL_MERCHANT_ID` is set and restart backend

### Issue: "Region doesn't support this provider"
- **Solution**: Enable Zarinpal in Medusa Admin → Settings → Regions

### Issue: CORS errors
- **Solution**: Add frontend URL to `STORE_CORS` in backend `.env`

### Issue: "Payment verification failed"
- **Solution**: Check authority code matches and payment wasn't already verified

### Issue: Amount errors
- **Solution**: Ensure region currency is set to `IRR` in Medusa Admin

---

## 🎉 Success Criteria

You know everything is working when:

1. ✅ Backend starts without errors
2. ✅ Test script generates payment URL
3. ✅ Payment page loads on Zarinpal
4. ✅ Test payment completes successfully
5. ✅ Customer is redirected to callback URL
6. ✅ Payment is verified
7. ✅ Order is created in Medusa
8. ✅ Transaction appears in Zarinpal dashboard

---

## 📞 Need Help?

- Check the full guide: `ZARINPAL_INTEGRATION_GUIDE.md`
- Review troubleshooting section
- Check Zarinpal docs: https://docs.zarinpal.com/
- Check Medusa docs: https://docs.medusajs.com/

---

**Ready to accept payments! 🚀**

