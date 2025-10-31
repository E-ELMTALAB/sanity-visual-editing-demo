"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function TestPaymentPage() {
  const [testResults, setTestResults] = useState<{
    proxy: 'loading' | 'success' | 'error' | null
    payment: 'loading' | 'success' | 'error' | null
  }>({
    proxy: null,
    payment: null
  })
  const [error, setError] = useState<string | null>(null)
  const [cartId, setCartId] = useState<string>("")
  const [verifyResult, setVerifyResult] = useState<any>(null)

  useEffect(() => {
    try {
      const pending = localStorage.getItem('pending_resource_id')
      if (pending) setCartId(pending)
    } catch {}
  }, [])

  const testProxy = async () => {
    setTestResults(prev => ({ ...prev, proxy: 'loading' }))
    setError(null)

    try {
      const response = await fetch('/api/payment/test')
      const result = await response.json()

      if (result.success) {
        setTestResults(prev => ({ ...prev, proxy: 'success' }))
      } else {
        setTestResults(prev => ({ ...prev, proxy: 'error' }))
        setError(result.error)
      }
    } catch (err) {
      setTestResults(prev => ({ ...prev, proxy: 'error' }))
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  const testPayment = async () => {
    setTestResults(prev => ({ ...prev, payment: 'loading' }))
    setError(null)

    try {
      const response = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [
            {
              id: 1,
              title: 'Test Product',
              price: 100000,
              quantity: 1
            }
          ],
          customer_email: 'test@example.com',
          customer_phone: '+989123456789'
        })
      })

      const result = await response.json()

      if (result.success) {
        setTestResults(prev => ({ ...prev, payment: 'success' }))
        console.log('Payment test successful:', result)
        try {
          const newCartId = result?.cart?.id || result?.payment?.resource_id || result?.resourceId
          if (newCartId) {
            localStorage.setItem('pending_resource_id', newCartId)
            setCartId(newCartId)
          }
        } catch {}
      } else {
        setTestResults(prev => ({ ...prev, payment: 'error' }))
        setError(result.error)
      }
    } catch (err) {
      setTestResults(prev => ({ ...prev, payment: 'error' }))
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  const simulateCallback = async () => {
    setError(null)
    setVerifyResult(null)
    if (!cartId) {
      setError('Cart ID نامعتبر است. ابتدا پرداخت تستی ایجاد کنید یا Cart ID را وارد کنید.')
      return
    }
    const backend = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
    const url = `${backend}/store/zarinpal/callback?Authority=TEST_${Date.now()}&Status=OK&resource_id=${encodeURIComponent(cartId)}`
    window.open(url, '_blank')
  }

  const directVerify = async () => {
    setError(null)
    setVerifyResult(null)
    if (!cartId) {
      setError('Cart ID نامعتبر است. ابتدا پرداخت تستی ایجاد کنید یا Cart ID را وارد کنید.')
      return
    }
    try {
      const response = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authority: `TEST_${Date.now()}`, Status: 'OK', cart_id: cartId })
      })
      const data = await response.json()
      if (response.ok && data.success) {
        setVerifyResult(data)
      } else {
        setError(data.error || 'خطا در تأیید پرداخت (آفلاین)')
      }
    } catch (e: any) {
      setError(e?.message || 'Unknown error')
    }
  }

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-5 h-5 animate-spin" />
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return null
    }
  }

  const getStatusText = (status: string | null) => {
    switch (status) {
      case 'loading':
        return 'در حال تست...'
      case 'success':
        return 'موفق'
      case 'error':
        return 'خطا'
      default:
        return 'آماده'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="glassmorphism-light border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800 text-center">
              تست سیستم پرداخت
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 space-x-reverse">
                    {getStatusIcon(testResults.proxy)}
                    <span>تست اتصال به بک‌اند</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    این تست اتصال به سرور Medusa را بررسی می‌کند
                  </p>
                  <Button 
                    onClick={testProxy}
                    disabled={testResults.proxy === 'loading'}
                    className="w-full"
                  >
                    {testResults.proxy === 'loading' ? 'در حال تست...' : 'شروع تست'}
                  </Button>
                  <p className="text-sm text-gray-500 mt-2">
                    وضعیت: {getStatusText(testResults.proxy)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 space-x-reverse">
                    {getStatusIcon(testResults.payment)}
                    <span>تست ایجاد پرداخت</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    این تست ایجاد یک پرداخت تستی را بررسی می‌کند
                  </p>
                  <Button 
                    onClick={testPayment}
                    disabled={testResults.payment === 'loading'}
                    className="w-full"
                    variant="outline"
                  >
                    {testResults.payment === 'loading' ? 'در حال تست...' : 'شروع تست'}
                  </Button>
                  <p className="text-sm text-gray-500 mt-2">
                    وضعیت: {getStatusText(testResults.payment)}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>شبیه‌سازی پس از پرداخت (آفلاین)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-600">Cart ID را وارد کنید یا با دکمهٔ بالا ایجاد کنید. سپس یکی از گزینه‌ها را انتخاب کنید:</p>
                <input
                  className="w-full border rounded px-3 py-2"
                  placeholder="cart_..."
                  value={cartId}
                  onChange={(e) => setCartId(e.target.value)}
                />
                <div className="grid md:grid-cols-2 gap-3">
                  <Button onClick={simulateCallback}>شبیه‌سازی Callback و بازگشت</Button>
                  <Button variant="outline" onClick={directVerify}>تأیید مستقیم (بدون Callback)</Button>
                </div>
                {verifyResult && (
                  <div className="text-right text-sm text-gray-700 bg-gray-50 p-3 rounded">
                    <div>ref_id: {verifyResult?.data?.ref_id}</div>
                    <div>amount: {verifyResult?.data?.amount} {verifyResult?.data?.currency_code}</div>
                    <div>items: {verifyResult?.data?.items?.length || 0}</div>
                    <div>status: {verifyResult?.data?.status}</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {error && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {testResults.proxy === 'success' && testResults.payment === 'success' && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  همه تست‌ها موفقیت‌آمیز بود! سیستم پرداخت آماده است.
                </AlertDescription>
              </Alert>
            )}

            <div className="text-center">
              <Button 
                onClick={() => window.location.href = '/checkout'}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                رفتن به صفحه تسویه حساب
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
