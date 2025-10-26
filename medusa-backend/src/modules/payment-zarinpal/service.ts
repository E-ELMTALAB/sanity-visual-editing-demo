import type {
  Logger,
  MedusaContainer,
  InitiatePaymentInput,
  InitiatePaymentOutput,
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  CancelPaymentInput,
  CancelPaymentOutput,
  CapturePaymentInput,
  CapturePaymentOutput,
  DeletePaymentInput,
  DeletePaymentOutput,
  GetPaymentStatusInput,
  GetPaymentStatusOutput,
  RefundPaymentInput,
  RefundPaymentOutput,
  RetrievePaymentInput,
  RetrievePaymentOutput,
  UpdatePaymentInput,
  UpdatePaymentOutput,
  ProviderWebhookPayload,
  WebhookActionResult
} from "@medusajs/framework/types";
import { AbstractPaymentProvider } from "@medusajs/utils";
import { MedusaError, PaymentSessionStatus as PaymentStatus } from "@medusajs/framework/utils";
import { CURRENCY_TO_IRR } from "../../lib/constants";
import axios from "axios";

// Local minimal fallbacks for provider-related types to avoid version/entrypoint mismatches (kept for internal use only)
type PaymentProviderError = { error: string; code?: string; detail?: any };
type PaymentProviderSessionResponse = { data: Record<string, any> };
type PaymentSessionStatus = any;

interface ZarinpalOptions {
  merchant_id: string;
  sandbox?: boolean;
  description?: string;
  callback_url?: string;
  offline?: boolean;
}

interface ZarinpalRequestResponse {
  data: {
    code: number;
    message: string;
    authority?: string;
    fee_type?: string;
    fee?: number;
  };
  errors: any[];
}

interface ZarinpalVerifyResponse {
  data: {
    code: number;
    message: string;
    card_hash?: string;
    card_pan?: string;
    ref_id?: number;
    fee_type?: string;
    fee?: number;
  };
  errors: any[];
}

class ZarinpalProviderService extends AbstractPaymentProvider<ZarinpalOptions> {
  static identifier = "zarinpal";
  static PROVIDER = "zarinpal";
  protected merchantId_: string;
  protected sandbox_: boolean;
  protected description_: string;
  protected callbackUrl_: string;
  protected baseUrl_: string;
  protected logger_: Logger;
  protected offline_: boolean;

  constructor(cradle: Record<string, unknown>, options: ZarinpalOptions) {
    console.log("[ZARINPAL-CONSTRUCTOR] Starting constructor...")
    console.log("[ZARINPAL-CONSTRUCTOR] Options received:", JSON.stringify(options, null, 2))
    
    try {
      super(cradle, options)
      console.log("[ZARINPAL-CONSTRUCTOR] Super constructor completed")
      
      // Get logger from cradle if available, otherwise create a dummy logger
      this.logger_ = (cradle as any).logger || {
        info: (...args: any[]) => console.log("[ZARINPAL-LOG]", ...args),
        warn: (...args: any[]) => console.warn("[ZARINPAL-LOG]", ...args),
        error: (...args: any[]) => console.error("[ZARINPAL-LOG]", ...args),
        debug: (...args: any[]) => console.debug("[ZARINPAL-LOG]", ...args),
      } as Logger
      console.log("[ZARINPAL-CONSTRUCTOR] Logger resolved")

      this.merchantId_ = options.merchant_id;
      this.sandbox_ = options.sandbox ?? false;
      this.description_ = options.description ?? "Payment";
      this.callbackUrl_ = options.callback_url ?? "";
      this.offline_ = options.offline ?? (process.env.ZARINPAL_OFFLINE === "true");

      // Set the appropriate base URL based on sandbox mode
      this.baseUrl_ = this.sandbox_
        ? "https://sandbox.zarinpal.com/pg/v4/payment"
        : "https://payment.zarinpal.com/pg/v4/payment";

      console.log("[ZARINPAL-CONSTRUCTOR] Provider initialized successfully")
      console.log("[ZARINPAL-CONSTRUCTOR] Identifier:", ZarinpalProviderService.identifier)
      console.log("[ZARINPAL-CONSTRUCTOR] Base URL:", this.baseUrl_)
      console.log("[ZARINPAL-CONSTRUCTOR] Offline mode:", this.offline_)
      console.log("[ZARINPAL-CONSTRUCTOR] Has merchant ID:", !!this.merchantId_)

      // Do not throw here to avoid blocking provider registration
      if (!this.merchantId_ && !this.offline_) {
        try {
          this.logger_?.warn?.("[zarinpal] merchant_id missing; provider will operate in limited mode until configured.")
          console.log("[ZARINPAL-CONSTRUCTOR] Warning: merchant_id missing")
        } catch {}
      }
    } catch (error: any) {
      console.error("[ZARINPAL-CONSTRUCTOR] ERROR during construction:", error.message)
      console.error("[ZARINPAL-CONSTRUCTOR] Error stack:", error.stack)
      throw error
    }
  }

