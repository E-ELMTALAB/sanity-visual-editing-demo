import { useState } from "react";
import { CreditCard, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export type PaymentGateway = "zarinpal" | "idpay" | null;

interface SecurePaymentMethodsProps {
  selectedGateway: PaymentGateway;
  onSelectGateway: (gateway: PaymentGateway) => void;
  showValidation?: boolean;
}

const paymentGateways = [
  {
    id: "zarinpal" as const,
    name: "زرین‌پال",
    nameEn: "Zarinpal",
    description: "پرداخت امن و سریع",
    icon: ShieldCheck,
  },
  {
    id: "idpay" as const,
    name: "آی‌دی پی",
    nameEn: "IDPay",
    description: "درگاه پرداخت معتبر",
    icon: CreditCard,
  },
];

export function SecurePaymentMethods({
  selectedGateway,
  onSelectGateway,
  showValidation = false,
}: SecurePaymentMethodsProps) {
  return (
    <div className="space-y-3" dir="rtl">
      {paymentGateways.map((gateway) => {
        const Icon = gateway.icon;
        const isSelected = selectedGateway === gateway.id;

        return (
          <button
            key={gateway.id}
            type="button"
            onClick={() => onSelectGateway(gateway.id)}
            className={cn(
              "w-full p-4 rounded-lg border transition-all duration-200 text-right",
              "flex items-center gap-4",
              "glass border-white/20 hover:border-primary/40",
              isSelected && "border-primary/60 bg-primary/5",
              showValidation && !selectedGateway && "border-destructive/50"
            )}
            aria-pressed={isSelected}
          >
            <div
              className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                isSelected
                  ? "border-primary bg-primary"
                  : "border-white/40 bg-transparent"
              )}
            >
              {isSelected && (
                <div className="w-2.5 h-2.5 rounded-full bg-white" />
              )}
            </div>
            <Icon className="w-6 h-6 text-primary flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-foreground">
                {gateway.name}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {gateway.description}
              </div>
            </div>
          </button>
        );
      })}

      {showValidation && !selectedGateway && (
        <p className="text-xs text-destructive text-center mt-2">
          لطفاً روش پرداخت را انتخاب کنید
        </p>
      )}
    </div>
  );
}

