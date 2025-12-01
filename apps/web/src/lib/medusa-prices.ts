export interface MedusaVariant {
  variant_id: string;
  name: string;
  price: number; // In Tomans
  price_rials: number; // In Rials
  sku?: string;
  currency: string;
}

export interface ProductPrices {
  product_id: string;
  variants: MedusaVariant[];
}

// Simple localStorage cache for price data
const PRICE_CACHE_KEY = 'medusa-product-prices-cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

interface CacheEntry {
  data: Record<string, ProductPrices>;
  timestamp: number;
  slugs: string[];
}

function getCachedPrices(slugs: string[]): Record<string, ProductPrices> | null {
  try {
    const cached = localStorage.getItem(PRICE_CACHE_KEY);
    if (!cached) return null;

    const cache: CacheEntry = JSON.parse(cached);

    // Check if cache is expired
    if (Date.now() - cache.timestamp > CACHE_DURATION) {
      localStorage.removeItem(PRICE_CACHE_KEY);
      return null;
    }

    // Check if all requested slugs are in cache
    const hasAllSlugs = slugs.every(slug => cache.slugs.includes(slug));
    if (!hasAllSlugs) return null;

    console.log('[MEDUSA-PRICES] ✅ Using cached prices for:', slugs.length, 'products');
    return cache.data;
  } catch (error) {
    console.warn('[MEDUSA-PRICES] Cache read error:', error);
    return null;
  }
}

function setCachedPrices(slugs: string[], data: Record<string, ProductPrices>): void {
  try {
    const cache: CacheEntry = {
      data,
      timestamp: Date.now(),
      slugs: [...new Set(slugs)] // Remove duplicates
    };
    localStorage.setItem(PRICE_CACHE_KEY, JSON.stringify(cache));
    console.log('[MEDUSA-PRICES] 💾 Cached prices for:', slugs.length, 'products');
  } catch (error) {
    console.warn('[MEDUSA-PRICES] Cache write error:', error);
  }
}

export async function fetchProductPrices(slugs: string[]): Promise<Record<string, ProductPrices>> {
  console.log('[MEDUSA-PRICES] ========== BATCH FETCHING PRODUCT PRICES ==========');
  console.log('[MEDUSA-PRICES] Backend URL:', import.meta.env.VITE_MEDUSA_BACKEND_URL || 'https://backend.sharifgpt.com');
  console.log('[MEDUSA-PRICES] Slugs to fetch:', slugs);
  console.log('[MEDUSA-PRICES] Slugs count:', slugs.length);

  // 🚀 PERFORMANCE IMPROVEMENT: Check cache first
  const cachedPrices = getCachedPrices(slugs);
  if (cachedPrices) {
    return cachedPrices;
  }

  const backend = import.meta.env.VITE_MEDUSA_BACKEND_URL || 'https://backend.sharifgpt.com';
  const publishableKey = import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY || 'pk_2243c4f7a1f70eb2bb9b354ad7b22be869fca2633214edd7ee70637412a67bd4';

  try {
    // 🚀 PERFORMANCE IMPROVEMENT: Single batched request instead of N individual requests
    console.log('[MEDUSA-PRICES] Making single batched request for all products...');

    const response = await fetch(`${backend}/store/products/batch-prices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': publishableKey,
      },
      body: JSON.stringify({
        handles: slugs,
        include_variants: true
      }),
    });

    console.log('[MEDUSA-PRICES] Batch request response status:', response.status);

    if (!response.ok) {
      throw new Error(`Batch request failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(`Batch API error: ${result.error}`);
    }

    console.log('[MEDUSA-PRICES] ✅ Batch request successful');
    console.log('[MEDUSA-PRICES] Results:', Object.keys(result.data || {}));

    const pricesData = result.data || {};

    // 🚀 PERFORMANCE IMPROVEMENT: Cache the results
    setCachedPrices(slugs, pricesData);

    console.log('[MEDUSA-PRICES] =========================================');
    return pricesData;

  } catch (error: any) {
    console.error('[MEDUSA-PRICES] ❌ Batch request failed:', error.message);
    console.error('[MEDUSA-PRICES] Falling back to individual requests...');

    // 🚨 FALLBACK: Use individual requests if batch fails
    const prices: Record<string, ProductPrices> = {};

    for (const slug of slugs) {
      try {
        console.log(`[MEDUSA-PRICES] Fallback: Fetching price for slug: ${slug}`);
        const url = `${backend}/store/products?handle=${slug}&fields=id,variants.id,variants.title,variants.prices.amount,variants.prices.currency_code`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-publishable-api-key': publishableKey,
          },
        });

        if (!response.ok) {
          console.warn(`[MEDUSA-PRICES] Product not found: ${slug}`);
          prices[slug] = { product_id: '', variants: [] };
          continue;
        }

        const data = await response.json();
        const products = data.products || [];

        if (products.length === 0) {
          prices[slug] = { product_id: '', variants: [] };
          continue;
        }

        const product = products[0];
        const variants = product.variants || [];

        prices[slug] = {
          product_id: product.id,
          variants: variants.map((variant: any) => {
            const irrPrice = variant.prices?.find((p: any) => p.currency_code === 'irr' || p.currency_code === 'IRR');
            const priceInRials = irrPrice?.amount || 0;
            const priceInToman = Math.round(priceInRials / 10);

            return {
              variant_id: variant.id,
              name: variant.title,
              sku: variant.sku,
              price: priceInToman,
              price_rials: priceInRials,
              currency: 'IRT',
            };
          }).filter(v => v.price > 0),
        };

        console.log(`[MEDUSA-PRICES] ✅ Fallback successful for ${slug}`);
      } catch (fallbackError: any) {
        console.error(`[MEDUSA-PRICES] ❌ Fallback failed for ${slug}:`, fallbackError.message);
        prices[slug] = { product_id: '', variants: [] };
      }
    }

    // 🚀 PERFORMANCE IMPROVEMENT: Cache fallback results too
    setCachedPrices(slugs, prices);

    console.log('[MEDUSA-PRICES] Final prices result (fallback):', Object.keys(prices));
    console.log('[MEDUSA-PRICES] =========================================');
    return prices;
  }
}

