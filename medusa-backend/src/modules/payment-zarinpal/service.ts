import type { Logger, MedusaContainer } from "@medusajs/framework/types";
import { AbstractPaymentProvider } from "@medusajs/utils";
import { MedusaError, PaymentSessionStatus as PaymentStatus } from "@medusajs/framework/utils";
import axios from "axios";

// Local minimal fallbacks for provider-related types to avoid version/entrypoint mismatches
type PaymentProviderError = { error: string; code?: string; detail?: any };
type PaymentProviderSessionResponse = { data: Record<string, any> };
type PaymentSessionStatus = any;
type ProviderWebhookPayload = { payload: any };
type WebhookActionResult = { action: any; data?: { session_id: string; amount: number } };
type UpdatePaymentProviderSession = { data?: Record<string, any>; context?: Record<string, any> };

interface ZarinpalOptions {
  merchant_id: string;
  sandbox?: boolean;
  description?: string;
  callback_url?: string;
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
  protected merchantId_: string;
  protected sandbox_: boolean;
  protected description_: string;
  protected callbackUrl_: string;
  protected baseUrl_: string;
  protected logger: Logger;

  constructor(container: MedusaContainer, options: ZarinpalOptions) {
    super(container, options);
    this.logger = container.resolve("logger");

    this.merchantId_ = options.merchant_id;
    this.sandbox_ = options.sandbox ?? false;
    this.description_ = options.description ?? "Payment";
    this.callbackUrl_ = options.callback_url ?? "";

    // Set the appropriate base URL based on sandbox mode
    this.baseUrl_ = this.sandbox_
      ? "https://sandbox.zarinpal.com/pg/v4/payment"
      : "https://payment.zarinpal.com/pg/v4/payment";

    if (!this.merchantId_) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Zarinpal merchant_id is required"
      );
    }
  }

  static validateOptions(options: Record<any, any>): void {
    if (!options.merchant_id) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Zarinpal requires merchant_id in options"
      );
    }
  }

  async getPaymentStatus(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentSessionStatus> {
    const status = paymentSessionData.status as string;

    switch (status) {
      case "verified":
      case "paid":
        return PaymentStatus.AUTHORIZED;
      case "pending":
        return PaymentStatus.PENDING;
      case "canceled":
      case "cancelled":
        return PaymentStatus.CANCELED;
      case "error":
        return PaymentStatus.ERROR;
      default:
        return PaymentStatus.PENDING;
    }
  }

  async initiatePayment(
    context: any
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse> {
    try {
      const {
        amount,
        currency_code,
        email,
        context: paymentContext,
        resource_id,
      } = context;

      // Zarinpal works with Rials (IRR), convert from smallest unit
      const amountInRials = Math.round(amount / 10); // Convert from smallest unit to Rials

      const metadata = paymentContext?.metadata || {};
      const description = metadata.description || this.description_;
      const mobile = metadata.mobile || "";
      
      // Build callback URL with order/cart ID
      const callbackUrl = `${this.callbackUrl_}?resource_id=${resource_id}`;

      // Request payment from Zarinpal
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

      this.logger.info(
        `Zarinpal payment request: ${JSON.stringify(requestData)}`
      );

      const response = await axios.post<ZarinpalRequestResponse>(
        `${this.baseUrl_}/request.json`,
        requestData
      );

      this.logger.info(
        `Zarinpal response: ${JSON.stringify(response.data)}`
      );

      if (response.data.data.code !== 100) {
        return {
          error: response.data.data.message || "Payment request failed",
          code: response.data.data.code.toString(),
          detail: response.data,
        };
      }

      const authority = response.data.data.authority;
      const paymentUrl = this.sandbox_
        ? `https://sandbox.zarinpal.com/pg/StartPay/${authority}`
        : `https://www.zarinpal.com/pg/StartPay/${authority}`;

      return {
        data: {
          authority,
          payment_url: paymentUrl,
          status: "pending",
          amount: amountInRials,
          currency_code: "IRR",
          resource_id,
        },
      };
    } catch (error: any) {
      this.logger.error(
        `Zarinpal initiate payment error: ${error?.message || "unknown"}`
      );
      return {
        error: error.message || "Failed to initiate payment",
        code: "ZARINPAL_INIT_ERROR",
        detail: error.response?.data || error,
      };
    }
  }

  async authorizePayment(
    paymentSessionData: Record<string, unknown>,
    context: Record<string, unknown>
  ): Promise<
    | PaymentProviderError
    | { status: PaymentSessionStatus; data: PaymentProviderSessionResponse["data"] }
  > {
    try {
      const authority = context.authority as string;
      const status = context.Status as string;

      // Check if payment was successful
      if (status !== "OK") {
        return {
          error: "Payment was cancelled or failed",
          code: "PAYMENT_CANCELLED",
          detail: context,
        };
      }

      // Verify payment with Zarinpal
      const verifyData = {
        merchant_id: this.merchantId_,
        amount: paymentSessionData.amount as number,
        authority: authority,
      };

      const response = await axios.post<ZarinpalVerifyResponse>(
        `${this.baseUrl_}/verify.json`,
        verifyData
      );

      if (response.data.data.code !== 100 && response.data.data.code !== 101) {
        return {
          error: response.data.data.message || "Payment verification failed",
          code: response.data.data.code.toString(),
          detail: response.data,
        };
      }

      return {
        status: PaymentStatus.AUTHORIZED as any,
        data: {
          ...paymentSessionData,
          status: "verified",
          ref_id: response.data.data.ref_id,
          card_pan: response.data.data.card_pan,
          verified_at: new Date().toISOString(),
        } as any,
      };
    } catch (error: any) {
      this.logger.error(
        `Zarinpal authorize payment error: ${error?.message || "unknown"}`
      );
      return {
        error: error.message || "Failed to authorize payment",
        code: "ZARINPAL_AUTH_ERROR",
        detail: error.response?.data || error,
      };
    }
  }

  async cancelPayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]> {
    return {
      ...paymentSessionData,
      status: "cancelled",
      cancelled_at: new Date().toISOString(),
    };
  }

  async capturePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]> {
    // Zarinpal automatically captures on verification
    // This is just to mark it as captured in Medusa
    if (paymentSessionData.status !== "verified") {
      return {
        error: "Payment must be verified before capture",
        code: "INVALID_STATUS",
        detail: paymentSessionData,
      };
    }

    return {
      ...paymentSessionData,
      status: "paid",
      captured_at: new Date().toISOString(),
    };
  }

  async deletePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]> {
    return {
      ...paymentSessionData,
      status: "cancelled",
      deleted_at: new Date().toISOString(),
    };
  }

  async refundPayment(
    paymentSessionData: Record<string, unknown>,
    refundAmount: number
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]> {
    // Note: Zarinpal doesn't have an automatic refund API
    // Refunds must be done manually through Zarinpal dashboard
    this.logger.warn(
      "Zarinpal refund requested - must be processed manually through Zarinpal dashboard"
    );

    return {
      ...paymentSessionData,
      refund_requested: true,
      refund_amount: refundAmount,
      refund_requested_at: new Date().toISOString(),
      status: "refund_pending",
    };
  }

  async retrievePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]> {
    return paymentSessionData;
  }

  async updatePayment(
    context: UpdatePaymentProviderSession
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse> {
    return {
      data: {
        ...context.data,
        ...context.context,
      },
    };
  }

  async getWebhookActionAndData(
    payload: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult> {
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

