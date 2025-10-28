"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useCart } from "@/contexts/cart-context"
import { useZarinpalPayment } from "@/hooks/use-zarinpal-payment"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2, ArrowRight, Home } from "lucide-react"
import Link from "next/link"

interface PaymentResult {
  success: boolean
  refId?: string
  cardPan?: string
  error?: string
}

export default function PaymentCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { clearCart, medusaCartId } = useCart()
  const { verifyPayment } = useZarinpalPayment()
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [result, setResult] = useState<PaymentResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const processPayment = async () => {
      try {
        // Extract parameters from URL
        const authority = searchParams.get('Authority')
        const status = searchParams.get('Status')
        const cartId = searchParams.get('cart_id') || medusaCartId

        if (!authority) {
          throw new Error('Authority parameter is missing')
        }

        if (!cartId) {
          throw new Error('Cart ID is missing')
        }

        console.log('Processing payment callback:', { authority, status, cartId })

        // Verify payment with Medusa backend
        const verificationResult = await verifyPayment(authority, status || '', cartId)

        if (verificationResult.success) {
          setResult({
            success: true,
            refId: verificationResult.data?.ref_id,
            cardPan: verificationResult.data?.card_pan,
          })
          setStatus('success')
          
          // Clear cart on successful payment
          clearCart()
          
          // Redirect to success page after 3 seconds
          setTimeout(() => {
            router.push('/payment/success')
          }, 3000)
        } else {
          setResult({
            success: false,
            error: verificationResult.error || 'Payment verification failed',
          })
          setStatus('error')
        }
      } catch (error) {
        console.error('Payment callback error:', error)
        setError(error instanceof Error ? error.message : 'Unknown error occurred')
        setStatus('error')
      }
    }

    processPayment()
  }, [searchParams, medusaCartId, verifyPayment, clearCart, router])

  const handleRetry = () => {
    router.push('/checkout')
  }

  const handleGoHome = () => {
    router.push('/')
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="glassmorphism-light max-w-md w-full mx-4">
          <CardContent className="text-center p-8">
            <Loader2 className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">در حال پردازش پرداخت...</h2>
            <p className="text-gray-600">لطفاً صبر کنید تا پرداخت شما تأیید شود</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="glassmorphism-light max-w-md w-full mx-4">
          <CardHeader>
            <CardTitle className="text-center text-red-600 flex items-center justify-center">
              <XCircle className="w-6 h-6 ml-2" />
              خطا در پردازش پرداخت
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>
                {error || result?.error || 'خطای نامشخص در پردازش پرداخت'}
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Button 
                onClick={handleRetry}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <ArrowRight className="w-4 h-4 ml-2" />
                تلاش مجدد
              </Button>
              
              <Button 
                onClick={handleGoHome}
                variant="outline"
                className="w-full"
              >
                <Home className="w-4 h-4 ml-2" />
                بازگشت به خانه
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="glassmorphism-light max-w-md w-full mx-4">
          <CardHeader>
            <CardTitle className="text-center text-green-600 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 ml-2" />
              پرداخت موفقیت‌آمیز
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-gray-600">پرداخت شما با موفقیت انجام شد</p>
              
              {result?.refId && (
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">شماره پیگیری:</p>
                  <p className="font-bold text-green-800">{result.refId}</p>
                </div>
              )}
              
              {result?.cardPan && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">شماره کارت:</p>
                  <p className="font-bold text-blue-800">****{result.cardPan}</p>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Button 
                onClick={() => router.push('/payment/success')}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                <ArrowRight className="w-4 h-4 ml-2" />
                مشاهده جزئیات سفارش
              </Button>
              
              <Button 
                onClick={handleGoHome}
                variant="outline"
                className="w-full"
              >
                <Home className="w-4 h-4 ml-2" />
                بازگشت به خانه
              </Button>
            </div>
            
            <p className="text-xs text-gray-500 text-center">
              در حال انتقال به صفحه جزئیات سفارش...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
