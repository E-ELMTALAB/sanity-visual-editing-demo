"use client"
import Link from "next/link"
import { useState } from "react"
import MobileMenu from "../../components/mobile-menu"
import Footer from "@/components/footer"

export default function AboutPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "", confirmPassword: "" })
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [user, setUser] = useState({ name: "مهدی", email: "mehdi@example.com" })
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleProfileClick = () => {
    if (isAuthenticated) {
      setIsProfileDropdownOpen(!isProfileDropdownOpen)
    } else {
      setIsLoginModalOpen(true)
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setIsProfileDropdownOpen(false)
  }

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      {/* Header Section */}
      <header className="sticky top-0 z-50 glassmorphism">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center">
              {/* Mobile Menu Button */}
              <button
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

              {/* Logo and Name */}
              <Link
                href="/"
                className="relative flex items-center space-x-2 sm:space-x-4 space-x-reverse cursor-pointer"
              >
                <div className="relative flex items-center space-x-2 sm:space-x-4 space-x-reverse">
                  <img
                    src="/images/design-mode/Group%201(1).png"
                    alt="SharifGPT Logo"
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                  />
                  <h1 className="text-lg sm:text-xl font-bold text-gray-800">SharifGPT</h1>
                </div>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center space-x-2 space-x-reverse">
              <div className="h-8 border-l border-gray-300"></div>
              <Link
                href="/products"
                className="text-gray-700 hover:text-[#3092BE] transition-all duration-300 px-3 py-2 rounded-lg text-sm font-medium transform hover:scale-105 hover:shadow-[0_0_15px_rgba(48,146,190,0.3)]"
              >
                محصولات
              </Link>
              <Link
                href="/courses"
                className="text-gray-700 hover:text-[#3092BE] transition-all duration-300 px-3 py-2 rounded-lg text-sm font-medium transform hover:scale-105 hover:shadow-[0_0_15px_rgba(48,146,190,0.3)]"
              >
                دوره‌ها
              </Link>
              <Link
                href="/enterprise"
                className="text-gray-700 hover:text-[#3092BE] transition-all duration-300 px-3 py-2 rounded-lg text-sm font-medium transform hover:scale-105 hover:shadow-[0_0_15px_rgba(48,146,190,0.3)] whitespace-nowrap"
              >
                فروش سازمانی
              </Link>
              <Link
                href="/blog"
                className="text-gray-700 hover:text-[#3092BE] transition-all duration-300 px-3 py-2 rounded-lg text-sm font-medium transform hover:scale-105 hover:shadow-[0_0_15px_rgba(48,146,190,0.3)]"
              >
                بلاگ
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-3 sm:space-x-5 space-x-reverse">
              {/* Search Box */}
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

              {/* Contact */}
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

              <div className="relative">
                <div
                  className="flex items-center space-x-3 space-x-reverse cursor-pointer"
                  onClick={handleProfileClick}
                >
                  <div className="relative transition-transform duration-300 transform hover:scale-110">
                    <img
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white shadow-md object-cover"
                      src={
                        isAuthenticated
                          ? "https://i.imgur.com/3Y1Z0Qj.png"
                          : "data:image/svg+xml,%3csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='40' height='40' fill='%23E5E7EB' rx='20'/%3e%3cpath d='M20 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 22a8 8 0 1 1 16 0v2H12v-2z' fill='%233B82F6'/%3e%3c/svg%3e"
                      }
                      alt="آواتار کاربر"
                    />
                  </div>
                  <div className="relative transition-transform duration-300 transform hover:scale-110">
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 border-[#3092BE] flex items-center justify-center bg-white shadow-sm">
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full h-px bg-gray-200"></div>
        </div>

        <MobileMenu isOpen={isMobileMenuOpen} onClose={handleMobileMenuClose} />
      </header>

      {/* Main Content */}
      <main className="relative">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-white to-blue-50"></div>
          <div className="absolute inset-0 bg-[url('/abstract-tech-pattern.png')] opacity-10"></div>

          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-sm font-medium mb-8">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              درباره شریف جی پی تی
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              آینده هوش مصنوعی
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                در دستان شما
              </span>
            </h1>

            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-12 leading-relaxed">
              ما در شریف جی پی تی با هدف دموکراتیزه کردن دسترسی به فناوری‌های هوش مصنوعی و ارائه خدمات قانونی و مطمئن
              تأسیس شده‌ایم
            </p>
          </div>
        </section>

        {/* Company History Section */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-8 lg:p-12 mb-16 shadow-xl">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">تاریخچه تأسیس شریف جی پی تی</h2>
              </div>

              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    شریف جی پی تی در سال ۱۴۰۲ با هدف ارائه دسترسی آسان و قانونی به خدمات هوش مصنوعی برای کاربران ایرانی
                    تأسیس شد. ما با درک نیاز جامعه به ابزارهای پیشرفته هوش مصنوعی، تصمیم گرفتیم پلی میان فناوری‌های روز
                    دنیا و کاربران داخلی باشیم.
                  </p>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    از همان ابتدا، تمرکز ما بر ارائه خدمات با کیفیت، پشتیبانی ۲۴ ساعته و رعایت کامل قوانین و مقررات بوده
                    است. امروز با افتخار خدمات خود را به هزاران کاربر در سراسر کشور ارائه می‌دهیم.
                  </p>
                </div>
                <div className="relative">
                  <img
                    src="/modern-office-building-innovation.jpg"
                    alt="ساختمان شریف جی پی تی"
                    className="rounded-2xl shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-100/50 to-transparent rounded-2xl"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">خدمات ما</h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                ما طیف گسترده‌ای از خدمات هوش مصنوعی و آموزشی را با بالاترین کیفیت ارائه می‌دهیم
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Legal Payments Service */}
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">پرداخت قانونی اشتراک‌ها</h3>
                <p className="text-gray-700 leading-relaxed">
                  تمامی اشتراک‌های ChatGPT، Claude، Midjourney و سایر سرویس‌های هوش مصنوعی را به صورت کاملاً قانونی و با
                  ضمانت ارائه می‌دهیم.
                </p>
              </div>

              {/* AI Services */}
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">خدمات هوش مصنوعی</h3>
                <p className="text-gray-700 leading-relaxed">
                  دسترسی به جدیدترین مدل‌های هوش مصنوعی شامل GPT-4، Claude 3، Gemini و ابزارهای تولید تصویر و ویدیو.
                </p>
              </div>

              {/* Educational Courses */}
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">دوره‌های آموزشی</h3>
                <p className="text-gray-700 leading-relaxed">
                  برگزاری دوره‌های تخصصی هوش مصنوعی، برنامه‌نویسی، طراحی UI/UX و مهارت‌های دیجیتال با اساتید مجرب.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-8 lg:p-12 shadow-xl">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">چرا به ما اعتماد کنید؟</h2>
                <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                  اعتماد شما برای ما بسیار ارزشمند است و ما هر روز برای حفظ آن تلاش می‌کنیم
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">قانونی ۱۰۰٪</h3>
                  <p className="text-gray-700 text-sm">تمام خدمات ما کاملاً قانونی و مطابق با مقررات</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">پشتیبانی ۲۴/۷</h3>
                  <p className="text-gray-700 text-sm">پشتیبانی شبانه‌روزی برای حل مشکلات شما</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">سرعت بالا</h3>
                  <p className="text-gray-700 text-sm">ارائه سریع خدمات بدون تأخیر</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">امنیت کامل</h3>
                  <p className="text-gray-700 text-sm">حفاظت کامل از اطلاعات شخصی شما</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Media Cards */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">ما را دنبال کنید</h2>
              <p className="text-xl text-gray-700">در شبکه‌های اجتماعی با ما همراه باشید</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Telegram Card */}
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                    <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.12-.05-.17-.06-.05-.14-.03-.2-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.37.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24-.02.37z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">تلگرام</h3>
                  <p className="text-gray-700 mb-6">کانال رسمی شریف جی پی تی</p>
                  <a
                    href="#"
                    className="inline-flex items-center px-6 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl transition-colors"
                  >
                    <span>مشاهده کانال</span>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Instagram Card */}
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-purple-200 group-hover:to-pink-200 transition-colors">
                    <svg className="w-10 h-10 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.259.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">اینستاگرام</h3>
                  <p className="text-gray-700 mb-6">صفحه رسمی شریف جی پی تی</p>
                  <a
                    href="#"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 text-pink-700 rounded-xl transition-colors"
                  >
                    <span>مشاهده صفحه</span>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              </div>

              {/* YouTube Card */}
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                <div className="text-center">
                  <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-red-200 transition-colors">
                    <svg className="w-10 h-10 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">یوتیوب</h3>
                  <p className="text-gray-700 mb-6">کانال آموزشی شریف جی پی تی</p>
                  <a
                    href="#"
                    className="inline-flex items-center px-6 py-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl transition-colors"
                  >
                    <span>مشاهده کانال</span>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">تیم ما</h2>
              <p className="text-xl text-gray-700">افرادی که شریف جی پی تی را می‌سازند</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
              {/* Founder */}
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="relative mb-6">
                  <img
                    src="/professional-male-portrait.png"
                    alt="امیرحسین علم طلب"
                    className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-blue-200"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">امیرحسین علم طلب</h3>
                <p className="text-blue-600 mb-4">بنیان‌گذار و مدیرعامل</p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  بنیان‌گذار شریف جی پی تی با بیش از ۵ سال تجربه در حوزه هوش مصنوعی و کسب‌وکار دیجیتال
                </p>
              </div>

              {/* Developer */}
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="relative mb-6">
                  <img
                    src="/professional-male-developer.png"
                    alt="عرفان علم طلب"
                    className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-purple-200"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">عرفان علم طلب</h3>
                <p className="text-purple-600 mb-4">توسعه‌دهنده و پشتیبان سایت</p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  توسعه‌دهنده ارشد فول‌استک و مسئول پشتیبانی فنی سایت با تخصص در React و Node.js
                </p>
              </div>

              {/* Support */}
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="relative mb-6">
                  <img
                    src="/professional-female-support-portrait.jpg"
                    alt="مژده مشاعی"
                    className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-pink-200"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">مژده مشاعی</h3>
                <p className="text-pink-600 mb-4">مسئول پشتیبانی</p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  مسئول پشتیبانی مشتریان و ارائه راهنمایی‌های فنی با بیش از ۳ سال تجربه در خدمات مشتریان
                </p>
              </div>

              {/* Supplier */}
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="relative mb-6">
                  <img
                    src="/professional-male-supplier.jpg"
                    alt="آرش حضوری"
                    className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-green-200"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zM3 15a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1H4a1 1 0 01-1-1v-1zm6-11a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V4zm6 10a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">آرش حضوری</h3>
                <p className="text-green-600 mb-4">تامین‌کننده محصولات</p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  مسئول تامین و تهیه محصولات و خدمات هوش مصنوعی با شبکه گسترده از تامین‌کنندگان معتبر
                </p>
              </div>

              {/* Designer & Developer */}
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="relative mb-6">
                  <img
                    src="/professional-male-designer.jpg"
                    alt="مهدی محمدخانی"
                    className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-orange-200"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 111.414 1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15.586 13H14a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">مهدی محمدخانی</h3>
                <p className="text-orange-600 mb-4">طراح و توسعه‌دهنده محصولات</p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  طراح UI/UX و توسعه‌دهنده محصولات با تخصص در طراحی تجربه کاربری و توسعه اپلیکیشن‌های موبایل
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact & Office Info */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-8 lg:p-12 shadow-xl">
              <div className="grid lg:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">اطلاعات تماس</h2>

                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4 mt-1">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">آدرس دفتر</h3>
                        <p className="text-gray-700">
                          تهران، میدان آزادی، کارخانه نوآوری
                          <br />
                          طبقه ۳، واحد ۱۲
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4 mt-1">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">شماره تماس</h3>
                        <p className="text-gray-700 font-mono">۰۲۱-۱۲۳۴۵۶۷۸</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4 mt-1">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">ایمیل</h3>
                        <p className="text-gray-700">info@sharifgpt.ir</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">چرا شریف جی پی تی؟</h2>

                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 mt-1">
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">تجربه کاربری عالی</h3>
                        <p className="text-gray-700 text-sm">رابط کاربری ساده و کاربردی برای همه سطوح</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3 mt-1">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">قیمت‌های مناسب</h3>
                        <p className="text-gray-700 text-sm">بهترین قیمت‌ها در بازار با کیفیت بالا</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3 mt-1">
                        <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">به‌روزرسانی مداوم</h3>
                        <p className="text-gray-700 text-sm">همیشه جدیدترین ویژگی‌ها و بهبودها</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3 mt-1">
                        <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">جامعه فعال</h3>
                        <p className="text-gray-700 text-sm">بخشی از جامعه بزرگ کاربران و توسعه‌دهندگان</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Support Contact Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-8 lg:p-12 text-center shadow-xl">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">نیاز به پشتیبانی دارید؟</h2>
                <p className="text-xl text-gray-700 mb-12">
                  تیم پشتیبانی ما آماده کمک به شما در تمام ساعات شبانه‌روز است
                </p>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.12-.05-.17-.06-.05-.14-.03-.2-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.37.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24-.02.37z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">تلگرام</h3>
                    <p className="text-gray-700 text-sm">پشتیبانی سریع در تلگرام</p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">ایمیل</h3>
                    <p className="text-gray-700 text-sm">support@sharifgpt.ir</p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">چت آنلاین</h3>
                    <p className="text-gray-700 text-sm">گفتگوی زنده در سایت</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="#"
                    className="inline-flex items-center justify-center px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors"
                  >
                    <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.12-.05-.17-.06-.05-.14-.03-.2-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.37.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24-.02.37z" />
                    </svg>
                    شروع گفتگو در تلگرام
                  </a>
                  <a
                    href="mailto:support@sharifgpt.ir"
                    className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-gray-300 hover:border-gray-400 text-gray-700 rounded-xl font-semibold transition-colors"
                  >
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    ارسال ایمیل
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
