"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { useZarinpalPayment } from "@/hooks/use-zarinpal-payment"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Shield, BookOpen, Package, CreditCard, Phone, Mail, User } from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import MobileMenu from "@/components/mobile-menu"
import CartDropdown from "@/components/cart-dropdown"

// Sample course data for recommendations
const relatedCourses = [
  {
    id: 1,
    title: "دوره جامع ChatGPT",
    price: 299000,
    originalPrice: 399000,
    discount: 25,
    image: "/placeholder-p7dui.png",
    duration: "12 ساعت",
    students: 1250,
  },
  {
    id: 2,
    title: "آموزش Claude Pro",
    price: 199000,
    originalPrice: 299000,
    discount: 33,
    image: "/claude-course.jpg",
    duration: "8 ساعت",
    students: 890,
  },
  {
    id: 3,
    title: "هوش مصنوعی برای کسب و کار",
    price: 499000,
    originalPrice: 699000,
    discount: 28,
    image: "/ai-business-course.png",
    duration: "20 ساعت",
    students: 2100,
  },
]

// Sample package deals
const packageDeals = [
  {
    id: 1,
    title: "پکیج کامل هوش مصنوعی",
    items: ["ChatGPT Plus", "Claude Pro", "دوره جامع AI"],
    originalPrice: 1200000,
    packagePrice: 899000,
    savings: 301000,
    profit: "25% سود بیشتر",
  },
  {
    id: 2,
    title: "پکیج حرفه‌ای",
    items: ["ChatGPT Plus", "دوره ChatGPT", "پشتیبانی VIP"],
    originalPrice: 800000,
    packagePrice: 599000,
    savings: 201000,
    profit: "33% سود بیشتر",
  },
]

