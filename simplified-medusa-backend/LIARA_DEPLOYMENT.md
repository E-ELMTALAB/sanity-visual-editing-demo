# 🚀 Deploy Pre-built Medusa Backend to Liara (No npm install needed!)

## What You Have ✅

- **`medusa-backend-prebuilt.tar.gz`** (1.7MB)
  - All dependencies pre-installed (`node_modules/`)
  - Real Medusa data synced (18 products, 26 prices)
  - Ready to extract and run immediately
  - No npm install needed on Liara

---

## Step-by-Step Deployment

### Option 1: Via Liara Dashboard (Easiest - No CLI)

#### 1. **Download the Archive**
```bash
# On your local machine, download from:
# /simplified-medusa-backend/medusa-backend-prebuilt.tar.gz
```

#### 2. **Prepare Archive for Upload**
The archive is ready to use. It's already compressed and contains:
```
app/
├── node_modules/        (all dependencies, pre-installed)
├── package.json
├── package-lock.json
├── index.js
├── data.json            (18 products synced from Medusa)
└── ... (other files)
```

#### 3. **Create Liara Project**
- Go to https://console.liara.ir
- Click "New App"
- Select "Node.js"
- Choose project name: `medusa-backend` (or your choice)

#### 4. **Get Upload Endpoint**
- In Liara dashboard, go to your app settings
- Look for "Deploy" or "Upload" section
- Note the SFTP or HTTP upload endpoint

#### 5. **Upload the Archive**
Option A: Using web dashboard
- Navigate to Files section
- Upload `medusa-backend-prebuilt.tar.gz`
- Click to extract it

Option B: Using command (if Liara CLI is available)
```bash
# Navigate to the folder with the archive
cd /path/to/medusa-backend-prebuilt.tar.gz

# Use Liara's file upload feature
liara files upload medusa-backend-prebuilt.tar.gz
```

#### 6. **Extract on Liara Server**
Once uploaded, SSH into your Liara app:
```bash
# SSH into Liara (instructions provided in dashboard)
ssh user@liara-app-name.liara.sh

# Navigate to app directory
cd /var/www

# Extract the archive
tar -xzf medusa-backend-prebuilt.tar.gz

# Move app contents to root
mv app/* .
rm -rf app/ medusa-backend-prebuilt.tar.gz
```

#### 7. **Set Environment Variables**
In Liara dashboard > Environment section, add:
```
PORT=3000
ZARINPAL_MERCHANT_ID=your-merchant-id
ZARINPAL_CALLBACK_BASE=https://your-app-on-liara.liara.sh
ZARINPAL_CONVERSION_RATE=1
ZARINPAL_SANDBOX=false
FRONTEND_SUCCESS_URL=https://your-frontend.com/success
FRONTEND_FAILURE_URL=https://your-frontend.com/failure
```

#### 8. **Start the App**
In Liara > App Settings:
- Set Startup Command: `node index.js`
- Click "Restart App"

#### 9. **Verify Deployment**
```bash
# Test the API
curl https://your-app-on-liara.liara.sh/store/products

# Should return your 18 products!
```

---

### Option 2: Via Liara Git Integration (Recommended if available)

#### 1. **Extract Locally and Commit to Git**
```bash
# Extract the archive
mkdir -p medusa-backend-deploy
tar -xzf medusa-backend-prebuilt.tar.gz -C medusa-backend-deploy

# Copy to your git repo
cp -r medusa-backend-deploy/app/* ./simplified-medusa-backend/

# Commit (node_modules will be in .gitignore, but that's OK for this method)
git add .
git commit -m "Add pre-built Medusa backend for Liara deployment"
git push
```

#### 2. **Create Liara Project from Git**
- Go to https://console.liara.ir
- Click "New App"
- Select "Node.js"
- Connect to your GitHub repo
- Select `simplified-medusa-backend` folder
- Click Deploy

Liara will:
- ✅ Detect `package.json`
- ✅ Run `npm install` (but you can skip if node_modules is included)
- ✅ Run `npm start` (or your startup command)

---

## What Happens Next

### On Deployment:
1. Extract the archive on Liara
2. Node.js reads `package.json` and finds all dependencies
3. Since `node_modules/` is already there, it skips npm install ⚡
4. `npm start` (or `node index.js`) starts the server
5. Server loads data from `data.json` (18 products, 0 promotions)
6. Server listens on port 3000

### On First Request:
```bash
curl https://your-liara-app.liara.sh/store/products
```

**Response:**
```json
{
  "products": [
    {
      "id": "...",
      "title": "ChatGPT Plus",
      "variants": [
        {
          "id": "...",
          "prices": null  // null unless you request with ?fields=*variants.prices
        }
      ]
    },
    ...
  ]
}
```

---

## Troubleshooting

### App won't start
```bash
# SSH into Liara and check:
ssh user@your-app.liara.sh

# Check if node_modules exists
ls -la node_modules

# Try starting manually
node index.js

# Check logs
cat /var/log/app.log
```

### "Cannot find module" errors
```bash
# node_modules might not have extracted correctly
tar -xzf medusa-backend-prebuilt.tar.gz
# Or reinstall
npm install
```

### Port already in use
```bash
# Change PORT in Liara environment variables
# Or check what's using port 3000
lsof -i :3000
```

### Data not loading
```bash
# Verify data.json exists
ls -la data.json

# Check if it's valid JSON
node -e "console.log(JSON.parse(require('fs').readFileSync('data.json')))" | head
```

---

## Size Reference

| Component | Size |
|-----------|------|
| Archive | 1.7MB |
| Extracted | ~45MB (node_modules is large) |
| Data (18 products) | 71KB |

---

## Estimated Deployment Time

- Archive upload: 2-5 minutes (depending on connection)
- Extraction: 30 seconds
- App startup: 5-10 seconds
- **Total: ~5-7 minutes**

---

## What You Can Do After Deployment

✅ **Fetch all products:**
```bash
curl https://your-app.liara.sh/store/products
```

✅ **Get a single product:**
```bash
curl https://your-app.liara.sh/store/products?handle=chatgpt-plus
```

✅ **Expand prices:**
```bash
curl "https://your-app.liara.sh/store/products?fields=*variants.prices"
```

✅ **Create a cart:**
```bash
curl -X POST https://your-app.liara.sh/store/cart/create \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"variant_id": "...", "quantity": 1}
    ]
  }'
```

✅ **Initiate Zarinpal payment:**
```bash
curl -X POST https://your-app.liara.sh/store/zarinpal/initiate-payment \
  -H "Content-Type: application/json" \
  -d '{
    "cart_id": "...",
    "amount": 50000,
    "description": "Purchase"
  }'
```

---

## Support

- **Liara Docs:** https://docs.liara.ir
- **Node.js Support:** https://nodejs.org
- **Questions about data:** Check `data.json` (2292 lines, all 18 products with variants)

---

## Success Checklist ✅

- [ ] Archive downloaded: `medusa-backend-prebuilt.tar.gz` (1.7MB)
- [ ] Liara project created
- [ ] Archive uploaded to Liara
- [ ] Archive extracted on Liara server
- [ ] Environment variables set
- [ ] App restarted
- [ ] GET /store/products returns 18 products
- [ ] Prices expand with `?fields=*variants.prices`
- [ ] Cart creation works
- [ ] Payment endpoints accessible

---

**You're ready to deploy! 🚀**

The archive has everything you need. No npm install required on Liara. Just extract and run!
