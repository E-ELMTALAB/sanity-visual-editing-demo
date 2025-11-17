import { useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldCheck,
  Zap,
  User,
  ShoppingBag,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer/Footer";
import { Button } from "@/components/ui/button";
import { SurfaceGlass } from "@/components/ui/surface-glass";
import { Price } from "@/components/ui/price";
import { toast } from "sonner";

const mockOrderItems = [
  {
    id: "1",
    title: "دوره جامع React و TypeScript",
    price: 2500000,
    quantity: 1,
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&h=200&fit=crop",
    hasLicense: true,
    licenseKey: "REACT-TS-2024-ABC123XYZ",
    productUrl: "/product/react-typescript-course",
  },
  {
    id: "2",
    title: "پکیج آموزشی طراحی UI/UX",
    price: 1800000,
    quantity: 1,
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200&h=200&fit=crop",
    hasLicense: true,
    licenseKey: "UIUX-DESIGN-2024-DEF456ABC",
    productUrl: "/product/ui-ux-design-package",
  },
];

export default function OrderConfirmation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("oid");

  useEffect(() => {
    if (!orderId) {
      navigate("/");
    }
  }, [orderId, navigate]);

  const subtotal = mockOrderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = 300000;
  const total = subtotal - discount;

  const orderDate = new Date();
  const orderTime = orderDate.toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const orderDateStr = orderDate.toLocaleDateString("fa-IR");

  const copyLicense = (license: string) => {
    navigator.clipboard.writeText(license);
    toast.success("لایسنس کپی شد");
  };

  return (
    <>
      <Helmet>
        <title>تایید سفارش - SharifGPT</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header
          onSearch={() => {}}
          active="confirmation"
        />

        <main className="flex-1 py-16">
          <div className="max-w-[900px] mx-auto px-4 md:px-6 lg:px-8">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-24 h-24 rounded-full glass border-2 border-white/20 mb-6"
              >
                <CheckCircle2 className="w-14 h-14 text-green-500" />
              </motion.div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">
                سفارش شما ثبت شد
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                از خرید شما متشکریم. جزئیات سفارش به ایمیل شما ارسال شد
              </p>

              {/* Order Info Grid */}
              <SurfaceGlass className="p-6 mb-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-right">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      شماره سفارش
                    </p>
                    <p className="font-bold" dir="ltr">
                      #{orderId}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">تاریخ</p>
                    <p className="font-bold">{orderDateStr}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">ساعت</p>
                    <p className="font-bold">{orderTime}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      کد پیگیری
                    </p>
                    <p className="font-bold text-sm" dir="ltr">
                      PAY-{orderId?.slice(0, 6)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-sm text-muted-foreground mb-2">
                    ایمیل تایید ارسال شد به:
                  </p>
                  <p className="font-semibold" dir="ltr">
                    user@example.com
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 gap-2"
                  asChild
                >
                  <a href="/support">
                    <Zap className="w-4 h-4" />
                    پشتیبانی سریع
                  </a>
                </Button>
              </SurfaceGlass>
            </motion.div>

            <div className="space-y-6">
              {/* A) Order Items Section */}
              <SurfaceGlass className="p-6">
                <h2 className="text-2xl font-bold mb-6">محصولات خریداری شده</h2>
                <div className="space-y-4">
                  {mockOrderItems.map((item) => (
                    <div
                      key={item.id}
                      className="glass border border-white/20 rounded-xl p-4"
                    >
                      <div className="flex gap-4">
                        {/* Thumbnail */}
                        <div className="shrink-0">
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-20 h-20 rounded-lg object-cover ring-1 ring-white/12"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-2">
                            {item.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <span>تعداد: {item.quantity}</span>
                            <Price current={item.price} className="text-sm" />
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2"
                              asChild
                            >
                              <Link to={item.productUrl}>
                                <ExternalLink className="w-4 h-4" />
                                مشاهده محصول
                              </Link>
                            </Button>

                            {item.hasLicense && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={() => copyLicense(item.licenseKey)}
                              >
                                <Copy className="w-4 h-4" />
                                کپی لایسنس
                              </Button>
                            )}
                          </div>

                          {/* License Display */}
                          {item.hasLicense && (
                            <div className="mt-3 p-3 glass rounded-lg">
                              <p className="text-xs text-muted-foreground mb-1">
                                کلید لایسنس:
                              </p>
                              <code className="text-sm font-mono">
                                {item.licenseKey}
                              </code>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </SurfaceGlass>

              {/* B) Payment Summary Section */}
              <SurfaceGlass className="p-6">
                <h2 className="text-2xl font-bold mb-6">خلاصه پرداخت</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-muted-foreground">جمع کل</span>
                    <Price current={subtotal} className="text-base" />
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between items-center text-lg">
                      <span className="text-muted-foreground">تخفیف</span>
                      <span className="text-green-500 font-bold">
                        -{new Intl.NumberFormat("fa-IR").format(discount)}{" "}
                        تومان
                      </span>
                    </div>
                  )}

                  <div className="pt-4 border-t border-white/10">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xl font-bold">مبلغ پرداخت شده</span>
                      <Price current={total} />
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/10">
                    <p className="text-sm text-muted-foreground">
                      روش پرداخت: کارت بانکی
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      وضعیت: پرداخت موفق ✓
                    </p>
                  </div>
                </div>
              </SurfaceGlass>

              {/* C) Post-Purchase Notes Section */}
              <SurfaceGlass className="p-6">
                <h2 className="text-2xl font-bold mb-6">نکات پس از خرید</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Support Badge */}
                  <div className="glass border border-white/20 rounded-xl p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <Zap className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">پشتیبانی سریع</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        تیم پشتیبانی ما ۲۴/۷ آماده پاسخگویی به سوالات شماست
                      </p>
                      <Button variant="link" className="p-0 h-auto" asChild>
                        <a href="/support">تماس با پشتیبانی →</a>
                      </Button>
                    </div>
                  </div>

                  {/* Guarantee Badge */}
                  <div className="glass border border-white/20 rounded-xl p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">
                        تعویض حساب تضمینی
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        تا ۷ روز فرصت دارید محصول را ارزیابی کرده و در صورت عدم
                        رضایت بازگشت وجه بگیرید
                      </p>
                      <Button variant="link" className="p-0 h-auto" asChild>
                        <a href="/refund-policy">اطلاعات بیشتر →</a>
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 glass rounded-lg border border-blue-500/20 bg-blue-500/5">
                  <p className="text-sm text-muted-foreground">
                    💡 <strong>نکته:</strong> لینک دانلود محصولات و اطلاعات
                    دسترسی به حساب کاربری شما در ایمیل ارسال شده است. در صورت
                    عدم دریافت، پوشه اسپم را بررسی کنید.
                  </p>
                </div>
              </SurfaceGlass>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="flex-1 gap-2">
                  <Link to="/account">
                    <User className="w-4 h-4" />
                    رفتن به حساب کاربری
                  </Link>
                </Button>
                <Button asChild variant="outline" className="flex-1 gap-2">
                  <Link to="/products">
                    <ShoppingBag className="w-4 h-4" />
                    ادامه خرید
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </main>

        <Footer
          links={{
            products: "/products",
            magazine: "/magazine",
            courses: "/courses",
            pricing: "/pricing",
            support: "/support",
          }}
          socials={[]}
        />
      </div>
    </>
  );
}
