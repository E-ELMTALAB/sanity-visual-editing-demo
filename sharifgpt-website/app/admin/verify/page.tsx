"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Search, Lock } from "lucide-react"

export default function AdminVerifyPage() {
  const [refId, setRefId] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleVerify = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/admin/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ref_id: refId.trim(),
          admin_password: password
        })
      })

      const data = await response.json()

      if (data.success) {
        setResult(data)
      } else {
        setError(data.error || 'خطا در دریافت اطلاعات')
      }
    } catch (e: any) {
      setError(e?.message || 'خطا در اتصال به سرور')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Lock className="w-6 h-6" />
              پنل تأیید پرداخت ادمین
            </CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              برای بررسی وضعیت پرداخت، کد پیگیری (ref_id) را وارد کنید
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="refId">کد پیگیری (ref_id)</Label>
              <Input
                id="refId"
                type="text"
                placeholder="78148083401"
                value={refId}
                onChange={(e) => setRefId(e.target.value)}
                className="text-left"
              />
            </div>

            <div>
              <Label htmlFor="password">رمز عبور ادمین</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                رمز پیش‌فرض: sharifgpt-admin-2025 (در متغیر محیطی ADMIN_VERIFY_PASSWORD تنظیم کنید)
              </p>
            </div>

            <Button 
              onClick={handleVerify} 
              disabled={loading || !refId || !password}
              className="w-full"
            >
              {loading ? 'در حال بررسی...' : 'جستجو'}
              <Search className="w-4 h-4 mr-2" />
            </Button>

            {error && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {result && (
              <div className="space-y-4 mt-6">
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    پرداخت معتبر یافت شد
                  </AlertDescription>
                </Alert>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">اطلاعات پرداخت</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-gray-600">کد پیگیری:</span>
                      <span className="font-bold">{result.payment?.ref_id}</span>

                      <span className="text-gray-600">مبلغ:</span>
                      <span className="font-bold">{Number(result.payment?.amount || 0).toLocaleString()} {result.payment?.currency_code}</span>

                      <span className="text-gray-600">وضعیت:</span>
                      <span className="font-bold text-green-600">{result.payment?.status}</span>

                      <span className="text-gray-600">شماره کارت:</span>
                      <span className="font-bold">****{result.payment?.card_pan || '----'}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">اطلاعات مشتری</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-gray-600">ایمیل:</span>
                      <span className="font-mono">{result.customer?.email || 'ندارد'}</span>

                      <span className="text-gray-600">تلفن:</span>
                      <span className="font-mono">{result.customer?.phone || 'ندارد'}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">محصولات خریداری شده</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {result.order?.items?.length > 0 ? (
                      <div className="space-y-2">
                        {result.order.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center border-b pb-2">
                            <div>
                              <p className="font-bold">{item.title}</p>
                              <p className="text-xs text-gray-600">تعداد: {item.quantity}</p>
                            </div>
                            <p className="font-bold">{Number(item.unit_price || item.price || 0).toLocaleString()} تومان</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">اطلاعات محصولات موجود نیست</p>
                    )}
                  </CardContent>
                </Card>

                {result.created_at && (
                  <div className="text-xs text-gray-500 text-center">
                    تاریخ ایجاد: {new Date(result.created_at).toLocaleString('fa-IR')}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

