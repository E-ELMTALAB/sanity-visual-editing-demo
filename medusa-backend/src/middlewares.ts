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
    // Special middleware for Zarinpal callback - inject publishable API key before Medusa validation
    {
      matcher: "/store/zarinpal/callback",
      middlewares: [
        (req, res, next) => {
          // Zarinpal callback doesn't send headers, so we inject the publishable API key here
          // This must be set BEFORE Medusa's framework validates it
          const PUBLISHABLE_API_KEY = 'pk_2243c4f7a1f70eb2bb9b354ad7b22be869fca2633214edd7ee70637412a67bd4'
          if (!req.headers['x-publishable-api-key']) {
            req.headers['x-publishable-api-key'] = PUBLISHABLE_API_KEY
            console.log('[MIDDLEWARE-CALLBACK] Injected publishable API key for Zarinpal callback')
          }
          next()
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