  static validateOptions(options: Record<any, any>): void {
    console.log("[ZARINPAL-validateOptions] Called with options:", JSON.stringify(options, null, 2))
    // Be permissive to ensure provider registers; runtime methods will guard as needed
    console.log("[ZARINPAL-validateOptions] Validation passed (permissive)")
  }

  async getPaymentStatus(input: GetPaymentStatusInput): Promise<GetPaymentStatusOutput> {
    this.logger_.info(
      `[zarinpal] getPaymentStatus called | data.status=${(input.data as any)?.status}`
    )
    const status = (input.data as any)?.status as string;
    switch (status) {
      case "verified":
      case "paid":
        this.logger_.info(`[zarinpal] getPaymentStatus -> AUTHORIZED`)
        return { status: PaymentStatus.AUTHORIZED } as any;
      case "pending":
        this.logger_.info(`[zarinpal] getPaymentStatus -> PENDING`)
        return { status: PaymentStatus.PENDING } as any;
      case "canceled":
      case "cancelled":
        this.logger_.info(`[zarinpal] getPaymentStatus -> CANCELED`)
        return { status: PaymentStatus.CANCELED } as any;
      case "error":
        this.logger_.info(`[zarinpal] getPaymentStatus -> ERROR`)
        return { status: PaymentStatus.ERROR } as any;
      default:
        this.logger_.info(`[zarinpal] getPaymentStatus -> DEFAULT(PENDING)`)
        return { status: PaymentStatus.PENDING } as any;
    }
  }

