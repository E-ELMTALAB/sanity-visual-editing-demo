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
import { useCart } from "@/contexts/cart-context";
import { createMedusaCart, initiatePayment } from "@/lib/medusa-cart";

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

export default function Checkout() {
  const navigate = useNavigate();
  const { state: cartState, clearCart } = useCart();
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
    paymentMethod: "zarinpal",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    termsAccepted: false,
  });

  const subtotal = cartState.total;
  const discount = 0;
  const total = subtotal - discount;

  // Redirect if cart is empty
  if (cartState.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header onSearch={() => {}} active="checkout" />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="max-w-md w-full text-center">
            <p className="text-xl mb-4">سبد خرید شما خالی است</p>
            <Button asChild>
              <a href="/products">مشاهده محصولات</a>
            </Button>
          </div>
        </main>
        <Footer links={{ products: "/products", magazine: "/magazine", courses: "/courses", pricing: "/pricing", support: "/support" }} socials={[]} />
      </div>
    );
  }

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
    
    console.log('[CHECKOUT] ========== CHECKOUT PROCESS STARTED ==========');
    console.log('[CHECKOUT] Cart items count:', cartState.items.length);
    console.log('[CHECKOUT] Customer email:', contactData.email);
    console.log('[CHECKOUT] Customer phone:', contactData.phone);
    
    if (cartState.items.length === 0) {
      console.error('[CHECKOUT] ❌ Cart is empty');
      toast.error("سبد خرید شما خالی است");
      return;
    }

    if (!contactData.email.trim()) {
      console.error('[CHECKOUT] ❌ Email is missing');
      toast.error("لطفاً ایمیل خود را وارد کنید");
      return;
    }

    if (!contactData.phone.trim()) {
      console.error('[CHECKOUT] ❌ Phone is missing');
      toast.error("لطفاً شماره تلفن خود را وارد کنید");
      return;
    }

    setIsLoading(true);

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
      console.log('[CHECKOUT] ✅ Payment data validation passed');

      // Step 1: Create real Medusa cart with validated products
      console.log('[CHECKOUT] Step 1: Creating Medusa cart...');
      const cartResponse = await createMedusaCart(
        cartState.items.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
          selectedOption: item.selectedOption,
          sanity_slug: item.sanity_slug,
          variant_id: item.variant_id,
          option_name: item.option_name,
        })),
        contactData.email,
        contactData.phone
      );

      console.log('[CHECKOUT] Cart creation response:', cartResponse);

      if (!cartResponse.success || !cartResponse.cart?.id) {
        console.error('[CHECKOUT] ❌ Cart creation failed:', cartResponse);
        throw new Error(cartResponse.error || 'خطا در ایجاد سبد خرید');
      }

      const cartId = cartResponse.cart.id;
      console.log('[CHECKOUT] ✅ Cart created with ID:', cartId);
      console.log('[CHECKOUT] Cart ID type:', typeof cartId);

      // Step 2: Initiate payment for the created cart
      console.log('[CHECKOUT] Step 2: Initiating payment...');
      const paymentResponse = await initiatePayment(
        cartId,
        contactData.email,
        contactData.phone
      );

      console.log('[CHECKOUT] Payment initiation response:', paymentResponse);

      if (!paymentResponse.success) {
        console.error('[CHECKOUT] ❌ Payment initiation failed:', paymentResponse);
        throw new Error(paymentResponse.error || 'خطا در شروع پرداخت');
      }

      // Redirect to payment gateway
      if (paymentResponse.payment?.payment_url) {
        // Store cart ID for verification after payment
        console.log('[CHECKOUT] Storing cart ID in localStorage:', cartId);
        localStorage.setItem('pending_resource_id', cartId);
        localStorage.setItem('pending_payment_authority', paymentResponse.payment.authority);
        localStorage.setItem('pending_payment_session_id', paymentResponse.payment.session_id);
        
        console.log('[CHECKOUT] Stored values:', {
          pending_resource_id: localStorage.getItem('pending_resource_id'),
          pending_payment_authority: localStorage.getItem('pending_payment_authority')
        });
        
        console.log('[CHECKOUT] Redirecting to payment gateway...');
        console.log('[CHECKOUT] Payment URL:', paymentResponse.payment.payment_url);
        console.log('[CHECKOUT] =========================================');
        
        // Redirect to Zarinpal payment gateway
        window.location.href = paymentResponse.payment.payment_url;
      } else {
        console.error('[CHECKOUT] ❌ Payment URL not received');
        throw new Error('لینک پرداخت دریافت نشد');
      }

    } catch (error: any) {
      console.error('[CHECKOUT] ❌ Checkout error:', error);
      console.error('[CHECKOUT] Error message:', error.message);
      console.error('[CHECKOUT] Error stack:', error.stack);
      console.log('[CHECKOUT] =========================================');
      
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error(error.message || 'خطا در پردازش سفارش');
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
                        {/* Payment Method - Only Zarinpal */}
                        <div className="glass border border-primary/20 rounded-lg p-4 flex items-center gap-3 bg-primary/5">
                          <Wallet className="w-6 h-6 text-primary" />
                          <div>
                            <p className="font-semibold">پرداخت از طریق زرین‌پال</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              پس از کلیک روی پرداخت نهایی، به درگاه پرداخت زرین‌پال هدایت می‌شوید
                            </p>
                          </div>
                        </div>

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
                      {cartState.items.map((item) => (
                        <div
                          key={`${item.id}-${item.selectedOption || ''}`}
                          className="flex items-start gap-3 p-3 glass rounded-lg border border-white/10"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-sm mb-1">{item.title}</p>
                            {item.selectedOption && (
                              <p className="text-xs text-muted-foreground mb-1">
                                {item.selectedOption}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                              تعداد: {item.quantity}
                            </p>
                          </div>
                          <Price current={item.price * item.quantity} className="text-xs" />
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
