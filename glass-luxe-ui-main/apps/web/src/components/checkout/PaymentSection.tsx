import { Button } from "@/components/ui/button";
import { SurfaceGlass } from "@/components/ui/surface-glass";
import { SecurePaymentMethods, PaymentGateway } from "./SecurePaymentMethods";
import { Loader2, ShieldCheck } from "lucide-react";

interface PaymentSectionProps {
  selectedGateway: PaymentGateway;
  onSelectGateway: (gateway: PaymentGateway) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  showGatewayValidation?: boolean;
}

export function PaymentSection({
  selectedGateway,
  onSelectGateway,
  onSubmit,
  isLoading,
  showGatewayValidation = false,
}: PaymentSectionProps) {
  return (
    <SurfaceGlass className="p-6 md:p-8" dir="rtl">
      {/* Section Title with Shield Icon */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/20 border border-primary/30">
          <ShieldCheck className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">درگاه‌های پرداخت امن</h2>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Payment Gateway Selector */}
        <SecurePaymentMethods
          selectedGateway={selectedGateway}
          onSelectGateway={onSelectGateway}
          showValidation={showGatewayValidation}
        />

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            size="lg"
            className="w-full text-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin ml-2" />
                در حال پردازش...
              </>
            ) : (
              "پرداخت نهایی"
            )}
          </Button>
        </div>
      </form>
    </SurfaceGlass>
  );
}

