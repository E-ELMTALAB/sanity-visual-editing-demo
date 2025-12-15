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

export function SectionHeader({ title, eyebrow, cta, className }: SectionHeaderProps) {
  return (
    <div
      className={cn("flex flex-col gap-4 animate-fadeIn", className)}
    >
      {/* Consistent Layout: Title first, then eyebrow, centered on all screens */}
      <div className="flex flex-col items-center text-center space-y-2">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
          {title}
        </h2>
        {eyebrow && (
          <div className="text-sm sm:text-base text-foreground/70 animate-fadeIn">
            {eyebrow}
          </div>
        )}
      </div>

      {/* Mobile Button at bottom, full width */}
      {cta && (
        <Button variant="primary" size="lg" onClick={cta.onClick} className="sm:hidden w-full">
          {cta.label}
          <ArrowRight className="ltr:ml-2 rtl:mr-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
