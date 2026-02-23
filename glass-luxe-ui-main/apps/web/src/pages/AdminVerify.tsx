import { useState } from "react";
import { Helmet } from "@/components/Helmet";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer/Footer";
import { SurfaceGlass } from "@/components/ui/surface-glass";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Search, CheckCircle, XCircle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface VerificationResult {
  success: boolean;
  payment?: {
    ref_id: string;
    authority: string;
    card_pan?: string;
    status: string;
    amount: number;
    currency_code: string;
    verified_at?: string;
  };
  customer?: {
    email?: string;
    phone?: string;
  };
  order?: {
    cart_id?: string;
    items: Array<{
      title: string;
      quantity: number;
      unit_price: number;
      total: number;
    }>;
    total: number;
    original_amount?: number;
  };
  created_at?: string;
  error?: string;
}

export default function AdminVerify() {
  const [refId, setRefId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    if (!refId.trim() || !password.trim()) {
      toast.error("لطفاً تمام فیلدها را پر کنید");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    console.log('[ADMIN-VERIFY] Submitting verification request...');
    console.log('[ADMIN-VERIFY] Ref ID:', refId.trim());

    try {
      const backendUrl = import.meta.env.VITE_MEDUSA_BACKEND_URL || 'https://backend.sharifgpt.com';
      const response = await fetch(`${backendUrl}/internal/admin/verify-payment`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ref_id: refId.trim(),
          admin_password: password.trim()
        })
      });

      console.log('[ADMIN-VERIFY] Response status:', response.status);

      const data = await response.json();
      console.log('[ADMIN-VERIFY] Response data:', data);

      if (data.success) {
        setResult(data);
        toast.success("پرداخت معتبر یافت شد");
        console.log('[ADMIN-VERIFY] ✅ Verification successful');
      } else {
        setError(data.error || 'خطا در دریافت اطلاعات');
        toast.error(data.error || 'خطا در دریافت اطلاعات');
        console.error('[ADMIN-VERIFY] ❌ Verification failed:', data.error);
      }
    } catch (e: any) {
      console.error('[ADMIN-VERIFY] ❌ Request error:', e);
      const errorMsg = e?.message || 'خطا در اتصال به سرور';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading && refId && password) {
      handleVerify();
    }
  };

  return (
    <>
      <Helmet>
        <title>پنل تأیید پرداخت ادمین - Glass Luxe</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header onSearch={() => {}} />

        <main className="flex-1 py-16 px-4 md:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <SurfaceGlass className="p-6 md:p-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <ShieldCheck className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold">پنل تأیید پرداخت ادمین</h1>
              </div>
              <p className="text-muted-foreground">
                برای بررسی وضعیت پرداخت، کد پیگیری (ref_id) را وارد کنید
              </p>
            </SurfaceGlass>

            {/* Input Form */}
            <SurfaceGlass className="p-6 md:p-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="refId" className="text-base">
                    کد پیگیری (ref_id)
                  </Label>
                  <Input
                    id="refId"
                    type="text"
                    placeholder="78148083401"
                    value={refId}
                    onChange={(e) => setRefId(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="text-left glass border-white/20"
                    dir="ltr"
                  />
                  <p className="text-xs text-muted-foreground">
                    کد پیگیری زرین‌پال که به مشتری داده شده است
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-base flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    رمز عبور ادمین
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="glass border-white/20"
                  />
                </div>

                <Button 
                  onClick={handleVerify} 
                  disabled={loading || !refId || !password}
                  className="w-full"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      در حال بررسی...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      جستجو و تأیید
                    </>
                  )}
                </Button>
              </div>
            </SurfaceGlass>

            {/* Error Display */}
            {error && (
              <SurfaceGlass className="p-4 border-2 border-red-500/50 bg-red-500/10">
                <div className="flex items-center gap-3 text-red-600">
                  <XCircle className="w-5 h-5 shrink-0" />
                  <p className="font-medium">{error}</p>
                </div>
              </SurfaceGlass>
            )}

            {/* Success Display */}
            {result && result.success && (
              <div className="space-y-4">
                {/* Success Alert */}
                <SurfaceGlass className="p-4 border-2 border-green-500/50 bg-green-500/10">
                  <div className="flex items-center gap-3 text-green-600">
                    <CheckCircle className="w-5 h-5 shrink-0" />
                    <p className="font-bold">پرداخت معتبر یافت شد</p>
                  </div>
                </SurfaceGlass>

                {/* Payment Details */}
                <SurfaceGlass className="p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <div className="w-2 h-6 bg-primary rounded-full"></div>
                    اطلاعات پرداخت
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <span className="text-muted-foreground">کد پیگیری:</span>
                      <p className="font-bold text-lg" dir="ltr">{result.payment?.ref_id}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-muted-foreground">مبلغ:</span>
                      <p className="font-bold text-lg">
                        {Number(result.payment?.amount || 0).toLocaleString('fa-IR')} ریال
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-muted-foreground">وضعیت:</span>
                      <p className={cn(
                        "font-bold",
                        result.payment?.status === 'authorized' ? 'text-green-600' : 'text-yellow-600'
                      )}>
                        {result.payment?.status === 'authorized' ? 'تأیید شده' : result.payment?.status}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-muted-foreground">شماره کارت:</span>
                      <p className="font-bold font-mono" dir="ltr">
                        ****{result.payment?.card_pan || '----'}
                      </p>
                    </div>
                  </div>
                </SurfaceGlass>

                {/* Customer Details */}
                {(result.customer?.email || result.customer?.phone) && (
                  <SurfaceGlass className="p-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <div className="w-2 h-6 bg-primary rounded-full"></div>
                      اطلاعات مشتری
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      {result.customer?.email && (
                        <div className="space-y-1">
                          <span className="text-muted-foreground">ایمیل:</span>
                          <p className="font-mono text-base" dir="ltr">{result.customer.email}</p>
                        </div>
                      )}

                      {result.customer?.phone && (
                        <div className="space-y-1">
                          <span className="text-muted-foreground">تلفن:</span>
                          <p className="font-mono text-base" dir="ltr">{result.customer.phone}</p>
                        </div>
                      )}
                    </div>
                  </SurfaceGlass>
                )}

                {/* Order Items */}
                {result.order && result.order.items && result.order.items.length > 0 && (
                  <SurfaceGlass className="p-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <div className="w-2 h-6 bg-primary rounded-full"></div>
                      محصولات خریداری شده
                    </h2>
                    <div className="space-y-3">
                      {result.order.items.map((item, idx) => (
                        <div 
                          key={idx} 
                          className="flex justify-between items-center p-4 glass rounded-lg border border-white/10"
                        >
                          <div>
                            <p className="font-bold">{item.title}</p>
                            <p className="text-sm text-muted-foreground">
                              تعداد: {item.quantity} × {Number(item.unit_price || 0).toLocaleString('fa-IR')} ریال
                            </p>
                          </div>
                          <p className="font-bold text-lg">
                            {Number(item.total || (item.unit_price * item.quantity)).toLocaleString('fa-IR')} ریال
                          </p>
                        </div>
                      ))}

                      <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                        <span className="text-lg font-bold">جمع کل:</span>
                        <span className="text-2xl font-bold text-primary">
                          {Number(result.order.total || 0).toLocaleString('fa-IR')} ریال
                        </span>
                      </div>
                    </div>
                  </SurfaceGlass>
                )}

                {/* Timestamp */}
                {result.created_at && (
                  <div className="text-center text-sm text-muted-foreground">
                    تاریخ ایجاد: {new Date(result.created_at).toLocaleString('fa-IR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                )}
              </div>
            )}
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
    </>
  );
}

