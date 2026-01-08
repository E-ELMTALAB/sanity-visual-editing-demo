import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface BonusGiftBoxProps {
  title?: string;
  subtitle?: string;
  tooltipText?: string;
  className?: string;
}

export function BonusGiftBox({
  title = "هدیه همراه خرید",
  subtitle = "راهنمای نوشتن پرامپت (PDF) — رایگان",
  tooltipText = "این فایل PDF بلافاصله پس از خرید در پنل کاربری شما قابل دانلود خواهد بود.",
  className,
}: BonusGiftBoxProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            dir="rtl"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={cn(
              "relative py-3 px-3 sm:px-4 rounded-xl border transition-all duration-200",
              "flex items-center gap-3 cursor-default",
              "glass backdrop-blur-sm",
              className
            )}
            style={{
              background: isHovered
                ? "linear-gradient(to left, rgba(34,197,94,0.12), transparent, transparent)"
                : "linear-gradient(to left, rgba(34,197,94,0.08), transparent, transparent)",
              borderColor: isHovered ? "rgba(34,197,94,0.35)" : "rgba(34,197,94,0.2)",
            }}
          >
            {/* Emoji Icon */}
            <span className="text-xl sm:text-2xl shrink-0" aria-hidden="true">
              🎁
            </span>

            {/* Content */}
            <div className="flex-1 min-w-0 flex flex-col gap-0.5">
              {/* Title with Badge */}
              <div className="flex items-center gap-2 flex-row-reverse justify-start">
                <Badge
                  className={cn(
                    "shrink-0 bg-[rgba(34,197,94,0.15)] border border-[rgba(34,197,94,0.25)]",
                    "text-[#4ADE80] text-[10px] sm:text-[11px] font-semibold px-2 py-0.5",
                    "rounded-full"
                  )}
                >
                  <motion.span
                    animate={{
                      scale: [1, 1.08, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="inline-block"
                  >
                    Bonus
                  </motion.span>
                </Badge>
                <h3
                  className={cn(
                    "text-[13px] sm:text-sm font-semibold leading-[1.4]",
                    "text-foreground/95 truncate"
                  )}
                >
                  {title}
                </h3>
              </div>

              {/* Subtitle */}
              <p
                className={cn(
                  "text-[11px] sm:text-xs text-muted-foreground leading-[1.3]",
                  "truncate"
                )}
              >
                {subtitle}
              </p>
            </div>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          align="center"
          className="max-w-[220px] text-center rounded-md px-3 py-1.5"
          sideOffset={8}
        >
          <p className="text-xs leading-[1.4] text-popover-foreground font-vazirmatn">
            {tooltipText}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

