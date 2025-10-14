# Railway Medusa Backend - Quick Setup

## 🚨 Current Error
```
Environment variable for DATABASE_URL is not set
```

## ✅ Solution: Add Environment Variables

### Step 1: Go to Railway Dashboard

1. Open https://railway.app
2. Select your project
3. Click on your **Medusa Backend** service (the one pointing to `medusa-backend` folder)
4. Go to **Variables** tab

### Step 2: Add MINIMUM Required Variables

Click "**New Variable**" and add these one by one:

#### 1. Database Connection
```
Variable: DATABASE_URL
Value: ${{Postgres.DATABASE_URL}}
```
*This automatically links to your Railway PostgreSQL service*

#### 2. JWT Secret (Generate Random)
Open a terminal and run:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the output, then in Railway:
```
Variable: JWT_SECRET
Value: <paste-the-generated-secret-here>
```

#### 3. Cookie Secret (Generate Random)
Run the same command again:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the output, then in Railway:
```
Variable: COOKIE_SECRET
Value: <paste-the-generated-secret-here>
```

#### 4. Redis (Recommended)
```
Variable: REDIS_URL
Value: ${{Redis.REDIS_URL}}
```
*This automatically links to your Railway Redis service*

#### 5. CORS Settings (Important!)
Get your **frontend Railway URL** first, then add:

```
Variable: STORE_CORS
Value: https://your-frontend-app.railway.app,http://localhost:3000

Variable: ADMIN_CORS
Value: https://your-frontend-app.railway.app,http://localhost:9000

Variable: AUTH_CORS
Value: https://your-frontend-app.railway.app,http://localhost:9000
```
*Replace `your-frontend-app.railway.app` with your actual frontend URL*

### Step 3: Redeploy

After adding variables:
1. Railway will automatically trigger a redeploy
2. Wait for the build to complete
3. Check the logs for success

---

## 📋 Full Variable List (Copy-Paste Ready)

Here's a **minimal working setup**. Add these to Railway Variables:

```bash
# Core Required
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=<generate-with-crypto>
COOKIE_SECRET=<generate-with-crypto>

# Redis (Recommended)
REDIS_URL=${{Redis.REDIS_URL}}

# CORS (Update with your URLs)
STORE_CORS=https://your-frontend.railway.app,http://localhost:3000
ADMIN_CORS=https://your-frontend.railway.app,http://localhost:9000
AUTH_CORS=https://your-frontend.railway.app,http://localhost:9000

# Optional Settings
MEDUSA_WORKER_MODE=shared
MEDUSA_DISABLE_ADMIN=false
```

---

## 🎯 Generate Secrets Quickly

### Option 1: Using Node.js (in terminal)
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Option 2: Using OpenSSL
```bash
openssl rand -hex 32
```

### Option 3: Using PowerShell (Windows)
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Run twice** - once for JWT_SECRET and once for COOKIE_SECRET!

---

## 🔗 Linking Services

Railway uses the syntax `${{ServiceName.VARIABLE_NAME}}` to link services.

**Make sure you have these services in your project:**
- ✅ PostgreSQL (for `DATABASE_URL`)
- ✅ Redis (for `REDIS_URL`)

If you don't have them:
1. Click "**+ New**" in Railway dashboard
2. Select "**Database**" → "**Add PostgreSQL**" or "**Add Redis**"

---

## 🚀 After Variables are Set

Your Medusa backend will automatically redeploy and you should see:

```bash
✓ Compiled successfully
Server is ready on port: 9000
Medusa is ready!
```

Then you can access:
- **API**: `https://your-medusa.railway.app/health`
- **Admin**: `https://your-medusa.railway.app/app`

---

## 🐛 Troubleshooting

### Error: "Cannot connect to database"
- Make sure PostgreSQL service is running
- Verify `DATABASE_URL` variable is set correctly

### Error: "JWT_SECRET must be at least 32 characters"
- Generate a new secret using the crypto command above
- Make sure you copied the full output (should be 64 characters)

### Error: "Redis connection failed"
- Check Redis service is running
- Variable fails back to in-memory if Redis not available (works but not ideal)

### Error: "CORS blocked"
- Add your frontend URL to `STORE_CORS`, `ADMIN_CORS`, and `AUTH_CORS`
- Make sure there are no trailing slashes in URLs

---

## 📝 Optional Variables (Add Later)

Once basic setup works, you can add:

### Email Notifications (Resend)
```
RESEND_API_KEY=re_your_key_from_resend.com
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

### Payments (Stripe)
```
STRIPE_API_KEY=sk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### Search (Meilisearch)
```
MEILISEARCH_HOST=${{Meilisearch.RAILWAY_PRIVATE_DOMAIN}}:7700
MEILISEARCH_ADMIN_KEY=${{Meilisearch.MEILI_MASTER_KEY}}
```

### File Storage (MinIO)
```
MINIO_ENDPOINT=${{MinIO.RAILWAY_PRIVATE_DOMAIN}}:9000
MINIO_ACCESS_KEY=your_minio_access_key
MINIO_SECRET_KEY=your_minio_secret_key
MINIO_BUCKET=medusa-media
```

---

## ✅ Success Criteria

Your setup is complete when:
1. ✅ Build completes without errors
2. ✅ `/health` endpoint returns `{"status":"ok"}`
3. ✅ Admin dashboard loads at `/app`
4. ✅ No errors in Railway logs

**Good luck! 🚀**

