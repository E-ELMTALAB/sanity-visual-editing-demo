# 🚂 Quick Start: Deploy to Railway

**Time to complete**: 15-20 minutes

---

## Step-by-Step Deployment

### 1️⃣ Create Railway Project (2 min)

1. Go to https://railway.app and sign in
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose this repository

### 2️⃣ Add PostgreSQL (1 min)

1. Click **"+ New"** → **"Database"** → **"Add PostgreSQL"**
2. Done! Railway auto-configures connection

### 3️⃣ Add Redis (1 min)

1. Click **"+ New"** → **"Database"** → **"Add Redis"**
2. Done! Railway auto-configures connection

### 4️⃣ Configure Medusa Service (5 min)

1. Click on your repository service
2. Go to **Settings**
3. Set **Root Directory**: `medusa-backend`
4. Set **Start Command**: `npm run start:railway`
5. Click **"Networking"** → **"Generate Domain"**
6. Copy your domain: `https://your-service.up.railway.app`

### 5️⃣ Add Environment Variables (5 min)

Go to **Variables** tab and add:

**Required (copy from `RAILWAY_ENV_TEMPLATE.txt`):**

```bash
NODE_ENV=production
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
JWT_SECRET=[generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"]
COOKIE_SECRET=[generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"]
STORE_CORS=http://localhost:3000,https://your-frontend.vercel.app
ADMIN_CORS=http://localhost:3000,https://your-frontend.vercel.app
ADMIN_EMAIL=admin@sharifgpt.com
ADMIN_PASSWORD=YourSecurePassword123
```

### 6️⃣ Deploy (1 min)

1. Click **"Deploy"** or push to GitHub
2. Watch logs in **"Deployments"** tab
3. Wait for "✅ Deployment successful"

### 7️⃣ Run Migrations (2 min)

**Install Railway CLI:**
```bash
npm install -g @railway/cli
```

**Run migrations:**
```bash
railway login
cd medusa-backend
railway link
railway run npm run migrate
```

### 8️⃣ Verify (2 min)

**Check health:**
```bash
curl https://your-service.up.railway.app/health
```

**Access admin:**
```
https://your-service.up.railway.app/app
```

Login with your `ADMIN_EMAIL` and `ADMIN_PASSWORD`

---

## 🎯 Update Frontend

**In Vercel environment variables:**

```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-service.up.railway.app
```

Redeploy Vercel app.

---

## ✅ Test Product Sync

**Run migration locally (pointing to Railway):**

```bash
# In project root .env.local
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-service.up.railway.app

# Run migration
npm run migrate:products
```

---

## 🎉 You're Done!

Your Medusa backend is now live on Railway and connected to your frontend!

**Next steps:**
1. Create products in Sanity Studio
2. Watch them sync to Medusa automatically
3. Test cart and checkout flow
4. Add payment gateways

---

## 🆘 Need Help?

- Check `RAILWAY_DEPLOYMENT_GUIDE.md` for detailed instructions
- Check Railway logs for errors
- Verify all environment variables are set
- Ensure DATABASE_URL and REDIS_URL use Railway syntax

---

## 💰 Cost

**Estimated**: $20-30/month for testing

- PostgreSQL: ~$5-10
- Redis: ~$5-10  
- Medusa: ~$10-15

Railway offers $5 free credit to start.

