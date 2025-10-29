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
  applyCorsHeaders(res);
  
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
        "items.variant.product", 
        "payment_collection",
        "payment_collection.payment_sessions"
      ]
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        error: "Cart not found"
      });
    }

    // If payment verification is provided, verify the payment first
    if (authority && status) {
      const paymentCollection = cart.payment_collection;
      if (!paymentCollection) {
        return res.status(400).json({
          success: false,
          error: "No payment collection found for this cart"
        });
      }

      // Find the Zarinpal payment session
      const zarinpalSession = paymentCollection.payment_sessions?.find(
        (session: any) => session.provider_id === "pp_zarinpal_zarinpal"
      );

      if (!zarinpalSession) {
        return res.status(400).json({
          success: false,
          error: "No Zarinpal payment session found"
        });
      }

      // Authorize the payment
      try {
        await paymentModuleService.authorizePaymentSession(zarinpalSession.id, {
          authority,
          Status: status
        });
      } catch (error) {
        console.error("Payment authorization failed:", error);
        return res.status(400).json({
          success: false,
          error: "Payment verification failed"
        });
      }
    }

    // Complete the cart to create an order
    const order = await cartModuleService.completeCart(cart_id);

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
  applyCorsHeaders(res);
  res.status(200).end();
};
