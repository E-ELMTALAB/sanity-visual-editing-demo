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
          
          medusaProduct = await productModuleService.createProducts({
            title: sanityProduct.name,
            description: sanityProduct.description || '',
            handle: handle,
            status: "published",
            is_giftcard: false,
            discountable: true,
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
          // Step 1: Get or create product option (e.g., "Subscription Duration")
          let productOption;
          const existingProduct = await productModuleService.retrieveProduct(medusaProduct.id, {
            relations: ["options", "options.values"]
          });

          if (existingProduct.options && existingProduct.options.length > 0) {
            productOption = existingProduct.options[0];
            console.log(`[SYNC] Using existing product option: ${productOption.id}`);
          } else {
            // Create product option if it doesn't exist
            productOption = await productModuleService.createProductOptions({
              title: "Subscription Duration",
              product_id: medusaProduct.id
            });
            console.log(`[SYNC] Created product option: ${productOption.id}`);
          }

          // Step 2: Create/update option values and variants
          for (const option of options) {
            try {
              const variantTitle = option.name;
              const variantSku = `${handle}-${option.id}`;
              
              // Convert Toman to Rial (1 Toman = 10 Rial)
              const priceInRials = option.price * 10;

              // Step 2a: Get or create option value
              let optionValue;
              const existingOptionValues = await productModuleService.listProductOptionValues({
                option_id: productOption.id,
                value: variantTitle
              });

              if (existingOptionValues && existingOptionValues.length > 0) {
                optionValue = existingOptionValues[0];
                console.log(`[SYNC] Using existing option value: ${optionValue.id}`);
              } else {
                optionValue = await productModuleService.createProductOptionValues({
                  option_id: productOption.id,
                  value: variantTitle
                });
                console.log(`[SYNC] Created option value: ${optionValue.id} = ${variantTitle}`);
              }

              // Step 2b: Check if variant exists
              const existingVariants = await productModuleService.listProductVariants({
                product_id: medusaProduct.id,
                sku: variantSku
              });

              let variant;
              
              if (existingVariants && existingVariants.length > 0) {
                // Update existing variant
                variant = existingVariants[0];
                console.log(`[SYNC] Updating variant: ${variantSku}`);
                
                // Update variant with proper option value linkage
                await productModuleService.updateProductVariants(variant.id, {
                  title: variantTitle,
                  options: {
                    [productOption.id]: optionValue.id
                  },
                  metadata: {
                    sanity_option_id: option.id,
                    price_rials: priceInRials,
                    price_toman: option.price,
                    synced_at: new Date().toISOString()
                  }
                });
              } else {
                // Create new variant with proper option value linkage
                console.log(`[SYNC] Creating variant: ${variantSku}`);
                
                variant = await productModuleService.createProductVariants({
                  product_id: medusaProduct.id,
                  title: variantTitle,
                  sku: variantSku,
                  manage_inventory: false,
                  allow_backorder: true,
                  options: {
                    [productOption.id]: optionValue.id
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
                option_value_id: optionValue.id,
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
