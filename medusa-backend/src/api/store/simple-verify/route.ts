import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { Modules } from "@medusajs/framework/utils";
import { IPaymentModuleService } from "@medusajs/framework/types";

// Enhanced CORS middleware function
const setCorsHeaders = (res: MedusaResponse) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, x-publishable-api-key, x-medusa-access-token');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');
};

/**
 * Simple Payment Verification with explicit CORS handling
 * POST /store/simple-verify
 * 
 * Body:
 * {
 *   "authority": "zarinpal_authority",
 *   "status": "OK",
 *   "resource_id": "simple_payment_123"
 * }
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  // Set CORS headers first
  setCorsHeaders(res);
  
  try {
    const body = req.body as {
      authority: string;
      status: string;
      resource_id: string;
    };

    const { authority, status, resource_id } = body;

    if (!authority || !resource_id) {
      return res.status(400).json({
        success: false,
        error: "Missing authority or resource_id parameter"
      });
    }

    // Get payment module service
    const paymentModuleService: IPaymentModuleService = req.scope.resolve(Modules.PAYMENT);

    // Find payment collection by resource_id
    const paymentCollections = await paymentModuleService.listPaymentCollections({
      // Note: metadata filtering might not be supported in this version
      // We'll use a different approach for now
    });

    if (!paymentCollections || paymentCollections.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Payment collection not found"
      });
    }

    const paymentCollection = paymentCollections[0];

    // Find Zarinpal payment session
    const paymentSessions = await paymentModuleService.listPaymentSessions({
      payment_collection_id: paymentCollection.id,
      provider_id: "pp_zarinpal_zarinpal"
    });

    if (!paymentSessions || paymentSessions.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Payment session not found"
      });
    }

    const paymentSession = paymentSessions[0];

    // Authorize the payment
    const authorizedData = await paymentModuleService.authorizePaymentSession(paymentSession.id, {
      authority,
      Status: status
    });

    if (!authorizedData || (authorizedData as any).error) {
      return res.status(400).json({
        success: false,
        error: (authorizedData as any)?.error || "Payment authorization failed",
        detail: authorizedData
      });
    }

    // Payment verified successfully
    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      payment: {
        session_id: paymentSession.id,
        collection_id: paymentCollection.id,
        ref_id: (authorizedData as any).data?.ref_id,
        card_pan: (authorizedData as any).data?.card_pan,
        amount: paymentCollection.amount,
        currency_code: paymentCollection.currency_code,
        status: "verified"
      },
      order: {
        resource_id: resource_id,
        total: paymentCollection.amount,
        currency_code: paymentCollection.currency_code,
        items: paymentCollection.metadata?.items || [],
        customer_email: paymentCollection.metadata?.customer_email,
        customer_phone: paymentCollection.metadata?.customer_phone
      }
    });

  } catch (error: any) {
    console.error("Simple payment verification error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
};

// Handle preflight requests
export const OPTIONS = async (req: MedusaRequest, res: MedusaResponse) => {
  setCorsHeaders(res);
  res.status(200).end();
};
