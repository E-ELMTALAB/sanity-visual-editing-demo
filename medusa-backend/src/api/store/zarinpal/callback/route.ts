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
    const { Authority, Status, resource_id } = req.query;

    if (!Authority) {
      return res.redirect(`${FRONTEND_URL}/payment/success?error=missing_authority`);
    }

    if (!resource_id) {
      return res.redirect(`${FRONTEND_URL}/payment/success?error=missing_cart_id`);
    }

    const cartModuleService: ICartModuleService = req.scope.resolve(Modules.CART);
    const paymentModuleService: IPaymentModuleService = req.scope.resolve(Modules.PAYMENT);

    // Retrieve the cart
    const cart = await cartModuleService.retrieveCart(resource_id as string, {
      relations: [
        "payment_collection",
        "payment_collection.payment_sessions",
      ]
    });

    if (!cart) {
      return res.redirect(`${FRONTEND_URL}/payment/success?error=cart_not_found`);
    }

    const paymentCollection = (cart as any)?.payment_collection;
    const zarinpalSession = paymentCollection?.payment_sessions?.find(
      (s: any) => s.provider_id === "pp_zarinpal_zarinpal"
    );

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
