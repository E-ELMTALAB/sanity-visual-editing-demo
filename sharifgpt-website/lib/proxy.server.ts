/**
 * Server-side Proxy Configuration
 * Use this in API routes and server components
 */

// Check if proxy mode is enabled (server-side can use non-public env vars too)
export const isProxyEnabled = process.env.NEXT_PUBLIC_PROXY_ENABLED === 'true';

// Unified proxy URL
export const UNIFIED_PROXY_URL = process.env.NEXT_PUBLIC_UNIFIED_PROXY_URL || '';

// Individual proxy URLs
export const MEDUSA_PROXY_URL = process.env.NEXT_PUBLIC_MEDUSA_PROXY_URL || '';

// Original Medusa backend URL
const ORIGINAL_MEDUSA_BACKEND = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'https://backend.sharifgpt.com';

/**
 * Get the Medusa backend URL for server-side requests
 * Returns proxy URL if enabled, otherwise original
 */
export function getMedusaBackendUrl(): string {
  if (!isProxyEnabled) return ORIGINAL_MEDUSA_BACKEND;
  
  // Prefer unified proxy with /medusa prefix
  if (UNIFIED_PROXY_URL) return `${UNIFIED_PROXY_URL}/medusa`;
  
  // Fall back to dedicated Medusa proxy
  if (MEDUSA_PROXY_URL) return MEDUSA_PROXY_URL;
  
  return ORIGINAL_MEDUSA_BACKEND;
}

// Export default backend URL
export const MEDUSA_BACKEND_URL = getMedusaBackendUrl();

// Publishable API key for Medusa
export const MEDUSA_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || 
  'pk_2243c4f7a1f70eb2bb9b354ad7b22be869fca2633214edd7ee70637412a67bd4';

