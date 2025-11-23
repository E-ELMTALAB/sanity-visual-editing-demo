import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { applyCorsHeaders, handleCorsPreflight } from "../../../../middleware/global-cors";

/**
 * Batch Fetch Product Prices
 * POST /store/products/batch-prices
 *
 * Request Body:
 * {
 *   "handles": ["product-1", "product-2", "product-3"],
 *   "include_variants": true
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "product-1": {
 *       "product_id": "prod_xxx",
 *       "variants": [
 *         {
 *           "variant_id": "variant_xxx",
 *           "name": "Basic Plan",
 *           "price": 1000,  // In Tomans
 *           "price_rials": 10000,  // In Rials
 *           "currency": "IRT"
 *         }
 *       ]
 *     }
 *   }
 * }
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  // Apply CORS headers
  applyCorsHeaders(req, res);

  // Handle preflight requests
  if (handleCorsPreflight(req, res)) {
    return;
  }

  try {
    const body = req.body as {
      handles: string[];
      include_variants?: boolean;
    };

    const { handles, include_variants = true } = body;

    if (!handles || !Array.isArray(handles) || handles.length === 0) {
      return res.status(400).json({
        success: false,
        error: "handles array is required and cannot be empty"
      });
    }

    // Limit batch size to prevent abuse
    if (handles.length > 50) {
      return res.status(400).json({
        success: false,
        error: "Maximum 50 products can be fetched at once"
      });
    }

    // Using direct API calls instead of service methods for reliability

    console.log(`[BATCH-PRICES] ========== FETCHING ${handles.length} PRODUCTS ==========`);
    console.log(`[BATCH-PRICES] Handles:`, handles);

    // Simple approach: Use the same pattern as the working frontend code
    // Make individual requests but in parallel for better performance
    console.log(`[BATCH-PRICES] Making ${handles.length} parallel requests...`);

    const productPromises = handles.map(async (handle) => {
      try {
        // Use the same approach as the working frontend fallback code
        // Make direct API call to get products with variants and prices
        const backend = process.env.MEDUSA_BACKEND_URL || 'https://backend.sharifgpt.com';
        const publishableKey = process.env.MEDUSA_PUBLISHABLE_API_KEY || 'pk_2243c4f7a1f70eb2bb9b354ad7b22be869fca2633214edd7ee70637412a67bd4';

        const url = `${backend}/store/products?handle=${handle}&fields=id,variants.id,variants.title,variants.sku,variants.prices.amount,variants.prices.currency_code`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-publishable-api-key': publishableKey,
          },
        });

        if (!response.ok) {
          console.warn(`[BATCH-PRICES] API call failed for ${handle}: ${response.status}`);
          return { handle, products: [] };
        }

        const data = await response.json();
        const products = data.products || [];

        return { handle, products };
      } catch (error) {
        console.warn(`[BATCH-PRICES] Failed to fetch product ${handle}:`, error);
        return { handle, products: [] };
      }
    });

    const results = await Promise.all(productPromises);

    const prices: Record<string, any> = {};

    // Process results and organize by handle
    for (const result of results) {
      const { handle, products } = result;

      if (!products || products.length === 0) {
        console.warn(`[BATCH-PRICES] No products found for handle: ${handle}`);
        prices[handle] = { product_id: '', variants: [] };
        continue;
      }

      const product = products[0];
      const variants = product.variants || [];

      prices[handle] = {
        product_id: product.id,
        variants: variants.map((variant: any) => {
          // Find IRR (Iranian Rial) price
          const irrPrice = variant.prices?.find((p: any) => p.currency_code === 'irr' || p.currency_code === 'IRR');

          if (!irrPrice) {
            console.warn(`[BATCH-PRICES] No IRR price found for variant ${variant.id} (${handle})`);
            return {
              variant_id: variant.id,
              name: variant.title,
              price: 0,
              price_rials: 0,
              currency: 'IRT',
              sku: variant.sku
            };
          }

          const priceInRials = irrPrice.amount || 0;
          const priceInToman = Math.round(priceInRials / 10);

          return {
            variant_id: variant.id,
            name: variant.title,
            sku: variant.sku,
            price: priceInToman, // Tomans
            price_rials: priceInRials, // Rials
            currency: 'IRT'
          };
        }).filter(v => v.price > 0) // Only include variants with valid prices
      };

      console.log(`[BATCH-PRICES] Processed ${handle}: ${prices[handle].variants.length} variants`);
    }

    const successfulFetches = Object.values(prices).filter((p: any) =>
      p.product_id && p.variants.length > 0
    ).length;

    console.log(`[BATCH-PRICES] Successfully fetched prices for ${successfulFetches}/${handles.length} products`);
    console.log(`[BATCH-PRICES] =========================================`);

    res.status(200).json({
      success: true,
      data: prices,
      meta: {
        requested: handles.length,
        found: successfulFetches,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error("[BATCH-PRICES] Error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
};

export const OPTIONS = async (req: MedusaRequest, res: MedusaResponse) => {
  applyCorsHeaders(req, res);
  res.status(200).end();
};
