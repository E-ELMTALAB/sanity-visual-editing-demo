import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  Users, 
  Building2, 
  TrendingUp, 
  Shield, 
  Zap,
  CheckCircle2,
  Phone,
  Mail,
  MessageSquare,
  Award,
  Rocket,
  Target,
  BarChart3,
  HeadphonesIcon,
  Clock,
  Globe,
  Star
} from "lucide-react";

export default function EnterpriseSales() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-surface to-accent/5 opacity-50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text Section */}
            <div className="text-right" dir="rtl">
              <div className="inline-block px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm mb-6 shadow-lg">
                <Building2 className="inline-block w-4 h-4 ml-2" />
                راهکار سازمانی
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black text-text-strong mb-6 leading-tight">
                مسیر یادگیری هوش مصنوعی برای{" "}
                <span className="bg-gradient-to-l from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                  سازمان شما
                </span>
              </h1>
              
              <p className="text-xl text-text-muted leading-relaxed mb-8">
                با برنامه‌های آموزشی اختصاصی، تیم خود را برای عصر هوش مصنوعی آماده کنید. 
                از آموزش گروهی تا پروژه‌های سفارشی و پشتیبانی اختصاصی.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-surface border border-border shadow-neu-out">
                  <div className="text-3xl font-black bg-gradient-to-l from-emerald-500 to-teal-500 bg-clip-text text-transparent mb-1">
                    ۵۰+
                  </div>
                  <div className="text-sm text-text-muted">سازمان فعال</div>
                </div>
                <div className="p-4 rounded-2xl bg-surface border border-border shadow-neu-out">
                  <div className="text-3xl font-black bg-gradient-to-l from-emerald-500 to-teal-500 bg-clip-text text-transparent mb-1">
                    ۲۰۰۰+
                  </div>
                  <div className="text-sm text-text-muted">کارمند آموزش دیده</div>
                </div>
                <div className="p-4 rounded-2xl bg-surface border border-border shadow-neu-out">
                  <div className="text-3xl font-black bg-gradient-to-l from-emerald-500 to-teal-500 bg-clip-text text-transparent mb-1">
                    ۹۸٪
                  </div>
                  <div className="text-sm text-text-muted">رضایت سازمان‌ها</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="https://t.me/sharifgpt_bot" target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button 
                    size="lg"
                    className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-bold text-lg border-0 shadow-2xl hover:scale-105 transition-all duration-300"
                  >
                    <MessageSquare className="ml-2 w-6 h-6" />
                    درخواست مشاوره رایگان
                  </Button>
                </a>
                <Button 
                  size="lg"
                  variant="outline"
                  className="flex-1 rounded-2xl border-2 font-bold text-lg hover:scale-105 transition-all duration-300"
                >
                  <Phone className="ml-2 w-5 h-5" />
                  تماس با فروش
                </Button>
              </div>
            </div>

            {/* Visual Section */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl blur-3xl opacity-20"></div>
              <div className="relative bg-gradient-to-br from-surface to-surface-2 rounded-3xl p-8 border-2 border-emerald-500/20 shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Users, label: "تیم‌سازی", color: "from-emerald-400 to-teal-400" },
                    { icon: Rocket, label: "رشد سریع", color: "from-cyan-400 to-blue-400" },
                    { icon: Target, label: "هدفمند", color: "from-violet-400 to-purple-400" },
                    { icon: Award, label: "گواهی معتبر", color: "from-orange-400 to-amber-400" }
                  ].map((item, idx) => (
                    <div 
                      key={idx}
                      className="p-6 rounded-2xl bg-surface border border-border shadow-neu-out hover:shadow-neu-hover transition-all duration-300 hover:-translate-y-2"
                    >
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3 shadow-lg`}>
                        <item.icon className="w-7 h-7 text-white" />
                      </div>
                      <p className="text-text-strong font-bold text-right">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-4xl font-black text-text-strong text-center mb-4" dir="rtl">
            پکیج‌های سازمانی
          </h2>
          <p className="text-center text-text-muted mb-12 text-lg" dir="rtl">
            انتخاب بهترین پلن برای سازمان شما
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "استارتاپ",
                subtitle: "برای تیم‌های ۵-۲۰ نفره",
                price: "تماس بگیرید",
                features: [
                  "دسترسی به ۳ دوره انتخابی",
                  "پشتیبانی ایمیل",
                  "گواهی پایان دوره",
                  "داشبورد مدیریتی پایه",
                  "۲ جلسه مشاوره ماهانه"
                ],
                color: "from-blue-500 to-cyan-500",
                popular: false
              },
              {
                name: "کسب‌وکار",
                subtitle: "برای تیم‌های ۲۰-۱۰۰ نفره",
                price: "تماس بگیرید",
                features: [
                  "دسترسی به تمام دوره‌ها",
                  "پشتیبانی ۲۴/۷",
                  "گواهی معتبر بین‌المللی",
                  "داشبورد مدیریتی پیشرفته",
                  "جلسات مشاوره نامحدود",
                  "پروژه‌های اختصاصی",
                  "منتور اختصاصی"
                ],
                color: "from-emerald-500 to-teal-500",
                popular: true
              },
              {
                name: "سازمانی",
                subtitle: "برای تیم‌های +۱۰۰ نفره",
                price: "تماس بگیرید",
                features: [
                  "همه امکانات پکیج کسب‌وکار",
                  "آموزش On-site",
                  "سفارشی‌سازی کامل محتوا",
                  "API اختصاصی",
                  "مدیر حساب اختصاصی",
                  "SLA تضمین شده",
                  "گزارش‌های تحلیلی پیشرفته",
                  "یکپارچه‌سازی با سیستم‌های سازمانی"
                ],
                color: "from-violet-500 to-purple-500",
                popular: false
              }
            ].map((pkg, idx) => (
              <div 
                key={idx}
                className={`relative p-8 rounded-3xl ${
                  pkg.popular 
                    ? `bg-gradient-to-br ${pkg.color} text-white shadow-2xl scale-105` 
                    : 'bg-surface border-2 border-border shadow-neu-out'
                } transition-all duration-300 hover:scale-105`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 right-1/2 translate-x-1/2 px-4 py-1 rounded-full bg-white text-emerald-600 font-bold text-sm shadow-lg">
                    <Star className="inline-block w-4 h-4 ml-1" />
                    محبوب‌ترین
                  </div>
                )}
                
                <div className="text-right" dir="rtl">
                  <h3 className={`text-2xl font-black mb-2 ${pkg.popular ? 'text-white' : 'text-text-strong'}`}>
                    {pkg.name}
                  </h3>
                  <p className={`text-sm mb-6 ${pkg.popular ? 'text-white/90' : 'text-text-muted'}`}>
                    {pkg.subtitle}
                  </p>
                  
                  <div className="mb-8">
                    <div className={`text-3xl font-black ${pkg.popular ? 'text-white' : `bg-gradient-to-l ${pkg.color} bg-clip-text text-transparent`}`}>
                      {pkg.price}
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    {pkg.features.map((feature, featureIdx) => (
                      <div key={featureIdx} className="flex items-start gap-2">
                        <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${pkg.popular ? 'text-white' : 'text-emerald-500'}`} />
                        <span className={`text-sm ${pkg.popular ? 'text-white/90' : 'text-text'}`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <a href="https://t.me/sharifgpt_bot" target="_blank" rel="noopener noreferrer">
                    <Button 
                      className={`w-full rounded-xl font-bold ${
                        pkg.popular 
                          ? 'bg-white text-emerald-600 hover:bg-gray-100' 
                          : `bg-gradient-to-r ${pkg.color} text-white`
                      } shadow-lg hover:scale-105 transition-all duration-300`}
                    >
                      درخواست مشاوره
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-surface-2">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-4xl font-black text-text-strong text-center mb-4" dir="rtl">
            چرا سازمان‌ها ما را انتخاب می‌کنند؟
          </h2>
          <p className="text-center text-text-muted mb-12 text-lg" dir="rtl">
            مزایای همکاری با آکادمی شریف جی‌پی‌تی
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: "آموزش تیمی اختصاصی",
                description: "برنامه‌های آموزشی سفارشی‌سازی شده برای نیازهای خاص سازمان شما",
                color: "from-emerald-500 to-teal-500"
              },
              {
                icon: Shield,
                title: "امنیت و محرمانگی",
                description: "حفاظت کامل از داده‌های سازمانی با بالاترین استانداردهای امنیتی",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: BarChart3,
                title: "گزارش‌گیری پیشرفت",
                description: "داشبورد مدیریتی برای نظارت بر پیشرفت تیم و تحلیل عملکرد",
                color: "from-violet-500 to-purple-500"
              },
              {
                icon: HeadphonesIcon,
                title: "پشتیبانی اختصاصی ۲۴/۷",
                description: "تیم پشتیبانی ویژه برای پاسخگویی سریع به سوالات تیم شما",
                color: "from-pink-500 to-rose-500"
              },
              {
                icon: Rocket,
                title: "پروژه‌های واقعی",
                description: "اجرای پروژه‌های عملی مرتبط با کسب‌وکار سازمان شما",
                color: "from-orange-500 to-amber-500"
              },
              {
                icon: Award,
                title: "گواهی‌نامه معتبر",
                description: "صدور گواهی‌نامه‌های معتبر برای تمامی اعضای تیم",
                color: "from-indigo-500 to-blue-500"
              },
              {
                icon: Clock,
                title: "زمان‌بندی منعطف",
                description: "برنامه‌ریزی دوره‌ها متناسب با ساعات کاری سازمان",
                color: "from-lime-500 to-green-500"
              },
              {
                icon: Target,
                title: "مسیر یادگیری هدفمند",
                description: "طراحی مسیر آموزشی مطابق با اهداف استراتژیک سازمان",
                color: "from-cyan-500 to-teal-500"
              },
              {
                icon: TrendingUp,
                title: "افزایش بهره‌وری",
                description: "بهبود ۳۰٪ بهره‌وری تیم پس از تکمیل دوره‌ها",
                color: "from-purple-500 to-pink-500"
              }
            ].map((benefit, idx) => (
              <div 
                key={idx}
                className="group relative p-6 rounded-2xl bg-surface border border-border hover:border-primary/50 shadow-neu-out hover:shadow-neu-hover transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <benefit.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-text-strong mb-2 text-right" dir="rtl">
                  {benefit.title}
                </h3>
                <p className="text-text-muted text-right leading-relaxed" dir="rtl">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Contact Section */}
      <section className="py-20 px-4 bg-surface-2">
        <div className="container mx-auto max-w-4xl">
          <div className="relative p-12 rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1),transparent_50%)]"></div>
            
            <div className="relative text-center text-white" dir="rtl">
              <Globe className="w-16 h-16 mx-auto mb-6 opacity-90" />
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                آماده‌اید سازمان خود را متحول کنید؟
              </h2>
              <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
                با یک مشاوره رایگان، بهترین راهکار آموزشی برای تیم خود را کشف کنید و گام اول را در مسیر دیجیتال شدن بردارید.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <a href="https://t.me/sharifgpt_bot" target="_blank" rel="noopener noreferrer">
                  <Button 
                    size="lg"
                    className="bg-white text-teal-600 hover:bg-gray-100 font-bold text-lg px-8 py-7 rounded-2xl shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    <MessageSquare className="ml-2 w-6 h-6" />
                    گفتگو با مشاور
                  </Button>
                </a>
                <a href="tel:+989123456789">
                  <Button 
                    size="lg"
                    className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/40 hover:bg-white/20 font-bold text-lg px-8 py-7 rounded-2xl hover:scale-105 transition-all duration-300"
                  >
                    <Phone className="ml-2 w-5 h-5" />
                    تماس مستقیم
                  </Button>
                </a>
              </div>

              <div className="flex flex-wrap justify-center gap-8 pt-8 border-t border-white/20 text-white/90">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  <span className="font-semibold">enterprise@sharifgpt.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  <span className="font-semibold">۰۲۱-۱۲۳۴۵۶۷۸</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
