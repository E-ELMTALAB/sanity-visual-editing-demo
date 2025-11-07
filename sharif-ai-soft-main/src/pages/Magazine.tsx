import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowLeft, TrendingUp, Sparkles } from "lucide-react";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
}

const categories = ["همه مقالات", "هوش مصنوعی", "فرانت‌اند", "بک‌اند", "کدنویسی", "کسب‌وکار"];

const articles: Article[] = [
  {
    id: "1",
    title: "آینده هوش مصنوعی در توسعه نرم‌افزار: چه چیزی در انتظار ماست؟",
    excerpt: "هوش مصنوعی به سرعت در حال تغییر شکل صنعت توسعه نرم‌افزار است. در این مقاله به بررسی روندها و پیش‌بینی‌های آینده این حوزه می‌پردازیم.",
    category: "هوش مصنوعی",
    author: "دکتر امیر محمدی",
    date: "۱۵ اسفند ۱۴۰۳",
    readTime: "۱۰ دقیقه",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
    featured: true
  },
  {
    id: "2",
    title: "راهنمای جامع یادگیری React در سال ۲۰۲۵",
    excerpt: "همه چیز از مقدماتی تا پیشرفته React را در این مقاله یاد بگیرید. بهترین منابع و مسیر یادگیری برای شروع.",
    category: "فرانت‌اند",
    author: "سارا احمدی",
    date: "۱۲ اسفند ۱۴۰۳",
    readTime: "۸ دقیقه",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "3",
    title: "معماری Microservices: مزایا و معایب",
    excerpt: "آیا معماری میکروسرویس‌ها برای پروژه شما مناسب است؟ در این مقاله به بررسی کامل این موضوع می‌پردازیم.",
    category: "بک‌اند",
    author: "محمد رضایی",
    date: "۱۰ اسفند ۱۴۰۳",
    readTime: "۱۲ دقیقه",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "4",
    title: "۱۰ اشتباه رایج در کدنویسی که باید از آن‌ها اجتناب کنید",
    excerpt: "بررسی اشتباهات رایجی که برنامه‌نویسان مبتدی و حتی حرفه‌ای مرتکب می‌شوند و راهکارهای جلوگیری از آن‌ها.",
    category: "کدنویسی",
    author: "علی کریمی",
    date: "۸ اسفند ۱۴۰۳",
    readTime: "۶ دقیقه",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "5",
    title: "چگونه یک استارتاپ تکنولوژی موفق راه‌اندازی کنیم؟",
    excerpt: "از ایده تا اجرا: راهنمای گام‌به‌گام برای راه‌اندازی یک استارتاپ تکنولوژی موفق در ایران.",
    category: "کسب‌وکار",
    author: "رضا نوری",
    date: "۵ اسفند ۱۴۰۳",
    readTime: "۱۵ دقیقه",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "6",
    title: "TypeScript vs JavaScript: کدام یک را انتخاب کنیم؟",
    excerpt: "مقایسه جامع TypeScript و JavaScript و راهنمای انتخاب بهترین گزینه برای پروژه شما.",
    category: "فرانت‌اند",
    author: "نیلوفر حسینی",
    date: "۳ اسفند ۱۴۰۳",
    readTime: "۷ دقیقه",
    image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=800&q=80"
  }
];

const Magazine = () => {
  const [selectedCategory, setSelectedCategory] = useState("همه مقالات");

  const filteredArticles = selectedCategory === "همه مقالات" 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  const featuredArticle = articles.find(article => article.featured);
  const regularArticles = filteredArticles.filter(article => !article.featured);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 pt-32 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.15),transparent_50%)]" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">مجله آموزشی</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              <span className="bg-gradient-to-l from-primary via-primary-light to-accent bg-clip-text text-transparent">
                مجله یادگیری
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto animate-fade-in">
              آخرین مقالات و راهنماهای جامع در حوزه توسعه نرم‌افزار، هوش مصنوعی و تکنولوژی
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="sticky top-20 z-40 bg-background/80 backdrop-blur-lg border-b border-border py-4">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap transition-all ${
                  selectedCategory === category 
                    ? "shadow-lg shadow-primary/25" 
                    : "hover:border-primary/50"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featuredArticle && selectedCategory === "همه مقالات" && (
        <section className="container mx-auto px-6 py-16">
          <div className="flex items-center gap-2 mb-8">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-bold text-text-strong">مقاله ویژه</h2>
          </div>
          
          <div className="group relative rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative h-64 md:h-full overflow-hidden">
                <img 
                  src={featuredArticle.image} 
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent md:bg-gradient-to-l" />
                <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                  {featuredArticle.category}
                </Badge>
              </div>
              
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h3 className="text-3xl md:text-4xl font-bold mb-4 text-text-strong group-hover:text-primary transition-colors">
                  {featuredArticle.title}
                </h3>
                
                <p className="text-text-muted text-lg mb-6 line-clamp-3">
                  {featuredArticle.excerpt}
                </p>
                
                <div className="flex items-center gap-6 text-sm text-text-muted mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{featuredArticle.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{featuredArticle.readTime}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-text font-medium">{featuredArticle.author}</span>
                  <Button className="group/btn">
                    مطالعه مقاله
                    <ArrowLeft className="w-4 h-4 group-hover/btn:-translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Articles Grid */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-text-strong mb-8">
          {selectedCategory === "همه مقالات" ? "آخرین مقالات" : selectedCategory}
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularArticles.map((article, index) => (
            <article 
              key={article.id}
              className="group rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <Badge className="absolute top-4 right-4 bg-primary/90 text-primary-foreground backdrop-blur-sm">
                  {article.category}
                </Badge>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-text-strong group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </h3>
                
                <p className="text-text-muted mb-4 line-clamp-3 leading-relaxed">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-text-muted mb-4 pb-4 border-b border-border">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{article.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{article.readTime}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text font-medium">{article.author}</span>
                  <Button variant="ghost" size="sm" className="group/btn">
                    ادامه مطلب
                    <ArrowLeft className="w-4 h-4 group-hover/btn:-translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-primary-light to-accent p-12 md:p-16 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              عضو خبرنامه ما شوید
            </h2>
            <p className="text-white/90 text-lg mb-8">
              آخرین مقالات و نکات آموزشی را مستقیماً در ایمیل خود دریافت کنید
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="ایمیل خود را وارد کنید"
                className="px-6 py-3 rounded-lg bg-white/90 backdrop-blur text-text-strong placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-white/50 flex-1 max-w-md"
              />
              <Button size="lg" variant="secondary" className="whitespace-nowrap">
                عضویت در خبرنامه
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Magazine;