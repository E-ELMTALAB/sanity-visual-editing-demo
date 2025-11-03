import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";
import { ICartModuleService, IPaymentModuleService } from "@medusajs/framework/types";
import { FRONTEND_URL } from "../../../lib/constants";

/**
 * GET /internal/zarinpal-callback?Authority=xxx&Status=OK&resource_id=cart_xxx
 * Handle Zarinpal payment callback and redirect to frontend
 * Internal routes bypass publishable API key validation
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { Authority, Status, resource_id } = req.query;

    if (!Authority) {
      return res.redirect(`${FRONTEND_URL}/payment/success?error=missing_authority`);
    }

    if (!resource_id) {
      return res.redirect(`${FRONTEND_URL}/payment/success?error=missing_cart_id`);
    }

    const cartModuleService: ICartModuleService = req.scope.resolve(Modules.CART);
    const paymentModuleService: IPaymentModuleService = req.scope.resolve(Modules.PAYMENT);

    // Try to retrieve the cart (may not exist if using simple payment pattern)
    // In Medusa v2, payment collections can exist without carts for payment-only flows
    let cart = null;
    try {
      cart = await cartModuleService.retrieveCart(resource_id as string);
    } catch (e: any) {
      // Cart not found - this is OK for payment-only flows
      // Continue to find payment collection by resource_id in metadata
      console.log(`[CALLBACK] Cart not found: ${resource_id}, proceeding with payment-only verification`);
    }

    // Find payment collection using payment module (not cart relations)
    const paymentCollections = await paymentModuleService.listPaymentCollections({});
    const paymentCollection = paymentCollections.find((pc: any) => 
      pc.metadata?.resource_id === resource_id || 
      pc.metadata?.cart_id === resource_id
    );

    if (paymentCollection) {
      // Find Zarinpal payment session
      const paymentSessions = await paymentModuleService.listPaymentSessions({
        payment_collection_id: paymentCollection.id,
        provider_id: "pp_zarinpal_zarinpal",
      });

      const zarinpalSession = paymentSessions?.[0];

      if (zarinpalSession) {
        // Idempotent authorize; ignore errors here and let frontend handle display
        try {
          if ((zarinpalSession as any).status !== "authorized") {
            await paymentModuleService.authorizePaymentSession(zarinpalSession.id, {
              authority: Authority as string,
              Status: (Status as string) || undefined,
            });
          }
        } catch (e) {
          // Fall through to redirect regardless
          console.error("[CALLBACK] Authorization error (non-fatal):", e);
        }
      }
    }

    // Redirect to frontend with payment details
    const redirectUrl = `${FRONTEND_URL}/payment/success?Authority=${Authority}&Status=${Status}&cart_id=${resource_id}`;
    
    res.redirect(redirectUrl);

  } catch (error: any) {
    console.error("Zarinpal callback error:", error);
    res.redirect(`${FRONTEND_URL}/payment/success?error=callback_error`);
  }
}

