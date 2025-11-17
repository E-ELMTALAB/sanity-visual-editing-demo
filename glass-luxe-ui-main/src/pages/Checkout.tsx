import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ShieldCheck, CreditCard, Wallet } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer/Footer";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { SurfaceGlass } from "@/components/ui/surface-glass";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { z } from "zod";

const contactSchema = z.object({
  email: z.string().email({ message: "ایمیل معتبر وارد کنید" }),
  fullName: z.string().min(3, { message: "نام کامل باید حداقل ۳ کاراکتر باشد" }),
  phone: z.string().regex(/^09\d{9}$/, { message: "شماره موبایل معتبر وارد کنید" }),
  needsInvoice: z.boolean(),
});

const paymentSchema = z.object({
  paymentMethod: z.union([z.literal("card"), z.literal("zarinpal")]),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvv: z.string().optional(),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "باید قوانین را بپذیرید",
  }),
});

const mockCartItems = [
  { id: "1", title: "دوره جامع React و TypeScript", price: 2500000, quantity: 1 },
  { id: "2", title: "پکیج آموزشی طراحی UI/UX", price: 1800000, quantity: 1 },
];

export default function Checkout() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showItems, setShowItems] = useState(true);
  const [discountCode, setDiscountCode] = useState("");
  
  const [contactData, setContactData] = useState({
    email: "",
    fullName: "",
    phone: "",
    needsInvoice: false,
  });
  
  const [paymentData, setPaymentData] = useState<{
    paymentMethod: "card" | "zarinpal";
    cardNumber: string;
    cardExpiry: string;
    cardCvv: string;
    termsAccepted: boolean;
  }>({
    paymentMethod: "card",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    termsAccepted: false,
  });

  const subtotal = mockCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = 0;
  const total = subtotal - discount;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      contactSchema.parse(contactData);
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      }
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validData = {
        ...paymentData,
        ...(paymentData.paymentMethod === "card" && {
          cardNumber: paymentData.cardNumber,
          cardExpiry: paymentData.cardExpiry,
          cardCvv: paymentData.cardCvv,
        }),
      };
      
      paymentSchema.parse(validData);
      
      setIsLoading(true);
      
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const orderId = Math.random().toString(36).substring(7).toUpperCase();
      toast.success("پرداخت با موفقیت انجام شد");
      navigate(`/order/confirmation?oid=${orderId}`);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      }
      setIsLoading(false);
    }
  };

  const applyDiscount = () => {
    if (!discountCode.trim()) {
      toast.error("کد تخفیف را وارد کنید");
      return;
    }
    toast.error("کد تخفیف نامعتبر است");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        onSearch={() => {}}
        active="checkout"
      />

      <main className="flex-1 py-10">
        <div className="max-w-[1100px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_360px] gap-6">
            {/* Left Column - Checkout Steps */}
            <div className="space-y-6">
              {/* Step 1 - Contact Information */}
              <SurfaceGlass className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                      step >= 1
                        ? "bg-primary text-primary-foreground"
                        : "glass border border-white/20 text-muted-foreground"
                    )}
                  >
                    1
                  </div>
                  <h2 className="text-2xl font-bold">اطلاعات تماس</h2>
                </div>

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">ایمیل</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@email.com"
                      value={contactData.email}
                      onChange={(e) =>
                        setContactData({ ...contactData, email: e.target.value })
                      }
                      disabled={step !== 1}
                      className="glass border-white/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fullName">نام و نام خانوادگی</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="نام کامل خود را وارد کنید"
                      value={contactData.fullName}
                      onChange={(e) =>
                        setContactData({ ...contactData, fullName: e.target.value })
                      }
                      disabled={step !== 1}
                      className="glass border-white/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">شماره موبایل</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="09123456789"
                      value={contactData.phone}
                      onChange={(e) =>
                        setContactData({ ...contactData, phone: e.target.value })
                      }
                      disabled={step !== 1}
                      className="glass border-white/20"
                      dir="ltr"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="invoice"
                      checked={contactData.needsInvoice}
                      onCheckedChange={(checked) =>
                        setContactData({ ...contactData, needsInvoice: checked as boolean })
                      }
                      disabled={step !== 1}
                    />
                    <Label htmlFor="invoice" className="cursor-pointer">
                      نیاز به فاکتور رسمی دارم
                    </Label>
                  </div>

                  {step === 1 && (
                    <Button type="submit" className="w-full mt-6">
                      ادامه
                    </Button>
                  )}

                  {step > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full mt-6"
                      onClick={() => setStep(1)}
                    >
                      ویرایش اطلاعات
                    </Button>
                  )}
                </form>
              </SurfaceGlass>

              {/* Step 2 - Payment */}
              <AnimatePresence>
                {step >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <SurfaceGlass className="p-6 md:p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-primary text-primary-foreground">
                          2
                        </div>
                        <h2 className="text-2xl font-bold">پرداخت</h2>
                      </div>

                      <form onSubmit={handlePaymentSubmit} className="space-y-6">
                        {/* Payment Method Tabs */}
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              setPaymentData({ ...paymentData, paymentMethod: "card" })
                            }
                            className={cn(
                              "flex-1 glass border rounded-lg p-4 flex items-center justify-center gap-2 transition-all",
                              paymentData.paymentMethod === "card"
                                ? "border-primary bg-primary/10"
                                : "border-white/20 hover:border-white/40"
                            )}
                          >
                            <CreditCard className="w-5 h-5" />
                            <span className="font-semibold">کارت بانکی</span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setPaymentData({ ...paymentData, paymentMethod: "zarinpal" })
                            }
                            className={cn(
                              "flex-1 glass border rounded-lg p-4 flex items-center justify-center gap-2 transition-all",
                              paymentData.paymentMethod === "zarinpal"
                                ? "border-primary bg-primary/10"
                                : "border-white/20 hover:border-white/40"
                            )}
                          >
                            <Wallet className="w-5 h-5" />
                            <span className="font-semibold">زرین‌پال</span>
                          </button>
                        </div>

                        {/* Card Fields */}
                        {paymentData.paymentMethod === "card" && (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="cardNumber">شماره کارت</Label>
                              <Input
                                id="cardNumber"
                                type="text"
                                placeholder="0000 0000 0000 0000"
                                value={paymentData.cardNumber}
                                onChange={(e) =>
                                  setPaymentData({
                                    ...paymentData,
                                    cardNumber: e.target.value,
                                  })
                                }
                                className="glass border-white/20"
                                dir="ltr"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="cardExpiry">تاریخ انقضا</Label>
                                <Input
                                  id="cardExpiry"
                                  type="text"
                                  placeholder="MM/YY"
                                  value={paymentData.cardExpiry}
                                  onChange={(e) =>
                                    setPaymentData({
                                      ...paymentData,
                                      cardExpiry: e.target.value,
                                    })
                                  }
                                  className="glass border-white/20"
                                  dir="ltr"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="cardCvv">CVV2</Label>
                                <Input
                                  id="cardCvv"
                                  type="text"
                                  placeholder="000"
                                  value={paymentData.cardCvv}
                                  onChange={(e) =>
                                    setPaymentData({
                                      ...paymentData,
                                      cardCvv: e.target.value,
                                    })
                                  }
                                  className="glass border-white/20"
                                  dir="ltr"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Terms Checkbox */}
                        <div className="flex items-start gap-2">
                          <Checkbox
                            id="terms"
                            checked={paymentData.termsAccepted}
                            onCheckedChange={(checked) =>
                              setPaymentData({
                                ...paymentData,
                                termsAccepted: checked as boolean,
                              })
                            }
                          />
                          <Label htmlFor="terms" className="cursor-pointer text-sm leading-relaxed">
                            قوانین و مقررات را مطالعه کرده و می‌پذیرم
                          </Label>
                        </div>

                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isLoading}
                        >
                          {isLoading ? "در حال پردازش..." : "پرداخت نهایی"}
                        </Button>
                      </form>
                    </SurfaceGlass>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:sticky lg:top-6 h-fit space-y-4">
              <SurfaceGlass className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">خلاصه سفارش</h3>
                  <button
                    onClick={() => setShowItems(!showItems)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    aria-label="نمایش/مخفی کردن محصولات"
                  >
                    <ChevronDown
                      className={cn(
                        "w-5 h-5 transition-transform",
                        showItems && "rotate-180"
                      )}
                    />
                  </button>
                </div>

                <AnimatePresence>
                  {showItems && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-3 mb-6 overflow-hidden"
                    >
                      {mockCartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start gap-3 p-3 glass rounded-lg border border-white/10"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-sm mb-1">{item.title}</p>
                            <p className="text-xs text-muted-foreground">
                              تعداد: {item.quantity}
                            </p>
                          </div>
                          <Price current={item.price} className="text-xs" />
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">جمع کل</span>
                    <Price current={subtotal} className="text-sm" />
                  </div>

                  {/* Discount Code */}
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="کد تخفیف"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className="glass border-white/20 flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={applyDiscount}
                      className="shrink-0"
                    >
                      اعمال
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    * مالیات بر ارزش افزوده در قیمت نهایی لحاظ شده است
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex justify-between items-baseline mb-4">
                    <span className="font-bold text-lg">مبلغ قابل پرداخت</span>
                    <Price current={total} />
                  </div>
                </div>

                {/* Guarantee Badge */}
                <div className="glass border border-white/20 rounded-lg p-4 flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">تضمین تعویض حساب</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      ۷ روز ضمانت بازگشت وجه
                    </p>
                  </div>
                </div>
              </SurfaceGlass>
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
  );
}
