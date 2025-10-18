import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { IProductModuleService } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

/**
 * Update product endpoint (from Sanity sync)
 * POST /update-sample-product
 * 
 * No authentication required - accepts product data from request body
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const productModuleService: IProductModuleService = req.scope.resolve(Modules.PRODUCT);

    // Get product data from request body (from Sanity sync)
    const body = req.body as any;
    
    if (!body.productId) {
      return res.status(400).json({
        success: false,
        error: "Product ID is required for updates",
      });
    }

    // Build product update data from request
    const status = body.status || "published";
    const productData: any = {
      title: body.title,
      subtitle: body.subtitle,
      description: body.description,
      handle: body.handle,
      status: status as "draft" | "published",
      thumbnail: body.thumbnail,
      metadata: body.metadata || {},
    };

    // Add images if provided - format them correctly for Medusa v2
    if (body.images && Array.isArray(body.images) && body.images.length > 0) {
      productData.images = body.images.map((url: string, index: number) => ({
        url,
        position: index,
      }));
    }

    // Update the product
    const updatedProduct = await productModuleService.updateProducts(body.productId, productData);
    const product = Array.isArray(updatedProduct) ? updatedProduct[0] : updatedProduct;

    console.log("✅ Product updated:", product.id);

    // Update variants with new prices
    if (body.variants && Array.isArray(body.variants) && body.variants.length > 0) {
      // Get existing variants
      const existingProduct = await productModuleService.retrieveProduct(product.id, {
        relations: ["variants"],
      });

      // Update existing variants or create new ones
      for (let i = 0; i < body.variants.length; i++) {
        const variantData = body.variants[i];
        const existingVariant = existingProduct.variants?.[i];

        try {
          if (existingVariant) {
            // Update existing variant
            const updatePayload: any = {
              title: variantData.title || product.title,
              sku: variantData.sku,
              inventory_quantity: variantData.inventory_quantity || 0,
              metadata: {
                ...existingVariant.metadata,
                ...variantData.metadata,
                prices: JSON.stringify(variantData.prices || []),
              },
            };

            if (variantData.options) {
              updatePayload.options = variantData.options;
            }

            await productModuleService.updateProductVariants(existingVariant.id, updatePayload);
            console.log(`✅ Variant updated: ${existingVariant.id} with price ${variantData.prices?.[0]?.amount || 0} cents`);
          } else {
            // Create new variant
            const createPayload: any = {
              product_id: product.id,
              title: variantData.title || product.title,
              sku: variantData.sku,
              inventory_quantity: variantData.inventory_quantity || 0,
              manage_inventory: true,
              allow_backorder: false,
              metadata: {
                ...variantData.metadata,
                prices: JSON.stringify(variantData.prices || []),
              },
            };

            if (variantData.options) {
              createPayload.options = variantData.options;
            }

            const newVariants = await productModuleService.createProductVariants(createPayload);
            const newVariant = Array.isArray(newVariants) ? newVariants[0] : newVariants;
            console.log(`✅ New variant created: ${newVariant.id} with price ${variantData.prices?.[0]?.amount || 0} cents`);
          }
        } catch (error: any) {
          console.error(`❌ Failed to update/create variant: ${error.message}`);
        }
      }
    }

    // Fetch the complete product
    const completeProduct = await productModuleService.retrieveProduct(product.id, {
      relations: ["variants", "images", "options", "tags"],
    });

    console.log(`✅ Product updated from Sanity: ${completeProduct.title} (${completeProduct.id})`);

    return res.status(200).json({
      success: true,
      message: "✅ Product updated from Sanity data",
      product: {
        id: completeProduct.id,
        title: completeProduct.title,
        subtitle: completeProduct.subtitle,
        description: completeProduct.description,
        handle: completeProduct.handle,
        status: completeProduct.status,
        thumbnail: completeProduct.thumbnail,
        images: completeProduct.images,
        options: completeProduct.options,
        variants: completeProduct.variants,
        tags: completeProduct.tags,
        metadata: completeProduct.metadata,
        updated_at: completeProduct.updated_at,
      },
      admin_url: `${process.env.BACKEND_URL || "https://backend-production-ea59.up.railway.app"}/app/products/${completeProduct.id}`,
      store_url: `${process.env.BACKEND_URL || "https://backend-production-ea59.up.railway.app"}/store/products/${completeProduct.handle}`,
    });
  } catch (error: any) {
    console.error("❌ Product update error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
      details: error.stack,
      hint: "Check the Railway logs for more details",
    });
  }
};

