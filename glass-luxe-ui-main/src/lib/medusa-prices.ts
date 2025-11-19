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
  const backend = import.meta.env.VITE_MEDUSA_BACKEND_URL || 'https://backend.sharifgpt.com';
  const publishableKey = import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY || 'pk_2243c4f7a1f70eb2bb9b354ad7b22be869fca2633214edd7ee70637412a67bd4';
  
  const prices: Record<string, ProductPrices> = {};
  
  for (const slug of slugs) {
    try {
      const response = await fetch(
        `${backend}/store/products?handle=${slug}&fields=*variants.prices`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-publishable-api-key': publishableKey,
          },
        }
      );
      
      if (!response.ok) {
        console.warn(`[MEDUSA-PRICES] Product not found: ${slug}`);
        prices[slug] = { product_id: '', variants: [] };
        continue;
      }
      
      const data = await response.json();
      const products = data.products || [];
      
      if (products.length === 0) {
        console.warn(`[MEDUSA-PRICES] No products returned for slug: ${slug}`);
        prices[slug] = { product_id: '', variants: [] };
        continue;
      }
      
      const product = products[0];
      const variants = product.variants || [];
      
      prices[slug] = {
        product_id: product.id,
        variants: variants.map((variant: any) => {
          const irrPrice = variant.prices?.find((p: any) => p.currency_code === 'irr');
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
        }),
      };
    } catch (error: any) {
      console.error(`[MEDUSA-PRICES] Error fetching price for ${slug}:`, error.message);
      prices[slug] = { product_id: '', variants: [] };
    }
  }
  
  return prices;
}

