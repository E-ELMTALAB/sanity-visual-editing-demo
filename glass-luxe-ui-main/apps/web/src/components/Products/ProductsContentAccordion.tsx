import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Shield, Check, Headphones, Clock, ChevronDown } from "lucide-react";
import { SurfaceGlass } from "@/components/ui/surface-glass";
import { cn } from "@/lib/utils";

type SectionId = "why-us" | "delivery" | "guarantees" | "security" | "support";

interface SectionConfig {
  id: SectionId;
  title: string;
  summary: string;
  content: string;
}

const sections: SectionConfig[] = [
  {
    id: "why-us",
    title: "چرا از ما خرید کنید؟",
    summary: "متخصص در فروش محصولات دیجیتال با تمرکز روی تجربه کاربری، پشتیبانی و امنیت.",
    content:
      "ما سال‌هاست روی فروش محصولات کاملاً دیجیتال (اکانت‌ها، لایسنس‌ها، دوره‌ها و ابزارهای مرتبط با هوش‌مصنوعی) تمرکز کرده‌ایم. تمام فرآیند خرید، تحویل و پشتیبانی ما برای سرعت، شفافیت و امنیت بهینه شده است.\n\n" +
      "هر محصول قبل از قرار گرفتن در فروشگاه به‌صورت واقعی تست می‌شود، توضیحات آن توسط تیم فنی بازبینی می‌شود و شرایط استفاده، محدودیت‌ها و نکات مهم به زبان ساده نوشته می‌شود تا هنگام خرید دقیقاً بدانید چه چیزی دریافت می‌کنید.",
  },
  {
    id: "delivery",
    title: "نحوه تحویل و فعال‌سازی محصولات",
    summary: "تحویل تمام محصولات به صورت کاملاً دیجیتال و خودکار در کوتاه‌ترین زمان.",
    content:
      "پس از ثبت سفارش و پرداخت موفق، اطلاعات دسترسی یا لینک دانلود محصول بلافاصله در داشبورد کاربری و همچنین از طریق ایمیل برای شما ارسال می‌شود.\n\n" +
      "برای بسیاری از اکانت‌ها، فعال‌سازی به‌صورت خودکار انجام می‌شود و تنها کافی است طبق راهنمای تصویری یا ویدیویی همراه محصول مراحل را طی کنید. اگر در هر مرحله‌ای مشکلی داشتید، تیم پشتیبانی به‌صورت ۲۴ ساعته در کنار شماست تا فرآیند فعال‌سازی را تا انتها همراهی کند.",
  },
  {
    id: "guarantees",
    title: "گارانتی، بازگشت وجه و تعویض",
    summary: "برای بیشتر محصولات، گارانتی تعویض یا بازگشت وجه واقعی و شفاف داریم.",
    content:
      "اگر محصولی که دریافت کرده‌اید مطابق توضیحات صفحه نباشد، در بازه زمانی اعلام‌شده در همان صفحه می‌توانید درخواست تعویض یا بازگشت وجه ثبت کنید.\n\n" +
      "در صورت بروز مشکل فنی از سمت سرویس‌دهنده (مثلاً محدود شدن اکانت یا غیرفعال شدن دسترسی)، تیم ما ابتدا تلاش می‌کند مشکل را برطرف کند و در صورت عدم موفقیت، اکانت جایگزین یا اعتبار خرید ارائه می‌شود. تمام شرایط گارانتی به‌صورت شفاف در توضیحات هر محصول نوشته شده است.",
  },
  {
    id: "security",
    title: "امنیت اطلاعات و پرداخت",
    summary: "تمام پرداخت‌ها روی درگاه‌های امن و معتبر انجام می‌شود و داده‌های شما رمزنگاری می‌شوند.",
    content:
      "ما از درگاه‌های پرداخت معتبر با استانداردهای امنیتی به‌روز استفاده می‌کنیم. اطلاعات کارت بانکی شما هرگز در سرورهای ما ذخیره نمی‌شود و مستقیماً توسط درگاه بانکی پردازش می‌شود.\n\n" +
      "حساب کاربری شما با احراز هویت ایمیل و لایه‌های امنیتی اضافی محافظت می‌شود. توصیه می‌کنیم از رمز عبور قوی استفاده کنید و آن را در اختیار دیگران قرار ندهید.",
  },
  {
    id: "support",
    title: "پشتیبانی قبل و بعد از خرید",
    summary: "قبل از خرید می‌توانید سوال بپرسید و بعد از خرید تا زمان استفاده کامل در کنار شما هستیم.",
    content:
      "کانال‌های مختلف پشتیبانی (تلگرام، واتساپ، تیکت، ایمیل) برای شما فعال است تا در هر مرحله از تصمیم‌گیری یا استفاده از محصول، سوالات خود را مطرح کنید.\n\n" +
      "تیم پشتیبانی ما تلاش می‌کند در کوتاه‌ترین زمان ممکن پاسخ‌گوی شما باشد، مشکلات را تحلیل کند و ساده‌ترین راه‌حل را ارائه دهد. هدف ما این است که از خرید تا استفاده نهایی، تجربه‌ای روان، شفاف و قابل اعتماد داشته باشید.",
  },
];

