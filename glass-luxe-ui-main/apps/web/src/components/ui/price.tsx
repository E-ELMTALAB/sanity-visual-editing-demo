import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useDirection } from "@/contexts/DirectionContext";
import { toPersianNumber } from "@/lib/medusa-promotions";

interface PriceProps {
  old?: number;
  current: number;
  currency?: string;
  className?: string;
  locale?: string;
  discountPercentage?: number;
  showDiscountBadge?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'promotional';
}

const springTransition = {
  type: "spring" as const,
  stiffness: 220,
  damping: 28,
};

const sizeClasses = {
  sm: {
    current: 'text-lg sm:text-xl',
    currency: 'text-xs',
    old: 'text-sm',
    badge: 'text-[10px] px-1.5 py-0.5',
  },
  md: {
    current: 'text-2xl sm:text-3xl',
    currency: 'text-sm',
    old: 'text-lg',
    badge: 'text-xs px-2 py-1',
  },
  lg: {
    current: 'text-3xl sm:text-4xl',
    currency: 'text-base',
    old: 'text-xl',
    badge: 'text-sm px-2.5 py-1',
  },
};

export function Price({
  old,
  current,
  currency = "تومان",
  className,
  locale,
  discountPercentage,
  showDiscountBadge = true,
  size = 'md',
  variant = 'default',
}: PriceProps) {
  const { isRTL } = useDirection();
  const sizes = sizeClasses[size];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale || (isRTL ? "fa-IR" : "en-US")).format(
      price
    );
  };

  const hasDiscount = old && old > current;
  const calculatedDiscountPercentage = discountPercentage || 
    (hasDiscount ? Math.round(((old - current) / old) * 100) : undefined);

  const isPromotional = variant === 'promotional' || hasDiscount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springTransition}
      className={cn(
        "flex items-baseline gap-2 flex-wrap",
        isRTL ? "flex-row-reverse" : "flex-row",
        className
      )}
    >
      {/* Discount Badge */}
      {showDiscountBadge && calculatedDiscountPercentage && calculatedDiscountPercentage > 0 && (
        <motion.span
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={cn(
            "inline-flex items-center rounded-full bg-red-500 text-white font-bold",
            sizes.badge
          )}
        >
          {toPersianNumber(calculatedDiscountPercentage)}٪
        </motion.span>
      )}

      {/* Current Price */}
      <div className="flex items-baseline gap-1.5">
        <span className={cn(
          sizes.current,
          "font-bold",
          isPromotional ? "text-green-400" : "text-primary"
        )}>
          {formatPrice(current)}
        </span>
        <span className={cn(sizes.currency, "text-muted-foreground font-medium")}>
          {currency}
        </span>
      </div>

      {/* Original Price (strikethrough) */}
      {old && old > current && (
        <div className="flex items-baseline gap-1.5">
          <span className={cn(sizes.old, "text-muted-foreground line-through opacity-60")}>
            {formatPrice(old)}
          </span>
          <span className="text-xs text-muted-foreground opacity-60">
            {currency}
          </span>
        </div>
      )}

      {/* Savings indicator */}
      {hasDiscount && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xs text-green-400 font-medium"
        >
          ({formatPrice(old - current)} تومان صرفه‌جویی)
        </motion.span>
      )}
    </motion.div>
  );
}

/**
 * Compact price display for cards and lists
 */
export function CompactPrice({
  current,
  old,
  discountPercentage,
  className,
}: {
  current: number;
  old?: number;
  discountPercentage?: number;
  className?: string;
}) {
  const { isRTL } = useDirection();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(isRTL ? "fa-IR" : "en-US").format(price);
  };

  const hasDiscount = old && old > current;

  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      {/* Original price with strikethrough */}
      {hasDiscount && (
        <span className="text-xs text-white/60 line-through">
          {formatPrice(old)} تومان
        </span>
      )}
      {/* Current price */}
      <div className="flex items-baseline gap-1.5">
        <span className={cn(
          "text-lg font-bold",
          hasDiscount ? "text-green-400" : "text-white/95"
        )}>
          {formatPrice(current)}
        </span>
        <span className="text-xs text-white/70">تومان</span>
        {discountPercentage && discountPercentage > 0 && (
          <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold">
            {toPersianNumber(discountPercentage)}٪
          </span>
        )}
      </div>
    </div>
  );
}
