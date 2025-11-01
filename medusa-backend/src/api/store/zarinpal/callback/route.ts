import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";
import { ICartModuleService, IPaymentModuleService } from "@medusajs/framework/types";
import { FRONTEND_URL } from "../../../../lib/constants";

/**
 * GET /store/zarinpal/callback?Authority=xxx&Status=OK&resource_id=cart_xxx
 * Handle Zarinpal payment callback and redirect to frontend
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    // Explicitly set publishable API key BEFORE any Medusa service calls
    const PUBLISHABLE_API_KEY = 'pk_2243c4f7a1f70eb2bb9b354ad7b22be869fca2633214edd7ee70637412a67bd4'
    req.headers['x-publishable-api-key'] = PUBLISHABLE_API_KEY
    
    const { Authority, Status, resource_id } = req.query;

    if (!Authority) {
      return res.redirect(`${FRONTEND_URL}/payment/success?error=missing_authority`);
    }

    if (!resource_id) {
      return res.redirect(`${FRONTEND_URL}/payment/success?error=missing_cart_id`);
    }

    const cartModuleService: ICartModuleService = req.scope.resolve(Modules.CART);
    const paymentModuleService: IPaymentModuleService = req.scope.resolve(Modules.PAYMENT);

    // Retrieve the cart without nested relations (Medusa v2 modular architecture)
    const cart = await cartModuleService.retrieveCart(resource_id as string);

    if (!cart) {
      return res.redirect(`${FRONTEND_URL}/payment/success?error=cart_not_found`);
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
