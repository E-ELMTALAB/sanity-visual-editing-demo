import { useState } from "react";
import { Check, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

export type PaymentGateway = "zarinpal" | "saman" | "mellat" | null;

interface SecurePaymentMethodsProps {
  selectedGateway: PaymentGateway;
  onSelectGateway: (gateway: PaymentGateway) => void;
  showValidation?: boolean;
}

interface PaymentGatewayCardProps {
  gateway: {
    id: PaymentGateway;
    name: string;
    nameEn: string;
    description: string;
    logo: string;
  };
  isSelected: boolean;
  onSelect: () => void;
  showValidation: boolean;
}

function PaymentGatewayCard({ gateway, isSelected, onSelect, showValidation }: PaymentGatewayCardProps) {
  const [logoError, setLogoError] = useState(false);

  // Get initials for fallback
  const getInitials = (id: PaymentGateway) => {
    switch (id) {
      case "zarinpal":
        return "ZP";
      case "saman":
        return "SB";
      case "mellat":
        return "MB";
      default:
        return "";
    }
  };

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full p-4 rounded-xl border-2 transition-all duration-200",
        "flex flex-col items-center gap-3 text-center relative overflow-hidden",
        "glass border-white/20 hover:border-primary/40",
        "hover:bg-white/5 active:scale-[0.98]",
        isSelected && [
          "border-primary/80 bg-primary/10",
          "shadow-lg shadow-primary/20",
          "ring-2 ring-primary/30 ring-offset-2 ring-offset-transparent",
        ],
        showValidation && !isSelected && "border-destructive/50"
      )}
      aria-pressed={isSelected}
      dir="rtl"
    >
      {/* Gateway Logo - Right side (RTL) */}
      <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden relative">
        {!logoError ? (
          <img
            src={gateway.logo}
            alt={gateway.nameEn}
            className="w-full h-full object-contain p-2"
            onError={() => setLogoError(true)}
          />
        ) : (
          <span className="text-sm font-bold text-foreground">
            {getInitials(gateway.id)}
          </span>
        )}
      </div>

      {/* Gateway Info */}
      <div className="flex-1 min-w-0 w-full">
        <div className="font-semibold text-base text-foreground mb-1">
          {gateway.name}
        </div>
        <div className="text-xs text-muted-foreground">
          {gateway.description}
        </div>
      </div>

      {/* Checkmark Indicator */}
      <div
        className={cn(
          "absolute top-2 left-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
          isSelected
            ? "border-primary bg-primary"
            : "border-white/30 bg-transparent"
        )}
      >
        {isSelected && (
          <Check className="w-4 h-4 text-white animate-in fade-in zoom-in-50 duration-200" />
        )}
      </div>
    </button>
  );
}

const paymentGateways = [
  {
    id: "zarinpal" as const,
    name: "زرین‌پال",
    nameEn: "Zarinpal",
    description: "پرداخت امن و معتبر",
    logo: "https://www.zarinpal.com/static/images/logo.svg",
  },
  {
    id: "saman" as const,
    name: "بانک سامان",
    nameEn: "Saman Bank",
    description: "درگاه رسمی و امن",
    logo: "https://www.sb24.com/Content/images/logo.png",
  },
  {
    id: "mellat" as const,
    name: "بانک ملت",
    nameEn: "Mellat Bank",
    description: "پرداخت سریع و مطمئن",
    logo: "https://www.bankmellat.ir/Content/images/logo.png",
  },
];

export function SecurePaymentMethods({
  selectedGateway,
  onSelectGateway,
  showValidation = false,
}: SecurePaymentMethodsProps) {
  return (
    <div dir="rtl">
      {/* Grid Layout: 1 column on mobile, 3 columns on desktop/tablet */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {paymentGateways.map((gateway) => (
          <PaymentGatewayCard
            key={gateway.id}
            gateway={gateway}
            isSelected={selectedGateway === gateway.id}
            onSelect={() => onSelectGateway(gateway.id)}
            showValidation={showValidation}
          />
        ))}
      </div>

      {showValidation && !selectedGateway && (
        <p className="text-xs text-destructive text-center mt-3">
          لطفاً روش پرداخت را انتخاب کنید
        </p>
      )}
    </div>
  );
}

