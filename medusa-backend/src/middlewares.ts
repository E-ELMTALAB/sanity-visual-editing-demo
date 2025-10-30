import { defineMiddlewares } from "@medusajs/framework";

/**
 * Medusa v2 Middleware Configuration
 * This file configures CORS and other middlewares for custom routes
 */

/**
 * Get allowed origin based on configuration
 * Supports: *, exact matches, and regex patterns
 */
function getAllowedOrigin(requestOrigin: string | undefined, corsConfig: string): string | undefined {
  if (corsConfig === '*' || !corsConfig) {
    return '*';
  }
  
  const origins = corsConfig.split(',').map(origin => origin.trim());
  
  if (!requestOrigin) {
    return undefined;
  }
  
  // Check exact matches
  if (origins.includes(requestOrigin)) {
    return requestOrigin;
  }
  
  // Check regex patterns (e.g., /^https:\/\/.*\.yourdomain\.com$/)
  for (const pattern of origins) {
    if (pattern.startsWith('/') && pattern.endsWith('/')) {
      try {
        const regex = new RegExp(pattern.slice(1, -1));
        if (regex.test(requestOrigin)) {
          return requestOrigin;
        }
      } catch (e) {
        console.warn(`Invalid CORS regex pattern: ${pattern}`);
      }
    }
  }
  
  return undefined;
}

export default defineMiddlewares({
  routes: [
    // EARLY MIDDLEWARE to log ALL requests to /store/* FIRST
    // Middlewares run in REVERSE ORDER, so this will log LAST
    {
      matcher: "/store/*",
      middlewares: [
        (req, res, next) => {
          console.log('[EARLY-MIDDLEWARE] ======== REQUEST REACHED CUSTOM MIDDLEWARE ========');
          console.log('[EARLY-MIDDLEWARE] Path:', req.url);
          console.log('[EARLY-MIDDLEWARE] Method:', req.method);
          console.log('[EARLY-MIDDLEWARE] Full URL:', req.url);
          console.log('[EARLY-MIDDLEWARE] All headers:', JSON.stringify(req.headers, null, 2));
          console.log('[EARLY-MIDDLEWARE] If you see this, request PASSED Medusa middleware!');
          next();
        },
      ],
    },
    
    // CORS middleware for all store API routes
    {
      matcher: "/store/*",
      middlewares: [
        (req, res, next) => {
          console.log('[MIDDLEWARE] /store/* middleware triggered');
          console.log('[MIDDLEWARE] Request path:', req.url);
          console.log('[MIDDLEWARE] Request method:', req.method);
          console.log('[MIDDLEWARE] Request origin:', req.headers.origin);
          
          // Get CORS config from environment variable
          const corsConfig = process.env.STORE_CORS || '*';
          const requestOrigin = req.headers.origin;
          
          console.log('[MIDDLEWARE] CORS config from env:', corsConfig);
          
          // Get allowed origin based on config
          const allowedOrigin = getAllowedOrigin(requestOrigin, corsConfig);
          
          console.log('[MIDDLEWARE] Allowed origin determined:', allowedOrigin);
          
          // Only set Access-Control-Allow-Origin if we have a valid origin
          if (allowedOrigin) {
            res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
            console.log('[MIDDLEWARE] ✅ Set Access-Control-Allow-Origin:', allowedOrigin);
          } else {
            console.log('[MIDDLEWARE] ⚠️ No allowed origin determined');
          }
          
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, x-publishable-api-key, x-medusa-access-token, Accept, Origin, Cache-Control, Pragma');
          res.setHeader('Access-Control-Allow-Credentials', 'true');
          res.setHeader('Access-Control-Max-Age', '86400');
          res.setHeader('Access-Control-Expose-Headers', 'Content-Length, X-JSON');
          res.setHeader('Vary', 'Origin');
          
          console.log('[MIDDLEWARE] All CORS headers set, proceeding...');
          
          // Handle preflight requests
          if (req.method === 'OPTIONS') {
            console.log('[MIDDLEWARE] OPTIONS request, returning 200');
            res.status(200).end();
            return;
          }
          
          console.log('[MIDDLEWARE] Calling next() to continue to route handler');
          next();
        },
      ],
    },
    // CORS middleware for admin API routes
    {
      matcher: "/admin/*",
      middlewares: [
        (req, res, next) => {
          const corsConfig = process.env.ADMIN_CORS || '*';
          const requestOrigin = req.headers.origin;
          const allowedOrigin = getAllowedOrigin(requestOrigin, corsConfig);
          
          if (allowedOrigin) {
            res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
          }
          
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, x-medusa-access-token, Accept, Origin, Cache-Control, Pragma');
          res.setHeader('Access-Control-Allow-Credentials', 'true');
          res.setHeader('Access-Control-Max-Age', '86400');
          res.setHeader('Access-Control-Expose-Headers', 'Content-Length, X-JSON');
          res.setHeader('Vary', 'Origin');
          
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
          const corsConfig = process.env.AUTH_CORS || '*';
          const requestOrigin = req.headers.origin;
          const allowedOrigin = getAllowedOrigin(requestOrigin, corsConfig);
          
          if (allowedOrigin) {
            res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
          }
          
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, x-medusa-access-token, Accept, Origin, Cache-Control, Pragma');
          res.setHeader('Access-Control-Allow-Credentials', 'true');
          res.setHeader('Access-Control-Max-Age', '86400');
          res.setHeader('Access-Control-Expose-Headers', 'Content-Length, X-JSON');
          res.setHeader('Vary', 'Origin');
          
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
