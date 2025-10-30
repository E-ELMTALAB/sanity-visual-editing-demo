import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { applyCorsHeaders, handleCorsPreflight } from "../../../middleware/global-cors";

/**
 * Comprehensive CORS Test Endpoint
 * GET /store/cors-test-comprehensive
 * 
 * This endpoint tests all CORS functionality and provides detailed information
 * about the CORS configuration for debugging purposes.
 */

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  // Apply CORS headers
  applyCorsHeaders(req, res);
  
  // Handle preflight requests
  if (handleCorsPreflight(req, res)) {
    return;
  }
  
  try {
    const response = {
      success: true,
      message: "CORS is properly configured and working",
      timestamp: new Date().toISOString(),
      request: {
        method: req.method,
        url: req.url,
        origin: req.headers.origin || "unknown",
        userAgent: req.headers['user-agent'] || "unknown",
        referer: req.headers.referer || "unknown",
        host: req.headers.host || "unknown"
      },
      cors: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, x-publishable-api-key, x-medusa-access-token, Accept, Origin, Cache-Control, Pragma',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Expose-Headers': 'Content-Length, X-JSON'
      },
      environment: {
        NODE_ENV: process.env.NODE_ENV || 'development',
        MEDUSA_BACKEND_URL: process.env.MEDUSA_BACKEND_URL || 'not set',
        STORE_CORS: process.env.STORE_CORS || 'not set',
        ADMIN_CORS: process.env.ADMIN_CORS || 'not set',
        AUTH_CORS: process.env.AUTH_CORS || 'not set'
      },
      instructions: {
        note: "This endpoint confirms that CORS is working properly",
        testing: "You can test CORS by making requests from different origins",
        preflight: "OPTIONS requests should return 200 with CORS headers",
        methods: "All HTTP methods are supported: GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD"
      }
    };
    
    res.status(200).json(response);
  } catch (error: any) {
    console.error("CORS test error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "CORS test failed"
    });
  }
};

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  // Apply CORS headers
  applyCorsHeaders(req, res);
  
  // Handle preflight requests
  if (handleCorsPreflight(req, res)) {
    return;
  }
  
  try {
    const body = req.body || {};
    
    const response = {
      success: true,
      message: "CORS POST request handled successfully",
      timestamp: new Date().toISOString(),
      receivedData: body,
      request: {
        method: req.method,
        origin: req.headers.origin || "unknown",
        contentType: req.headers['content-type'] || "unknown"
      }
    };
    
    res.status(200).json(response);
  } catch (error: any) {
    console.error("CORS POST test error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "CORS POST test failed"
    });
  }
};

export const OPTIONS = async (req: MedusaRequest, res: MedusaResponse) => {
  // Apply CORS headers for preflight requests
  applyCorsHeaders(req, res);
  
  const response = {
    success: true,
    message: "CORS preflight request handled successfully",
    timestamp: new Date().toISOString(),
    method: req.method,
    origin: req.headers.origin || "unknown",
    cors: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, x-publishable-api-key, x-medusa-access-token, Accept, Origin, Cache-Control, Pragma',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400'
    }
  };
  
  res.status(200).json(response);
};

// Support all HTTP methods for comprehensive testing
export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
  applyCorsHeaders(req, res);
  if (handleCorsPreflight(req, res)) return;
  
  res.status(200).json({
    success: true,
    message: "CORS PUT request handled successfully",
    method: req.method,
    timestamp: new Date().toISOString()
  });
};

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  applyCorsHeaders(req, res);
  if (handleCorsPreflight(req, res)) return;
  
  res.status(200).json({
    success: true,
    message: "CORS DELETE request handled successfully",
    method: req.method,
    timestamp: new Date().toISOString()
  });
};

export const PATCH = async (req: MedusaRequest, res: MedusaResponse) => {
  applyCorsHeaders(req, res);
  if (handleCorsPreflight(req, res)) return;
  
  res.status(200).json({
    success: true,
    message: "CORS PATCH request handled successfully",
    method: req.method,
    timestamp: new Date().toISOString()
  });
};
