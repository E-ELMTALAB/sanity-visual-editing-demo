# Deployment Testing Guide

## 🎉 Deployment Successful! Now What?

Your Railway deployment is live. Follow this guide to test and verify everything is working correctly.

## Step 1: Get Your Deployment URLs

### Find Your URLs in Railway:

1. Go to https://railway.app
2. Open your project
3. You should see multiple services:
   - **Frontend (Next.js)** - Your main website
   - **Medusa Backend** - Your e-commerce API
   - **PostgreSQL** - Database
   - **Redis** - Cache/Queue
   - **MinIO** - File storage (if configured)
   - **Meilisearch** - Search engine (if configured)

4. Click on each service to get their URLs:
   - Frontend: `https://your-app.railway.app`
   - Medusa: `https://your-medusa.railway.app`

## Step 2: Test the Frontend (Next.js)

### Basic Tests:

1. **Homepage**
   ```
   Visit: https://your-app.railway.app
   Expected: Homepage loads with your content
   ```

2. **Blog Page**
   ```
   Visit: https://your-app.railway.app/blog
   Expected: Blog posts list appears
   ```

3. **Products Page**
   ```
   Visit: https://your-app.railway.app/products
   Expected: Products grid loads
   ```

4. **Courses Page**
   ```
   Visit: https://your-app.railway.app/courses
   Expected: Courses listing appears
   ```

5. **Sanity Studio**
   ```
   Visit: https://your-app.railway.app/studio
   Expected: Sanity Studio login screen
   ```

## Step 3: Test Medusa v2 Backend

### 3.1 Access Medusa Admin Dashboard

```
Visit: https://your-medusa.railway.app/app
Expected: Medusa Admin login screen
```

**First Time Setup:**
1. If you see a login screen, you need to create an admin user
2. You'll need to do this via API or seed script

### 3.2 Create Admin User (First Time Only)

**Option A: Via API Request**

Use a tool like Postman or curl:

```bash
curl -X POST https://your-medusa.railway.app/admin/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "supersecret123"
  }'
```

**Option B: Via Railway Shell**

1. In Railway, click on your Medusa service
2. Go to "Shell" tab
3. Run:
   ```bash
   cd /app
   npx medusa user -e admin@example.com -p supersecret123
   ```

### 3.3 Test Medusa API Endpoints

**Health Check:**
```bash
curl https://your-medusa.railway.app/health
# Expected: {"status":"ok"}
```

**Store API:**
```bash
curl https://your-medusa.railway.app/store/products
# Expected: JSON response with products (may be empty)
```

**Admin API:**
```bash
curl https://your-medusa.railway.app/admin/products \
  -H "Authorization: Bearer YOUR_TOKEN"
# Expected: JSON response with products
```

## Step 4: Verify Services

### 4.1 Check Database Connection

In Railway:
1. Click on PostgreSQL service
2. Go to "Metrics" tab
3. Should show active connections

### 4.2 Check Redis

In Railway:
1. Click on Redis service
2. Go to "Metrics" tab
3. Should show memory usage and connections

### 4.3 Check MinIO (File Storage)

**Test File Upload:**
1. Login to Medusa Admin
2. Go to Products
3. Try uploading a product image
4. If it works, MinIO is configured correctly

**Alternative: Direct MinIO Access**
```
Visit: https://your-minio.railway.app (if exposed)
Login with credentials from env vars
```

### 4.4 Check Meilisearch (Search)

**Test Search:**
```bash
curl https://your-meilisearch.railway.app/health
# Expected: {"status":"available"}
```

## Step 5: Test E-commerce Functionality

### 5.1 Create a Test Product (Medusa Admin)

1. Login to Medusa Admin: `https://your-medusa.railway.app/app`
2. Navigate to Products
3. Click "Create Product"
4. Fill in:
   - Title: "Test Product"
   - Description: "This is a test"
   - Price: 100
5. Save and publish

### 5.2 Verify Product on Frontend

```
Visit: https://your-app.railway.app/products
Expected: Your test product should appear
```

### 5.3 Test Cart Functionality

1. Click "Add to Cart" on a product
2. Check cart icon - should show (1)
3. Go to cart page
4. Verify product appears in cart

### 5.4 Test Checkout (if Stripe is configured)

