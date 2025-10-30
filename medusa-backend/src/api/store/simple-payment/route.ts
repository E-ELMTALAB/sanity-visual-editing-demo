import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { Modules } from "@medusajs/framework/utils";
import { IPaymentModuleService } from "@medusajs/framework/types";
import { CURRENCY_TO_IRR } from "../../../lib/constants";
import { applyCorsHeaders, handleCorsPreflight } from "../../../middleware/global-cors";

/**
 * Simple Payment Endpoint with explicit CORS handling
 * POST /store/simple-payment
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
 *   "customer_phone": "+989123456789"
 * }
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  console.log('[SIMPLE-PAYMENT] ========== REQUEST RECEIVED ==========');
  console.log('[SIMPLE-PAYMENT] URL:', req.url);
  console.log('[SIMPLE-PAYMENT] Method:', req.method);
  console.log('[SIMPLE-PAYMENT] Origin:', req.headers.origin);
  console.log('[SIMPLE-PAYMENT] Headers:', JSON.stringify(req.headers, null, 2));
  
  // Apply CORS headers
  applyCorsHeaders(req, res);
  console.log('[SIMPLE-PAYMENT] CORS headers applied');
  
  // Handle preflight requests
  if (handleCorsPreflight(req, res)) {
    console.log('[SIMPLE-PAYMENT] Handled preflight request');
    return;
  }
  
  try {
    console.log('[SIMPLE-PAYMENT] Raw request body:', JSON.stringify(req.body, null, 2));
    
    const body = req.body as {
      items: Array<{
        id: number;
        title: string;
        price: number;
        quantity: number;
      }>;
      customer_email?: string;
      customer_phone?: string;
    };

    const { items, customer_email, customer_phone } = body;

    console.log('[SIMPLE-PAYMENT] Parsed body:');
    console.log('[SIMPLE-PAYMENT] - items:', items ? `Array with ${items.length} items` : 'undefined');
    console.log('[SIMPLE-PAYMENT] - customer_email:', customer_email);
    console.log('[SIMPLE-PAYMENT] - customer_phone:', customer_phone);

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.log('[SIMPLE-PAYMENT] ❌ VALIDATION ERROR: Items array is required and cannot be empty');
      return res.status(400).json({
        success: false,
        error: "Items array is required and cannot be empty"
      });
    }
    
    console.log('[SIMPLE-PAYMENT] ✅ Request validation passed');

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    console.log('[SIMPLE-PAYMENT] Calculated total amount:', totalAmount);
    
    // Convert to Rials (assuming input is in Rials)
    const amountInRials = totalAmount;
    console.log('[SIMPLE-PAYMENT] Amount in Rials:', amountInRials);

    // Create a simple resource ID for tracking
    const resourceId = `simple_payment_${Date.now()}`;
    console.log('[SIMPLE-PAYMENT] Generated resource ID:', resourceId);

    // Get payment module service
    console.log('[SIMPLE-PAYMENT] Resolving payment module service...');
    const paymentModuleService: IPaymentModuleService = req.scope.resolve(Modules.PAYMENT);
    console.log('[SIMPLE-PAYMENT] ✅ Payment module service resolved');

    // Create payment collection
    console.log('[SIMPLE-PAYMENT] Creating payment collection...');
    const paymentCollection = await paymentModuleService.createPaymentCollections({
      currency_code: "irr",
      amount: amountInRials,
      metadata: {
        resource_id: resourceId,
        customer_email: customer_email,
        customer_phone: customer_phone,
        items: items,
        description: `پرداخت سفارش ${items.length} کالا`
      }
    });
    console.log('[SIMPLE-PAYMENT] ✅ Payment collection created:', paymentCollection.id);

    // Create Zarinpal payment session
    console.log('[SIMPLE-PAYMENT] Creating Zarinpal payment session...');
    const paymentSession = await paymentModuleService.createPaymentSession(paymentCollection.id, {
      provider_id: "pp_zarinpal_zarinpal",
      amount: amountInRials,
      currency_code: "irr",
      data: {
        email: customer_email,
        mobile: customer_phone,
        resource_id: resourceId
      }
    });
    console.log('[SIMPLE-PAYMENT] ✅ Payment session created:', paymentSession.id);

    // For now, we'll return the payment session data
    // In a real implementation, you would initiate the payment with Zarinpal here
    const paymentData = {
      session_id: paymentSession.id,
      provider_id: paymentSession.provider_id,
      amount: paymentSession.amount,
      currency_code: paymentSession.currency_code,
      status: paymentSession.status
    };
    console.log('[SIMPLE-PAYMENT] Payment data prepared:', JSON.stringify(paymentData, null, 2));

    const response = {
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
    };
    
    console.log('[SIMPLE-PAYMENT] ✅ Sending successful response');
    console.log('[SIMPLE-PAYMENT] Response:', JSON.stringify(response, null, 2));
    res.status(200).json(response);

  } catch (error: any) {
    console.error('[SIMPLE-PAYMENT] ❌ ERROR OCCURRED');
    console.error('[SIMPLE-PAYMENT] Error message:', error.message);
    console.error('[SIMPLE-PAYMENT] Error stack:', error.stack);
    console.error('[SIMPLE-PAYMENT] Error details:', JSON.stringify(error, null, 2));
    
    const errorResponse = {
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    };
    
    console.log('[SIMPLE-PAYMENT] Sending error response:', JSON.stringify(errorResponse, null, 2));
    res.status(500).json(errorResponse);
  }
  
  console.log('[SIMPLE-PAYMENT] ========== REQUEST HANDLED ==========');
};

// OPTIONS method for preflight requests
export const OPTIONS = async (req: MedusaRequest, res: MedusaResponse) => {
  // Apply CORS headers for preflight requests
  applyCorsHeaders(req, res);
  res.status(200).end();
};
