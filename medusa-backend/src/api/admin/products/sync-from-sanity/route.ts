import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";
import { IProductModuleService } from "@medusajs/framework/types";

/**
 * POST /admin/products/sync-from-sanity
 * Sync products from Sanity CMS to Medusa
 * 
 * This endpoint creates/updates Medusa products based on Sanity product data.
 * - Links products by matching Medusa handle to Sanity slug
 * - Creates variants for each product option with IRR prices
 * - Stores Sanity ID in metadata for reference
 * 
 * Body:
 * {
 *   "products": [
 *     {
 *       "_id": "sanity_product_id",
 *       "name": "Product Name",
 *       "slug": { "current": "product-slug" },
 *       "description": "Product description",
 *       "options": [
 *         { "id": "opt1", "name": "1 ماهه", "price": 100000 }
 *       ]
 *     }
 *   ]
 * }
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const body = req.body as {
      products: Array<{
        _id: string;
        name: string;
        slug: { current: string };
        description?: string;
        options?: Array<{
          id: string;
          name: string;
          price: number; // In Toman
        }>;
      }>;
    };

    const { products } = body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Products array is required"
      });
    }

    const productModuleService: IProductModuleService = req.scope.resolve(Modules.PRODUCT);
    const results = [];

    for (const sanityProduct of products) {
      try {
        const handle = sanityProduct.slug?.current;
        
        if (!handle) {
          console.error(`[SYNC] Product ${sanityProduct._id} missing slug, skipping`);
          results.push({
            sanity_id: sanityProduct._id,
            success: false,
            error: "Missing slug"
          });
          continue;
        }

        // 1. Find or create Medusa product by handle
        const existingProducts = await productModuleService.listProducts({
          handle: handle
        });

        let medusaProduct;
        
        if (existingProducts && existingProducts.length > 0) {
          // Update existing product
          medusaProduct = existingProducts[0];
          console.log(`[SYNC] Updating existing product: ${handle}`);
          
          await productModuleService.updateProducts(medusaProduct.id, {
            title: sanityProduct.name,
            description: sanityProduct.description || '',
            metadata: {
              sanity_id: sanityProduct._id,
              synced_at: new Date().toISOString()
            }
          });
        } else {
          // Create new product
          console.log(`[SYNC] Creating new product: ${handle}`);
          
          // In Medusa v2, options must be defined when creating the product
          const productOptions = sanityProduct.options && sanityProduct.options.length > 0
            ? [{
                title: "Subscription Duration",
                values: sanityProduct.options.map(opt => opt.name)
              }]
            : [];
          
          medusaProduct = await productModuleService.createProducts({
            title: sanityProduct.name,
            description: sanityProduct.description || '',
            handle: handle,
            status: "published",
            is_giftcard: false,
            discountable: true,
            options: productOptions,
            metadata: {
              sanity_id: sanityProduct._id,
              synced_at: new Date().toISOString()
            }
          });
        }

        // 2. Handle variants (product options)
        const options = sanityProduct.options || [];
        const variantResults = [];

        if (options.length === 0) {
          // No options: create single default variant
          const existingVariants = await productModuleService.listProductVariants({
            product_id: medusaProduct.id
          });

          if (!existingVariants || existingVariants.length === 0) {
            const defaultVariant = await productModuleService.createProductVariants({
              product_id: medusaProduct.id,
              title: "Default",
              sku: `${handle}-default`,
              manage_inventory: false,
              allow_backorder: true,
              metadata: {
                price_rials: 100000, // Default 10,000 Toman = 100,000 Rial
                price_toman: 10000,
                synced_at: new Date().toISOString()
              }
            });
            
            variantResults.push({
              variant_id: defaultVariant.id,
              title: "Default",
              price_toman: 10000,
              price_rial: 100000
            });
          }
        } else {
          // Get product with options and their values
          const productWithOptions = await productModuleService.retrieveProduct(medusaProduct.id, {
            relations: ["options", "options.values"]
          });

          const productOption = productWithOptions.options?.[0];

          if (!productOption) {
            console.error(`[SYNC] Product ${medusaProduct.id} has no options defined`);
            results.push({
              sanity_id: sanityProduct._id,
              success: false,
              error: "Product has no options defined"
            });
            continue;
          }

          console.log(`[SYNC] Using product option: ${productOption.title} (${productOption.id})`);

          // Create/update variants for each Sanity option
          for (const option of options) {
            try {
              const variantTitle = option.name;
              const variantSku = `${handle}-${option.id}`;
              
              // Convert Toman to Rial (1 Toman = 10 Rial)
              const priceInRials = option.price * 10;

              // Find the matching option value by name
              const matchingOptionValue = productOption.values?.find(
                (val: any) => val.value === variantTitle
              );

              if (!matchingOptionValue) {
                console.error(`[SYNC] No option value found for "${variantTitle}"`);
                variantResults.push({
                  option_id: option.id,
                  success: false,
                  error: `No option value found for "${variantTitle}"`
                });
                continue;
              }

              console.log(`[SYNC] Using option value: ${matchingOptionValue.value} (${matchingOptionValue.id})`);

              // Check if variant exists
              const existingVariants = await productModuleService.listProductVariants({
                product_id: medusaProduct.id,
                sku: variantSku
              });

              let variant;
              
              if (existingVariants && existingVariants.length > 0) {
                // Update existing variant
                variant = existingVariants[0];
                console.log(`[SYNC] Updating variant: ${variantSku}`);
                
                // Update variant metadata (price)
                await productModuleService.updateProductVariants(variant.id, {
                  title: variantTitle,
                  metadata: {
                    sanity_option_id: option.id,
                    price_rials: priceInRials,
                    price_toman: option.price,
                    synced_at: new Date().toISOString()
                  }
                });
              } else {
                // Create new variant linked to option value
                console.log(`[SYNC] Creating variant: ${variantSku}`);
                
                variant = await productModuleService.createProductVariants({
                  product_id: medusaProduct.id,
                  title: variantTitle,
                  sku: variantSku,
                  manage_inventory: false,
                  allow_backorder: true,
                  options: {
                    [productOption.id]: variantTitle
                  },
                  metadata: {
                    sanity_option_id: option.id,
                    price_rials: priceInRials,
                    price_toman: option.price,
                    synced_at: new Date().toISOString()
                  }
                });
              }

              variantResults.push({
                variant_id: variant.id,
                title: variantTitle,
                sku: variantSku,
                option_value_id: matchingOptionValue.id,
                price_toman: option.price,
                price_rial: priceInRials
              });
            } catch (variantError: any) {
              console.error(`[SYNC] Error processing variant ${option.id}:`, variantError);
              variantResults.push({
                option_id: option.id,
                success: false,
                error: variantError.message
              });
            }
          }
        }

        results.push({
          sanity_id: sanityProduct._id,
          medusa_id: medusaProduct.id,
          handle: handle,
          success: true,
          variants: variantResults
        });

      } catch (productError: any) {
        console.error(`[SYNC] Error processing product ${sanityProduct._id}:`, productError);
        results.push({
          sanity_id: sanityProduct._id,
          success: false,
          error: productError.message
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.length - successCount;

    res.status(200).json({
      success: true,
      message: `Synced ${successCount} products successfully, ${failureCount} failed`,
      results: results
    });

  } catch (error: any) {
    console.error("[SYNC] Error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
};

export const OPTIONS = async (req: MedusaRequest, res: MedusaResponse) => {
  res.status(200).end();
};
