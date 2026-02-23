import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "@/components/Helmet";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MessageSquare,
  CreditCard,
  Package,
  Settings,
  HelpCircle,
  ExternalLink,
  Send,
  Upload,
  X,
  Clock,
  Mail,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SurfaceGlass } from "@/components/ui/surface-glass";
import { FaqAccordion } from "@/components/Products/FaqAccordion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { z } from "zod";

// Telegram Icon
const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
  </svg>
);

const categories = [
  {
    id: "general",
    title: "عمومی",
    icon: HelpCircle,
    color: "from-blue-500 to-cyan-500",
    count: 12,
  },
  {
    id: "payment",
    title: "پرداخت",
    icon: CreditCard,
    color: "from-green-500 to-emerald-500",
    count: 8,
  },
  {
    id: "products",
    title: "محصولات",
    icon: Package,
    color: "from-purple-500 to-pink-500",
    count: 15,
  },
  {
    id: "technical",
    title: "فنی",
    icon: Settings,
    color: "from-orange-500 to-red-500",
    count: 10,
  },
  {
    id: "services",
    title: "خدمات",
    icon: MessageSquare,
    color: "from-violet-500 to-purple-500",
    count: 6,
  },
];

// Mock articles (would come from Sanity in production)
const mockArticles = [
  {
    title: "نحوه خرید و پرداخت آنلاین",
    slug: "how-to-purchase",
    excerpt: "راهنمای کامل خرید محصولات و پرداخت آنلاین در پلتفرم",
    category: "payment",
  },
  {
    title: "دسترسی به محصولات خریداری شده",
    slug: "access-purchased-products",
    excerpt: "چگونه به دوره‌ها و محصولات خریداری شده دسترسی پیدا کنیم",
    category: "products",
  },
  {
    title: "تعویض حساب و بازگشت وجه",
    slug: "refund-policy",
    excerpt: "شرایط و نحوه درخواست بازگشت وجه و تعویض محصول",
    category: "payment",
  },
  {
    title: "رفع مشکلات ورود به سیستم",
    slug: "login-issues",
    excerpt: "راهکارهای حل مشکلات ورود و فراموشی رمز عبور",
    category: "technical",
  },
  {
    title: "استفاده از کد تخفیف",
    slug: "discount-codes",
    excerpt: "نحوه اعمال کد تخفیف در هنگام خرید",
    category: "payment",
  },
  {
    title: "پشتیبانی و ارتباط با تیم",
    slug: "contact-support",
    excerpt: "راه‌های ارتباطی با تیم پشتیبانی و ساعات کاری",
    category: "services",
  },
];

const ticketSchema = z.object({
  name: z.string().min(3, { message: "نام باید حداقل ۳ کاراکتر باشد" }),
  email: z.string().email({ message: "ایمیل معتبر وارد کنید" }),
  orderId: z.string().optional(),
  subject: z.string().min(5, { message: "موضوع باید حداقل ۵ کاراکتر باشد" }),
  message: z.string().min(20, { message: "پیام باید حداقل ۲۰ کاراکتر باشد" }),
});

