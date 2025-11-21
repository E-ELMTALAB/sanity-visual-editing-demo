import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";
import { IPaymentModuleService, ICartModuleService } from "@medusajs/framework/types";
import { applyCorsHeaders, handleCorsPreflight } from "../../../../middleware/global-cors";

/**
 * POST /internal/admin/verify-payment
 * Lookup payment by ref_id for admin verification
 * 
 * Security: Protected by simple password check
 * 
 * Body:
 * {
 *   "ref_id": "78148083401",
 *   "admin_password": "your-secret-password"
 * }
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  // Apply CORS headers
  applyCorsHeaders(req, res);
  
  // Handle preflight requests
  if (handleCorsPreflight(req, res)) {
    return;
  }
  try {
    const body = req.body as {
      ref_id: string;
      admin_password?: string;
    };

    const { ref_id, admin_password } = body;

    // Simple password protection
    const ADMIN_PASSWORD = process.env.ADMIN_VERIFY_PASSWORD || 'sharifgpt-admin-2025';
    
    if (admin_password !== ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        error: "Invalid admin password"
      });
    }

    if (!ref_id) {
      return res.status(400).json({
        success: false,
        error: "ref_id is required"
      });
    }

    const paymentModuleService: IPaymentModuleService = req.scope.resolve(Modules.PAYMENT);
    const cartModuleService: ICartModuleService = req.scope.resolve(Modules.CART);

    // Find all payment sessions to search for ref_id
    const allSessions = await paymentModuleService.listPaymentSessions({});
    
    console.log(`[ADMIN-VERIFY] Searching for ref_id: ${ref_id}`);
    console.log(`[ADMIN-VERIFY] Total sessions to search: ${allSessions.length}`);
    
    // Debug: log first 3 sessions to see structure
    allSessions.slice(0, 3).forEach((session: any, idx) => {
      console.log(`[ADMIN-VERIFY] Session ${idx + 1} data.ref_id:`, session.data?.ref_id);
    });
    
    const matchingSession = allSessions.find((session: any) => {
      const sessionRefId = session.data?.ref_id;
      // Handle both string and number comparison
      return sessionRefId === ref_id || 
             sessionRefId === String(ref_id) ||
             String(sessionRefId) === String(ref_id);
    });

    if (!matchingSession) {
      console.log(`[ADMIN-VERIFY] No matching session found for ref_id: ${ref_id}`);
      return res.status(404).json({
        success: false,
        error: "Payment with this ref_id not found",
        debug: {
          searched_ref_id: ref_id,
          total_sessions: allSessions.length,
          sample_ref_ids: allSessions.slice(0, 5).map((s: any) => s.data?.ref_id)
        }
      });
    }
    
    console.log(`[ADMIN-VERIFY] Found matching session:`, matchingSession.id);

    // Get payment collection for this session
    const paymentCollection = await paymentModuleService.retrievePaymentCollection(
      (matchingSession as any).payment_collection_id
    );

    // Try to get cart details if cart_id exists
    let cartDetails = null;
    const cartId = (paymentCollection.metadata?.cart_id || paymentCollection.metadata?.resource_id) as string | undefined;
    
    if (cartId && typeof cartId === 'string' && cartId.startsWith('cart_01')) {
      try {
        const cart = await cartModuleService.retrieveCart(cartId, {
          relations: ["items"]
        });
        
        cartDetails = {
          items: (cart as any).items?.map((item: any) => ({
            title: item.title || item.product_title || 'Unknown',
            quantity: item.quantity,
            unit_price: item.unit_price,
            total: (item.unit_price || 0) * item.quantity
          })) || [],
          total: cart.total,
          subtotal: cart.subtotal,
          tax_total: cart.tax_total
        };
      } catch (e) {
        console.log('[ADMIN-VERIFY] Could not fetch cart details:', e);
      }
    }

    // Return comprehensive payment details
    res.status(200).json({
      success: true,
      payment: {
        ref_id: (matchingSession as any).data?.ref_id,
        authority: (matchingSession as any).data?.authority,
        card_pan: (matchingSession as any).data?.card_pan,
        status: (matchingSession as any).status,
        amount: paymentCollection.amount,
        currency_code: paymentCollection.currency_code,
        verified_at: (matchingSession as any).data?.verified_at,
      },
      customer: {
        email: paymentCollection.metadata?.customer_email,
        phone: paymentCollection.metadata?.customer_phone,
      },
      order: {
        cart_id: cartId,
        items: cartDetails?.items || paymentCollection.metadata?.items || [],
        total: cartDetails?.total || paymentCollection.amount,
        original_amount: paymentCollection.metadata?.original_amount,
      },
      created_at: paymentCollection.created_at,
    });

  } catch (error: any) {
    console.error("[ADMIN-VERIFY] Error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
};

export const OPTIONS = async (req: MedusaRequest, res: MedusaResponse) => {
  applyCorsHeaders(req, res);
  res.status(200).end();
};

