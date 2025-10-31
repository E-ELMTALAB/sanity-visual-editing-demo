import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { FRONTEND_URL } from "../../../../lib/constants";

/**
 * GET /store/zarinpal/callback?Authority=xxx&Status=OK&resource_id=cart_xxx
 * Handle Zarinpal payment callback and redirect to frontend
 * 
 * Note: This is a public endpoint called by Zarinpal's servers.
 * We don't verify here to avoid publishable API key requirement.
 * Verification is done by the frontend success page.
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { Authority, Status, resource_id } = req.query;

    // Simple validation and redirect - no API calls to avoid key requirement
    if (!Authority) {
      res.redirect(`${FRONTEND_URL}/payment/success?error=missing_authority`);
      return;
    }

    if (!resource_id) {
      res.redirect(`${FRONTEND_URL}/payment/success?error=missing_cart_id`);
      return;
    }

    // Redirect to frontend with payment details
    // The frontend success page will handle verification via /api/payment/verify
    const redirectUrl = `${FRONTEND_URL}/payment/success?Authority=${Authority}&Status=${Status}&cart_id=${resource_id}`;
    
    res.redirect(redirectUrl);
    return;

  } catch (error: any) {
    console.error("Zarinpal callback error:", error);
    res.redirect(`${FRONTEND_URL}/payment/success?error=callback_error`);
    return;
  }
}
