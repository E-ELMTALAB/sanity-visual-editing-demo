import { Zap, Shield, Check, Headphones, Clock } from "lucide-react";
import { SurfaceGlass } from "@/components/ui/surface-glass";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface QuickSummaryItem {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  text: string;
}

const QUICK_SUMMARY_ITEMS: QuickSummaryItem[] = [
  {
    icon: Zap,
    text: "تحویل آنی",
  },
  {
    icon: Shield,
    text: "ضمانت تعویض",
  },
  {
    icon: Check,
    text: "اکانت‌های اصلی",
  },
  {
    icon: Headphones,
    text: "پشتیبانی ۲۴/۷",
  },
  {
    icon: Clock,
    text: "اتصال بدون VPN",
  },
];

const springTransition = {
  type: "spring" as const,
  stiffness: 220,
  damping: 28,
};

interface QuickSummaryTrustBarProps {
  className?: string;
}

export function QuickSummaryTrustBar({ className }: QuickSummaryTrustBarProps) {
  if (!QUICK_SUMMARY_ITEMS || QUICK_SUMMARY_ITEMS.length === 0) {
    return null;
  }

  return (
    <div dir="rtl" className={cn("max-w-[896px] mx-auto mb-8", className)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springTransition}
      >
        <SurfaceGlass
          variant="default"
          className={cn(
            "p-5 md:p-6 rounded-2xl",
            "shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
          )}
          style={{
            backdropFilter: "blur(12px)",
            background: "rgba(255,255,255,0.03)",
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          {/* Heading */}
          <h3 className="font-vazirmatn text-lg md:text-xl font-bold leading-[1.4] text-foreground text-center mb-5">
            چرا شریف‌جی‌پی‌تی؟
          </h3>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-3">
            {QUICK_SUMMARY_ITEMS.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center text-center"
                >
                  <Icon
                    className="h-5 w-5 md:h-6 md:w-6 text-primary mb-2"
                    strokeWidth={1.5}
                  />
                  <p className="font-vazirmatn text-xs md:text-sm font-normal leading-snug text-muted-foreground">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </SurfaceGlass>
      </motion.div>
    </div>
  );
}

export default QuickSummaryTrustBar;

