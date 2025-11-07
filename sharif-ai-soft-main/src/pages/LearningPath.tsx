import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, Target, Zap, ShoppingCart, CheckCircle2, Users, Clock, Star, TrendingUp, Award, Sparkles } from "lucide-react";

const learningPaths = {
  beginner: {
    id: "beginner",
    title: "شروع راحت—قدم‌به‌قدم",
    subtitle: "مسیرهای مقدماتی برای اولین پروژهٔ AI",
    description: "از صفر تا ساخت اولین پروژه‌های هوش مصنوعی—قدم‌به‌قدم و کاملاً عملی",
    gradient: "from-emerald-500 to-teal-600",
    bgGradient: "from-emerald-50/80 via-teal-50/80 to-cyan-50/80",
    targetRole: "توسعه‌دهنده AI مبتدی",
    outcomes: [
      "ساخت Chatbot هوشمند با GPT",
      "توسعه سیستم تشخیص تصویر",
      "پیاده‌سازی Agent ساده",
      "استفاده از API های AI"
    ],
    skills: [
      { name: "پایتون پایه", level: 90 },
      { name: "کار با API", level: 85 },
      { name: "Prompt Engineering", level: 95 },
      { name: "Agent Development", level: 80 }
    ],
    stats: {
      students: "۳۲۰+",
      rating: "۴.۹",
      duration: "۲۰ ساعت",
      projects: "۴"
    },
    courses: [
      {
        id: "ai-python-basics",
        title: "برنامه‌نویسی هوش مصنوعی با پایتون – از پایه تا عامل‌ها",
        description: "از صفر تا ساخت ایجنت و اتوماسیون—قدم‌به‌قدم و کاملاً عملی",
        level: "مبتدی تا پیشرفته",
        duration: "۱۲ ساعت",
        lessons: "۴۵",
        order: 1,
        price: 2500000,
        slug: "ai-python-basics"
      },
      {
        id: "llm-fundamentals",
        title: "مبانی LLM و Prompt Engineering",
        description: "یاد بگیر چطور با مدل‌های زبانی کار کنی و بهترین نتایج را بگیری",
        level: "مبتدی",
        duration: "۸ ساعت",
        lessons: "۳۲",
        order: 2,
        price: 1800000,
        slug: "llm-fundamentals"
      }
    ],
    bundlePrice: 3800000,
    discount: 12,
    testimonials: [
      {
        name: "علی محمدی",
        role: "توسعه‌دهنده فرانت‌اند",
        text: "با این مسیر تونستم اولین چت‌بات خودم رو بسازم. آموزش‌ها عالی بودن!",
        rating: 5
      },
      {
        name: "سارا احمدی",
        role: "دانشجوی کامپیوتر",
        text: "قدم‌به‌قدم و واضح. دقیقاً چیزی بود که نیاز داشتم برای شروع.",
        rating: 5
      }
    ]
  },
  advanced: {
    id: "advanced",
    title: "پیشرفت جدی—کاربرد در پروژه",
    subtitle: "دوره‌های پیشرفته برای نتایج عملی",
    description: "از تئوری تا پروژه‌های واقعی—ساخت سیستم‌های AI که کار می‌کنند",
    gradient: "from-purple-500 to-indigo-600",
    bgGradient: "from-purple-50/80 via-violet-50/80 to-indigo-50/80",
    targetRole: "توسعه‌دهنده AI حرفه‌ای",
    outcomes: [
      "طراحی معماری Multi-Agent",
      "استفاده از RAG برای پروژه‌های واقعی",
      "دیپلوی و مانیتورینگ سیستم‌های AI",
      "بهینه‌سازی پرامپت‌های پیچیده"
    ],
    skills: [
      { name: "LangChain", level: 95 },
      { name: "Vector Databases", level: 85 },
      { name: "RAG Architecture", level: 90 },
      { name: "Multi-Agent Systems", level: 88 }
    ],
    stats: {
      students: "۱۸۵+",
      rating: "۵.۰",
      duration: "۲۷ ساعت",
      projects: "۶"
    },
    courses: [
      {
        id: "advanced-agents",
        title: "ساخت Agent های پیشرفته با LangChain",
        description: "از Agent ساده تا سیستم‌های Multi-Agent پیچیده",
        level: "پیشرفته",
        duration: "۱۵ ساعت",
        lessons: "۵۸",
        order: 1,
        price: 3200000,
        slug: "advanced-agents"
      },
      {
        id: "rag-systems",
        title: "پیاده‌سازی RAG برای اپلیکیشن‌های واقعی",
        description: "ساخت سیستم‌های پرسش و پاسخ هوشمند با داده‌های شخصی",
        level: "پیشرفته",
        duration: "۱۲ ساعت",
        lessons: "۴۲",
        order: 2,
        price: 2800000,
        slug: "rag-systems"
      }
    ],
    bundlePrice: 5200000,
    discount: 15,
    testimonials: [
      {
        name: "رضا کریمی",
        role: "مهندس نرم‌افزار",
        text: "بهترین دوره‌های پیشرفته AI که دیدم. پروژه‌های واقعی و کاربردی.",
        rating: 5
      },
      {
        name: "مهدی رضایی",
        role: "AI Developer",
        text: "با این مسیر تونستم یک سیستم RAG حرفه‌ای بسازم و در پروژه‌هام استفاده کنم.",
        rating: 5
      }
    ]
  },
  specialized: {
    id: "specialized",
    title: "کاربردهای خاص—برای نیازهای مشخص",
    subtitle: "دوره‌های تخصصی برای نیازهای خاص",
    description: "راهکارهای AI برای چالش‌های واقعی کسب‌وکار",
    gradient: "from-orange-500 to-red-600",
    bgGradient: "from-orange-50/80 via-amber-50/80 to-yellow-50/80",
    targetRole: "متخصص AI در حوزه‌های خاص",
    outcomes: [
      "اتوماسیون فرآیندهای کسب‌وکار",
      "تحلیل داده و پیش‌بینی",
      "پردازش زبان طبیعی فارسی",
      "ساخت محصولات AI-First"
    ],
    skills: [
      { name: "N8N Automation", level: 92 },
      { name: "Business Analysis", level: 87 },
      { name: "Product Development", level: 90 },
      { name: "AI Integration", level: 94 }
    ],
    stats: {
      students: "۲۴۰+",
      rating: "۴.۸",
      duration: "۲۴ ساعت",
      projects: "۵"
    },
    courses: [
      {
        id: "ai-automation",
        title: "اتوماسیون با n8n و AI",
        description: "بدون کد، ورک‌فلوهای هوشمند بساز",
        level: "متوسط",
        duration: "۱۰ ساعت",
        lessons: "۳۸",
        order: 1,
        price: 2200000,
        slug: "ai-automation"
      },
      {
        id: "ai-business",
        title: "AI برای کسب‌وکار—از ایده تا محصول",
        description: "چطور محصولات AI بسازیم که پول درآورند",
        level: "متوسط تا پیشرفته",
        duration: "۱۴ ساعت",
        lessons: "۵۲",
        order: 2,
        price: 3000000,
        slug: "ai-business"
      }
    ],
    bundlePrice: 4500000,
    discount: 15,
    testimonials: [
      {
        name: "فاطمه حسینی",
        role: "صاحب کسب‌وکار",
        text: "با این دوره‌ها تونستم کسب‌وکارم رو اتوماتیک کنم. واقعاً عالی بود!",
        rating: 5
      },
      {
        name: "امیر تقی‌پور",
        role: "مدیر محصول",
        text: "دوره‌های کاربردی و عملی. مستقیم توی کار من تاثیرگذار بود.",
        rating: 5
      }
    ]
  }
};

