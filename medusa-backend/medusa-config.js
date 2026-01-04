import { defineConfig } from '@medusajs/utils';
import { loadEnv, Modules } from '@medusajs/framework/utils';
import {
  ADMIN_CORS,
  AUTH_CORS,
  BACKEND_URL,
  COOKIE_SECRET,
  DATABASE_URL,
  IS_DEV,
  JWT_SECRET,
  REDIS_URL,
  RESEND_API_KEY,
  RESEND_FROM_EMAIL,
  SENDGRID_API_KEY,
  SENDGRID_FROM_EMAIL,
  SHOULD_DISABLE_ADMIN,
  STORE_CORS,
  STRIPE_API_KEY,
  STRIPE_WEBHOOK_SECRET,
  ZARINPAL_MERCHANT_ID,
  ZARINPAL_SANDBOX,
  ZARINPAL_CALLBACK_URL,
  ZARINPAL_OFFLINE,
  WORKER_MODE,
  MINIO_ENDPOINT,
  MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY,
  MINIO_BUCKET,
  MEILISEARCH_HOST,
  MEILISEARCH_ADMIN_KEY
} from './src/lib/constants';

loadEnv(process.env.NODE_ENV, process.cwd());

console.log('[MEDUSA-CONFIG] Loading configuration...')
console.log('[MEDUSA-CONFIG] BACKEND_URL:', BACKEND_URL)
console.log('[MEDUSA-CONFIG] SHOULD_DISABLE_ADMIN:', SHOULD_DISABLE_ADMIN)
console.log('[MEDUSA-CONFIG] Admin will be available at:', `${BACKEND_URL}/app`)
console.log('[MEDUSA-CONFIG] ZARINPAL_MERCHANT_ID:', !!ZARINPAL_MERCHANT_ID ? 'SET' : 'NOT SET')
console.log('[MEDUSA-CONFIG] ZARINPAL_OFFLINE:', ZARINPAL_OFFLINE)
console.log('[MEDUSA-CONFIG] ZARINPAL_SANDBOX:', ZARINPAL_SANDBOX)
console.log('[MEDUSA-CONFIG] ZARINPAL_CALLBACK_URL:', ZARINPAL_CALLBACK_URL)

