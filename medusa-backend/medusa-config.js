const dotenv = require("dotenv");

let ENV_FILE_NAME = "";
switch (process.env.NODE_ENV) {
  case "production":
    ENV_FILE_NAME = ".env.production";
    break;
  case "staging":
    ENV_FILE_NAME = ".env.staging";
    break;
  case "test":
    ENV_FILE_NAME = ".env.test";
    break;
  case "development":
  default:
    ENV_FILE_NAME = ".env";
    break;
}

try {
  dotenv.config({ path: process.cwd() + "/" + ENV_FILE_NAME });
} catch (e) {
  console.error("Error loading environment file:", e);
}

// CORS when consuming Medusa from admin
const ADMIN_CORS = process.env.ADMIN_CORS || "http://localhost:7000,http://localhost:7001";

// CORS when consuming Medusa from a storefront
const STORE_CORS = process.env.STORE_CORS || "http://localhost:3000";

// Database URL
const DATABASE_URL = process.env.DATABASE_URL || "postgres://localhost/medusa-store";

// Redis URL (optional - only use if provided)
const REDIS_URL = process.env.REDIS_URL;

const plugins = [
  `medusa-fulfillment-manual`,
  `medusa-payment-manual`,
  {
    resolve: `@medusajs/file-local`,
    options: {
      upload_dir: "uploads",
    },
  },
  {
    resolve: "@medusajs/admin",
    /** @type {import('@medusajs/admin').PluginOptions} */
    options: {
      autoRebuild: true,
      develop: {
        open: process.env.OPEN_BROWSER !== "false",
      },
    },
  },
];

// Stripe payment provider (for international customers)
if (process.env.STRIPE_API_KEY) {
  plugins.push({
    resolve: `medusa-payment-stripe`,
    options: {
      api_key: process.env.STRIPE_API_KEY,
      webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
    },
  });
}

// Email plugin - SendGrid
if (process.env.SENDGRID_API_KEY) {
  plugins.push({
    resolve: `medusa-plugin-sendgrid`,
    options: {
      api_key: process.env.SENDGRID_API_KEY,
      from: process.env.SENDGRID_FROM,
      order_placed_template: process.env.SENDGRID_ORDER_PLACED_TEMPLATE,
    },
  });
}

// Redis cache
if (REDIS_URL) {
  plugins.push({
    resolve: `@medusajs/cache-redis`,
    options: {
      redisUrl: REDIS_URL,
      ttl: 30,
    },
  });
}

// Redis event bus (only if Redis is available)
if (REDIS_URL) {
  plugins.push({
    resolve: `@medusajs/event-bus-redis`,
    options: {
      redisUrl: REDIS_URL,
    },
  });
} else {
  // Use local event bus if no Redis
  plugins.push({
    resolve: `@medusajs/event-bus-local`,
  });
}

const modules = {
  /*eventBus: {
    resolve: "@medusajs/event-bus-redis",
    options: {
      redisUrl: REDIS_URL
    }
  },
  cacheService: {
    resolve: "@medusajs/cache-redis",
    options: {
      redisUrl: REDIS_URL
    }
  },*/
};

/** @type {import('@medusajs/medusa').ConfigModule["projectConfig"]} */
const projectConfig = {
  jwtSecret: process.env.JWT_SECRET,
  cookieSecret: process.env.COOKIE_SECRET,
  store_cors: STORE_CORS,
  database_url: DATABASE_URL,
  admin_cors: ADMIN_CORS,
  // Railway/Production configuration
  host: process.env.HOST || "0.0.0.0",
  port: parseInt(process.env.PORT || "9000"),
  database_extra:
    process.env.NODE_ENV !== "development"
      ? {
          ssl: {
            rejectUnauthorized: false,
          },
        }
      : {},
  ...(REDIS_URL && { redis_url: REDIS_URL }), // Only include Redis if provided
};

/** @type {import('@medusajs/medusa').ConfigModule} */
module.exports = {
  projectConfig,
  plugins: plugins.filter(p => p), // Remove undefined plugins
  modules,
  featureFlags: {
    product_categories: true,
    tax_inclusive_pricing: true,
  },
};

