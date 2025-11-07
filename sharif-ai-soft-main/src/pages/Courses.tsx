import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CourseCard } from "@/components/CourseCard";
import { Sparkles, Zap, TrendingUp } from "lucide-react";

const allCourses = [
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
  {
    slug: "ai-automation-n8n",
    title: "اتوماسیون کسب‌وکار با n8n",
    tags: ["n8n", "اتوماسیون", "API"],
    durationHours: 12,
    level: "متوسط" as const,
    price: 1450000,
    installments: true,
  },
  {
    slug: "rag-chatbot",
    title: "ساخت چت‌بات هوشمند با RAG",
    tags: ["LangChain", "Vector DB", "Python"],
    durationHours: 16,
    level: "پیشرفته" as const,
    price: 1890000,
    installments: true,
  },
  {
    slug: "frontend-v0",
    title: "توسعه فرانت‌اند با V0",
    tags: ["V0", "React", "Tailwind"],
    durationHours: 14,
    level: "متوسط" as const,
    price: 1350000,
    installments: true,
  },
];

export default function Courses() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-12 md:pb-16 px-4 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary-light/5 pointer-events-none" />
        
        <div className="container mx-auto max-w-7xl relative">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">بیش از ۱۰۰+ پروژه آموزشی</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-text-strong mb-4 md:mb-6">
              دوره‌های آموزشی
              <span className="block mt-2 bg-gradient-to-l from-primary to-primary-light bg-clip-text text-transparent">
                هوش مصنوعی
              </span>
            </h1>
            
            <p className="text-base md:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed">
              از مبتدی تا حرفه‌ای، با جدیدترین ابزارها و فناوری‌های AI آشنا شوید
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16">
            <div className="bg-surface/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center hover:shadow-neu-hover transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-cyan-400/30 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-text-strong mb-2">۱۰۰+</div>
              <div className="text-sm text-text-muted">پروژه عملی</div>
            </div>

            <div className="bg-surface/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center hover:shadow-neu-hover transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400/20 to-pink-500/20 border border-purple-400/30 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-text-strong mb-2">۵۰۰۰+</div>
              <div className="text-sm text-text-muted">دانشجوی موفق</div>
            </div>

            <div className="bg-surface/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center hover:shadow-neu-hover transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 border border-amber-400/30 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-amber-400" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-text-strong mb-2">۲۴/۷</div>
              <div className="text-sm text-text-muted">پشتیبانی آنلاین</div>
            </div>
          </div>

          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {allCourses.map((course, index) => (
              <div
                key={course.slug}
                className="animate-scale-in"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <CourseCard {...course} />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
