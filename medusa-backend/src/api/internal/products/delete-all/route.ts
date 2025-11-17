import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";
import { IProductModuleService } from "@medusajs/framework/types";

/**
 * POST /internal/products/delete-all
 * Delete ALL products from Medusa (internal route, no auth required)
 * 
 * WARNING: This is destructive and irreversible!
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    console.log('[DELETE-ALL] Starting product deletion...');
    
    const productModuleService: IProductModuleService = req.scope.resolve(Modules.PRODUCT);

    // Fetch ALL products (no limit)
    const allProducts = await productModuleService.listProducts({}, { 
      take: 1000 // Large limit to get all products
    });

    console.log(`[DELETE-ALL] Found ${allProducts.length} products to delete`);

    if (allProducts.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No products to delete',
        deleted: 0
      });
    }

    const productIds = allProducts.map((p: any) => p.id);
    
    // Delete all products
    await productModuleService.deleteProducts(productIds);

    console.log(`[DELETE-ALL] Successfully deleted ${productIds.length} products`);

    res.status(200).json({
      success: true,
      message: `Deleted ${productIds.length} products successfully`,
      deleted: productIds.length,
      product_ids: productIds
    });

  } catch (error: any) {
    console.error('[DELETE-ALL] Error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};




