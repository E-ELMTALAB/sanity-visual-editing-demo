import { Helmet } from "@/components/Helmet";
import { motion } from "framer-motion";
import { Copy, ExternalLink, Clock, ShieldCheck } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer/Footer";
import { Button } from "@/components/ui/button";
import { SurfaceGlass } from "@/components/ui/surface-glass";
import { toast } from "sonner";

// Telegram Icon
const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
  </svg>
);


export default function Contact() {

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} کپی شد`);
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "تماس با ما - SharifGPT",
    description: "پشتیبانی مشتریان شریف‌GPT از طریق تلگرام",
    url: "https://sharifgpt.ai/contact",
  };

  return (
    <>
      <Helmet>
        <title>تماس با ما | SharifGPT</title>
        <meta
          name="description"
          content="پشتیبانی مشتریان شریف‌GPT از طریق تلگرام - پاسخگویی ۲۴ ساعته"
        />
        <link rel="canonical" href="https://sharifgpt.ai/contact" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header
          onSearch={() => {}}
          active="contact"
        />

        <main className="flex-1 pt-[100px]">
          <div className="max-w-[1100px] mx-auto px-4 md:px-6 lg:px-8 py-12 space-y-8">
            {/* Hero Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center pt-8 pb-6"
            >
              <h1 className="text-[32px] md:text-[42px] lg:text-[48px] font-extrabold mb-4 bg-gradient-to-r from-[#0A84FF] to-[#FF5AC8] bg-clip-text text-transparent">
                تماس با ما
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-[680px] mx-auto">
                پشتیبانی مشتریان شریف‌GPT از طریق تلگرام
              </p>
            </motion.section>

            {/* Customer Support */}
            <section className="max-w-md mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass rounded-2xl p-8 border border-white/30 text-center"
              >
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                    <TelegramIcon />
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-3">پشتیبانی مشتریان</h3>
                <p className="text-white/80 mb-6 leading-relaxed">
                  تنها راه ارتباط با تیم پشتیبانی شریف‌GPT از طریق تلگرام می‌باشد.
                  سریع‌ترین پاسخ را دریافت خواهید کرد.
                </p>

                <div className="space-y-4">
                  <div className="glass border border-white/20 rounded-lg p-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-sm font-medium text-white/90">آیدی تلگرام:</span>
                      <code className="text-blue-400 font-mono text-sm bg-blue-500/10 px-2 py-1 rounded">
                        @sharifgptadmin
                      </code>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => copyToClipboard("@sharifgptadmin", "آیدی تلگرام")}
                    >
                      <Copy className="w-4 h-4 ml-2" />
                      کپی کردن
                    </Button>
                    <Button
                      asChild
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    >
                      <a
                        href="https://t.me/sharifgptadmin"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4 ml-2" />
                        باز کردن تلگرام
                      </a>
                    </Button>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/20">
                  <p className="text-xs text-white/60 flex items-center justify-center gap-2">
                    <Clock className="w-3 h-3" />
                    پاسخگویی ۲۴ ساعته
                  </p>
                </div>
              </motion.div>
            </section>


            {/* Info Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <SurfaceGlass className="p-6 md:p-8">
                <div className="text-center">
                  <h3 className="text-lg font-bold mb-4">چرا تلگرام؟</h3>
                  <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    <div className="glass border border-white/20 rounded-lg p-4">
                      <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                      <p className="font-semibold text-sm mb-1">پاسخگویی سریع</p>
                      <p className="text-xs text-white/70">میانگین زمان پاسخ کمتر از ۱۰ دقیقه</p>
                    </div>
                    <div className="glass border border-white/20 rounded-lg p-4">
                      <ShieldCheck className="w-6 h-6 text-green-500 mx-auto mb-2" />
                      <p className="font-semibold text-sm mb-1">پشتیبانی اختصاصی</p>
                      <p className="text-xs text-white/70">تیم متخصص برای حل مشکلات شما</p>
                    </div>
                  </div>
                </div>
              </SurfaceGlass>
            </motion.section>
          </div>
        </main>

        <Footer
          links={{
            products: "/products",
            magazine: "/blog",
            courses: "/products?category=courses",
            pricing: "/products",
            support: "/support",
          }}
          socials={[
            { type: "Telegram", href: "https://t.me/SharifGPT" },
            { type: "Instagram", href: "https://instagram.com/sharifgpt" },
          ]}
        />
      </div>
    </>
  );
}