export default function CheckoutPage() {
  const { state, setMedusaCartId } = useCart()
  const { initiatePayment, status: paymentStatus } = useZarinpalPayment()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })
  const [upsells, setUpsells] = useState({
    insurance: false,
    warranty: false,
    priority: false,
  })
  const [selectedCourses, setSelectedCourses] = useState<number[]>([])
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false)
  const [cartState, setCartState] = useState({
    itemCount: state.items.reduce((total, item) => total + item.quantity, 0),
  })

  const handleCartClick = () => {
    setIsCartDropdownOpen(!isCartDropdownOpen)
  }

  const handleProfileClick = () => {
    // Profile click handler
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString("fa-IR")
  }

  const calculateUpsellPrice = () => {
    let total = 0
    if (upsells.insurance) total += 50000
    if (upsells.warranty) total += 75000
    if (upsells.priority) total += 100000
    return total
  }

  const calculateCourseDiscount = () => {
    return selectedCourses.reduce((total, courseId) => {
      const course = relatedCourses.find((c) => c.id === courseId)
      return total + (course ? course.originalPrice - course.price : 0)
    }, 0)
  }

  const calculatePackagePrice = () => {
    if (!selectedPackage) return 0
    const package_ = packageDeals.find((p) => p.id === selectedPackage)
    return package_ ? package_.packagePrice : 0
  }

  const calculateTotal = () => {
    const cartTotal = state.total
    const upsellTotal = calculateUpsellPrice()
    const courseTotal = selectedCourses.reduce((total, courseId) => {
      const course = relatedCourses.find((c) => c.id === courseId)
      return total + (course ? course.price : 0)
    }, 0)
    const packageTotal = calculatePackagePrice()

    return cartTotal + upsellTotal + courseTotal + packageTotal
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handlePayment = async () => {
    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      alert('لطفاً تمام فیلدهای ضروری را پر کنید')
      return
    }

    if (!formData.email.includes('@')) {
      alert('لطفاً یک ایمیل معتبر وارد کنید')
      return
    }

    setIsProcessingPayment(true)

    try {
      const result = await initiatePayment(
        state.items,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        },
        upsells
      )

      if (result.success && result.paymentUrl && result.resourceId) {
        // Store Medusa resource ID
        setMedusaCartId(result.resourceId)
        try { localStorage.setItem('pending_resource_id', result.resourceId) } catch {}
        
        // Redirect to Zarinpal payment gateway
        window.location.href = result.paymentUrl
      } else {
        alert(result.error || 'خطا در شروع فرآیند پرداخت')
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('خطا در شروع فرآیند پرداخت')
    } finally {
      setIsProcessingPayment(false)
    }
  }

  const handleUpsellChange = (type: keyof typeof upsells) => {
    setUpsells({
      ...upsells,
      [type]: !upsells[type],
    })
  }

  const toggleCourse = (courseId: number) => {
    setSelectedCourses((prev) => (prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]))
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="glassmorphism-light max-w-md w-full mx-4">
          <CardContent className="text-center p-8">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">سبد خرید خالی است</h2>
            <p className="text-gray-600 mb-6">برای ادامه خرید، محصولی به سبد خرید اضافه کنید</p>
            <Link href="/products">
              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                مشاهده محصولات
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <header className="sticky top-0 z-50 glassmorphism">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center">
              <button
                id="mobileMenuButton"
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors ml-2"
                aria-label="باز کردن منو"
              >
                <div className="w-6 h-6 flex flex-col justify-center items-center space-y-1">
                  <div className="w-5 h-0.5 bg-gray-600 transition-colors hover:bg-blue-600"></div>
                  <div className="w-5 h-0.5 bg-gray-600 transition-colors hover:bg-blue-600"></div>
                  <div className="w-5 h-0.5 bg-gray-600 transition-colors hover:bg-blue-600"></div>
                </div>
              </button>

              <Link
                href="/"
                className="relative flex items-center space-x-2 sm:space-x-4 space-x-reverse cursor-pointer"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden shadow-lg">
                  <img
                    src="/images/design-mode/Group%201(2).png"
                    alt="SharifGPT Logo"
                    width="40"
                    height="40"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-800">SharifGPT</h1>
              </Link>
            </div>

            <nav className="hidden lg:flex items-center space-x-2 space-x-reverse">
              <div className="h-8 border-l border-gray-300"></div>
              <div className="relative group">
                <Link
                  href="/products"
                  className="flex items-center text-gray-700 hover:text-[#3092BE] transition-all duration-300 px-3 py-2 rounded-lg text-sm font-medium transform hover:scale-105 hover:shadow-[0_0_15px_rgba(48,146,190,0.3)]"
                >
                  <span>محصولات</span>
                  <svg
                    className="w-4 h-4 mr-1 transition-transform duration-200 group-hover:rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>

              <div className="relative group">
                <Link
                  href="/courses"
                  className="flex items-center text-gray-700 hover:text-[#3092BE] transition-all duration-300 px-3 py-2 rounded-lg text-sm font-medium transform hover:scale-105 hover:shadow-[0_0_15px_rgba(48,146,190,0.3)]"
                >
                  <span>دوره‌ها</span>
                  <svg
                    className="w-4 h-4 mr-1 transition-transform duration-200 group-hover:rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
              <Link
                href="/enterprise"
                className="flex items-center text-gray-700 hover:text-[#3092BE] transition-all duration-300 px-3 py-2 rounded-lg text-sm font-medium transform hover:scale-105 hover:shadow-[0_0_15px_rgba(48,146,190,0.3)] whitespace-nowrap"
              >
                <span>فروش سازمانی</span>
                <svg
                  className="w-4 h-4 mr-1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link
                href="/blog"
                className="text-gray-700 hover:text-[#3092BE] transition-all duration-300 px-3 py-2 rounded-lg text-sm font-medium transform hover:scale-105 hover:shadow-[0_0_15px_rgba(48,146,190,0.3)]"
              >
                مجله
              </Link>
            </nav>

            <div className="flex items-center space-x-3 sm:space-x-5 space-x-reverse">
              <div className="relative hidden xl:block">
                <input
                  type="text"
                  placeholder="جستجو..."
                  className="w-40 xl:w-48 bg-gray-100 border border-[#3092BE] rounded-full py-2 pr-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3092BE] transition-all duration-300 ease-in-out hover:w-48 xl:hover:w-60 focus:w-48 xl:focus:w-60"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
              </div>

              <div className="hidden md:flex items-center space-x-2 space-x-reverse border-l border-gray-300 pl-3 sm:pl-5">
                <div className="text-right">
                  <div className="flex items-center justify-end">
                    <a
                      href="/contact"
                      className="text-xs sm:text-sm font-semibold text-gray-700 hover:text-[#3092BE] transition-colors cursor-pointer"
                    >
                      تماس با ما
                    </a>
                    <span className="relative flex h-2 w-2 sm:h-3 sm:w-3 mr-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 sm:h-3 sm:w-3 bg-green-500"></span>
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">وضعیت: آنلاین</p>
                </div>
              </div>

              <div className="relative" id="profileContainer">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="relative" id="cartContainer">
                    <div
                      className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 border-[#3092BE] flex items-center justify-center bg-white shadow-sm cursor-pointer transition-transform duration-300 transform hover:scale-110"
                      onClick={handleCartClick}
                    >
                      <svg
                        className="h-4 w-4 sm:h-5 sm:w-5 text-[#3092BE]"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                      </svg>
                      {cartState.itemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                          {cartState.itemCount}
                        </span>
                      )}
                    </div>
                    <CartDropdown isOpen={isCartDropdownOpen} onClose={() => setIsCartDropdownOpen(false)} />
                  </div>

                  <div className="relative">
                    <div
                      className="cursor-pointer transition-transform duration-300 transform hover:scale-110"
                      onClick={handleProfileClick}
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg border-2 border-white">
                        {isAuthenticated ? (
                          <img
                            className="w-full h-full rounded-full object-cover"
                            src="/images/design-mode/3Y1Z0Qj(2).png"
                            alt="آواتار کاربر"
                          />
                        ) : (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 sm:w-5 sm:h-5"
                          >
                            <path
                              d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                              fill="white"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600 mb-8">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              خانه
            </Link>
            <ArrowRight className="w-4 h-4" />
            <Link href="/products" className="hover:text-blue-600 transition-colors">
              محصولات
            </Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-gray-800 font-medium">تسویه حساب</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card className="glassmorphism-light border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl font-bold text-gray-800">
                    <User className="w-6 h-6 ml-3 text-blue-600" />
                    اطلاعات تماس
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-gray-700 font-medium">
                        نام
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="mt-1 glassmorphism-light border-gray-200"
                        placeholder="نام خود را وارد کنید"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-gray-700 font-medium">
                        نام خانوادگی
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="mt-1 glassmorphism-light border-gray-200"
                        placeholder="نام خانوادگی خود را وارد کنید"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email" className="text-gray-700 font-medium flex items-center">
                        <Mail className="w-4 h-4 ml-2" />
                        ایمیل
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 glassmorphism-light border-gray-200"
                        placeholder="example@email.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-gray-700 font-medium flex items-center">
                        <Phone className="w-4 h-4 ml-2" />
                        شماره تماس
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="mt-1 glassmorphism-light border-gray-200"
                        placeholder="09123456789"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glassmorphism-light border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl font-bold text-gray-800">
                    <Shield className="w-6 h-6 ml-3 text-green-600" />
                    خدمات اضافی
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3 space-x-reverse p-4 rounded-xl glassmorphism-light border border-gray-200">
                    <Checkbox
                      id="insurance"
                      checked={upsells.insurance}
                      onCheckedChange={() => handleUpsellChange("insurance")}
                    />
                    <div className="flex-1">
                      <Label htmlFor="insurance" className="text-gray-800 font-medium cursor-pointer">
                        بیمه اکانت (۵۰,۰۰۰ تومان)
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">
                        در صورت مسدود شدن اکانت، اکانت جدید رایگان دریافت کنید
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      محبوب
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-3 space-x-reverse p-4 rounded-xl glassmorphism-light border border-gray-200">
                    <Checkbox
                      id="warranty"
                      checked={upsells.warranty}
                      onCheckedChange={() => handleUpsellChange("warranty")}
                    />
                    <div className="flex-1">
                      <Label htmlFor="warranty" className="text-gray-800 font-medium cursor-pointer">
                        ضمانت کیفیت (۷۵,۰۰۰ تومان)
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">۳۰ روز ضمانت بازگشت وجه در صورت عدم رضایت</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 space-x-reverse p-4 rounded-xl glassmorphism-light border border-gray-200">
                    <Checkbox
                      id="priority"
                      checked={upsells.priority}
                      onCheckedChange={() => handleUpsellChange("priority")}
                    />
                    <div className="flex-1">
                      <Label htmlFor="priority" className="text-gray-800 font-medium cursor-pointer">
                        پشتیبانی اولویت‌دار (۱۰۰,۰۰۰ تومان)
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">پاسخ‌گویی در کمتر از ۲ ساعت و پشتیبانی اختصاصی</p>
                    </div>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                      VIP
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="glassmorphism-light border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl font-bold text-gray-800">
                    <BookOpen className="w-6 h-6 ml-3 text-orange-600" />
                    دوره‌های مرتبط با تخفیف ویژه
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={1}
                    breakpoints={{
                      640: { slidesPerView: 2 },
                      1024: { slidesPerView: 2 },
                    }}
                    navigation
                    pagination={{ clickable: true }}
                    className="course-swiper"
                  >
                    {relatedCourses.map((course) => (
                      <SwiperSlide key={course.id}>
                        <div
                          className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                            selectedCourses.includes(course.id)
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 glassmorphism-light hover:border-blue-300"
                          }`}
                          onClick={() => toggleCourse(course.id)}
                        >
                          <img
                            src={course.image || "/placeholder.svg"}
                            alt={course.title}
                            loading="lazy"
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                          <h3 className="font-bold text-gray-800 mb-2">{course.title}</h3>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
                              <span>{course.duration}</span>
                              <span>•</span>
                              <span>{course.students.toLocaleString("fa-IR")} دانشجو</span>
                            </div>
                            <Badge className="bg-red-100 text-red-700">{course.discount}% تخفیف</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-lg font-bold text-blue-600">{formatPrice(course.price)} تومان</span>
                              <span className="text-sm text-gray-400 line-through mr-2">
                                {formatPrice(course.originalPrice)}
                              </span>
                            </div>
                            {selectedCourses.includes(course.id) && (
                              <Badge className="bg-green-100 text-green-700">انتخاب شده</Badge>
                            )}
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </CardContent>
              </Card>

              <Card className="glassmorphism-light border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl font-bold text-gray-800">
                    <Package className="w-6 h-6 ml-3 text-purple-600" />
                    پکیج‌های ویژه
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {packageDeals.map((package_) => (
                    <div
                      key={package_.id}
                      className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${
                        selectedPackage === package_.id
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 glassmorphism-light hover:border-purple-300"
                      }`}
                      onClick={() => setSelectedPackage(selectedPackage === package_.id ? null : package_.id)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800 mb-2">{package_.title}</h3>
                          <div className="space-y-1">
                            {package_.items.map((item, index) => (
                              <div key={index} className="flex items-center text-sm text-gray-600">
                                <div className="w-2 h-2 bg-purple-500 rounded-full ml-2"></div>
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>
                        <Badge className="bg-purple-100 text-purple-700">{package_.profit}</Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xl font-bold text-purple-600">
                            {formatPrice(package_.packagePrice)} تومان
                          </span>
                          <span className="text-sm text-gray-400 line-through mr-2">
                            {formatPrice(package_.originalPrice)}
                          </span>
                        </div>
                        <div className="text-left">
                          <div className="text-sm text-gray-600">صرفه‌جویی:</div>
                          <div className="text-lg font-bold text-green-600">{formatPrice(package_.savings)} تومان</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="glassmorphism-light border-0 shadow-xl sticky top-24">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-800">خلاصه سفارش</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {state.items.map((item) => (
                      <div
                        key={`${item.id}-${item.selectedOption}`}
                        className="flex items-center space-x-3 space-x-reverse"
                      >
                        <img
                          src={item.image || "/placeholder.svg?height=50&width=50&query=product"}
                          alt={item.title}
                          loading="lazy"
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 text-sm">{item.title}</h4>
                          {item.selectedOption && <p className="text-xs text-gray-600">{item.selectedOption}</p>}
                          <p className="text-sm text-blue-600 font-medium">
                            {formatPrice(item.price)} تومان × {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">جمع محصولات:</span>
                      <span className="font-medium">{formatPrice(state.total)} تومان</span>
                    </div>

                    {calculateUpsellPrice() > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">خدمات اضافی:</span>
                        <span className="font-medium text-green-600">+{formatPrice(calculateUpsellPrice())} تومان</span>
                      </div>
                    )}

                    {selectedCourses.length > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">دوره‌های انتخابی:</span>
                        <span className="font-medium text-orange-600">
                          +
                          {formatPrice(
                            selectedCourses.reduce((total, courseId) => {
                              const course = relatedCourses.find((c) => c.id === courseId)
                              return total + (course ? course.price : 0)
                            }, 0),
                          )}{" "}
                          تومان
                        </span>
                      </div>
                    )}

                    {selectedPackage && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">پکیج ویژه:</span>
                        <span className="font-medium text-purple-600">
                          +{formatPrice(calculatePackagePrice())} تومان
                        </span>
                      </div>
                    )}

                    {(calculateCourseDiscount() > 0 || selectedPackage) && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">تخفیف:</span>
                        <span className="font-medium text-red-600">
                          -
                          {formatPrice(
                            calculateCourseDiscount() +
                              (selectedPackage ? packageDeals.find((p) => p.id === selectedPackage)?.savings || 0 : 0),
                          )}{" "}
                          تومان
                        </span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>مجموع نهایی:</span>
                    <span className="text-blue-600">{formatPrice(calculateTotal())} تومان</span>
                  </div>

                  <Button 
                    onClick={handlePayment}
                    disabled={isProcessingPayment || paymentStatus.loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessingPayment || paymentStatus.loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                        در حال پردازش...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 ml-2" />
                        پرداخت نهایی
                      </>
                    )}
                  </Button>

                  <div className="mt-4 rounded-2xl border border-red-300 bg-red-50 p-4 text-sm text-red-900">
                    <p className="font-semibold text-base">توجه بسیار مهم قبل از پرداخت</p>
                    <p className="mt-2">لطفاً پس از کلیک روی دکمه‌ی <strong>پرداخت نهایی</strong> کمی صبر کنید تا به صفحه پرداخت هدایت شوید.</p>
                    <p className="mt-2">برای ادامه پرداخت حتماً <strong>VPN خود را خاموش کنید</strong> و پس از اتمام پرداخت می‌توانید دوباره VPN را روشن کنید.</p>
                    <p className="mt-2">در صورت هرگونه مشکل یا سوال، از طریق بله با ما تماس بگیرید:</p>
                    <p className="mt-2 font-semibold text-blue-700"><a href="https://ble.ir/sharifgptadmin" target="_blank" rel="noreferrer">https://ble.ir/sharifgptadmin</a></p>
                  </div>

                  <div className="text-xs text-gray-500 text-center mt-4">
                    با تکمیل خرید، شما با
                    <Link href="/terms" className="text-blue-600 hover:underline mx-1">
                      قوانین و مقررات
                    </Link>
                    موافقت می‌کنید
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 space-x-reverse mb-4">
                <img
                  src="/images/design-mode/Group%201(2).png"
                  alt="SharifGPT Logo"
                  className="w-10 h-10 rounded-full"
                />
                <h3 className="text-xl font-bold">SharifGPT</h3>
              </div>
              <p className="text-gray-400 text-sm">ارائه دهنده برترین اکانت‌ها و دوره‌های آموزشی هوش مصنوعی</p>
            </div>

            <div>
              <h4 className="font-bold mb-4">دسترسی سریع</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/products" className="hover:text-white transition-colors">
                    محصولات
                  </Link>
                </li>
                <li>
                  <Link href="/courses" className="hover:text-white transition-colors">
                    دوره‌ها
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    درباره ما
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    تماس با ما
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">پشتیبانی</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/support" className="hover:text-white transition-colors">
                    مرکز پشتیبانی
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white transition-colors">
                    سوالات متداول
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    قوانین و مقررات
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    حریم خصوصی
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">تماس با ما</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 ml-2" />
                  support@sharifgpt.com
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 ml-2" />
                  ۰۲۱-۱۲۳۴۵۶۷۸
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-8 bg-gray-700" />

          <div className="text-center text-sm text-gray-400">© ۱۴۰۳ SharifGPT. تمامی حقوق محفوظ است.</div>
        </div>
      </footer>
    </div>
  )
}
