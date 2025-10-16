# 🚀 Create Your First Product - Ready to Use!

I've deployed a **test endpoint** that will create a beautiful sample product for you!

---

## ⚡ Quick Method (No Authentication Needed)

### **Option 1: Using Browser (Easiest)**

Just open this URL in your browser:

```
https://backend-production-ea59.up.railway.app/test/add-sample-product
```

*(This will create the product and show you the result as JSON)*

---

### **Option 2: Using PowerShell**

```powershell
$result = Invoke-WebRequest -Uri "https://backend-production-ea59.up.railway.app/test/add-sample-product" -Method POST -UseBasicParsing
$product = $result.Content | ConvertFrom-Json
Write-Output "✅ Product Created!"
Write-Output "ID: $($product.product.id)"
Write-Output "Title: $($product.product.title)"
Write-Output "Admin URL: $($product.admin_url)"
```

---

### **Option 3: Using cURL**

```bash
curl -X POST https://backend-production-ea59.up.railway.app/test/add-sample-product
```

---

## 📦 What Product Will Be Created?

**Product:** Premium Wireless Headphones Pro

**Details:**
- 🎯 **Title**: Premium Wireless Headphones Pro
- 🏷️ **SKU Prefix**: HDPHN-AP3000X
- 📸 **Images**: 3 high-quality product photos
- 🎨 **Variants**: 3 color options

**Variants:**
1. **Midnight Black**
   - Price: $349.99
   - Stock: 150 units
   - SKU: HDPHN-AP3000X-MIDNIGHT-BLACK

2. **Silver Gray**
   - Price: $349.99
   - Stock: 100 units
   - SKU: HDPHN-AP3000X-SILVER-GRAY

3. **Rose Gold** (Limited Edition)
   - Price: $369.99
   - Stock: 75 units
   - SKU: HDPHN-AP3000X-ROSE-GOLD

**Features:**
- ✅ Active Noise Cancellation (ANC)
- ✅ Bluetooth 5.3 with multipoint connection
- ✅ 40h battery life with fast charging
- ✅ Premium drivers for studio-quality sound
- ✅ Comfortable over-ear design

**Metadata:**
- Brand: AudioPro
- Model: AP-3000X Pro
- Warranty: 2 years international
- Origin: USA
- Weight: 250g

---

## 🎯 After Creating the Product

### **1. View in Admin Dashboard**

The response will include an `admin_url` link like:
```
https://backend-production-ea59.up.railway.app/app/products/prod_01HJW...
```

Click this to view and edit the product in your admin panel!

### **2. View in Store API**

Test the store API:
```bash
# Get publishable key
curl https://backend-production-ea59.up.railway.app/key-exchange

# List products (use the key from above)
curl -H "x-publishable-api-key: YOUR_KEY" \
  https://backend-production-ea59.up.railway.app/store/products
```

### **3. Check Total Products**

```bash
curl https://backend-production-ea59.up.railway.app/diagnostics
```

Look for `productsCount` - it should increase by 1!

---

## 🔄 Want to Create More Products?

### **Method 1: Use the Test Endpoint Again**

Just call it multiple times! Each time it will create a product with a unique handle:
```
premium-wireless-headphones-1729000000
premium-wireless-headphones-1729000001
...
```

### **Method 2: Use the Full API (Requires Admin Token)**

```bash
curl -X POST https://backend-production-ea59.up.railway.app/admin/products/create-full \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d @medusa-backend/example-product.json
```

*(See `PRODUCT_API_DOCUMENTATION.md` for details on getting admin token)*

---

## ⏱️ If Endpoint Not Ready Yet

Railway may still be deploying (takes 2-3 minutes). Check status:

```bash
# Check if backend is running
curl https://backend-production-ea59.up.railway.app/health

# Check diagnostics
curl https://backend-production-ea59.up.railway.app/diagnostics
```

If you see `"status": "ok"` from health, wait 1 more minute and try again!

---

## 🐛 Troubleshooting

### **404 Not Found**
- Railway is still deploying
- Wait 2-3 minutes after pushing to GitHub
- Check Railway dashboard for build status

### **500 Internal Server Error**
- Check Railway logs for details
- May need to check database connection
- Try the diagnostics endpoint first

### **Product Already Exists**
- This is fine! The endpoint creates unique handles each time
- Check your admin dashboard - it should be there

---

## 📊 Expected Response

```json
{
  "success": true,
  "message": "✅ Sample product created successfully!",
  "product": {
    "id": "prod_01JVMX...",
    "title": "Premium Wireless Headphones Pro",
    "handle": "premium-wireless-headphones-1729000000",
    "status": "published",
    "variants": [
      {
        "title": "Midnight Black",
        "sku": "HDPHN-AP3000X-MIDNIGHT-BLACK",
        "inventory_quantity": 150,
        "prices": [...]
      }
    ]
  },
  "admin_url": "https://.../app/products/prod_01JVMX...",
  "store_url": "https://.../store/products/premium-wireless-headphones-..."
}
```

---

## 🎉 Success Checklist

After creating the product, verify:

- [ ] Product appears in admin dashboard (`/app/products`)
- [ ] All 3 variants are created (Black, Silver, Rose Gold)
- [ ] Images are displayed correctly
- [ ] Stock quantities are set (150, 100, 75)
- [ ] Prices are correct ($349.99, $349.99, $369.99)
- [ ] Product is published (status: "published")
- [ ] Product appears in store API

---

## 🚀 Ready to Create?

**Just open this URL in your browser:**
```
https://backend-production-ea59.up.railway.app/test/add-sample-product
```

**Or use PowerShell:**
```powershell
Invoke-WebRequest -Uri "https://backend-production-ea59.up.railway.app/test/add-sample-product" -Method POST
```

**The product will be created instantly!** ✨

---

**Note:** This endpoint is for testing. For production, use the authenticated endpoint at `/admin/products/create-full` with proper authentication.

