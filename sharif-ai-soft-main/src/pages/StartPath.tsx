import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  Code2,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Package,
  Target,
  BookOpen,
  Lightbulb,
  Rocket,
  Award,
  Clock,
  Tag,
  Sparkles,
  TrendingUp,
  Users,
  Star,
  Zap,
  Play,
  Download,
  Share2,
  Gift
} from "lucide-react";

type PathType = 'engineering' | 'development' | 'optimization';

interface Course {
  id: string;
  title: string;
  description: string;
  whatYouLearn: string[];
  whyTake: string;
  outcomes: string[];
  duration: string;
  level: string;
  price: string;
}

interface Stage {
  id: number;
  title: string;
  description: string;
  courses: Course[];
}

interface PathData {
  id: PathType;
  title: string;
  subtitle: string;
  icon: typeof Brain;
  gradient: string;
  iconBg: string;
  iconColor: string;
  stages: Stage[];
  bundlePrice: string;
  regularPrice: string;
  discount: string;
}

const pathsData: Record<PathType, PathData> = {
  engineering: {
    id: 'engineering',
    title: 'شروع مسیر مهندسی',
    subtitle: 'مهندس هوش مصنوعی (LLM & Retrieval)',
    icon: Brain,
    gradient: 'from-cyan-400 to-blue-500',
    iconBg: 'from-cyan-400/20 to-blue-500/20',
    iconColor: 'text-cyan-500',
    stages: [
      {
        id: 1,
        title: 'مرحله اول: مبانی و ابزارها',
        description: 'آشنایی با ابزارها و مفاهیم پایه‌ای هوش مصنوعی',
        courses: [
          {
            id: 'cursor-basics',
            title: 'دوره Cursor - کدنویسی با هوش مصنوعی',
            description: 'یاد بگیر چطور با کمک هوش مصنوعی سریع‌تر و بهتر کد بنویسی',
            whatYouLearn: [
              'نصب و تنظیم Cursor',
              'استفاده از AI برای کدنویسی',
              'Debug کردن با AI',
              'بهینه‌سازی کد با هوش مصنوعی'
            ],
            whyTake: 'Cursor ابزاری قدرتمند است که سرعت کدنویسی شما را ۱۰ برابر می‌کند و به شما کمک می‌کند کدهای بهتری بنویسید.',
            outcomes: [
              'توانایی کدنویسی ۱۰ برابر سریع‌تر',
              'نوشتن کدهای تمیزتر و بهینه‌تر',
              'رفع اشکالات سریع‌تر با AI'
            ],
            duration: '۸ ساعت',
            level: 'مقدماتی',
            price: '۵۹۰,۰۰۰ تومان'
          },
          {
            id: 'v0-frontend',
            title: 'دوره V0 - ساخت رابط کاربری با AI',
            description: 'یاد بگیر چطور با V0 رابط‌های کاربری زیبا و حرفه‌ای بسازی',
            whatYouLearn: [
              'آشنایی با V0',
              'طراحی رابط کاربری با AI',
              'ایجاد کامپوننت‌های React',
              'استایل‌دهی با Tailwind'
            ],
            whyTake: 'V0 به شما اجازه می‌دهد بدون دانش عمیق طراحی، رابط‌های کاربری حرفه‌ای بسازید.',
            outcomes: [
              'ساخت UI های حرفه‌ای',
              'توانایی پیاده‌سازی سریع طرح‌ها',
              'درک بهتر از React و Tailwind'
            ],
            duration: '۶ ساعت',
            level: 'مقدماتی',
            price: '۴۹۰,۰۰۰ تومان'
          }
        ]
      },
      {
        id: 2,
        title: 'مرحله دوم: یادگیری عمیق و Backend',
        description: 'کار با مدل‌های زبانی و ساخت Backend',
        courses: [
          {
            id: 'codex-backend',
            title: 'دوره Codex - توسعه Backend با AI',
            description: 'یاد بگیر چطور یک Backend قدرتمند با هوش مصنوعی بسازی',
            whatYouLearn: [
              'ساخت API با Node.js',
              'کار با دیتابیس',
              'احراز هویت و امنیت',
              'استفاده از AI در Backend'
            ],
            whyTake: 'برای ساخت یک اپلیکیشن کامل، نیاز به Backend قدرتمندی داری که Codex به تو یاد می‌دهد.',
            outcomes: [
              'ساخت API های RESTful',
              'مدیریت دیتابیس و داده‌ها',
              'پیاده‌سازی احراز هویت امن'
            ],
            duration: '۱۲ ساعت',
            level: 'متوسط',
            price: '۷۹۰,۰۰۰ تومان'
          }
        ]
      },
      {
        id: 3,
        title: 'مرحله سوم: پروژه نهایی',
        description: 'ساخت یک پروژه کامل و حرفه‌ای',
        courses: [
          {
            id: 'ai-chatbot',
            title: 'پروژه عملی - ساخت چت‌بات هوشمند',
            description: 'یک چت‌بات هوشمند با قابلیت RAG بساز',
            whatYouLearn: [
              'کار با OpenAI API',
              'پیاده‌سازی RAG',
              'Vector Database',
              'Deploy و انتشار'
            ],
            whyTake: 'با ساخت یک چت‌بات واقعی، تمام مهارت‌های یاد گرفته شده را به کار می‌بری.',
            outcomes: [
              'یک پروژه قابل نمایش در رزومه',
              'تسلط کامل بر AI Engineering',
              'آمادگی برای بازار کار'
            ],
            duration: '۱۵ ساعت',
            level: 'پیشرفته',
            price: '۱,۲۹۰,۰۰۰ تومان'
          }
        ]
      }
    ],
    bundlePrice: '۱,۹۹۰,۰۰۰',
    regularPrice: '۲,۶۷۰,۰۰۰',
    discount: '۲۵٪'
  },
  development: {
    id: 'development',
    title: 'شروع مسیر توسعه',
    subtitle: 'توسعه‌دهنده هوش مصنوعی (Develop with AI)',
    icon: Code2,
    gradient: 'from-violet-400 to-purple-500',
    iconBg: 'from-violet-400/20 to-purple-500/20',
    iconColor: 'text-violet-500',
    stages: [
      {
        id: 1,
        title: 'مرحله اول: آشنایی با ابزارهای AI',
        description: 'یاد بگیر چطور با ابزارهای AI توسعه دهی',
        courses: [
          {
            id: 'v0-basics',
            title: 'دوره V0 - طراحی با AI',
            description: 'با V0 رابط‌های کاربری زیبا بساز',
            whatYouLearn: [
              'کار با V0',
              'ساخت UI با AI',
              'کامپوننت‌های React',
              'Responsive Design'
            ],
            whyTake: 'V0 سریع‌ترین راه برای ساخت رابط‌های کاربری حرفه‌ای است.',
            outcomes: [
              'ساخت سریع پروژه‌ها',
              'UI های حرفه‌ای',
              'تسلط بر React'
            ],
            duration: '۶ ساعت',
            level: 'مقدماتی',
            price: '۴۹۰,۰۰۰ تومان'
          }
        ]
      },
      {
        id: 2,
        title: 'مرحله دوم: توسعه سریع‌تر با Cursor',
        description: 'کدنویسی حرفه‌ای با کمک هوش مصنوعی',
        courses: [
          {
            id: 'cursor-dev',
            title: 'دوره Cursor - کدنویسی هوشمند',
            description: 'با Cursor سرعت توسعه خود را چند برابر کن',
            whatYouLearn: [
              'Cursor IDE',
              'AI-assisted coding',
              'Refactoring با AI',
              'Testing با AI'
            ],
            whyTake: 'Cursor به تو کمک می‌کند کدهای بهتری در زمان کمتری بنویسی.',
            outcomes: [
              'افزایش سرعت کدنویسی',
              'کیفیت بهتر کد',
              'کاهش باگ‌ها'
            ],
            duration: '۸ ساعت',
            level: 'مقدماتی',
            price: '۵۹۰,۰۰۰ تومان'
          }
        ]
      },
      {
        id: 3,
        title: 'مرحله سوم: پروژه عملی',
        description: 'یک وب‌اپ کامل با AI بساز',
        courses: [
          {
            id: 'fullstack-ai',
            title: 'پروژه - وب‌اپلیکیشن با AI',
            description: 'یک وب‌اپ کامل از صفر تا صد بساز',
            whatYouLearn: [
              'Frontend با V0',
              'Backend با AI',
              'Database Integration',
              'Deployment'
            ],
            whyTake: 'ساخت یک پروژه واقعی بهترین راه یادگیری است.',
            outcomes: [
              'یک پروژه قابل نمایش',
              'تسلط بر Full Stack',
              'آمادگی شغلی'
            ],
            duration: '۱۲ ساعت',
            level: 'متوسط',
            price: '۸۹۰,۰۰۰ تومان'
          }
        ]
      }
    ],
    bundlePrice: '۱,۶۹۰,۰۰۰',
    regularPrice: '۱,۹۷۰,۰۰۰',
    discount: '۱۵٪'
  },
  optimization: {
    id: 'optimization',
    title: 'شروع مسیر بهینه‌سازی',
    subtitle: 'بهینه‌ساز فرآیند با AI (Process Optimizer)',
    icon: BarChart3,
    gradient: 'from-emerald-400 to-green-500',
    iconBg: 'from-emerald-400/20 to-green-500/20',
    iconColor: 'text-emerald-500',
    stages: [
      {
        id: 1,
        title: 'مرحله اول: آشنایی با اتوماسیون',
        description: 'مبانی اتوماسیون و ابزارهای no-code',
        courses: [
          {
            id: 'n8n-basics',
            title: 'دوره N8N - اتوماسیون هوشمند',
            description: 'با N8N فرآیندهای کاری را خودکار کن',
            whatYouLearn: [
              'آشنایی با N8N',
              'ساخت Workflow',
              'اتصال سرویس‌ها',
              'تست و Debug'
            ],
            whyTake: 'N8N به تو اجازه می‌دهد بدون کدنویسی، فرآیندها را خودکار کنی.',
            outcomes: [
              'خودکارسازی وظایف تکراری',
              'صرفه‌جویی در زمان',
              'افزایش بهره‌وری'
            ],
            duration: '۱۰ ساعت',
            level: 'مقدماتی',
            price: '۶۹۰,۰۰۰ تومان'
          }
        ]
      },
      {
        id: 2,
        title: 'مرحله دوم: اتوماسیون پیشرفته با AI',
        description: 'ترکیب AI با اتوماسیون',
        courses: [
          {
            id: 'ai-automation',
            title: 'دوره AgentKit - ایجاد Agent های هوشمند',
            description: 'با AgentKit، Agent های AI بساز',
            whatYouLearn: [
              'مفهوم AI Agents',
              'ساخت Agent با AgentKit',
              'تصمیم‌گیری خودکار',
              'یکپارچه‌سازی با سیستم‌ها'
            ],
            whyTake: 'AI Agents می‌توانند تصمیمات پیچیده بگیرند و کارها را هوشمندانه انجام دهند.',
            outcomes: [
              'ساخت سیستم‌های هوشمند',
              'خودکارسازی تصمیم‌گیری',
              'بهبود فرآیندها'
            ],
            duration: '۱۲ ساعت',
            level: 'متوسط',
            price: '۸۹۰,۰۰۰ تومان'
          }
        ]
      },
      {
        id: 3,
        title: 'مرحله سوم: پروژه بهینه‌سازی',
        description: 'بهینه‌سازی یک فرآیند واقعی',
        courses: [
          {
            id: 'optimization-project',
            title: 'پروژه - بهینه‌سازی فرآیند کسب‌وکار',
            description: 'یک فرآیند واقعی را با AI بهینه کن',
            whatYouLearn: [
              'تحلیل فرآیندها',
              'طراحی اتوماسیون',
              'پیاده‌سازی با N8N و AI',
              'اندازه‌گیری نتایج'
            ],
            whyTake: 'ساخت یک پروژه واقعی، تو را برای بازار کار آماده می‌کند.',
            outcomes: [
              'یک Case Study واقعی',
              'توانایی تحلیل و بهینه‌سازی',
              'آمادگی شغلی'
            ],
            duration: '۱۵ ساعت',
            level: 'پیشرفته',
            price: '۱,۱۹۰,۰۰۰ تومان'
          }
        ]
      }
    ],
    bundlePrice: '۱,۹۹۰,۰۰۰',
    regularPrice: '۲,۷۷۰,۰۰۰',
    discount: '۲۸٪'
  }
};

