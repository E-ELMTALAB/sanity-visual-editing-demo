import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { Modules } from "@medusajs/framework/utils";
import { IPaymentModuleService } from "@medusajs/framework/types";
import { CURRENCY_TO_IRR } from "../../../../lib/constants";
import { applyCorsHeaders, handleCorsPreflight } from "../../../../middleware/global-cors";

/**
 * Direct Zarinpal Payment Endpoint
 * POST /store/zarinpal/direct-payment
 * 
 * Body:
 * {
 *   "items": [
 *     {
 *       "id": 1,
 *       "title": "Product Name",
 *       "price": 100000,
 *       "quantity": 2
 *     }
 *   ],
 *   "customer_email": "customer@example.com",
 *   "customer_phone": "+989123456789",
 *   "description": "Payment for order"
 * }
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  // Apply comprehensive CORS headers
  applyCorsHeaders(req, res);
  
  // Handle preflight requests
  if (handleCorsPreflight(req, res)) {
    return;
  }
  
  try {
    const body = req.body as {
      items: Array<{
        id: number;
        title: string;
        price: number;
        quantity: number;
      }>;
      customer_email?: string;
      customer_phone?: string;
      description?: string;
    };

    const { items, customer_email, customer_phone, description } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Items array is required and cannot be empty"
      });
    }

    // Build payment description from items if not provided
    const paymentDescription = description || (items.length === 1
      ? items[0].title + (items[0].quantity > 1 ? ` (${items[0].quantity} عدد)` : '')
      : items.map(item => 
          `${item.title}${item.quantity > 1 ? ` (${item.quantity} عدد)` : ''}`
        ).join('، '));

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Convert to Rials (assuming input is in Rials)
    const amountInRials = totalAmount;

    // Create a simple resource ID for tracking
    const resourceId = `direct_payment_${Date.now()}`;

    // Get payment module service
    const paymentModuleService: IPaymentModuleService = req.scope.resolve(Modules.PAYMENT);

    // Create payment collection
    const paymentCollection = await paymentModuleService.createPaymentCollections({
      currency_code: "irr",
      amount: amountInRials,
      metadata: {
        resource_id: resourceId,
        customer_email: customer_email,
        customer_phone: customer_phone,
        items: items,
        description: paymentDescription
      }
    });

    // Create Zarinpal payment session
    const paymentSession = await paymentModuleService.createPaymentSession(paymentCollection.id, {
      provider_id: "pp_zarinpal_zarinpal",
      amount: amountInRials,
      currency_code: "irr",
      data: {
        email: customer_email,
        mobile: customer_phone,
        resource_id: resourceId,
        description: paymentDescription // Pass description in session data
      },
      context: {
        metadata: {
          description: paymentDescription // Also pass in context metadata
        }
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
        collection_id: paymentCollection.id,
        authority: paymentData.session_id, // Using session_id as authority for now
        payment_url: `https://sandbox.zarinpal.com/pg/StartPay/${paymentData.session_id}`, // Mock payment URL
        amount: paymentData.amount,
        currency_code: paymentData.currency_code,
        status: paymentData.status,
        resource_id: resourceId
      },
      order: {
        resource_id: resourceId,
        total: amountInRials,
        currency_code: "irr",
        item_count: items.length,
        items: items
      }
    });

  } catch (error: any) {
    console.error("Direct payment error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
};

// Handle preflight requests
export const OPTIONS = async (req: MedusaRequest, res: MedusaResponse) => {
  applyCorsHeaders(req, res);
  res.status(200).end();
};
