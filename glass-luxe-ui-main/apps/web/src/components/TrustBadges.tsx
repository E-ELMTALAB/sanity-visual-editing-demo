import { RefreshCw, Shield, Clock } from "lucide-react";

type TrustBadge = {
  label: string;
  icon: React.ReactNode;
};

const BADGES: TrustBadge[] = [
  { 
    label: "تضمین تعویض", 
    icon: <RefreshCw className="w-full h-full" />
  },
  { 
    label: "اکانت‌های اصل", 
    icon: <Shield className="w-full h-full" />
  },
  { 
    label: "پشتیبانی ۲۴/۷", 
    icon: <Clock className="w-full h-full" />
  },
] as const;

export default function TrustBadges() {
  return (
    <div dir="rtl" className="flex flex-row flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8">
      {BADGES.map((badge, index) => (
        <div 
          key={index}
          className="flex flex-col items-center gap-3 sm:gap-4 group"
        >
          {/* Glass Container with Icon */}
          <div className="relative">
            {/* Glass effect container */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl glass border border-white/20 flex items-center justify-center text-white shadow-lg group-hover:shadow-xl group-hover:brightness-110 transition-all duration-200 backdrop-blur-md">
              <div className="text-white/95 group-hover:text-white transition-colors duration-200 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8">
                {badge.icon}
              </div>
            </div>
          </div>
          
          {/* Text below icon */}
          <span className="text-white/90 text-xs sm:text-sm md:text-base font-medium text-center whitespace-nowrap">
            {badge.label}
          </span>
        </div>
      ))}
    </div>
  );
}