1. Go to cart
2. Click "Checkout"
3. Fill in shipping info
4. Use Stripe test card: `4242 4242 4242 4242`
5. Complete purchase
6. Verify order appears in Medusa Admin

## Step 6: Monitor Logs

### View Logs in Railway:

1. **Frontend Logs:**
   - Click Next.js service → "Deployments" tab → Latest deployment
   - Check for errors

2. **Backend Logs:**
   - Click Medusa service → "Deployments" tab → Latest deployment
   - Look for startup messages:
     ```
     Server is ready on port: 9000
     Medusa is ready!
     ```

### Common Log Issues:

**❌ Database connection errors:**
- Check PostgreSQL service is running
- Verify DATABASE_URL env var is correct

**❌ Redis connection errors:**
- Check Redis service is running  
- Verify REDIS_URL env var is correct

**❌ MinIO errors:**
- Check MinIO credentials are correct
- Falls back to local storage if MinIO fails

## Step 7: Performance Tests

### Test Load Times:

1. Open browser DevTools (F12)
2. Go to "Network" tab
3. Visit your site
4. Check load times:
   - Homepage: < 3 seconds (first load)
   - API requests: < 500ms

### Test Image Loading:

1. Check product images load correctly
2. Images should be optimized by Next.js
3. No broken image icons

## Step 8: SEO & Meta Tags

### Check Meta Tags:

1. Right-click on homepage → "View Page Source"
2. Look for:
   ```html
   <title>Your Site Title</title>
   <meta name="description" content="...">
   <meta property="og:title" content="...">
   ```

### Test robots.txt:

```
Visit: https://your-app.railway.app/robots.txt
Expected: Robots.txt file appears
```

## Step 9: Mobile Testing

1. Open site on mobile device
2. Test:
   - Navigation menu
   - Product browsing
   - Cart functionality
   - Responsive design

## Common Issues & Solutions

### Issue: "Service Unavailable"
**Solution:** 
- Service may still be starting up
- Check Railway logs for errors
- Verify all environment variables are set

### Issue: "Database connection failed"
**Solution:**
- Check PostgreSQL service is running
- Run migrations: `railway run medusa migrations run` (if needed)

### Issue: "Products not loading"
**Solution:**
- Verify Sanity env vars are correct
- Check Medusa API is responding
- Check browser console for errors

### Issue: "Images not uploading"
**Solution:**
- Check MinIO credentials
- Verify MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY
- Falls back to local storage if MinIO fails

## Step 10: Next Steps & Configuration

### Immediate Tasks:

1. ✅ Change default admin password
2. ✅ Configure email settings (RESEND_API_KEY)
3. ✅ Set up Stripe for payments
4. ✅ Add your products via Medusa Admin
5. ✅ Configure domain name (if needed)

### Content Management:

1. **Sanity Studio**: `https://your-app.railway.app/studio`
   - Add blog posts
   - Add courses
   - Update homepage content
   - Manage FAQs

2. **Medusa Admin**: `https://your-medusa.railway.app/app`
   - Add products
   - Manage orders
   - Configure shipping
   - Set up payment providers

### Production Checklist:

- [ ] Set up custom domain
- [ ] Configure SSL/HTTPS (Railway does this automatically)
- [ ] Set up email notifications (Resend)
- [ ] Configure payment gateway (Stripe)
- [ ] Set up Google Analytics
- [ ] Test all user flows
- [ ] Enable CORS for your domain
- [ ] Set up monitoring and alerts
- [ ] Create database backups schedule

## Useful Commands

### Railway CLI:

```bash
# View logs
railway logs

# Run command in service
railway run <command>

# SSH into service
railway shell

# Check service status
railway status
```

## Getting Help

If you encounter issues:

1. Check Railway deployment logs
2. Check browser console for frontend errors
3. Test API endpoints directly
4. Verify all environment variables are set correctly
5. Check this repository's documentation files

## Success Criteria ✅

Your deployment is successful if:

- ✅ Frontend loads without errors
- ✅ Medusa Admin is accessible
- ✅ Database connections work
- ✅ You can create products in Medusa
- ✅ Products appear on frontend
- ✅ Cart functionality works
- ✅ No critical errors in logs

---

**Congratulations!** 🎉 Your Medusa v2 + Next.js application is now live on Railway!

