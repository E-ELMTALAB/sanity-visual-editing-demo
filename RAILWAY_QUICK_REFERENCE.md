# 🚂 Railway Deployment - Quick Reference Card

**Bookmark this page for quick access to essential commands and URLs!**

---

## 🔗 Important URLs

```bash
# Your Railway Medusa Backend
https://your-service-name.up.railway.app

# Admin Panel
https://your-service-name.up.railway.app/app

# Health Check
https://your-service-name.up.railway.app/health

# Store API
https://your-service-name.up.railway.app/store

# Admin API  
https://your-service-name.up.railway.app/admin
```

---

## ⚡ Essential Commands

### Railway CLI Setup
```bash
# Install
npm install -g @railway/cli

# Login
railway login

# Link to project
cd medusa-backend
railway link
```

### Database Operations
```bash
# Run migrations
railway run npm run migrate

# Seed data
railway run npm run seed

# Access PostgreSQL shell
railway run psql $DATABASE_URL
```

### Logs & Monitoring
```bash
# View logs
railway logs

# Follow logs (real-time)
railway logs --follow

# Last 100 lines
railway logs --tail 100
```

### Deploy & Build
```bash
# Trigger new deployment
git push origin main

# Or use Railway CLI
railway up
```

---

## 🔑 Generate Secrets

### Using Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Using OpenSSL
```bash
openssl rand -hex 32
```

### Online Tool
```
https://generate-secret.vercel.app/32
```

---

## 📋 Required Environment Variables

Copy this to Railway Variables tab (update values):

```bash
NODE_ENV=production
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
JWT_SECRET=CHANGE_THIS_GENERATED_SECRET
COOKIE_SECRET=CHANGE_THIS_GENERATED_SECRET
STORE_CORS=https://your-app.vercel.app,http://localhost:3000
ADMIN_CORS=https://your-app.vercel.app,http://localhost:3000
ADMIN_EMAIL=admin@sharifgpt.com
ADMIN_PASSWORD=YourSecurePassword123
```

---

## 🧪 Testing API Endpoints

### Health Check
```bash
curl https://your-service.railway.app/health
```

### Get Products
```bash
curl https://your-service.railway.app/store/products
```

### Admin Login
```bash
curl -X POST https://your-service.railway.app/admin/auth \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sharifgpt.com",
    "password": "your_password"
  }'
```

---

## 🔄 Product Migration

### From Local Machine
```bash
# Update .env.local
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-service.railway.app

# Run migration
npm run migrate:products
```

### Check Sync Status
```bash
curl https://your-app.vercel.app/api/sync/products
```

---

## 🐛 Troubleshooting Quick Fixes

### Build Failing
```bash
# Check root directory in Railway Settings
Root Directory: medusa-backend
Start Command: npm run start:railway
```

### Database Connection Error
```bash
# Verify in Railway Variables
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Not this:
DATABASE_URL=postgres://user:pass@host...
```

### CORS Errors
```bash
# Add your domain to STORE_CORS
STORE_CORS=https://your-app.vercel.app,http://localhost:3000

# Then restart service
```

### Migrations Not Running
```bash
# Run manually
railway run npm run migrate

# Or via Railway shell
railway shell
npm run migrate
```

### Admin Panel 404
```bash
# Correct URL (note /app not /admin)
https://your-service.railway.app/app

# Clear browser cache
Ctrl + Shift + Delete (Chrome)
```

---

## 📊 Railway Dashboard Quick Links

```bash
# Main Dashboard
https://railway.app/dashboard

# Project Variables
Your Project → Medusa Service → Variables

# Deployment Logs
Your Project → Medusa Service → Deployments → Latest

# Metrics
Your Project → Medusa Service → Metrics

# Settings
Your Project → Medusa Service → Settings
```

---

## 🔐 Default Admin Credentials

```
Email: admin@sharifgpt.com (or your ADMIN_EMAIL)
Password: [your ADMIN_PASSWORD]
URL: https://your-service.railway.app/app
```

**⚠️ Change these after first login!**

---

## 💰 Cost Monitoring

```bash
# Check usage
Railway Dashboard → Project → Usage

# View current bill
Railway Dashboard → Settings → Billing

# Estimated monthly cost
PostgreSQL: $5-10
Redis: $5-10
Medusa: $10-15
Total: ~$20-35/month
```

---

## 🎯 Service Status Indicators

### Healthy ✅
- Status: Active (green)
- CPU: < 80%
- Memory: < 80%
- No errors in logs
- Health endpoint returns 200

### Needs Attention ⚠️
- Status: Deploying
- High resource usage
- Occasional errors
- Slow response times

### Down ❌
- Status: Failed/Crashed
- Build errors
- Connection errors
- Health check fails

---

## 🔄 Deployment Workflow

```mermaid
Code Change → Git Push → Railway Detects → Build → Deploy → Live
```

**Timeline**: 2-5 minutes for full deployment

---

## 📞 Get Help

### Documentation
- **This Project**: See `RAILWAY_DEPLOYMENT_GUIDE.md`
- **Railway**: https://docs.railway.app
- **Medusa**: https://docs.medusajs.com

### Community
- **Railway Discord**: https://discord.gg/railway
- **Medusa Discord**: https://discord.gg/medusajs

### Your Setup
- **Checklist**: See `DEPLOYMENT_CHECKLIST.md`
- **Environment Template**: See `medusa-backend/RAILWAY_ENV_TEMPLATE.txt`

---

## ✅ Success Indicators

Your deployment is working when:

1. ✅ Railway dashboard shows all services "Active"
2. ✅ Health check returns `{"status": "ok"}`
3. ✅ Admin panel loads and you can login
4. ✅ Store API returns product list
5. ✅ No CORS errors from frontend
6. ✅ Products sync from Sanity
7. ✅ No persistent errors in logs

---

## 🚀 Next Steps After Successful Deployment

1. **Create Regions** in Medusa admin (Iran/International)
2. **Add Payment Gateways** (Zarinpal/Stripe)
3. **Configure Sanity Webhook** for auto-sync
4. **Run Product Migration** to sync products
5. **Test Cart Flow** on frontend
6. **Set Up Monitoring** (Sentry, uptime checks)
7. **Proceed to Phase 4** (Frontend Integration)

---

**Keep this document handy during deployment!** 🎯

Last Updated: After Phase 3 completion

