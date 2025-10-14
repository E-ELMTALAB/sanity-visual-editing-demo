# Medusa v2 Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies (2 min)

```bash
cd medusa-backend
npm install
# or
pnpm install
```

### Step 2: Set Up Environment (1 min)

```bash
cp .env.example .env
```

Edit `.env` and add these **required** variables:

```env
DATABASE_URL=postgres://localhost/medusa-store
JWT_SECRET=<generate-32-char-secret>
COOKIE_SECRET=<generate-32-char-secret>
```

**Generate secrets quickly:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 3: Initialize Database (1 min)

```bash
npm run ib
```

This will:
- Run database migrations
- Seed initial data
- Create admin user

### Step 4: Start Backend (1 min)

```bash
npm run dev
```

✅ Backend: http://localhost:9000  
✅ Admin Dashboard: http://localhost:9000/app

---

## 📦 What's Included?

All these services are **pre-configured** and ready to use:

| Feature | Status | Enabled By |
|---------|--------|------------|
| Admin Dashboard | ✅ Built-in | Default |
| PostgreSQL | ✅ Required | `DATABASE_URL` |
| Local File Storage | ✅ Default | Automatic |
| Redis (optional) | 🔧 Optional | Set `REDIS_URL` |
| MinIO Cloud Storage | 🔧 Optional | Set `MINIO_*` vars |
| Resend Email | 🔧 Optional | Set `RESEND_*` vars |
| Stripe Payments | 🔧 Optional | Set `STRIPE_*` vars |
| Meilisearch | 🔧 Optional | Set `MEILISEARCH_*` vars |

---

## 🔧 Enable Optional Services

### Redis (Event Bus & Workflows)

```env
REDIS_URL=redis://localhost:6379
```

### MinIO File Storage

```env
MINIO_ENDPOINT=your-minio-host:9000
MINIO_ACCESS_KEY=your_access_key
MINIO_SECRET_KEY=your_secret_key
MINIO_BUCKET=medusa-media
```

### Resend Email Notifications

```env
RESEND_API_KEY=re_your_key
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

### Stripe Payments

```env
STRIPE_API_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret
```

### Meilisearch Product Search

```env
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_ADMIN_KEY=your_master_key
```

---

## 📋 Common Commands

| Command | What It Does |
|---------|--------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run ib` | Initialize backend (run once) |
| `npm run seed` | Re-seed database |
| `npm run email:dev` | Preview email templates |

---

## 🌐 Deploy to Railway

1. Push code to GitHub
2. Connect to Railway
3. Add PostgreSQL and Redis services
4. Set environment variables (see `RAILWAY_ENV_TEMPLATE.txt`)
5. Deploy!

Railway auto-detects Medusa and configures everything.

---

## 💡 Tips

- **First time?** Run `npm run ib` to initialize
- **CORS errors?** Set `STORE_CORS` to your frontend URL
- **Admin not loading?** Check `MEDUSA_DISABLE_ADMIN` is not `true`
- **Need help?** Check `README.md` or the full migration guide

---

## 🎯 What's Next?

1. ✅ Start the backend
2. 📱 Access admin at `/app`
3. 🛍️ Create products
4. 💳 Configure payment providers
5. 🚀 Deploy to Railway

---

## 📚 Documentation

- [Medusa Docs](https://docs.medusajs.com)
- [Admin API](https://docs.medusajs.com/api/admin)
- [Store API](https://docs.medusajs.com/api/store)

---

**Need detailed help?** See `MEDUSA_V2_MIGRATION_COMPLETE.md` in project root.


