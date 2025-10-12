# SharifGPT Medusa Backend

E-commerce backend for the SharifGPT platform, handling commerce operations including products, pricing, orders, payments, and customer management.

## 🏗️ Architecture

This Medusa backend integrates with Sanity CMS following a clear separation of concerns:

- **Sanity CMS**: Content management (descriptions, images, SEO, blog posts)
- **Medusa Backend**: Commerce operations (pricing, inventory, orders, payments)

## 📋 Prerequisites

- Node.js 18.x or higher
- PostgreSQL 14.x or higher
- Redis 6.x or higher
- npm or yarn

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

```bash
# Copy the environment template
cp .env.template .env

# Edit .env and fill in your actual values
# IMPORTANT: Generate secure secrets for JWT_SECRET and COOKIE_SECRET
```

### 3. Set Up Database

```bash
# Create PostgreSQL database
createdb medusa_store

# Or using psql
psql -U postgres
CREATE DATABASE medusa_store;
\q
```

### 4. Run Migrations

```bash
npm run migrate
```

### 5. Seed Initial Data

```bash
# Seed with default regions, currencies, and sample products
npm run seed
```

### 6. Start Development Server

```bash
npm run dev
```

The backend will be available at:
- **API**: http://localhost:9000
- **Admin Panel**: http://localhost:9000/app

## 🔧 Configuration

### Database Configuration

Update `DATABASE_URL` in `.env`:

```bash
DATABASE_URL=postgresql://username:password@localhost:5432/medusa_store
```

### Redis Configuration

Update `REDIS_URL` in `.env`:

```bash
REDIS_URL=redis://localhost:6379
```

### Payment Gateways

#### Stripe (International)
```bash
STRIPE_API_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret
```

#### Zarinpal (Iran)
```bash
ZARINPAL_MERCHANT_ID=your_merchant_id
ZARINPAL_SANDBOX=true
ZARINPAL_CALLBACK_URL=http://localhost:3000/checkout/payment-callback
```

### Email Service (SendGrid)

```bash
SENDGRID_API_KEY=your_api_key
SENDGRID_FROM=noreply@sharifgpt.com
SENDGRID_ORDER_PLACED_TEMPLATE=your_template_id
```

## 📦 Project Structure

```
medusa-backend/
├── src/
│   ├── api/                    # Custom API routes
│   │   ├── routes/
│   │   │   ├── admin/         # Admin API routes
│   │   │   └── store/         # Store API routes
│   │   └── index.ts
│   ├── services/              # Custom services
│   │   └── digital-fulfillment.ts
│   ├── subscribers/           # Event subscribers
│   │   └── order-placed.ts
│   ├── models/                # Custom database models
│   └── migrations/            # Database migrations
├── data/
│   └── seed.json             # Initial seed data
├── uploads/                   # Local file uploads
├── medusa-config.js          # Medusa configuration
├── tsconfig.json             # TypeScript configuration
├── package.json              # Dependencies
└── .env.template             # Environment variables template
```

## 🎯 Key Features

### 1. Product Management
- Digital product support
- Variant management
- Multi-currency pricing
- Inventory tracking (optional for digital products)

### 2. Order Processing
- Complete order lifecycle management
- Digital product fulfillment automation
- Order status tracking
- Customer notifications

### 3. Payment Integration
- Stripe (international customers)
- Zarinpal (Iranian market)
- PayPal (optional)
- Manual payment methods

### 4. Customer Management
- User registration and authentication
- Order history
- Customer profiles
- Guest checkout support

### 5. Sanity Integration
- Automatic product sync via webhooks
- Bidirectional reference system
- Sync status monitoring
- Conflict resolution

## 🔌 API Endpoints

### Store APIs (Public)

```bash
# Products
GET    /store/products
GET    /store/products/:id

# Cart
POST   /store/carts
POST   /store/carts/:id/line-items
DELETE /store/carts/:id/line-items/:line_id
POST   /store/carts/:id/complete

# Customers
POST   /store/customers
POST   /store/auth
GET    /store/customers/me
GET    /store/customers/me/orders

# Regions
GET    /store/regions
```

### Admin APIs (Authenticated)

```bash
# Products
GET    /admin/products
POST   /admin/products
PUT    /admin/products/:id
DELETE /admin/products/:id

# Orders
GET    /admin/orders
GET    /admin/orders/:id
POST   /admin/orders/:id/fulfillment

# Customers
GET    /admin/customers
GET    /admin/customers/:id

# Custom: Sync Status
GET    /admin/products/sync-status
```

### Webhooks

```bash
# Sanity Product Sync
POST   /webhooks/sanity-sync
DELETE /webhooks/sanity-sync

# Payment Webhooks
POST   /webhooks/stripe
POST   /webhooks/zarinpal
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📊 Database Management

### Create New Migration

```bash
npm run migrations:create MigrationName
```

### Run Migrations

```bash
npm run migrate
```

### Rollback Migration

```bash
# Medusa doesn't have built-in rollback, use TypeORM CLI
npx typeorm migration:revert
```

## 🚢 Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Variables

Make sure to set production environment variables:

```bash
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_URL=redis://host:6379
JWT_SECRET=your_production_secret
COOKIE_SECRET=your_production_secret
```

### Deployment Platforms

#### Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway up
```

#### Heroku
```bash
# Create app
heroku create sharifgpt-medusa

# Add PostgreSQL and Redis
heroku addons:create heroku-postgresql:hobby-dev
heroku addons:create heroku-redis:hobby-dev

# Deploy
git push heroku main
```

#### AWS (EC2/ECS)
See detailed deployment guide in `/docs/deployment-aws.md`

## 🔒 Security

### Important Security Notes

1. **Never commit `.env` files** - They contain sensitive credentials
2. **Use strong secrets** - Generate random strings for JWT_SECRET and COOKIE_SECRET
3. **Enable HTTPS in production** - Always use SSL/TLS
4. **Rate limiting** - Configure rate limits for APIs
5. **Webhook signatures** - Always verify webhook signatures
6. **Database backups** - Set up automated backups

### Generate Secure Secrets

```bash
# Generate random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 📚 Resources

- [Medusa Documentation](https://docs.medusajs.com/)
- [Medusa API Reference](https://docs.medusajs.com/api/)
- [Medusa Discord Community](https://discord.gg/medusajs)

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
pg_isready

# Check connection
psql -U postgres -d medusa_store
```

### Redis Connection Issues

```bash
# Check Redis is running
redis-cli ping

# Should return: PONG
```

### Port Already in Use

```bash
# Change port in .env
PORT=9001
```

## 📝 License

MIT

## 👥 Support

For support, email support@sharifgpt.com or join our Discord community.

