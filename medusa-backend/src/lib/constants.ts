import { loadEnv } from '@medusajs/framework/utils'

import { assertValue } from 'utils/assert-value'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

/**
 * Is development environment
 */
export const IS_DEV = process.env.NODE_ENV === 'development'

/**
 * Public URL for the backend
 */
export const BACKEND_URL = process.env.BACKEND_PUBLIC_URL ?? process.env.RAILWAY_PUBLIC_DOMAIN_VALUE ?? 'http://localhost:9000'

/**
 * Frontend URL for redirects
 */
export const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:3000'

/**
 * Database URL for Postgres instance used by the backend
 */
export const DATABASE_URL = assertValue(
  process.env.DATABASE_URL,
  'Environment variable for DATABASE_URL is not set',
)

/**
 * (optional) Redis URL for Redis instance used by the backend
 */
export const REDIS_URL = process.env.REDIS_URL;

/**
 * Admin CORS origins - allow all for testing
 */
export const ADMIN_CORS = process.env.ADMIN_CORS || "*";

/**
 * Auth CORS origins - allow all for testing
 */
export const AUTH_CORS = process.env.AUTH_CORS || "*";

/**
 * Store/frontend CORS origins - allow all for testing
 */
export const STORE_CORS = process.env.STORE_CORS || "*";

/**
 * JWT Secret used for signing JWT tokens
 */
export const JWT_SECRET = assertValue(
  process.env.JWT_SECRET,
  'Environment variable for JWT_SECRET is not set',
)

/**
 * Cookie secret used for signing cookies
 */
export const COOKIE_SECRET = assertValue(
  process.env.COOKIE_SECRET,
  'Environment variable for COOKIE_SECRET is not set',
)

/**
 * (optional) Minio configuration for file storage
 */
export const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT;
export const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY;
export const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY;
export const MINIO_BUCKET = process.env.MINIO_BUCKET; // Optional, if not set bucket will be called: medusa-media

/**
 * (optional) Resend API Key and from Email - do not set if using SendGrid
 */
export const RESEND_API_KEY = process.env.RESEND_API_KEY;
export const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || process.env.RESEND_FROM;

/**
 * (optionl) SendGrid API Key and from Email - do not set if using Resend
 */
export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
export const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || process.env.SENDGRID_FROM;

/**
 * (optional) Stripe API key and webhook secret
 */
export const STRIPE_API_KEY = process.env.STRIPE_API_KEY;
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

/**
 * (optional) Zarinpal payment gateway configuration
 */
export const ZARINPAL_MERCHANT_ID = process.env.ZARINPAL_MERCHANT_ID;
export const ZARINPAL_SANDBOX = process.env.ZARINPAL_SANDBOX === 'true';
export const ZARINPAL_CALLBACK_URL = process.env.ZARINPAL_CALLBACK_URL;
export const ZARINPAL_OFFLINE = process.env.ZARINPAL_OFFLINE === 'true';

/**
 * (optional) Meilisearch configuration
 */
export const MEILISEARCH_HOST = process.env.MEILISEARCH_HOST;
export const MEILISEARCH_ADMIN_KEY = process.env.MEILISEARCH_ADMIN_KEY;

/**
 * Worker mode
 */
export const WORKER_MODE =
  (process.env.MEDUSA_WORKER_MODE as 'worker' | 'server' | 'shared' | undefined) ?? 'shared'

/**
 * Disable Admin
 */
export const SHOULD_DISABLE_ADMIN = typeof process.env.MEDUSA_DISABLE_ADMIN !== 'undefined'
  ? process.env.MEDUSA_DISABLE_ADMIN === 'true'
  : false // Enable admin by default

/**
 * Currency conversion rates for Zarinpal (IRR)
 */
export const CURRENCY_TO_IRR = {
  'eur': 500000,  // 1 EUR = 500,000 IRR
  'usd': 420000,  // 1 USD = 420,000 IRR
  'irr': 1,       // 1 IRR = 1 IRR
  'default': 42000 // Default conversion rate
}
