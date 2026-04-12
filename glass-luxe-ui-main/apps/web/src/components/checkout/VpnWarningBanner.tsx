import { AlertCircle } from "lucide-react";
import { SurfaceGlass } from "@/components/ui/surface-glass";

export function VpnWarningBanner() {
  return (
    <SurfaceGlass className="p-4 md:p-6 border-2 border-amber-500/30 bg-amber-500/5" dir="rtl">
      <div className="flex gap-4 items-start">
        <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-amber-900 text-lg mb-2">⚠️ توجه: درخواست VPN</h3>
          <p className="text-amber-900/90 text-sm md:text-base leading-relaxed mb-3">
            برای تکمیل پرداخت، <span className="font-semibold">لطفاً VPN خود را خاموش کنید</span> قبل از رفتن به درگاه زرین‌پال.
          </p>
          <div className="space-y-2 text-sm md:text-base">
            <p className="text-amber-900/90">
              <span className="font-semibold">مراحل:</span>
            </p>
            <ol className="list-decimal list-inside space-y-1 text-amber-900/85 ml-2">
              <li>VPN خود را خاموش کنید</li>
              <li>بر روی دکمه "پرداخت نهایی" کلیک کنید</li>
              <li>در درگاه زرین‌پال پرداخت را تکمیل کنید</li>
              <li>پس از موفقیت، می‌توانید دوباره VPN را روشن کنید</li>
            </ol>
          </div>
          <p className="text-amber-900/90 text-sm mt-3">
            یک <span className="font-semibold">کد تراکنش</span> پس از پرداخت دریافت خواهید کرد که می‌توانید به پشتیبانی ارائه دهید.
          </p>
        </div>
      </div>
    </SurfaceGlass>
  );
}
