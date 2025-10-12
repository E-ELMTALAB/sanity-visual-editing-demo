# ✅ Railway Deployment Checklist

Use this checklist to ensure everything is set up correctly.

---

## 🔧 Pre-Deployment

- [ ] Code is committed and pushed to GitHub
- [ ] Railway account created
- [ ] Credit card added to Railway (for usage beyond free tier)

---

## 🏗️ Railway Infrastructure

- [ ] **Project created** in Railway
- [ ] **PostgreSQL database** added
- [ ] **Redis** added
- [ ] **Medusa service** added from GitHub repo

---

## ⚙️ Medusa Service Configuration

- [ ] Root directory set to `medusa-backend`
- [ ] Start command set to `npm run start:railway`
- [ ] Public domain generated
- [ ] Domain copied for later use

---

## 🔑 Environment Variables (Medusa Service)

### Required
- [ ] `NODE_ENV=production`
- [ ] `DATABASE_URL=${{Postgres.DATABASE_URL}}`
- [ ] `REDIS_URL=${{Redis.REDIS_URL}}`
- [ ] `JWT_SECRET` (generated secure random string)
- [ ] `COOKIE_SECRET` (generated secure random string)
- [ ] `STORE_CORS` (your frontend URLs)
- [ ] `ADMIN_CORS` (your frontend URLs)
- [ ] `ADMIN_EMAIL` (your admin email)
- [ ] `ADMIN_PASSWORD` (strong password)

### Sanity Integration
- [ ] `SANITY_PROJECT_ID`
- [ ] `SANITY_DATASET`
- [ ] `SANITY_API_TOKEN`
- [ ] `SANITY_WEBHOOK_SECRET`

### Optional (for later)
- [ ] Payment gateway credentials (Stripe, Zarinpal)
- [ ] Email service credentials (SendGrid)
- [ ] File storage credentials (S3/R2)

---

## 🚀 Deployment

- [ ] Code deployed successfully
- [ ] Build completed without errors
- [ ] Service is running (check logs)
- [ ] No errors in deployment logs

---

## 🗄️ Database Setup

- [ ] Railway CLI installed: `npm install -g @railway/cli`
- [ ] Logged in: `railway login`
- [ ] Project linked: `railway link`
- [ ] Migrations run: `railway run npm run migrate`
- [ ] Seed data loaded (optional): `railway run npm run seed`

---

## ✅ Verification

- [ ] Health check works: `curl https://your-service.railway.app/health`
- [ ] Admin panel accessible: `https://your-service.railway.app/app`
- [ ] Can login to admin panel
- [ ] Store API works: `curl https://your-service.railway.app/store/products`
- [ ] No CORS errors when testing from frontend

---

## 🔗 Frontend Integration

### Vercel Environment Variables
- [ ] `NEXT_PUBLIC_MEDUSA_BACKEND_URL` set to Railway URL
- [ ] `MEDUSA_ADMIN_API_KEY` added (get from Medusa admin)
- [ ] `SANITY_WEBHOOK_SECRET` added
- [ ] `ADMIN_SYNC_TOKEN` added (for manual sync)

### Local Development
- [ ] `.env.local` updated with Railway URL
- [ ] Dependencies installed: `npm install`
- [ ] Frontend can connect to Railway Medusa

---

## 🔄 Product Sync

### Sanity Webhook Configuration
- [ ] Webhook created in Sanity console
- [ ] URL set to: `https://your-service.railway.app/store/webhooks/sanity-sync`
- [ ] Filter set to: `_type == "product"`
- [ ] Secret generated and saved
- [ ] Secret added to Railway environment variables

### Initial Migration
- [ ] Migration script run: `npm run migrate:products`
- [ ] Products visible in Medusa admin
- [ ] No errors in migration output
- [ ] Sanity products updated with Medusa IDs

---

## 🧪 Testing

### Basic Tests
- [ ] Create new product in Sanity → syncs to Medusa
- [ ] Update product in Sanity → updates in Medusa
- [ ] Product data correct in both systems
- [ ] No errors in Railway logs
- [ ] No errors in Sanity webhook logs

### API Tests
- [ ] GET `/store/products` returns products
- [ ] GET `/store/products/:id` returns product details
- [ ] Cart creation works
- [ ] Cart operations work (add/update/remove items)

---

## 📊 Monitoring

- [ ] Railway dashboard shows healthy metrics
- [ ] CPU usage is reasonable (< 80%)
- [ ] Memory usage is reasonable (< 80%)
- [ ] No error spikes in logs
- [ ] Response times are acceptable (< 1s)

---

## 💰 Cost Verification

- [ ] Checked Railway usage dashboard
- [ ] Estimated monthly cost is acceptable
- [ ] Usage alerts configured (optional)

---

## 🔐 Security

- [ ] Strong passwords used for admin and secrets
- [ ] Secrets never committed to Git
- [ ] CORS properly configured (only your domains)
- [ ] Webhook signatures enabled
- [ ] SSL/TLS enabled (automatic with Railway)

---

## 📚 Documentation

- [ ] Railway URL documented
- [ ] Admin credentials stored securely
- [ ] Environment variables documented
- [ ] Team members have access (if applicable)

---

## 🎉 Go Live

- [ ] All above items checked
- [ ] Smoke tests passed
- [ ] Frontend connected and working
- [ ] Products syncing correctly
- [ ] Ready for cart and checkout implementation

---

## 🆘 If Something Goes Wrong

### Check These First:
1. Railway deployment logs
2. Medusa service logs (live logs in Railway)
3. Environment variables are set correctly
4. Database and Redis services are running
5. CORS settings include your domains

### Common Issues:
- **Build fails**: Check root directory is `medusa-backend`
- **Database error**: Verify `DATABASE_URL` uses `${{Postgres.DATABASE_URL}}`
- **Redis error**: Verify `REDIS_URL` uses `${{Redis.REDIS_URL}}`
- **CORS error**: Add your frontend domain to `STORE_CORS`
- **Admin won't load**: Try clearing browser cache
- **Migrations fail**: Run manually with Railway CLI

### Get Help:
- Check `RAILWAY_DEPLOYMENT_GUIDE.md` for detailed instructions
- Railway docs: https://docs.railway.app
- Medusa docs: https://docs.medusajs.com
- Railway Discord: https://discord.gg/railway

---

**Last Updated**: After Phase 3 completion
**Next Steps**: Phase 4 - Frontend Integration with Medusa Cart

