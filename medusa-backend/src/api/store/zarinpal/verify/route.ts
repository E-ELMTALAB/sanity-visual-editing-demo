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
  // Explicitly set publishable API key BEFORE any Medusa service calls
  const PUBLISHABLE_API_KEY = 'pk_2243c4f7a1f70eb2bb9b354ad7b22be869fca2633214edd7ee70637412a67bd4'
  req.headers['x-publishable-api-key'] = PUBLISHABLE_API_KEY
  
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
      // Retrieve the cart without nested relations to avoid MikroORM errors
      cart = await cartModuleService.retrieveCart(cart_id);

      if (!cart) {
        res.status(404).json({
          error: "Cart not found",
        });
        return;
      }

      resourceId = cart.id;
    }

    // Find payment collection for this cart using the payment module
    // Avoid cart relations; query payment collections directly
    const paymentCollections = await paymentModuleService.listPaymentCollections({});
    
    const paymentCollection = paymentCollections.find((pc: any) => 
      pc.metadata?.resource_id === resourceId || 
      pc.metadata?.cart_id === resourceId
    );
    
    if (!paymentCollection) {
      res.status(400).json({
        error: "No payment collection found for this cart",
      });
      return;
    }

    // Find Zarinpal payment session for this collection
    const paymentSessions = await paymentModuleService.listPaymentSessions({
      payment_collection_id: paymentCollection.id,
      provider_id: "pp_zarinpal_zarinpal",
    });

    if (!paymentSessions || paymentSessions.length === 0) {
      res.status(400).json({
        error: "No Zarinpal payment session found",
      });
      return;
    }

    const zarinpalSession = paymentSessions[0];
    
    // Optionally fetch cart items separately for response (non-critical)
    let cartItems: any[] = [];
    try {
      const cartWithItems = await cartModuleService.retrieveCart(resourceId as string, {
        relations: ["items"],
      });
      if (cartWithItems && (cartWithItems as any).items) {
        cartItems = (cartWithItems as any).items.map((it: any) => ({
          id: it.id,
          title: it.title || it.product_title || 'Product',
          quantity: it.quantity,
        }));
      }
    } catch (itemsError) {
      console.warn("[ZARINPAL-VERIFY] Could not fetch cart items:", itemsError);
      // Continue without items
    }

    // If already authorized, treat as idempotent success
    if ((zarinpalSession as any).status === "authorized") {
      res.json({
        success: true,
        message: "Payment already authorized",
        data: {
          ref_id: (zarinpalSession as any).data?.ref_id,
          card_pan: (zarinpalSession as any).data?.card_pan,
          cart_id: resourceId,
          amount: paymentCollection.amount,
          currency_code: paymentCollection.currency_code,
          items: cartItems,
          status: "authorized",
        },
      });
      return;
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
      res.status(409).json({
        error: "Amount mismatch between cart and payment collection",
      });
      return;
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
    return;
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

