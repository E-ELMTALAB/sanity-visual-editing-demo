import { getMedusaBackendUrl, MEDUSA_PUBLISHABLE_KEY } from './proxy.config'

export interface MedusaVariant {
  variant_id: string;
  name: string;
  price: number; // In Tomans (current/discounted price)
  price_rials: number; // In Rials
  original_price?: number; // Original price in Tomans (before discount)
  original_price_rials?: number; // Original price in Rials
  sku?: string;
  currency: string;
  // Promotion info if applicable
  has_promotion?: boolean;
  discount_percentage?: number;
  promotion_ends_at?: string; // ISO date string
}

export interface ProductPrices {
  product_id: string;
  variants: MedusaVariant[];
  // Product-level promotion info
  has_active_promotion?: boolean;
  promotion_ends_at?: string; // ISO date string for the earliest ending promotion
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

    console.log('[MEDUSA-PRICES] Using cached prices for:', slugs.length, 'products');
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
    console.log('[MEDUSA-PRICES] Cached prices for:', slugs.length, 'products');
  } catch (error) {
    console.warn('[MEDUSA-PRICES] Cache write error:', error);
  }
}

/**
 * Fetch product prices from Medusa backend
 * Routes through Cloudflare proxy when enabled for Iran filtering bypass
 */
export async function fetchProductPrices(slugs: string[]): Promise<Record<string, ProductPrices>> {
  const backend = getMedusaBackendUrl();
  const publishableKey = import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY || MEDUSA_PUBLISHABLE_KEY;
  
  console.log('[MEDUSA-PRICES] ========== BATCH FETCHING PRODUCT PRICES ==========');
  console.log('[MEDUSA-PRICES] Backend URL:', backend);
  console.log('[MEDUSA-PRICES] Slugs to fetch:', slugs);
  console.log('[MEDUSA-PRICES] Slugs count:', slugs.length);

  // PERFORMANCE IMPROVEMENT: Check cache first
  const cachedPrices = getCachedPrices(slugs);
  if (cachedPrices) {
    return cachedPrices;
  }

  try {
    // PERFORMANCE IMPROVEMENT: Single batched request instead of N individual requests
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

    console.log('[MEDUSA-PRICES] Batch request successful');
    console.log('[MEDUSA-PRICES] Results:', Object.keys(result.data || {}));

    const pricesData = result.data || {};

    // PERFORMANCE IMPROVEMENT: Cache the results
    setCachedPrices(slugs, pricesData);

    console.log('[MEDUSA-PRICES] =========================================');
    return pricesData;

  } catch (error: any) {
    console.error('[MEDUSA-PRICES] Batch request failed:', error.message);
    console.error('[MEDUSA-PRICES] Falling back to individual requests...');

    // FALLBACK: Use individual requests if batch fails
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
            
            // Check for calculated_price (when promotions are applied by Medusa)
            const calculatedPrice = variant.calculated_price;
            const originalPriceRials = calculatedPrice?.original_amount || priceInRials;
            const originalPriceToman = Math.round(originalPriceRials / 10);
            const hasPromotion = calculatedPrice && calculatedPrice.calculated_amount !== calculatedPrice.original_amount;
            const discountPercentage = hasPromotion && originalPriceToman > 0
              ? Math.round(((originalPriceToman - priceInToman) / originalPriceToman) * 100)
              : undefined;

            return {
              variant_id: variant.id,
              name: variant.title,
              sku: variant.sku,
              price: priceInToman,
              price_rials: priceInRials,
              original_price: hasPromotion ? originalPriceToman : undefined,
              original_price_rials: hasPromotion ? originalPriceRials : undefined,
              currency: 'IRT',
              has_promotion: hasPromotion,
              discount_percentage: discountPercentage,
            };
          }).filter((v: MedusaVariant) => v.price > 0),
        };

        console.log(`[MEDUSA-PRICES] Fallback successful for ${slug}`);
      } catch (fallbackError: any) {
        console.error(`[MEDUSA-PRICES] Fallback failed for ${slug}:`, fallbackError.message);
        prices[slug] = { product_id: '', variants: [] };
      }
    }

    // PERFORMANCE IMPROVEMENT: Cache fallback results too
    setCachedPrices(slugs, prices);

    console.log('[MEDUSA-PRICES] Final prices result (fallback):', Object.keys(prices));
    console.log('[MEDUSA-PRICES] =========================================');
    return prices;
  }
}
