import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { Modules } from "@medusajs/framework/utils";
import { ICartModuleService, IOrderModuleService, IPaymentModuleService } from "@medusajs/framework/types";
import { applyCorsHeaders, handleCorsPreflight } from "../../../../middleware/global-cors";

/**
 * Complete Order from Cart
 * POST /store/cart/complete
 * 
 * Body:
 * {
 *   "cart_id": "cart_123",
 *   "authority": "zarinpal_authority",
 *   "status": "OK"
 * }
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  // Apply CORS headers
  applyCorsHeaders(req, res);
  
  // Handle preflight requests
  if (handleCorsPreflight(req, res)) {
    return;
  }
  
  try {
    const body = req.body as {
      cart_id: string;
      authority?: string;
      status?: string;
    };

    const { cart_id, authority, status } = body;

    if (!cart_id) {
      return res.status(400).json({
        success: false,
        error: "Cart ID is required"
      });
    }

    const cartModuleService: ICartModuleService = req.scope.resolve(Modules.CART);
    const orderModuleService: IOrderModuleService = req.scope.resolve(Modules.ORDER);
    const paymentModuleService: IPaymentModuleService = req.scope.resolve(Modules.PAYMENT);

    // Retrieve the cart with all relations
    const cart = await cartModuleService.retrieveCart(cart_id, {
      relations: [
        "items", 
        "items.variant", 
        "items.variant.product"
      ]
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        error: "Cart not found"
      });
    }

    // For now, we'll skip payment verification and just complete the cart
    // In a real implementation, you would verify the payment here
    
    // Complete the cart to create an order
    // Note: In Medusa v2, we need to use the order module to create an order from cart
    const order = await orderModuleService.createOrders({
      email: cart.email,
      currency_code: cart.currency_code,
      region_id: cart.region_id,
      items: cart.items?.map((item: any) => ({
        variant_id: item.variant_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        title: item.variant?.product?.title || "Unknown Product"
      })) || []
    });

    res.status(200).json({
      success: true,
      message: "Order completed successfully",
      order: {
        id: order.id,
        display_id: order.display_id,
        status: order.status,
        email: order.email,
        currency_code: order.currency_code,
        total: order.total,
        subtotal: order.subtotal,
        tax_total: order.tax_total,
        shipping_total: order.shipping_total,
        items: order.items?.map((item: any) => ({
          id: item.id,
          quantity: item.quantity,
          title: item.variant?.product?.title || "Unknown Product",
          price: item.unit_price || 0,
          total: (item.unit_price || 0) * item.quantity
        })) || [],
        created_at: order.created_at,
        updated_at: order.updated_at
      }
    });

  } catch (error: any) {
    console.error("Error completing order:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
};

export const OPTIONS = async (req: MedusaRequest, res: MedusaResponse) => {
  applyCorsHeaders(req, res);
  res.status(200).end();
};
