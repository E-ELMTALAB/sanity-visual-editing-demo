import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTimeRemaining, toPersianNumber } from "@/lib/medusa-promotions";

interface CountdownTimerProps {
  endsAt: string;  // ISO date string
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onExpire?: () => void;
  showIcon?: boolean;
  showLabels?: boolean;
  variant?: 'default' | 'urgent' | 'glass';
}

const sizeClasses = {
  sm: {
    container: 'gap-1.5 px-2 py-1',
    digit: 'text-xs font-bold min-w-[20px]',
    label: 'text-[9px]',
    separator: 'text-xs',
    icon: 'w-3 h-3',
  },
  md: {
    container: 'gap-2 px-3 py-2',
    digit: 'text-sm font-bold min-w-[28px]',
    label: 'text-[10px]',
    separator: 'text-sm',
    icon: 'w-4 h-4',
  },
  lg: {
    container: 'gap-3 px-5 py-4',
    digit: 'text-xl sm:text-2xl font-extrabold min-w-[40px] sm:min-w-[44px]',
    label: 'text-xs sm:text-sm',
    separator: 'text-xl sm:text-2xl',
    icon: 'w-5 h-5 sm:w-6 sm:h-6',
  },
};

const variantClasses = {
  default: 'bg-red-500/20 border-red-500/40 text-red-400',
  urgent: 'bg-red-600/30 border-red-500/60 text-red-300 animate-pulse',
  glass: 'glass border-white/20 text-white/90 bg-gradient-to-br from-white/10 to-white/5',
};

export function CountdownTimer({
  endsAt,
  size = 'md',
  className,
  onExpire,
  showIcon = true,
  showLabels = true,
  variant = 'default',
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeRemaining(endsAt));
  const [isExpired, setIsExpired] = useState(false);

  const updateTimer = useCallback(() => {
    const remaining = getTimeRemaining(endsAt);
    setTimeLeft(remaining);
    
    if (remaining.expired && !isExpired) {
      setIsExpired(true);
      onExpire?.();
    }
  }, [endsAt, isExpired, onExpire]);

  useEffect(() => {
    // Initial update
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [updateTimer]);

  // Don't render if expired
  if (isExpired) {
    return null;
  }

  const sizes = sizeClasses[size];

  // Determine if we should show urgent styling (less than 1 hour remaining)
  const isUrgent = timeLeft.total < 60 * 60 * 1000;
  const finalVariant = isUrgent && variant === 'default' ? 'urgent' : variant;
  const finalVariantClass = variantClasses[finalVariant];

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <motion.span
        key={value}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          sizes.digit, 
          "tabular-nums text-center font-bold",
          finalVariant === 'glass' ? "text-white font-extrabold" : ""
        )}
      >
        {toPersianNumber(value).padStart(2, '۰')}
      </motion.span>
      {showLabels && (
        <span className={cn(
          sizes.label, 
          "font-medium",
          finalVariant === 'glass' ? "text-white/70" : "text-white/60"
        )}>
          {label}
        </span>
      )}
    </div>
  );

  const Separator = () => (
    <span className={cn(
      sizes.separator, 
      "font-bold self-start mt-0.5",
      finalVariant === 'glass' ? "text-white/50" : "text-white/40"
    )}>
      :
    </span>
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={cn(
          "inline-flex items-center rounded-lg border backdrop-blur-sm",
          sizes.container,
          finalVariantClass,
          className
        )}
        dir="ltr"
      >
        {showIcon && (
          <Clock className={cn(
            sizes.icon, 
            "mr-1.5 animate-pulse",
            finalVariant === 'glass' ? "text-white/80" : ""
          )} />
        )}
        
        <div className="flex items-center gap-1">
          {timeLeft.days > 0 && (
            <>
              <TimeUnit value={timeLeft.days} label="روز" />
              <Separator />
            </>
          )}
          <TimeUnit value={timeLeft.hours} label="ساعت" />
          <Separator />
          <TimeUnit value={timeLeft.minutes} label="دقیقه" />
          <Separator />
          <TimeUnit value={timeLeft.seconds} label="ثانیه" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Compact countdown timer for product cards
 */
export function CompactCountdownTimer({
  endsAt,
  className,
  onExpire,
}: {
  endsAt: string;
  className?: string;
  onExpire?: () => void;
}) {
  // Validate endsAt date before using it
  const isValidDate = endsAt && !isNaN(new Date(endsAt).getTime());
  
  const [timeLeft, setTimeLeft] = useState(() => {
    if (!isValidDate) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0, expired: true };
    }
    return getTimeRemaining(endsAt);
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!isValidDate) {
      setIsExpired(true);
      return;
    }

    const updateTimer = () => {
      try {
        const remaining = getTimeRemaining(endsAt);
        setTimeLeft(remaining);
        
        if (remaining.expired && !isExpired) {
          setIsExpired(true);
          onExpire?.();
        }
      } catch (error) {
        console.error('[CompactCountdownTimer] Error updating timer:', error);
        setIsExpired(true);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [endsAt, isExpired, onExpire, isValidDate]);

  if (isExpired || !isValidDate) return null;

  const isUrgent = timeLeft.total < 60 * 60 * 1000; // Less than 1 hour

  // Format full countdown: days (if > 0), hours, minutes, seconds
  // Format should be: "۱۳:۰۱:۱۴:۳۲" (13:01:14:32) if days > 0, or "۰۱:۱۴:۳۲" (01:14:32) if no days
  const formattedHours = toPersianNumber(timeLeft.hours).padStart(2, '۰');
  const formattedMinutes = toPersianNumber(timeLeft.minutes).padStart(2, '۰');
  const formattedSeconds = toPersianNumber(timeLeft.seconds).padStart(2, '۰');
  const timePart = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  
  return (
    <motion.div
      key={endsAt} // Unique key for each timer instance
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap",
        isUrgent 
          ? "bg-red-500/30 text-red-300 animate-pulse" 
          : "bg-red-500/20 text-red-400",
        className
      )}
      dir="ltr"
      style={{ direction: 'ltr' }}
    >
      <Clock className="w-3 h-3 flex-shrink-0" />
      <span className="tabular-nums flex items-center gap-0.5" dir="ltr" style={{ direction: 'ltr' }}>
        {timeLeft.days > 0 && (
          <span>{toPersianNumber(timeLeft.days)}:</span>
        )}
        <span>{timePart}</span>
      </span>
    </motion.div>
  );
}

export default CountdownTimer;

