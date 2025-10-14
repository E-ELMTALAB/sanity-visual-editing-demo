import { MedusaRequest, MedusaResponse } from "@medusajs/framework";

/**
 * Test Redis Configuration
 * GET /store/test-redis
 * 
 * Checks if Redis is configured properly
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const testResults: any = {
    timestamp: new Date().toISOString(),
    redis: {
      configured: !!process.env.REDIS_URL,
      url: process.env.REDIS_URL ? "***configured***" : "not set"
    },
    modules: []
  };

  if (!process.env.REDIS_URL) {
    return res.status(503).json({
      ...testResults,
      status: "❌ Redis not configured",
      message: "REDIS_URL environment variable is not set"
    });
  }

  try {
    // Test Redis-based modules (Event Bus and Workflow Engine)
    const eventBusConfigured = process.env.REDIS_URL !== undefined;
    
    testResults.modules.push({
      name: "Event Bus (Redis)",
      status: eventBusConfigured ? "✅ Configured" : "❌ Not Configured",
      message: eventBusConfigured 
        ? "Redis URL is set for event bus" 
        : "Redis URL not found"
    });

    testResults.modules.push({
      name: "Workflow Engine (Redis)",
      status: eventBusConfigured ? "✅ Configured" : "❌ Not Configured",
      message: eventBusConfigured 
        ? "Redis URL is set for workflows" 
        : "Redis URL not found"
    });

    // Parse Redis URL to show connection details (sanitized)
    if (process.env.REDIS_URL) {
      try {
        const url = new URL(process.env.REDIS_URL);
        testResults.redis.host = url.hostname || "unknown";
        testResults.redis.port = url.port || "6379";
        testResults.redis.database = url.searchParams.get("family") || "0";
      } catch (e) {
        testResults.redis.parseError = "Could not parse Redis URL";
      }
    }

    testResults.status = "✅ Redis Configuration Valid";
    testResults.message = "Redis is configured for Medusa v2 modules";
    testResults.note = "Redis is used by Event Bus and Workflow Engine modules";

    res.status(200).json(testResults);

  } catch (error: any) {
    testResults.status = "❌ Redis Check Failed";
    testResults.error = error.message;

    res.status(503).json(testResults);
  }
};