export default function Support() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isTicketDrawerOpen, setIsTicketDrawerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const [ticketData, setTicketData] = useState({
    name: "",
    email: "",
    orderId: "",
    subject: "",
    message: "",
  });

  // Filter articles based on search and category
  const filteredArticles = useMemo(() => {
    let filtered = mockArticles;

    if (selectedCategory) {
      filtered = filtered.filter((article) => article.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.excerpt.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("حجم فایل نباید بیشتر از ۱۰ مگابایت باشد");
        return;
      }
      setUploadedFile(file);
      toast.success("فایل آپلود شد");
    }
  };

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      ticketSchema.parse(ticketData);

      setIsSubmitting(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const ticketId = Math.random().toString(36).substring(7).toUpperCase();

      toast.success(
        <div>
          <p className="font-bold">تیکت با موفقیت ثبت شد</p>
          <p className="text-sm">شماره پیگیری: #{ticketId}</p>
        </div>
      );

      // Reset form
      setTicketData({
        name: "",
        email: "",
        orderId: "",
        subject: "",
        message: "",
      });
      setUploadedFile(null);
      setIsTicketDrawerOpen(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const popularFaqs = [
    {
      q: "چگونه محصول خریداری شده را دانلود کنم؟",
      a: "پس از خرید، لینک دانلود به ایمیل شما ارسال می‌شود. همچنین می‌توانید از بخش 'حساب کاربری' در منوی بالا، به صفحه سفارش‌های خود مراجعه کنید.",
    },
    {
      q: "آیا امکان پرداخت اقساطی وجود دارد؟",
      a: "بله، برای خریدهای بالای ۱ میلیون تومان، امکان پرداخت در ۳ قسط فراهم است. این گزینه در صفحه پرداخت نمایش داده می‌شود.",
    },
    {
      q: "مدت زمان پشتیبانی چقدر است؟",
      a: "تمامی محصولات دارای پشتیبانی ۶ ماهه رایگان هستند. پس از این مدت، می‌توانید پشتیبانی را تمدید کنید.",
    },
    {
      q: "آیا می‌توانم محصول را در چند دستگاه استفاده کنم؟",
      a: "بله، می‌توانید با یک حساب کاربری در حداکثر ۳ دستگاه همزمان استفاده کنید.",
    },
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: popularFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <>
      <Helmet>
        <title>مرکز پشتیبانی و راهنما - SharifGPT</title>
        <meta
          name="description"
          content="مرکز پشتیبانی SharifGPT - پاسخ به سوالات متداول، راهنماها و ارتباط با تیم پشتیبانی"
        />
        <link rel="canonical" href="https://sharifgpt.ai/support" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header
          onSearch={() => {}}
          active="support"
        />

        <main className="flex-1 py-16 pt-[100px]">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8">
            {/* Hero Section with Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
                چطور می‌تونیم کمکت کنیم؟
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-[700px] mx-auto">
                سوالت رو جستجو کن یا از دسته‌بندی‌های زیر انتخاب کن
              </p>

              {/* Search Input */}
              <div className="max-w-[600px] mx-auto mb-8">
                <div className="relative">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="سوالت چیه؟"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="glass border-white/20 h-14 pr-12 text-lg"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button
                  onClick={() => setIsTicketDrawerOpen(true)}
                  size="lg"
                  className="gap-2"
                >
                  <Send className="w-5 h-5" />
                  ارسال تیکت پشتیبانی
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2">
                  <Link to="/policies/refund-replacement">
                    <ShieldCheck className="w-5 h-5" />
                    تعویض حساب تضمینی
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Category Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
              {categories.map((category) => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.id;

                return (
                  <motion.button
                    key={category.id}
                    onClick={() =>
                      setSelectedCategory(isSelected ? null : category.id)
                    }
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "glass border rounded-xl p-6 text-center transition-all",
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-white/20 hover:border-white/40"
                    )}
                  >
                    <div
                      className={cn(
                        "w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center bg-gradient-to-br",
                        category.color
                      )}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-bold text-lg mb-1">{category.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {category.count} مقاله
                    </p>
                  </motion.button>
                );
              })}
            </div>

            {/* Articles List */}
            {(searchQuery || selectedCategory) && (
              <SurfaceGlass className="p-6 mb-12">
                <h2 className="text-2xl font-bold mb-6">
                  {selectedCategory
                    ? `مقالات ${
                        categories.find((c) => c.id === selectedCategory)?.title
                      }`
                    : "نتایج جستجو"}
                </h2>

                {filteredArticles.length > 0 ? (
                  <div className="space-y-3">
                    {filteredArticles.map((article) => (
                      <Link
                        key={article.slug}
                        to={`/support/${article.slug}`}
                        className="glass border border-white/10 rounded-xl p-5 flex items-start gap-4 hover:border-primary/40 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/30 transition-colors">
                          <ExternalLink className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 text-right">
                          <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                            {article.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {article.excerpt}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      نتیجه‌ای یافت نشد. سوال خود را در تیکت پشتیبانی مطرح کنید.
                    </p>
                  </div>
                )}
              </SurfaceGlass>
            )}

            {/* FAQ Section */}
            <div className="mb-12">
              <FaqAccordion items={popularFaqs} />
            </div>

            {/* Contact Section */}
            <SurfaceGlass className="p-8">
              <h2 className="text-3xl font-bold mb-6 text-center">
                راه‌های ارتباطی
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Telegram */}
                <a
                  href="https://t.me/sharifgpt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass border border-white/20 rounded-xl p-6 flex items-center gap-4 hover:border-primary/40 transition-all group"
                >
                  <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                    <TelegramIcon />
                  </div>
                  <div className="flex-1 text-right">
                    <h3 className="font-bold text-lg mb-1">تلگرام</h3>
                    <p className="text-sm text-muted-foreground">
                      پشتیبانی سریع در تلگرام
                    </p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-muted-foreground" />
                </a>

                {/* Email */}
                <a
                  href="mailto:support@sharifgpt.ai"
                  className="glass border border-white/20 rounded-xl p-6 flex items-center gap-4 hover:border-primary/40 transition-all group"
                >
                  <div className="w-14 h-14 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                    <Mail className="w-7 h-7 text-purple-500" />
                  </div>
                  <div className="flex-1 text-right">
                    <h3 className="font-bold text-lg mb-1">ایمیل</h3>
                    <p className="text-sm text-muted-foreground">
                      support@sharifgpt.ai
                    </p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-muted-foreground" />
                </a>
              </div>

              {/* Hours & Guarantee */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-6 border-t border-white/10">
                <div className="glass border border-white/20 rounded-full px-6 py-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="font-semibold">
                    شنبه تا پنجشنبه | ۹ صبح - ۶ عصر
                  </span>
                </div>
                <div className="glass border border-white/20 rounded-full px-6 py-3 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                  <span className="font-semibold">تعویض حساب تضمینی</span>
                </div>
              </div>
            </SurfaceGlass>
          </div>
        </main>

        <Footer
          links={{
            products: "/products",
            magazine: "/blog",
            courses: "/courses",
            pricing: "/pricing",
            support: "/support",
          }}
          socials={[]}
        />

        {/* Ticket Drawer */}
        <AnimatePresence>
          {isTicketDrawerOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsTicketDrawerOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              />

              {/* Drawer */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed top-0 left-0 h-full w-full sm:w-[500px] glass-strong border-r border-white/20 z-50 overflow-y-auto"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">ثبت تیکت پشتیبانی</h2>
                    <button
                      onClick={() => setIsTicketDrawerOpen(false)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleTicketSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="ticket-name">نام و نام خانوادگی *</Label>
                      <Input
                        id="ticket-name"
                        type="text"
                        value={ticketData.name}
                        onChange={(e) =>
                          setTicketData({ ...ticketData, name: e.target.value })
                        }
                        className="glass border-white/20"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ticket-email">ایمیل *</Label>
                      <Input
                        id="ticket-email"
                        type="email"
                        value={ticketData.email}
                        onChange={(e) =>
                          setTicketData({ ...ticketData, email: e.target.value })
                        }
                        className="glass border-white/20"
                        required
                        dir="ltr"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ticket-order">شماره سفارش (اختیاری)</Label>
                      <Input
                        id="ticket-order"
                        type="text"
                        value={ticketData.orderId}
                        onChange={(e) =>
                          setTicketData({ ...ticketData, orderId: e.target.value })
                        }
                        className="glass border-white/20"
                        placeholder="مثال: ABC123"
                        dir="ltr"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ticket-subject">موضوع *</Label>
                      <Input
                        id="ticket-subject"
                        type="text"
                        value={ticketData.subject}
                        onChange={(e) =>
                          setTicketData({ ...ticketData, subject: e.target.value })
                        }
                        className="glass border-white/20"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ticket-message">پیام *</Label>
                      <Textarea
                        id="ticket-message"
                        value={ticketData.message}
                        onChange={(e) =>
                          setTicketData({ ...ticketData, message: e.target.value })
                        }
                        className="glass border-white/20 min-h-[150px]"
                        required
                      />
                    </div>

                    {/* File Upload */}
                    <div className="space-y-2">
                      <Label htmlFor="ticket-file">پیوست فایل (اختیاری)</Label>
                      <div className="glass border border-white/20 rounded-lg p-4">
                        <input
                          id="ticket-file"
                          type="file"
                          onChange={handleFileUpload}
                          className="hidden"
                          accept="image/*,.pdf,.doc,.docx"
                        />
                        <label
                          htmlFor="ticket-file"
                          className="flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Upload className="w-5 h-5" />
                          <span className="text-sm">
                            {uploadedFile ? uploadedFile.name : "انتخاب فایل"}
                          </span>
                        </label>
                        {uploadedFile && (
                          <button
                            type="button"
                            onClick={() => setUploadedFile(null)}
                            className="mt-2 text-xs text-destructive hover:underline"
                          >
                            حذف فایل
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        حداکثر حجم: ۱۰ مگابایت
                      </p>
                    </div>

                    {/* SLA Note */}
                    <div className="glass border border-blue-500/20 bg-blue-500/5 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold mb-1">
                            زمان پاسخگویی
                          </p>
                          <p className="text-xs text-muted-foreground">
                            تیم پشتیبانی ما ظرف ۲۴ ساعت کاری به تیکت شما پاسخ
                            خواهد داد
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "در حال ارسال..." : "ارسال تیکت"}
                    </Button>
                  </form>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
