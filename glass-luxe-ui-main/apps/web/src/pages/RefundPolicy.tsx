import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "@/components/Helmet";
import { motion } from "framer-motion";
import {
  Zap,
  ShieldCheck,
  ChevronLeft,
  ExternalLink,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer/Footer";
import { Button } from "@/components/ui/button";
import { SurfaceGlass } from "@/components/ui/surface-glass";
import { FaqAccordion } from "@/components/Products/FaqAccordion";
import { cn } from "@/lib/utils";

const sections = [
  { id: "conditions", title: "شرایط تعویض حساب" },
  { id: "exceptions", title: "استثناها" },
  { id: "process", title: "روند درخواست" },
  { id: "faq", title: "پرسش‌های رایج" },
];

export default function RefundPolicy() {
  const [activeSection, setActiveSection] = useState("conditions");
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sectionOffsets = sections.map((section) => {
        const element = document.getElementById(section.id);
        return {
          id: section.id,
          offset: element ? element.offsetTop - 150 : 0,
        };
      });

      const scrollPosition = window.scrollY;
      const current = sectionOffsets.reduce((acc, section) => {
        if (scrollPosition >= section.offset) {
          return section.id;
        }
        return acc;
      }, sections[0].id);

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120;
      const top = element.offsetTop - offset;
      window.scrollTo({ top, behavior: "smooth" });
      setIsMobileTocOpen(false);
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://sharifgpt.ai/policies/refund-replacement#webpage",
        url: "https://sharifgpt.ai/policies/refund-replacement",
        name: "قوانین تعویض حساب و بازگشت وجه",
        description:
          "شرایط و قوانین تعویض حساب تضمینی و بازگشت وجه در SharifGPT. تا 7 روز فرصت بازگشت وجه بدون قید و شرط.",
        inLanguage: "fa-IR",
        isPartOf: {
          "@type": "WebSite",
          name: "SharifGPT",
          url: "https://sharifgpt.ai",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "مدت زمان ضمانت بازگشت وجه چقدر است؟",
            acceptedAnswer: {
              "@type": "Answer",
              text: "تا 7 روز پس از خرید می‌توانید درخواست بازگشت وجه دهید.",
            },
          },
          {
            "@type": "Question",
            name: "آیا برای تعویض حساب نیاز به دلیل است؟",
            acceptedAnswer: {
              "@type": "Answer",
              text: "خیر، ما بازگشت وجه بدون سوال را تضمین می‌کنیم.",
            },
          },
          {
            "@type": "Question",
            name: "چه زمانی وجه به حساب من بازمی‌گردد؟",
            acceptedAnswer: {
              "@type": "Answer",
              text: "بازگشت وجه حداکثر 7 روز کاری پس از تایید درخواست انجام می‌شود.",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>قوانین تعویض حساب و بازگشت وجه - SharifGPT</title>
        <meta
          name="description"
          content="شرایط و قوانین تعویض حساب تضمینی و بازگشت وجه در SharifGPT. تا 7 روز فرصت بازگشت وجه بدون قید و شرط."
        />
        <meta
          name="keywords"
          content="تعویض حساب, بازگشت وجه, ضمانت, رفاند, تضمین, پشتیبانی"
        />
        <link
          rel="canonical"
          href="https://sharifgpt.ai/policies/refund-replacement"
        />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header
          onSearch={() => {}}
          active="policies"
        />

        <main className="flex-1 py-16">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                تعویض حساب تضمینی
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-[700px] mx-auto">
                رضایت شما اولویت ماست. تا ۷ روز فرصت دارید محصول را ارزیابی کرده
                و در صورت عدم رضایت وجه خود را بازیابید
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <div className="glass border border-white/20 rounded-full px-6 py-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  <span className="font-semibold">پشتیبانی سریع</span>
                </div>
                <div className="glass border border-white/20 rounded-full px-6 py-3 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                  <span className="font-semibold">تعویض تضمینی</span>
                </div>
              </div>
            </motion.div>

            <div className="grid lg:grid-cols-[1fr_280px] gap-8">
              {/* Main Content */}
              <div className="space-y-8" dir="rtl">
                {/* Section 1: شرایط تعویض حساب */}
                <SurfaceGlass id="conditions" className="p-6 md:p-8 scroll-mt-32">
                  <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                    </div>
                    شرایط تعویض حساب
                  </h2>

                  <div className="prose prose-invert max-w-none">
                    <p className="text-lg text-muted-foreground mb-6">
                      ما متعهد به ارائه بهترین تجربه خرید هستیم. شرایط زیر برای
                      استفاده از تضمین تعویض حساب اعمال می‌شود:
                    </p>

                    <div className="space-y-4">
                      <div className="glass border border-white/10 rounded-xl p-5">
                        <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold">
                            ۱
                          </span>
                          بازه زمانی
                        </h3>
                        <ul className="space-y-2 text-muted-foreground mr-8">
                          <li className="flex items-start gap-2">
                            <ChevronLeft className="w-4 h-4 mt-1 shrink-0" />
                            <span>
                              <strong>۷ روز اول:</strong> بازگشت وجه کامل بدون هیچ
                              سوالی
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <ChevronLeft className="w-4 h-4 mt-1 shrink-0" />
                            <span>
                              <strong>روز ۸ تا ۱۴:</strong> بازگشت ۵۰٪ وجه در
                              صورت دلیل موجه
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <ChevronLeft className="w-4 h-4 mt-1 shrink-0" />
                            <span>
                              <strong>بعد از ۱۴ روز:</strong> امکان تعویض با محصول
                              دیگری با ارزش برابر
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div className="glass border border-white/10 rounded-xl p-5">
                        <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold">
                            ۲
                          </span>
                          شرایط واجد صلاحیت
                        </h3>
                        <ul className="space-y-2 text-muted-foreground mr-8">
                          <li className="flex items-start gap-2">
                            <ChevronLeft className="w-4 h-4 mt-1 shrink-0" />
                            <span>محصول دیجیتال نباید بیش از ۳۰٪ مصرف شده باشد</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <ChevronLeft className="w-4 h-4 mt-1 shrink-0" />
                            <span>
                              حساب کاربری نباید به اشتراک گذاشته شده باشد
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <ChevronLeft className="w-4 h-4 mt-1 shrink-0" />
                            <span>عدم نقض قوانین و مقررات استفاده</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <ChevronLeft className="w-4 h-4 mt-1 shrink-0" />
                            <span>داشتن فاکتور خرید معتبر</span>
                          </li>
                        </ul>
                      </div>

                      <div className="glass border border-white/10 rounded-xl p-5">
                        <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold">
                            ۳
                          </span>
                          دلایل قابل قبول
                        </h3>
                        <ul className="space-y-2 text-muted-foreground mr-8">
                          <li className="flex items-start gap-2">
                            <ChevronLeft className="w-4 h-4 mt-1 shrink-0" />
                            <span>عدم تطابق محصول با توضیحات ارائه شده</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <ChevronLeft className="w-4 h-4 mt-1 shrink-0" />
                            <span>مشکلات فنی مکرر در دسترسی به محصول</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <ChevronLeft className="w-4 h-4 mt-1 shrink-0" />
                            <span>عدم رضایت از کیفیت محتوا</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <ChevronLeft className="w-4 h-4 mt-1 shrink-0" />
                            <span>تغییر نیاز یا شرایط شخصی</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </SurfaceGlass>

                {/* Section 2: استثناها */}
                <SurfaceGlass id="exceptions" className="p-6 md:p-8 scroll-mt-32">
                  <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                      <XCircle className="w-6 h-6 text-destructive" />
                    </div>
                    استثناها
                  </h2>

                  <div className="prose prose-invert max-w-none">
                    <p className="text-lg text-muted-foreground mb-6">
                      موارد زیر از تضمین بازگشت وجه مستثنی هستند:
                    </p>

                    <div className="glass border border-destructive/20 rounded-xl p-5 bg-destructive/5">
                      <ul className="space-y-3 text-muted-foreground">
                        <li className="flex items-start gap-3">
                          <XCircle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
                          <span>
                            <strong>محصولات تخفیف‌دار:</strong> محصولاتی که با تخفیف
                            بیش از ۵۰٪ خریداری شده‌اند تنها تا ۳ روز مشمول بازگشت
                            وجه می‌شوند
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <XCircle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
                          <span>
                            <strong>مصرف کامل:</strong> در صورتی که بیش از ۷۰٪
                            محتوای دوره مصرف شده باشد
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <XCircle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
                          <span>
                            <strong>نقض قوانین:</strong> اشتراک‌گذاری حساب، کپی محتوا
                            یا سوء استفاده از لایسنس
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <XCircle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
                          <span>
                            <strong>محصولات سفارشی:</strong> محصولات شخصی‌سازی شده
                            براساس نیاز خاص کاربر
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <XCircle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
                          <span>
                            <strong>بسته‌های ترکیبی:</strong> در صورت استفاده جزئی،
                            فقط بخش استفاده نشده قابل بازگشت است
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-6 p-4 glass rounded-lg border border-blue-500/20 bg-blue-500/5">
                      <p className="text-sm">
                        💡 <strong>نکته:</strong> در مواردی که استثناها اعمال
                        می‌شود، همچنان می‌توانید با تیم پشتیبانی تماس بگیرید تا
                        راه‌حل مناسبی برای شما پیدا کنیم.
                      </p>
                    </div>
                  </div>
                </SurfaceGlass>

                {/* Section 3: روند درخواست */}
                <SurfaceGlass id="process" className="p-6 md:p-8 scroll-mt-32">
                  <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                      <ExternalLink className="w-6 h-6 text-secondary" />
                    </div>
                    روند درخواست تعویض یا بازگشت وجه
                  </h2>

                  <div className="prose prose-invert max-w-none">
                    <p className="text-lg text-muted-foreground mb-6">
                      فرآیند درخواست بازگشت وجه بسیار ساده و سریع است:
                    </p>

                    <div className="space-y-4">
                      {[
                        {
                          step: 1,
                          title: "باز کردن تیکت پشتیبانی",
                          description:
                            "با کلیک بر روی دکمه زیر، تیکت جدید باز کنید و 'درخواست بازگشت وجه' را انتخاب کنید",
                        },
                        {
                          step: 2,
                          title: "ارائه اطلاعات",
                          description:
                            "شماره سفارش، دلیل درخواست و هرگونه توضیح اضافی را ارائه دهید",
                        },
                        {
                          step: 3,
                          title: "بررسی تیم پشتیبانی",
                          description:
                            "تیم ما درخواست شما را ظرف ۲۴ ساعت بررسی می‌کند",
                        },
                        {
                          step: 4,
                          title: "تایید و پردازش",
                          description:
                            "پس از تایید، وجه شما حداکثر تا ۷ روز کاری به حساب شما بازمی‌گردد",
                        },
                      ].map((item) => (
                        <div
                          key={item.step}
                          className="glass border border-white/10 rounded-xl p-5 flex gap-4"
                        >
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0 font-bold text-xl">
                            {item.step}
                          </div>
                          <div>
                            <h3 className="font-bold text-xl mb-2">
                              {item.title}
                            </h3>
                            <p className="text-muted-foreground">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                      <Button asChild size="lg" className="gap-2">
                        <Link to="/support?new=ticket">
                          <ExternalLink className="w-5 h-5" />
                          باز کردن تیکت پشتیبانی
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="lg" className="gap-2">
                        <Link to="/account/orders">
                          مشاهده سفارش‌های من
                        </Link>
                      </Button>
                    </div>
                  </div>
                </SurfaceGlass>

                {/* Section 4: پرسش‌های رایج */}
                <SurfaceGlass id="faq" className="p-6 md:p-8 scroll-mt-32">
                  <h2 className="text-3xl font-bold mb-6">پرسش‌های رایج</h2>
                  <FaqAccordion
                    items={[
                      {
                        q: "مدت زمان ضمانت بازگشت وجه چقدر است؟",
                        a: "شما تا ۷ روز پس از خرید می‌توانید درخواست بازگشت وجه کامل بدهید. از روز ۸ تا ۱۴ امکان بازگشت ۵۰٪ وجه وجود دارد و بعد از ۱۴ روز می‌توانید محصول را با محصول دیگری با ارزش برابر تعویض کنید.",
                      },
                      {
                        q: "آیا برای تعویض حساب نیاز به دلیل است؟",
                        a: "در ۷ روز اول، خیر. ما بازگشت وجه بدون سوال را تضمین می‌کنیم. بعد از این مدت، ارائه دلیل به بررسی سریع‌تر درخواست کمک می‌کند.",
                      },
                      {
                        q: "چه زمانی وجه به حساب من بازمی‌گردد؟",
                        a: "پس از تایید درخواست توسط تیم پشتیبانی، بازگشت وجه حداکثر ۷ روز کاری به حساب بانکی شما واریز می‌شود. در صورت پرداخت آنلاین، این مدت ممکن است کمتر باشد.",
                      },
                      {
                        q: "اگر فقط بخشی از دوره را مشاهده کرده باشم، چه اتفاقی می‌افتد؟",
                        a: "اگر کمتر از ۳۰٪ محتوا را مصرف کرده باشید، می‌توانید از بازگشت وجه کامل استفاده کنید. بین ۳۰ تا ۷۰٪، بازگشت جزئی امکان‌پذیر است.",
                      },
                      {
                        q: "آیا محصولات تخفیف‌دار هم مشمول این ضمانت هستند؟",
                        a: "بله، اما محصولاتی که با تخفیف بیش از ۵۰٪ خریداری شده‌اند تنها تا ۳ روز مشمول بازگشت وجه می‌شوند.",
                      },
                      {
                        q: "چگونه می‌توانم درخواست بازگشت وجه دهم؟",
                        a: "کافی است یک تیکت پشتیبانی باز کنید، شماره سفارش و دلیل درخواست خود را بنویسید. تیم ما ظرف ۲۴ ساعت به درخواست شما رسیدگی می‌کند.",
                      },
                    ]}
                  />
                </SurfaceGlass>
              </div>

              {/* Sidebar - Table of Contents */}
              <aside className="hidden lg:block">
                <div className="sticky top-24">
                  <SurfaceGlass className="p-6">
                    <h3 className="font-bold text-lg mb-4">فهرست مطالب</h3>
                    <nav className="space-y-2">
                      {sections.map((section) => (
                        <button
                          key={section.id}
                          onClick={() => scrollToSection(section.id)}
                          className={cn(
                            "w-full text-right px-4 py-2 rounded-lg transition-all text-sm",
                            activeSection === section.id
                              ? "bg-primary/20 text-primary font-semibold"
                              : "text-muted-foreground hover:bg-surface-glass hover:text-foreground"
                          )}
                        >
                          {section.title}
                        </button>
                      ))}
                    </nav>
                  </SurfaceGlass>
                </div>
              </aside>
            </div>

            {/* Mobile Floating ToC */}
            <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
              <div className="relative">
                <Button
                  onClick={() => setIsMobileTocOpen(!isMobileTocOpen)}
                  className="glass border border-white/20 shadow-lg"
                >
                  فهرست مطالب
                </Button>

                {isMobileTocOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-full mb-2 left-0 right-0 glass-strong border border-white/20 rounded-xl p-3 shadow-2xl min-w-[250px]"
                  >
                    <nav className="space-y-1">
                      {sections.map((section) => (
                        <button
                          key={section.id}
                          onClick={() => scrollToSection(section.id)}
                          className={cn(
                            "w-full text-right px-3 py-2 rounded-lg transition-all text-sm",
                            activeSection === section.id
                              ? "bg-primary/20 text-primary font-semibold"
                              : "text-muted-foreground hover:bg-surface-glass"
                          )}
                        >
                          {section.title}
                        </button>
                      ))}
                    </nav>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer
          links={{
            products: "/products",
            magazine: "/blog",
            courses: "/courses",
            pricing: "/pricing",
            support: "/support",
          }}
          socials={[]}
        />
      </div>
    </>
  );
}