  async initiatePayment(input: InitiatePaymentInput): Promise<InitiatePaymentOutput> {
    console.log("[ZARINPAL-initiatePayment] Method called")
    console.log("[ZARINPAL-initiatePayment] Input:", JSON.stringify(input, null, 2))
    
    try {
      const offline = this.offline_ || process.env.ZARINPAL_OFFLINE === "true"
      console.log("[ZARINPAL-initiatePayment] Offline mode:", offline)
      
      const { amount, currency_code, email, context: paymentContext, resource_id } = input as any;
      console.log("[ZARINPAL-initiatePayment] Extracted params:", { amount, currency_code, email, resource_id })

      // Ensure resource_id is available (get from context if not provided)
      const actualResourceId = resource_id || (paymentContext as any)?.resource_id || (paymentContext as any)?.cart_id;
      console.log("[ZARINPAL-initiatePayment] Actual resource_id:", actualResourceId)

      // Convert amount based on currency using predefined rates
      const conversionRate = CURRENCY_TO_IRR[currency_code as keyof typeof CURRENCY_TO_IRR] || CURRENCY_TO_IRR.default;
      let amountInRials: number;

      if (currency_code === 'irr') {
        // Already in Rials, use as is
        amountInRials = amount;
      } else {
        // Convert from smallest currency unit (cents) to Rials
        // amount is in smallest unit (e.g., 1000 cents = 10 EUR)
        const amountInCurrency = amount / 100; // Convert to actual currency amount
        amountInRials = Math.round(amountInCurrency * conversionRate);
      }

      // Ensure minimum amount (1,000 Rials)
      amountInRials = Math.max(amountInRials, 1000);

      console.log("[ZARINPAL-initiatePayment] Converted amount:", {
        original: amount,
        currency: currency_code,
        conversionRate,
        rials: amountInRials
      })

      const metadata = paymentContext?.metadata || {};
      const description = metadata.description || this.description_;
      const mobile = metadata.mobile || "";

      // Build callback URL with order/cart ID
      const callbackUrl = `${this.callbackUrl_}?resource_id=${actualResourceId}`;

      // Offline test mode: short-circuit without external call
      if (offline) {
        this.logger_.info(
          `[zarinpal] initiatePayment(offline=true) | resource_id=${actualResourceId} amount_in_rials=${amountInRials}`
        )
        const testAuthority = `TEST_${Date.now()}`
        const testUrl = `https://example.com/offline-pay?auth=${testAuthority}`
        return {
          id: testAuthority,
          data: {
            authority: testAuthority,
            payment_url: testUrl,
            status: "pending",
            amount: amountInRials,
            currency_code: "IRR",
            resource_id: actualResourceId,
          },
        } as any
      }

      // Request payment from Zarinpal (online mode)
      this.logger_.info(
        `[zarinpal] initiatePayment(offline=false) | resource_id=${actualResourceId} amount_in_rials=${amountInRials}`
      )
      const requestData = {
        merchant_id: this.merchantId_,
        amount: amountInRials,
        description: description,
        callback_url: callbackUrl,
        metadata: {
          email: email || "",
          mobile: mobile,
        },
      };

      // Detailed logging for debugging
      this.logger_.info(`[zarinpal] === REQUEST TO ZARINPAL API ===`)
      this.logger_.info(`[zarinpal] URL: ${this.baseUrl_}/request.json`)
      this.logger_.info(`[zarinpal] Request Data: ${JSON.stringify(requestData, null, 2)}`)
      this.logger_.info(`[zarinpal] Amount in Rials: ${amountInRials}`)
      this.logger_.info(`[zarinpal] Minimum required: 1000 Rials`)
      this.logger_.info(`[zarinpal] Maximum allowed: 500,000,000 Rials`)
      this.logger_.info(`[zarinpal] Amount validation: ${amountInRials >= 1000 && amountInRials <= 500000000 ? 'VALID' : 'INVALID'}`)

      try {
        this.logger_.info(`[zarinpal] Sending request to Zarinpal...`)
        const response = await axios.post<ZarinpalRequestResponse>(
          `${this.baseUrl_}/request.json`,
          requestData,
          {
            timeout: 30000, // 30 second timeout
            headers: {
              'Content-Type': 'application/json',
              'User-Agent': 'Medusa-Zarinpal-Integration/1.0'
            }
          }
        );

        this.logger_.info(`[zarinpal] === RESPONSE FROM ZARINPAL API ===`)
        this.logger_.info(`[zarinpal] Status Code: ${response.status}`)
        this.logger_.info(`[zarinpal] Response Data: ${JSON.stringify(response.data, null, 2)}`)
        this.logger_.info(`[zarinpal] Response Code: ${response.data?.data?.code}`)
        this.logger_.info(`[zarinpal] Response Message: ${response.data?.data?.message}`)
        this.logger_.info(`[zarinpal] Authority: ${response.data?.data?.authority}`)

        if (response.data.data.code !== 100) {
          this.logger_.error(`[zarinpal] Zarinpal API Error - Code: ${response.data.data.code}, Message: ${response.data.data.message}`)
          throw new MedusaError(
            MedusaError.Types.INVALID_ARGUMENT,
            `Zarinpal API Error: ${response.data.data.message}`
          );
        }

        const authority = response.data.data.authority;
        const paymentUrl = this.sandbox_
          ? `https://sandbox.zarinpal.com/pg/StartPay/${authority}`
          : `https://www.zarinpal.com/pg/StartPay/${authority}`;

        this.logger_.info(`[zarinpal] initiatePayment success | authority=${authority} url=${paymentUrl}`)
        return {
          id: authority as string,
          data: {
            authority,
            payment_url: paymentUrl,
            status: "pending",
            amount: amountInRials,
            currency_code: "IRR",
            resource_id: actualResourceId,
          },
        } as any;
      } catch (error: any) {
        this.logger_.error(`[zarinpal] === ZARINPAL API CALL FAILED ===`)
        this.logger_.error(`[zarinpal] Error Type: ${error.constructor.name}`)
        this.logger_.error(`[zarinpal] Error Message: ${error.message}`)
        this.logger_.error(`[zarinpal] Error Status: ${error.response?.status}`)
        this.logger_.error(`[zarinpal] Error Response Data: ${JSON.stringify(error.response?.data || {}, null, 2)}`)
        this.logger_.error(`[zarinpal] Error Response Headers: ${JSON.stringify(error.response?.headers || {}, null, 2)}`)
        throw error;
      }

    } catch (error: any) {
      this.logger_.error(`[zarinpal] initiatePayment error: ${error?.message || "unknown"}`)
      this.logger_.error(`[zarinpal] Error details: ${JSON.stringify(error, null, 2)}`)
      throw error;
    }
  }

