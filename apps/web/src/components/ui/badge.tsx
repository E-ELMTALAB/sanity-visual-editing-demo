import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 backdrop-blur-sm",
  {
    variants: {
      variant: {
        default:
          "bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30",
        sale:
          "bg-accent-red/20 text-accent-red border border-accent-red/30 hover:bg-accent-red/30",
        new:
          "bg-accent-green/20 text-accent-green border border-accent-green/30 hover:bg-accent-green/30",
        hot:
          "bg-accent-magenta/20 text-accent-magenta border border-accent-magenta/30 hover:bg-accent-magenta/30",
        secondary:
          "bg-secondary/20 text-secondary border border-secondary/30 hover:bg-secondary/30",
        destructive:
          "bg-destructive/20 text-destructive border border-destructive/30 hover:bg-destructive/30",
        outline: 
          "border border-border-glass text-foreground hover:bg-surface-glass",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  animate?: boolean;
}

function Badge({ className, variant, animate = true, ...props }: BadgeProps) {
  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring" as const, stiffness: 220, damping: 28 }}
        className={cn(badgeVariants({ variant }), className)}
        {...(props as any)}
      />
    );
  }

  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants }
