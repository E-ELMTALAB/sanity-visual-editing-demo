import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { Modules } from "@medusajs/framework/utils";
import { ICartModuleService, IPaymentModuleService } from "@medusajs/framework/types";
import { applyCorsHeaders, handleCorsPreflight } from "../../../../middleware/global-cors";

/**
 * Initiate Payment for Existing Cart
 * POST /store/cart/initiate-payment
 * 
 * Body:
 * {
 *   "cart_id": "cart_123",
 *   "customer_email": "customer@example.com",
 *   "customer_phone": "+989123456789"
 * }
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
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
    const body = req.body as {
      cart_id: string;
      customer_email?: string;
      customer_phone?: string;
    };

    const { cart_id, customer_email, customer_phone } = body;

    if (!cart_id) {
      return res.status(400).json({
        success: false,
        error: "Cart ID is required"
      });
    }

    const cartModuleService: ICartModuleService = req.scope.resolve(Modules.CART);
    const paymentModuleService: IPaymentModuleService = req.scope.resolve(Modules.PAYMENT);

    // Retrieve the cart to validate it exists and has items
    const cart = await cartModuleService.retrieveCart(cart_id, {
      relations: ["items"]
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        error: "Cart not found"
      });
    }

    if (!cart.items || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Cart is empty"
      });
    }

    // Update cart email if provided
    if (customer_email) {
      await cartModuleService.updateCarts(cart_id, {
        email: customer_email,
        metadata: {
          ...(cart.metadata || {}),
          customer_phone: customer_phone
        }
      });
    }

    // Calculate total from line items to ensure accuracy
    // Medusa sometimes doesn't update cart.total immediately after adding items
    const calculatedTotal = (cart.items || []).reduce((sum: number, item: any) => {
      return sum + (Number(item.unit_price || 0) * Number(item.quantity || 0));
    }, 0);

    // Use calculated total if cart.total is not set or seems incorrect
    const cartAmount = calculatedTotal > 0 ? calculatedTotal : Number(cart.total || 0);
    const minimumAmount = 10000;
    const paymentAmount = Math.max(cartAmount, minimumAmount);

    console.log(`[PAYMENT-INIT] ========== PAYMENT INITIATION ==========`);
    console.log(`[PAYMENT-INIT] Cart ID: ${cart_id}`);
    console.log(`[PAYMENT-INIT] Cart total from DB: ${cart.total}`);
    console.log(`[PAYMENT-INIT] Cart subtotal: ${cart.subtotal}`);
    console.log(`[PAYMENT-INIT] Cart items count: ${cart.items?.length}`);
    console.log(`[PAYMENT-INIT] Cart items details:`, cart.items?.map((item: any) => ({
      title: item.title,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total: item.total
    })));
    console.log(`[PAYMENT-INIT] Calculated cartAmount: ${cartAmount}`);
    console.log(`[PAYMENT-INIT] Minimum amount: ${minimumAmount}`);
    console.log(`[PAYMENT-INIT] Final paymentAmount: ${paymentAmount}`);
    console.log(`[PAYMENT-INIT] =========================================`);

    // Prepare cart items for metadata (admin verification needs this)
    const cartItemsMetadata = (cart.items || []).map((item: any) => ({
      title: item.title || item.product_title || 'Unknown Product',
      quantity: item.quantity,
      unit_price: item.unit_price,
      variant_id: item.variant_id,
      product_id: item.product_id,
    }));

    // Build payment description from cart items
    const paymentDescription = cartItemsMetadata.length === 1
      ? cartItemsMetadata[0].title + (cartItemsMetadata[0].quantity > 1 ? ` (${cartItemsMetadata[0].quantity} عدد)` : '')
      : cartItemsMetadata.map(item => 
          `${item.title}${item.quantity > 1 ? ` (${item.quantity} عدد)` : ''}`
        ).join('، ');

    // Create payment collection linked to this cart
    // Use standard Medusa API with cart_id in body (proper linking)
    const paymentCollection = await paymentModuleService.createPaymentCollections({
      currency_code: cart.currency_code,
      amount: paymentAmount,
      metadata: {
        cart_id: cart_id,
        customer_email: customer_email || cart.email,
        customer_phone: customer_phone,
        original_amount: cartAmount,
        items: cartItemsMetadata, // Store product info for admin verification
        description: paymentDescription // Add description for payment gateway
      }
    });

    // Create Zarinpal payment session
    const paymentSession = await paymentModuleService.createPaymentSession(
      paymentCollection.id,
      {
        provider_id: "pp_zarinpal_zarinpal",
        amount: paymentAmount,
        currency_code: cart.currency_code,
        data: {
          email: customer_email || cart.email,
          mobile: customer_phone,
          cart_id: cart_id,
          description: paymentDescription // Pass description in session data
        },
        context: {
          metadata: {
            description: paymentDescription // Also pass in context metadata
          }
        }
      }
    );

    // Extract authority and payment_url from Zarinpal provider response
    const authority = (paymentSession.data as any)?.authority;
    const payment_url = (paymentSession.data as any)?.payment_url;

    if (!payment_url) {
      return res.status(500).json({
        success: false,
        error: "Payment URL not generated by provider"
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment initiated successfully",
      payment: {
        session_id: paymentSession.id,
        collection_id: paymentCollection.id,
        authority: authority,
        payment_url: payment_url,
        amount: cart.total,
        currency_code: cart.currency_code,
        status: paymentSession.status
      },
      cart: {
        id: cart.id,
        total: cart.total,
        currency_code: cart.currency_code,
        item_count: cart.items.length
      }
    });

  } catch (error: any) {
    console.error("Payment initiation error:", error);
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

