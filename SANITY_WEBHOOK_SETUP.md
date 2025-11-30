# Automatic Sanity → Medusa Sync with Webhooks

## What This Does

**Any time you create, update, or save a product in Sanity → It automatically syncs to Medusa in real-time!**

No manual script needed. Fully automatic.

---

## Setup Steps (5 minutes)

### Step 1: Deploy Frontend with Webhook Endpoint

The webhook endpoint is already created at:
```
sharifgpt-website/app/api/webhooks/sanity-sync/route.ts
```

**Just deploy your frontend** (Vercel will auto-deploy from git push).

Your webhook URL will be:
```
https://your-vercel-domain.com/api/webhooks/sanity-sync
```

---

### Step 2: Configure Webhook in Sanity

1. **Go to Sanity Manage:**
   ```
   https://sanity.io/manage
   ```

2. **Select your project**

3. **Go to API tab → Webhooks**

4. **Click "Create webhook"**

5. **Fill in the form:**
   ```
   Name: Medusa Product Sync
   
   URL: https://your-vercel-domain.com/api/webhooks/sanity-sync
   
   Dataset: production
   
   Trigger on: Create, Update, Delete
   
   Filter (optional): _type == "product"
   
   HTTP method: POST
   
   HTTP Headers (optional):
   sanity-webhook-secret: your-webhook-secret
   
   API version: v2021-10-21
   ```

6. **Click "Save"**

---

### Step 3: Test It!

1. **Go to Sanity Studio**
2. **Create or edit a product**
3. **Click "Publish"**
4. **Check Medusa Admin** - product should appear/update automatically!

---

## How It Works

```
┌─────────────────────────────────────────────────────┐
│  1. You edit product in Sanity Studio              │
│     - Create new product                            │
│     - Update existing product                       │
│     - Change price, name, options, etc.            │
└────────────────┬────────────────────────────────────┘
                 │
                 │ Click "Publish"
                 ▼
┌─────────────────────────────────────────────────────┐
│  2. Sanity triggers webhook                         │
│     POST https://your-domain.com/api/webhooks/...  │
│     Body: { product data }                          │
└────────────────┬────────────────────────────────────┘
                 │
                 │ Webhook received
                 ▼
┌─────────────────────────────────────────────────────┐
│  3. Your webhook endpoint processes it              │
│     - Validates webhook secret                      │
│     - Formats product data                          │
│     - Calls Medusa sync API                         │
└────────────────┬────────────────────────────────────┘
                 │
                 │ Sync to Medusa
                 ▼
┌─────────────────────────────────────────────────────┐
│  4. Medusa creates/updates product                  │
│     - Product + variants created                    │
│     - Prices stored in metadata                     │
│     - Ready for frontend to use                     │
└─────────────────────────────────────────────────────┘
```

---

## Webhook Configuration Details

### URL Format
```
https://your-vercel-domain.com/api/webhooks/sanity-sync
```

### Headers (Optional but Recommended)
```
sanity-webhook-secret: your-custom-secret-here
```

Add this to your frontend `.env.local`:
```env
SANITY_WEBHOOK_SECRET=your-custom-secret-here
```

This prevents unauthorized webhook calls.

### Filter Expression
```groq
_type == "product"
```

This ensures webhook only triggers for product changes, not other content.

### Projection (Leave Empty)
The webhook will send the entire product document by default, which is what we need.

---

## Testing the Webhook

### Method 1: Test in Sanity Dashboard

1. Go to your webhook in Sanity
2. Click "Test webhook"
3. Select a product
4. Click "Send"
5. Check the response and logs

### Method 2: Test by Publishing

1. Edit any product in Sanity Studio
2. Click "Publish"
3. Check Vercel function logs:
   ```
   https://vercel.com/your-project/deployments
   → Click latest deployment
   → Functions tab
   → Find /api/webhooks/sanity-sync
   → View logs
   ```

### Method 3: Test Locally

```bash
# Start frontend
cd sharifgpt-website
npm run dev

# In another terminal, trigger webhook manually:
curl -X POST http://localhost:3000/api/webhooks/sanity-sync \
  -H "Content-Type: application/json" \
  -H "sanity-webhook-secret: your-webhook-secret" \
  -d '{
    "_id": "test-123",
    "_type": "product",
    "name": "Test Product",
    "slug": {"current": "test-product"},
    "options": [
      {"id": "1", "name": "Option 1", "price": 100000}
    ]
  }'
```

---

## Troubleshooting

### Webhook not triggering
- Check webhook is enabled in Sanity
- Verify URL is correct
- Check filter expression matches your documents
- Look at webhook logs in Sanity dashboard

### Webhook fails
- Check Vercel function logs
- Verify Medusa backend is accessible
- Check publishable API key is correct
- Verify product data format

### Product not appearing in Medusa
- Check Medusa backend logs on Railway
- Verify product has valid slug
- Check if product already exists (updates might not be visible)
- Go to Medusa Admin → Products to verify

---

## Advanced: Webhook Security

### Current Security (Basic)
- Optional secret header check
- Validates webhook payload format

### Enhanced Security (Optional)

Add to `.env.local`:
```env
SANITY_WEBHOOK_SECRET=a-very-long-random-secret-string-here
```

The webhook endpoint will verify this secret before processing.

**Generate a secure secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Monitoring

### View Webhook Logs in Sanity
1. Go to sanity.io/manage
2. Select project
3. API → Webhooks
4. Click on your webhook
5. View delivery history and responses

### View Function Logs in Vercel
1. Go to vercel.com
2. Select project
3. Deployments → Latest
4. Functions → /api/webhooks/sanity-sync
5. View execution logs

---

## What Gets Synced Automatically

✅ **Product name**
✅ **Product slug** (handle in Medusa)
✅ **Product description**
✅ **Product options** (becomes variants with prices)
✅ **Updates** to existing products

❌ **Not synced:** Images, SEO fields, other content (stays in Sanity)

---

## Workflow After Setup

### For New Products:
1. Create product in Sanity Studio
2. Add name, description, options with prices
3. Click "Publish"
4. **Automatically appears in Medusa!**
5. Go to Medusa Admin to refine prices/variants if needed

### For Existing Products:
1. Edit product in Sanity Studio
2. Change name, add new options, etc.
3. Click "Publish"
4. **Automatically updates in Medusa!**

### For Price Changes:
- **Initial prices:** Set in Sanity, synced to Medusa
- **After sync:** Update prices in Medusa Admin Panel
- Medusa becomes source of truth for prices
- Frontend fetches from Medusa

---

## One-Time Bulk Sync (For Existing Products)

If you have existing products before webhook setup:

```bash
# Sync all existing products once
node sync-sanity-to-medusa.js
```

After that, webhook handles all new changes automatically!

---

## Summary

**Before:**
- Manual sync script
- Run every time product changes
- Can forget to sync

**After:**
- Fully automatic
- Real-time sync (< 1 second)
- Never forget to sync
- Works while you sleep! 💤

---

**Ready to set up? Follow Step 1 → Step 2 → Step 3 above!**










