import * as React from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface BonusBarProps {
  className?: string;
}

export function BonusBar({ className }: BonusBarProps) {
  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <div
          dir="rtl"
          className={cn(
            "glass flex items-center gap-3 px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl",
            "border border-green-500/20 hover:border-green-500/35",
            "transition-all duration-200",
            "cursor-default relative overflow-hidden group",
            "min-h-[44px] sm:min-h-[48px]",
            className
          )}
        >
          {/* Gradient Background */}
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-200"
            style={{
              background: "linear-gradient(to left, rgba(34,197,94,0.08), transparent, transparent)",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-200 opacity-0 group-hover:opacity-100"
            style={{
              background: "linear-gradient(to left, rgba(34,197,94,0.12), transparent, transparent)",
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex items-center gap-3 w-full">
            {/* Gift Emoji with Pulse Animation */}
            <span className="text-xl sm:text-2xl shrink-0 animate-pulse-emoji">
              🎁
            </span>

            {/* Content Column */}
            <div className="flex-1 min-w-0 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-[13px] sm:text-sm font-semibold text-foreground/95 leading-[1.4] truncate">
                  هدیه همراه خرید
                </div>
                <div className="text-[11px] sm:text-xs text-muted-foreground leading-[1.4] truncate">
                  راهنمای کامل استفاده از محصول (PDF رایگان)
                </div>
              </div>

              {/* Bonus Badge */}
              <div className="shrink-0 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-green-500/15 border border-green-500/25">
                <span className="text-[10px] sm:text-[11px] font-semibold text-green-400 leading-none">
                  Bonus
                </span>
              </div>
            </div>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        align="center"
        className="max-w-[220px] text-center text-xs leading-[1.4]"
      >
        <p>این راهنمای PDF بلافاصله پس از خرید به ایمیل شما ارسال می‌شود</p>
      </TooltipContent>
    </Tooltip>
  );
}


















