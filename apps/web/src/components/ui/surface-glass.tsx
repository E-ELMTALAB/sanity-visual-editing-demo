import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface SurfaceGlassProps extends HTMLMotionProps<"div"> {
  variant?: "default" | "subtle" | "strong";
  children: React.ReactNode;
}

const springTransition = {
  type: "spring" as const,
  stiffness: 220,
  damping: 28,
};

export function SurfaceGlass({
  variant = "default",
  className,
  children,
  ...props
}: SurfaceGlassProps) {
  const variantClass = {
    default: "glass",
    subtle: "glass-subtle",
    strong: "glass-strong",
  }[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springTransition}
      className={cn(variantClass, className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