  async authorizePayment(input: AuthorizePaymentInput): Promise<AuthorizePaymentOutput> {
    try {
      const offline = this.offline_ || process.env.ZARINPAL_OFFLINE === "true"
      const authority = (input.context as any)?.authority ?? (input.data as any)?.authority;
      const status = (input.context as any)?.Status ?? (input.context as any)?.status;
      this.logger_.info(`[zarinpal] authorizePayment called | authority=${authority} status=${status} offline=${offline}`)

      // Check if payment was successful
      if (status !== "OK") {
        throw new MedusaError(MedusaError.Types.INVALID_ARGUMENT, "Payment was cancelled or failed");
      }

      // Offline test mode: bypass external verify
      if (offline && typeof authority === "string" && authority.startsWith("TEST_")) {
        this.logger_.info(`[zarinpal] authorizePayment offline success | authority=${authority}`)
        return {
          status: PaymentStatus.AUTHORIZED as any,
          data: {
            ...(input.data || {}),
            status: "verified",
            ref_id: `OFFLINE_REF_${Date.now()}`,
            card_pan: "0000-0000-0000-0000",
            verified_at: new Date().toISOString(),
          },
        } as any
      }

      // Verify payment with Zarinpal
      // Use the amount that was originally sent to Zarinpal (should be in Rials)
      const originalAmount = (input.data as any)?.amount || (input.context as any)?.amount;
      const verifyData = {
        merchant_id: this.merchantId_,
        amount: originalAmount,
        authority: authority,
      };

      this.logger_.info(`[zarinpal] === PAYMENT VERIFICATION ===`)
      this.logger_.info(`[zarinpal] URL: ${this.baseUrl_}/verify.json`)
      this.logger_.info(`[zarinpal] Verify Data: ${JSON.stringify(verifyData, null, 2)}`)
      this.logger_.info(`[zarinpal] Authority: ${authority}`)
      this.logger_.info(`[zarinpal] Amount: ${originalAmount} Rials`)
      this.logger_.info(`[zarinpal] Sending verification request...`)

      try {
        const response = await axios.post<ZarinpalVerifyResponse>(
          `${this.baseUrl_}/verify.json`,
          verifyData,
          {
            timeout: 30000,
            headers: {
              'Content-Type': 'application/json',
              'User-Agent': 'Medusa-Zarinpal-Integration/1.0'
            }
          }
        );

        this.logger_.info(`[zarinpal] === VERIFICATION RESPONSE ===`)
        this.logger_.info(`[zarinpal] Status Code: ${response.status}`)
        this.logger_.info(`[zarinpal] Response Data: ${JSON.stringify(response.data, null, 2)}`)
        this.logger_.info(`[zarinpal] Response Code: ${response.data?.data?.code}`)
        this.logger_.info(`[zarinpal] Response Message: ${response.data?.data?.message}`)
        this.logger_.info(`[zarinpal] Ref ID: ${response.data?.data?.ref_id}`)
        this.logger_.info(`[zarinpal] Card PAN: ${response.data?.data?.card_pan}`)

        if (response.data.data.code !== 100 && response.data.data.code !== 101) {
          this.logger_.error(`[zarinpal] Verification failed - Code: ${response.data.data.code}, Message: ${response.data.data.message}`)
          throw new MedusaError(
            MedusaError.Types.INVALID_ARGUMENT,
            response.data.data.message || "Payment verification failed"
          );
        }

        this.logger_.info(`[zarinpal] authorizePayment success | ref_id=${response.data.data.ref_id}`)
        return {
          status: PaymentStatus.AUTHORIZED as any,
          data: {
            ...(input.data || {}),
            status: "verified",
            ref_id: response.data.data.ref_id,
            card_pan: response.data.data.card_pan,
            verified_at: new Date().toISOString(),
          },
        } as any;
      } catch (error: any) {
        this.logger_.error(`[zarinpal] === VERIFICATION API CALL FAILED ===`)
        this.logger_.error(`[zarinpal] Error Type: ${error.constructor.name}`)
        this.logger_.error(`[zarinpal] Error Message: ${error.message}`)
        this.logger_.error(`[zarinpal] Error Status: ${error.response?.status}`)
        this.logger_.error(`[zarinpal] Error Response Data: ${JSON.stringify(error.response?.data || {}, null, 2)}`)
        this.logger_.error(`[zarinpal] Error Response Headers: ${JSON.stringify(error.response?.headers || {}, null, 2)}`)
        throw error;
      }

    } catch (error: any) {
      this.logger_.error(`[zarinpal] authorizePayment error: ${error?.message || "unknown"}`)
      throw error;
    }
  }

