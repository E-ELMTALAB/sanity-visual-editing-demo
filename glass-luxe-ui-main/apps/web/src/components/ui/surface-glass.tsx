import React from "react";
import { cn } from "@/lib/utils";

interface SurfaceGlassProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "subtle" | "strong";
  children: React.ReactNode;
}

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
    <div
      className={cn("animate-fadeIn", variantClass, className)}
      {...props}
    >
      {children}
    </div>
  );
}
