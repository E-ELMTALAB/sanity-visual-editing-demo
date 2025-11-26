import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { IProductModuleService } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

/**
 * Delete a product by ID (unauthenticated endpoint for sync operations)
 * POST /delete-sample-product
 * Body: { productId: string }
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const { productId } = req.body as { productId: string };

    if (!productId) {
      return res.status(400).json({
        success: false,
        error: "Missing productId in request body",
      });
    }

    const productModuleService: IProductModuleService = req.scope.resolve(Modules.PRODUCT);

    // Check if product exists
    try {
      await productModuleService.retrieveProduct(productId);
    } catch (error) {
      return res.status(404).json({
        success: false,
        error: `Product not found: ${productId}`,
      });
    }

    // Delete the product
    await productModuleService.deleteProducts([productId]);

    console.log(`✅ Deleted product: ${productId}`);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      productId,
    });
  } catch (error: any) {
    console.error("❌ Delete product error:", error);

    return res.status(500).json({
      success: false,
      error: error.message || "Failed to delete product",
      details: error.stack,
    });
  }
};









