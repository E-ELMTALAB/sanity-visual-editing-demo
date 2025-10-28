"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Download, Home, Package, CreditCard } from "lucide-react"
import Link from "next/link"

interface OrderDetails {
  orderId: string
  refId: string
  amount: number
  currency: string
  cardPan?: string
  date: string
  status: 'completed' | 'pending' | 'failed'
}

export default function PaymentSuccessPage() {
  const router = useRouter()
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)

  useEffect(() => {
    // In a real implementation, you would fetch order details from the backend
    // For now, we'll simulate the data
    const mockOrderDetails: OrderDetails = {
      orderId: `ORD-${Date.now()}`,
      refId: '123456789',
      amount: 299000,
      currency: 'IRR',
      cardPan: '1234',
      date: new Date().toLocaleDateString('fa-IR'),
      status: 'completed'
    }
    
    setOrderDetails(mockOrderDetails)
  }, [])

  const formatPrice = (price: number) => {
    return price.toLocaleString("fa-IR")
  }

  const handleDownloadReceipt = () => {
    // In a real implementation, this would generate and download a PDF receipt
    console.log('Downloading receipt...')
    // For now, just show an alert
    alert('دریافت رسید در نسخه بعدی اضافه خواهد شد')
  }

  const handleGoHome = () => {
    router.push('/')
  }

  const handleViewProducts = () => {
    router.push('/products')
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="glassmorphism-light max-w-md w-full mx-4">
          <CardContent className="text-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">در حال بارگذاری جزئیات سفارش...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <Card className="glassmorphism-light border-0 shadow-xl mb-6">
            <CardContent className="text-center p-8">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-800 mb-2">پرداخت موفقیت‌آمیز</h1>
              <p className="text-gray-600">سفارش شما با موفقیت ثبت شد</p>
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card className="glassmorphism-light border-0 shadow-xl mb-6">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-bold text-gray-800">
                <Package className="w-6 h-6 ml-3 text-blue-600" />
                جزئیات سفارش
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">شماره سفارش</p>
                  <p className="font-bold text-gray-800">{orderDetails.orderId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">تاریخ سفارش</p>
                  <p className="font-bold text-gray-800">{orderDetails.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">شماره پیگیری</p>
                  <p className="font-bold text-gray-800">{orderDetails.refId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">وضعیت</p>
                  <Badge className="bg-green-100 text-green-700">
                    تکمیل شده
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card className="glassmorphism-light border-0 shadow-xl mb-6">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-bold text-gray-800">
                <CreditCard className="w-6 h-6 ml-3 text-purple-600" />
                جزئیات پرداخت
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">مبلغ پرداختی</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatPrice(orderDetails.amount)} تومان
                  </p>
                </div>
                {orderDetails.cardPan && (
                  <div>
                    <p className="text-sm text-gray-600">شماره کارت</p>
                    <p className="font-bold text-gray-800">****{orderDetails.cardPan}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={handleDownloadReceipt}
              variant="outline"
              className="w-full"
            >
              <Download className="w-4 h-4 ml-2" />
              دریافت رسید
            </Button>
            
            <Button
              onClick={handleViewProducts}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Package className="w-4 h-4 ml-2" />
              مشاهده محصولات
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

          {/* Additional Info */}
          <Card className="glassmorphism-light border-0 shadow-xl mt-6">
            <CardContent className="p-6">
              <h3 className="font-bold text-gray-800 mb-3">اطلاعات مهم</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 ml-2 flex-shrink-0"></div>
                  <span>رسید پرداخت به ایمیل شما ارسال خواهد شد</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 ml-2 flex-shrink-0"></div>
                  <span>در صورت نیاز به پشتیبانی، شماره سفارش خود را ذکر کنید</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 ml-2 flex-shrink-0"></div>
                  <span>محصولات شما در کمتر از 24 ساعت فعال خواهند شد</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
