import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const healthStatus: any = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    services: {},
    system: {
      nodeVersion: process.version,
      platform: process.platform,
      memory: {
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + " MB",
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + " MB",
      },
    },
  };

  let hasError = false;

  // Check Database Connection
  try {
    const manager = req.scope.resolve("manager") as any;
    await manager.query("SELECT 1");
    healthStatus.services.database = {
      status: "healthy",
      type: "PostgreSQL",
      message: "Connection successful",
    };
  } catch (error: any) {
    hasError = true;
    healthStatus.services.database = {
      status: "unhealthy",
      type: "PostgreSQL",
      error: error.message,
    };
  }

  // Check Redis Connection
  try {
    const redisUrl = process.env.REDIS_URL;
    if (redisUrl) {
      // Simple check - Redis is configured
      healthStatus.services.redis = {
        status: "configured",
        message: "Redis URL is set (used for event bus & workflows)",
      };
    } else {
      healthStatus.services.redis = {
        status: "not_configured",
        message: "Using in-memory fallback",
      };
    }
  } catch (error: any) {
    healthStatus.services.redis = {
      status: "error",
      error: error.message,
    };
  }

  // Check MinIO Configuration
  try {
    const minioEndpoint = process.env.MINIO_ENDPOINT;
    const minioAccessKey = process.env.MINIO_ACCESS_KEY;
    const minioSecretKey = process.env.MINIO_SECRET_KEY;

    if (minioEndpoint && minioAccessKey && minioSecretKey) {
      healthStatus.services.minio = {
        status: "configured",
        endpoint: minioEndpoint,
        message: "MinIO file storage is configured",
      };
    } else {
      healthStatus.services.minio = {
        status: "not_configured",
        message: "Using local file storage fallback",
      };
    }
  } catch (error: any) {
    healthStatus.services.minio = {
      status: "error",
      error: error.message,
    };
  }

  // Check Meilisearch Configuration
  try {
    const meilisearchHost = process.env.MEILISEARCH_HOST;
    const meilisearchKey = process.env.MEILISEARCH_ADMIN_KEY;

    if (meilisearchHost && meilisearchKey) {
      healthStatus.services.meilisearch = {
        status: "configured",
        host: meilisearchHost,
        message: "Search engine is configured",
      };
    } else {
      healthStatus.services.meilisearch = {
        status: "not_configured",
        message: "Search functionality not available",
      };
    }
  } catch (error: any) {
    healthStatus.services.meilisearch = {
      status: "error",
      error: error.message,
    };
  }

  // Check Email Service Configuration
  try {
    const resendKey = process.env.RESEND_API_KEY;
    const sendgridKey = process.env.SENDGRID_API_KEY;

    if (resendKey) {
      healthStatus.services.email = {
        status: "configured",
        provider: "Resend",
        from: process.env.RESEND_FROM_EMAIL || "not set",
      };
    } else if (sendgridKey) {
      healthStatus.services.email = {
        status: "configured",
        provider: "SendGrid",
        from: process.env.SENDGRID_FROM_EMAIL || "not set",
      };
    } else {
      healthStatus.services.email = {
        status: "not_configured",
        message: "No email provider configured",
      };
    }
  } catch (error: any) {
    healthStatus.services.email = {
      status: "error",
      error: error.message,
    };
  }

  // Check Stripe Configuration
  try {
    const stripeKey = process.env.STRIPE_API_KEY;
    const stripeWebhook = process.env.STRIPE_WEBHOOK_SECRET;

    if (stripeKey && stripeWebhook) {
      healthStatus.services.stripe = {
        status: "configured",
        message: "Payment processing is configured",
        mode: stripeKey.includes("_test_") ? "test" : "live",
      };
    } else {
      healthStatus.services.stripe = {
        status: "not_configured",
        message: "Payment processing not available",
      };
    }
  } catch (error: any) {
    healthStatus.services.stripe = {
      status: "error",
      error: error.message,
    };
  }

  // Check CORS Configuration
  healthStatus.configuration = {
    cors: {
      store: process.env.STORE_CORS || "not set",
      admin: process.env.ADMIN_CORS || "not set",
    },
    workerMode: process.env.MEDUSA_WORKER_MODE || "shared",
    adminDisabled: process.env.MEDUSA_DISABLE_ADMIN === "true",
  };

  // Set overall status
  if (hasError) {
    healthStatus.status = "degraded";
  }

  // Return appropriate status code
  const statusCode = hasError ? 503 : 200;

  res.status(statusCode).json(healthStatus);
};