const medusaConfig = {
  projectConfig: {
    databaseUrl: DATABASE_URL,
    databaseLogging: false,
    redisUrl: REDIS_URL,
    workerMode: WORKER_MODE,
    http: {
      adminCors: ADMIN_CORS,
      authCors: AUTH_CORS,
      storeCors: STORE_CORS,
      jwtSecret: JWT_SECRET,
      cookieSecret: COOKIE_SECRET
    },
    build: {
      rollupOptions: {
        external: ["@medusajs/dashboard"]
      }
    }
  },
  admin: {
    backendUrl: BACKEND_URL,
    path: '/app', // Explicitly set the admin path
    disable: SHOULD_DISABLE_ADMIN,
    // Don't auto-rebuild in production - admin should be pre-built during build phase
    autoRebuild: IS_DEV, // Only auto-rebuild in development
  },
  modules: [
    {
      key: Modules.FILE,
      resolve: '@medusajs/file',
      options: {
        providers: [
          ...(MINIO_ENDPOINT && MINIO_ACCESS_KEY && MINIO_SECRET_KEY ? [{
            resolve: './src/modules/minio-file',
            id: 'minio',
            options: {
              endPoint: MINIO_ENDPOINT,
              accessKey: MINIO_ACCESS_KEY,
              secretKey: MINIO_SECRET_KEY,
              bucket: MINIO_BUCKET // Optional, default: medusa-media
            }
          }] : [{
            resolve: '@medusajs/file-local',
            id: 'local',
            options: {
              upload_dir: 'static',
              backend_url: `${BACKEND_URL}/static`
            }
          }])
        ]
      }
    },
    ...(REDIS_URL ? [{
      key: Modules.EVENT_BUS,
      resolve: '@medusajs/event-bus-redis',
      options: {
        redisUrl: REDIS_URL
      }
    },
    {
      key: Modules.WORKFLOW_ENGINE,
      resolve: '@medusajs/workflow-engine-redis',
      options: {
        redis: {
          url: REDIS_URL,
        }
      }
    }] : []),
    ...(SENDGRID_API_KEY && SENDGRID_FROM_EMAIL || RESEND_API_KEY && RESEND_FROM_EMAIL ? [{
      key: Modules.NOTIFICATION,
      resolve: '@medusajs/notification',
      options: {
        providers: [
          ...(SENDGRID_API_KEY && SENDGRID_FROM_EMAIL ? [{
            resolve: '@medusajs/notification-sendgrid',
            id: 'sendgrid',
            options: {
              channels: ['email'],
              api_key: SENDGRID_API_KEY,
              from: SENDGRID_FROM_EMAIL,
            }
          }] : []),
          ...(RESEND_API_KEY && RESEND_FROM_EMAIL ? [{
            resolve: './src/modules/email-notifications',
            id: 'resend',
            options: {
              channels: ['email'],
              api_key: RESEND_API_KEY,
              from: RESEND_FROM_EMAIL,
            },
          }] : []),
        ]
      }
    }] : []),
    ...((STRIPE_API_KEY && STRIPE_WEBHOOK_SECRET) || ZARINPAL_MERCHANT_ID || ZARINPAL_OFFLINE ? (() => {
      console.log('[MEDUSA-CONFIG] Registering PAYMENT module...')
      const paymentModule = {
        key: Modules.PAYMENT,
        resolve: '@medusajs/payment',
        options: {
          providers: [
            ...(STRIPE_API_KEY && STRIPE_WEBHOOK_SECRET ? [{
              resolve: '@medusajs/payment-stripe',
              id: 'stripe',
              options: {
                apiKey: STRIPE_API_KEY,
                webhookSecret: STRIPE_WEBHOOK_SECRET,
              },
            }] : []),
            ...((ZARINPAL_MERCHANT_ID || ZARINPAL_OFFLINE) ? (() => {
              // CRITICAL: Use proxy URL for callback to bypass Iran filtering
              // The proxy URL should route to the backend through Cloudflare
              const PROXY_CALLBACK_FALLBACK = 'https://proxy.sharifgpt.com/medusa/internal/zarinpal-callback';
              const finalCallbackUrl = ZARINPAL_CALLBACK_URL || PROXY_CALLBACK_FALLBACK;
              
              console.log('[MEDUSA-CONFIG] Adding Zarinpal provider to payment module')
              console.log('[MEDUSA-CONFIG] ZARINPAL_CALLBACK_URL env value:', ZARINPAL_CALLBACK_URL)
              console.log('[MEDUSA-CONFIG] Final callback_url being used:', finalCallbackUrl)
              console.log('[MEDUSA-CONFIG] Zarinpal options:', {
                merchant_id: ZARINPAL_MERCHANT_ID ? 'SET' : 'NOT SET',
                sandbox: ZARINPAL_SANDBOX,
                offline: ZARINPAL_OFFLINE,
                callback_url: finalCallbackUrl
              })
              
              if (!ZARINPAL_CALLBACK_URL) {
                console.warn('[MEDUSA-CONFIG] WARNING: ZARINPAL_CALLBACK_URL not set, using proxy fallback:', PROXY_CALLBACK_FALLBACK)
              }
              
              return [{
                resolve: './src/modules/payment-zarinpal',
                id: 'zarinpal',
                options: {
                  merchant_id: ZARINPAL_MERCHANT_ID,
                  sandbox: ZARINPAL_SANDBOX,
                  description: 'Payment',
                  callback_url: finalCallbackUrl,
                  offline: ZARINPAL_OFFLINE,
                },
              }]
            })() : []),
          ],
        },
      }
      console.log('[MEDUSA-CONFIG] Payment module configured with', paymentModule.options.providers.length, 'provider(s)')
      return [paymentModule]
    })() : []),
    {
      key: Modules.PROMOTION,
      resolve: '@medusajs/promotion',
    }
  ],
  plugins: [
  ...(MEILISEARCH_HOST && MEILISEARCH_ADMIN_KEY ? [{
      resolve: '@rokmohar/medusa-plugin-meilisearch',
      options: {
        config: {
          host: MEILISEARCH_HOST,
          apiKey: MEILISEARCH_ADMIN_KEY
        },
        settings: {
          products: {
            type: 'products',
            enabled: true,
            fields: ['id', 'title', 'description', 'handle', 'variant_sku', 'thumbnail'],
            indexSettings: {
              searchableAttributes: ['title', 'description', 'variant_sku'],
              displayedAttributes: ['id', 'handle', 'title', 'description', 'variant_sku', 'thumbnail'],
              filterableAttributes: ['id', 'handle'],
            },
            primaryKey: 'id',
          }
        }
      }
    }] : [])
  ]
};

console.log('[MEDUSA-CONFIG] Configuration object created')
console.log('[MEDUSA-CONFIG] Total modules:', medusaConfig.modules.length)
console.log('[MEDUSA-CONFIG] Modules:', medusaConfig.modules.map(m => m.key))

export default defineConfig(medusaConfig);
