import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ShieldCheck } from "lucide-react";
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
import { PaymentSection } from "@/components/checkout/PaymentSection";
import { PaymentGateway } from "@/components/checkout/SecurePaymentMethods";

const contactSchema = z.object({
  email: z.string().email({ message: "ایمیل معتبر وارد کنید" }),
  fullName: z.string().min(3, { message: "نام کامل باید حداقل ۳ کاراکتر باشد" }),
  phone: z.string().regex(/^09\d{9}$/, { message: "شماره موبایل معتبر وارد کنید" }),
});

export default function Checkout() {
  const navigate = useNavigate();
  const { state: cartState, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [showItems, setShowItems] = useState(true);
  const [discountCode, setDiscountCode] = useState("");
  
  const [contactData, setContactData] = useState({
    email: "",
    fullName: "",
    phone: "",
  });
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>(null);
  const [showGatewayValidation, setShowGatewayValidation] = useState(false);

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
        <Footer links={{ products: "/products", magazine: "/blog", courses: "/courses", pricing: "/pricing", support: "/support" }} socials={[]} />
      </div>
    );
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[CHECKOUT] ========== CHECKOUT PROCESS STARTED ==========');
    console.log('[CHECKOUT] Cart items count:', cartState.items.length);
    console.log('[CHECKOUT] Contact data:', contactData);
    console.log('[CHECKOUT] Selected gateway:', selectedGateway);

    // Validate contact data
    try {
      contactSchema.parse(contactData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
        return;
    }
    }

    // Validate gateway selection
    if (!selectedGateway) {
      setShowGatewayValidation(true);
      toast.error("لطفاً روش پرداخت را انتخاب کنید");
      return;
    }

    if (cartState.items.length === 0) {
      toast.error("سبد خرید شما خالی است");
      console.error('[CHECKOUT] ❌ Cart is empty');
      console.log('[CHECKOUT] =========================================');
      return;
    }

    try {
      setIsLoading(true);
      console.log('[CHECKOUT] Starting cart creation...');

      // Step 1: Create Medusa cart
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

      if (!cartResponse.success || !cartResponse.cart?.id) {
        console.error('[CHECKOUT] ❌ Cart creation failed:', cartResponse.error || 'Unknown error');
        throw new Error(cartResponse.error || 'خطا در ایجاد سبد خرید');
      }

      const cartId = cartResponse.cart.id;
      console.log('[CHECKOUT] ✅ Cart created with ID:', cartId);

      // Step 2: Initiate payment
      const paymentResponse = await initiatePayment(
        cartId,
        contactData.email,
        contactData.phone
      );

      if (!paymentResponse.success) {
        console.error('[CHECKOUT] ❌ Payment initiation failed:', paymentResponse.error || 'Unknown error');
        throw new Error(paymentResponse.error || 'خطا در شروع پرداخت');
      }

      // Redirect to payment gateway
      if (paymentResponse.payment?.payment_url) {
        // Store cart ID for verification after payment
        console.log('[CHECKOUT] Storing pending payment data in localStorage...');
        localStorage.setItem('pending_resource_id', cartId);
        localStorage.setItem('pending_payment_authority', paymentResponse.payment.authority);
        localStorage.setItem('pending_payment_session_id', paymentResponse.payment.session_id);

        console.log('[CHECKOUT] Redirecting to payment gateway:', paymentResponse.payment.payment_url);
        console.log('[CHECKOUT] =========================================');

        // Redirect to Zarinpal payment gateway
        window.location.href = paymentResponse.payment.payment_url;
      } else {
        console.error('[CHECKOUT] ❌ Payment URL not received');
        throw new Error('لینک پرداخت دریافت نشد');
      }

    } catch (error: any) {
      console.error('[CHECKOUT] ❌ Checkout error:', error.message);
      toast.error(error.message || 'خطا در پردازش سفارش');
      setIsLoading(false);
      console.log('[CHECKOUT] =========================================');
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
      <Header onSearch={() => {}} active="checkout" />

      <main className="flex-1 pt-32 pb-10">
        <div className="max-w-[1100px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row-reverse lg:gap-8 lg:items-start">
            {/* Order Summary - First on mobile, right side on desktop */}
            <div className="lg:w-[360px] lg:shrink-0 lg:sticky lg:top-6 h-fit space-y-4 order-1 lg:order-2">
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

                  {showItems && (
                  <div className="space-y-3 mb-6">
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
                  </div>
                  )}

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
              </SurfaceGlass>
            </div>

            {/* Contact & Payment Form - Second on mobile, left side on desktop */}
            <div className="flex-1 space-y-6 order-2 lg:order-1">
              {/* Contact Information */}
              <SurfaceGlass className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-primary text-primary-foreground">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold">اطلاعات تماس</h2>
                </div>

                <div className="space-y-4" dir="rtl">
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
                      className="glass border-white/20"
                      required
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
                      className="glass border-white/20"
                      required
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
                      className="glass border-white/20"
                      dir="ltr"
                      required
                    />
                  </div>
                </div>
              </SurfaceGlass>

              {/* Payment Section */}
              <PaymentSection
                selectedGateway={selectedGateway}
                onSelectGateway={(gateway) => {
                  setSelectedGateway(gateway);
                  setShowGatewayValidation(false);
                }}
                onSubmit={handlePaymentSubmit}
                isLoading={isLoading}
                showGatewayValidation={showGatewayValidation}
              />
            </div>
          </div>
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
    </div>
  );
}
