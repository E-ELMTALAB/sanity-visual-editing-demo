import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { Modules } from "@medusajs/framework/utils";
import { ICartModuleService, IProductModuleService } from "@medusajs/framework/types";
import { applyCorsHeaders, handleCorsPreflight } from "../../../../middleware/global-cors";

/**
 * Create Cart from Frontend Cart Data
 * POST /store/cart/create
 * 
 * Body:
 * {
 *   "items": [
 *     {
 *       "id": 1,
 *       "title": "Product Name",
 *       "price": 100000,
 *       "image": "image_url",
 *       "quantity": 2,
 *       "selectedOption": "option_name"
 *     }
 *   ],
 *   "customer_email": "customer@example.com",
 *   "customer_phone": "+989123456789"
 * }
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  // Apply CORS headers
  applyCorsHeaders(res);
  
  // Handle preflight requests
  if (handleCorsPreflight(req, res)) {
    return;
  }
  
  try {
    const body = req.body as {
      items: Array<{
        id: number;
        title: string;
        price: number;
        image: string;
        quantity: number;
        selectedOption?: string;
      }>;
      customer_email?: string;
      customer_phone?: string;
    };

    const { items, customer_email, customer_phone } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Items array is required and cannot be empty"
      });
    }

    const cartModuleService: ICartModuleService = req.scope.resolve(Modules.CART);
    const productModuleService: IProductModuleService = req.scope.resolve(Modules.PRODUCT);

    // Create a new cart
    const cart = await cartModuleService.createCarts({
      currency_code: "irr",
      email: customer_email,
      metadata: {
        customer_phone: customer_phone,
        source: "frontend_cart"
      }
    });

    // Add items to cart
    for (const item of items) {
      try {
        // Try to find existing product by title or create a new one
        let product;
        try {
          // Search for existing product by title
          const products = await productModuleService.listProducts({
            title: item.title
          });
          product = products[0];
        } catch (error) {
          console.log(`Product not found by title: ${item.title}`);
        }

        // If product doesn't exist, create it
        if (!product) {
          product = await productModuleService.createProducts({
            title: item.title,
            description: `Product: ${item.title}`,
            status: "published",
            handle: `product-${item.id}-${Date.now()}`,
            is_giftcard: false,
            discountable: true,
            metadata: {
              frontend_id: item.id,
              image_url: item.image,
              selected_option: item.selectedOption
            }
          });

          // Create a variant for the product
          await productModuleService.createProductVariants({
            product_id: product.id,
            title: item.selectedOption || "Default",
            sku: `SKU-${item.id}-${Date.now()}`,
            manage_inventory: false,
            allow_backorder: true
          });
        }

        // Get the product variant
        const variants = await productModuleService.listProductVariants({
          product_id: product.id
        });
        const variant = variants[0];

        if (!variant) {
          throw new Error(`No variant found for product: ${product.title}`);
        }

        // Add line item to cart
        await cartModuleService.addLineItems(cart.id, [{
          variant_id: variant.id,
          quantity: item.quantity,
          title: item.title,
          unit_price: item.price,
          metadata: {
            frontend_id: item.id,
            selected_option: item.selectedOption,
            image_url: item.image
          }
        }]);

      } catch (error) {
        console.error(`Error adding item ${item.title} to cart:`, error);
        // Continue with other items even if one fails
      }
    }

    // Retrieve the complete cart with relations
    const completeCart = await cartModuleService.retrieveCart(cart.id, {
      relations: ["items", "items.variant", "items.variant.product", "payment_collection"]
    });

    res.status(201).json({
      success: true,
      message: "Cart created successfully",
      cart: {
        id: completeCart.id,
        currency_code: completeCart.currency_code,
        email: completeCart.email,
        items: completeCart.items?.map((item: any) => ({
          id: item.id,
          quantity: item.quantity,
          title: item.variant?.product?.title || "Unknown Product",
          price: item.unit_price || 0,
          total: (item.unit_price || 0) * item.quantity,
          metadata: item.metadata
        })) || [],
        total: completeCart.total || 0,
        subtotal: completeCart.subtotal || 0,
        tax_total: completeCart.tax_total || 0,
        shipping_total: completeCart.shipping_total || 0,
        metadata: completeCart.metadata
      }
    });

  } catch (error: any) {
    console.error("Error creating cart:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
};

export const OPTIONS = async (req: MedusaRequest, res: MedusaResponse) => {
  applyCorsHeaders(res);
  res.status(200).end();
};
