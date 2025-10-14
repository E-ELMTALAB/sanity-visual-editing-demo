# Medusa v2 Backend

This is a Medusa v2.10.2 backend with pre-configured integrations for Railway deployment.

## Features

- ✅ **Medusa v2.10.2** - Latest version with modern architecture
- ✅ **MinIO File Storage** - Cloud file storage with local fallback
- ✅ **Resend Email** - Email notifications with React Email templates
- ✅ **Meilisearch** - Powerful product search
- ✅ **Stripe Payments** - Credit card payment processing
- ✅ **Redis** - Event bus and workflow engine (with fallback)
- ✅ **PostgreSQL** - Production-ready database

## Quick Start

### Local Development

1. **Install dependencies:**
   ```bash
   cd medusa-backend
   npm install
   # or
   pnpm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set at minimum:
   - `DATABASE_URL` - PostgreSQL connection string
   - `JWT_SECRET` - Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - `COOKIE_SECRET` - Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

3. **Initialize backend:**
   ```bash
   npm run ib
   # or
   pnpm ib
   ```
   
   This will run migrations and seed the database.

4. **Start development server:**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```
   
   The backend will start on `http://localhost:9000`
   Admin dashboard: `http://localhost:9000/app`

## Available Scripts

- `npm run dev` - Start development server
- `npm run ib` - Initialize backend (migrations + seed)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run seed` - Run database seeding
- `npm run email:dev` - Preview email templates

## Environment Variables

See `.env.example` for all available configuration options.

### Required Variables

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT tokens (min 32 chars)
- `COOKIE_SECRET` - Secret for cookies (min 32 chars)

### Optional Services

**Redis** (recommended for production):
- `REDIS_URL` - Redis connection string

**MinIO File Storage** (for cloud storage):
- `MINIO_ENDPOINT`
- `MINIO_ACCESS_KEY`
- `MINIO_SECRET_KEY`
- `MINIO_BUCKET` (optional, defaults to 'medusa-media')

**Email Notifications** (choose one):
- Resend: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`
- SendGrid: `SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL`

**Stripe Payments**:
- `STRIPE_API_KEY`
- `STRIPE_WEBHOOK_SECRET`

**Meilisearch** (product search):
- `MEILISEARCH_HOST`
- `MEILISEARCH_ADMIN_KEY`

## Railway Deployment

This backend is pre-configured for Railway deployment:

1. Connect your Railway PostgreSQL service:
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   ```

2. Connect your Railway Redis service (optional):
   ```
   REDIS_URL=${{Redis.REDIS_URL}}
   ```

3. Set your secrets (JWT_SECRET, COOKIE_SECRET)

4. Configure your service integrations as needed

The backend will automatically detect Railway environment and configure itself appropriately.

## Directory Structure

```
medusa-backend/
├── src/
│   ├── admin/           # Admin dashboard customizations
│   ├── api/             # API routes
│   ├── jobs/            # Background jobs
│   ├── lib/             # Shared utilities
│   ├── modules/         # Custom modules
│   │   ├── email-notifications/  # Resend email integration
│   │   └── minio-file/          # MinIO file storage
│   ├── scripts/         # Build and seed scripts
│   ├── subscribers/     # Event subscribers
│   ├── utils/           # Helper functions
│   └── workflows/       # Custom workflows
├── medusa-config.js     # Main configuration
├── package.json         # Dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

## Admin Dashboard

The admin dashboard is available at `/app` when running the backend.

Default credentials are set during seeding. Check the seed script for details.

## Troubleshooting

### Database Connection Issues

Make sure PostgreSQL is running and the `DATABASE_URL` is correct.

### Port Already in Use

Change the port in `medusa-config.js` or set `PORT` environment variable.

### Module Resolution Errors

Make sure to install dependencies and run the build:
```bash
npm install
npm run build
```

## Learn More

- [Medusa Documentation](https://docs.medusajs.com)
- [Medusa v2 Release Notes](https://medusajs.com/blog/medusa-2-0/)
- [Railway Documentation](https://docs.railway.app)

## License

MIT
