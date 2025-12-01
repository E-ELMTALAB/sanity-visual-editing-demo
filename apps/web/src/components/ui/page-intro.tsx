import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useDirection } from "@/contexts/DirectionContext";

interface PageIntroProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const springTransition = {
  type: "spring" as const,
  stiffness: 220,
  damping: 28,
};

export function PageIntro({ title, subtitle, className }: PageIntroProps) {
  const { isRTL } = useDirection();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springTransition}
      className={cn(
        "relative rounded-2xl py-10 md:py-14 px-6 md:px-10",
        "bg-background dark:bg-card",
        "shadow-sm",
        "overflow-hidden",
        className
      )}
    >
      {/* Subtle top highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      
      <div className={cn(
        "max-w-3xl mx-auto text-center md:text-start",
        isRTL ? "md:mr-0 md:text-right" : "md:ml-0 md:text-left"
      )}>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springTransition, delay: 0.1 }}
          className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-3"
          style={{ filter: 'drop-shadow(0 0 30px rgba(59,130,246,0.4)) drop-shadow(0 0 60px rgba(139,92,246,0.3))' }}
        >
          {title}
        </motion.h1>
        
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0.2 }}
            className="text-base md:text-lg text-muted-foreground leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
