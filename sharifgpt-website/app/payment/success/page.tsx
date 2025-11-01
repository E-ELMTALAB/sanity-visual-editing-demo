"use client"

import { useEffect, useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useCart } from "@/contexts/cart-context"

function PaymentSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { clearCart } = useCart()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [verifyData, setVerifyData] = useState<any>(null)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const authority = searchParams.get('Authority')
        const status = searchParams.get('Status')
        const resourceId = localStorage.getItem('pending_resource_id') || searchParams.get('cart_id')

        if (!authority || !resourceId) {
          setStatus('error')
          setErrorMessage('اطلاعات پرداخت ناقص است')
          return
        }

        // Verify via Next proxy to Medusa backend to avoid CORS
        const response = await fetch(`/api/payment/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            authority,
            Status: status || undefined,
            cart_id: resourceId
          })
        })

        const data = await response.json()

        if (data.success) {
          setStatus('success')
          setVerifyData(data.data)
          // Clear pending data
          localStorage.removeItem('pending_resource_id')
          localStorage.removeItem('pending_payment_authority')
          localStorage.removeItem('pending_payment_session_id')
          // Clear cart after successful payment
          clearCart()
        } else {
          setStatus('error')
          setErrorMessage(data.error || 'خطا در تأیید پرداخت')
        }

      } catch (error: any) {
        console.error('Payment verification error:', error)
        setStatus('error')
        setErrorMessage('خطا در پردازش پرداخت')
      }
    }

    verifyPayment()
  }, [searchParams])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال تأیید پرداخت...</p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">خطا در پرداخت</h1>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
          <div className="space-y-3">
            <Link
              href="/cart"
              className="block w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              بازگشت به سبد خرید
            </Link>
            <Link
              href="/products"
              className="block w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              مشاهده محصولات
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
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
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-right">
            <h3 className="font-bold text-gray-800 mb-2">جزئیات سفارش</h3>
            <p className="text-sm text-gray-600">کد پیگیری: {verifyData.ref_id}</p>
            <p className="text-sm text-gray-600">مبلغ: {Number(verifyData.amount || 0).toLocaleString()} {verifyData.currency_code || ''}</p>
            <p className="text-sm text-gray-600">تعداد کالا: {verifyData.items?.length || 0} عدد</p>
          </div>
        )}

        <div className="space-y-3">
          <Link
            href="/products"
            className="block w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ادامه خرید
          </Link>
          <Link
            href="/"
            className="block w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            بازگشت به خانه
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}
