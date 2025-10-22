# 🚀 Zarinpal Integration - START HERE

## What I Just Did For You

I've completely integrated Zarinpal payment gateway into your Medusa backend. Here's what's ready:

✅ **Payment Provider Module** - Custom Zarinpal provider in `medusa-backend/src/modules/payment-zarinpal/`
✅ **API Routes** - Verification and status check endpoints
✅ **Configuration** - Updated `medusa-config.js` and constants
✅ **Documentation** - Complete guides and examples
✅ **Test Script** - Automated testing tool

---

## 🎯 What YOU Need To Do (3 Simple Steps)

### Step 1: Get Your Zarinpal Merchant ID (5 minutes)

1. Go to https://www.zarinpal.com/panel
2. Log in or sign up
3. Navigate to **Settings** → **API & Webhooks**
4. Copy your **Merchant ID** (looks like: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

### Step 2: Add Environment Variables (2 minutes)

Open `medusa-backend/.env` and add these lines:

```env
ZARINPAL_MERCHANT_ID=paste-your-merchant-id-here
ZARINPAL_SANDBOX=true
ZARINPAL_CALLBACK_URL=http://localhost:3000/checkout/callback
```

> 💡 Replace `paste-your-merchant-id-here` with your actual Merchant ID from Step 1

### Step 3: Restart Your Backend (1 minute)

```bash
cd medusa-backend
pnpm dev
```

---

## ✅ Test It Works (5 minutes)

### Option A: Automated Test (Recommended)

Run this command:

```bash
cd medusa-backend
.\test-zarinpal.ps1
```

This will:
- Create a test cart
- Add a product
- Generate a Zarinpal payment URL
- Show you the next steps

### Option B: Manual Test via Medusa Admin

1. Open http://localhost:9000/app
2. Go to **Settings** → **Regions**
3. Select your region (or create one with currency **IRR**)
4. Enable **Zarinpal** payment provider
5. Create a test order with Zarinpal payment

---

## 🎨 Frontend Integration (Optional - For Later)

When you're ready to add Zarinpal to your frontend:

1. **Check the example**: `medusa-backend/examples/frontend-zarinpal-example.tsx`
2. **Follow the guide**: `ZARINPAL_SETUP_CHECKLIST.md`

The example includes:
- Complete checkout component
- Callback handler
- Error handling
- Success/failure states

---

## 📖 Documentation Available

| File | What It's For |
|------|---------------|
| **ZARINPAL_SETUP_CHECKLIST.md** | Step-by-step checklist |
| **ZARINPAL_INTEGRATION_GUIDE.md** | Complete integration guide |
| **ZARINPAL_QUICK_START.md** | 5-minute quick start |
| **ZARINPAL_SETUP_COMPLETE.md** | Technical overview |
| **ENV_ZARINPAL_TEMPLATE.txt** | Environment variables template |
| **examples/frontend-zarinpal-example.tsx** | React/Next.js frontend code |
| **test-zarinpal.ps1** | Automated test script |

---

## 💳 Test Card (Sandbox Mode)

When testing, use these credentials:

- **Card Number**: `5022-2910-0000-0000`
- **CVV2**: `123`
- **Expiry Date**: `12/30`

---

## 🔧 Quick Troubleshooting

### "Provider not found"
→ Make sure you added `ZARINPAL_MERCHANT_ID` to `.env` and restarted backend

### "Region doesn't support Zarinpal"
→ Go to Medusa Admin → Settings → Regions → Enable Zarinpal

### CORS errors in browser
→ Add to `.env`: `STORE_CORS=http://localhost:3000`

---

## 🚀 Ready For Production?

When you're ready to go live:

1. Get production Merchant ID from Zarinpal
2. Update `.env`:
   ```env
   ZARINPAL_SANDBOX=false
   ZARINPAL_MERCHANT_ID=production-merchant-id
   ZARINPAL_CALLBACK_URL=https://yourdomain.com/checkout/callback
   ```
3. Test with a small amount first!

---

## 📞 Need More Help?

- **Full Integration Guide**: Open `ZARINPAL_INTEGRATION_GUIDE.md`
- **Checklist**: Open `ZARINPAL_SETUP_CHECKLIST.md`
- **Zarinpal Docs**: https://docs.zarinpal.com/
- **Medusa Docs**: https://docs.medusajs.com/

---

## 🎉 That's It!

**You're 3 steps away from accepting payments:**

1. ✅ Get Merchant ID
2. ✅ Add to `.env`
3. ✅ Restart backend

Then run the test script to verify everything works!

**Good luck! 🚀**

