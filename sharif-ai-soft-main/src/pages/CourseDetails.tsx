import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  Clock, 
  TrendingUp, 
  CheckCircle2,
  Users,
  Award,
  Shield,
  Zap,
  Code2,
  Cpu,
  BarChart3,
  BookOpen,
  MessageSquare,
  ArrowLeft,
  Target,
  Rocket,
  Trophy,
  Calendar,
  Play,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import v0Image from "@/assets/v0.jpg";
import codexImage from "@/assets/codex.jpg";
import cursorImage from "@/assets/cursor.jpg";
import n8nImage from "@/assets/n8n.jpg";

const coursesData: Record<string, any> = {
  "v0-frontend": {
    id: "v0-frontend",
    title: "دوره آموزش فرانت‌اند با هوش مصنوعی V0",
    subtitle: "ساخت رابط‌های کاربری با V0 و Next.js",
    description: "به‌کمک هوش مصنوعی می‌توانید سریع‌تر کد بزنید و رابط‌های کاربری حرفه‌ای بسازید. این دوره با قیمت مقرون‌به‌صرفه و خرید آسان، شما را در مسیر یادگیری برنامه‌نویسی فرانت‌اند با AI همراهی می‌کند.",
    image: v0Image,
    duration: "۱۴ ساعت",
    level: "متوسط",
    price: "۶,۰۰۰,۰۰۰",
    weeks: "هفته ۱ تا ۲",
    phase: "مرحله ۱",
    students: "۳۲۰+",
    rating: "۴.۹",
    projects: 3,
    mentorSessions: "۴ جلسه",
    highlights: [
      "یادگیری ذهنیت AI-first در فرانت‌اند",
      "استفاده از V0 برای تولید سریع رابط کاربری",
      "ساخت سیستم طراحی قابل استفاده مجدد",
      "تحویل پروژه واقعی روی Vercel"
    ],
    skills: [
      "تحویل یک لندینگ فروش یا داشبورد در ۴۸ ساعت",
      "ساخت کتابخانهٔ کامپوننت شخصی",
      "تسلط بر پرامپت‌نویسی UI",
      "نوشتن تست‌های خودکار"
    ],
    syllabus: [
      {
        week: "هفته ۱",
        title: "شروع با طراحی وب و هوش مصنوعی",
        topics: [
          "طراحی فرانت‌اند یعنی چی؟ (UI، UX و تفاوت با بک‌اند)",
          "نقش هوش مصنوعی در طراحی وب (V0، Figma AI، Copilot)",
          "آشنایی با ساختار صفحات وب (HTML + CSS + JS به زبان ساده)",
          "آشنایی با محیط V0 و مفهوم پرامپت‌نویسی"
        ]
      },
      {
        week: "هفته ۲",
        title: "طراحی ساختار صفحه با پرامپت",
        topics: [
          "تولید Layout و ساختار HTML با پرامپت",
          "کار با تگ‌های مهم (div، section، header، footer، form و ...)",
          "طراحی اسکلت صفحات چندبخشی",
          "اصول هماهنگی در ساختار صفحه"
        ]
      },
      {
        week: "هفته ۳",
        title: "استایل‌دهی و طراحی واکنش‌گرا با Tailwind",
        topics: [
          "تنظیم رنگ، فاصله، اندازه و فونت با پرامپت",
          "طراحی واکنش‌گرا برای موبایل و دسکتاپ",
          "نکات طراحی مدرن و مینیمال",
          "استفاده از پرامپت اصلاحی برای ویرایش ظاهر"
        ]
      },
      {
        week: "هفته ۴",
        title: "طراحی صفحات کامل و تجربه کاربری (UX)",
        topics: [
          "ترکیب چند پرامپت برای ساخت صفحه کامل",
          "ساخت صفحات: Landing Page، Dashboard، Profile",
          "طراحی تعاملات (Hover، Animation، Modal)",
          "اصول UX در پرامپت‌نویسی"
        ]
      },
      {
        week: "هفته ۵",
        title: "پروژه نهایی – طراحی سایت کامل با V0",
        topics: [
          "ساخت سایت کامل با صفحات Home، About، Products، Contact",
          "بهینه‌سازی خروجی و آماده‌سازی برای ارائه",
          "چک‌لیست نهایی: ساختار تمیز، واکنش‌گرا، تجربه کاربری مناسب",
          "ترکیب پرامپت‌ها برای پروژه نهایی"
        ]
      }
    ],
    gradient: "from-blue-500 via-cyan-500 to-teal-500"
  },
  "codex-backend": {
    id: "codex-backend",
    title: "دوره آموزش بک‌اند با هوش مصنوعی Codex",
    subtitle: "بک‌اند مقیاس‌پذیر با Codex",
    description: "پس از تسلط بر فرانت‌اند، به سراغ سرور بروید تا سرویس‌های پایدار و امن بسازید. Codex در تولید API و استقرار سریع به شما کمک می‌کند.",
    image: codexImage,
    duration: "۲۰ ساعت",
    level: "پیشرفته",
    price: "۸,۰۰۰,۰۰۰",
    weeks: "هفته ۳ تا ۴",
    phase: "مرحله ۲",
    students: "۲۵۰+",
    rating: "۴.۸",
    projects: 4,
    mentorSessions: "۶ جلسه",
    highlights: [
      "طراحی معماری سرویس و اتصال زیرساخت Docker",
      "تولید خودکار APIهای پروژه با Codex",
      "راه‌اندازی مانیتورینگ و لاگ‌گیری",
      "اسکریپت‌های استقرار هوشمند"
    ],
    skills: [
      "ساخت یک سرویس بک‌اند آماده اتصال به فرانت‌اند",
      "ایجاد مستندات و تست خودکار",
      "توانایی پشتیبانی از کاربران واقعی",
      "مدیریت پایگاه داده و احراز هویت"
    ],
    syllabus: [
      {
        week: "هفته ۱",
        title: "شروع با طراحی وب و هوش مصنوعی",
        topics: [
          "طراحی فرانت‌اند یعنی چی؟ (UI، UX و تفاوت با بک‌اند)",
          "نقش هوش مصنوعی در طراحی وب (V0، Figma AI، Copilot)",
          "آشنایی با ساختار صفحات وب (HTML + CSS + JS به زبان ساده)",
          "آشنایی با محیط V0 و مفهوم پرامپت‌نویسی"
        ]
      },
      {
        week: "هفته ۲",
        title: "طراحی ساختار صفحه با پرامپت",
        topics: [
          "تولید Layout و ساختار HTML با پرامپت",
          "کار با تگ‌های مهم (div، section، header، footer، form و ...)",
          "طراحی اسکلت صفحات چندبخشی",
          "اصول هماهنگی در ساختار صفحه"
        ]
      },
      {
        week: "هفته ۳",
        title: "استایل‌دهی و طراحی واکنش‌گرا با Tailwind",
        topics: [
          "تنظیم رنگ، فاصله، اندازه و فونت با پرامپت",
          "طراحی واکنش‌گرا برای موبایل و دسکتاپ",
          "نکات طراحی مدرن و مینیمال",
          "استفاده از پرامپت اصلاحی برای ویرایش ظاهر"
        ]
      },
      {
        week: "هفته ۴",
        title: "طراحی صفحات کامل و تجربه کاربری (UX)",
        topics: [
          "ترکیب چند پرامپت برای ساخت صفحه کامل",
          "ساخت صفحات: Landing Page، Dashboard، Profile",
          "طراحی تعاملات (Hover، Animation، Modal)",
          "اصول UX در پرامپت‌نویسی"
        ]
      },
      {
        week: "هفته ۵",
        title: "پروژه نهایی – طراحی سایت کامل با V0",
        topics: [
          "ساخت سایت کامل با صفحات Home، About، Products، Contact",
          "بهینه‌سازی خروجی و آماده‌سازی برای ارائه",
          "چک‌لیست نهایی: ساختار تمیز، واکنش‌گرا، تجربه کاربری مناسب",
          "ترکیب پرامپت‌ها برای پروژه نهایی"
        ]
      }
    ],
    gradient: "from-purple-500 via-pink-500 to-rose-500"
  },
  "cursor-fullstack": {
    id: "cursor-fullstack",
    title: "دوره آموزش کدنویسی با هوش مصنوعی Cursor",
    subtitle: "همکاری تیمی و عامل‌های Cursor",
    description: "در این دوره فرآیندها و بک‌اند را با هم متصل کرده و با عامل‌های Cursor تیم توسعهٔ خودکار می‌سازید. تمرکز روی دیباگ، تست و تحویل سریع است.",
    image: cursorImage,
    duration: "۱۲ ساعت",
    level: "متوسط",
    price: "۵,۱۰۰,۰۰۰",
    weeks: "هفته ۵ تا ۶",
    phase: "مرحله ۳",
    students: "۴۵۰+",
    rating: "۵.۰",
    projects: 3,
    mentorSessions: "۵ جلسه",
    highlights: [
      "راه‌اندازی عامل‌های Cursor برای تولید کد",
      "اجرای تست‌های End-to-End",
      "ادغام با CI/CD برای تحویل پایدار",
      "مدیریت تسک‌ها و همکاری تیمی"
    ],
    skills: [
      "تحویل یک اپلیکیشن فول‌استک در کمتر از یک هفته",
      "تسلط بر دیپلوی خودکار",
      "مدیریت Pull Requestها",
      "الگوهای آماده برای مستندسازی"
    ],
    syllabus: [
      {
        week: "هفته ۱",
        title: "آشنایی با Cursor و برنامه‌نویسی هوشمند",
        topics: [
          "Cursor چیست و چه تفاوتی با VS Code دارد؟",
          "هوش مصنوعی در برنامه‌نویسی (Codex، Copilot، GPT-4 و Cursor AI)",
          "ساخت پروژه جدید و شناخت محیط کار Cursor",
          "پرامپت‌نویسی برای تولید و ویرایش کد",
          "اصول دیباگ و تکمیل خودکار هوشمند"
        ]
      },
      {
        week: "هفته ۲",
        title: "شروع کدنویسی با Cursor – مبانی و منطق برنامه‌نویسی",
        topics: [
          "آشنایی با متغیرها، داده‌ها و توابع",
          "شرط‌ها و حلقه‌ها با کمک پرامپت",
          "تولید کد خودکار برای حل مسائل الگوریتمی",
          "توضیح و بهینه‌سازی کد با کمک Cursor",
          "تمرین: ساخت برنامه‌های ساده (ماشین حساب، To-Do List CLI)"
        ]
      },
      {
        week: "هفته ۳",
        title: "توسعه وب با Cursor – فرانت‌اند و بک‌اند ساده",
        topics: [
          "ساخت پروژه وب ساده با HTML، CSS، JS",
          "استفاده از پرامپت برای تولید اجزای فرانت‌اند",
          "راه‌اندازی سرور ساده با Node.js یا Python (Flask)",
          "اتصال فرانت‌اند و بک‌اند با Cursor",
          "اصول طراحی ساختار فایل و پروژه"
        ]
      },
      {
        week: "هفته ۴",
        title: "کار با API و پایگاه داده با کمک Cursor",
        topics: [
          "ساخت و مصرف APIها (RESTful و JSON)",
          "اتصال به پایگاه داده (MongoDB یا SQLite)",
          "تولید Queryها و مدل داده با پرامپت",
          "افزودن احراز هویت (JWT یا Session)",
          "تمرین: ساخت سرویس کوچک CRUD"
        ]
      },
      {
        week: "هفته ۵",
        title: "پروژه نهایی – ساخت اپلیکیشن کامل با Cursor",
        topics: [
          "انتخاب موضوع پروژه (مثلاً Blog، Task Manager یا Shop)",
          "تولید خودکار ساختار کامل پروژه با پرامپت ترکیبی",
          "طراحی UI ساده و اتصال به بک‌اند",
          "تست، بهینه‌سازی و دیپلوی با کمک Cursor",
          "چک‌لیست نهایی: ساختار تمیز، عملکرد درست، کد بهینه"
        ]
      }
    ],
    gradient: "from-emerald-500 via-teal-500 to-cyan-500"
  },
  "n8n-automation": {
    id: "n8n-automation",
    title: "دوره اتوماسیون با N8N و AgentKit",
    subtitle: "ساخت سیستم‌های هوشمند خودکار",
    description: "با N8N و AgentKit، فرآیندهای کاری را اتوماتیک کنید و زمان خود را آزاد کنید. این دوره شما را قادر می‌سازد تا سیستم‌های هوشمند و خودکار بسازید.",
    image: n8nImage,
    duration: "۱۰ ساعت",
    level: "مبتدی تا متوسط",
    price: "۴,۵۰۰,۰۰۰",
    weeks: "هفته ۷ تا ۸",
    phase: "تخصصی",
    students: "۳۸۰+",
    rating: "۴.۷",
    projects: 5,
    mentorSessions: "۴ جلسه",
    highlights: [
      "ساخت workflow های هوشمند با N8N",
      "اتصال سرویس‌های مختلف به یکدیگر",
      "پیاده‌سازی عامل‌های AI با AgentKit",
      "اتوماسیون کامل فرآیندهای کاری"
    ],
    skills: [
      "ساخت ۱۰+ اتوماسیون کاربردی",
      "اتصال API های مختلف",
      "مانیتورینگ و خطایابی اتوماسیون‌ها",
      "بهینه‌سازی فرآیندها"
    ],
    syllabus: [
      {
        week: "هفته ۷",
        title: "مبانی N8N و اتوماسیون",
        topics: [
          "آشنایی با N8N و مفاهیم پایه",
          "ساخت اولین workflow",
          "اتصال سرویس‌های محبوب",
          "دیباگ و تست اتوماسیون‌ها"
        ]
      },
      {
        week: "هفته ۸",
        title: "عامل‌های هوشمند و پروژه",
        topics: [
          "آشنایی با AgentKit",
          "ساخت عامل‌های AI",
          "ادغام N8N با AgentKit",
          "پروژه نهایی: سیستم پاسخگویی هوشمند"
        ]
      }
    ],
    gradient: "from-orange-500 via-amber-500 to-yellow-500"
  }
};

