import { defineMiddlewares } from "@medusajs/framework";
import cors from "cors";

/**
 * Medusa v2 Middleware Configuration
 * This file configures CORS and other middlewares for custom routes
 */
export default defineMiddlewares({
  routes: [
    // CORS middleware for all store API routes
    {
      matcher: "/store/*",
      middlewares: [
        (req, res, next) => {
          // Apply comprehensive CORS headers
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, x-publishable-api-key, x-medusa-access-token, Accept, Origin, Cache-Control, Pragma');
          res.setHeader('Access-Control-Allow-Credentials', 'true');
          res.setHeader('Access-Control-Max-Age', '86400');
          res.setHeader('Access-Control-Expose-Headers', 'Content-Length, X-JSON');
          res.setHeader('Vary', 'Origin');
          
          // Handle preflight requests
          if (req.method === 'OPTIONS') {
            res.status(200).end();
            return;
          }
          
          next();
        },
      ],
    },
    // CORS middleware for admin API routes
    {
      matcher: "/admin/*",
      middlewares: [
        (req, res, next) => {
          // Apply comprehensive CORS headers
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, x-medusa-access-token, Accept, Origin, Cache-Control, Pragma');
          res.setHeader('Access-Control-Allow-Credentials', 'true');
          res.setHeader('Access-Control-Max-Age', '86400');
          res.setHeader('Access-Control-Expose-Headers', 'Content-Length, X-JSON');
          res.setHeader('Vary', 'Origin');
          
          // Handle preflight requests
          if (req.method === 'OPTIONS') {
            res.status(200).end();
            return;
          }
          
          next();
        },
      ],
    },
    // CORS middleware for internal API routes
    {
      matcher: "/internal/*",
      middlewares: [
        (req, res, next) => {
          // Apply comprehensive CORS headers
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, x-medusa-access-token, Accept, Origin, Cache-Control, Pragma');
          res.setHeader('Access-Control-Allow-Credentials', 'true');
          res.setHeader('Access-Control-Max-Age', '86400');
          res.setHeader('Access-Control-Expose-Headers', 'Content-Length, X-JSON');
          res.setHeader('Vary', 'Origin');
          
          // Handle preflight requests
          if (req.method === 'OPTIONS') {
            res.status(200).end();
            return;
          }
          
          next();
        },
      ],
    },
  ],
});
