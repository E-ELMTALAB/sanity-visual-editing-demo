import { useState, useRef, useEffect } from "react";
import { Zap, Shield, Check, Headphones, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface HomeContentAccordionProps {
  className?: string;
}

const quickSummaryItems = [
  {
    icon: Zap,
    text: "تحویل فوری",
  },
  {
    icon: Shield,
    text: "ضمانت تعویض",
  },
  {
    icon: Check,
    text: "اکانت اورجینال",
  },
  {
    icon: Headphones,
    text: "پشتیبانی ۲۴/۷",
  },
  {
    icon: Clock,
    text: "اتصال بدون VPN",
  },
];

export function HomeContentAccordion({ className }: HomeContentAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  // Measure content height on mount
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, []);

  // Re-measure on window resize
  useEffect(() => {
    const handleResize = () => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.scrollHeight);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <section className={cn("px-4 md:px-6 bg-transparent py-12", className)}>
      <div className="container mx-auto max-w-4xl">
        {/* Quick Summary Card */}
        <div className="mb-8 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl p-5 md:p-6">
          <h3 className="text-lg md:text-xl font-bold text-foreground text-center mb-5">
            چرا شریف‌جی‌پی‌تی؟
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-3">
            {quickSummaryItems.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                <item.icon className="w-5 h-5 md:w-6 md:h-6 text-primary mb-2" strokeWidth={1.5} />
                <span className="text-xs md:text-sm text-muted-foreground leading-snug">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Expandable Content Card */}
        <div className="rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl p-5 md:p-6">
          <div className="relative">
            {/* Content Container */}
            <div
              ref={contentRef}
              className="overflow-hidden transition-[max-height] duration-300"
              style={{
                maxHeight: isExpanded ? `${contentHeight}px` : "240px",
                transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <div className="space-y-6">
                {/* Section 1: Introduction */}
                <div className="space-y-2">
                  <h4 className="text-base md:text-lg font-semibold text-foreground">
                    ⭐ خرید اکانت ChatGPT با ضمانت تعویض
                  </h4>
                  <p className="text-sm md:text-base text-muted-foreground/90 leading-relaxed">
                    در دنیای امروز که سرعت تحولات فناوری سرسام‌آور است، هوش مصنوعی از یک مفهوم تخیلی به ابزاری حیاتی برای پیشرفت و افزایش بهره‌وری تبدیل شده است. ChatGPT در قلب این انقلاب قرار دارد و توانایی درک، تحلیل و تولید زبان انسان را به سطحی بی‌سابقه رسانده است.
                  </p>
                </div>

                {/* Section 2: Why Premium */}
                <div className="space-y-2">
                  <h4 className="text-base md:text-lg font-semibold text-foreground">
                    🔵 چرا نسخه پرمیوم ضروری است؟
                  </h4>
                  <p className="text-sm md:text-base text-muted-foreground/90 leading-relaxed">
                    نسخه رایگان ChatGPT محدودیت‌های جدی برای استفاده حرفه‌ای دارد:
                  </p>
                  <ul className="list-inside space-y-1 mr-4">
                    <li className="text-xs md:text-sm text-muted-foreground/80">
                      • سرعت بسیار پایین در ساعات اوج مصرف
                    </li>
                    <li className="text-xs md:text-sm text-muted-foreground/80">
                      • پیام‌های مکرر «ChatGPT is at capacity»
                    </li>
                    <li className="text-xs md:text-sm text-muted-foreground/80">
                      • عدم دسترسی به مدل‌های جدید مثل GPT-4o
                    </li>
                    <li className="text-xs md:text-sm text-muted-foreground/80">
                      • نبود امکانات آپلود فایل، وب‌گردی و ساخت GPT سفارشی
                    </li>
                  </ul>
                </div>

                {/* Section 3: Plans */}
                <div className="space-y-2">
                  <h4 className="text-base md:text-lg font-semibold text-foreground">
                    🟣 معرفی پلن‌های خرید اکانت ChatGPT
                  </h4>
                  <div className="space-y-3">
                    <div className="space-y-0.5">
                      <h5 className="text-sm font-medium text-foreground/90">
                        اکانت ChatGPT Plus (4o)
                      </h5>
                      <p className="text-xs md:text-sm text-muted-foreground/80 mr-4">
                        بهترین انتخاب اقتصادی و پرفروش‌ترین پلن. مبتنی بر مدل GPT-4o با سرعت بالا و قابلیت‌های چندوجهی شامل متن، تصویر و صدا.
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <h5 className="text-sm font-medium text-foreground/90">
                        اکانت ChatGPT 4.5
                      </h5>
                      <p className="text-xs md:text-sm text-muted-foreground/80 mr-4">
                        انتخاب میانی برای حرفه‌ای‌ها. نسخه تقویت‌شده با محدودیت‌های استفاده بسیار بالاتر، مناسب برنامه‌نویسان و تحلیل‌گران.
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <h5 className="text-sm font-medium text-foreground/90">
                        اکانت ChatGPT 5
                      </h5>
                      <p className="text-xs md:text-sm text-muted-foreground/80 mr-4">
                        پرچمدار و قدرتمندترین پلن. مناسب شرکت‌ها، محققان و تیم‌های بزرگ با قدرت استدلال و خلاقیت بسیار بالا.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 4: Pricing */}
                <div className="space-y-2">
                  <h4 className="text-base md:text-lg font-semibold text-foreground">
                    💰 هزینه اکانت چت جی پی تی
                  </h4>
                  <ul className="list-inside space-y-1 mr-4">
                    <li className="text-xs md:text-sm text-muted-foreground/80">
                      • اکانت ChatGPT Plus (یک ماهه): 20 دلار
                    </li>
                    <li className="text-xs md:text-sm text-muted-foreground/80">
                      • اکانت ChatGPT Pro (دسترسی مدل O3 Pro): 200 دلار
                    </li>
                  </ul>
                  <p className="text-sm md:text-base text-muted-foreground/90 leading-relaxed">
                    🎁 همه پلن‌ها همراه با یک ماه اشتراک رایگان Grok ارائه می‌شوند.
                  </p>
                </div>

                {/* Section 5: How to Buy */}
                <div className="space-y-2">
                  <h4 className="text-base md:text-lg font-semibold text-foreground">
                    نحوه خرید اکانت ChatGPT در ۳ مرحله
                  </h4>
                  <ul className="list-inside space-y-1 mr-4">
                    <li className="text-xs md:text-sm text-muted-foreground/80">
                      1️⃣ انتخاب پلن مناسب از لیست محصولات
                    </li>
                    <li className="text-xs md:text-sm text-muted-foreground/80">
                      2️⃣ پرداخت امن از طریق درگاه معتبر زرین‌پال
                    </li>
                    <li className="text-xs md:text-sm text-muted-foreground/80">
                      3️⃣ دریافت فوری اطلاعات اکانت از طریق ربات تلگرام
                    </li>
                  </ul>
                </div>

                {/* Section 6: Why Us */}
                <div className="space-y-2">
                  <h4 className="text-base md:text-lg font-semibold text-foreground">
                    چرا شریف‌جی‌پی‌تی بهترین انتخاب است؟
                  </h4>
                  <ul className="list-inside space-y-1 mr-4">
                    <li className="text-xs md:text-sm text-muted-foreground/80">
                      • پشتیبانی واقعی ۲۴ ساعته توسط تیم متخصص
                    </li>
                    <li className="text-xs md:text-sm text-muted-foreground/80">
                      • تضمین جایگزینی فوری در صورت مسدود شدن اکانت
                    </li>
                    <li className="text-xs md:text-sm text-muted-foreground/80">
                      • افزونه اختصاصی برای اتصال مستقیم بدون نیاز به VPN
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Gradient Overlay - visible when collapsed */}
            <div
              className={cn(
                "absolute bottom-0 left-0 right-0 h-24 pointer-events-none transition-opacity duration-300",
                "bg-gradient-to-t from-[hsl(var(--card))] via-[hsl(var(--card)/0.6)] to-transparent",
                isExpanded ? "opacity-0" : "opacity-100"
              )}
            />
          </div>

          {/* Toggle Button */}
          <button
            onClick={toggleExpand}
            className={cn(
              "w-full text-sm text-muted-foreground hover:text-foreground",
              "transition-colors duration-200 py-2 px-4",
              "relative z-10",
              isExpanded ? "mt-6" : "mt-2"
            )}
          >
            {isExpanded ? "بستن توضیحات" : "مشاهده توضیحات کامل ←"}
          </button>
        </div>
      </div>
    </section>
  );
}

export default HomeContentAccordion;