  async cancelPayment(input: CancelPaymentInput): Promise<CancelPaymentOutput> {
    this.logger_.info(`[zarinpal] cancelPayment called`)
    return {
      data: {
        ...(input.data || {}),
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
      },
    } as any;
  }

  async capturePayment(input: CapturePaymentInput): Promise<CapturePaymentOutput> {
    this.logger_.info(`[zarinpal] capturePayment called | status=${(input.data as any)?.status}`)
    // Zarinpal automatically captures on verification
    // This is just to mark it as captured in Medusa
    if ((input.data as any)?.status !== "verified") {
      throw new MedusaError(MedusaError.Types.INVALID_ARGUMENT, "Payment must be verified before capture");
    }

    return {
      data: {
        ...(input.data || {}),
        status: "paid",
        captured_at: new Date().toISOString(),
      },
    } as any;
  }

  async deletePayment(input: DeletePaymentInput): Promise<DeletePaymentOutput> {
    this.logger_.info(`[zarinpal] deletePayment called`)
    return {
      data: {
        ...(input.data || {}),
        status: "cancelled",
        deleted_at: new Date().toISOString(),
      },
    } as any;
  }

  async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentOutput> {
    // Note: Zarinpal doesn't have an automatic refund API
    // Refunds must be done manually through Zarinpal dashboard
    this.logger_.warn(
      "Zarinpal refund requested - must be processed manually through Zarinpal dashboard"
    );
    this.logger_.info(`[zarinpal] refundPayment called | amount=${input.amount}`)

    return {
      data: {
        ...(input.data || {}),
        refund_requested: true,
        refund_amount: input.amount,
        refund_requested_at: new Date().toISOString(),
        status: "refund_pending",
      },
    } as any;
  }

  async retrievePayment(input: RetrievePaymentInput): Promise<RetrievePaymentOutput> {
    this.logger_.info(`[zarinpal] retrievePayment called`)
    return { data: input.data } as any;
  }

  async updatePayment(input: UpdatePaymentInput): Promise<UpdatePaymentOutput> {
    this.logger_.info(`[zarinpal] updatePayment called`)
    return {
      data: {
        ...(input.data || {}),
        ...(input.context || {}),
      },
    } as any;
  }

  async getWebhookActionAndData(payload: ProviderWebhookPayload["payload"]): Promise<WebhookActionResult> {
    // Zarinpal doesn't have webhooks, verification is done via redirect
    return {
      action: "not_supported" as any,
      data: {
        session_id: "",
        amount: 0,
      },
    };
  }
}

export default ZarinpalProviderService;

