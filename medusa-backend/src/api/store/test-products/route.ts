import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { IProductModuleService } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

/**
 * Test Products Endpoint
 * GET /store/test-products
 * 
 * Query params:
 * - limit: number of products to return (default: 10)
 * - offset: pagination offset (default: 0)
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    
    const productModuleService: IProductModuleService = req.scope.resolve(Modules.PRODUCT);
    
    // Get products with details
    const products = await productModuleService.listProducts({
      take: Number(limit),
      skip: Number(offset)
    });

    // Get total count
    const [, count] = await productModuleService.listAndCountProducts();

    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      pagination: {
        total: count,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: count > (Number(offset) + products.length)
      },
      products: products.map(product => ({
        id: product.id,
        title: product.title,
        handle: product.handle,
        description: product.description,
        status: product.status,
        thumbnail: product.thumbnail,
        tags: product.tags,
        type: product.type,
        collection: product.collection,
        categories: product.categories,
        variants: product.variants?.map(v => ({
          id: v.id,
          title: v.title,
          sku: v.sku,
          prices: v.prices
        })) || [],
        images: product.images || [],
        created_at: product.created_at,
        updated_at: product.updated_at
      }))
    };

    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
};

