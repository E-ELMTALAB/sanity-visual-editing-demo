import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/CourseCard";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
// Sanity imports for fetching courses
import { fetchFromSanity } from "@/lib/sanity.client";
import { homeCoursesQuery } from "@/lib/sanity.queries";
import { getImageUrl } from "@/lib/sanity.image";
import { validateSanityConfig } from "@/lib/sanity.config";
import v0Image from "@/assets/v0.jpg";
import codexImage from "@/assets/codex.jpg";
import cursorImage from "@/assets/cursor.jpg";
import n8nImage from "@/assets/n8n.jpg";
import sliderV0 from "@/assets/slider-v0.jpg";
import sliderCursor from "@/assets/slider-cursor.jpg";
import sliderN8n from "@/assets/slider-n8n.jpg";
import sliderCodex from "@/assets/slider-codex.jpg";
import { 
  Sparkles, 
  Cpu, 
  Workflow, 
  CheckCircle2, 
  Users, 
  Award, 
  Clock, 
  MessageSquare,
  ArrowLeft,
  Code2,
  Rocket,
  HeadphonesIcon,
  Tag,
  MessageCircle,
  TrendingUp,
  Brain,
  Zap,
  BarChart3,
  DollarSign,
  Plane,
  Trophy,
  Target,
  Monitor,
  Database,
  FileText,
  Palette,
  Bot,
  Lightbulb,
  Smile,
  Star,
  BookOpen,
  GraduationCap,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const roleBasedPaths = [
  {
    title: "AI Engineer (LLM & Retrieval)",
    titlePersian: "مهندس هوش مصنوعی",
    icon: Brain,
    whatYouBuild: "یک اپلیکیشن مکالمه‌ای که به داده‌ها و سرویس‌ها وصل می‌شود.",
    output: "دمو زنده + ریپوی تمیز + صفحهٔ آزمایش.",
    ctaText: "شروع مسیر مهندسی",
    color: "from-cyan-400 to-blue-500",
    iconBg: "from-cyan-400/20 to-blue-500/20",
    iconColor: "text-cyan-500",
  },
  {
    title: "AI Developer (Develop with AI)",
    titlePersian: "توسعه‌دهنده هوش مصنوعی",
    icon: Code2,
    whatYouBuild: "یک وب‌سایت/اپ کوچک که با کمک AI سریع‌تر ساخته و منتشر می‌شود.",
    output: "سایت/اپ آنلاین + توضیح کوتاه «چطور ساخته شد».",
    ctaText: "شروع مسیر توسعه",
    color: "from-violet-400 to-purple-500",
    iconBg: "from-violet-400/20 to-purple-500/20",
    iconColor: "text-violet-500",
  },
  {
    title: "AI Process Optimizer",
    titlePersian: "بهینه‌ساز فرآیند با AI",
    icon: BarChart3,
    whatYouBuild: "یک فرایند کاری را خودکار و هوشمند می‌کنی (مثل پاسخ‌گویی، ثبت سفارش، گزارش‌دهی).",
    output: "جریان خودکار واقعی + گزارش بهبود (یک پاراگراف).",
    ctaText: "شروع مسیر بهینه‌سازی",
    color: "from-emerald-400 to-green-500",
    iconBg: "from-emerald-400/20 to-green-500/20",
    iconColor: "text-emerald-500",
  },
];

const whyLearnAI = [
  {
    title: "درآمد بهتر",
    description: "با یادگیری AI و ساخت ۲–۳ پروژهٔ زنده، شانس پیشنهادهای کاری بهتر را افزایش می‌دهی.",
    icon: DollarSign,
    gradient: "from-emerald-400/20 to-green-500/20",
    iconColor: "text-emerald-500",
    bgGradient: "from-emerald-50/80 to-green-50/80",
  },
  {
    title: "گامِ مهاجرت مهارتی",
    description: "با پورتفولیوی منتشرشده و یک Case Study کوتاه، برای اپلای حرفه‌ای آماده می‌شوی.",
    icon: Plane,
    gradient: "from-blue-400/20 to-cyan-500/20",
    iconColor: "text-blue-500",
    bgGradient: "from-blue-50/80 to-cyan-50/80",
  },
  {
    title: "حرفه‌ای شدن و اعتبار اجتماعی",
    description: "با گواهی و پروژهٔ نمایشگاهی، در جامعهٔ تخصصی دیده می‌شوی و اعتماد می‌سازی.",
    icon: Trophy,
    gradient: "from-amber-400/20 to-orange-500/20",
    iconColor: "text-amber-500",
    bgGradient: "from-amber-50/80 to-orange-50/80",
  },
  {
    title: "آینده‌پذیری (عقب‌نماندن)",
    description: "با چالش ۱۴روزه و مهارت‌های پایهٔ AI، از روندها عقب نمی‌مانی و آمادهٔ نقش‌های جدید می‌شوی.",
    icon: Target,
    gradient: "from-violet-400/20 to-purple-500/20",
    iconColor: "text-violet-500",
    bgGradient: "from-violet-50/80 to-purple-50/80",
  },
];

const featuredCoursesData = [
  {
    id: "v0-frontend",
    title: "دسترسی به همهٔ دوره‌ها",
    subtitle: "به‌همراه اکانت ChatGPT برای تمرین‌ها",
    description: "یک اشتراک برای کل مسیرها؛ پروژه واقعی، مسیر مشخص و مستندات فارسی برای هر دوره.",
    image: sliderV0,
    stats: "+۱,۲۸۰ دانشجو ثبت‌نام شده",
    instructors: "۵+ اساتید متخصص",
    ctaPrimary: "شروع مسیر من (پلن ۲ دقیقه‌ای)",
    ctaSecondary: "مشاهده پیش‌نمایش",
    offer: "پیشنهاد ویژه: همهٔ دوره‌ها + اکانت ChatGPT (برای تمرین‌ها) — از ۶۹,۰۰۰ تا ۸,۶۰۰,۰۰۰ تومان",
  },
  {
    id: "cursor-fullstack",
    title: "یادگیری هوشمند با AI",
    subtitle: "کد بزن سریع‌تر، بساز بهتر",
    description: "با Cursor و ابزارهای AI، مهارت کدنویسی خودت رو ۱۰ برابر کن و پروژه‌های حرفه‌ای بساز.",
    image: sliderCursor,
    stats: "+۴۵۰ دانشجو فعال",
    instructors: "۸+ ساعت آموزش",
    ctaPrimary: "شروع دوره Cursor",
    ctaSecondary: "دمو رایگان",
    offer: "ویژه امروز: دوره کامل Cursor + پروژه عملی — ۵۹۰,۰۰۰ تومان",
  },
  {
    id: "n8n-automation",
    title: "اتوماسیون و هوش مصنوعی",
    subtitle: "سیستم‌های هوشمند خودکار بساز",
    description: "با N8N و AgentKit، فرآیندهای کاری رو اتوماتیک کن و زمان خودت رو آزاد کن.",
    image: sliderN8n,
    stats: "+۳۲۰ اتوماسیون ساخته شده",
    instructors: "۱۰+ کیس استادی واقعی",
    ctaPrimary: "یادگیری اتوماسیون",
    ctaSecondary: "مشاهده نمونه‌ها",
    offer: "پکیج ویژه: N8N + AgentKit + پروژه‌های عملی — ۶۹۰,۰۰۰ تومان",
  },
  {
    id: "codex-backend",
    title: "ساخت پروژه‌های واقعی",
    subtitle: "با راهنمایی گام‌به‌گام و پشتیبانی",
    description: "از ایده تا اجرا، با ابزارهای حرفه‌ای و منتورینگ مستقیم یک پروژه قابل نمایش بساز.",
    image: sliderCodex,
    stats: "+۶۲۰ پروژه منتشر شده",
    instructors: "پشتیبانی ۲۴/۷",
    ctaPrimary: "مشاهده پروژه‌های دانشجویی",
    ctaSecondary: "شروع پروژه من",
    offer: "ویژه: دسترسی به تمام پروژه‌ها + ابزارهای توسعه — از ۷۹,۰۰۰ تومان",
  },
];

function FeaturedCoursesCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, direction: 'rtl' }, [Autoplay({ delay: 4000, stopOnInteraction: false })]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    
    emblaApi.on('select', () => {
      setCurrentSlide(emblaApi.selectedScrollSnap());
    });
  }, [emblaApi]);

  return (
    <section className="py-16 md:py-24 px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface via-background to-surface-2">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/10 to-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-tr from-accent/10 to-primary-light/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="relative">
          <div className="text-center mb-10 md:mb-16" dir="rtl">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur-sm border border-primary/20 rounded-full px-5 py-2.5 mb-6 shadow-sm">
              <Rocket className="w-4 h-4 text-primary animate-bounce" style={{ animationDuration: '2s' }} />
              <span className="text-sm font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">دوره‌های پرطرفدار</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-l from-primary via-primary-light to-accent bg-clip-text text-transparent">
              دوره‌های منتخب برای ساختن واقعی
            </h2>
            <p className="text-sm md:text-base lg:text-lg text-text-muted max-w-3xl mx-auto font-medium">
              از سایت و چت‌بات تا محتوا و تصویر—همهٔ دوره‌ها خروجیِ قابل‌نمایش دارن
            </p>
          </div>

          {/* Carousel Container */}
          <div className="relative px-0 md:px-12">
            {/* Desktop Previous Button */}
            <button
              onClick={() => emblaApi?.scrollPrev()}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-30 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-surface/95 backdrop-blur-md border border-border shadow-xl hover:shadow-2xl items-center justify-center hover:bg-primary/10 hover:border-primary/50 hover:scale-110 transition-all duration-300 group"
            >
              <ArrowLeft className="w-6 h-6 text-text-strong group-hover:text-primary transition-colors" />
            </button>

            {/* Desktop Next Button */}
            <button
              onClick={() => emblaApi?.scrollNext()}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-30 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-surface/95 backdrop-blur-md border border-border shadow-xl hover:shadow-2xl items-center justify-center hover:bg-primary/10 hover:border-primary/50 hover:scale-110 transition-all duration-300 group rotate-180"
            >
              <ArrowLeft className="w-6 h-6 text-text-strong group-hover:text-primary transition-colors" />
            </button>

            <div className="overflow-hidden rounded-2xl md:rounded-3xl" ref={emblaRef}>
              <div className="flex">
                {featuredCoursesData.map((course, idx) => (
                  <div
                    key={idx}
                    className="flex-[0_0_100%] min-w-0 px-3 md:px-4"
                  >
                    {/* Mobile: Clean Image Only | Desktop: Image with Overlay */}
                    <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-xl md:shadow-[0_10px_40px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)] transition-all duration-500 group">
                      
                      {/* Image Container - Taller/Stretched on mobile, Landscape on desktop */}
                      <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden">
                        <img 
                          src={course.image} 
                          alt={course.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                        
                        {/* Gradient Overlay - Only on desktop */}
                        <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent"></div>
                        
                        {/* Content Overlay - Only on desktop */}
                        <div className="hidden md:block absolute bottom-0 left-0 right-0 p-5 lg:p-6" dir="rtl">
                          <div className="space-y-3">
                            {/* Title */}
                            <h3 className="text-xl lg:text-2xl font-bold text-white leading-tight">
                              {course.title}
                            </h3>
                            
                            {/* Description */}
                            <p className="text-sm text-gray-200 leading-relaxed line-clamp-2 max-w-2xl">
                              {course.description}
                            </p>
                            
                            {/* CTA Button */}
                            <Link to={`/course/${course.id}`} className="inline-block">
                              <Button 
                                className="h-11 px-7 text-base rounded-xl bg-gradient-to-r from-primary via-primary-light to-accent hover:shadow-lg hover:shadow-primary/40 text-white font-bold transition-all duration-300 hover:scale-105 border border-white/20"
                              >
                                <Sparkles className="ml-2 w-4 h-4 animate-pulse" />
                                شروع مسیر
                                <ArrowLeft className="mr-2 w-4 h-4 rotate-180" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-6 md:mt-8">
            {featuredCoursesData.map((_, idx) => (
              <button
                key={idx}
                onClick={() => emblaApi?.scrollTo(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === idx 
                    ? 'w-8 md:w-10 bg-gradient-to-r from-primary to-accent shadow-md' 
                    : 'w-2 bg-border hover:bg-text-muted hover:scale-125'
                }`}
                aria-label={`اسلاید ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function RoleBasedPathsCarousel() {
  const [emblaRef2, emblaApi2] = useEmblaCarousel({ loop: true, direction: 'rtl' }, [Autoplay({ delay: 5000, stopOnInteraction: false })]);
  const [currentSlide2, setCurrentSlide2] = useState(0);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  useEffect(() => {
    if (!emblaApi2) return;
    
    emblaApi2.on('select', () => {
      setCurrentSlide2(emblaApi2.selectedScrollSnap());
      setExpandedCard(null); // بستن کارت باز شده هنگام اسکرول
    });
  }, [emblaApi2]);

  return (
    <section className="py-16 md:py-24 px-4 relative overflow-hidden">
      {/* Modern Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface-2 via-background to-surface">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-[500px] h-[500px] bg-gradient-to-br from-cyan-400/15 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-[400px] h-[400px] bg-gradient-to-br from-violet-400/15 to-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-br from-emerald-400/10 to-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
        </div>
      </div>
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-12 md:mb-16" dir="rtl">
          <div className="inline-flex items-center gap-2.5 bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur-sm border border-primary/20 rounded-full px-5 py-2.5 mb-6 shadow-sm">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">مسیرهای شغلی</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 md:mb-6 bg-gradient-to-l from-primary via-accent to-primary bg-clip-text text-transparent">
            مسیر یادگیری خودت را انتخاب کن
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
            یک نقش انتخاب کن، بساز، و نتیجه را منتشر کن—با پروژه‌های واقعی
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Previous Button */}
          <button
            onClick={() => emblaApi2?.scrollPrev()}
            className="absolute left-0 md:left-2 lg:left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-surface/95 to-surface/80 backdrop-blur-md border-2 border-primary/30 flex items-center justify-center hover:border-primary hover:scale-110 transition-all duration-300 shadow-xl group"
          >
            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-primary group-hover:text-primary-light transition-colors" />
          </button>

          {/* Next Button */}
          <button
            onClick={() => emblaApi2?.scrollNext()}
            className="absolute right-0 md:right-2 lg:right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-surface/95 to-surface/80 backdrop-blur-md border-2 border-primary/30 flex items-center justify-center hover:border-primary hover:scale-110 transition-all duration-300 shadow-xl group rotate-180"
          >
            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-primary group-hover:text-primary-light transition-colors" />
          </button>

          <div className="overflow-hidden rounded-2xl" ref={emblaRef2}>
            <div className="flex">
              {roleBasedPaths.map((path, idx) => {
                const Icon = path.icon;
                return (
                  <div
                    key={idx}
                    className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 px-2 md:px-4"
                  >
                    <div
                      className={`group relative bg-card/80 dark:bg-card/40 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-neu-out hover:shadow-neu-hover transition-all duration-500 p-6 md:p-8 text-right overflow-hidden ${expandedCard === idx ? 'min-h-[520px]' : 'min-h-[380px]'} md:min-h-[580px] flex flex-col border-2 border-border hover:-translate-y-2`}
                      dir="rtl"
                    >
                      {/* Decorative gradient overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${path.iconBg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                      
                      {/* Decorative circles */}
                      <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${path.color} opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity`}></div>
                      <div className={`absolute -bottom-10 -left-10 w-24 h-24 bg-gradient-to-br ${path.color} opacity-15 rounded-full blur-2xl group-hover:opacity-25 transition-opacity`}></div>
                      
                      <div className="relative z-10">
                        {/* Icon with glass effect */}
                        <div className="flex justify-center mb-6">
                          <div className={`w-20 md:w-24 h-20 md:h-24 rounded-2xl bg-gradient-to-br ${path.iconBg} backdrop-blur-md shadow-neu-in flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-neu-out border-2 border-border`}>
                            <Icon className={`w-10 md:w-12 h-10 md:h-12 ${path.iconColor} transition-transform duration-300 group-hover:rotate-12 drop-shadow-lg`} />
                          </div>
                        </div>
                        
                        {/* Title with enhanced styling */}
                        <div className="space-y-3 mb-6 text-center">
                          <h3 className="text-xl md:text-2xl font-bold text-text-strong transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-primary-light group-hover:bg-clip-text group-hover:text-transparent group-hover:scale-105">
                            {path.title}
                          </h3>
                          <p className="text-sm md:text-base text-text-muted font-semibold transition-colors duration-300 group-hover:text-text px-4 py-2 bg-surface/30 dark:bg-surface/50 backdrop-blur-sm rounded-xl border border-border">
                            {path.titlePersian}
                          </p>
                        </div>
                        
                        {/* Expand Button - Mobile Only */}
                        <button
                          onClick={() => setExpandedCard(expandedCard === idx ? null : idx)}
                          className="md:hidden w-full mb-4 py-2 rounded-lg bg-surface/40 backdrop-blur-sm border border-border/50 flex items-center justify-center gap-2 transition-all duration-300 hover:bg-surface/60 active:scale-95"
                        >
                          <span className="text-xs text-text-muted font-medium">
                            {expandedCard === idx ? 'بستن جزئیات' : 'مشاهده جزئیات'}
                          </span>
                          <ArrowLeft className={`w-3.5 h-3.5 text-primary transition-transform duration-300 ${expandedCard === idx ? 'rotate-90' : '-rotate-90'}`} />
                        </button>

                        {/* Content - Enhanced */}
                        <div className={`flex-1 space-y-5 transition-all duration-500 overflow-hidden ${expandedCard === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 md:max-h-96 md:opacity-100'}`}>
                          {/* What You Build */}
                          <div className="space-y-2 pb-4 border-b-2 border-border transition-all duration-300 group-hover:border-primary/30 text-center">
                            <h4 className={`text-sm md:text-base font-bold ${path.iconColor} transition-all duration-300 group-hover:scale-105 flex items-center justify-center gap-2`}>
                              <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${path.color}`}></div>
                              چه می‌سازی؟
                            </h4>
                            <p className="text-xs md:text-sm text-text leading-relaxed transition-all duration-300 group-hover:text-text-strong bg-surface/20 dark:bg-surface/40 backdrop-blur-sm p-3 rounded-lg border border-border">
                              {path.whatYouBuild}
                            </p>
                          </div>
                          
                          {/* Output */}
                          <div className="space-y-2 transition-all duration-300 text-center">
                            <h4 className={`text-sm md:text-base font-bold ${path.iconColor} transition-all duration-300 group-hover:scale-105 flex items-center justify-center gap-2`}>
                              <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${path.color} animate-pulse`}></div>
                              خروجی:
                            </h4>
                            <p className="text-xs md:text-sm text-text-muted leading-relaxed transition-all duration-300 group-hover:text-text bg-surface/20 dark:bg-surface/40 backdrop-blur-sm p-3 rounded-lg border border-border">
                              {path.output}
                            </p>
                          </div>
                        </div>
                        
                        {/* CTA Button - Enhanced */}
                        <div className="mt-auto pt-6">
                          <Link to={`/start-path/${idx === 0 ? 'engineering' : idx === 1 ? 'development' : 'optimization'}`}>
                            <Button 
                              className={`w-full rounded-2xl bg-gradient-to-r ${path.color} text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:scale-105 py-6 text-sm md:text-base relative overflow-hidden border-2 border-primary/20`}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                              <span className="relative flex items-center justify-center gap-2">
                                {path.ctaText}
                                <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                              </span>
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

const categories = [
  { name: "هوش مصنوعی", icon: Brain, color: "text-cyan-500" },
  { name: "فرانت اند", icon: Monitor, color: "text-blue-500" },
  { name: "بک اند", icon: Database, color: "text-purple-500" },
  { name: "کد نویسی", icon: Code2, color: "text-violet-500" },
  { name: "پرامپت انجینیرینگ", icon: Lightbulb, color: "text-orange-500" },
  { name: "ساخت اتوماسیون", icon: Workflow, color: "text-emerald-500" },
  { name: "طراحی سایت", icon: Palette, color: "text-pink-500" },
  { name: "تولید محتوا", icon: FileText, color: "text-amber-500" },
  { name: "ایجنت هوشمند", icon: Bot, color: "text-indigo-500" },
];

// Fallback courses (used if Sanity fetch fails or during loading)
const fallbackCourses = [
  {
    slug: "chatbot-telegram",
    title: "ساخت چت‌بات تلگرام با ChatGPT",
    tags: ["ChatGPT", "Telegram", "Python"],
    durationHours: 8,
    level: "مبتدی" as const,
    price: 890000,
    installments: true,
  },
  {
    slug: "image-generation-ai",
    title: "تولید تصویر با هوش مصنوعی (Midjourney & DALL-E)",
    tags: ["Midjourney", "DALL-E", "طراحی"],
    durationHours: 6,
    level: "مبتدی" as const,
    price: 650000,
  },
  {
    slug: "content-creation-ai",
    title: "تولید محتوا با هوش مصنوعی",
    tags: ["GPT-4", "Jasper", "کپی‌رایتینگ"],
    durationHours: 10,
    level: "متوسط" as const,
    price: 1200000,
    installments: true,
  },
];

/**
 * Transform Sanity course data to component format
 */
function transformSanityCourse(sanityCourse: any) {
  // Map Sanity level values to Persian
  const levelMap: Record<string, "مبتدی" | "متوسط" | "پیشرفته"> = {
    'beginner': 'مبتدی',
    'intermediate': 'متوسط',
    'advanced': 'پیشرفته',
    'beginner-intermediate': 'متوسط',
    'beginner-advanced': 'پیشرفته',
  };

  // Extract duration hours from string like "40 ساعت" or just "40"
  const durationMatch = sanityCourse.duration?.match(/\d+/);
  const durationHours = durationMatch ? parseInt(durationMatch[0]) : 8;

  return {
    slug: sanityCourse.slug || `course-${sanityCourse._key}`,
    title: sanityCourse.title || 'دوره آموزشی',
    tags: sanityCourse.category ? [sanityCourse.category] : [],
    image: sanityCourse.image ? getImageUrl(sanityCourse.image, 400) : undefined,
    durationHours,
    level: levelMap[sanityCourse.level] || 'مبتدی',
    price: sanityCourse.price || 0,
    installments: sanityCourse.originalPrice ? true : false,
  };
}

// Mobile Featured Courses Carousel Component
function MobileFeaturedCoursesCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: 'center',
      skipSnaps: false,
      dragFree: false,
      direction: 'rtl',
    },
    [Autoplay({ delay: 4500, stopOnInteraction: true })]
  );
  const [currentSlide, setCurrentSlide] = useState(0);

  useState(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCurrentSlide(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);
    onSelect();

    return () => {
      emblaApi.off('select', onSelect);
    };
  });

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  return (
    <div className="relative px-2">
      {/* Title and Description */}
      <div className="text-center mb-8 px-4" dir="rtl">
        <h2 className="text-3xl md:text-4xl font-extrabold text-text-strong mb-3 bg-gradient-to-l from-primary via-primary-light to-accent bg-clip-text text-transparent">
          محبوب‌ترین دوره‌ها
        </h2>
        <p className="text-sm text-text-muted">
          با پروژه‌های واقعی به بازار کار ورود کن
        </p>
      </div>

      {/* Carousel Container */}
      <div className="overflow-hidden -mx-2" ref={emblaRef}>
        <div className="flex gap-4 px-2">
          {featuredCourses.map((course) => (
            <div 
              key={course.slug} 
              className="flex-[0_0_90%] min-w-0"
            >
              <div className="group relative bg-gradient-to-br from-surface/95 to-surface/70 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.2)] transition-all duration-500 overflow-hidden border-2 border-border/50 hover:-translate-y-2">
                {/* Decorative gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Content */}
                <div className="relative">
                  {/* Image */}
                  <div className="relative h-44 bg-gradient-to-br from-primary/20 via-primary-light/15 to-accent/20 overflow-hidden">
                    {course.slug === "chatbot-telegram" && (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-500/20 to-blue-600/20">
                        <MessageCircle className="w-20 h-20 text-cyan-600 opacity-40" />
                      </div>
                    )}
                    {course.slug === "image-generation-ai" && (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-pink-600/20">
                        <Palette className="w-20 h-20 text-purple-600 opacity-40" />
                      </div>
                    )}
                    {course.slug === "content-creation-ai" && (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-500/20 to-amber-600/20">
                        <FileText className="w-20 h-20 text-orange-600 opacity-40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-4" dir="rtl">
                    {/* Title */}
                    <h3 className="text-lg font-bold text-text-strong leading-tight line-clamp-2 min-h-[3.5rem] group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {course.tags.slice(0, 3).map((tag, idx) => (
                        <span 
                          key={idx} 
                          className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-primary/10 to-accent/10 text-primary border border-primary/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 pt-2">
                      <div className="flex items-center gap-1.5 text-text-muted">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">{course.durationHours} ساعت</span>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                        course.level === "مبتدی" ? "bg-success/15 text-success border border-success/30" :
                        course.level === "متوسط" ? "bg-warning/15 text-warning border border-warning/30" :
                        "bg-danger/15 text-danger border border-danger/30"
                      }`}>
                        {course.level}
                      </div>
                    </div>

                    {/* Price & CTA */}
                    <div className="pt-4 border-t-2 border-primary/10 space-y-3">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent">
                          {course.price.toLocaleString('fa-IR')}
                        </span>
                        <span className="text-xs text-text-muted font-medium">تومان</span>
                      </div>
                      {course.installments && (
                        <span className="text-xs text-success font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          قابل اقساط
                        </span>
                      )}
                      
                      <Link to={`/courses/${course.slug}`} className="block">
                        <Button 
                          size="sm"
                          className="w-full bg-gradient-to-r from-primary to-primary-light text-white hover:shadow-lg hover:scale-105 transition-all duration-300 rounded-xl px-5 py-2.5 text-sm font-bold relative overflow-hidden group/btn"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                          <span className="relative">مشاهده دوره</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View All Button */}
      <div className="flex justify-center mt-8">
        <Link to="/courses">
          <Button className="gap-2 bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-accent transition-all duration-300 hover:scale-105 shadow-lg">
            مشاهده همه
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </Button>
        </Link>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={scrollPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-md shadow-neu-out hover:shadow-neu-hover border-2 border-white/70 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-primary/40 z-10 group/btn"
        aria-label="دوره قبلی"
      >
        <ArrowLeft className="w-5 h-5 text-primary group-hover/btn:text-primary-light transition-colors" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-md shadow-neu-out hover:shadow-neu-hover border-2 border-white/70 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-primary/40 z-10 group/btn"
        aria-label="دوره بعدی"
      >
        <ArrowLeft className="w-5 h-5 text-primary group-hover/btn:text-primary-light rotate-180 transition-colors" />
      </button>
    </div>
  );
}

const benefits = [
  {
    icon: Rocket,
    title: "پروژه‌محور",
    description: "با ساخت پروژه‌های واقعی یاد بگیرید",
  },
  {
    icon: HeadphonesIcon,
    title: "پشتیبانی ۲۴/۷",
    description: "همیشه در کنار شما هستیم",
  },
  {
    icon: Award,
    title: "گواهی معتبر",
    description: "دریافت گواهی پس از اتمام دوره",
  },
];

// Learning Paths Carousel Component
function LearningPathsCarousel() {
  const [emblaRef3, emblaApi3] = useEmblaCarousel({ loop: true, direction: 'rtl' }, [Autoplay({ delay: 5000, stopOnInteraction: false })]);

  return { emblaRef3, emblaApi3 };
}

export default function Home() {
  const { emblaRef3, emblaApi3 } = LearningPathsCarousel();
  
  // State for courses fetched from Sanity
  const [featuredCourses, setFeaturedCourses] = useState(fallbackCourses);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [sanityError, setSanityError] = useState<string | null>(null);

  // Fetch courses from Sanity on component mount
  useEffect(() => {
    // Validate Sanity configuration
    const isConfigValid = validateSanityConfig();
    
    if (!isConfigValid) {
      console.warn('[HOME] Sanity not configured, using fallback courses');
      setIsLoadingCourses(false);
      setSanityError('Sanity not configured. Using fallback data.');
      return;
    }

    async function loadCourses() {
      try {
        console.log('[HOME] Fetching courses from Sanity...');
        setIsLoadingCourses(true);
        
        const data = await fetchFromSanity<{ bestsellingCourses?: any[] }>(homeCoursesQuery);
        
        if (data?.bestsellingCourses && data.bestsellingCourses.length > 0) {
          const transformedCourses = data.bestsellingCourses.map(transformSanityCourse);
          setFeaturedCourses(transformedCourses);
          console.log(`[HOME] ✅ Loaded ${transformedCourses.length} courses from Sanity`);
        } else {
          console.warn('[HOME] No courses found in Sanity, using fallback');
          setSanityError('No courses found in Sanity');
        }
      } catch (error) {
        console.error('[HOME] ❌ Failed to fetch courses from Sanity:', error);
        setSanityError(error instanceof Error ? error.message : 'Failed to load courses');
      } finally {
        setIsLoadingCourses(false);
      }
    }

    loadCourses();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section - Modern & Clean Design */}
      <section className="relative pt-20 md:pt-28 lg:pt-32 pb-12 md:pb-20 lg:pb-24 px-4 overflow-hidden bg-gradient-to-b from-background via-surface/30 to-background">
        
        {/* Clean Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-accent/8 to-transparent rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            
            {/* Right Side - Text Content */}
            <div className="flex flex-col text-right space-y-5 md:space-y-7 order-2 lg:order-1" dir="rtl">
              
              {/* Top Badge */}
              <div className="inline-flex items-center gap-2 self-start bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur-sm border border-primary/20 rounded-full px-4 md:px-5 py-2 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary animate-pulse" />
                <span className="text-xs md:text-sm font-semibold text-primary">
                  پلتفرم برتر یادگیری AI
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="font-extrabold leading-[1.1]">
                <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-2 md:mb-3">
                  <span className="text-text-strong">بیا با </span>
                  <span className="bg-gradient-to-l from-primary via-primary-light to-accent bg-clip-text text-transparent">هوش مصنوعی</span>
                </span>
                <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-text-strong">
                  آینده‌ت رو بساز
                </span>
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base md:text-lg text-text leading-relaxed max-w-xl">
                از طراحی سایت تا ساخت چت‌بات، با آموزش‌های عملی و پروژه‌محور. همین الان شروع کن و تو دنیای AI حرفه‌ای بشو.
              </p>

              {/* CTA Button */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2">
                <Link to="/path-builder">
                  <Button 
                    size="lg"
                    className="w-full sm:w-auto px-6 md:px-8 py-5 md:py-6 rounded-2xl text-base md:text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-primary to-accent text-white hover:scale-105 group"
                  >
                    <Sparkles className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:rotate-12 transition-transform" />
                    <span>شروع رایگان</span>
                  </Button>
                </Link>
                
                <a href="https://t.me/sharifgpt_bot" target="_blank" rel="noopener noreferrer">
                  <Button 
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto px-6 md:px-8 py-5 md:py-6 rounded-2xl text-base md:text-lg font-semibold border-2 border-border bg-surface/80 backdrop-blur-sm hover:bg-surface hover:border-primary/40 transition-all duration-300"
                  >
                    <MessageSquare className="ml-2 w-4 h-4 md:w-5 md:h-5" />
                    <span>مشاوره رایگان</span>
                  </Button>
                </a>
              </div>

              {/* Stats - Mobile & Desktop */}
              <div className="flex flex-wrap items-center gap-4 md:gap-6 pt-2 md:pt-4">
                {/* Students Count */}
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div 
                        key={i} 
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-surface shadow-md"
                      ></div>
                    ))}
                  </div>
                  <div className="text-right">
                    <span className="block text-base md:text-xl font-bold text-primary">+۱,۲۸۰</span>
                    <span className="block text-xs md:text-sm text-text-muted">دانشجوی فعال</span>
                  </div>
                </div>
                
                <div className="w-px h-10 md:h-12 bg-border"></div>
                
                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 md:w-5 md:h-5 ${i <= 4 ? 'text-amber-400 fill-amber-400' : 'text-amber-300'}`} 
                      />
                    ))}
                  </div>
                  <div className="text-right">
                    <span className="block text-base md:text-xl font-bold text-text-strong">۴.۸</span>
                    <span className="block text-xs md:text-sm text-text-muted">(۶۲۰ نظر)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Left Side - Visual Element with Floating Badge */}
            <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end items-center mt-16 md:mt-0">
              
              {/* Floating Discount Badge - Inspired by reference */}
              <div className="absolute top-20 md:top-8 lg:top-12 right-4 md:right-8 lg:right-16 z-20 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="bg-gradient-to-br from-primary to-primary-light text-white rounded-2xl md:rounded-3xl p-3 md:p-5 shadow-2xl border-2 border-white/30 backdrop-blur-sm transform rotate-12 hover:rotate-0 transition-transform duration-300">
                  <div className="text-center">
                    <p className="text-2xl md:text-4xl font-extrabold leading-none">۲۵٪</p>
                    <p className="text-[10px] md:text-xs font-semibold mt-1 opacity-90">تخفیف ویژه</p>
                    <p className="text-[8px] md:text-[10px] opacity-75">همین حالا</p>
                  </div>
                </div>
              </div>

              {/* Main Visual Circle - AI Brain Concept */}
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[450px] lg:h-[450px]">
                
                {/* Decorative Background Circle */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/10 to-primary-light/5 rounded-full"></div>
                
                {/* Outer Animated Ring */}
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse" style={{ animationDuration: '3s' }}></div>
                
                {/* Middle Ring */}
                <div className="absolute inset-8 rounded-full border-2 border-primary/30 opacity-60"></div>
                
                {/* Center Icon - Large Brain */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full bg-gradient-to-br from-primary/20 via-primary-light/30 to-accent/20 backdrop-blur-xl border-4 border-white/60 shadow-2xl flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 animate-pulse"></div>
                    <Brain className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-primary relative z-10" />
                  </div>
                </div>

                {/* Orbiting Feature Icons */}
                <style>{`
                  @keyframes orbit-1 {
                    0% { transform: rotate(0deg) translateX(140px) rotate(0deg); }
                    100% { transform: rotate(360deg) translateX(140px) rotate(-360deg); }
                  }
                  @keyframes orbit-2 {
                    0% { transform: rotate(120deg) translateX(150px) rotate(-120deg); }
                    100% { transform: rotate(480deg) translateX(150px) rotate(-480deg); }
                  }
                  @keyframes orbit-3 {
                    0% { transform: rotate(240deg) translateX(145px) rotate(-240deg); }
                    100% { transform: rotate(-120deg) translateX(145px) rotate(120deg); }
                  }
                  @media (max-width: 1024px) {
                    @keyframes orbit-1 {
                      0% { transform: rotate(0deg) translateX(120px) rotate(0deg); }
                      100% { transform: rotate(360deg) translateX(120px) rotate(-360deg); }
                    }
                    @keyframes orbit-2 {
                      0% { transform: rotate(120deg) translateX(125px) rotate(-120deg); }
                      100% { transform: rotate(480deg) translateX(125px) rotate(-480deg); }
                    }
                    @keyframes orbit-3 {
                      0% { transform: rotate(240deg) translateX(122px) rotate(-240deg); }
                      100% { transform: rotate(-120deg) translateX(122px) rotate(120deg); }
                    }
                  }
                  @media (max-width: 768px) {
                    @keyframes orbit-1 {
                      0% { transform: rotate(0deg) translateX(100px) rotate(0deg); }
                      100% { transform: rotate(360deg) translateX(100px) rotate(-360deg); }
                    }
                    @keyframes orbit-2 {
                      0% { transform: rotate(120deg) translateX(105px) rotate(-120deg); }
                      100% { transform: rotate(480deg) translateX(105px) rotate(-480deg); }
                    }
                    @keyframes orbit-3 {
                      0% { transform: rotate(240deg) translateX(102px) rotate(-240deg); }
                      100% { transform: rotate(-120deg) translateX(102px) rotate(120deg); }
                    }
                  }
                  .orbit-1 { animation: orbit-1 20s linear infinite; }
                  .orbit-2 { animation: orbit-2 15s linear infinite; }
                  .orbit-3 { animation: orbit-3 18s linear infinite reverse; }
                `}</style>

                <div className="absolute inset-0">
                  {/* Icon 1 - Code */}
                  <div className="orbit-1 absolute top-1/2 left-1/2 -ml-5 -mt-5 md:-ml-6 md:-mt-6 group">
                    <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 shadow-xl flex items-center justify-center border-3 border-white hover:scale-110 transition-transform relative">
                      <Code2 className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" />
                      <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-gray-900/95 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl">
                        Code your dreams into reality
                      </div>
                    </div>
                  </div>

                  {/* Icon 2 - Target/Goal */}
                  <div className="orbit-2 absolute top-1/2 left-1/2 -ml-5 -mt-5 md:-ml-6 md:-mt-6 group">
                    <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 shadow-xl flex items-center justify-center border-3 border-white hover:scale-110 transition-transform relative">
                      <Target className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" />
                      <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-gray-900/95 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl">
                        Aim high, achieve higher
                      </div>
                    </div>
                  </div>

                  {/* Icon 3 - Rocket/Launch */}
                  <div className="orbit-3 absolute top-1/2 left-1/2 -ml-5 -mt-5 md:-ml-6 md:-mt-6 group">
                    <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 shadow-xl flex items-center justify-center border-3 border-white hover:scale-110 transition-transform relative">
                      <Rocket className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" />
                      <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-gray-900/95 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl">
                        Launch your career to new heights
                      </div>
                    </div>
                  </div>

                  {/* Static Icon at bottom - Trophy */}
                  <div className="absolute bottom-4 left-1/2 -ml-4 md:-ml-5 group">
                    <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 shadow-xl flex items-center justify-center border-3 border-white animate-pulse relative">
                      <Trophy className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white" />
                      <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-gray-900/95 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl">
                        Success is your destination
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Particles */}
                <div className="absolute top-8 right-12 w-2 h-2 bg-primary/50 rounded-full animate-ping"></div>
                <div className="absolute top-20 left-8 w-1.5 h-1.5 bg-accent/50 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-16 right-16 w-2 h-2 bg-primary-light/50 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
              </div>
            </div>

          </div>

          {/* Feature Pills - Below Hero on Mobile */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-10 md:mt-16">
            <div className="group bg-surface/80 backdrop-blur-sm rounded-2xl p-4 md:p-5 border border-border hover:border-primary/40 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6 md:w-7 md:h-7 text-cyan-600" />
                </div>
                <div>
                  <p className="text-xs md:text-sm font-bold text-text-strong">پروژه محور</p>
                  <p className="text-[10px] md:text-xs text-text-muted">ساخت واقعی</p>
                </div>
              </div>
            </div>
            
            <div className="group bg-surface/80 backdrop-blur-sm rounded-2xl p-4 md:p-5 border border-border hover:border-primary/40 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-emerald-400/20 to-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <HeadphonesIcon className="w-6 h-6 md:w-7 md:h-7 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs md:text-sm font-bold text-text-strong">پشتیبانی ۲۴/۷</p>
                  <p className="text-[10px] md:text-xs text-text-muted">همیشه کنارتیم</p>
                </div>
              </div>
            </div>
            
            <div className="group bg-surface/80 backdrop-blur-sm rounded-2xl p-4 md:p-5 border border-border hover:border-primary/40 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-violet-400/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Award className="w-6 h-6 md:w-7 md:h-7 text-violet-600" />
                </div>
                <div>
                  <p className="text-xs md:text-sm font-bold text-text-strong">گواهی معتبر</p>
                  <p className="text-[10px] md:text-xs text-text-muted">با اعتبار</p>
                </div>
              </div>
            </div>

            <div className="group bg-surface/80 backdrop-blur-sm rounded-2xl p-4 md:p-5 border border-border hover:border-primary/40 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-6 h-6 md:w-7 md:h-7 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs md:text-sm font-bold text-text-strong">منتور تخصصی</p>
                  <p className="text-[10px] md:text-xs text-text-muted">همراه شما</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Courses Carousel Section */}
      <FeaturedCoursesCarousel />

      {/* Role-Based Paths */}
      <RoleBasedPathsCarousel />

      {/* Why Learn AI Section - Enhanced */}
      <section className="py-16 md:py-24 px-4 relative overflow-hidden">
        {/* Premium Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-surface/50 to-background">
          <div className="absolute inset-0">
            <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-emerald-400/12 to-green-500/8 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-gradient-to-br from-amber-400/12 to-orange-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gradient-to-br from-blue-400/10 to-cyan-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
          </div>
        </div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-12 md:mb-16" dir="rtl">
            <div className="inline-flex items-center gap-2.5 bg-gradient-to-r from-emerald-400/10 to-green-500/10 backdrop-blur-sm border border-emerald-400/20 rounded-full px-5 py-2.5 mb-6 shadow-sm">
              <Trophy className="w-4 h-4 text-emerald-600 animate-bounce" style={{ animationDuration: '2s' }} />
              <span className="text-sm font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">چرا الان؟</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 md:mb-6 bg-gradient-to-l from-emerald-500 via-primary to-amber-500 bg-clip-text text-transparent">
              چرا همین الان باید شروع کنی؟
            </h2>
            <p className="text-sm md:text-base lg:text-lg text-text-muted max-w-2xl mx-auto">
              فرصت‌ها منتظر نمی‌مانند—آینده‌ت رو امروز بساز
            </p>
          </div>
          
          {/* Enhanced Grid - Mobile: 1 column, Tablet: 2x2, Desktop: 4 in a row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {whyLearnAI.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="group relative bg-background/40 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 p-4 md:p-8 overflow-hidden hover:-translate-y-2 border border-border"
                  dir="rtl"
                >
                  {/* Animated Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>
                  
                  {/* Decorative Circles */}
                  <div className={`absolute -top-20 -right-20 w-48 h-48 bg-gradient-to-br ${item.gradient} rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>
                  <div className={`absolute -bottom-16 -left-16 w-40 h-40 bg-gradient-to-tr ${item.gradient} rounded-full blur-3xl opacity-15 group-hover:opacity-30 transition-opacity duration-500`}></div>
                  
                  {/* Vertical Layout: Icon, Title, Description */}
                  <div className="relative z-10 flex flex-col items-center text-center gap-3 md:gap-4">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${item.gradient} backdrop-blur-md shadow-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 border border-border/30`}>
                      <Icon className={`w-7 h-7 md:w-8 md:h-8 ${item.iconColor} drop-shadow-lg`} />
                    </div>
                    
                    {/* Title */}
                    <h3 className={`text-sm md:text-base font-bold ${item.iconColor} transition-all duration-300 group-hover:scale-105 leading-tight`}>
                      {item.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-xs md:text-sm text-text-muted leading-relaxed group-hover:text-text transition-colors">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 px-4 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-surface/80 to-background"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          
          {/* Desktop Grid View */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <div key={course.slug} className="transform hover:scale-105 transition-all duration-300">
                <CourseCard {...course} />
              </div>
            ))}
          </div>

          {/* Mobile Carousel View */}
          <div className="block md:hidden">
            <MobileFeaturedCoursesCarousel />
          </div>
        </div>
      </section>

      {/* Categories Section - Modern Grid */}
      <section className="py-16 md:py-24 px-4 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-surface via-background to-surface-2">
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-violet-400/8 to-purple-500/8 rounded-full blur-3xl"></div>
          <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-gradient-to-bl from-cyan-400/8 to-blue-500/8 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-12 md:mb-16" dir="rtl">
            <div className="inline-flex items-center gap-2.5 bg-gradient-to-r from-violet-400/10 to-purple-500/10 backdrop-blur-sm border border-violet-400/20 rounded-full px-5 py-2.5 mb-6 shadow-sm">
              <Palette className="w-4 h-4 text-violet-600" />
              <span className="text-sm font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">دسته‌بندی‌ها</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-l from-primary via-accent to-primary bg-clip-text text-transparent">
              دسته‌بندی‌های منتخب
            </h2>
            <p className="text-sm md:text-base text-text-muted max-w-2xl mx-auto">
              تخصص‌های مختلف هوش مصنوعی و برنامه‌نویسی
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:hidden gap-3 md:gap-4">
            {categories.map((category, idx) => {
              const Icon = category.icon;
              return (
                <Link
                  key={idx}
                  to="/courses"
                  className={`group relative bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-md rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5 md:p-6 flex flex-col items-center justify-center gap-3 md:gap-4 min-h-[140px] md:min-h-[160px] hover:-translate-y-2 border border-border/30 overflow-hidden ${idx === 4 ? 'col-span-2 sm:col-span-1' : ''}`}
                >
                  {/* Hover Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-primary-lighter/30 to-accent/30 backdrop-blur-sm shadow-md flex items-center justify-center transition-all duration-300 group-hover:scale-110 border border-white/30">
                      <Icon className={`w-7 h-7 md:w-8 md:h-8 ${category.color} drop-shadow-sm`} />
                    </div>
                    <span className="text-xs md:text-sm font-bold text-text-strong text-center transition-colors duration-300 group-hover:text-primary">
                      {category.name}
                    </span>
                  </div>
                </Link>
              );
            })}
            </div>
          </div>
          
          {/* Desktop Layout - 5 top, 4 bottom centered */}
          <div className="hidden lg:flex flex-col gap-4">
            <div className="grid grid-cols-5 gap-4">
            {categories.slice(0, 5).map((category, idx) => {
              const Icon = category.icon;
              return (
                <Link
                  key={idx}
                  to="/courses"
                  className="group relative bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-md rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5 md:p-6 flex flex-col items-center justify-center gap-3 md:gap-4 min-h-[140px] md:min-h-[160px] hover:-translate-y-2 border border-border/30 overflow-hidden"
                >
                  {/* Hover Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-primary-lighter/30 to-accent/30 backdrop-blur-sm shadow-md flex items-center justify-center transition-all duration-300 group-hover:scale-110 border border-white/30">
                      <Icon className={`w-7 h-7 md:w-8 md:h-8 ${category.color} drop-shadow-sm`} />
                    </div>
                    <span className="text-xs md:text-sm font-bold text-text-strong text-center transition-colors duration-300 group-hover:text-primary">
                      {category.name}
                    </span>
                  </div>
                </Link>
              );
            })}
            </div>
            <div className="grid grid-cols-4 gap-4 px-20">
            {categories.slice(5).map((category, idx) => {
              const Icon = category.icon;
              return (
                <Link
                  key={idx + 5}
                  to="/courses"
                  className="group relative bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-md rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5 md:p-6 flex flex-col items-center justify-center gap-3 md:gap-4 min-h-[140px] md:min-h-[160px] hover:-translate-y-2 border border-border/30 overflow-hidden"
                >
                  {/* Hover Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-primary-lighter/30 to-accent/30 backdrop-blur-sm shadow-md flex items-center justify-center transition-all duration-300 group-hover:scale-110 border border-white/30">
                      <Icon className={`w-7 h-7 md:w-8 md:h-8 ${category.color} drop-shadow-sm`} />
                    </div>
                    <span className="text-xs md:text-sm font-bold text-text-strong text-center transition-colors duration-300 group-hover:text-primary">
                      {category.name}
                    </span>
                  </div>
                </Link>
              );
            })}
            </div>
          </div>
      </section>


      {/* Learning Paths Collections Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        {/* Animated Glass Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-primary-light/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-emerald-400/30 to-teal-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-purple-400/30 to-violet-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-orange-400/20 to-amber-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-12" dir="rtl">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-l from-primary via-accent to-primary bg-clip-text text-transparent">
              مسیرهای یادگیری—کالکشن دوره‌ها
            </h2>
            <p className="text-lg text-text-muted max-w-3xl mx-auto">
              بسته‌های جامع آموزشی برای یادگیری هدفمند و سریع‌تر—با تخفیف ویژه
            </p>
          </div>

          <div className="relative">
            <div className="overflow-hidden" ref={emblaRef3}>
              <div className="flex gap-8">
                {/* Beginner Path */}
                <div className="flex-[0_0_100%] md:flex-[0_0_calc(33.333%-1.5rem)] min-w-0">
                  <Link to="/learning-path/beginner" className="group block h-full">
                    <div className="relative h-full bg-card/90 dark:bg-card/60 backdrop-blur-xl rounded-3xl shadow-neu-out hover:shadow-neu-hover transition-all duration-500 p-8 border-2 border-border overflow-hidden hover:-translate-y-2">
                      {/* Decorative circles */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/30 to-teal-500/30 rounded-full blur-3xl"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-cyan-400/30 to-blue-500/30 rounded-full blur-2xl"></div>
                      
                      <div className="relative z-10" dir="rtl">
                        {/* Icon & Badge */}
                        <div className="flex items-start justify-between mb-6">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400/40 to-teal-500/40 shadow-neu-in flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                            <BookOpen className="w-8 h-8 text-emerald-500" />
                          </div>
                          <div className="px-4 py-1.5 rounded-full bg-emerald-500/30 border-2 border-emerald-400/50 shadow-sm">
                            <span className="text-xs font-bold text-text-strong">۲ دوره</span>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl font-bold text-text-strong mb-3 transition-all duration-300 group-hover:text-emerald-700">
                          شروع راحت—قدم‌به‌قدم
                        </h3>
                        
                        {/* Subtitle */}
                        <p className="text-sm text-text mb-6 leading-relaxed font-medium">
                          مسیرهای مقدماتی برای اولین پروژهٔ AI
                        </p>

                        {/* Course Pills */}
                        <div className="space-y-2 mb-6">
                          <div className="flex items-center gap-2 p-3 rounded-xl bg-surface/30 dark:bg-surface/50 border border-border shadow-sm backdrop-blur-sm">
                            <div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></div>
                            <span className="text-xs text-text-strong font-semibold">مبانی یادگیری گام به گام</span>
                          </div>
                          <div className="flex items-center gap-2 p-3 rounded-xl bg-surface/30 dark:bg-surface/50 border border-border shadow-sm backdrop-blur-sm">
                            <div className="w-2 h-2 rounded-full bg-teal-600 animate-pulse"></div>
                            <span className="text-xs text-text-strong font-semibold">برنامه‌نویسی هوش مصنوعی</span>
                          </div>
                        </div>

                        {/* CTA */}
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <span className="text-sm font-bold text-text-strong">مشاهده مسیر کامل</span>
                          <div className="w-8 h-8 rounded-full bg-emerald-500/30 border-2 border-emerald-400/50 flex items-center justify-center transition-all duration-300 group-hover:bg-emerald-600 group-hover:scale-110 group-hover:border-emerald-500">
                            <ArrowLeft className="w-4 h-4 text-emerald-700 group-hover:text-white rotate-180" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Advanced Path */}
                <div className="flex-[0_0_100%] md:flex-[0_0_calc(33.333%-1.5rem)] min-w-0">
                  <Link to="/learning-path/advanced" className="group block h-full">
                    <div className="relative h-full bg-card/90 dark:bg-card/60 backdrop-blur-xl rounded-3xl shadow-neu-out hover:shadow-neu-hover transition-all duration-500 p-8 border-2 border-border overflow-hidden hover:-translate-y-2">
                      {/* Decorative circles */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/30 to-violet-500/30 rounded-full blur-3xl"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-indigo-400/30 to-blue-500/30 rounded-full blur-2xl"></div>
                      
                      <div className="relative z-10" dir="rtl">
                        {/* Icon & Badge */}
                        <div className="flex items-start justify-between mb-6">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400/40 to-violet-500/40 shadow-neu-in flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                            <Rocket className="w-8 h-8 text-purple-500" />
                          </div>
                          <div className="px-4 py-1.5 rounded-full bg-purple-500/30 border-2 border-purple-400/50 shadow-sm">
                            <span className="text-xs font-bold text-text-strong">۲ دوره</span>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl font-bold text-text-strong mb-3 transition-all duration-300 group-hover:text-purple-700">
                          پیشرفت جدی—کاربرد در پروژه
                        </h3>
                        
                        {/* Subtitle */}
                        <p className="text-sm text-text mb-6 leading-relaxed font-medium">
                          دوره‌های پیشرفته برای نتایج عملی
                        </p>

                        {/* Course Pills */}
                        <div className="space-y-2 mb-6">
                          <div className="flex items-center gap-2 p-3 rounded-xl bg-surface/30 dark:bg-surface/50 border border-border shadow-sm backdrop-blur-sm">
                            <div className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></div>
                            <span className="text-xs text-text-strong font-semibold">تکنولوژی‌های پیشرفته</span>
                          </div>
                          <div className="flex items-center gap-2 p-3 rounded-xl bg-surface/30 dark:bg-surface/50 border border-border shadow-sm backdrop-blur-sm">
                            <div className="w-2 h-2 rounded-full bg-violet-600 animate-pulse"></div>
                            <span className="text-xs text-text-strong font-semibold">سطح تخصصی</span>
                          </div>
                        </div>

                        {/* CTA */}
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <span className="text-sm font-bold text-text-strong">مشاهده مسیر کامل</span>
                          <div className="w-8 h-8 rounded-full bg-purple-500/30 border-2 border-purple-400/50 flex items-center justify-center transition-all duration-300 group-hover:bg-purple-600 group-hover:scale-110 group-hover:border-purple-500">
                            <ArrowLeft className="w-4 h-4 text-purple-700 group-hover:text-white rotate-180" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Specialized Path */}
                <div className="flex-[0_0_100%] md:flex-[0_0_calc(33.333%-1.5rem)] min-w-0">
                  <Link to="/learning-path/specialized" className="group block h-full">
                    <div className="relative h-full bg-card/90 dark:bg-card/60 backdrop-blur-xl rounded-3xl shadow-neu-out hover:shadow-neu-hover transition-all duration-500 p-8 border-2 border-border overflow-hidden hover:-translate-y-2">
                      {/* Decorative circles */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/30 to-amber-500/30 rounded-full blur-3xl"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-yellow-400/30 to-orange-500/30 rounded-full blur-2xl"></div>
                      
                      <div className="relative z-10" dir="rtl">
                        {/* Icon & Badge */}
                        <div className="flex items-start justify-between mb-6">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400/40 to-amber-500/40 shadow-neu-in flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                            <Zap className="w-8 h-8 text-orange-500" />
                          </div>
                          <div className="px-4 py-1.5 rounded-full bg-orange-500/30 border-2 border-orange-400/50 shadow-sm">
                            <span className="text-xs font-bold text-text-strong">۲ دوره</span>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl font-bold text-text-strong mb-3 transition-all duration-300 group-hover:text-orange-700">
                          کاربردهای خاص—برای نیازهای مشخص
                        </h3>
                        
                        {/* Subtitle */}
                        <p className="text-sm text-text mb-6 leading-relaxed font-medium">
                          دوره‌های تخصصی برای نیازهای خاص
                        </p>

                        {/* Course Pills */}
                        <div className="space-y-2 mb-6">
                          <div className="flex items-center gap-2 p-3 rounded-xl bg-surface/30 dark:bg-surface/50 border border-border shadow-sm backdrop-blur-sm">
                            <div className="w-2 h-2 rounded-full bg-orange-600 animate-pulse"></div>
                            <span className="text-xs text-text-strong font-semibold">سیستم‌های تخصصی</span>
                          </div>
                          <div className="flex items-center gap-2 p-3 rounded-xl bg-surface/30 dark:bg-surface/50 border border-border shadow-sm backdrop-blur-sm">
                            <div className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></div>
                            <span className="text-xs text-text-strong font-semibold">سازگار با نیازهای خاص</span>
                          </div>
                        </div>

                        {/* CTA */}
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <span className="text-sm font-bold text-text-strong">مشاهده مسیر کامل</span>
                          <div className="w-8 h-8 rounded-full bg-orange-500/30 border-2 border-orange-400/50 flex items-center justify-center transition-all duration-300 group-hover:bg-orange-600 group-hover:scale-110 group-hover:border-orange-500">
                            <ArrowLeft className="w-4 h-4 text-orange-700 group-hover:text-white rotate-180" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center justify-between mt-8 px-4">
              <button
                onClick={() => emblaApi3?.scrollPrev()}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-md border-2 border-primary/30 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-primary/30 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="اسلاید قبلی"
              >
                <ChevronRight className="w-6 h-6 text-primary" />
              </button>
              
              <Link 
                to="/courses"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-primary to-primary-light text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                مشاهده همه
              </Link>

              <button
                onClick={() => emblaApi3?.scrollNext()}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-md border-2 border-primary/30 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-primary/30 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="اسلاید بعدی"
              >
                <ChevronLeft className="w-6 h-6 text-primary" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Now Section */}
      <section className="py-12 md:py-24 px-4 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-surface to-surface-2"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-br from-rose-400/15 to-pink-500/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-br from-blue-400/15 to-cyan-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-emerald-400/15 to-green-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="bg-background/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-border p-6 md:p-16 space-y-6 md:space-y-12 relative overflow-hidden" dir="rtl">
            {/* Decorative elements */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-primary-light/20 to-primary/20 rounded-full blur-3xl"></div>
            
            <div className="text-center space-y-2 md:space-y-4 relative z-10">
              <div className="hidden md:inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-md border-2 border-primary/30 rounded-full px-8 py-3 shadow-lg">
                <Zap className="w-6 h-6 text-primary animate-pulse" />
                <span className="text-lg font-bold text-primary">فرصت محدود</span>
              </div>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-l from-primary via-accent to-primary bg-clip-text text-transparent whitespace-nowrap">
                چرا همین الان؟
              </h2>
              <p className="text-lg text-text-muted max-w-2xl mx-auto">
                بهترین زمان برای شروع، همین الان است
              </p>
            </div>
            
            {/* Mobile: Three circles side by side - Smaller */}
            <div className="flex md:hidden justify-center items-center gap-3 relative z-10">
              {/* Circle 1 */}
              <div className="group flex flex-col items-center gap-2">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-400/30 to-pink-500/30 backdrop-blur-md shadow-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 border border-border/30">
                    <Target className="w-6 h-6 text-rose-500 drop-shadow-lg" />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-rose-500/20 blur-xl animate-pulse"></div>
                </div>
                <p className="text-[9px] text-text-strong leading-tight text-center max-w-[70px] font-bold">
                  مهارت‌های بدون AI ناکافی می‌شوند
                </p>
              </div>

              {/* Circle 2 */}
              <div className="group flex flex-col items-center gap-2">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400/30 to-cyan-500/30 backdrop-blur-md shadow-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 border border-border/30">
                    <Rocket className="w-6 h-6 text-blue-500 drop-shadow-lg" />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl animate-pulse"></div>
                </div>
                <p className="text-[9px] text-text-strong leading-tight text-center max-w-[70px] font-bold">
                  با یک پروژهٔ کوچک شروع کن
                </p>
              </div>

              {/* Circle 3 */}
              <div className="group flex flex-col items-center gap-2">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400/30 to-green-500/30 backdrop-blur-md shadow-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 border border-border/30">
                    <TrendingUp className="w-6 h-6 text-emerald-500 drop-shadow-lg" />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse"></div>
                </div>
                <p className="text-[9px] text-text-strong leading-tight text-center max-w-[70px] font-bold">
                  امروز یک قدم فردا یک نتیجه
                </p>
              </div>
            </div>

            {/* Desktop: Grid cards */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 relative z-10">
              {/* Card 1 */}
              <div className="group flex flex-col justify-center text-center space-y-4 p-6 md:p-8 rounded-2xl bg-background/40 backdrop-blur-sm shadow-neu-out hover:shadow-neu-hover transition-all duration-300 border border-border hover:border-rose-500/50 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-400/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-rose-400/30 to-pink-500/30 backdrop-blur-md shadow-neu-in flex items-center justify-center mx-auto transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 border border-border/30">
                    <Target className="w-8 h-8 md:w-10 md:h-10 text-rose-500 drop-shadow-lg" />
                  </div>
                  <div className="absolute inset-0 w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full bg-rose-500/20 blur-xl animate-pulse"></div>
                </div>
                <p className="text-base md:text-base text-text-strong leading-relaxed transition-colors duration-300 group-hover:text-rose-500 font-semibold">
                  مهارت‌های بدون AI به‌زودی ناکافی می‌شوند.
                </p>
              </div>

              {/* Card 2 */}
              <div className="group text-center space-y-3 p-4 md:p-8 rounded-2xl bg-background/40 backdrop-blur-sm shadow-neu-out hover:shadow-neu-hover transition-all duration-300 border border-border hover:border-blue-500/50 hover:-translate-y-2 relative overflow-hidden flex flex-col justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-blue-400/30 to-cyan-500/30 backdrop-blur-md shadow-neu-in flex items-center justify-center mx-auto transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 border border-border/30">
                    <Rocket className="w-6 h-6 md:w-10 md:h-10 text-blue-500 drop-shadow-lg" />
                  </div>
                  <div className="absolute inset-0 w-12 h-12 md:w-20 md:h-20 mx-auto rounded-full bg-blue-500/20 blur-xl animate-pulse"></div>
                </div>
                <p className="text-sm md:text-base text-text-strong leading-relaxed transition-colors duration-300 group-hover:text-blue-500 font-semibold">
                  با یک پروژهٔ کوچک شروع کن
                </p>
              </div>

              {/* Card 3 */}
              <div className="group text-center space-y-3 p-4 md:p-8 rounded-2xl bg-background/40 backdrop-blur-sm shadow-neu-out hover:shadow-neu-hover transition-all duration-300 border border-border hover:border-emerald-500/50 hover:-translate-y-2 relative overflow-hidden flex flex-col justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-emerald-400/30 to-green-500/30 backdrop-blur-md shadow-neu-in flex items-center justify-center mx-auto transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 border border-border/30">
                    <TrendingUp className="w-6 h-6 md:w-10 md:h-10 text-emerald-500 drop-shadow-lg" />
                  </div>
                  <div className="absolute inset-0 w-12 h-12 md:w-20 md:h-20 mx-auto rounded-full bg-emerald-500/20 blur-xl animate-pulse"></div>
                </div>
                <p className="text-sm md:text-base text-text-strong leading-relaxed transition-colors duration-300 group-hover:text-emerald-500 font-semibold">
                  امروز یک قدم فردا یک نتیجه
                </p>
              </div>
            </div>
            
            <div className="flex justify-center pt-4 md:pt-8 relative z-10">
              <Link to="/path-builder" className="group">
                <Button 
                  size="lg"
                  className="px-12 py-7 rounded-full text-lg font-bold shadow-neu-out hover:shadow-neu-hover transition-all duration-300 bg-gradient-to-r from-primary to-primary-light text-white hover:scale-105 relative overflow-hidden border-2 border-white/30"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <Sparkles className="ml-2 w-6 h-6 animate-pulse" />
                  <span className="relative">شروع مسیر من</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Results & Statistics Section */}
      <section className="py-20 px-4 bg-surface-2">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12" dir="rtl">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Star className="w-8 h-8 text-primary fill-primary" />
              <h2 className="text-3xl md:text-4xl font-bold text-text-strong whitespace-nowrap md:whitespace-normal">
                نتایج بچه‌های آکادمی
              </h2>
            </div>
            <p className="text-lg text-text-muted">
              چند تا عدد واقعی از مسیر یادگیری ما—تو هم می‌تونی به این جمع اضافه شی.
            </p>
          </div>
          
          {/* Main Stats Grid - Mobile: single box with stats side by side, Desktop: 4 horizontal cards */}
          <div className="md:grid md:grid-cols-4 gap-6 mb-6">
            {/* Mobile: Single container with grid inside */}
            <div className="md:hidden bg-gradient-to-br from-white/90 to-white/60 dark:from-surface/90 dark:to-surface-2/60 backdrop-blur-xl rounded-3xl shadow-neu-out p-6 border border-border">
              <div className="grid grid-cols-2 gap-4">
                {/* Satisfaction */}
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 shadow-neu-in flex items-center justify-center mx-auto">
                    <Smile className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-amber-700">۹۶٪</p>
                    <p className="text-xs text-text-muted">رضایت</p>
                  </div>
                </div>

                {/* Average Rating */}
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-400/20 to-purple-500/20 shadow-neu-in flex items-center justify-center mx-auto">
                    <Star className="w-6 h-6 text-violet-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-violet-700">۴.۸</p>
                    <p className="text-xs text-text-muted">امتیاز</p>
                  </div>
                </div>

                {/* Students */}
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-green-500/20 shadow-neu-in flex items-center justify-center mx-auto">
                    <Users className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-emerald-700">+۱,۲۸۰</p>
                    <p className="text-xs text-text-muted">دانشجویان</p>
                  </div>
                </div>

                {/* Active Courses */}
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 shadow-neu-in flex items-center justify-center mx-auto">
                    <BookOpen className="w-6 h-6 text-cyan-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-cyan-700">۷</p>
                    <p className="text-xs text-text-muted">دوره فعال</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop: Individual cards (hidden on mobile) */}
            {/* Satisfaction */}
            <div className="hidden md:block group relative bg-gradient-to-br from-amber-50/80 to-orange-50/80 dark:from-surface/80 dark:to-surface-2/80 backdrop-blur-xl rounded-3xl shadow-neu-out hover:shadow-neu-hover transition-all duration-300 p-8 border border-amber-100/50 dark:border-border hover:-translate-y-2">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 shadow-neu-in flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                  <Smile className="w-7 h-7 text-amber-500" />
                </div>
                <div className="flex-1 text-right">
                  <h3 className="text-sm font-semibold text-amber-600 mb-1">رضایت</h3>
                  <p className="text-4xl font-bold text-amber-700">۹۶٪</p>
                </div>
              </div>
              <p className="text-xs text-text-muted text-right">رضایت از مسیرها</p>
              <div className="mt-3 h-1.5 bg-amber-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" style={{ width: '96%' }}></div>
              </div>
            </div>

            {/* Average Rating */}
            <div className="hidden md:block group relative bg-gradient-to-br from-violet-50/80 to-purple-50/80 dark:from-surface/80 dark:to-surface-2/80 backdrop-blur-xl rounded-3xl shadow-neu-out hover:shadow-neu-hover transition-all duration-300 p-8 border border-violet-100/50 dark:border-border hover:-translate-y-2">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-400/20 to-purple-500/20 shadow-neu-in flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                  <Star className="w-7 h-7 text-violet-500" />
                </div>
                <div className="flex-1 text-right">
                  <h3 className="text-sm font-semibold text-violet-600 mb-1">امتیاز متوسط</h3>
                  <p className="text-4xl font-bold text-violet-700">۴.۸</p>
                </div>
              </div>
              <p className="text-xs text-text-muted text-right">میانگین امتیاز دانشجویان</p>
              <div className="flex gap-1 mt-3 justify-end">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < 4 ? 'text-violet-500 fill-violet-500' : 'text-violet-300'}`} />
                ))}
              </div>
            </div>

            {/* Students */}
            <div className="hidden md:block group relative bg-gradient-to-br from-emerald-50/80 to-green-50/80 dark:from-surface/80 dark:to-surface-2/80 backdrop-blur-xl rounded-3xl shadow-neu-out hover:shadow-neu-hover transition-all duration-300 p-8 border border-emerald-100/50 dark:border-border hover:-translate-y-2">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-green-500/20 shadow-neu-in flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                  <Users className="w-7 h-7 text-emerald-500" />
                </div>
                <div className="flex-1 text-right">
                  <h3 className="text-sm font-semibold text-emerald-600 mb-1">دانشجویان</h3>
                  <p className="text-4xl font-bold text-emerald-700">+۱,۲۸۰</p>
                </div>
              </div>
              <p className="text-xs text-text-muted text-right">دانشجوی فعال</p>
              <div className="mt-3 h-1.5 bg-emerald-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-pulse" style={{ width: '100%' }}></div>
              </div>
            </div>

            {/* Active Courses */}
            <div className="hidden md:block group relative bg-gradient-to-br from-cyan-50/80 to-blue-50/80 dark:from-surface/80 dark:to-surface-2/80 backdrop-blur-xl rounded-3xl shadow-neu-out hover:shadow-neu-hover transition-all duration-300 p-8 border border-cyan-100/50 dark:border-border hover:-translate-y-2">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 shadow-neu-in flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                  <BookOpen className="w-7 h-7 text-cyan-500" />
                </div>
                <div className="flex-1 text-right">
                  <h3 className="text-sm font-semibold text-cyan-600 mb-1">دوره‌های فعال</h3>
                  <p className="text-4xl font-bold text-cyan-700">۷</p>
                </div>
              </div>
              <p className="text-xs text-text-muted text-right">دوره و کالکشن فعال</p>
              <div className="mt-3 h-1.5 bg-cyan-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
          </div>

          {/* Secondary Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Completion Rate */}
            <div className="group relative bg-surface rounded-2xl shadow-neu-out hover:shadow-neu-hover transition-all duration-300 p-6 border border-border hover:-translate-y-1" dir="rtl">
              <div className="flex items-center justify-between">
                <div className="text-right flex-1">
                  <h4 className="text-sm font-semibold text-text-muted mb-2">نرخ تکمیل دوره‌ها</h4>
                  <p className="text-xs text-text-muted mb-1">میانگین پیشرفت دانشجویان</p>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <p className="text-3xl font-bold text-primary">۸۲٪</p>
                </div>
              </div>
            </div>

            {/* Certificates */}
            <div className="group relative bg-surface rounded-2xl shadow-neu-out hover:shadow-neu-hover transition-all duration-300 p-6 border border-border hover:-translate-y-1" dir="rtl">
              <div className="flex items-center justify-between">
                <div className="text-right flex-1">
                  <h4 className="text-sm font-semibold text-text-muted mb-2">گواهینامه‌های صادر شده</h4>
                  <p className="text-xs text-text-muted mb-1">تعداد مدارک معتبر</p>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  <p className="text-3xl font-bold text-primary">۶۲۰</p>
                </div>
              </div>
            </div>

            {/* Community Engagement */}
            <div className="group relative bg-surface rounded-2xl shadow-neu-out hover:shadow-neu-hover transition-all duration-300 p-6 border border-border hover:-translate-y-1" dir="rtl">
              <div className="flex items-center justify-between">
                <div className="text-right flex-1">
                  <h4 className="text-sm font-semibold text-text-muted mb-2">تعامل جامعه</h4>
                  <p className="text-xs text-text-muted mb-1">گفتگو در انجمن و دیسکورد</p>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  <p className="text-3xl font-bold text-primary">+۱۵,۴۰۰</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Tags */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-text-muted" dir="rtl">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
              <span>۷ دوره فعال + ۱ کالکشن</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <span>دسترسی جهانی ۲۴/۷</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-violet-400"></div>
              <span>پلتفرم برتر یادگیری AI</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
