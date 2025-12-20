import { cn } from "@/lib/utils";

interface Step {
  number: string;
  title: string;
  description: string;
}

interface DeliveryProcessSectionProps {
  className?: string;
}

const deliverySteps: Step[] = [
  {
    number: "۱",
    title: "پرداخت امن",
    description: "پرداخت از طریق درگاه امن انجام می‌شود و سفارش شما بلافاصله ثبت می‌گردد."
  },
  {
    number: "۲",
    title: "دریافت کد پیگیری",
    description: "پس از پرداخت موفق، کد پیگیری اختصاصی دریافت می‌کنید. این کد برای دریافت اکانت ضروری است."
  },
  {
    number: "۳",
    title: "ارتباط با پشتیبانی",
    description: "از طریق دکمه تلگرام، کد پیگیری را برای پشتیبانی ارسال می‌کنید. سفارش شما به‌صورت دستی بررسی می‌شود."
  },
  {
    number: "۴",
    title: "تحویل و پشتیبانی",
    description: "اکانت خریداری‌شده تحویل داده می‌شود و پشتیبانی تا پایان اشتراک همراه شما خواهد بود."
  }
];

export function DeliveryProcessSection({ className }: DeliveryProcessSectionProps) {
  return (
    <div
      dir="rtl"
      className={cn(
        "w-full rounded-xl p-5 sm:p-6",
        "bg-black/40 backdrop-blur-sm border border-white/10",
        className
      )}
    >
      {/* Section Title */}
      <h3
        className="text-base font-bold text-white mb-6 text-right"
        style={{ direction: "rtl" }}
      >
        نحوه دریافت محصول پس از خرید
      </h3>

      {/* Timeline - Horizontal on Desktop, Vertical on Mobile */}
      <div className="relative">
        {/* Desktop: Horizontal Timeline */}
        <div className="hidden lg:block">
          {/* Connector Line */}
          <div className="absolute top-5 right-5 left-5 h-0.5 bg-cyan-500/30" />

          <div className="grid grid-cols-4 gap-4">
            {deliverySteps.map((step, index) => (
              <div key={index} className="relative flex flex-col items-center text-center">
                {/* Step Number Circle */}
                <div className="relative z-10 w-10 h-10 rounded-full bg-cyan-500/20 border-2 border-cyan-400/60 flex items-center justify-center text-cyan-400 mb-4">
                  <span className="text-sm font-bold">{step.number}</span>
                </div>

                {/* Title */}
                <h4
                  className="text-sm font-semibold text-white mb-2"
                  style={{
                    direction: "rtl",
                    lineHeight: "1.6"
                  }}
                >
                  {step.title}
                </h4>

                {/* Description */}
                <p
                  className="text-xs text-gray-300 leading-relaxed px-1"
                  style={{
                    direction: "rtl",
                    lineHeight: "1.8"
                  }}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile/Tablet: Vertical Timeline */}
        <div className="lg:hidden space-y-4">
          {deliverySteps.map((step, index) => (
            <div
              key={index}
              className={cn(
                "relative flex items-start gap-4 p-4 rounded-lg",
                "bg-black/30 border border-white/10"
              )}
            >
              {/* Step Indicator */}
              <div className="flex flex-col items-center shrink-0">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 border-2 border-cyan-400/60 flex items-center justify-center text-cyan-400">
                  <span className="text-sm font-bold">{step.number}</span>
                </div>
                {/* Vertical Line (except last item) */}
                {index < deliverySteps.length - 1 && (
                  <div className="w-0.5 h-full min-h-[20px] bg-cyan-500/30 mt-2" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pt-1">
                <h4
                  className="text-sm font-semibold text-white mb-1"
                  style={{
                    direction: "rtl",
                    textAlign: "right",
                    lineHeight: "1.6"
                  }}
                >
                  {step.title}
                </h4>
                <p
                  className="text-xs text-gray-300"
                  style={{
                    direction: "rtl",
                    textAlign: "right",
                    lineHeight: "1.8"
                  }}
                >
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}