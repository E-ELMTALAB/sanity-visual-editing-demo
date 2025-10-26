import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";

/**
 * GET /store/zarinpal/status?cart_id=xxx
 * Check the status of a Zarinpal payment session
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { cart_id } = req.query;

    if (!cart_id) {
      res.status(400).json({
        error: "Missing cart_id parameter",
      });
      return;
    }

    // Get cart module
    const cartModuleService = req.scope.resolve(Modules.CART);

    // Retrieve the cart with payment sessions
    const cart = await cartModuleService.retrieveCart(cart_id as string, {
      relations: ["payment_collection", "payment_collection.payment_sessions"],
    });

    if (!cart) {
      res.status(404).json({
        error: "Cart not found",
      });
      return;
    }

    // Find the Zarinpal payment session
    const paymentCollection = (cart as any).payment_collection;
    
    if (!paymentCollection) {
      res.status(400).json({
        error: "No payment collection found for this cart",
      });
      return;
    }

    const zarinpalSession = paymentCollection.payment_sessions?.find(
      (session: any) => session.provider_id === "pp_zarinpal_zarinpal"
    );

    if (!zarinpalSession) {
      res.status(404).json({
        error: "No Zarinpal payment session found",
      });
      return;
    }

    res.json({
      success: true,
      payment_session: {
        id: zarinpalSession.id,
        status: zarinpalSession.status,
        data: zarinpalSession.data,
        amount: zarinpalSession.amount,
        currency_code: zarinpalSession.currency_code,
      },
    });
  } catch (error: any) {
    console.error("Zarinpal status check error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
}

