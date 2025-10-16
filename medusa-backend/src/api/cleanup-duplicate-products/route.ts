import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { IProductModuleService } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

/**
 * Cleanup duplicate products (specifically "Premium Wireless Headphones Pro")
 * POST /cleanup-duplicate-products
 * 
 * No authentication required - for cleanup only
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const productModuleService: IProductModuleService = req.scope.resolve(Modules.PRODUCT);

    // Find all products with "Premium Wireless Headphones" in the title
    const [products, count] = await productModuleService.listAndCountProducts({
      title: {
        $like: "%Premium Wireless Headphones%"
      }
    });

    console.log(`Found ${count} duplicate products to delete`);

    const deletedIds: string[] = [];
    
    for (const product of products) {
      try {
        await productModuleService.deleteProducts(product.id);
        deletedIds.push(product.id);
        console.log(`✅ Deleted: ${product.title} (${product.id})`);
      } catch (error: any) {
        console.error(`❌ Failed to delete ${product.id}:`, error.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: `Deleted ${deletedIds.length} duplicate products`,
      deleted_count: deletedIds.length,
      deleted_ids: deletedIds,
    });
  } catch (error: any) {
    console.error("❌ Cleanup error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
      details: error.stack,
    });
  }
};

