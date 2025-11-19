import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { verifyPayment } from "@/lib/medusa-cart";
import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer/Footer";

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [verifyData, setVerifyData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        // Check for error query params first (from backend redirect)
        const errorParam = searchParams.get('error');
        if (errorParam) {
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
          return;
        }

        const authority = searchParams.get('Authority');
        const status = searchParams.get('Status');
        const cartIdFromUrl = searchParams.get('cart_id');
        const resourceId = localStorage.getItem('pending_resource_id') || cartIdFromUrl;

        console.log('[PAYMENT-CALLBACK] Authority:', authority);
        console.log('[PAYMENT-CALLBACK] Status:', status);
        console.log('[PAYMENT-CALLBACK] cart_id from URL:', cartIdFromUrl);
        console.log('[PAYMENT-CALLBACK] resourceId from localStorage:', localStorage.getItem('pending_resource_id'));
        console.log('[PAYMENT-CALLBACK] Final resourceId:', resourceId);

        if (!authority) {
          setStatus('error');
          setErrorMessage('کد پرداخت (Authority) یافت نشد');
          return;
        }

        if (!resourceId) {
          setStatus('error');
          setErrorMessage('شناسه سبد خرید یافت نشد. لطفاً از طریق صفحه سفارشات اقدام کنید.');
          return;
        }

        const result = await verifyPayment(authority, status || '', resourceId);

        if (result.success) {
          setStatus('success');
          setVerifyData(result.data);
          // Store order data for OrderConfirmation page
          localStorage.setItem('last_order_data', JSON.stringify(result.data));
          // Clear pending data
          localStorage.removeItem('pending_resource_id');
          localStorage.removeItem('pending_payment_authority');
          localStorage.removeItem('pending_payment_session_id');
          // Clear cart after successful payment
          clearCart();
        } else {
          setStatus('error');
          setErrorMessage(result.error || 'خطا در تأیید پرداخت');
        }
      } catch (error: any) {
        console.error('Payment verification error:', error);
        setStatus('error');
        setErrorMessage(error.message || 'خطا در پردازش پرداخت');
      }
    };

    verify();
  }, [searchParams, clearCart]);

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
          <Footer links={{ products: "/products", magazine: "/magazine", courses: "/courses", pricing: "/pricing", support: "/support" }} socials={[]} />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>پرداخت موفق - SharifGPT</title>
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Header onSearch={() => {}} />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">پرداخت موفق</h1>
            <p className="text-gray-600 mb-6">سفارش شما با موفقیت ثبت شد</p>
            
            {verifyData && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-right">
                <h3 className="font-bold text-gray-800 mb-2">جزئیات سفارش</h3>
                <p className="text-sm text-gray-600">کد پیگیری: {verifyData.ref_id}</p>
                <p className="text-sm text-gray-600">مبلغ: {Number(verifyData.amount || 0).toLocaleString()} {verifyData.currency_code || ''}</p>
                <p className="text-sm text-gray-600">تعداد کالا: {verifyData.items?.length || 0} عدد</p>
              </div>
            )}

            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link to={`/order/confirmation?oid=${verifyData?.ref_id || 'N/A'}`}>مشاهده جزئیات سفارش</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/products">ادامه خرید</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer links={{ products: "/products", magazine: "/magazine", courses: "/courses", pricing: "/pricing", support: "/support" }} socials={[]} />
      </div>
    </>
  );
}

