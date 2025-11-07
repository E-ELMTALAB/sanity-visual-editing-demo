import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  Users, 
  Target, 
  Sparkles,
  CheckCircle2,
  Award,
  BookOpen,
  Rocket,
  Brain,
  Code2,
  BarChart3,
  Clock,
  Send
} from "lucide-react";

export default function FreeConsultation() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center" dir="rtl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">مشاوره رایگان ۳۰ دقیقه‌ای</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-text-strong mb-6 leading-tight">
              مسیر یادگیری خود را با
              <span className="bg-gradient-to-l from-primary via-secondary to-accent bg-clip-text text-transparent"> اکادمی شریف جی پی تی </span>
              شروع کنید
            </h1>
            
            <p className="text-xl text-text-muted mb-8 leading-relaxed max-w-2xl mx-auto">
              در یک جلسه ۳۰ دقیقه‌ای رایگان، با منتورهای ما درباره اهداف، مهارت‌ها و بهترین مسیر یادگیری برای شما صحبت کنید.
            </p>

            <a href="https://t.me/sharifgpt_bot" target="_blank" rel="noopener noreferrer">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 text-white font-bold text-xl px-10 py-8 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <Send className="ml-3 w-6 h-6" />
                رزرو مشاوره در تلگرام
              </Button>
            </a>

            <p className="mt-4 text-sm text-text-muted">
              پاسخگویی در کمتر از ۲۴ ساعت
            </p>
          </div>
        </div>
      </section>

      {/* About Academy */}
      <section className="py-20 px-4 bg-surface-2">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16" dir="rtl">
            <h2 className="text-4xl font-black text-text-strong mb-4">
              اکادمی شریف جی پی تی چیست؟
            </h2>
            <p className="text-xl text-text-muted max-w-3xl mx-auto leading-relaxed">
              یک پلتفرم آموزشی تخصصی برای یادگیری هوش مصنوعی، توسعه نرم‌افزار با AI و اتوماسیون فرآیندها
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="p-8 rounded-3xl bg-surface border border-border hover:border-primary/50 shadow-neu-out hover:shadow-neu-hover transition-all duration-300 text-right" dir="rtl">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mb-6 shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-text-strong mb-3">
                مهندسی هوش مصنوعی
              </h3>
              <p className="text-text-muted leading-relaxed">
                یادگیری عمیق مدل‌های زبانی بزرگ، RAG، و ساخت اپلیکیشن‌های هوشمند
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-surface border border-border hover:border-primary/50 shadow-neu-out hover:shadow-neu-hover transition-all duration-300 text-right" dir="rtl">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center mb-6 shadow-lg">
                <Code2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-text-strong mb-3">
                توسعه با هوش مصنوعی
              </h3>
              <p className="text-text-muted leading-relaxed">
                استفاده از ابزارهای AI مثل V0، Cursor و Copilot برای کدنویسی سریع‌تر
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-surface border border-border hover:border-primary/50 shadow-neu-out hover:shadow-neu-hover transition-all duration-300 text-right" dir="rtl">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center mb-6 shadow-lg">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-text-strong mb-3">
                اتوماسیون با AI
              </h3>
              <p className="text-text-muted leading-relaxed">
                خودکارسازی فرآیندهای کاری با N8N، AgentKit و ابزارهای هوشمند
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-gradient-to-br from-surface to-surface-2 border border-border text-right" dir="rtl">
              <h3 className="text-2xl font-bold text-text-strong mb-6 flex items-center gap-3">
                <Award className="w-7 h-7 text-primary" />
                چرا اکادمی شریف جی پی تی؟
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <p className="text-text leading-relaxed">منتورهای با تجربه و متخصص در حوزه AI</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <p className="text-text leading-relaxed">مسیرهای یادگیری شخصی‌سازی شده</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <p className="text-text leading-relaxed">پروژه‌های واقعی و کاربردی</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <p className="text-text leading-relaxed">پشتیبانی ۲۴ ساعته از طریق دیسکورد و تلگرام</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <p className="text-text leading-relaxed">گواهی معتبر پس از اتمام دوره</p>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-gradient-to-br from-surface to-surface-2 border border-border text-right" dir="rtl">
              <h3 className="text-2xl font-bold text-text-strong mb-6 flex items-center gap-3">
                <BookOpen className="w-7 h-7 text-primary" />
                چه چیزهایی یاد می‌گیرید؟
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Rocket className="w-5 h-5 text-secondary flex-shrink-0 mt-1" />
                  <p className="text-text leading-relaxed">ساخت اپلیکیشن‌های هوشمند با LLM</p>
                </div>
                <div className="flex items-start gap-3">
                  <Rocket className="w-5 h-5 text-secondary flex-shrink-0 mt-1" />
                  <p className="text-text leading-relaxed">توسعه فرانت‌اند و بک‌اند با ابزارهای AI</p>
                </div>
                <div className="flex items-start gap-3">
                  <Rocket className="w-5 h-5 text-secondary flex-shrink-0 mt-1" />
                  <p className="text-text leading-relaxed">اتوماسیون فرآیندهای کاری</p>
                </div>
                <div className="flex items-start gap-3">
                  <Rocket className="w-5 h-5 text-secondary flex-shrink-0 mt-1" />
                  <p className="text-text leading-relaxed">پرامپت‌نویسی حرفه‌ای</p>
                </div>
                <div className="flex items-start gap-3">
                  <Rocket className="w-5 h-5 text-secondary flex-shrink-0 mt-1" />
                  <p className="text-text leading-relaxed">استقرار و مدیریت پروژه‌های واقعی</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16" dir="rtl">
            <h2 className="text-4xl font-black text-text-strong mb-4">
              چطور کار می‌کند؟
            </h2>
            <p className="text-xl text-text-muted max-w-2xl mx-auto">
              فقط سه قدم تا شروع مسیر یادگیری شما
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" dir="rtl">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-3xl font-black text-white">۱</span>
              </div>
              <h3 className="text-2xl font-bold text-text-strong mb-3">
                پیام بدهید
              </h3>
              <p className="text-text-muted leading-relaxed">
                از طریق تلگرام با ما در ارتباط باشید و درخواست مشاوره رایگان خود را ثبت کنید
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-3xl font-black text-white">۲</span>
              </div>
              <h3 className="text-2xl font-bold text-text-strong mb-3">
                جلسه مشاوره
              </h3>
              <p className="text-text-muted leading-relaxed">
                در یک جلسه ۳۰ دقیقه‌ای با منتور درباره اهداف و مسیر یادگیری صحبت کنید
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-3xl font-black text-white">۳</span>
              </div>
              <h3 className="text-2xl font-bold text-text-strong mb-3">
                شروع یادگیری
              </h3>
              <p className="text-text-muted leading-relaxed">
                مسیر شخصی‌سازی شده خود را دریافت کنید و یادگیری را شروع کنید
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="container mx-auto max-w-6xl">
          <div className="flex gap-3 md:gap-8" dir="rtl">
            <div className="w-1/2 text-center">
              <div className="text-2xl sm:text-3xl md:text-5xl font-black bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent mb-1 md:mb-2">
                ۱۴۰۰+
              </div>
              <p className="text-xs sm:text-sm md:text-base text-text-muted font-semibold">دانشجوی فعال</p>
            </div>
            <div className="w-1/2 text-center">
              <div className="text-2xl sm:text-3xl md:text-5xl font-black bg-gradient-to-l from-accent to-primary bg-clip-text text-transparent mb-1 md:mb-2">
                ۴.۹
              </div>
              <p className="text-xs sm:text-sm md:text-base text-text-muted font-semibold">امتیاز رضایت</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="relative p-12 rounded-3xl bg-gradient-to-br from-primary via-secondary to-accent overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1),transparent_50%)]"></div>
            
            <div className="relative text-center text-white" dir="rtl">
              <MessageSquare className="w-16 h-16 mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                همین الان شروع کنید!
              </h2>
              <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
                کافیست در تلگرام به ما پیام دهید و اولین قدم را برای تبدیل شدن به یک متخصص AI بردارید.
              </p>

              <a href="https://t.me/sharifgpt_bot" target="_blank" rel="noopener noreferrer">
                <Button 
                  size="lg"
                  className="bg-white text-primary hover:bg-gray-100 font-bold text-xl px-10 py-8 rounded-2xl shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <Send className="ml-3 w-6 h-6" />
                  ارسال پیام در تلگرام
                </Button>
              </a>

              <div className="mt-8 flex items-center justify-center gap-2 text-white/80">
                <Clock className="w-5 h-5" />
                <span>پاسخگویی سریع در کمتر از ۲۴ ساعت</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