export default function LearningPath() {
  const { pathId } = useParams<{ pathId: string }>();
  const path = pathId ? learningPaths[pathId as keyof typeof learningPaths] : null;

  if (!path) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">مسیر یادگیری پیدا نشد</h1>
          <Link to="/">
            <Button>بازگشت به صفحه اصلی</Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = path.courses.reduce((sum, course) => sum + course.price, 0);
  const savings = totalPrice - path.bundlePrice;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section with Glass Effect */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-primary-light/10"></div>
        <div className="absolute inset-0">
          <div className={`absolute top-10 right-10 w-48 h-48 md:w-96 md:h-96 bg-gradient-to-br ${path.gradient} opacity-20 rounded-full blur-3xl animate-pulse`}></div>
          <div className={`absolute bottom-10 left-10 w-40 h-40 md:w-80 md:h-80 bg-gradient-to-br ${path.gradient} opacity-15 rounded-full blur-3xl animate-pulse`} style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Breadcrumb */}
            <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground" dir="rtl">
              <Link to="/" className="hover:text-primary transition-colors">خانه</Link>
              <span>/</span>
              <span className="text-text-strong">مسیر یادگیری</span>
            </div>

            {/* Glass Card */}
            <div className={`bg-gradient-to-br ${path.bgGradient} backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-neu-out border-2 border-white/50 p-6 md:p-10 lg:p-12`}>
              <div className="text-center" dir="rtl">
                <Badge className="mb-3 md:mb-4 bg-primary/20 text-primary border-primary/30 px-4 md:px-6 py-1.5 md:py-2 text-xs md:text-sm">
                  مسیر یادگیری {path.targetRole}
                </Badge>
                <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-l from-primary via-accent to-primary bg-clip-text text-transparent">
                  {path.title}
                </h1>
                <p className="text-base md:text-xl lg:text-2xl text-text mb-6 md:mb-8 leading-relaxed max-w-3xl mx-auto">
                  {path.description}
                </p>
                
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border-2 border-white/70 shadow-sm">
                    <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold text-text-strong">{path.stats.students}</div>
                    <div className="text-xs text-text-muted">دانشجو</div>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border-2 border-white/70 shadow-sm">
                    <Star className="w-6 h-6 mx-auto mb-2 text-amber-500 fill-amber-500" />
                    <div className="text-2xl font-bold text-text-strong">{path.stats.rating}</div>
                    <div className="text-xs text-text-muted">امتیاز</div>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border-2 border-white/70 shadow-sm">
                    <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold text-text-strong">{path.stats.duration}</div>
                    <div className="text-xs text-text-muted">مدت زمان</div>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border-2 border-white/70 shadow-sm">
                    <Target className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold text-text-strong">{path.stats.projects}</div>
                    <div className="text-xs text-text-muted">پروژه عملی</div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className={`bg-gradient-to-r ${path.gradient} text-white hover:opacity-90 shadow-lg px-8 py-6 text-lg`}>
                    <ShoppingCart className="ml-2" />
                    شروع یادگیری
                  </Button>
                  <Button size="lg" variant="outline" className="border-2 border-primary/30 hover:bg-primary/5 px-8 py-6 text-lg">
                    دانلود نمونه رایگان
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16 bg-surface">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12" dir="rtl">مهارت‌هایی که یاد می‌گیرید</h2>
            
            <div className="grid md:grid-cols-2 gap-6" dir="rtl">
              {path.skills.map((skill, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-neu-out hover:shadow-neu-hover transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-text-strong">{skill.name}</span>
                    <span className="text-sm text-primary font-bold">{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${path.gradient} rounded-full transition-all duration-1000`}
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Learning Path Visualization */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-surface to-background"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" dir="rtl">مسیر یادگیری شما</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto" dir="rtl">
            قدم به قدم از صفر تا حرفه‌ای—هر دوره شما را یک قدم به هدفتان نزدیک‌تر می‌کند
          </p>
          
          <div className="max-w-5xl mx-auto">
            <div className="relative">
              {/* Path Line */}
              <div className={`absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b ${path.gradient} opacity-30 hidden md:block -mr-8`}></div>
              
              {path.courses.map((course, index) => (
                <div key={course.id} className="relative mb-16 last:mb-0">
                  <div className="flex items-start gap-8">
                    {/* Step Number - Right Side */}
                    <div className={`hidden md:flex flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br ${path.gradient} items-center justify-center text-white font-bold text-2xl shadow-lg border-4 border-background`}>
                      {course.order}
                    </div>
                    
                    {/* Course Card */}
                    <div className="flex-1">
                      <Card className={`neu-out hover:neu-hover transition-all duration-300 border-2 bg-gradient-to-br ${path.bgGradient} backdrop-blur-sm`}>
                        <CardHeader>
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <Badge className="md:hidden bg-primary text-primary-foreground">{course.order}</Badge>
                            <div className="flex gap-2 flex-wrap">
                              <Badge variant="secondary" className="bg-white/70">{course.level}</Badge>
                              <Badge variant="outline" className="bg-white/50">{course.lessons} درس</Badge>
                            </div>
                          </div>
                          <CardTitle className="text-xl md:text-2xl" dir="rtl">{course.title}</CardTitle>
                        </CardHeader>
                        <CardContent dir="rtl">
                          <p className="text-muted-foreground mb-6 leading-relaxed">{course.description}</p>
                          <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span>{course.duration}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <BookOpen className="w-4 h-4" />
                                <span>{course.lessons} درس</span>
                              </div>
                            </div>
                            <div className="text-left">
                              <span className="text-3xl font-bold text-primary">
                                {course.price.toLocaleString('fa-IR')}
                              </span>
                              <span className="text-sm mr-2">تومان</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Outcomes Section */}
      <section className="py-16 bg-surface">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" dir="rtl">بعد از تکمیل این مسیر</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto" dir="rtl">
              قادر به ساخت این پروژه‌ها و محصولات خواهید بود
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {path.outcomes.map((outcome, index) => (
                <Card key={index} className={`neu-out hover:neu-hover transition-all border-2 bg-gradient-to-br ${path.bgGradient} backdrop-blur-sm`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${path.gradient} flex items-center justify-center shadow-lg`}>
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-lg font-semibold text-text-strong pt-2">{outcome}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-surface"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" dir="rtl">نظر دانشجویان</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {path.testimonials.map((testimonial, index) => (
                <Card key={index} className={`bg-gradient-to-br ${path.bgGradient} backdrop-blur-xl border-2 border-white/50 shadow-neu-out hover:shadow-neu-hover transition-all`}>
                  <CardContent className="p-8" dir="rtl">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-amber-500 fill-amber-500" />
                      ))}
                    </div>
                    <p className="text-text-strong mb-6 leading-relaxed text-lg italic">
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${path.gradient} flex items-center justify-center text-white font-bold text-lg`}>
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-text-strong">{testimonial.name}</div>
                        <div className="text-sm text-text-muted">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bundle Pricing */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary-light/5"></div>
        <div className="absolute inset-0">
          <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${path.gradient} opacity-10 rounded-full blur-3xl`}></div>
          <div className={`absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br ${path.gradient} opacity-10 rounded-full blur-3xl`}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <Card className={`neu-out border-4 border-primary/30 bg-gradient-to-br ${path.bgGradient} backdrop-blur-xl shadow-2xl`}>
              <CardHeader className="text-center pb-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Sparkles className="w-6 h-6 text-amber-500" />
                  <Badge className={`bg-gradient-to-r ${path.gradient} text-white border-0 px-6 py-2 text-lg`}>
                    {path.discount}% تخفیف ویژه بسته
                  </Badge>
                  <Sparkles className="w-6 h-6 text-amber-500" />
                </div>
                <CardTitle className="text-3xl md:text-4xl" dir="rtl">خرید بسته کامل مسیر یادگیری</CardTitle>
                <p className="text-muted-foreground mt-4" dir="rtl">
                  دسترسی کامل به همه دوره‌ها با بهترین قیمت
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-8" dir="rtl">
                  {/* Price Comparison */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 space-y-4 shadow-lg border-2 border-white">
                    <div className="flex justify-between items-center pb-4 border-b-2 border-border">
                      <span className="text-lg text-muted-foreground">قیمت خرید جداگانه:</span>
                      <span className="text-2xl line-through text-muted-foreground font-bold">
                        {totalPrice.toLocaleString('fa-IR')} تومان
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b-2 border-primary/20">
                      <span className="text-xl font-semibold text-primary">قیمت بسته:</span>
                      <span className="text-4xl font-bold text-primary">
                        {path.bundlePrice.toLocaleString('fa-IR')} تومان
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-4 bg-gradient-to-r from-emerald-50 to-green-50 -mx-8 -mb-8 px-8 py-6 rounded-b-2xl border-t-2 border-emerald-200">
                      <span className="text-xl font-bold text-emerald-700">صرفه‌جویی شما:</span>
                      <span className="text-3xl font-bold text-emerald-700">
                        {savings.toLocaleString('fa-IR')} تومان
                      </span>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-3">
                    {[
                      "دسترسی مادام‌العمر به همه دوره‌های مسیر",
                      "پشتیبانی اختصاصی در تلگرام",
                      "به‌روزرسانی‌های رایگان محتوا",
                      "گواهی‌نامه معتبر پایان مسیر",
                      "دسترسی به کامیونیتی اختصاصی",
                      "پروژه‌های عملی با راهنمایی گام‌به‌گام"
                    ].map((benefit, index) => (
                      <div key={index} className="flex items-start gap-3 bg-white/60 p-4 rounded-xl border border-white/80">
                        <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-text-strong font-medium">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Buttons */}
                  <div className="grid md:grid-cols-2 gap-4 pt-6">
                    <Button size="lg" className={`w-full bg-gradient-to-r ${path.gradient} text-white hover:opacity-90 shadow-lg py-7 text-lg font-bold`}>
                      <ShoppingCart className="ml-2 w-5 h-5" />
                      خرید بسته کامل
                    </Button>
                    <Button size="lg" variant="outline" className="w-full border-2 border-primary/30 hover:bg-primary/5 py-7 text-lg font-bold" asChild>
                      <Link to="/courses">
                        مشاهده دوره‌ها
                        <ArrowRight className="mr-2 w-5 h-5" />
                      </Link>
                    </Button>
                  </div>

                  {/* Trust Badge */}
                  <div className="text-center pt-4">
                    <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                      <Award className="w-5 h-5 text-amber-500" />
                      <span>ضمانت ۳۰ روزه بازگشت وجه</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
