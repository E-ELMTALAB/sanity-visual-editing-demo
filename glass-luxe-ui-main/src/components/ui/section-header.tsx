import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { ArrowRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  eyebrow?: string;
  cta?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const springTransition = {
  type: "spring" as const,
  stiffness: 220,
  damping: 28,
};

export function SectionHeader({ title, eyebrow, cta, className }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springTransition}
      className={cn("flex flex-col gap-4", className)}
    >
      {/* Consistent Layout: Title first, then eyebrow, centered on all screens */}
      <div className="flex flex-col items-center text-center space-y-2">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
          {title}
        </h2>
        {eyebrow && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0.1 }}
            className="text-sm sm:text-base text-foreground/70"
          >
            {eyebrow}
          </motion.div>
        )}
      </div>

      {/* Mobile Button at bottom, full width */}
      {cta && (
        <Button variant="primary" size="lg" onClick={cta.onClick} className="sm:hidden w-full">
          {cta.label}
          <ArrowRight className="ltr:ml-2 rtl:mr-2 h-4 w-4" />
        </Button>
      )}
    </motion.div>
  );
}
