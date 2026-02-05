import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SurfaceGlass } from "@/components/ui/surface-glass";
import { SecurePaymentMethods, PaymentGateway } from "./SecurePaymentMethods";
import { Loader2 } from "lucide-react";

interface PaymentSectionProps {
  selectedGateway: PaymentGateway;
  onSelectGateway: (gateway: PaymentGateway) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  showGatewayValidation?: boolean;
}

const gatewayNames: Record<NonNullable<PaymentGateway>, string> = {
  zarinpal: "زرین‌پال",
  idpay: "آی‌دی پی",
};

export function PaymentSection({
  selectedGateway,
  onSelectGateway,
  onSubmit,
  isLoading,
  showGatewayValidation = false,
}: PaymentSectionProps) {
  return (
    <SurfaceGlass className="p-6 md:p-8" dir="rtl">
      <h2 className="text-2xl font-bold mb-6 text-foreground">پرداخت</h2>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Payment Gateway Selector */}
        <SecurePaymentMethods
          selectedGateway={selectedGateway}
          onSelectGateway={onSelectGateway}
          showValidation={showGatewayValidation}
        />

        {/* Dynamic Gateway Feedback Message */}
        <AnimatePresence mode="wait">
          {selectedGateway && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="p-4 rounded-lg bg-primary/5 border border-primary/20 text-center"
            >
              <p className="text-sm text-foreground">
                پرداخت از طریق درگاه{" "}
                <span className="font-semibold text-primary">
                  {gatewayNames[selectedGateway]}
                </span>{" "}
                انجام خواهد شد
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
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
      </form>
    </SurfaceGlass>
  );
}

