import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { IProductModuleService } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

/**
 * Test Product Creation Endpoint
 * POST /store/test-create
 * 
 * Body:
 * {
 *   "title": "Test Product",
 *   "description": "This is a test product",
 *   "price": 2999
 * }
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const { title, description, price = 1000 } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        error: "Title is required"
      });
    }

    const productModuleService: IProductModuleService = req.scope.resolve(Modules.PRODUCT);

    // Create a test product
    const product = await productModuleService.createProducts({
      title: title || "Test Product " + Date.now(),
      description: description || "Created via test endpoint",
      status: "draft",
      handle: `test-${Date.now()}`,
      is_giftcard: false,
      discountable: true,
    });

    res.status(201).json({
      success: true,
      message: "Test product created successfully",
      product: {
        id: product.id,
        title: product.title,
        description: product.description,
        status: product.status,
        handle: product.handle,
        created_at: product.created_at
      },
      note: "This is a draft product. You can view it in the admin dashboard."
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
};

