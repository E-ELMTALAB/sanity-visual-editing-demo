import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SurfaceGlass } from "@/components/ui/surface-glass";

interface TransactionReferenceDisplayProps {
  referenceId: string;
  onClose?: () => void;
}

export function TransactionReferenceDisplay({ referenceId, onClose }: TransactionReferenceDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(referenceId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <SurfaceGlass className="p-4 md:p-6 border-2 border-green-500/30 bg-green-500/5" dir="rtl">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-bold text-green-900 text-lg">✅ کد تراکنش شما</h3>
          {onClose && (
            <button onClick={onClose} className="text-green-900/60 hover:text-green-900 transition-colors">
              ✕
            </button>
          )}
        </div>

        <div className="bg-white/10 border border-green-500/20 rounded-lg p-4 flex items-center justify-between gap-3">
          <code className="font-mono text-lg font-bold text-green-700 break-all flex-1">
            {referenceId}
          </code>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            className="shrink-0 gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                کپی شد
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                کپی
              </>
            )}
          </Button>
        </div>

        <div className="text-sm text-green-900/90 space-y-2">
          <p>
            <span className="font-semibold">این کد خود را ذخیره کنید.</span> پس از تکمیل پرداخت، می‌توانید این کد را به پشتیبانی ارائه دهید.
          </p>
          <p>
            شماره پشتیبانی: <span className="font-semibold ltr:font-normal">support@sharifgpt.com</span>
          </p>
        </div>
      </div>
    </SurfaceGlass>
  );
}
