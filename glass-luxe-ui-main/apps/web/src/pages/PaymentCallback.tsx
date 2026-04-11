import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Helmet } from "@/components/Helmet";
import { verifyPayment } from "@/lib/medusa-cart";
import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer/Footer";
import { Copy, Check, Send } from "lucide-react";
import { toast } from "sonner";

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [verifyData, setVerifyData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const hasVerifiedRef = useRef(false); // Use ref to prevent duplicate calls (doesn't cause re-renders)

  const copyTrackingCode = async () => {
    if (verifyData?.ref_id) {
      try {
        await navigator.clipboard.writeText(verifyData.ref_id);
        setCopied(true);
        toast.success('کد رهگیری کپی شد');
        setTimeout(() => setCopied(false), 2000);

        // Fire tracking_code_copied event
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "tracking_code_copied",
          order_id: verifyData.ref_id
        });
      } catch (err) {
        toast.error('خطا در کپی کردن کد رهگیری');
      }
    }
  };

  useEffect(() => {
    // Prevent multiple verification attempts
    if (hasVerifiedRef.current) {
      return;
    }

    const verifyPaymentAsync = async () => {
      // Set flag immediately to prevent duplicate calls
      hasVerifiedRef.current = true;
      
      console.log('[PAYMENT-CALLBACK] ========== PAYMENT CALLBACK STARTED ==========');
      
      try {
        // Check for error query params first (from backend redirect)
        const errorParam = searchParams.get('error');
        if (errorParam) {
          console.error('[PAYMENT-CALLBACK] ❌ Error parameter found:', errorParam);
          setStatus('error');
          switch (errorParam) {
            case 'missing_authority':
              setErrorMessage('کد پرداخت (Authority) یافت نشد');
              break;
            case 'missing_cart_id':
              setErrorMessage('شناسه سبد خرید یافت نشد');
              break;
            case 'callback_error':
              setErrorMessage('خطا در پردازش بازگشت از درگاه پرداخت');
              break;
            default:
              setErrorMessage('خطا در پردازش پرداخت');
          }
          console.log('[PAYMENT-CALLBACK] =========================================');
          return;
        }

        // Match exact format from sharifgpt-website app/payment/success/page.tsx
        // IMPORTANT: Only use cart_id from localStorage, NOT from URL
        // The URL cart_id might be wrong or different from the one we created
        const authority = searchParams.get('Authority');
        const status = searchParams.get('Status');
        const resourceId = localStorage.getItem('pending_resource_id');
        const cartIdFromUrl = searchParams.get('cart_id'); // Only for logging/debugging

        console.log('[PAYMENT-CALLBACK] Authority:', authority);
        console.log('[PAYMENT-CALLBACK] Status:', status);
        console.log('[PAYMENT-CALLBACK] Cart ID (localStorage):', resourceId);

        if (!authority) {
          console.error('[PAYMENT-CALLBACK] ❌ Missing Authority parameter');
          setStatus('error');
          setErrorMessage('کد پرداخت (Authority) یافت نشد');
          console.log('[PAYMENT-CALLBACK] =========================================');
          return;
        }

        if (!resourceId) {
          console.error('[PAYMENT-CALLBACK] ❌ Missing cart_id from localStorage');
          setStatus('error');
          setErrorMessage('شناسه سبد خرید یافت نشد. لطفاً از طریق صفحه سفارشات اقدام کنید.');
          console.log('[PAYMENT-CALLBACK] =========================================');
          return;
        }
        // Call verifyPayment with exact same parameters as sharifgpt-website
        // status can be null/empty, verifyPayment will handle it
        const result = await verifyPayment(authority, status || '', resourceId);

        // Check if result exists and has success property
        if (!result) {
          console.error('[PAYMENT-CALLBACK] ❌ Verification result is null or undefined');
          setStatus('error');
          setErrorMessage('خطا در دریافت پاسخ از سرور');
          console.log('[PAYMENT-CALLBACK] =========================================');
          return;
        }

        if (result.success) {
          console.log('[PAYMENT-CALLBACK] ✅ Payment verified - Ref ID:', result.data?.ref_id);

          setStatus('success');
          setVerifyData(result.data);

          // Fire purchase event for GA4 ecommerce tracking
          if (result.data) {
            const amountInRial = Number(result.data.amount || 0) * 10; // Convert toman to rial
            const orderId = result.data.ref_id || 'UNKNOWN';

            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
              event: "purchase",
              ecommerce: {
                transaction_id: orderId,
                currency: "IRR",
                value: amountInRial,
                tax: 0,
                shipping: 0,
                coupon: "",
                items: (result.data.items || []).map((item: any) => ({
                  item_id: item.id || 'unknown',
                  item_name: item.title || 'Unknown Product',
                  item_category: "AI Accounts",
                  item_variant: "default",
                  price: amountInRial / (result.data.items?.length || 1), // Distribute total price
                  quantity: item.quantity || 1
                }))
              }
            });

            // Fire tracking_code_shown event
            window.dataLayer.push({
              event: "tracking_code_shown",
              tracking_code: orderId,
              order_id: orderId
            });
          }
          
          // Clear pending data (matches sharifgpt-website exactly)
          localStorage.removeItem('pending_resource_id');
          localStorage.removeItem('pending_payment_authority');
          localStorage.removeItem('pending_payment_session_id');
          
          // Clear cart after successful payment (matches sharifgpt-website)
          clearCart();
          
          console.log('[PAYMENT-CALLBACK] =========================================');
        } else {
          console.error('[PAYMENT-CALLBACK] ❌ Payment verification failed:', result.error);
          setStatus('error');
          setErrorMessage(result.error || 'خطا در تأیید پرداخت');
          console.log('[PAYMENT-CALLBACK] =========================================');
        }
      } catch (error: any) {
        console.error('[PAYMENT-CALLBACK] ❌ Payment verification error:', error.message);
        setStatus('error');
        setErrorMessage(error.message || 'خطا در پردازش پرداخت');
        console.log('[PAYMENT-CALLBACK] =========================================');
      }
    };

    verifyPaymentAsync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount - searchParams don't change after redirect

  if (status === 'loading') {
    return (
      <>
        <Helmet>
          <title>در حال تأیید پرداخت - SharifGPT</title>
        </Helmet>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">در حال تأیید پرداخت...</p>
          </div>
        </div>
      </>
    );
  }

  if (status === 'error') {
    return (
      <>
        <Helmet>
          <title>خطا در پرداخت - SharifGPT</title>
        </Helmet>
        <div className="min-h-screen flex flex-col">
          <Header onSearch={() => {}} />
          <main className="flex-1 flex items-center justify-center py-16">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-4">خطا در پرداخت</h1>
              <p className="text-gray-600 mb-6">{errorMessage}</p>
              <div className="space-y-3">
                <Button asChild className="w-full">
                  <Link to="/cart">بازگشت به سبد خرید</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/products">مشاهده محصولات</Link>
                </Button>
              </div>
            </div>
          </main>
          <Footer links={{ products: "/products", magazine: "/blog", courses: "/courses", pricing: "/pricing", support: "/support" }} socials={[]} />
        </div>
      </>
    );
  }

  // Match exact UI from sharifgpt-website app/payment/success/page.tsx
  return (
    <>
      <Helmet>
        <title>پرداخت موفق - SharifGPT</title>
      </Helmet>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">پرداخت موفق</h1>
          <p className="text-gray-600 mb-6">سفارش شما با موفقیت ثبت شد</p>
          
          {verifyData && (
            <>
              {/* Tracking Code Section */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
                <div className="text-center mb-4">
                  <h3 className="font-bold text-gray-800 mb-2 text-lg">کد رهگیری سفارش</h3>
                  <p className="text-sm text-gray-600 mb-4">لطفاً این کد را کپی کنید</p>
                  
                  {/* Tracking Code Display with Copy Button */}
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <code className="bg-white border-2 border-blue-300 rounded-lg px-4 py-3 text-lg font-bold text-blue-700 font-mono">
                      {verifyData.ref_id}
                    </code>
                    <Button
                      onClick={copyTrackingCode}
                      variant="outline"
                      size="lg"
                      className="flex items-center gap-2"
                    >
                      {copied ? (
                        <>
                          <Check className="w-5 h-5 text-green-600" />
                          <span className="text-green-600">کپی شد</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-5 h-5" />
                          <span>کپی</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Other Order Details */}
                <div className="border-t border-blue-200 pt-4 text-right">
                  <p className="text-sm text-gray-600 mb-1">مبلغ: {Number(verifyData.amount || 0).toLocaleString()} {verifyData.currency_code || ''}</p>
                  <p className="text-sm text-gray-600">تعداد کالا: {verifyData.items?.length || 0} عدد</p>
                </div>
              </div>

              {/* Telegram Support Instructions */}
              <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6 mb-6">
                <div className="text-center">
                  <h3 className="font-bold text-gray-800 mb-3 text-lg">دریافت اکانت</h3>
                  <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                    برای دریافت اکانت خود، لطفاً کد رهگیری را برای پشتیبانی در تلگرام ارسال کنید.
                  </p>
                  
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                    size="lg"
                  >
                    <a
                      href="https://t.me/sharifgpt"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                      onClick={() => {
                        // Fire telegram_support_click event
                        window.dataLayer = window.dataLayer || [];
                        window.dataLayer.push({
                          event: "telegram_support_click",
                          order_id: verifyData?.ref_id || 'UNKNOWN',
                          placement: "payment_success_page"
                        });
                      }}
                    >
                      <Send className="w-5 h-5" />
                      <span>ارسال پیام به پشتیبانی تلگرام</span>
                    </a>
                  </Button>
                </div>
              </div>
            </>
          )}

          <div className="space-y-3">
            <Link
              to="/products"
              className="block w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
            >
              ادامه خرید
            </Link>
            <Link
              to="/"
              className="block w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              بازگشت به خانه
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

