# 🚂 Railway Deployment Guide for Medusa Backend

Complete guide to deploy your Medusa backend to Railway for testing.

---

## 📋 Prerequisites

- [ ] Railway account (sign up at https://railway.app)
- [ ] GitHub account (for connecting repository)
- [ ] Credit card for Railway (free $5 credit, then pay-as-you-go)

---

## 🎯 Overview

You'll deploy **3 services** on Railway:

1. **PostgreSQL** - Database for Medusa
2. **Redis** - Cache and session storage
3. **Medusa Backend** - E-commerce API

**Estimated Cost**: ~$20-30/month for testing

---

## 📦 Step 1: Prepare Your Repository

### Option A: Push to GitHub (Recommended)

```bash
# In your project root
git add .
git commit -m "Add Medusa backend for Railway deployment"
git push origin main
```

### Option B: Deploy from Local (Alternative)

Railway can also deploy from your local machine using Railway CLI.

---

## 🚀 Step 2: Create Railway Project

1. Go to https://railway.app
2. Click **"New Project"**
3. Choose **"Deploy from GitHub repo"** (or "Empty Project" for local)
4. Select your repository: `sanity-visual-editing-demo`

---

## 🗄️ Step 3: Add PostgreSQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway will automatically provision a PostgreSQL instance
4. Note: Connection details are automatically available as environment variables

**What Railway provides automatically:**
- `PGHOST`
- `PGPORT`
- `PGUSER`
- `PGPASSWORD`
- `PGDATABASE`
- `DATABASE_URL` (full connection string)

---

## 🔴 Step 4: Add Redis

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"Add Redis"**
3. Railway will automatically provision a Redis instance

**What Railway provides automatically:**
- `REDIS_URL` (full connection string)

---

## ⚙️ Step 5: Add Medusa Backend Service

### Create the Service

1. Click **"+ New"** in your Railway project
2. Select **"GitHub Repo"** (or "Empty Service")
3. Select your repository

### Configure Root Directory

Since your Medusa backend is in a subdirectory:

1. Go to **Settings** tab of your Medusa service
2. Scroll to **"Root Directory"**
3. Set to: `medusa-backend`
4. Click **"Save"**

### Configure Build & Start Commands

1. In **Settings** → **"Build"**
2. Set **Build Command**: `npm install && npm run build`
3. Set **Start Command**: `npm run start`

### Set Port

1. In **Settings** → **"Networking"**
2. Railway will auto-detect port 9000
3. Click **"Generate Domain"** to get a public URL

---

## 🔑 Step 6: Configure Environment Variables

In your Medusa service, go to **"Variables"** tab and add these:

### Required Variables

```bash
# Node Environment
NODE_ENV=production

# Database (automatically provided by Railway PostgreSQL)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Redis (automatically provided by Railway Redis)
REDIS_URL=${{Redis.REDIS_URL}}

# JWT Secret (generate a secure random string)
JWT_SECRET=your_super_secret_jwt_token_here_change_this

# Cookie Secret (generate a secure random string)
COOKIE_SECRET=your_super_secret_cookie_token_here_change_this

# Store Configuration
STORE_CORS=https://your-frontend-domain.vercel.app,http://localhost:3000
ADMIN_CORS=https://your-frontend-domain.vercel.app,http://localhost:3000

# Admin User (for initial setup)
ADMIN_EMAIL=admin@sharifgpt.com
ADMIN_PASSWORD=change_this_secure_password

# Medusa API URL (will be your Railway domain)
MEDUSA_BACKEND_URL=https://your-service-name.up.railway.app

# File Upload (optional, for product images)
# For now, use local file system, later switch to S3
```

### How to Generate Secrets

**Using Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Using OpenSSL:**
```bash
openssl rand -hex 32
```

**Using Online Tool:**
- https://generate-secret.vercel.app/32

### Railway Variable Syntax

Railway uses special syntax to reference other services:

- `${{Postgres.DATABASE_URL}}` - References PostgreSQL DATABASE_URL
- `${{Redis.REDIS_URL}}` - References Redis REDIS_URL

### Payment Gateway Variables (Add Later)

```bash
# Zarinpal (Iranian payment gateway)
ZARINPAL_MERCHANT_ID=your_zarinpal_merchant_id
ZARINPAL_SANDBOX=true

# Stripe (International)
STRIPE_API_KEY=sk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# PayPal (International)
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_secret
```

---

## 🔧 Step 7: Update Medusa Config for Railway

The `medusa-config.js` needs to use Railway's environment variables properly.

Your existing config should work, but verify these settings:

```javascript
// medusa-backend/medusa-config.js
module.exports = {
  projectConfig: {
    // Redis URL from Railway
    redis_url: process.env.REDIS_URL || "redis://localhost:6379",
    
    // Database URL from Railway
    database_url: process.env.DATABASE_URL || "postgres://localhost/medusa-store",
    database_type: "postgres",
    
    // Store CORS (your Next.js frontend)
    store_cors: process.env.STORE_CORS,
    admin_cors: process.env.ADMIN_CORS,
    
    // Secrets
    jwt_secret: process.env.JWT_SECRET,
    cookie_secret: process.env.COOKIE_SECRET,
  },
  // ... rest of config
}
```

---

## 🚢 Step 8: Deploy!

1. Railway will automatically detect changes and deploy
2. Or click **"Deploy"** button manually
3. Watch the **"Deployments"** tab for build logs

**Build Process:**
```
1. Cloning repository...
2. Installing dependencies... (npm install)
3. Building Medusa... (npm run build)
4. Starting server... (npm run start)
5. ✅ Deployment successful!
```

---

## 🗄️ Step 9: Run Database Migrations

After first deployment, you need to initialize the database.

### Method 1: Using Railway CLI (Recommended)

Install Railway CLI:
```bash
npm install -g @railway/cli
```

Login:
```bash
railway login
```

Link to your project:
```bash
cd medusa-backend
railway link
```

Run migrations:
```bash
railway run npm run migrate
```

Create admin user:
```bash
railway run npm run seed
```

### Method 2: Using Railway Shell

1. Go to your Medusa service in Railway dashboard
2. Click on **"..."** menu → **"Open Shell"**
3. Run commands:
```bash
npm run migrate
npm run seed
```

### Method 3: Temporary Script (If above don't work)

Add to `medusa-backend/package.json`:
```json
{
  "scripts": {
    "start": "npm run migrate && medusa start",
  }
}
```

This will run migrations on every deployment start.

---

## ✅ Step 10: Verify Deployment

### Check Service Health

Visit your Medusa URL:
```
https://your-service-name.up.railway.app/health
```

You should see:
```json
{
  "status": "ok"
}
```

### Access Admin Panel

Visit:
```
https://your-service-name.up.railway.app/app
```

Login with:
- Email: `admin@sharifgpt.com` (or what you set)
- Password: Your `ADMIN_PASSWORD`

### Test API

```bash
curl https://your-service-name.up.railway.app/store/products
```

Should return:
```json
{
  "products": [],
  "count": 0,
  "offset": 0,
  "limit": 100
}
```

---

## 🔗 Step 11: Connect Frontend to Railway Medusa

Update your Next.js frontend (Vercel deployment):

### In Vercel Environment Variables:

1. Go to your Vercel project settings
2. Add environment variable:

```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-service-name.up.railway.app
```

3. Redeploy your Vercel app

### Update `.env.local` for Local Development:

```bash
# In your project root .env.local
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-service-name.up.railway.app
MEDUSA_ADMIN_API_KEY=your_admin_api_key_from_medusa
```

---

## 🔐 Step 12: Create Admin API Key

You need an API key for frontend-to-backend communication:

### Using Medusa Admin:

1. Log into Medusa admin: `https://your-service.railway.app/app`
2. Go to **Settings** → **API Key Management**
3. Click **"Create API Key"**
4. Name: "Frontend API Key"
5. Copy the key (you can only see it once!)

### Or via API:

```bash
curl -X POST https://your-service.railway.app/admin/auth \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sharifgpt.com",
    "password": "your_password"
  }'
```

Get the token from response, then:

```bash
curl -X POST https://your-service.railway.app/admin/publishable-api-keys \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Frontend Key"}'
```

---

## 🧪 Step 13: Test Product Sync

Now test the sync between Sanity and Railway Medusa:

### Configure Sanity Webhook:

1. Go to https://www.sanity.io/manage
2. Select your project → **API** → **Webhooks**
3. Create new webhook:

```
Name: Product Sync to Railway Medusa
URL: https://your-service.railway.app/store/webhooks/sanity-sync
Dataset: production
Trigger on: Create, Update, Delete
Filter: _type == "product"
HTTP method: POST
Include drafts: No
```

4. Generate and save the secret

### Update Environment Variables:

**In Railway (Medusa service):**
```bash
SANITY_WEBHOOK_SECRET=your_webhook_secret_from_sanity
SANITY_PROJECT_ID=your_sanity_project_id
SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_api_token
```

**In Vercel (Next.js frontend):**
```bash
SANITY_WEBHOOK_SECRET=your_webhook_secret_from_sanity
ADMIN_SYNC_TOKEN=your_random_secure_token_for_manual_sync
```

### Run Initial Migration:

**From your local machine:**
```bash
# Update .env.local with Railway URL
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-service.railway.app

# Run migration
npm run migrate:products
```

---

## 📊 Step 14: Monitor Your Deployment

### Railway Dashboard Metrics:

- CPU usage
- Memory usage
- Network traffic
- Request logs

### View Logs:

1. Click on your Medusa service
2. Go to **"Deployments"** tab
3. Click on latest deployment
4. View real-time logs

### Common Log Commands:

**In Railway Shell:**
```bash
# View recent logs
railway logs

# Follow logs in real-time
railway logs --follow
```

---

## 💰 Step 15: Understand Railway Pricing

### Free Tier:
- $5 free credit (one-time)
- No credit card required for trial

### Paid Tier (after free credit):
- **PostgreSQL**: ~$5-10/month
- **Redis**: ~$5-10/month  
- **Medusa Service**: ~$10-15/month
- **Total**: ~$20-35/month for testing

### Usage-Based:
- CPU: $0.000463/CPU-minute
- Memory: $0.000231/GB-minute
- Network: First 100GB free

### Cost Optimization Tips:

1. **Scale down resources** during testing
2. **Set resource limits** in Railway settings
3. **Use sleep mode** for non-production services
4. **Monitor usage** regularly

---

## 🔧 Troubleshooting

### Issue 1: Build Fails

**Error**: `Cannot find module '@medusajs/medusa'`

**Solution**:
- Check root directory is set to `medusa-backend`
- Verify `package.json` exists in that directory
- Check build logs for specific errors

### Issue 2: Database Connection Error

**Error**: `Connection refused` or `ECONNREFUSED`

**Solution**:
- Verify PostgreSQL service is running
- Check `DATABASE_URL` variable is set correctly
- Use Railway's reference syntax: `${{Postgres.DATABASE_URL}}`
- Restart Medusa service

### Issue 3: Redis Connection Error

**Error**: `Redis connection failed`

**Solution**:
- Verify Redis service is running
- Check `REDIS_URL` variable
- Use Railway's reference syntax: `${{Redis.REDIS_URL}}`

### Issue 4: Migrations Not Running

**Error**: Tables don't exist

**Solution**:
```bash
# Use Railway CLI
railway run npm run migrate

# Or add to start script (temporary)
"start": "npm run migrate && medusa start"
```

### Issue 5: CORS Errors from Frontend

**Error**: `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution**:
- Update `STORE_CORS` in Railway variables
- Add your Vercel domain
- Format: `https://your-app.vercel.app,http://localhost:3000`
- Restart Medusa service

### Issue 6: Admin Panel Not Loading

**Error**: 404 or blank page

**Solution**:
- Admin panel is at `/app` not `/admin`
- URL: `https://your-service.railway.app/app`
- Clear browser cache
- Check if Medusa is fully started (check logs)

### Issue 7: Port Already in Use

**Error**: `Port 9000 is already in use`

**Solution**:
- Railway automatically assigns ports
- Don't hardcode port in code
- Use: `process.env.PORT || 9000`

---

## 🎯 Quick Reference

### Railway URLs

```bash
# Medusa API
https://your-medusa-service.up.railway.app

# Admin Panel
https://your-medusa-service.up.railway.app/app

# Health Check
https://your-medusa-service.up.railway.app/health

# Store API
https://your-medusa-service.up.railway.app/store

# Admin API
https://your-medusa-service.up.railway.app/admin
```

### Essential Commands

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Run migrations
railway run npm run migrate

# View logs
railway logs

# Open shell
railway shell

# Deploy latest changes
railway up
```

### Environment Variables Checklist

**Medusa Service:**
- [ ] `NODE_ENV=production`
- [ ] `DATABASE_URL=${{Postgres.DATABASE_URL}}`
- [ ] `REDIS_URL=${{Redis.REDIS_URL}}`
- [ ] `JWT_SECRET=...`
- [ ] `COOKIE_SECRET=...`
- [ ] `STORE_CORS=...`
- [ ] `ADMIN_CORS=...`
- [ ] `ADMIN_EMAIL=...`
- [ ] `ADMIN_PASSWORD=...`

**Frontend (Vercel):**
- [ ] `NEXT_PUBLIC_MEDUSA_BACKEND_URL=...`
- [ ] `MEDUSA_ADMIN_API_KEY=...`
- [ ] `SANITY_WEBHOOK_SECRET=...`
- [ ] `ADMIN_SYNC_TOKEN=...`

---

## 📝 Post-Deployment Checklist

After deployment, verify:

- [ ] PostgreSQL is running and connected
- [ ] Redis is running and connected
- [ ] Medusa service is deployed successfully
- [ ] Database migrations have run
- [ ] Admin user is created
- [ ] Admin panel is accessible
- [ ] API endpoints respond correctly
- [ ] Frontend can connect to Medusa
- [ ] CORS is configured correctly
- [ ] Product sync webhook is configured
- [ ] Initial products are synced
- [ ] No errors in Railway logs

---

## 🚀 Next Steps After Deployment

1. **Create Regions**
   - Iran region with IRR currency
   - International region with USD

2. **Configure Payment Gateways**
   - Add Zarinpal credentials
   - Add Stripe credentials (for testing)

3. **Sync Products**
   - Run migration script
   - Verify products in Medusa admin

4. **Test Cart Flow**
   - Add products to cart
   - Complete checkout
   - Verify orders

5. **Set Up Monitoring**
   - Configure error tracking (Sentry)
   - Set up uptime monitoring
   - Monitor Railway metrics

---

## 📚 Additional Resources

- **Railway Docs**: https://docs.railway.app
- **Medusa Docs**: https://docs.medusajs.com
- **Railway Discord**: https://discord.gg/railway
- **Medusa Discord**: https://discord.gg/medusajs

---

## ⚠️ Important Notes

### Security

1. **Change default passwords** immediately
2. **Use strong secrets** for JWT and cookies
3. **Enable Railway's built-in** firewall
4. **Never commit** `.env` files
5. **Regularly update** dependencies

### Performance

1. **Monitor resource usage** in Railway dashboard
2. **Set up caching** with Redis
3. **Optimize database** queries
4. **Use CDN** for static assets

### Backups

1. **Railway auto-backs up** PostgreSQL daily
2. **Set up manual backups** for critical times
3. **Test restore process** regularly

---

## 🎉 Success Criteria

Your deployment is successful when:

- ✅ All services show "Active" status in Railway
- ✅ Health endpoint returns 200 OK
- ✅ Admin panel loads and you can login
- ✅ Store API returns product list
- ✅ Frontend connects without CORS errors
- ✅ Products sync from Sanity to Medusa
- ✅ No errors in deployment logs

---

**Ready to deploy?** Follow the steps above in order, and you'll have a working Medusa backend on Railway! 🚂

If you encounter any issues, check the Troubleshooting section or reach out for help.

Good luck! 🚀

