import { Helmet } from "@/components/Helmet";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer/Footer";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FaqAccordion } from "@/components/Products/FaqAccordion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Shield, 
  Zap, 
  Award, 
  Users, 
  Clock, 
  CheckCircle2,
  MessageCircle,
  LifeBuoy,
  RefreshCcw
} from "lucide-react";

const springTransition = {
  type: "spring" as const,
  stiffness: 220,
  damping: 28,
};

export default function About() {
  const navigate = useNavigate();

  // Stats data
  const stats = [
    { label: "سفارش موفق", value: "۱۲,۰۰۰+", icon: CheckCircle2 },
    { label: "درصد موفقیت", value: "۹۸٫۵%", icon: Award },
    { label: "زمان پاسخ", value: "< ۵ دقیقه", icon: Clock },
    { label: "مشتریان فعال", value: "۳,۵۰۰+", icon: Users },
  ];

  // Why Trust Us features
  const trustFeatures = [
    {
      icon: RefreshCcw,
      title: "تعویض حساب تضمینی",
      points: [
        "اگر محصول محدود شد، فوراً جایگزین می‌کنیم",
        "بدون هیچ هزینه اضافی یا سوال اضافه",
        "تا ۳۰ روز پس از خرید معتبر است"
      ]
    },
    {
      icon: MessageCircle,
      title: "پاسخ‌گویی ۲۴/۷",
      points: [
        "پشتیبانی سریع در تمام ساعات شبانه‌روز",
        "میانگین زمان پاسخ کمتر از ۵ دقیقه",
        "تیم متخصص و با تجربه در خدمت شما"
      ]
    },
    {
      icon: Shield,
      title: "امنیت تراکنش",
      points: [
        "پرداخت از طریق درگاه‌های معتبر بانکی",
        "رمزنگاری اطلاعات شخصی شما",
        "عدم ذخیره‌سازی اطلاعات کارت بانکی"
      ]
    },
    {
      icon: Award,
      title: "کیفیت تضمینی",
      points: [
        "حساب‌های اورجینال با اشتراک پریمیوم",
        "بررسی دقیق قبل از تحویل",
        "ضمانت کارکرد صد درصد محصولات"
      ]
    }
  ];

  // Timeline milestones
  const timeline = [
    {
      date: "بهمن ۱۴۰۱",
      title: "شروع از کانال تلگرام",
      description: "با ۵۰ مشتری و تمرکز بر GPT شروع کردیم"
    },
    {
      date: "خرداد ۱۴۰۲",
      title: "راه‌اندازی وب‌سایت",
      description: "پلتفرم آنلاین با بیش از ۵۰۰ سفارش در ماه اول"
    },
    {
      date: "آذر ۱۴۰۲",
      title: "گسترش محصولات",
      description: "افزودن خدمات AI و ابزارهای تولید محتوا"
    },
    {
      date: "فروردین ۱۴۰۳",
      title: "تیم پشتیبانی ۲۴/۷",
      description: "تشکیل تیم متخصص برای خدمات بهتر"
    },
    {
      date: "مرداد ۱۴۰۳",
      title: "بیش از ۱۰,۰۰۰ مشتری",
      description: "رسیدن به جایگاه یکی از بزرگ‌ترین فروشگاه‌ها"
    },
    {
      date: "امروز",
      title: "پیشرو در صنعت AI",
      description: "با بیش از ۱۲,۰۰۰ سفارش موفق و رضایت ۹۸٪"
    }
  ];

  // Team members
  const team = [
    {
      name: "امیر حسین علم طلب",
      role: "Founder و CEO",
      image: "/lovable-uploads/3b6d9ee6-6948-4f24-9a7c-52e030efc06c.png",
      bio: "امیر حسین، دانشجوی دانشگاه شریف، با درک نیاز مبرم کاربران ایرانی به ابزارهای هوش مصنوعی، شریف‌جی‌پی‌تی را با هدف ارائه دسترسی آسان، سریع و مطمئن بنیان‌گذاری کرد.",
      link: "/team/amir",
    },
    {
      name: "عرفان علم طلب",
      role: "co-founder و developer",
      image: "/lovable-uploads/e0b96a27-41d3-4a8a-82a1-6a0a71f6ee7e.png",
      bio: "عرفان، به عنوان مغز فنی تیم، با تکیه بر دانش عمیق خود، زیرساخت‌های قدرتمند و مقیاس‌پذیر شریف‌جی‌پی‌تی را طراحی و پیاده‌سازی کرده است.",
      link: "/team/erfan",
    },
    { name: "Arash", role: "Payments Lead",               avatar: "/static/team/arash.jpg" },
    { name: "Mehdi", role: "Platform / Reservations",     avatar: "/static/team/mehdi.jpg" },
    { name: "Sina",  role: "AI Accounting Engineer",      avatar: "/static/team/sina.jpg" },
    { name: "Shiva", role: "SEO & Marketing",             avatar: "/static/team/shiva.jpg" },
    { name: "Mahan", role: "Referrals & Growth",          avatar: "/static/team/mahan.jpg" },
    { name: "Negin", role: "IELTS & Content Lead",        avatar: "/static/team/negin.jpg" },
  ];

  const aboutFaqs = [
    {
      q: "چه تضمینی برای خرید محصولات وجود دارد؟",
      a: "ما تضمین تعویض حساب ارائه می‌دهیم. اگر محصول خریداری شده مشکلی داشت یا محدود شد، تا ۳۰ روز پس از خرید می‌توانید درخواست تعویض دهید و فوراً حساب جایگزین دریافت کنید."
    },
    {
      q: "پشتیبانی چگونه است؟",
      a: "تیم پشتیبانی ما ۲۴ ساعته و ۷ روز هفته در خدمت شماست. می‌توانید از طریق تلگرام، ایمیل یا فرم تماس با ما در ارتباط باشید. میانگین زمان پاسخ‌گویی ما کمتر از ۵ دقیقه است."
    },
    {
      q: "محصولات شما اصل هستند؟",
      a: "بله، تمامی محصولات ما کاملاً اورجینال و با اشتراک پریمیوم هستند. هر حساب قبل از تحویل توسط تیم کنترل کیفیت بررسی می‌شود تا از عملکرد صحیح آن اطمینان حاصل شود."
    },
    {
      q: "چرا باید از شما خرید کنیم؟",
      a: "با بیش از ۱۲,۰۰۰ سفارش موفق و رضایت ۹۸٪ مشتریان، ما یکی از معتبرترین فروشگاه‌های محصولات دیجیتال در ایران هستیم. تضمین تعویض، پشتیبانی سریع، و قیمت‌های رقابتی از ویژگی‌های ماست."
    }
  ];

  return (
    <>
      <Helmet>
        <title>دربارهٔ ما | شریف‌GPT</title>
        <meta 
          name="description" 
          content="شریف‌GPT، فروشگاه و استودیو هوش مصنوعی با تضمین تعویض حساب و پشتیبانی سریع. بیش از ۱۲,۰۰۰ سفارش موفق و رضایت ۹۸٪ مشتریان."
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "دربارهٔ شریف‌GPT",
            "description": "فروشگاه و استودیو هوش مصنوعی با تضمین تعویض حساب و پشتیبانی سریع",
            "url": "https://sharifgpt.com/about",
            "mainEntity": {
              "@type": "Organization",
              "name": "شریف‌GPT",
              "url": "https://sharifgpt.com",
              "logo": "https://sharifgpt.com/logo.png",
              "foundingDate": "2023",
              "description": "فروشگاه محصولات دیجیتال و خدمات هوش مصنوعی"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen" dir="rtl">
        <Header 
          onSearch={(query) => console.log(query)}
        />

        <main className="mx-auto max-w-[1100px] px-4 md:px-6 lg:px-8 pt-[100px]">
          {/* Hero Section */}
          <section className="relative text-center pt-16 pb-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={springTransition}
              className="text-[28px] md:text-[40px] font-bold bg-gradient-to-r from-[#0A84FF] to-[#FF5AC8] bg-clip-text text-transparent"
            >
              دربارهٔ شریف‌GPT
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springTransition, delay: 0.1 }}
              className="mt-3 text-white/80 max-w-[720px] mx-auto text-[15px] md:text-[16px]"
            >
              فروشگاه و استودیو هوش مصنوعی با تضمین تعویض حساب و پشتیبانی سریع.
            </motion.p>

            {/* Trust Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springTransition, delay: 0.2 }}
              className="mt-4 flex justify-center gap-2 flex-wrap"
            >
              <span className="glass px-3 py-1.5 rounded-full text-[13px] text-white/90">
                🛟 پشتیبانی سریع
              </span>
              <span className="glass px-3 py-1.5 rounded-full text-[13px] text-white/90">
                ♻️ تعویض حساب تضمینی
              </span>
            </motion.div>

            {/* Subtle Aurora */}
            <div 
              className="pointer-events-none absolute inset-x-0 -z-10 top-0 h-[42vh] blur-3xl opacity-70"
              style={{
                background: `
                  radial-gradient(40% 35% at 55% 25%, rgba(40,130,255,.45), transparent 70%),
                  radial-gradient(35% 40% at 65% 60%, rgba(160,90,255,.42), transparent 72%)
                `
              }}
            />
          </section>

          {/* Why Trust Us */}
          <section className="py-12 md:py-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={springTransition}
              className="text-[24px] md:text-[32px] font-bold text-center mb-8 md:mb-10"
            >
              چرا به ما اعتماد کنید؟
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              {trustFeatures.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ ...springTransition, delay: idx * 0.1 }}
                    className="glass rounded-3xl p-6 border border-white/35"
                  >
                    <div className="flex items-start gap-4">
                      <div className="glass rounded-2xl p-3 shrink-0">
                        <Icon className="w-6 h-6 text-[#0A84FF]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-[18px] md:text-[20px] font-semibold text-white mb-3">
                          {feature.title}
                        </h3>
                        <ul className="space-y-2">
                          {feature.points.map((point, pidx) => (
                            <li key={pidx} className="text-[14px] text-white/70 flex items-start gap-2">
                              <span className="text-[#0A84FF] mt-1">•</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Stats Row */}
          <section className="py-12 md:py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ ...springTransition, delay: idx * 0.05 }}
                    className="glass rounded-2xl p-4 text-center border border-white/35"
                  >
                    <Icon className="w-8 h-8 mx-auto mb-2 text-[#0A84FF]" />
                    <div className="text-[24px] md:text-[28px] font-bold text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-[13px] md:text-[14px] text-white/70">
                      {stat.label}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Our Story */}
          <section className="py-12 md:py-16">
            <div className="grid md:grid-cols-12 gap-6 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={springTransition}
                className="md:col-span-6 glass rounded-3xl p-6 border border-white/35"
              >
                <h2 className="text-[20px] md:text-[24px] font-semibold text-white mb-4">
                  داستان ما
                </h2>
                <div className="space-y-4 text-white/80 leading-8 text-[14px] md:text-[15px]">
                  <p>
                    شریف‌GPT در بهمن ۱۴۰۱ با یک کانال تلگرام ساده و تنها ۵۰ مشتری شروع به کار کرد. 
                    هدف ما ساده بود: دسترسی آسان و مقرون به صرفه به ابزارهای هوش مصنوعی برای کاربران ایرانی.
                  </p>
                  <p>
                    امروز، با بیش از ۱۲,۰۰۰ سفارش موفق و رضایت ۹۸٪ مشتریان، به یکی از 
                    معتبرترین فروشگاه‌های محصولات دیجیتال در ایران تبدیل شده‌ایم.
                  </p>
                  <p>
                    تیم ما متشکل از متخصصان با تجربه است که هر روز تلاش می‌کنند تا بهترین 
                    خدمات و پشتیبانی را به شما ارائه دهند. تضمین تعویض حساب و پشتیبانی ۲۴/۷ 
                    ما نتیجه تعهد ما به رضایت کامل شماست.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={springTransition}
                className="md:col-span-6 relative"
              >
                <div className="relative rounded-3xl ring-1 ring-white/15 overflow-hidden">
                  <div 
                    className="w-full h-[280px] md:h-[360px] bg-gradient-to-br from-[#0A84FF]/20 via-[#A05AFF]/20 to-[#FF5AC8]/20"
                    style={{
                      backgroundImage: `
                        radial-gradient(circle at 30% 40%, rgba(10,132,255,0.3), transparent 50%),
                        radial-gradient(circle at 70% 60%, rgba(255,90,200,0.3), transparent 50%)
                      `
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </section>

          {/* Timeline */}
          <section className="py-12 md:py-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={springTransition}
              className="text-[24px] md:text-[32px] font-bold text-center mb-8 md:mb-10"
            >
              سفر ما
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-4 md:gap-6">
              {timeline.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...springTransition, delay: idx * 0.1 }}
                  className="glass rounded-2xl p-5 border border-white/35"
                >
                  <div className="inline-block glass px-3 py-1 rounded-full text-[12px] text-[#0A84FF] font-medium mb-3">
                    {item.date}
                  </div>
                  <h3 className="text-[16px] md:text-[18px] font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[13px] md:text-[14px] text-white/70 leading-6">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Team */}
          <section className="py-12 md:py-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={springTransition}
              className="text-[24px] md:text-[32px] font-bold text-center mb-8 md:mb-10"
            >
              تیم ما
            </motion.h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {team.map((member, idx) => {
                const isClickable = member.name === "Amir" || member.name === "Erfan";
                const linkPath = member.name === "Amir" ? "/team/amir" : member.name === "Erfan" ? "/team/erfan" : "";
                
                const cardContent = (
                  <>
                    <Avatar className="h-14 w-14 ring-1 ring-white/20">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="bg-gradient-to-br from-[#0A84FF] to-[#FF5AC8] text-white font-semibold text-sm">
                        {member.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="text-[15px] md:text-[16px] font-semibold text-white truncate">
                        {member.name}
                      </div>
                      <div className="text-[13px] text-white/70 truncate">
                        {member.role}
                      </div>
                    </div>
                  </>
                );

                return isClickable ? (
                  <Link key={idx} to={linkPath}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ ...springTransition, delay: idx * 0.05 }}
                      whileHover={{ y: -2 }}
                      className="glass rounded-2xl p-4 flex items-center gap-3 border border-white/30 cursor-pointer hover:border-white/50 transition-all"
                    >
                      {cardContent}
                    </motion.div>
                  </Link>
                ) : (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ ...springTransition, delay: idx * 0.05 }}
                    whileHover={{ y: -2 }}
                    className="glass rounded-2xl p-4 flex items-center gap-3 border border-white/30 cursor-default"
                  >
                    {cardContent}
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-12 md:py-16">
            <div className="glass rounded-3xl p-6 md:p-8 border border-white/35">
              <FaqAccordion items={aboutFaqs} />
            </div>
          </section>

          {/* Final CTA */}
          <section className="py-12 md:py-16 pb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={springTransition}
              className="glass rounded-3xl p-8 md:p-10 text-center border border-white/35"
            >
              <h2 className="text-[20px] md:text-[24px] font-semibold text-white mb-4">
                آماده همکاری با ما هستید؟
              </h2>
              <p className="text-white/80 text-[14px] md:text-[15px] mb-6 max-w-[600px] mx-auto">
                تیم پشتیبانی ما آماده پاسخگویی به سوالات شماست. همین حالا با ما در تماس باشید.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate("/support")}
                  className="glass rounded-full border border-white/35"
                >
                  🛟 پشتیبانی سریع
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate("/policies/refund-replacement")}
                  className="glass rounded-full border border-white/35"
                >
                  ♻️ قوانین تعویض حساب
                </Button>
              </div>
            </motion.div>
          </section>
        </main>

        <Footer 
          links={{
            products: "/products",
            magazine: "/blog",
            courses: "/courses",
            pricing: "/pricing",
            support: "/support"
          }}
          socials={[
            { type: "Telegram", href: "https://t.me/sharifgpt" },
            { type: "Instagram", href: "https://instagram.com/sharifgpt" }
          ]}
        />
      </div>
    </>
  );
}
