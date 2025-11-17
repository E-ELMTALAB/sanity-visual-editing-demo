import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useDirection } from "@/contexts/DirectionContext";

interface PriceProps {
  old?: number;
  current: number;
  currency?: string;
  className?: string;
  locale?: string;
}

const springTransition = {
  type: "spring" as const,
  stiffness: 220,
  damping: 28,
};

export function Price({
  old,
  current,
  currency = "تومان",
  className,
  locale,
}: PriceProps) {
  const { isRTL } = useDirection();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale || (isRTL ? "fa-IR" : "en-US")).format(
      price
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springTransition}
      className={cn(
        "flex items-baseline gap-2",
        isRTL ? "flex-row-reverse" : "flex-row",
        className
      )}
    >
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl sm:text-3xl font-bold text-primary">
          {formatPrice(current)}
        </span>
        <span className="text-sm text-muted-foreground font-medium">
          {currency}
        </span>
      </div>
      {old && (
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg text-muted-foreground line-through opacity-60">
            {formatPrice(old)}
          </span>
          <span className="text-xs text-muted-foreground opacity-60">
            {currency}
          </span>
        </div>
      )}
    </motion.div>
  );
}
