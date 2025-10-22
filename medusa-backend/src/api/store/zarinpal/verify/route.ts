import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";

/**
 * POST /store/zarinpal/verify
 * Verifies a Zarinpal payment after customer returns from payment gateway
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { authority, Status, cart_id, order_id } = req.body;

    if (!authority) {
      res.status(400).json({
        error: "Missing authority parameter",
      });
      return;
    }

    // Get payment module
    const paymentModuleService = req.scope.resolve(Modules.PAYMENT);
    
    // Get cart or order module
    const cartModuleService = req.scope.resolve(Modules.CART);

    let resourceId = cart_id || order_id;
    let cart;

    if (cart_id) {
      // Retrieve the cart
      cart = await cartModuleService.retrieveCart(cart_id, {
        relations: ["payment_collection", "payment_collection.payment_sessions"],
      });

      if (!cart) {
        res.status(404).json({
          error: "Cart not found",
        });
        return;
      }

      resourceId = cart.id;
    }

    // Find the Zarinpal payment session
    const paymentCollection = (cart as any)?.payment_collection;
    
    if (!paymentCollection) {
      res.status(400).json({
        error: "No payment collection found for this cart",
      });
      return;
    }

    const zarinpalSession = paymentCollection.payment_sessions?.find(
      (session: any) => session.provider_id === "zarinpal"
    );

    if (!zarinpalSession) {
      res.status(400).json({
        error: "No Zarinpal payment session found",
      });
      return;
    }

    // Authorize the payment with Zarinpal
    const authorizedData = await paymentModuleService.authorizePaymentSession(
      zarinpalSession.id,
      {
        authority,
        Status,
      }
    );

    if (!authorizedData || authorizedData.error) {
      res.status(400).json({
        error: authorizedData?.error || "Payment authorization failed",
        detail: authorizedData,
      });
      return;
    }

    // Payment verified successfully
    res.json({
      success: true,
      message: "Payment verified successfully",
      data: {
        ref_id: authorizedData.ref_id,
        card_pan: authorizedData.card_pan,
        cart_id: resourceId,
      },
    });
  } catch (error: any) {
    console.error("Zarinpal verify error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
}