const iconConfig: Record<SectionId, JSX.Element> = {
  "why-us": <Zap className="w-5 h-5 text-primary" />,
  delivery: <Clock className="w-5 h-5 text-primary" />,
  guarantees: <Check className="w-5 h-5 text-primary" />,
  security: <Shield className="w-5 h-5 text-primary" />,
  support: <Headphones className="w-5 h-5 text-primary" />,
};

export function ProductsContentAccordion() {
  const [openSections, setOpenSections] = useState<SectionId[]>(["why-us"]);

  const allIds = useMemo(() => sections.map((s) => s.id), []);
  const allOpen = openSections.length === allIds.length;

  // URL hash navigation
  useEffect(() => {
    const handleHash = () => {
      if (typeof window === "undefined") return;
      const hash = window.location.hash.replace("#", "");
      if (!hash) return;

      // If hash matches a section id, open that section and scroll to it
      if (allIds.includes(hash as SectionId)) {
        setOpenSections((prev) =>
          prev.includes(hash as SectionId) ? prev : [hash as SectionId, ...prev],
        );
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } else if (hash === "products-content") {
        const sectionRoot = document.getElementById("products-content");
        if (sectionRoot) {
          sectionRoot.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, [allIds]);

  const toggleSection = (id: SectionId) => {
    setOpenSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const handleToggleAll = () => {
    if (allOpen) {
      // Collapse to first-only state
      setOpenSections(["why-us"]);
    } else {
      // Expand all
      setOpenSections(allIds);
    }
  };

  return (
    <section
      id="products-content"
      dir="rtl"
      className="py-12 md:py-16"
    >
      <div className="max-w-4xl mx-auto px-6 md:px-8">
        <SurfaceGlass className="rounded-2xl p-6 md:p-8">
          {/* Quick Summary + Toggle All */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold text-foreground text-right">
                چرا می‌توانید با خیال راحت از ما خرید کنید؟
              </h2>
              <button
                type="button"
                onClick={handleToggleAll}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-surface-glass/40 hover:bg-surface-glass/70 text-base font-semibold text-foreground/90 transition-colors"
              >
                <span>{allOpen ? "بستن توضیحات" : "مشاهده توضیحات کامل"}</span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-transform",
                    allOpen && "rotate-180",
                  )}
                />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className="flex items-start gap-3"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: "hsla(212, 98%, 70%, 0.20)",
                    }}
                  >
                    {iconConfig[section.id]}
                  </div>
                  <p className="text-base font-medium leading-relaxed text-foreground">
                    {section.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Accordion Sections */}
          <div className="max-w-3xl mx-auto border-t border-white/10 pt-4">
            {sections
              .filter((section) => section.content && section.content.trim().length > 0)
              .map((section) => {
                const isOpen = openSections.includes(section.id);
                return (
                  <div
                    key={section.id}
                    id={section.id}
                    className="border-b border-white/10 last:border-b-0"
                  >
                    <button
                      type="button"
                      onClick={() => toggleSection(section.id)}
                      className={cn(
                        "w-full flex items-center justify-between text-right py-5 px-1 transition-colors rounded-lg",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        "hover:bg-white/5",
                      )}
                      aria-expanded={isOpen}
                    >
                      <span className="text-lg font-semibold text-foreground">
                        {section.title}
                      </span>
                      <ChevronDown
                        className={cn(
                          "w-5 h-5 flex-shrink-0 text-muted-foreground transition-transform duration-200 ease-out",
                          isOpen && "rotate-180 text-primary",
                        )}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-1 pb-6 text-base leading-7 text-muted-foreground text-right space-y-3">
                            {section.content.split("\n\n").map((para, idx) => (
                              <p key={idx}>{para}</p>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
          </div>
        </SurfaceGlass>
      </div>
    </section>
  );
}


