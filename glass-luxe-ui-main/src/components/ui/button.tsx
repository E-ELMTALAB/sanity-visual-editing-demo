import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95",
  {
    variants: {
      variant: {
        default: 
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/30",
        primary:
          "glass border-primary/40 text-primary-foreground hover:bg-primary/20 hover:border-primary/60 shadow-lg shadow-primary/20",
        secondary:
          "glass border-secondary/40 text-secondary-foreground hover:bg-secondary/20 hover:border-secondary/60 shadow-lg shadow-secondary/20",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg shadow-destructive/30",
        outline:
          "border border-border-glass bg-surface-glass hover:bg-glass text-foreground backdrop-blur-sm",
        ghost: 
          "hover:bg-surface-glass hover:text-foreground",
        link: 
          "text-primary underline-offset-4 hover:underline",
        viewAll:
          "glass border-2 border-primary/30 text-foreground hover:border-primary/60 hover:bg-primary/10 backdrop-blur-xl shadow-[0_0_30px_rgba(110,168,254,0.3)] hover:shadow-[0_0_40px_rgba(110,168,254,0.5)] transition-all duration-300",
      },
      size: {
        default: "h-11 px-6 py-3 rounded-lg text-sm",
        sm: "h-9 px-4 py-2 rounded-md text-xs",
        lg: "h-13 px-8 py-4 rounded-xl text-base",
        icon: "h-10 w-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  animate?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, animate = true, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          animate && !asChild && "transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98]"
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants }
