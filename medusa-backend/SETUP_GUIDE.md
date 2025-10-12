# Medusa Backend Setup Guide

This guide will walk you through setting up the Medusa backend for SharifGPT from scratch.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Database Setup](#database-setup)
4. [Redis Setup](#redis-setup)
5. [Environment Configuration](#environment-configuration)
6. [Initial Setup](#initial-setup)
7. [Payment Gateway Configuration](#payment-gateway-configuration)
8. [Email Service Configuration](#email-service-configuration)
9. [Sanity Integration](#sanity-integration)
10. [Testing](#testing)
11. [Deployment](#deployment)

---

## 1. Prerequisites

### Required Software

Install the following on your system:

#### Node.js (v18+)
```bash
# Using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Verify installation
node --version  # Should be v18.x.x
npm --version
```

#### PostgreSQL (v14+)
```bash
# macOS (using Homebrew)
brew install postgresql@14
brew services start postgresql@14

# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Windows
# Download installer from: https://www.postgresql.org/download/windows/

# Verify installation
psql --version
```

#### Redis (v6+)
```bash
# macOS (using Homebrew)
brew install redis
brew services start redis

# Ubuntu/Debian
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Windows
# Download from: https://redis.io/download
# Or use WSL

# Verify installation
redis-cli ping  # Should return PONG
```

---

## 2. Installation

### Clone or Navigate to Backend Directory

```bash
cd medusa-backend
```

### Install Dependencies

```bash
npm install
```

This will install all required packages including:
- @medusajs/medusa (core)
- @medusajs/admin (admin panel)
- TypeScript and build tools
- Payment and fulfillment plugins

---

## 3. Database Setup

### Create PostgreSQL Database

#### Option 1: Using psql
```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE medusa_store;

# Create user (optional)
CREATE USER medusa_user WITH PASSWORD 'your_secure_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE medusa_store TO medusa_user;

# Exit
\q
```

#### Option 2: Using createdb command
```bash
createdb medusa_store
```

### Verify Database Connection

```bash
psql -U postgres -d medusa_store

# You should see the database prompt
# Exit with \q
```

---

## 4. Redis Setup

### Start Redis Server

```bash
# macOS/Linux
redis-server

# Or as background service
brew services start redis  # macOS
sudo systemctl start redis-server  # Linux
```

### Verify Redis is Running

```bash
redis-cli ping
# Should return: PONG
```

### Test Redis Connection

```bash
redis-cli
> SET test "Hello"
> GET test
# Should return: "Hello"
> exit
```

---

## 5. Environment Configuration

### Copy Environment Template

```bash
cp .env.template .env
```

### Generate Secure Secrets

```bash
# Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate COOKIE_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Update .env File

Open `.env` and update the following variables:

```bash
# Required
JWT_SECRET=<paste_generated_secret_here>
COOKIE_SECRET=<paste_generated_secret_here>
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/medusa_store
REDIS_URL=redis://localhost:6379

# Store Configuration
MEDUSA_BACKEND_URL=http://localhost:9000
STORE_URL=http://localhost:3000
STORE_CORS=http://localhost:3000

# Admin Configuration
ADMIN_CORS=http://localhost:7000,http://localhost:7001
```

---

## 6. Initial Setup

### Run Database Migrations

```bash
npm run migrate
```

Expected output:
```
Migration CreateOrderEditingFeatureFlag has been executed successfully.
Migration AddLineItemOriginalItemIdAndOrderEditId has been executed successfully.
...
All migrations have been executed successfully.
```

### Seed Initial Data

```bash
npm run seed
```

This will create:
- Default store configuration
- Admin user (email: admin@sharifgpt.com, password: admin123)
- Regions (Iran, International)
- Currencies (IRR, USD, EUR)
- Sample product (ChatGPT Plus)

### Start Development Server

```bash
npm run dev
```

Expected output:
```
info:    Server is ready on port: 9000
info:    Admin server is ready on port: 7001
```

### Verify Setup

Open your browser:
- **API**: http://localhost:9000/health
- **Admin Panel**: http://localhost:9000/app

Login with:
- Email: `admin@sharifgpt.com`
- Password: `admin123`

**⚠️ IMPORTANT**: Change the admin password immediately after first login!

---

## 7. Payment Gateway Configuration

### Stripe (International Customers)

1. **Create Stripe Account**
   - Go to https://stripe.com
   - Sign up for account
   - Complete verification

2. **Get API Keys**
   - Go to Dashboard → Developers → API keys
   - Copy "Publishable key" and "Secret key"

3. **Set Up Webhook**
   - Go to Dashboard → Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/hooks/stripe`
   - Select events: `payment_intent.*`, `charge.*`
   - Copy webhook secret

4. **Update .env**
   ```bash
   STRIPE_API_KEY=sk_test_your_key_here
   STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
   ```

### Zarinpal (Iranian Market)

1. **Register with Zarinpal**
   - Go to https://www.zarinpal.com
   - Complete registration
   - Get merchant ID

2. **Update .env**
   ```bash
   ZARINPAL_MERCHANT_ID=your_merchant_id
   ZARINPAL_SANDBOX=true
   ZARINPAL_CALLBACK_URL=http://localhost:3000/checkout/payment-callback
   ```

3. **Install Zarinpal Plugin** (if available)
   ```bash
   npm install medusa-payment-zarinpal
   ```

---

## 8. Email Service Configuration

### Option 1: SendGrid (Recommended)

1. **Create SendGrid Account**
   - Go to https://sendgrid.com
   - Sign up and verify email

2. **Create API Key**
   - Go to Settings → API Keys
   - Create key with full access
   - Copy key immediately

3. **Create Email Templates**
   - Go to Email API → Dynamic Templates
   - Create templates for:
     - Order confirmation
     - Digital product delivery
     - Password reset

4. **Update .env**
   ```bash
   SENDGRID_API_KEY=SG.your_api_key_here
   SENDGRID_FROM=noreply@sharifgpt.com
   SENDGRID_ORDER_PLACED_TEMPLATE=d-template_id_here
   ```

5. **Install SendGrid Plugin**
   ```bash
   npm install medusa-plugin-sendgrid
   ```

### Option 2: SMTP (Alternative)

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_specific_password
```

---

## 9. Sanity Integration

### Configure Sanity Connection

1. **Get Sanity Project Details**
   ```bash
   # In your Sanity project
   sanity debug --secrets
   ```

2. **Update .env**
   ```bash
   SANITY_PROJECT_ID=your_project_id
   SANITY_DATASET=production
   SANITY_API_TOKEN=your_api_token
   SANITY_API_VERSION=2024-01-01
   ```

3. **Set Up Webhook in Sanity**
   - Go to Sanity Management Console
   - Navigate to API → Webhooks
   - Add webhook:
     - URL: `https://yourdomain.com/webhooks/sanity-sync`
     - Dataset: `production`
     - Trigger on: Create, Update, Delete
     - Filter: `_type == "product"`
   - Generate and copy webhook secret

4. **Update .env**
   ```bash
   SANITY_WEBHOOK_SECRET=your_webhook_secret_here
   ```

---

## 10. Testing

### Test Health Check

```bash
curl http://localhost:9000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-10-12T10:00:00.000Z",
  "environment": "development"
}
```

### Test Product API

```bash
curl http://localhost:9000/store/products
```

### Test Admin Login

```bash
curl -X POST http://localhost:9000/admin/auth \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sharifgpt.com",
    "password": "admin123"
  }'
```

### Test Sanity Webhook (Manually)

```bash
curl -X POST http://localhost:9000/webhooks/sanity-sync \
  -H "Content-Type: application/json" \
  -H "x-sanity-signature: test" \
  -d '{
    "_id": "test-id",
    "_type": "product",
    "name": "Test Product",
    "slug": { "current": "test-product" }
  }'
```

---

## 11. Deployment

### Option 1: Railway (Recommended for Beginners)

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and Initialize**
   ```bash
   railway login
   railway init
   ```

3. **Add Database and Redis**
   ```bash
   railway add postgresql
   railway add redis
   ```

4. **Set Environment Variables**
   ```bash
   railway variables set NODE_ENV=production
   railway variables set JWT_SECRET=your_secret
   railway variables set COOKIE_SECRET=your_secret
   ```

5. **Deploy**
   ```bash
   railway up
   ```

### Option 2: Heroku

1. **Create App**
   ```bash
   heroku create sharifgpt-medusa
   ```

2. **Add Add-ons**
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   heroku addons:create heroku-redis:hobby-dev
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your_secret
   heroku config:set COOKIE_SECRET=your_secret
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

### Option 3: Docker

```bash
# Build image
docker build -t sharifgpt-medusa .

# Run container
docker run -p 9000:9000 \
  -e DATABASE_URL=your_db_url \
  -e REDIS_URL=your_redis_url \
  sharifgpt-medusa
```

---

## ✅ Setup Checklist

- [ ] Node.js 18+ installed
- [ ] PostgreSQL 14+ installed and running
- [ ] Redis 6+ installed and running
- [ ] Dependencies installed (`npm install`)
- [ ] Environment variables configured (`.env`)
- [ ] Database created
- [ ] Migrations run (`npm run migrate`)
- [ ] Initial data seeded (`npm run seed`)
- [ ] Development server starts (`npm run dev`)
- [ ] Admin panel accessible
- [ ] Payment gateway configured (at least one)
- [ ] Email service configured
- [ ] Sanity webhook configured
- [ ] Health check returns OK
- [ ] Admin login works

---

## 🆘 Common Issues

### Port Already in Use

```bash
# Find process using port 9000
lsof -i :9000

# Kill process
kill -9 <PID>

# Or change port in .env
PORT=9001
```

### Database Connection Failed

```bash
# Check PostgreSQL is running
pg_isready

# Check credentials in .env
# Make sure DATABASE_URL is correct
```

### Redis Connection Failed

```bash
# Check Redis is running
redis-cli ping

# Should return PONG
# Check REDIS_URL in .env
```

### Migration Errors

```bash
# Clear database and re-migrate
npm run migrate -- -d

# Re-run migrations
npm run migrate
```

### Module Not Found

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review Medusa documentation: https://docs.medusajs.com
3. Join Medusa Discord: https://discord.gg/medusajs
4. Create an issue in the repository

---

**Next Steps**: After completing this setup, proceed to Phase 3: Data Migration & Sync

