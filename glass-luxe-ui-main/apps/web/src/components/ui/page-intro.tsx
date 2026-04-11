import { cn } from "@/lib/utils";
import { useDirection } from "@/contexts/DirectionContext";

interface PageIntroProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function PageIntro({ title, subtitle, className }: PageIntroProps) {
  const { isRTL } = useDirection();

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={cn(
        "relative rounded-2xl py-10 md:py-14 px-6 md:px-10",
        "bg-background dark:bg-card",
        "shadow-sm",
        "overflow-hidden",
        "animate-fadeIn",
        className
      )}
    >
      <div className={cn(
        "max-w-3xl",
        isRTL ? "mr-0 ml-auto text-right" : "ml-0 mr-auto text-left"
      )}>
        <h1
          className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-3 animate-fadeIn"
          style={{ filter: 'drop-shadow(0 0 30px rgba(59,130,246,0.4)) drop-shadow(0 0 60px rgba(139,92,246,0.3))' }}
        >
          {title}
        </h1>
        
        {subtitle && (
          <p
            className="text-base md:text-lg text-muted-foreground leading-relaxed animate-fadeIn"
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
