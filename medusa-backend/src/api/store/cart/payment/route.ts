import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { Modules } from "@medusajs/framework/utils";
import { ICartModuleService, IPaymentModuleService } from "@medusajs/framework/types";

/**
 * Initiate Payment for Cart
 * POST /store/cart/payment
 * 
 * Body:
 * {
 *   "cart_id": "cart_123",
 *   "customer_email": "customer@example.com",
 *   "customer_phone": "+989123456789"
 * }
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
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

    // Retrieve the cart
    const cart = await cartModuleService.retrieveCart(cart_id, {
      relations: ["items", "items.variant", "items.variant.product"]
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        error: "Cart not found"
      });
    }

    // Update cart email if provided
    if (customer_email) {
      await cartModuleService.updateCarts(cart_id, {
        email: customer_email,
        metadata: {
          ...cart.metadata,
          customer_phone: customer_phone
        }
      });
    }

    // Create payment collection
    const paymentCollection = await paymentModuleService.createPaymentCollections({
      currency_code: cart.currency_code,
      amount: cart.total || 0,
      metadata: {
        cart_id: cart_id,
        customer_email: customer_email,
        customer_phone: customer_phone
      }
    });

    // Create payment session for Zarinpal
    const paymentSession = await paymentModuleService.createPaymentSession(paymentCollection.id, {
      provider_id: "pp_zarinpal_zarinpal",
      amount: cart.total || 0,
      currency_code: cart.currency_code,
      data: {
        email: customer_email,
        mobile: customer_phone,
        resource_id: cart_id
      }
    });

    // For now, we'll return the payment session data
    // In a real implementation, you would initiate the payment with Zarinpal here
    const paymentData = {
      session_id: paymentSession.id,
      provider_id: paymentSession.provider_id,
      amount: paymentSession.amount,
      currency_code: paymentSession.currency_code,
      status: paymentSession.status
    };

    res.status(200).json({
      success: true,
      message: "Payment initiated successfully",
      payment: {
        session_id: paymentSession.id,
        authority: paymentData.session_id, // Using session_id as authority for now
        payment_url: `https://sandbox.zarinpal.com/pg/StartPay/${paymentData.session_id}`, // Mock payment URL
        amount: paymentData.amount,
        currency_code: paymentData.currency_code,
        status: paymentData.status
      },
      cart: {
        id: cart.id,
        total: cart.total,
        currency_code: cart.currency_code,
        item_count: cart.items?.length || 0
      }
    });

  } catch (error: any) {
    console.error("Error initiating payment:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
};
