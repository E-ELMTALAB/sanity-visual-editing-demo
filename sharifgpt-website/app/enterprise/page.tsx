"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import MobileMenu from "../../components/mobile-menu" // Fixed import path to correct location

export default function Enterprise() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [user, setUser] = useState({ name: "مهدی", email: "mehdi@example.com" })
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false) // Added mobile menu state

  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    position: "",
    teamSize: "",
    interestedProducts: "",
    budget: "",
    timeline: "",
    notes: "",
  })

  const handleProfileClick = () => {
    if (isAuthenticated) {
      setIsProfileDropdownOpen(!isProfileDropdownOpen)
    } else {
      window.location.href = "/login"
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setIsProfileDropdownOpen(false)
    setUser({ name: "", email: "" })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Enterprise form submitted:", formData)
    alert("درخواست شما با موفقیت ثبت شد. تیم ما در اسرع وقت با شما تماس خواهد گرفت.")
    // Reset form
    setFormData({
      companyName: "",
      contactPerson: "",
      email: "",
      phone: "",
      position: "",
      teamSize: "",
      interestedProducts: "",
      budget: "",
      timeline: "",
      notes: "",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
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
              <Link href="/" className="flex items-center space-x-2 sm:space-x-4 space-x-reverse cursor-pointer">
                <img
                  src="/images/design-mode/Group%201(1).png"
                  alt="SharifGPT Logo"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                />
                <h1 className="text-lg sm:text-xl font-bold text-gray-800">SharifGPT</h1>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center space-x-2 space-x-reverse">
              <div className="h-8 border-l border-gray-300"></div>
              <Link
                href="/products"
                className="text-gray-700 hover:text-[#3092BE] transition-all duration-300 px-3 py-2 rounded-lg text-sm font-medium"
              >
                محصولات
              </Link>
              <Link
                href="/courses"
                className="text-gray-700 hover:text-[#3092BE] transition-all duration-300 px-3 py-2 rounded-lg text-sm font-medium"
              >
                دوره‌ها
              </Link>
              <Link
                href="/blog"
                className="text-gray-700 hover:text-[#3092BE] transition-all duration-300 px-3 py-2 rounded-lg text-sm font-medium"
              >
                مجله
              </Link>
              <Link
                href="/enterprise"
                className="text-[#3092BE] bg-blue-50 transition-all duration-300 px-3 py-2 rounded-lg text-sm font-medium"
              >
                فروش سازمانی
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-[#3092BE] transition-all duration-300 px-3 py-2 rounded-lg text-sm font-medium"
              >
                تماس با ما
              </Link>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4 space-x-reverse">
              <button className="p-2 text-gray-600 hover:text-[#3092BE] transition-colors duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>

              <div className="relative">
                <button
                  onClick={handleProfileClick}
                  className="flex items-center space-x-2 space-x-reverse p-2 text-gray-600 hover:text-[#3092BE] transition-colors duration-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  {isAuthenticated && <span className="text-sm font-medium">{user.name}</span>}
                </button>

                {isAuthenticated && isProfileDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      پروفایل
                    </Link>
                    <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      سفارشات
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      خروج
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Component */}
        <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      </header>

      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-cyan-500/5 to-teal-400/10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-800 mb-6 leading-tight">
              فروش سازمانی
              <span className="block text-2xl sm:text-3xl lg:text-4xl font-bold text-[#3092BE] mt-2">
                راه‌حل‌های هوش مصنوعی برای سازمان شما
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed font-medium">
              با خرید گروهی محصولات هوش مصنوعی، تیم خود را به آینده متصل کنید
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-4">درخواست مشاوره رایگان</h2>
              <p className="text-lg text-gray-600 font-medium">اطلاعات خود را وارد کنید تا تیم ما با شما تماس بگیرد</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-semibold text-gray-700 mb-2">
                    نام شرکت/سازمان *
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3092BE] focus:border-transparent transition-all duration-200 font-medium"
                    placeholder="نام شرکت یا سازمان خود را وارد کنید"
                  />
                </div>

                <div>
                  <label htmlFor="contactPerson" className="block text-sm font-semibold text-gray-700 mb-2">
                    نام و نام خانوادگی *
                  </label>
                  <input
                    type="text"
                    id="contactPerson"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3092BE] focus:border-transparent transition-all duration-200 font-medium"
                    placeholder="نام کامل خود را وارد کنید"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    ایمیل *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3092BE] focus:border-transparent transition-all duration-200 font-medium"
                    placeholder="example@company.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    شماره تماس *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3092BE] focus:border-transparent transition-all duration-200 font-medium"
                    placeholder="09123456789"
                  />
                </div>

                <div>
                  <label htmlFor="position" className="block text-sm font-semibold text-gray-700 mb-2">
                    سمت شغلی
                  </label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3092BE] focus:border-transparent transition-all duration-200 font-medium"
                    placeholder="مدیر فناوری، مدیر عامل، ..."
                  />
                </div>

                <div>
                  <label htmlFor="teamSize" className="block text-sm font-semibold text-gray-700 mb-2">
                    تعداد اعضای تیم
                  </label>
                  <select
                    id="teamSize"
                    name="teamSize"
                    value={formData.teamSize}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3092BE] focus:border-transparent transition-all duration-200 font-medium"
                  >
                    <option value="">انتخاب کنید</option>
                    <option value="1-10">1-10 نفر</option>
                    <option value="11-50">11-50 نفر</option>
                    <option value="51-200">51-200 نفر</option>
                    <option value="200+">بیش از 200 نفر</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="interestedProducts" className="block text-sm font-semibold text-gray-700 mb-2">
                    محصولات مورد علاقه
                  </label>
                  <select
                    id="interestedProducts"
                    name="interestedProducts"
                    value={formData.interestedProducts}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3092BE] focus:border-transparent transition-all duration-200 font-medium"
                  >
                    <option value="">انتخاب کنید</option>
                    <option value="chatgpt">ChatGPT Plus</option>
                    <option value="midjourney">Midjourney</option>
                    <option value="claude">Claude Pro</option>
                    <option value="copilot">GitHub Copilot</option>
                    <option value="courses">دوره‌های آموزشی</option>
                    <option value="all">همه محصولات</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="budget" className="block text-sm font-semibold text-gray-700 mb-2">
                    بودجه تقریبی (تومان)
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3092BE] focus:border-transparent transition-all duration-200 font-medium"
                  >
                    <option value="">انتخاب کنید</option>
                    <option value="under-10m">کمتر از 10 میلیون</option>
                    <option value="10m-50m">10-50 میلیون</option>
                    <option value="50m-100m">50-100 میلیون</option>
                    <option value="over-100m">بیش از 100 میلیون</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="timeline" className="block text-sm font-semibold text-gray-700 mb-2">
                    زمان‌بندی پیاده‌سازی
                  </label>
                  <select
                    id="timeline"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3092BE] focus:border-transparent transition-all duration-200 font-medium"
                  >
                    <option value="">انتخاب کنید</option>
                    <option value="immediate">فوری</option>
                    <option value="1-month">1 ماه</option>
                    <option value="3-months">3 ماه</option>
                    <option value="6-months">6 ماه</option>
                    <option value="flexible">انعطاف‌پذیر</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">
                  توضیحات اضافی
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3092BE] focus:border-transparent transition-all duration-200 resize-none font-medium"
                  placeholder="نیازهای خاص، سوالات یا توضیحات اضافی خود را بنویسید..."
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#3092BE] to-[#2563eb] text-white font-bold py-4 px-8 rounded-lg hover:from-[#256d8a] hover:to-[#1d4ed8] transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-lg"
                >
                  ارسال درخواست
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-4">چرا فروش سازمانی؟</h2>
            <p className="text-lg text-gray-600 font-medium max-w-3xl mx-auto">
              با خرید گروهی از مزایای ویژه‌ای بهره‌مند شوید
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white text-xl font-bold">💰</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">تخفیف ویژه</h3>
              <p className="text-gray-600 font-medium">تا 40% تخفیف برای خرید گروهی محصولات هوش مصنوعی</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white text-xl font-bold">🎯</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">مشاوره تخصصی</h3>
              <p className="text-gray-600 font-medium">
                مشاوره رایگان برای انتخاب بهترین محصولات متناسب با نیاز تیم شما
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white text-xl font-bold">🚀</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">پیاده‌سازی سریع</h3>
              <p className="text-gray-600 font-medium">راه‌اندازی و آموزش تیم شما در کمترین زمان ممکن</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white text-xl font-bold">🛡️</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">پشتیبانی اختصاصی</h3>
              <p className="text-gray-600 font-medium">پشتیبانی 24/7 و مدیریت اختصاصی برای سازمان شما</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-400 to-teal-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white text-xl font-bold">📊</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">گزارش‌گیری</h3>
              <p className="text-gray-600 font-medium">گزارش‌های دقیق از میزان استفاده و بهره‌وری تیم</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white text-xl font-bold">🎓</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">آموزش تیم</h3>
              <p className="text-gray-600 font-medium">دوره‌های آموزشی اختصاصی برای تیم شما</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Corporate Sales Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-4">فروش سازمانی چیست؟</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed font-medium">
                  فروش سازمانی راه‌حلی است که به شرکت‌ها و سازمان‌ها امکان خرید گروهی محصولات هوش مصنوعی را با شرایط ویژه
                  می‌دهد.
                </p>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed font-medium">
                  با این روش، تیم‌های بزرگ می‌توانند از تخفیفات قابل توجه، پشتیبانی اختصاصی و خدمات ویژه بهره‌مند شوند.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <div className="w-6 h-6 bg-[#3092BE] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <p className="text-gray-700 font-medium">خرید گروهی با تخفیفات ویژه</p>
                  </div>
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <div className="w-6 h-6 bg-[#3092BE] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <p className="text-gray-700 font-medium">مدیریت متمرکز اکانت‌های تیم</p>
                  </div>
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <div className="w-6 h-6 bg-[#3092BE] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <p className="text-gray-700 font-medium">پشتیبانی اولویت‌دار</p>
                  </div>
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <div className="w-6 h-6 bg-[#3092BE] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <p className="text-gray-700 font-medium">آموزش و راه‌اندازی تیم</p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="bg-gradient-to-br from-[#3092BE]/10 to-blue-600/10 rounded-2xl p-8">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-[#3092BE] to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-white text-3xl font-bold">🏢</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">برای سازمان‌های بزرگ</h3>
                    <p className="text-gray-600 font-medium">
                      از 10 نفر تا هزاران کارمند، ما راه‌حل مناسب برای هر اندازه سازمان داریم
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer style={{ backgroundColor: "#3092BE" }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white text-center">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse mb-4 sm:mb-0">
              <img
                src="/images/design-mode/Group%201(1).png"
                alt="SharifGPT Logo"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-lg font-bold">SharifGPT</span>
            </div>
            <p className="text-sm opacity-90">© 2025 SharifGPT. تمامی حقوق محفوظ است.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
