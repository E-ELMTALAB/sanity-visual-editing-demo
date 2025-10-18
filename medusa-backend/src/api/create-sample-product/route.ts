import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { IProductModuleService } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

/**
 * Upsert product endpoint (create or update from Sanity sync)
 * POST /create-sample-product
 * 
 * No authentication required - accepts product data from request body
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const productModuleService: IProductModuleService = req.scope.resolve(Modules.PRODUCT);

    // Get product data from request body (from Sanity sync)
    const body = req.body as any;
    
    // Build product data from request
    const status = body.status || "published";
    const productData: any = {
      title: body.title || "Untitled Product",
      subtitle: body.subtitle,
      description: body.description,
      handle: body.handle || `product-${Date.now()}`,
      status: status as "draft" | "published",
      is_giftcard: false,
      discountable: true,
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

    // Create the product
    const products = await productModuleService.createProducts(productData);
    const product = Array.isArray(products) ? products[0] : products;

    console.log("✅ Product created:", product.id);

    // Create variants with prices
    const createdVariants: any[] = [];
    if (body.variants && Array.isArray(body.variants) && body.variants.length > 0) {
      for (const variantData of body.variants) {
        try {
          const variantPayload: any = {
            product_id: product.id,
            title: variantData.title || product.title,
            sku: variantData.sku,
            inventory_quantity: variantData.inventory_quantity || 0,
            manage_inventory: true,
            allow_backorder: false,
            metadata: variantData.metadata || {},
          };

          // Add options if provided
          if (variantData.options) {
            variantPayload.options = variantData.options;
          }

          const variants = await productModuleService.createProductVariants(variantPayload);
          const variant = Array.isArray(variants) ? variants[0] : variants;

          // Store price information in variant metadata for now
          // In Medusa v2, proper pricing requires using the pricing module
          const variantWithPrice = {
            ...variant,
            prices: variantData.prices || [],
            metadata: {
              ...variant.metadata,
              prices: JSON.stringify(variantData.prices || []),
            }
          };

          createdVariants.push(variantWithPrice);
          console.log(`✅ Variant created: ${variant.id} with price ${variantData.prices?.[0]?.amount || 0} cents`);
        } catch (error: any) {
          console.error(`❌ Failed to create variant: ${error.message}`);
        }
      }
    }

    // Fetch the complete product
    const completeProduct = await productModuleService.retrieveProduct(product.id, {
      relations: ["variants", "images", "options", "tags"],
    });

    console.log(`✅ Product created from Sanity: ${completeProduct.title} (${completeProduct.id})`);

    return res.status(201).json({
      success: true,
      message: "✅ Product created from Sanity data",
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
        variants: createdVariants,
        tags: completeProduct.tags,
        metadata: completeProduct.metadata,
        created_at: completeProduct.created_at,
      },
      admin_url: `${process.env.BACKEND_URL || "https://backend-production-ea59.up.railway.app"}/app/products/${completeProduct.id}`,
      store_url: `${process.env.BACKEND_URL || "https://backend-production-ea59.up.railway.app"}/store/products/${completeProduct.handle}`,
    });
  } catch (error: any) {
    console.error("❌ Product creation error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
      details: error.stack,
      hint: "Check the Railway logs for more details",
    });
  }
};

