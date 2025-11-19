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

    console.log('[ZARINPAL-VERIFY] ========== VERIFICATION STARTED ==========');
    console.log('[ZARINPAL-VERIFY] Request body:', body);
    console.log('[ZARINPAL-VERIFY] authority:', authority);
    console.log('[ZARINPAL-VERIFY] Status:', Status);
    console.log('[ZARINPAL-VERIFY] cart_id:', cart_id);
    console.log('[ZARINPAL-VERIFY] cart_id type:', typeof cart_id);

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
    let cart = null;

    console.log('[ZARINPAL-VERIFY] Attempting to retrieve cart with ID:', cart_id);
    
    // Try to retrieve cart, but don't fail if it doesn't exist
    // Payment collection may still exist even if cart was deleted/expired
    if (cart_id) {
      try {
        cart = await cartModuleService.retrieveCart(cart_id);
        console.log('[ZARINPAL-VERIFY] ✅ Cart found:', cart.id);
        resourceId = cart.id;
      } catch (cartError: any) {
        console.warn('[ZARINPAL-VERIFY] ⚠️ Cart not found (may have been deleted/expired):', cartError.message);
        console.log('[ZARINPAL-VERIFY] Continuing with cart_id from request to find payment collection...');
        // Don't throw - continue to find payment collection by cart_id in metadata
        // The payment collection should still exist even if cart is gone
      }
    }

    // Find payment collection for this cart using the payment module
    // Use the original cart_id from request, not the retrieved cart ID
    // This allows finding payment collections even if cart was deleted
    const paymentCollections = await paymentModuleService.listPaymentCollections({});
    
    console.log('[ZARINPAL-VERIFY] Searching for payment collection with resourceId:', resourceId);
    console.log('[ZARINPAL-VERIFY] Total payment collections:', paymentCollections.length);
    
    const paymentCollection = paymentCollections.find((pc: any) => {
      const matchesResourceId = pc.metadata?.resource_id === resourceId;
      const matchesCartId = pc.metadata?.cart_id === resourceId;
      const matchesOriginalCartId = pc.metadata?.cart_id === cart_id;
      
      if (matchesResourceId || matchesCartId || matchesOriginalCartId) {
        console.log('[ZARINPAL-VERIFY] ✅ Found payment collection:', pc.id);
        console.log('[ZARINPAL-VERIFY] Payment collection metadata:', JSON.stringify(pc.metadata, null, 2));
        return true;
      }
      return false;
    });
    
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
    // Use items from payment collection metadata if cart is not available
    let cartItems: any[] = [];
    
    if (cart) {
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
      }
    }
    
    // If cart not found, try to get items from payment collection metadata
    if (cartItems.length === 0 && paymentCollection?.metadata?.items) {
      console.log('[ZARINPAL-VERIFY] Using items from payment collection metadata');
      cartItems = Array.isArray(paymentCollection.metadata.items) 
        ? paymentCollection.metadata.items 
        : [];
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

    // Sanity check: ensure collection amount equals cart total when cart is available
    // Skip this check if cart was deleted/expired (payment collection amount is authoritative)
    if (cart) {
      const cartTotal = (cart as any)?.total;
      if (typeof cartTotal === "number" && cartTotal !== paymentCollection.amount) {
        console.warn('[ZARINPAL-VERIFY] Amount mismatch - cart total:', cartTotal, 'vs payment collection:', paymentCollection.amount);
        // Don't fail - payment collection amount is what was actually charged
      }
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
        items: cartItems,
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

