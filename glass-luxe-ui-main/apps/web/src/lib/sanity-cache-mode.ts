/**
 * Runtime cache mode switch (code-level, not env-driven).
 *
 * - "cache-only": never call API/proxy; throw on cache miss
 * - "cache-first": use cache, fallback to API/proxy on miss
 * - "api-only": bypass cache and always call API/proxy
 */
export type SanityCacheMode = "cache-only" | "cache-first" | "api-only";

/**
 * Toggle this value anytime you want in code.
 */
export const SANITY_CACHE_MODE: SanityCacheMode = "cache-only";

