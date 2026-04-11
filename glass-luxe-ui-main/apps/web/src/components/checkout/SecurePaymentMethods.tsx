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
  disabled?: boolean;
}

// Feature flag: Temporarily disable Bank Mellat and Bank Saman
// Set to false to re-enable them
const DISABLED_GATEWAYS: PaymentGateway[] = ["mellat", "saman"];

function PaymentGatewayCard({ gateway, isSelected, onSelect, showValidation, disabled = false }: PaymentGatewayCardProps) {
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

  const handleClick = () => {
    if (!disabled) {
      onSelect();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        "w-full p-4 rounded-xl border-2 transition-all duration-200",
        "flex flex-col items-center gap-3 text-center relative overflow-hidden",
        "glass border-white/20",
        // Disabled state styles - stronger to ensure they're clearly disabled
        disabled && [
          "opacity-40 cursor-not-allowed",
          "pointer-events-none",
          "hover:border-white/20 hover:bg-transparent",
          "hover:opacity-40",
          "active:scale-100",
          "select-none",
        ],
        // Active state styles (only when not disabled)
        !disabled && [
          "hover:border-primary/40",
          "hover:bg-white/5 active:scale-[0.98]",
          "cursor-pointer",
        ],
        isSelected && !disabled && [
          "border-primary/80 bg-primary/10",
          "shadow-lg shadow-primary/20",
          "ring-2 ring-primary/30 ring-offset-2 ring-offset-transparent",
        ],
        showValidation && !isSelected && !disabled && "border-destructive/50"
      )}
      aria-pressed={isSelected && !disabled}
      aria-disabled={disabled}
      dir="rtl"
      style={disabled ? { pointerEvents: 'none' } : undefined}
    >
      {/* Gateway Logo - Right side (RTL) */}
      <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden relative p-0.5">
        {!logoError ? (
          <img
            src={gateway.logo}
            alt={gateway.nameEn}
            className="w-full h-full object-cover"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={() => setLogoError(true)}
            loading="lazy"
          />
        ) : (
          <span className="text-sm font-bold text-foreground">
            {getInitials(gateway.id)}
          </span>
        )}
      </div>

      {/* Gateway Info */}
      <div className="flex-1 min-w-0 w-full">
        <div className={cn(
          "font-semibold text-base mb-1",
          disabled ? "text-muted-foreground" : "text-foreground"
        )}>
          {gateway.name}
        </div>
        <div className={cn(
          "text-xs",
          disabled ? "text-muted-foreground/70" : "text-muted-foreground"
        )}>
          {gateway.description}
        </div>
      </div>

      {/* Disabled Overlay */}
      {disabled && (
        <div className="absolute inset-0 bg-background/20 backdrop-blur-[2px] rounded-xl flex items-center justify-center pointer-events-none">
          <span className="text-xs font-medium text-muted-foreground/80">
            غیرفعال
          </span>
        </div>
      )}

      {/* Checkmark Indicator - only show if selected and not disabled */}
      {!disabled && (
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
      )}
    </button>
  );
}

const paymentGateways = [
  {
    id: "zarinpal" as const,
    name: "زرین‌پال",
    nameEn: "Zarinpal",
    description: "پرداخت امن و معتبر",
    logo: "/logos/zarinpal-logo.png",
  },
  {
    id: "mellat" as const,
    name: "بانک ملت",
    nameEn: "Mellat Bank",
    description: "پرداخت سریع و مطمئن",
    logo: "/logos/mellat-bank-logo.png",
  },
  {
    id: "saman" as const,
    name: "بانک سامان",
    nameEn: "Saman Bank",
    description: "درگاه رسمی و امن",
    logo: "/logos/saman-bank-logo.png",
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
        {paymentGateways.map((gateway) => {
          const isDisabled = DISABLED_GATEWAYS.includes(gateway.id);
          // Don't show as selected if it's disabled
          const isSelected = !isDisabled && selectedGateway === gateway.id;
          return (
            <PaymentGatewayCard
              key={gateway.id}
              gateway={gateway}
              isSelected={isSelected}
              onSelect={() => {
                // Prevent selection of disabled gateways
                if (!isDisabled) {
                  onSelectGateway(gateway.id);
                }
              }}
              showValidation={showValidation}
              disabled={isDisabled}
            />
          );
        })}
      </div>

      {showValidation && !selectedGateway && (
        <p className="text-xs text-destructive text-center mt-3">
          لطفاً روش پرداخت را انتخاب کنید
        </p>
      )}

      {/* Informational text block below payment gateway cards */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          تمامی پرداخت‌ها از طریق درگاه‌های امن و رسمی بانکی انجام می‌شود.
          <br />
          اطلاعات کارت شما ذخیره نمی‌شود و مستقیماً به درگاه بانکی ارسال می‌گردد.
        </p>
      </div>
    </div>
  );
}

