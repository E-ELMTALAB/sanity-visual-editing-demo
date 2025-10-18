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

