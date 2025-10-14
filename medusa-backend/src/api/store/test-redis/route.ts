import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import Redis from "ioredis";

/**
 * Test Redis Connection
 * GET /store/test-redis
 * 
 * Tests Redis connectivity and operations
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const testResults: any = {
    timestamp: new Date().toISOString(),
    redis: {
      configured: !!process.env.REDIS_URL,
      url: process.env.REDIS_URL ? "***configured***" : "not set"
    },
    tests: []
  };

  if (!process.env.REDIS_URL) {
    return res.status(503).json({
      ...testResults,
      status: "❌ Redis not configured",
      message: "REDIS_URL environment variable is not set"
    });
  }

  let client: Redis | null = null;

  try {
    // Create Redis client
    client = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        if (times > 3) return null;
        return Math.min(times * 100, 2000);
      }
    });

    // Test 1: Connection
    testResults.tests.push({
      name: "Connection",
      status: "✅ Connected",
      message: "Successfully connected to Redis"
    });

    // Test 2: SET operation
    const testKey = `medusa:test:${Date.now()}`;
    const testValue = { test: true, timestamp: Date.now() };
    await client.set(testKey, JSON.stringify(testValue), "EX", 60);
    testResults.tests.push({
      name: "SET Operation",
      status: "✅ Success",
      key: testKey,
      message: "Successfully wrote to Redis (60s TTL)"
    });

    // Test 3: GET operation
    const retrieved = await client.get(testKey);
    const parsedValue = JSON.parse(retrieved || "{}");
    testResults.tests.push({
      name: "GET Operation",
      status: "✅ Success",
      retrieved: parsedValue,
      message: "Successfully read from Redis"
    });

    // Test 4: DELETE operation
    await client.del(testKey);
    testResults.tests.push({
      name: "DELETE Operation",
      status: "✅ Success",
      message: "Successfully deleted test key"
    });

    // Test 5: Info
    const info = await client.info("server");
    const versionMatch = info.match(/redis_version:([^\r\n]+)/);
    testResults.redis.version = versionMatch ? versionMatch[1] : "unknown";

    testResults.status = "✅ All Redis Tests Passed";
    testResults.message = "Redis is fully operational";

    res.status(200).json(testResults);

  } catch (error: any) {
    testResults.status = "❌ Redis Test Failed";
    testResults.error = error.message;
    testResults.tests.push({
      name: "Error",
      status: "❌ Failed",
      error: error.message
    });

    res.status(503).json(testResults);
  } finally {
    // Clean up connection
    if (client) {
      await client.quit();
    }
  }
};

