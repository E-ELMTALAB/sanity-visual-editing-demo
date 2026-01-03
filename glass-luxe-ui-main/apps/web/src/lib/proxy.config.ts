/**
 * Cloudflare Proxy Configuration for Glass Luxe UI
 * 
 * This file centralizes all proxy URLs for bypassing internet filtering in Iran.
 * The proxy handles both Sanity CDN (images) and Medusa backend API.
 * 
 * IMPORTANT: Keep all credentials hardcoded - they are safe in this codebase.
 */

// ============================================================================
// CONFIGURATION - HARDCODED PROXY WORKER URL
// ============================================================================

// PROXY IS ALWAYS ENABLED for Iran filtering bypass
export const PROXY_ENABLED = true;

// Hardcoded Cloudflare Worker URL - deploy the worker in cloudflare-worker/unified-proxy.js
export const UNIFIED_PROXY_URL = 'https://jaeshproxy.elmtalabx.workers.dev';

// ============================================================================
// SERVICE CONFIGURATION
// ============================================================================

// Sanity Configuration
export const SANITY_PROJECT_ID = 'zrvdkcjy';
export const SANITY_DATASET = 'production';
export const SANITY_API_VERSION = '2023-06-21';

// Original service URLs (used by proxy worker to forward requests)
export const ORIGINAL_SANITY_CDN = 'https://cdn.sanity.io';
export const ORIGINAL_SANITY_API = `https://${SANITY_PROJECT_ID}.apicdn.sanity.io`;
export const ORIGINAL_MEDUSA_BACKEND = 'https://backend.sharifgpt.com';

// Medusa publishable key
export const MEDUSA_PUBLISHABLE_KEY = 'pk_2243c4f7a1f70eb2bb9b354ad7b22be869fca2633214edd7ee70637412a67bd4';

// ============================================================================
// PROXY URL GETTERS
// ============================================================================

/**
 * Get the Sanity CDN URL (for images)
 * Routes through: {proxy}/cdn/* → cdn.sanity.io/*
 */
export function getSanityCDNUrl(): string {
  if (!PROXY_ENABLED) return ORIGINAL_SANITY_CDN;
  return `${UNIFIED_PROXY_URL}/cdn`;
}

/**
 * Get the Sanity API URL (for GROQ queries)
 * Routes through: {proxy}/api/* → {projectId}.apicdn.sanity.io/*
 */
export function getSanityAPIUrl(): string {
  if (!PROXY_ENABLED) return ORIGINAL_SANITY_API;
  return `${UNIFIED_PROXY_URL}/api`;
}

/**
 * Get the Medusa backend URL
 * Routes through: {proxy}/medusa/* → backend.sharifgpt.com/*
 */
export function getMedusaBackendUrl(): string {
  if (!PROXY_ENABLED) return ORIGINAL_MEDUSA_BACKEND;
  return `${UNIFIED_PROXY_URL}/medusa`;
}

/**
 * Transform a Sanity CDN URL to use the proxy
 * Converts: https://cdn.sanity.io/images/... → {proxy}/cdn/images/...
 */
export function proxySanityCDNUrl(originalUrl: string): string {
  if (!PROXY_ENABLED || !originalUrl) return originalUrl;
  
  // Handle various CDN URL patterns
  if (originalUrl.startsWith(ORIGINAL_SANITY_CDN)) {
    return originalUrl.replace(ORIGINAL_SANITY_CDN, getSanityCDNUrl());
  }
  
  // Already proxied or not a Sanity URL
  return originalUrl;
}

/**
 * Transform a direct image path to proxied URL
 * Converts: /images/zrvdkcjy/... → {proxy}/cdn/images/zrvdkcjy/...
 */
export function proxyImagePath(imagePath: string): string {
  if (!PROXY_ENABLED || !imagePath) return imagePath;
  
  // If it's already a full URL, proxy it
  if (imagePath.startsWith('http')) {
    return proxySanityCDNUrl(imagePath);
  }
  
  // If it's a relative path like /images/..., prepend proxy CDN
  if (imagePath.startsWith('/images/') || imagePath.startsWith('/files/')) {
    return `${getSanityCDNUrl()}${imagePath}`;
  }
  
  return imagePath;
}

// ============================================================================
// DEBUGGING HELPERS
// ============================================================================

/**
 * Get proxy configuration summary for debugging
 */
export function getProxyConfig() {
  return {
    enabled: PROXY_ENABLED,
    unifiedProxy: UNIFIED_PROXY_URL,
    sanityCdn: getSanityCDNUrl(),
    sanityApi: getSanityAPIUrl(),
    medusa: getMedusaBackendUrl(),
    sanityProjectId: SANITY_PROJECT_ID,
    sanityDataset: SANITY_DATASET,
  };
}

// Log proxy config on load (in browser environment)
if (typeof window !== 'undefined') {
  console.log('[Proxy Config] Glass Luxe UI Proxy Configuration:', getProxyConfig());
}

