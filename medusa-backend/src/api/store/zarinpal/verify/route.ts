import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";
import { applyCorsHeaders, handleCorsPreflight } from "../../../../middleware/global-cors";

/**
 * POST /store/zarinpal/verify
 * Verifies a Zarinpal payment after customer returns from payment gateway
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  // Apply CORS headers
  applyCorsHeaders(req, res);
  
  // Handle preflight requests
  if (handleCorsPreflight(req, res)) {
    return;
  }
  
  try {
    const body = (req.body || {}) as {
      authority?: string
      Status?: string
      cart_id?: string
      order_id?: string
    }
    const { authority, Status, cart_id, order_id } = body;

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
        relations: [
          "payment_collection",
          "payment_collection.payment_sessions",
          "items",
          "items.variant",
          "items.variant.product",
        ],
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
      (session: any) => session.provider_id === "pp_zarinpal_zarinpal"
    );

    if (!zarinpalSession) {
      res.status(400).json({
        error: "No Zarinpal payment session found",
      });
      return;
    }

    // If already authorized, treat as idempotent success
    if ((zarinpalSession as any).status === "authorized") {
      return res.json({
        success: true,
        message: "Payment already authorized",
        data: {
          ref_id: (zarinpalSession as any).data?.ref_id,
          card_pan: (zarinpalSession as any).data?.card_pan,
          cart_id: resourceId,
          amount: paymentCollection.amount,
          currency_code: paymentCollection.currency_code,
          items: (cart as any)?.items?.map((it: any) => ({
            id: it.id,
            title: it.variant?.product?.title || it.title,
            quantity: it.quantity,
          })) || [],
          status: "authorized",
        },
      });
    }

    // Authorize the payment with Zarinpal
    const authorizedData: any = await paymentModuleService.authorizePaymentSession(
      zarinpalSession.id,
      {
        authority,
        Status,
      }
    );

    // In Medusa v2, authorizePaymentSession returns either PaymentProviderError or { status, data }
    if (!authorizedData || (authorizedData as any).error) {
      res.status(400).json({
        error: (authorizedData as any)?.error || "Payment authorization failed",
        detail: authorizedData,
      });
      return;
    }

    // Sanity check: ensure collection amount equals cart total when available
    const cartTotal = (cart as any)?.total;
    if (typeof cartTotal === "number" && cartTotal !== paymentCollection.amount) {
      return res.status(409).json({
        error: "Amount mismatch between cart and payment collection",
      });
    }

    // Payment verified successfully
    res.json({
      success: true,
      message: "Payment verified successfully",
      data: {
        ref_id: (authorizedData as any).data?.ref_id,
        card_pan: (authorizedData as any).data?.card_pan,
        cart_id: resourceId,
        amount: paymentCollection.amount,
        currency_code: paymentCollection.currency_code,
        items: (cart as any)?.items?.map((it: any) => ({
          id: it.id,
          title: it.variant?.product?.title || it.title,
          quantity: it.quantity,
        })) || [],
        status: "authorized",
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

export async function OPTIONS(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  applyCorsHeaders(req, res);
  res.status(200).end();
}

