/**
 * Cloudflare Proxy Configuration
 * 
 * This file centralizes all proxy URLs for bypassing internet filtering in Iran.
 * 
 * QUICK SETUP:
 * 1. Deploy the Cloudflare Worker from /cloudflare/unified-proxy.js
 * 2. Replace YOUR-SUBDOMAIN below with your Cloudflare account subdomain
 * 3. Set PROXY_ENABLED to true
 * 
 * Or use environment variables:
 * - NEXT_PUBLIC_PROXY_ENABLED: Set to "true" to enable proxy mode
 * - NEXT_PUBLIC_UNIFIED_PROXY_URL: URL of your unified Cloudflare Worker
 */

// ============================================================================
// CONFIGURATION - CHANGE THESE VALUES
// ============================================================================

// Set to true to enable proxy (bypasses internet filtering)
const PROXY_ENABLED = true;

// Your Cloudflare Worker URL - REPLACE YOUR-SUBDOMAIN with your actual subdomain
// Example: https://sharifgpt-proxy.john123.workers.dev
const DEFAULT_PROXY_URL = 'https://jaeshproxy.elmtalabx.workers.dev/';

// ============================================================================
// DO NOT MODIFY BELOW THIS LINE
// ============================================================================

// Check if proxy mode is enabled (env var takes priority)
export const isProxyEnabled = 
  process.env.NEXT_PUBLIC_PROXY_ENABLED === 'true' || 
  process.env.NEXT_PUBLIC_PROXY_ENABLED === undefined && PROXY_ENABLED;

// Unified proxy URL (handles all services with path prefixes)
export const UNIFIED_PROXY_URL = process.env.NEXT_PUBLIC_UNIFIED_PROXY_URL || DEFAULT_PROXY_URL;

// Individual proxy URLs (for separate worker deployments)
export const SANITY_CDN_PROXY_URL = process.env.NEXT_PUBLIC_SANITY_CDN_PROXY_URL || '';
export const SANITY_API_PROXY_URL = process.env.NEXT_PUBLIC_SANITY_API_PROXY_URL || '';
export const MEDUSA_PROXY_URL = process.env.NEXT_PUBLIC_MEDUSA_PROXY_URL || '';

// Original service URLs
const ORIGINAL_SANITY_CDN = 'https://cdn.sanity.io';
const ORIGINAL_MEDUSA_BACKEND = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'https://backend.sharifgpt.com';

// Check if proxy URL is valid (not placeholder)
function isProxyUrlValid(): boolean {
  return UNIFIED_PROXY_URL && !UNIFIED_PROXY_URL.includes('YOUR-SUBDOMAIN');
}

/**
 * Get the Sanity CDN base URL
 * Returns proxy URL if enabled and valid, otherwise original
 */
export function getSanityCDNUrl(): string {
  if (!isProxyEnabled || !isProxyUrlValid()) return ORIGINAL_SANITY_CDN;
  
  // Prefer unified proxy with /cdn prefix
  if (UNIFIED_PROXY_URL) return `${UNIFIED_PROXY_URL}/cdn`;
  
  // Fall back to dedicated CDN proxy
  if (SANITY_CDN_PROXY_URL) return SANITY_CDN_PROXY_URL;
  
  return ORIGINAL_SANITY_CDN;
}

/**
 * Get the Sanity API proxy URL (for the client)
 * Note: The Sanity client internally constructs URLs, so we return the proxy base
 */
export function getSanityAPIProxyUrl(): string | undefined {
  if (!isProxyEnabled || !isProxyUrlValid()) return undefined;
  
  // Prefer unified proxy with /api prefix
  if (UNIFIED_PROXY_URL) return `${UNIFIED_PROXY_URL}/api`;
  
  // Fall back to dedicated API proxy
  if (SANITY_API_PROXY_URL) return SANITY_API_PROXY_URL;
  
  return undefined;
}

/**
 * Get the Medusa backend URL
 * Returns proxy URL if enabled and valid, otherwise original
 */
export function getMedusaBackendUrl(): string {
  if (!isProxyEnabled || !isProxyUrlValid()) return ORIGINAL_MEDUSA_BACKEND;
  
  // Prefer unified proxy with /medusa prefix
  if (UNIFIED_PROXY_URL) return `${UNIFIED_PROXY_URL}/medusa`;
  
  // Fall back to dedicated Medusa proxy
  if (MEDUSA_PROXY_URL) return MEDUSA_PROXY_URL;
  
  return ORIGINAL_MEDUSA_BACKEND;
}

/**
 * Transform a Sanity CDN URL to use the proxy
 * Converts: https://cdn.sanity.io/images/... → {proxy}/images/...
 */
export function proxySanityCDNUrl(originalUrl: string): string {
  if (!isProxyEnabled || !isProxyUrlValid()) return originalUrl;
  if (!originalUrl) return originalUrl;
  
  const cdnProxy = getSanityCDNUrl();
  if (cdnProxy === ORIGINAL_SANITY_CDN) return originalUrl;
  
  // Replace the CDN hostname with proxy
  return originalUrl.replace(ORIGINAL_SANITY_CDN, cdnProxy);
}

/**
 * Transform a Medusa backend URL to use the proxy
 */
export function proxyMedusaUrl(originalUrl: string): string {
  if (!isProxyEnabled || !isProxyUrlValid()) return originalUrl;
  if (!originalUrl) return originalUrl;
  
  const medusaProxy = getMedusaBackendUrl();
  if (medusaProxy === ORIGINAL_MEDUSA_BACKEND) return originalUrl;
  
  return originalUrl.replace(ORIGINAL_MEDUSA_BACKEND, medusaProxy);
}

/**
 * Get the hostname from proxy URL for Next.js image config
 */
export function getProxyHostname(): string | undefined {
  if (!isProxyEnabled || !isProxyUrlValid()) return undefined;
  
  const proxyUrl = UNIFIED_PROXY_URL || SANITY_CDN_PROXY_URL;
  if (!proxyUrl) return undefined;
  
  try {
    const url = new URL(proxyUrl);
    return url.hostname;
  } catch {
    return undefined;
  }
}

// Export configuration summary for debugging
export function getProxyConfig() {
  return {
    enabled: isProxyEnabled,
    proxyUrlValid: isProxyUrlValid(),
    unifiedProxy: UNIFIED_PROXY_URL,
    sanityCdn: getSanityCDNUrl(),
    sanityApi: getSanityAPIProxyUrl() || 'using default',
    medusa: getMedusaBackendUrl(),
    proxyHostname: getProxyHostname() || 'not set',
  };
}

// Log proxy config on load (in development and production for debugging)
if (typeof window !== 'undefined') {
  console.log('[Proxy Config]', getProxyConfig());
  
  if (!isProxyUrlValid()) {
    console.warn(
      '⚠️ Proxy is enabled but URL is not configured!\n' +
      'Please deploy the Cloudflare Worker and update lib/proxy.config.ts:\n' +
      '1. Deploy cloudflare/unified-proxy.js to Cloudflare Workers\n' +
      '2. Replace YOUR-SUBDOMAIN in lib/proxy.config.ts with your actual subdomain'
    );
  }
}
