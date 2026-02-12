import { Users, Award, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrustStatsBarProps {
  className?: string;
}

export function TrustStatsBar({ className }: TrustStatsBarProps) {
  return (
    <section
      dir="rtl"
      className={cn("w-full px-4 md:px-6 py-10 md:py-12 bg-transparent", className)}
    >
      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-3 gap-4 md:gap-8">
          {/* Users stat */}
          <div className="flex flex-col items-center text-center">
            <Users className="w-6 h-6 md:w-7 md:h-7 mb-3 text-blue-400" strokeWidth={1.5} />
            <div className="text-xl md:text-2xl font-bold text-white mb-1 leading-tight font-vazirmatn">
              +۱۰,۰۰۰
            </div>
            <div className="text-xs md:text-sm text-gray-500 leading-relaxed font-vazirmatn">
              کاربر فعال
            </div>
          </div>

          {/* Experience stat */}
          <div className="flex flex-col items-center text-center">
            <Award className="w-6 h-6 md:w-7 md:h-7 mb-3 text-purple-400" strokeWidth={1.5} />
            <div className="text-xl md:text-2xl font-bold text-white mb-1 leading-tight font-vazirmatn">
              ۳+ سال
            </div>
            <div className="text-xs md:text-sm text-gray-500 leading-relaxed font-vazirmatn">
              تجربه در هوش مصنوعی
            </div>
          </div>

          {/* Security stat */}
          <div className="flex flex-col items-center text-center">
            <Shield className="w-6 h-6 md:w-7 md:h-7 mb-3 text-emerald-400" strokeWidth={1.5} />
            <div className="text-xl md:text-2xl font-bold text-white mb-1 leading-tight font-vazirmatn">
              ۱۰۰٪
            </div>
            <div className="text-xs md:text-sm text-gray-500 leading-relaxed font-vazirmatn">
              امنیت پرداخت تضمین‌شده
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrustStatsBar;


