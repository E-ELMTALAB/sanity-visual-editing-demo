import { RefreshCw, Shield, Clock } from "lucide-react";

type TrustBadge = {
  label: string;
  icon: React.ReactNode;
};

const BADGES: TrustBadge[] = [
  { 
    label: "تضمین تعویض", 
    icon: <RefreshCw className="w-6 h-6" />
  },
  { 
    label: "اکانت‌های اصل", 
    icon: <Shield className="w-6 h-6" />
  },
  { 
    label: "پشتیبانی ۲۴/۷", 
    icon: <Clock className="w-6 h-6" />
  },
] as const;

export default function TrustBadges() {
  return (
    <div dir="rtl" className="mt-8 flex flex-row items-center justify-center lg:justify-start gap-6 md:gap-8">
      {BADGES.map((badge, index) => (
        <div 
          key={index}
          className="flex flex-col items-center gap-3 group"
        >
          {/* Circular Icon */}
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-lg group-hover:blur-xl transition-all duration-300 opacity-60 group-hover:opacity-80" />
            
            {/* Icon circle */}
            <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300 border border-white/20">
              {badge.icon}
            </div>
          </div>
          
          {/* Text below icon */}
          <span className="text-white/90 text-sm md:text-base font-medium text-center whitespace-nowrap">
            {badge.label}
          </span>
        </div>
      ))}
    </div>
  );
}

