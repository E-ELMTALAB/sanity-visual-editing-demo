import { Sparkles, Gift } from "lucide-react";
import { cn } from "@/lib/utils";
import { CountdownTimer } from "@/components/ui/countdown-timer";
import { type MedusaPromotion, getDiscountLabel } from "@/lib/medusa-promotions";

interface PromotionBannerProps {
  promotion: MedusaPromotion;
  className?: string;
  variant?: 'hero' | 'strip' | 'floating';
}

/**
 * Hero-style promotion banner - large, prominent display
 */
function HeroBanner({ promotion, className }: { promotion: MedusaPromotion; className?: string }) {
  const discountLabel = getDiscountLabel(promotion);
  const hasTimeLimit = !!promotion.campaign?.ends_at;

  return (
    <div
      className={cn(
        "animate-fadeIn",
        "relative overflow-hidden rounded-2xl",
        "bg-gradient-to-r from-red-600/90 via-red-500/80 to-orange-500/90",
        "border border-red-400/30 backdrop-blur-sm",
        "p-6 md:p-8",
        className
      )}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-red-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Promotion info */}
        <div className="flex items-center gap-4 text-center md:text-right">
          <div className="hidden md:flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm">
            <Gift className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center md:justify-start mb-1">
              <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
              <span className="text-yellow-200 text-sm font-medium">پیشنهاد ویژه</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-white">
              {promotion.title || discountLabel}
            </h3>
            {promotion.description && (
              <p className="text-white/80 text-sm mt-1 max-w-md">
                {promotion.description}
              </p>
            )}
          </div>
        </div>

        {/* Right: Countdown timer */}
        {hasTimeLimit && (
          <div className="flex flex-col items-center gap-2">
            <span className="text-white/80 text-sm font-medium">زمان باقی‌مانده:</span>
            <CountdownTimer
              endsAt={promotion.campaign!.ends_at}
              size="lg"
              variant="glass"
              showLabels={true}
            />
          </div>
        )}
      </div>

      {/* Discount badge */}
      <div className="absolute -top-2 -left-2 md:top-4 md:left-4 animate-fadeIn">
        <div className="bg-yellow-400 text-red-900 font-black text-lg md:text-xl px-4 py-2 rounded-full shadow-lg transform">
          {discountLabel}
        </div>
      </div>
    </div>
  );
}

/**
 * Strip-style promotion banner - thin bar across the page
 */
function StripBanner({ promotion, className }: { promotion: MedusaPromotion; className?: string }) {
  const discountLabel = getDiscountLabel(promotion);
  const hasTimeLimit = !!promotion.campaign?.ends_at;

  return (
    <div
      className={cn(
        "animate-fadeIn",
        "w-full py-3 px-4",
        "bg-gradient-to-r from-red-600 via-red-500 to-red-600",
        "border-y border-red-400/30",
        className
      )}
    >
      <div className="max-w-screen-xl mx-auto flex items-center justify-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
          <span className="text-white font-bold">{discountLabel}</span>
          {promotion.title && (
            <>
              <span className="text-white/60">|</span>
              <span className="text-white/90">{promotion.title}</span>
            </>
          )}
        </div>

        {hasTimeLimit && (
          <>
            <span className="text-white/60 hidden sm:inline">|</span>
            <div className="flex items-center gap-2">
              <span className="text-white/80 text-sm">تا پایان:</span>
              <CountdownTimer
                endsAt={promotion.campaign!.ends_at}
                size="sm"
                variant="glass"
                showLabels={false}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Floating promotion banner - fixed position badge
 */
function FloatingBanner({ promotion, className }: { promotion: MedusaPromotion; className?: string }) {
  const discountLabel = getDiscountLabel(promotion);
  const hasTimeLimit = !!promotion.campaign?.ends_at;

  return (
    <div
      className={cn(
        "animate-slideInRight",
        "fixed bottom-24 right-4 z-40",
        "bg-gradient-to-br from-red-600 to-red-700",
        "rounded-2xl shadow-2xl shadow-red-900/50",
        "border border-red-400/30 backdrop-blur-sm",
        "p-4 max-w-xs",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <Gift className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-1">
            <Sparkles className="w-3 h-3 text-yellow-300" />
            <span className="text-yellow-200 text-xs font-medium">تخفیف ویژه</span>
          </div>
          <p className="text-white font-bold text-sm truncate">
            {discountLabel}
          </p>
          {hasTimeLimit && (
            <div className="mt-2">
              <CountdownTimer
                endsAt={promotion.campaign!.ends_at}
                size="sm"
                variant="default"
                showLabels={false}
                showIcon={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function PromotionBanner({ promotion, className, variant = 'hero' }: PromotionBannerProps) {
  switch (variant) {
    case 'strip':
      return <StripBanner promotion={promotion} className={className} />;
    case 'floating':
      return <FloatingBanner promotion={promotion} className={className} />;
    case 'hero':
    default:
      return <HeroBanner promotion={promotion} className={className} />;
  }
}

export default PromotionBanner;

