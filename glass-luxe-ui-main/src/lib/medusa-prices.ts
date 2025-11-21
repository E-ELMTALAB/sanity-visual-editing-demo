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

export async function fetchProductPrices(slugs: string[]): Promise<Record<string, ProductPrices>> {
  console.log('[MEDUSA-PRICES] ========== FETCHING PRODUCT PRICES ==========');
  console.log('[MEDUSA-PRICES] Backend URL:', import.meta.env.VITE_MEDUSA_BACKEND_URL || 'https://backend.sharifgpt.com');
  console.log('[MEDUSA-PRICES] Slugs to fetch:', slugs);
  console.log('[MEDUSA-PRICES] Slugs count:', slugs.length);
  
  const backend = import.meta.env.VITE_MEDUSA_BACKEND_URL || 'https://backend.sharifgpt.com';
  const publishableKey = import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY || 'pk_2243c4f7a1f70eb2bb9b354ad7b22be869fca2633214edd7ee70637412a67bd4';

  const prices: Record<string, ProductPrices> = {};

  for (const slug of slugs) {
    try {
      console.log(`[MEDUSA-PRICES] Fetching price for slug: ${slug}`);
      const url = `${backend}/store/products?handle=${slug}&fields=*variants.prices`;
      console.log(`[MEDUSA-PRICES] Request URL: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-publishable-api-key': publishableKey,
        },
      });

      console.log(`[MEDUSA-PRICES] Response status for ${slug}:`, response.status);

      if (!response.ok) {
        console.warn(`[MEDUSA-PRICES] ⚠️ Product not found: ${slug} (Status: ${response.status})`);
        prices[slug] = { product_id: '', variants: [] };
        continue;
      }

      const data = await response.json();
      const products = data.products || [];

      console.log(`[MEDUSA-PRICES] Products found for ${slug}:`, products.length);

      if (products.length === 0) {
        console.warn(`[MEDUSA-PRICES] ⚠️ No products returned for slug: ${slug}`);
        prices[slug] = { product_id: '', variants: [] };
        continue;
      }

      const product = products[0];
      const variants = product.variants || [];

      console.log(`[MEDUSA-PRICES] Product ID for ${slug}:`, product.id);
      console.log(`[MEDUSA-PRICES] Variants count for ${slug}:`, variants.length);

      prices[slug] = {
        product_id: product.id,
        variants: variants.map((variant: any) => {
          const irrPrice = variant.prices?.find((p: any) => p.currency_code === 'irr');
          const priceInRials = irrPrice?.amount || 0;
          const priceInToman = Math.round(priceInRials / 10);

          console.log(`[MEDUSA-PRICES] Variant ${variant.id} (${slug}):`, {
            name: variant.title,
            price_rials: priceInRials,
            price_toman: priceInToman
          });

          return {
            variant_id: variant.id,
            name: variant.title,
            sku: variant.sku,
            price: priceInToman,
            price_rials: priceInRials,
            currency: 'IRT',
          };
        }),
      };
      
      console.log(`[MEDUSA-PRICES] ✅ Successfully fetched prices for ${slug}`);
    } catch (error: any) {
      console.error(`[MEDUSA-PRICES] ❌ Error fetching price for ${slug}:`, error.message);
      console.error(`[MEDUSA-PRICES] Error stack:`, error.stack);
      prices[slug] = { product_id: '', variants: [] };
    }
  }

  console.log('[MEDUSA-PRICES] Final prices result:', Object.keys(prices));
  console.log('[MEDUSA-PRICES] =========================================');
  return prices;
}