// Interactive Roadmap Component
function RoadmapInteractive({ course }: { course: any }) {
  const [selectedStep, setSelectedStep] = useState(0);
  const totalSteps = course.syllabus.length;

  const goToPrev = () => {
    setSelectedStep((prev) => (prev > 0 ? prev - 1 : totalSteps - 1));
  };

  const goToNext = () => {
    setSelectedStep((prev) => (prev < totalSteps - 1 ? prev + 1 : 0));
  };

  const currentWeek = course.syllabus[selectedStep];
  const progress = ((selectedStep + 1) / totalSteps) * 100;

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Progress Bar */}
      <div className="mb-6" dir="rtl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-text">پیشرفت مسیر {course.phase}</span>
          <span className="text-sm font-bold text-primary">٪{Math.round(progress)}</span>
        </div>
        <div className="h-2 bg-surface rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${course.gradient} transition-all duration-500 rounded-full`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Steps Horizontal Scroll - Mobile */}
      <div className="lg:hidden">
        <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide" dir="rtl">
          {course.syllabus.map((week: any, idx: number) => (
            <button
              key={idx}
              onClick={() => setSelectedStep(idx)}
              className={`flex-shrink-0 w-32 snap-start p-4 rounded-2xl border-2 transition-all duration-300 ${
                selectedStep === idx
                  ? `bg-gradient-to-br ${course.gradient} border-transparent text-white shadow-xl scale-105`
                  : 'bg-surface border-border hover:border-primary/40'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg mb-2 mx-auto ${
                selectedStep === idx 
                  ? 'bg-white/20 text-white' 
                  : `bg-gradient-to-br ${course.gradient} text-white`
              }`}>
                {idx + 1}
              </div>
              <p className={`text-xs font-bold text-center line-clamp-2 ${selectedStep === idx ? 'text-white' : 'text-text-strong'}`}>
                {week.title}
              </p>
            </button>
          ))}
        </div>

        {/* Navigation Arrows - Mobile */}
        <div className="flex gap-3 mt-4">
          <Button
            onClick={goToPrev}
            variant="outline"
            size="sm"
            className="flex-1 rounded-xl border-2 hover:scale-105 transition-all"
          >
            <ChevronUp className="ml-1 w-4 h-4" />
            قبلی
          </Button>
          <Button
            onClick={goToNext}
            variant="outline"
            size="sm"
            className="flex-1 rounded-xl border-2 hover:scale-105 transition-all"
          >
            بعدی
            <ChevronDown className="mr-1 w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Steps Vertical - Desktop */}
      <div className="hidden lg:block">
        <h3 className="text-xl font-bold text-text-strong mb-4 text-right" dir="rtl">
          مراحل مسیر
        </h3>
        <div className="space-y-3">
          {course.syllabus.map((week: any, idx: number) => (
            <button
              key={idx}
              onClick={() => setSelectedStep(idx)}
              className={`w-full text-right p-5 rounded-2xl border-2 transition-all duration-300 ${
                selectedStep === idx
                  ? `bg-gradient-to-br ${course.gradient} border-transparent text-white shadow-xl scale-105`
                  : 'bg-surface border-border hover:border-primary/40 hover:shadow-neu-hover'
              }`}
              dir="rtl"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className={`text-lg font-bold ${selectedStep === idx ? 'text-white' : 'text-text-strong'}`}>
                  {week.title}
                </h4>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                  selectedStep === idx 
                    ? 'bg-white/20 text-white' 
                    : `bg-gradient-to-br ${course.gradient} text-white`
                }`}>
                  {idx + 1}
                </div>
              </div>
              <p className={`text-sm ${selectedStep === idx ? 'text-white/90' : 'text-text-muted'}`}>
                {week.week}
              </p>
            </button>
          ))}
        </div>

        {/* Navigation Buttons - Desktop */}
        <div className="flex gap-3 mt-6">
          <Button
            onClick={goToPrev}
            variant="outline"
            className="flex-1 rounded-xl border-2 hover:scale-105 transition-all"
          >
            <ChevronUp className="ml-2 w-4 h-4" />
            مرحله قبل
          </Button>
          <Button
            onClick={goToNext}
            variant="outline"
            className="flex-1 rounded-xl border-2 hover:scale-105 transition-all"
          >
            مرحله بعد
            <ChevronDown className="mr-2 w-4 h-4" />
          </Button>
        </div>
      </div>


      {/* Main Content - Selected Step Details */}
      <div className="w-full">
        <div className="relative">
          {/* Main Card */}
          <div className="relative p-6 md:p-8 rounded-3xl bg-gradient-to-br from-surface/80 via-surface to-surface-2/80 backdrop-blur-sm border-2 border-border shadow-2xl overflow-hidden">
            {/* Decorative Elements */}
            <div className={`absolute bottom-0 left-0 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-tr ${course.gradient} rounded-tr-[100px] opacity-10`}></div>
            
            <div className="relative text-right" dir="rtl">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${course.gradient} flex items-center justify-center shadow-lg`}>
                      <span className="text-xl md:text-2xl font-black text-white">{selectedStep + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-text-strong">{currentWeek.title}</h3>
                      <p className="text-sm md:text-base lg:text-lg text-text-muted mt-1">{currentWeek.week}</p>
                    </div>
                  </div>
                </div>
                
                <div className={`px-3 py-2 md:px-4 md:py-2 rounded-xl bg-gradient-to-r ${course.gradient} text-white font-bold text-xs md:text-sm shadow-lg self-start`}>
                  مرحله {selectedStep + 1} از {totalSteps}
                </div>
              </div>

              {/* Topics */}
              <div className="space-y-3">
                {currentWeek.topics.map((topic: string, topicIdx: number) => (
                  <div 
                    key={topicIdx} 
                    className="flex items-start gap-3 p-3 md:p-4 rounded-xl bg-surface/60 border border-border hover:border-primary/40 hover:shadow-neu-hover transition-all duration-300"
                  >
                    <div className={`w-5 h-5 md:w-6 md:h-6 rounded-lg bg-gradient-to-br ${course.gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-white" />
                    </div>
                    <p className="text-sm md:text-base text-text leading-relaxed font-medium">{topic}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CourseDetails() {
  const { courseId } = useParams();
  const course = courseId ? coursesData[courseId] : null;

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold text-text-strong mb-4">دوره یافت نشد</h1>
          <Link to="/">
            <Button>بازگشت به صفحه اصلی</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section with Banner */}
      <section className="relative pt-20 md:pt-32 pb-12 md:pb-20 px-4 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${course.gradient} opacity-10`}></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Image Section - First on Mobile */}
            <div className="relative order-1 lg:order-2 w-full">
              <div className={`absolute inset-0 bg-gradient-to-br ${course.gradient} rounded-3xl blur-3xl opacity-30`}></div>
              <img 
                src={course.image} 
                alt={course.title}
                className="relative rounded-3xl shadow-2xl border-4 border-white/10 w-full"
              />
            </div>

            {/* Text Section - Second on Mobile */}
            <div className="text-right order-2 lg:order-1 w-full" dir="rtl">
              <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${course.gradient} text-white font-bold text-sm mb-6 shadow-lg`}>
                {course.phase} • {course.weeks}
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-black text-text-strong mb-4 md:mb-6 leading-tight">
                {course.title}
              </h1>
              
              <p className={`text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 bg-gradient-to-l ${course.gradient} bg-clip-text text-transparent`}>
                {course.subtitle}
              </p>
              
              <p className="text-base md:text-lg text-text-muted leading-relaxed mb-6 md:mb-8">
                {course.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:flex md:flex-wrap gap-4 md:gap-6 mb-6 md:mb-8">
                <div className="flex items-center gap-2">
                  <Clock className={`w-5 h-5 bg-gradient-to-br ${course.gradient} bg-clip-text text-transparent`} />
                  <span className="text-sm md:text-base text-text font-semibold">{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className={`w-5 h-5 bg-gradient-to-br ${course.gradient} bg-clip-text text-transparent`} />
                  <span className="text-sm md:text-base text-text font-semibold">{course.level}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className={`w-5 h-5 bg-gradient-to-br ${course.gradient} bg-clip-text text-transparent`} />
                  <span className="text-sm md:text-base text-text font-semibold">{course.students} دانشجو</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className={`w-5 h-5 bg-gradient-to-br ${course.gradient} bg-clip-text text-transparent`} />
                  <span className="text-sm md:text-base text-text font-semibold">امتیاز {course.rating}</span>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6 p-4 md:p-6 rounded-2xl bg-gradient-to-br from-surface to-surface-2 border border-border shadow-neu-out">
                <div className="flex items-center justify-between" dir="rtl">
                  <span className="text-sm md:text-base text-text-muted font-semibold">هزینه دوره:</span>
                  <div className="text-left">
                    <span className={`text-2xl md:text-3xl font-black bg-gradient-to-l ${course.gradient} bg-clip-text text-transparent`}>
                      {course.price} تومان
                    </span>
                    <p className="text-xs md:text-sm text-text-muted mt-1">پرداخت آسان و امن</p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <Link to="/free-consultation" className="flex-1">
                  <Button 
                    size="lg"
                    className={`w-full rounded-2xl bg-gradient-to-r ${course.gradient} text-white font-bold text-base md:text-lg border-0 shadow-2xl hover:scale-105 transition-all duration-300`}
                  >
                    <Sparkles className="ml-2 w-5 h-5 md:w-6 md:h-6" />
                    رزرو مشاوره رایگان
                  </Button>
                </Link>
                <a href="https://t.me/sharifgpt_bot" target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button 
                    size="lg"
                    variant="outline"
                    className="w-full rounded-2xl border-2 font-bold text-base md:text-lg hover:scale-105 transition-all duration-300"
                  >
                    خرید این دوره
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Learning Highlights */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Highlights */}
            <div className="text-right" dir="rtl">
              <h2 className={`text-3xl md:text-4xl font-black mb-6 bg-gradient-to-l ${course.gradient} bg-clip-text text-transparent`}>
                تمرکز اصلی دوره
              </h2>
              <div className="space-y-4">
                {course.highlights.map((highlight: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-surface border border-border hover:border-primary/30 transition-colors duration-300">
                    <CheckCircle2 className={`w-6 h-6 flex-shrink-0 mt-0.5 bg-gradient-to-br ${course.gradient} bg-clip-text text-transparent`} />
                    <p className="text-text font-medium leading-relaxed">{highlight}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="text-right" dir="rtl">
              <h2 className={`text-3xl md:text-4xl font-black mb-6 bg-gradient-to-l ${course.gradient} bg-clip-text text-transparent`}>
                مهارت‌های کسب‌شده
              </h2>
              <div className="space-y-4">
                {course.skills.map((skill: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-surface border border-border hover:border-primary/30 transition-colors duration-300">
                    <Zap className={`w-6 h-6 flex-shrink-0 mt-0.5 bg-gradient-to-br ${course.gradient} bg-clip-text text-transparent`} />
                    <p className="text-text font-medium leading-relaxed">{skill}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Syllabus / Roadmap - Interactive Version */}
      <section className="py-20 px-4 bg-gradient-to-b from-surface-2 to-background relative overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(120,119,198,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(120,119,198,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <h2 className="text-4xl font-black text-text-strong text-center mb-3" dir="rtl">
            مراحل مسیر
          </h2>
          <p className="text-center text-text-muted mb-12 text-lg" dir="rtl">
            بین مراحل بالا و پایین حرکت کنید تا جزئیات هر مرحله را مشاهده کنید
          </p>

          <RoadmapInteractive course={course} />
        </div>
      </section>

      {/* Features & Benefits */}
      <section className="py-20 px-4 bg-surface-2">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-4xl font-black text-text-strong text-center mb-12" dir="rtl">
            چرا این دوره انتخاب هوشمندانه‌ای است؟
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Target,
                title: "مسیر مرحله‌به‌مرحله",
                description: "هر مرحله تمرین‌های مشخص و پروژه‌هایی با خروجی ملموس دارد",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: MessageSquare,
                title: "پشتیبانی ۲۴ ساعته",
                description: "منتورها از طریق دیسکورد و تماس تلفنی همراه شما هستند",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: Code2,
                title: "پروژه‌محور",
                description: "هر دوره با انجام یک پروژه واقعی به پایان می‌رسد",
                color: "from-emerald-500 to-teal-500"
              },
              {
                icon: Trophy,
                title: `${course.projects} پروژه واقعی`,
                description: "با بازخورد منتور و بازنگری دقیق",
                color: "from-orange-500 to-amber-500"
              },
              {
                icon: Users,
                title: "انجمن خصوصی",
                description: "دسترسی به انجمن اختصاصی و جلسات هفتگی",
                color: "from-rose-500 to-pink-500"
              },
              {
                icon: Award,
                title: "گواهی معتبر",
                description: "پس از پایان مسیر گواهی معتبر دریافت می‌کنید",
                color: "from-violet-500 to-purple-500"
              },
              {
                icon: Rocket,
                title: "جلسه تعیین مسیر رایگان",
                description: "یک جلسه ۳۰ دقیقه‌ای برای بررسی اهداف شما",
                color: "from-cyan-500 to-blue-500"
              },
              {
                icon: BookOpen,
                title: "لایه‌های تمرین افزایشی",
                description: "چک‌لیست‌ها، تمپلیت‌ها و پروژه‌های تمرینی",
                color: "from-lime-500 to-green-500"
              },
              {
                icon: Shield,
                title: "گارانتی ورود به پروژه",
                description: "پس از پایان در پروژه‌های تجاری شرکت کنید",
                color: "from-indigo-500 to-purple-500"
              }
            ].map((feature, idx) => (
              <div 
                key={idx}
                className="group relative p-6 rounded-2xl bg-surface border border-border hover:border-primary/50 shadow-neu-out hover:shadow-neu-hover transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-text-strong mb-2 text-right" dir="rtl">
                  {feature.title}
                </h3>
                <p className="text-text-muted text-right leading-relaxed" dir="rtl">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className={`relative p-12 rounded-3xl bg-gradient-to-br ${course.gradient} overflow-hidden shadow-2xl`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1),transparent_50%)]"></div>
            
            <div className="relative text-center text-white" dir="rtl">
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                آماده‌اید شروع کنید؟
              </h2>
              <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
                با رزرو مشاوره رایگان، مسیر یادگیری شخصی‌سازی شده خودتان را دریافت کنید و قدم اول را در مسیر حرفه‌ای شدن بردارید.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/free-consultation">
                  <Button 
                    size="lg"
                    className="bg-white text-gray-900 hover:bg-gray-100 font-bold text-lg px-8 py-7 rounded-2xl shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    <MessageSquare className="ml-2 w-6 h-6" />
                    رزرو مشاوره رایگان
                  </Button>
                </Link>
                <Link to="/">
                  <Button 
                    size="lg"
                    variant="outline"
                    className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/40 hover:bg-white/20 font-bold text-lg px-8 py-7 rounded-2xl hover:scale-105 transition-all duration-300"
                  >
                    <ArrowLeft className="ml-2 w-5 h-5" />
                    بازگشت به صفحه اصلی
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="mt-12 pt-8 border-t border-white/20">
                <div className="flex flex-wrap justify-center gap-8 text-white/90">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    <span className="font-semibold">پرداخت امن</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    <span className="font-semibold">گواهی معتبر</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span className="font-semibold">{course.students} دانشجو فعال</span>
                  </div>
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