export default function StartPath() {
  const { pathType } = useParams<{ pathType: PathType }>();
  const [currentStage, setCurrentStage] = useState(0);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [progress, setProgress] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const pathData = pathType ? pathsData[pathType] : null;

  // Calculate total duration
  const totalDuration = pathData?.stages.reduce((acc, stage) => {
    return acc + stage.courses.reduce((courseAcc, course) => {
      const hours = parseInt(course.duration.split(' ')[0]);
      return courseAcc + hours;
    }, 0);
  }, 0) || 0;

  // Update progress
  useEffect(() => {
    if (pathData) {
      const totalStages = pathData.stages.length;
      const progressValue = (completedStages.length / totalStages) * 100;
      setProgress(progressValue);
    }
  }, [completedStages, pathData]);

  if (!pathData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-32 text-center" dir="rtl">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
              <Target className="w-12 h-12 text-destructive" />
            </div>
            <h1 className="text-3xl font-bold mb-4">مسیر یافت نشد</h1>
            <p className="text-text-muted mb-8">متأسفانه مسیر مورد نظر شما پیدا نشد.</p>
            <Link to="/">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent">
                <Sparkles className="ml-2 w-5 h-5" />
                بازگشت به صفحه اصلی
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const PathIcon = pathData.icon;

  const handleNextStage = () => {
    if (currentStage < pathData.stages.length) {
      const currentStageCourses = pathData.stages[currentStage].courses;
      setSelectedCourses(prev => [...prev, ...currentStageCourses]);
      setCompletedStages(prev => [...prev, currentStage]);
      setCurrentStage(prev => prev + 1);
      
      // Show confetti on last stage
      if (currentStage === pathData.stages.length - 1) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
      
      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isLastStage = currentStage === pathData.stages.length - 1;
  const isFinished = currentStage >= pathData.stages.length;
  const completedCoursesCount = selectedCourses.length;
  const totalCoursesCount = pathData.stages.reduce((acc, stage) => acc + stage.courses.length, 0);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-surface to-background"></div>
        <div className={`absolute top-20 right-20 w-96 h-96 bg-gradient-to-br ${pathData.gradient} opacity-10 rounded-full blur-3xl animate-pulse`}></div>
        <div className={`absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr ${pathData.gradient} opacity-10 rounded-full blur-3xl animate-pulse`} style={{ animationDelay: '1s' }}></div>
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br ${pathData.gradient} opacity-5 rounded-full blur-3xl animate-pulse`} style={{ animationDelay: '2s' }}></div>
      </div>

      <Header />
      
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-[fadeOut_3s_ease-out]"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `confetti ${1 + Math.random() * 2}s ease-out forwards`
              }}
            >
              <Sparkles className={`w-6 h-6 ${pathData.iconColor}`} />
            </div>
          ))}
        </div>
      )}
      
      {/* Hero Section */}
      <section className="relative py-8 md:py-20 px-3 md:px-4">
        <div className="container mx-auto max-w-6xl relative z-10" dir="rtl">
          {/* Top Stats Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-8 mb-6 md:mb-10">
            <div className="flex items-center gap-1.5 md:gap-2 px-2 md:px-4 py-1 md:py-2 rounded-full bg-surface/80 backdrop-blur-sm border border-border">
              <Clock className="w-3 md:w-4 h-3 md:h-4 text-primary" />
              <span className="text-xs md:text-sm font-medium">{totalDuration} ساعت</span>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2 px-2 md:px-4 py-1 md:py-2 rounded-full bg-surface/80 backdrop-blur-sm border border-border">
              <Users className="w-3 md:w-4 h-3 md:h-4 text-accent" />
              <span className="text-xs md:text-sm font-medium">+۱,۲۰۰ دانشجو</span>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2 px-2 md:px-4 py-1 md:py-2 rounded-full bg-surface/80 backdrop-blur-sm border border-border">
              <Star className="w-3 md:w-4 h-3 md:h-4 text-amber-500" />
              <span className="text-xs md:text-sm font-medium">۴.۸ از ۵</span>
            </div>
          </div>

          <div className="text-center mb-6 md:mb-10">
            <div className={`inline-flex items-center justify-center w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-3xl bg-gradient-to-br ${pathData.iconBg} backdrop-blur-sm mb-4 md:mb-6 shadow-lg md:shadow-xl border border-primary/20 hover:scale-110 transition-transform duration-500`}>
              <PathIcon className={`w-8 h-8 md:w-12 md:h-12 ${pathData.iconColor} drop-shadow-lg`} />
            </div>
            <h1 className={`text-2xl md:text-6xl font-black mb-2 md:mb-4 bg-gradient-to-l ${pathData.gradient} bg-clip-text text-transparent leading-tight px-4`}>
              {pathData.title}
            </h1>
            <p className="text-sm md:text-xl text-text-muted max-w-2xl mx-auto font-medium leading-relaxed px-4">
              {pathData.subtitle}
            </p>
          </div>

          {/* Enhanced Progress Section */}
          <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
            {/* Overall Progress */}
            <Card className="border border-primary/20 md:border-2 bg-gradient-to-br from-surface/50 to-surface-2/50 backdrop-blur-sm">
              <CardHeader className="pb-2 md:pb-3 px-3 md:px-6 pt-3 md:pt-6">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br ${pathData.gradient} flex items-center justify-center`}>
                      <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-sm md:text-lg">پیشرفت کلی</CardTitle>
                      <CardDescription className="text-xs md:text-sm">
                        {completedCoursesCount} از {totalCoursesCount} دوره
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={`bg-gradient-to-r ${pathData.gradient} text-white text-sm md:text-lg px-2 md:px-4 py-0.5 md:py-1`}>
                    {Math.round(progress)}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
                <Progress value={progress} className="h-2 md:h-3" />
              </CardContent>
            </Card>

            {/* Stage Progress Indicators - Mobile Optimized */}
            <div className="grid grid-cols-3 gap-3 md:gap-8">
              {pathData.stages.map((stage, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 md:gap-4">
                  {/* Stage Circle */}
                  <div className="relative group">
                    <div className={`flex items-center justify-center w-14 h-14 md:w-24 md:h-24 rounded-2xl md:rounded-3xl transition-all duration-500 ${
                      completedStages.includes(idx) 
                        ? `bg-gradient-to-br ${pathData.gradient} shadow-lg md:shadow-2xl scale-105 md:scale-110` :
                      idx === currentStage 
                        ? `bg-gradient-to-br ${pathData.iconBg} border-2 md:border-4 border-primary shadow-md md:shadow-xl animate-pulse` :
                        'bg-surface/50 backdrop-blur-sm border-2 md:border-4 border-border/50'
                    }`}>
                      {completedStages.includes(idx) ? (
                        <CheckCircle2 className="w-7 h-7 md:w-12 md:h-12 text-white drop-shadow-lg" />
                      ) : (
                        <span className={`text-xl md:text-3xl font-black ${
                          idx === currentStage ? 'text-primary' : 'text-text-muted'
                        }`}>
                          {idx + 1}
                        </span>
                      )}
                    </div>
                    
                    {/* Active Indicator */}
                    {idx === currentStage && !isFinished && (
                      <>
                        <div className={`absolute -top-1 -right-1 md:-top-2 md:-right-2 w-4 h-4 md:w-6 md:h-6 rounded-full bg-gradient-to-br ${pathData.gradient} animate-ping`}></div>
                        <div className={`absolute -top-1 -right-1 md:-top-2 md:-right-2 w-4 h-4 md:w-6 md:h-6 rounded-full bg-gradient-to-br ${pathData.gradient}`}></div>
                      </>
                    )}
                    
                    {/* Completed Badge - Hidden on mobile */}
                    {completedStages.includes(idx) && (
                      <div className="hidden md:block absolute -bottom-2 left-1/2 -translate-x-1/2">
                        <Badge className="bg-green-500 text-white text-xs px-2 py-0.5 shadow-lg">
                          ✓ تکمیل شده
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Stage Info - Mobile Optimized */}
                  <div className="text-center space-y-1 md:space-y-2 px-1 md:px-2">
                    <h4 className={`text-xs md:text-base font-bold transition-all duration-300 leading-tight ${
                      idx === currentStage ? `${pathData.iconColor} scale-105 md:scale-110` : 
                      completedStages.includes(idx) ? 'text-text' : 
                      'text-text-muted'
                    }`}>
                      {stage.title.split(':')[0]}
                    </h4>
                    <p className={`text-[10px] md:text-sm transition-all duration-300 leading-snug line-clamp-2 ${
                      idx === currentStage ? 'text-text font-medium' : 
                      completedStages.includes(idx) ? 'text-text-muted' : 
                      'text-text-muted/60'
                    }`}>
                      {stage.title.split(':')[1]?.trim() || stage.description}
                    </p>
                    
                    {/* Stage Status */}
                    <div className="pt-0.5 md:pt-1">
                      {completedStages.includes(idx) ? (
                        <Badge variant="outline" className="text-[10px] md:text-xs bg-green-500/10 border-green-500/30 text-green-600 px-1.5 md:px-2 py-0 md:py-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5 md:w-3 md:h-3 ml-0.5 md:ml-1" />
                          <span className="hidden md:inline">انجام شد</span>
                          <span className="md:hidden">✓</span>
                        </Badge>
                      ) : idx === currentStage ? (
                        <Badge className={`text-[10px] md:text-xs bg-gradient-to-r ${pathData.gradient} text-white animate-pulse px-1.5 md:px-2 py-0 md:py-0.5`}>
                          <Play className="w-2.5 h-2.5 md:w-3 md:h-3 ml-0.5 md:ml-1" />
                          <span className="hidden md:inline">در حال انجام</span>
                          <span className="md:hidden">فعال</span>
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] md:text-xs border-border/50 text-text-muted/60 px-1.5 md:px-2 py-0 md:py-0.5">
                          <Clock className="w-2.5 h-2.5 md:w-3 md:h-3 ml-0.5 md:ml-1" />
                          <span className="hidden md:inline">در انتظار</span>
                          <span className="md:hidden">-</span>
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Current Stage Section */}
      {!isFinished && (
        <section className="py-6 md:py-12 px-3 md:px-4">
          <div className="container mx-auto max-w-6xl" dir="rtl">
            <Card className="mb-6 md:mb-8 border border-primary/30 md:border-2 shadow-lg md:shadow-2xl bg-gradient-to-br from-surface/90 to-surface-2/90 backdrop-blur-sm overflow-hidden">
              {/* Decorative Elements - Hidden on mobile */}
              <div className={`hidden md:block absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${pathData.gradient} opacity-5 rounded-full blur-3xl`}></div>
              <div className={`hidden md:block absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr ${pathData.gradient} opacity-5 rounded-full blur-3xl`}></div>
              
              <CardHeader className="relative z-10 space-y-2 md:space-y-4 pb-3 md:pb-6 px-3 md:px-6 pt-3 md:pt-6">
                <div className="flex items-center gap-2 md:gap-4 flex-wrap">
                  <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br ${pathData.gradient} flex items-center justify-center shadow-lg`}>
                    <Target className="w-5 h-5 md:w-7 md:h-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg md:text-3xl mb-1 md:mb-2 leading-tight">{pathData.stages[currentStage].title}</CardTitle>
                    <CardDescription className="text-xs md:text-lg leading-snug">
                      {pathData.stages[currentStage].description}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-xs md:text-lg px-2 md:px-4 py-1 md:py-2 border md:border-2 shrink-0">
                    مرحله {currentStage + 1}/{pathData.stages.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6 relative z-10 pt-2 px-3 md:px-6 pb-3 md:pb-6">
                {pathData.stages[currentStage].courses.map((course, idx) => (
                  <Card key={idx} className="border md:border-2 hover:border-primary/50 transition-all duration-300 bg-background/50 backdrop-blur-sm hover:shadow-xl group overflow-hidden">
                    {/* Hover Gradient Effect - Only on desktop */}
                    <div className={`hidden md:block absolute inset-0 bg-gradient-to-br ${pathData.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                    <CardHeader className="relative z-10 px-3 md:px-6 pt-3 md:pt-6 pb-2 md:pb-6">
                      <div className="flex items-start justify-between gap-2 md:gap-4 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-to-br ${pathData.iconBg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                              <BookOpen className={`w-4 h-4 md:w-5 md:h-5 ${pathData.iconColor}`} />
                            </div>
                            <CardTitle className="text-base md:text-2xl leading-tight">{course.title}</CardTitle>
                          </div>
                          <CardDescription className="text-xs md:text-base leading-snug">{course.description}</CardDescription>
                        </div>
                        <div className="flex gap-1.5 md:gap-2 shrink-0">
                          <Badge variant="secondary" className="text-[10px] md:text-sm px-1.5 md:px-3 py-0.5 md:py-1">
                            {course.level}
                          </Badge>
                          <Badge className={`bg-gradient-to-r ${pathData.gradient} text-white text-[10px] md:text-sm px-1.5 md:px-3 py-0.5 md:py-1`}>
                            دوره {idx + 1}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 md:space-y-6 relative z-10 px-3 md:px-6 pb-3 md:pb-6">
                      {/* Why Take This Course */}
                      <div className={`bg-gradient-to-br ${pathData.iconBg} rounded-lg md:rounded-xl p-3 md:p-5 border md:border-2 border-primary/10 hover:border-primary/30 transition-all duration-300`}>
                        <div className="flex items-start gap-2 md:gap-3">
                          <div className={`w-8 h-8 md:w-10 md:h-10 rounded-md md:rounded-lg bg-gradient-to-br ${pathData.gradient} flex items-center justify-center shrink-0`}>
                            <Lightbulb className="w-4 h-4 md:w-5 md:h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm md:text-lg mb-1 md:mb-2 flex items-center gap-1 md:gap-2">
                              چرا این دوره؟
                              <Zap className="w-3 h-3 md:w-4 md:h-4 text-amber-500" />
                            </h4>
                            <p className="text-xs md:text-base text-text leading-snug md:leading-relaxed">{course.whyTake}</p>
                          </div>
                        </div>
                      </div>

                      {/* What You Learn & Outcomes Grid */}
                      <div className="grid md:grid-cols-2 gap-3 md:gap-6">
                        {/* What You Learn */}
                        <div className="bg-surface/50 rounded-lg md:rounded-xl p-3 md:p-5 border border-border hover:border-primary/30 transition-all">
                          <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-4">
                            <div className="w-6 h-6 md:w-8 md:h-8 rounded-md md:rounded-lg bg-primary/10 flex items-center justify-center">
                              <BookOpen className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                            </div>
                            <h4 className="font-bold text-xs md:text-lg">یاد می‌گیری</h4>
                          </div>
                          <ul className="space-y-1.5 md:space-y-3">
                            {course.whatYouLearn.slice(0, 3).map((item, i) => (
                              <li key={i} className="flex items-start gap-2 md:gap-3 text-xs md:text-base group/item">
                                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-primary/20 transition-colors">
                                  <CheckCircle2 className="w-2.5 h-2.5 md:w-3 md:h-3 text-primary" />
                                </div>
                                <span className="leading-snug md:leading-relaxed">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Outcomes */}
                        <div className="bg-surface/50 rounded-lg md:rounded-xl p-3 md:p-5 border border-border hover:border-accent/30 transition-all">
                          <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-4">
                            <div className="w-6 h-6 md:w-8 md:h-8 rounded-md md:rounded-lg bg-accent/10 flex items-center justify-center">
                              <Award className="w-3 h-3 md:w-4 md:h-4 text-accent" />
                            </div>
                            <h4 className="font-bold text-xs md:text-lg">بهت می‌رسه</h4>
                          </div>
                          <ul className="space-y-1.5 md:space-y-3">
                            {course.outcomes.slice(0, 3).map((item, i) => (
                              <li key={i} className="flex items-start gap-2 md:gap-3 text-xs md:text-base group/item">
                                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-accent/20 transition-colors">
                                  <Sparkles className="w-2.5 h-2.5 md:w-3 md:h-3 text-accent" />
                                </div>
                                <span className="leading-snug md:leading-relaxed">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Course Info Bar */}
                      <div className="flex flex-wrap items-center gap-2 md:gap-8 pt-3 md:pt-6 border-t md:border-t-2 border-border">
                        <div className="flex items-center gap-2 md:gap-3 px-2 md:px-4 py-1.5 md:py-2 rounded-md md:rounded-lg bg-surface">
                          <Clock className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                          <div>
                            <p className="text-[10px] md:text-xs text-text-muted">مدت</p>
                            <p className="text-xs md:text-sm font-bold">{course.duration}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 md:gap-3 px-2 md:px-4 py-1.5 md:py-2 rounded-md md:rounded-lg bg-surface">
                          <Tag className="w-4 h-4 md:w-5 md:h-5 text-accent" />
                          <div>
                            <p className="text-[10px] md:text-xs text-text-muted">قیمت</p>
                            <p className="text-xs md:text-sm font-bold">{course.price}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 md:gap-3 px-2 md:px-4 py-1.5 md:py-2 rounded-md md:rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                          <Star className="w-4 h-4 md:w-5 md:h-5 text-amber-500" />
                          <div>
                            <p className="text-[10px] md:text-xs text-text-muted">امتیاز</p>
                            <p className="text-xs md:text-sm font-bold">۴.۸/۵</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <div className="flex justify-center pt-4 md:pt-8">
                  <Button 
                    size="lg"
                    onClick={handleNextStage}
                    className={`bg-gradient-to-r ${pathData.gradient} hover:opacity-90 hover:scale-105 transition-all duration-300 text-sm md:text-lg px-6 md:px-10 py-5 md:py-7 shadow-xl md:shadow-2xl group h-auto`}
                  >
                    <Play className="ml-1.5 md:ml-2 w-4 h-4 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
                    {isLastStage ? '🎉 مشاهده کالکشن' : 'مرحله بعدی'}
                    <ChevronRight className="mr-1.5 md:mr-2 w-4 h-4 md:w-6 md:h-6 rotate-180 group-hover:-translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Selected Courses Sidebar */}
      {selectedCourses.length > 0 && !isFinished && (
        <section className="py-4 md:py-12 px-3 md:px-4 bg-gradient-to-br from-surface/30 to-surface-2/30 backdrop-blur-sm relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          
          <div className="container mx-auto max-w-6xl relative z-10" dir="rtl">
            <Card className="border border-primary/20 md:border-2 md:border-primary/30 shadow-lg md:shadow-2xl bg-background/80 backdrop-blur-md overflow-hidden">
              {/* Animated gradient border */}
              <div className={`absolute inset-0 bg-gradient-to-r ${pathData.gradient} opacity-10 animate-pulse`}></div>
              
              <CardHeader className="relative z-10 space-y-1.5 md:space-y-2 p-3 md:p-6">
                <div className="flex items-center gap-2 md:gap-4 flex-wrap justify-between">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className={`w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-br ${pathData.gradient} flex items-center justify-center shadow-md md:shadow-lg`}>
                      <Package className="w-4 h-4 md:w-6 md:h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-sm md:text-2xl">سبد انتخابی</CardTitle>
                      <CardDescription className="text-xs md:text-base">
                        {selectedCourses.length} دوره
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={`bg-gradient-to-r ${pathData.gradient} text-white text-xs md:text-base px-2 py-0.5 md:px-4 md:py-2`}>
                    {completedStages.length} مرحله
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="relative z-10 p-3 md:p-6">
                <div className="grid gap-2 md:gap-4">
                  {selectedCourses.map((course, idx) => (
                    <div 
                      key={idx} 
                      className={`flex items-center gap-2 md:gap-4 p-2 md:p-4 bg-gradient-to-r from-surface to-surface-2 rounded-lg md:rounded-xl border border-border md:border-2 hover:border-primary/50 transition-all duration-300 group hover:shadow-lg`}
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <div className={`w-8 h-8 md:w-12 md:h-12 rounded-md md:rounded-lg bg-gradient-to-br ${pathData.iconBg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                        <CheckCircle2 className={`w-4 h-4 md:w-6 md:h-6 ${pathData.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <p className="font-bold text-xs md:text-lg mb-0.5 md:mb-1 truncate">{course.title}</p>
                        <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-text-muted">
                          <span className="flex items-center gap-0.5 md:gap-1 truncate">
                            <Clock className="w-3 h-3 shrink-0" />
                            <span className="truncate">{course.duration}</span>
                          </span>
                          <Badge variant="secondary" className="text-[10px] md:text-xs px-1.5 py-0 md:px-2 md:py-0.5 shrink-0">{course.level}</Badge>
                        </div>
                      </div>
                      <div className="text-left shrink-0">
                        <p className="text-[10px] md:text-xs text-text-muted mb-0.5 md:mb-1 hidden md:block">قیمت</p>
                        <p className="text-xs md:text-lg font-bold whitespace-nowrap">{course.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Final Bundle Offer - Enhanced */}
      {isFinished && (
        <section className="py-12 md:py-20 px-4 relative overflow-hidden">
          {/* Celebration Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5"></div>
          <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${pathData.gradient} opacity-10 rounded-full blur-3xl animate-pulse`}></div>
          <div className={`absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr ${pathData.gradient} opacity-10 rounded-full blur-3xl animate-pulse`} style={{ animationDelay: '1s' }}></div>
          
          <div className="container mx-auto max-w-5xl relative z-10" dir="rtl">
            <Card className={`border-4 border-primary/40 bg-gradient-to-br from-background/95 to-surface/95 backdrop-blur-xl shadow-[0_20px_70px_rgba(0,0,0,0.3)] overflow-hidden`}>
              {/* Animated gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${pathData.iconBg} opacity-30`}></div>
              
              <CardHeader className="text-center relative z-10 space-y-6 pt-12 pb-8">
                {/* Animated Icon */}
                <div className="relative inline-flex justify-center mx-auto mb-4">
                  <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${pathData.gradient} flex items-center justify-center shadow-2xl animate-bounce`}>
                    <Rocket className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center animate-pulse">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-l from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
                    🎉 تبریک! مسیر شما کامل شد 🎉
                  </h2>
                  <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed">
                    حالا می‌تونی همه دوره‌ها رو با <span className="font-bold text-accent">تخفیف ویژه</span> و <span className="font-bold text-primary">هدایای ارزشمند</span> تهیه کنی
                  </p>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border-2 border-primary/30">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <span className="font-bold">{selectedCourses.length} دوره</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border-2 border-accent/30">
                    <Clock className="w-5 h-5 text-accent" />
                    <span className="font-bold">{totalDuration} ساعت</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border-2 border-amber-500/30">
                    <Award className="w-5 h-5 text-amber-500" />
                    <span className="font-bold">گواهی معتبر</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8 relative z-10 pb-12">
                {/* Bundle Details */}
                <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 space-y-6 border-2 border-border shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${pathData.gradient} flex items-center justify-center`}>
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold">کالکشن کامل {pathData.title}</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {selectedCourses.map((course, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-surface rounded-lg border border-border hover:border-primary/50 transition-all group">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${pathData.iconBg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                          <CheckCircle2 className={`w-4 h-4 ${pathData.iconColor}`} />
                        </div>
                        <span className="text-sm font-medium">{course.title}</span>
                      </div>
                    ))}
                  </div>

                  {/* Bonus Items */}
                  <div className="pt-6 border-t-2 border-border">
                    <div className="flex items-center gap-2 mb-4">
                      <Gift className="w-5 h-5 text-accent" />
                      <h4 className="font-bold text-lg">هدایای ویژه این کالکشن:</h4>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg border border-accent/30">
                        <Sparkles className="w-5 h-5 text-accent shrink-0" />
                        <span className="text-sm">دسترسی مادام‌العمر به دوره‌ها</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/30">
                        <Download className="w-5 h-5 text-primary shrink-0" />
                        <span className="text-sm">فایل‌های تمرینی و پروژه</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg border border-accent/30">
                        <Users className="w-5 h-5 text-accent shrink-0" />
                        <span className="text-sm">عضویت در کامیونیتی اختصاصی</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/30">
                        <Award className="w-5 h-5 text-primary shrink-0" />
                        <span className="text-sm">گواهی معتبر پایان دوره</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pricing Card */}
                <div className={`bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 rounded-2xl p-6 md:p-8 border-2 border-primary/30 shadow-xl relative overflow-hidden`}>
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent/20 to-transparent rounded-full blur-2xl"></div>
                  
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b-2 border-border">
                      <span className="text-lg text-text-muted">قیمت معمولی:</span>
                      <span className="text-2xl line-through text-text-muted">{pathData.regularPrice} تومان</span>
                    </div>
                    
                    <div className="flex items-center justify-between pb-4 border-b-2 border-border">
                      <span className="text-xl font-bold">تخفیف کالکشن:</span>
                      <Badge className={`bg-gradient-to-r ${pathData.gradient} text-white text-2xl px-5 py-2 shadow-lg animate-pulse`}>
                        {pathData.discount} تخفیف
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4">
                      <div className="flex items-center gap-3">
                        <Tag className="w-8 h-8 text-primary" />
                        <span className="text-2xl md:text-3xl font-black">قیمت نهایی:</span>
                      </div>
                      <div className="text-left">
                        <span className={`text-4xl md:text-5xl font-black bg-gradient-to-l ${pathData.gradient} bg-clip-text text-transparent`}>
                          {pathData.bundlePrice}
                        </span>
                        <span className="text-xl font-bold text-text-muted mr-2">تومان</span>
                      </div>
                    </div>

                    <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
                      <Zap className="w-6 h-6 text-amber-500 shrink-0 animate-pulse" />
                      <div>
                        <p className="font-bold text-amber-600 dark:text-amber-400 mb-1">پیشنهاد محدود!</p>
                        <p className="text-sm text-text-muted">این تخفیف فقط برای ۲۴ ساعت آینده معتبر است</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Section */}
                <div className="text-center space-y-6">
                  <Button 
                    size="lg"
                    className={`bg-gradient-to-r ${pathData.gradient} hover:opacity-90 hover:scale-105 transition-all duration-300 text-xl px-12 py-8 h-auto shadow-2xl group relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <Sparkles className="ml-3 w-6 h-6 animate-pulse relative z-10" />
                    <span className="relative z-10">خرید کالکشن با {pathData.discount} تخفیف</span>
                    <ChevronRight className="mr-3 w-6 h-6 rotate-180 group-hover:-translate-x-2 transition-transform relative z-10" />
                  </Button>
                  
                  <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-text-muted">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span>گارانتی بازگشت وجه ۳۰ روزه</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span>پرداخت امن</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span>پشتیبانی ۲۴/۷</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-4 pt-4">
                    <Button variant="outline" size="lg" className="gap-2">
                      <Share2 className="w-5 h-5" />
                      اشتراک‌گذاری
                    </Button>
                    <Button variant="outline" size="lg" className="gap-2">
                      <Download className="w-5 h-5" />
                      دانلود سرفصل‌ها
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}