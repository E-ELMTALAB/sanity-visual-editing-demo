import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Send, MessageCircle, Zap, Clock } from "lucide-react";

const faqCategories = [
  {
    category: "سوالات متداول",
    icon: MessageCircle,
    items: [
      {
        q: "چگونه می‌توانم با پشتیبانی ارتباط بگیرم؟",
        a: "سریع‌ترین راه، ارسال پیام در تلگرام است. تیم ما معمولاً ظرف چند دقیقه پاسخ می‌دهد.",
      },
      {
        q: "زمان پاسخگویی چقدر است؟",
        a: "تیم پشتیبانی ما در تلگرام به صورت ۲۴/۷ فعال است و معمولاً کمتر از ۱۵ دقیقه پاسخ می‌دهیم.",
      },
      {
        q: "آیا می‌توانم به زبان فارسی پشتیبانی دریافت کنم؟",
        a: "بله، تمام تیم پشتیبانی ما به زبان فارسی پاسخگو هستند.",
      },
    ],
  },
];

export default function Support() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Hero Section with Telegram Focus */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              پاسخگویی فوری در تلگرام
            </div>
            
            <h1 className="text-5xl font-bold text-text-strong mb-4">
              پشتیبانی سریع و حرفه‌ای
            </h1>
            <p className="text-xl text-text-muted mb-8 max-w-2xl mx-auto">
              تیم پشتیبانی ما آماده پاسخگویی به سوالات شماست
              <br />
              <span className="text-primary font-semibold">معمولاً کمتر از ۱۵ دقیقه پاسخ می‌دهیم!</span>
            </p>
          </div>

          {/* Main Telegram CTA */}
          <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl shadow-neu-out p-8 mb-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10 text-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-6">
                <Send className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-3">
                با ما در تلگرام در ارتباط باشید
              </h2>
              <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
                سریع‌ترین و راحت‌ترین راه برای دریافت پشتیبانی!
                تیم ما ۲۴ ساعته آماده پاسخگویی است.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
                <div className="flex items-center gap-2 text-white/90">
                  <Clock className="w-5 h-5" />
                  <span>پاسخگویی ۲۴/۷</span>
                </div>
                <div className="hidden sm:block w-1 h-1 bg-white/50 rounded-full"></div>
                <div className="flex items-center gap-2 text-white/90">
                  <Zap className="w-5 h-5" />
                  <span>زمان پاسخ: کمتر از ۱۵ دقیقه</span>
                </div>
              </div>
              
              <a
                href="https://t.me/sharifgpt"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Send className="w-5 h-5 ml-2" />
                  شروع گفتگو در تلگرام
                </Button>
              </a>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-surface rounded-xl shadow-neu-out p-6 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-primary-lighter mx-auto flex items-center justify-center">
                <Zap className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold text-text-strong text-lg">پاسخ سریع</h3>
              <p className="text-text-muted">
                اکثر پیام‌ها در کمتر از ۱۵ دقیقه پاسخ داده می‌شوند
              </p>
            </div>
            
            <div className="bg-surface rounded-xl shadow-neu-out p-6 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-primary-lighter mx-auto flex items-center justify-center">
                <MessageCircle className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold text-text-strong text-lg">پشتیبانی تخصصی</h3>
              <p className="text-text-muted">
                تیم متخصص ما آماده راهنمایی در تمام مراحل است
              </p>
            </div>
            
            <div className="bg-surface rounded-xl shadow-neu-out p-6 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-primary-lighter mx-auto flex items-center justify-center">
                <Clock className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold text-text-strong text-lg">۲۴ ساعته</h3>
              <p className="text-text-muted">
                در هر ساعت از شبانه‌روز می‌توانید با ما در ارتباط باشید
              </p>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-8 mb-12">
            <h2 className="text-2xl font-bold text-text-strong">
              سوالات متداول
            </h2>
            
            {faqCategories.map((category, idx) => {
              const Icon = category.icon;
              return (
                <div key={idx} className="bg-surface rounded-lg shadow-neu-out p-6">
                  <h3 className="text-lg font-semibold text-text-strong mb-4 flex items-center gap-2">
                    <Icon className="w-5 h-5 text-primary" />
                    {category.category}
                  </h3>
                  
                  <Accordion type="single" collapsible className="w-full">
                    {category.items.map((item, i) => (
                      <AccordionItem key={i} value={`item-${idx}-${i}`}>
                        <AccordionTrigger className="text-right hover:no-underline">
                          {item.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-text-muted">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              );
            })}
          </div>

          {/* Alternative Contact */}
          <div className="bg-surface/50 rounded-xl border-2 border-dashed border-border p-8 text-center">
            <h3 className="text-lg font-semibold text-text-strong mb-2">
              روش دیگری برای تماس ترجیح می‌دهید؟
            </h3>
            <p className="text-text-muted mb-6">
              می‌توانید از طریق ایمیل نیز با ما در ارتباط باشید
            </p>
            
            <a
              href="mailto:support@sharifgpt.academy"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors duration-200 font-medium"
            >
              <MessageCircle className="w-5 h-5" />
              support@sharifgpt.academy
            </a>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
