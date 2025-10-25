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

    if (!this.merchantId_ && process.env.ZARINPAL_OFFLINE !== "true") {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Zarinpal merchant_id is required"
      );
    }
  }

  static validateOptions(options: Record<any, any>): void {
    if (!options.merchant_id && process.env.ZARINPAL_OFFLINE !== "true") {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Zarinpal requires merchant_id in options"
      );
    }
  }

  async getPaymentStatus(input: GetPaymentStatusInput): Promise<GetPaymentStatusOutput> {
    this.logger.info(
      `[zarinpal] getPaymentStatus called | data.status=${(input.data as any)?.status}`
    )
    const status = (input.data as any)?.status as string;
    switch (status) {
      case "verified":
      case "paid":
        this.logger.info(`[zarinpal] getPaymentStatus -> AUTHORIZED`)
        return { status: PaymentStatus.AUTHORIZED } as any;
      case "pending":
        this.logger.info(`[zarinpal] getPaymentStatus -> PENDING`)
        return { status: PaymentStatus.PENDING } as any;
      case "canceled":
      case "cancelled":
        this.logger.info(`[zarinpal] getPaymentStatus -> CANCELED`)
        return { status: PaymentStatus.CANCELED } as any;
      case "error":
        this.logger.info(`[zarinpal] getPaymentStatus -> ERROR`)
        return { status: PaymentStatus.ERROR } as any;
      default:
        this.logger.info(`[zarinpal] getPaymentStatus -> DEFAULT(PENDING)`)
        return { status: PaymentStatus.PENDING } as any;
    }
  }

  async initiatePayment(input: InitiatePaymentInput): Promise<InitiatePaymentOutput> {
    try {
      const offline = process.env.ZARINPAL_OFFLINE === "true"
      const { amount, currency_code, email, context: paymentContext, resource_id } = input as any;

      // Zarinpal works with Rials (IRR), convert from smallest unit
      const amountInRials = Math.round(amount / 10); // Convert from smallest unit to Rials

      const metadata = paymentContext?.metadata || {};
      const description = metadata.description || this.description_;
      const mobile = metadata.mobile || "";
      
      // Build callback URL with order/cart ID
      const callbackUrl = `${this.callbackUrl_}?resource_id=${resource_id}`;

      // Offline test mode: short-circuit without external call
      if (offline) {
        this.logger.info(
          `[zarinpal] initiatePayment(offline=true) | resource_id=${resource_id} amount_in_rials=${amountInRials}`
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
            resource_id,
          },
        } as any
      }

      // Request payment from Zarinpal (online mode)
      this.logger.info(
        `[zarinpal] initiatePayment(offline=false) | resource_id=${resource_id} amount_in_rials=${amountInRials}`
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

      this.logger.info(`[zarinpal] request -> /request.json | amount=${amountInRials}`)

      const response = await axios.post<ZarinpalRequestResponse>(
        `${this.baseUrl_}/request.json`,
        requestData
      );

      this.logger.info(`[zarinpal] response <- code=${response.data?.data?.code} message=${response.data?.data?.message}`)

      if (response.data.data.code !== 100) {
        throw new MedusaError(
          MedusaError.Types.INVALID_ARGUMENT,
          response.data.data.message || "Payment request failed"
        );
      }

      const authority = response.data.data.authority;
      const paymentUrl = this.sandbox_
        ? `https://sandbox.zarinpal.com/pg/StartPay/${authority}`
        : `https://www.zarinpal.com/pg/StartPay/${authority}`;

      this.logger.info(`[zarinpal] initiatePayment success | authority=${authority} url=${paymentUrl}`)
      return {
        id: authority as string,
        data: {
          authority,
          payment_url: paymentUrl,
          status: "pending",
          amount: amountInRials,
          currency_code: "IRR",
          resource_id,
        },
      } as any;
    } catch (error: any) {
      this.logger.error(`[zarinpal] initiatePayment error: ${error?.message || "unknown"}`)
      throw error;
    }
  }

  async authorizePayment(input: AuthorizePaymentInput): Promise<AuthorizePaymentOutput> {
    try {
      const offline = process.env.ZARINPAL_OFFLINE === "true"
      const authority = (input.context as any)?.authority ?? (input.data as any)?.authority;
      const status = (input.context as any)?.Status ?? (input.context as any)?.status;
      this.logger.info(`[zarinpal] authorizePayment called | authority=${authority} status=${status} offline=${offline}`)

      // Check if payment was successful
      if (status !== "OK") {
        throw new MedusaError(MedusaError.Types.INVALID_ARGUMENT, "Payment was cancelled or failed");
      }

      // Offline test mode: bypass external verify
      if (offline && typeof authority === "string" && authority.startsWith("TEST_")) {
        this.logger.info(`[zarinpal] authorizePayment offline success | authority=${authority}`)
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
      const verifyData = {
        merchant_id: this.merchantId_,
        amount: (input.data as any)?.amount as number,
        authority: authority,
      };
      this.logger.info(`[zarinpal] verify -> /verify.json | authority=${authority} amount=${(input.data as any)?.amount}`)

      const response = await axios.post<ZarinpalVerifyResponse>(
        `${this.baseUrl_}/verify.json`,
        verifyData
      );

      this.logger.info(`[zarinpal] verify response <- code=${response.data?.data?.code} message=${response.data?.data?.message}`)
      if (response.data.data.code !== 100 && response.data.data.code !== 101) {
        throw new MedusaError(
          MedusaError.Types.INVALID_ARGUMENT,
          response.data.data.message || "Payment verification failed"
        );
      }

      this.logger.info(`[zarinpal] authorizePayment success | ref_id=${response.data.data.ref_id}`)
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
      this.logger.error(`[zarinpal] authorizePayment error: ${error?.message || "unknown"}`)
      throw error;
    }
  }

  async cancelPayment(input: CancelPaymentInput): Promise<CancelPaymentOutput> {
    this.logger.info(`[zarinpal] cancelPayment called`)
    return {
      data: {
        ...(input.data || {}),
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
      },
    } as any;
  }

  async capturePayment(input: CapturePaymentInput): Promise<CapturePaymentOutput> {
    this.logger.info(`[zarinpal] capturePayment called | status=${(input.data as any)?.status}`)
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
    this.logger.info(`[zarinpal] deletePayment called`)
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
    this.logger.warn(
      "Zarinpal refund requested - must be processed manually through Zarinpal dashboard"
    );
    this.logger.info(`[zarinpal] refundPayment called | amount=${input.amount}`)

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
    this.logger.info(`[zarinpal] retrievePayment called`)
    return { data: input.data } as any;
  }

  async updatePayment(input: UpdatePaymentInput): Promise<UpdatePaymentOutput> {
    this.logger.info(`[zarinpal] updatePayment called`)
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

