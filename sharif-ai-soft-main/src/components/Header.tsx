import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Sparkles, Code2, Boxes, Cpu, BookOpen, Briefcase, Newspaper, CheckCircle2, ArrowLeft, Menu, ChevronDown } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import sgLogo from "@/assets/sg-logo.png";

const navItems = [
  { 
    label: "آموزش فرانت‌اند",
    subtitle: "V0",
    icon: Code2,
    href: "/course/v0-frontend",
    color: "from-cyan-400 to-blue-500",
    iconBg: "bg-gradient-to-br from-cyan-400/20 to-blue-500/20",
    iconColor: "text-cyan-400",
    type: "learning" as const,
    content: {
      title: "چه چیزی دریافت می‌کنید؟",
      description: "هرآنچه برای مسیر یادگیری و ورود حرفه‌ای به دنیای AI نیاز دارید در یک بسته کامل جمع‌آوری شده است.",
      features: [
        {
          title: "سه پروژه واقعی با بازخورد منتور",
          description: "تجربه عملی در فرانت‌اند، و عامل هوشمند با بازنگری دقیق منتورهای تخصصی."
        },
        {
          title: "پشتیبانی ۲۴/۷ و انجمن خصوصی",
          description: "جلسات هفتگی، دسترسی به گروه اختصاصی و حل سریع چالش‌ها در تمام طول مسیر یادگیری."
        },
        {
          title: "گواهی معتبر و معرفی به پروژه‌ها",
          description: "دریافت گواهی پایان دوره و معرفی به پروژه‌های تجاری منتخب برای شروع همکاری حرفه‌ای."
        }
      ]
    }
  },
  { 
    label: "آموزش بک‌اند",
    subtitle: "Codex",
    icon: Boxes,
    href: "/course/codex-backend",
    color: "from-purple-400 to-pink-500",
    iconBg: "bg-gradient-to-br from-purple-400/20 to-pink-500/20",
    iconColor: "text-purple-400",
    type: "learning" as const,
    content: {
      title: "چه چیزی دریافت می‌کنید؟",
      description: "هرآنچه برای مسیر یادگیری و ورود حرفه‌ای به دنیای AI نیاز دارید در یک بسته کامل جمع‌آوری شده است.",
      features: [
        {
          title: "سه پروژه واقعی با بازخورد منتور",
          description: "تجربه عملی در بک‌اند و عامل هوشمند با بازنگری دقیق منتورهای تخصصی."
        },
        {
          title: "پشتیبانی ۲۴/۷ و انجمن خصوصی",
          description: "جلسات هفتگی، دسترسی به گروه اختصاصی و حل سریع چالش‌ها در تمام طول مسیر یادگیری."
        },
        {
          title: "گواهی معتبر و معرفی به پروژه‌ها",
          description: "دریافت گواهی پایان دوره و معرفی به پروژه‌های تجاری منتخب برای شروع همکاری حرفه‌ای."
        }
      ]
    }
  },
  { 
    label: "آموزش کدنویسی",
    subtitle: "Cursor",
    icon: Cpu,
    href: "/course/cursor-fullstack",
    color: "from-violet-400 to-indigo-500",
    iconBg: "bg-gradient-to-br from-violet-400/20 to-indigo-500/20",
    iconColor: "text-violet-400",
    type: "learning" as const,
    content: {
      title: "چه چیزی دریافت می‌کنید؟",
      description: "هرآنچه برای مسیر یادگیری و ورود حرفه‌ای به دنیای AI نیاز دارید در یک بسته کامل جمع‌آوری شده است.",
      features: [
        {
          title: "سه پروژه واقعی با بازخورد منتور",
          description: "تجربه عملی در فرانت‌اند، بک‌اند و عامل هوشمند با بازنگری دقیق منتورهای تخصصی."
        },
        {
          title: "پشتیبانی ۲۴/۷ و انجمن خصوصی",
          description: "جلسات هفتگی، دسترسی به گروه اختصاصی و حل سریع چالش‌ها در تمام طول مسیر یادگیری."
        },
        {
          title: "گواهی معتبر و معرفی به پروژه‌ها",
          description: "دریافت گواهی پایان دوره و معرفی به پروژه‌های تجاری منتخب برای شروع همکاری حرفه‌ای."
        }
      ]
    }
  },
  { 
    label: "دوره‌های دیگر",
    subtitle: "۱۰۰+ پروژه",
    icon: BookOpen,
    href: "/courses",
    color: "from-rose-400 to-red-500",
    iconBg: "bg-gradient-to-br from-rose-400/20 to-red-500/20",
    iconColor: "text-rose-400",
    type: "courses" as const,
    courses: [
      "کالکشن طراحی سایت با هوش مصنوعی",
      "دوره طراحی سایت با هوش مصنوعی",
      "دوره تولید محتوا با هوش مصنوعی",
      "مسترکلاس تولید تصویر با هوش مصنوعی – ویژوالهای حرفهای با مدلهای Diffusion",
      "ساخت چتبات هوشمند – وب و تلگرام",
      "دوره آموزش فرانت اند با هوش مصنوعی V0",
      "دوره آموزش بک اند با هوش مصنوعی Codex",
      "دوره آموزش کدنویسی با هوش مصنوعی Cursor",
      "برنامهنویسی هوش مصنوعی با پایتون – از پایه تا عاملها",
      "برنامهنویسی هوش مصنوعی با جاوا – اپهای هوشمند با Spring و LLM",
      "پرامپت انجینیرینگ – هنر دستور دادن به هوش مصنوعی"
    ]
  },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-gradient-to-br from-surface/80 via-surface/75 to-surface/70 backdrop-blur-3xl shadow-2xl shadow-primary/5 border-b border-white/20 h-14"
          : "bg-gradient-to-br from-surface/70 via-surface/60 to-surface/50 backdrop-blur-2xl border-b border-white/10 h-16 shadow-xl shadow-primary/10"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 h-full">
        <div className="flex items-center h-full relative gap-2 lg:gap-0 lg:justify-between">
          {/* Right side on mobile: Menu Button */}
          <div className="flex items-center gap-2 lg:hidden flex-1">
            {/* Mobile Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="flex flex-col gap-0.5 justify-center items-center w-5 h-5">
                  <span className="w-4 h-0.5 bg-text-strong rounded-full"></span>
                  <span className="w-4 h-0.5 bg-text-strong rounded-full"></span>
                  <span className="w-4 h-0.5 bg-text-strong rounded-full"></span>
                </button>
              </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-surface/95 backdrop-blur-2xl border-l border-white/10">
              <SheetHeader>
                <SheetTitle className="text-right text-text-strong">منوی اصلی</SheetTitle>
              </SheetHeader>
              <div className="mt-8 space-y-4">
                {/* Navigation Items */}
                {navItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={idx}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="group flex items-center gap-3 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-primary/50 hover:bg-white/15 transition-all duration-200 shadow-lg"
                    >
                      <div className={`w-12 h-12 rounded-xl ${item.iconBg} backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-200 group-hover:scale-110`}>
                        <Icon className={`w-5 h-5 ${item.iconColor}`} />
                      </div>
                      <div className="flex flex-col items-start flex-1">
                        <span className="text-sm font-semibold text-text-strong">
                          {item.label}
                        </span>
                        <span className="text-xs text-text-muted">
                          {item.subtitle}
                        </span>
                      </div>
                    </Link>
                  );
                })}
                
                {/* Secondary Links */}
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <Link 
                    to="/enterprise" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-emerald-500/50 hover:bg-white/15 transition-all duration-200"
                  >
                    <Briefcase className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm text-text font-medium">فروش سازمانی</span>
                  </Link>
                  
                  <Link 
                    to="/magazine" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-amber-500/50 hover:bg-white/15 transition-all duration-200"
                  >
                    <Newspaper className="w-5 h-5 text-amber-500" />
                    <span className="text-sm text-text font-medium">مجله</span>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          </div>
          
          {/* Center: Logo + Name - Mobile */}
          <Link
            to="/"
            className="lg:hidden flex items-center gap-2 group flex-shrink-0 pointer-events-auto justify-center -mr-16"
          >
            <div className={`${isScrolled ? 'w-9 h-9' : 'w-10 h-10'} rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-neu-out group-hover:shadow-neu-hover group-hover:scale-110 transition-all duration-300 flex items-center justify-center p-2`}>
              <img src={sgLogo} alt="S&G Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col items-start -ml-1 -space-y-1.5">
              <h1 className={`${isScrolled ? 'text-sm' : 'text-base'} font-bold text-text-strong transition-all duration-300`}>
                sharifGPT
              </h1>
              <p className={`${isScrolled ? 'text-[10px]' : 'text-xs'} text-text-strong font-normal`}>
                Academy
              </p>
            </div>
          </Link>

          {/* Left side: Theme Toggle + Auth Button - Mobile */}
          <div className="flex items-center gap-2 lg:hidden flex-1 justify-end">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Auth Button */}
            <Link to="/auth">
              <Button
                variant="default"
                size="sm" 
                className="rounded-xl bg-gradient-to-r from-primary to-primary-light hover:shadow-lg hover:shadow-primary/30 text-white font-semibold shadow-lg transition-all duration-200 text-[10px] sm:text-xs px-2 sm:px-3 whitespace-nowrap"
              >
                ورود | ثبت‌نام
              </Button>
            </Link>
          </div>
          
          {/* Desktop Brand */}
          <Link
            to="/"
            className="hidden lg:flex items-center gap-3 group flex-shrink-0 pointer-events-auto"
          >
            <div className={`${isScrolled ? 'w-10 h-10' : 'w-12 h-12'} rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-neu-out group-hover:shadow-neu-hover group-hover:scale-110 transition-all duration-300 flex items-center justify-center p-2`}>
              <img src={sgLogo} alt="S&G Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col items-start -ml-1 -space-y-1.5">
              <h1 className={`${isScrolled ? 'text-base' : 'text-lg'} font-bold text-text-strong transition-all duration-300`}>
                sharifGPT
              </h1>
              <p className={`${isScrolled ? 'text-xs' : 'text-sm'} text-text-strong font-normal`}>
                Academy
              </p>
            </div>
          </Link>

          {/* Navigation Items */}
          <nav className="hidden lg:flex items-center gap-2 lg:mr-12">
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Popover key={idx}>
                  <PopoverTrigger asChild>
                    <button
                      className="group relative flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md border border-white/20 hover:border-primary/60 hover:from-white/20 hover:to-white/10 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 shadow-lg hover:scale-105 data-[state=open]:border-primary/60"
                    >
                      <div className={`w-8 h-8 rounded-lg ${item.iconBg} backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-hover:border-white/30`}>
                        <Icon className={`w-4 h-4 ${item.iconColor}`} />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-xs font-semibold text-text-strong whitespace-nowrap">
                          {item.label}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-text-muted">
                            {item.subtitle}
                          </span>
                          <ChevronDown className="w-2.5 h-2.5 text-text-muted transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        </div>
                      </div>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent 
                    className="w-[480px] p-6 bg-surface/80 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl"
                    align="center"
                    sideOffset={8}
                  >
                    {item.type === "learning" ? (
                      <div className="space-y-5">
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold text-text-strong">
                            {item.content.title}
                          </h3>
                          <p className="text-sm text-text leading-relaxed">
                            {item.content.description}
                          </p>
                        </div>
                        
                        <div className="space-y-4">
                          {item.content.features.map((feature, featureIdx) => (
                            <div key={featureIdx} className="flex gap-3">
                              <div className="flex-shrink-0 mt-0.5">
                                <CheckCircle2 className={`w-5 h-5 ${item.iconColor}`} />
                              </div>
                              <div className="space-y-1">
                                <h4 className="text-sm font-semibold text-text-strong">
                                  {feature.title}
                                </h4>
                                <p className="text-xs text-text-muted leading-relaxed">
                                  {feature.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <Link to={item.href}>
                          <Button 
                            className={`w-full rounded-xl bg-gradient-to-r ${item.color} text-white font-semibold shadow-neu-out hover:shadow-neu-hover transition-all duration-200 gap-2`}
                          >
                            آماده‌ای شروع کنی؟
                            <ArrowLeft className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-text-strong">
                          دوره‌های آموزشی
                        </h3>
                        <div className="grid gap-2 max-h-[400px] overflow-y-auto scrollbar-hide">
                          {item.courses?.map((course, courseIdx) => (
                            <Link
                              key={courseIdx}
                              to={item.href}
                              className="group flex items-center gap-3 p-3 rounded-xl bg-surface/60 border border-border hover:border-primary/40 hover:shadow-neu-hover transition-all duration-200"
                            >
                              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${item.color} flex-shrink-0`} />
                              <span className="text-sm text-text group-hover:text-text-strong transition-colors">
                                {course}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              );
            })}
          </nav>

          {/* Desktop: Secondary Links + Auth */}
          <div className="hidden lg:flex items-center gap-2 lg:gap-3 flex-shrink-0 lg:flex-1 lg:justify-end">
            {/* Theme Toggle - Desktop only */}
            <ThemeToggle />
            
            {/* Desktop Secondary Links */}
            <div className="hidden xl:flex items-center gap-1 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
              <Link to="/enterprise" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-primary-lighter/30 transition-colors group">
                <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-xs text-text group-hover:text-text-strong transition-colors">فروش سازمانی</span>
              </Link>
              <div className="w-px h-4 bg-border" />
              <Link to="/magazine" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-primary-lighter/30 transition-colors group">
                <Newspaper className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-xs text-text group-hover:text-text-strong transition-colors">مجله</span>
              </Link>
            </div>
            
            {/* Auth Button - Desktop */}
            <Link to="/auth">
              <Button
                variant="default"
                size="sm" 
                className="rounded-xl bg-gradient-to-r from-primary to-primary-light hover:shadow-lg hover:shadow-primary/30 text-white font-semibold shadow-lg transition-all duration-200 text-sm px-4 whitespace-nowrap"
              >
                ورود | ثبت‌نام
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
