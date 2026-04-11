import { Helmet } from "@/components/Helmet";
import { motion } from "framer-motion";
import { MessageSquare, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer/Footer";
import { Button } from "@/components/ui/button";
import { SurfaceGlass } from "@/components/ui/surface-glass";

export default function Faq() {
  return (
    <>
      <Helmet>
        <title>سوالات متداول - شریف جی‌پی‌تی</title>
        <meta name="description" content="سوالات متداول محصولات شریف جی‌پی‌تی - هر محصول سوالات مخصوص به خود را دارد" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header
          onSearch={() => {}}
          active="faq"
        />

        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-12 space-y-8">
            {/* Header */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center pt-8 pb-6"
            >
              <h1 className="text-[32px] md:text-[42px] lg:text-[48px] font-extrabold mb-4">
                سوالات متداول
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-[680px] mx-auto mb-8">
                هر محصول سوالات مخصوص به خود را دارد
              </p>
            </motion.section>

            {/* Main Content */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <SurfaceGlass className="p-8 text-center rounded-2xl">
                <MessageSquare className="w-16 h-16 text-primary mx-auto mb-6" />
                <h3 className="text-2xl font-semibold mb-4">سوالات متداول محصول‌محور</h3>
                <p className="text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
                  در شریف جی‌پی‌تی، هر محصول سوالات متداول مخصوص به خود را دارد.
                  برای مشاهده سوالات مربوط به هر محصول، به صفحه جزئیات همان محصول مراجعه کنید.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="text-center p-6 rounded-xl bg-muted/20">
                    <h4 className="font-semibold mb-2">برای هر محصول</h4>
                    <p className="text-sm text-muted-foreground">
                      سوالات مخصوص همان محصول در بخش FAQ صفحه محصول
                    </p>
                  </div>
                  <div className="text-center p-6 rounded-xl bg-muted/20">
                    <h4 className="font-semibold mb-2">مدیریت آسان</h4>
                    <p className="text-sm text-muted-foreground">
                      سوالات در Sanity Studio برای هر محصول جداگانه مدیریت می‌شوند
                    </p>
                  </div>
                </div>

                <Link to="/products">
                  <Button size="lg" className="inline-flex items-center gap-2">
                    مشاهده محصولات
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </SurfaceGlass>
            </motion.section>

            {/* Contact CTA */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <SurfaceGlass className="p-8 text-center max-w-2xl mx-auto">
                <h3 className="text-xl font-bold mb-3">سوال دارید؟</h3>
                <p className="text-white/70 mb-6">
                  اگر سوال شما محصول‌محور نیست، با تیم پشتیبانی ما تماس بگیرید
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button asChild size="lg" className="gap-2 w-full sm:w-auto">
                    <Link to="/support?new=ticket">
                      ثبت تیکت پشتیبانی
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="gap-2 w-full sm:w-auto"
                  >
                    <Link to="/contact">تماس با ما</Link>
                  </Button>
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
