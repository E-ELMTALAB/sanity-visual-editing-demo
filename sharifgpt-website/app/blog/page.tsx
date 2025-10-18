"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import Footer from "@/components/footer"

export default function BlogPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [user, setUser] = useState({ name: "مهدی", email: "mehdi@example.com" })

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const profileContainer = document.getElementById("profileContainer")
      if (profileContainer && !profileContainer.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const articles = [
    {
      id: 1,
      title: "راهنمای کامل استفاده از اسپاتیفای پریمیوم",
      excerpt:
        "در این مقاله با تمام قابلیت‌های اسپاتیفای پریمیوم آشنا شوید و بیاموزید چگونه از آن بهترین استفاده را ببرید.",
      category: "spotify",
      date: "1403/01/15",
      readTime: "5 دقیقه",
      image: "/spotify-music-streaming.jpg",
    },
    {
      id: 2,
      title: "مزایای یوتیوب پریمیوم برای تولیدکنندگان محتوا",
      excerpt: "یوتیوب پریمیوم چه امکاناتی برای کسانی که محتوا تولید می‌کنند فراهم می‌کند؟",
      category: "youtube",
      date: "1403/01/10",
      readTime: "7 دقیقه",
      image: "/youtube-premium-content-creator.jpg",
    },
    {
      id: 3,
      title: "امنیت کارت‌های اعتباری مجازی در خریدهای آنلاین",
      excerpt: "چرا استفاده از کارت‌های مجازی برای خریدهای آنلاین امن‌تر است و چگونه از آن‌ها استفاده کنیم؟",
      category: "cards",
      date: "1403/01/05",
      readTime: "6 دقیقه",
      image: "/virtual-credit-card-security.jpg",
    },
    {
      id: 4,
      title: "آینده هوش مصنوعی در ابزارهای روزمره",
      excerpt: "نگاهی به تأثیر ابزارهای هوش مصنوعی مثل ChatGPT در زندگی روزمره ما.",
      category: "ai-tools",
      date: "1402/12/28",
      readTime: "8 دقیقه",
      image: "/artificial-intelligence-daily-tools.jpg",
    },
  ]

  return (
    <div className="bg-gray-50 min-h-screen" dir="rtl">
      <header className="sticky top-0 z-50 glassmorphism">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo and Name */}
            <div className="relative flex items-center space-x-2 sm:space-x-4 space-x-reverse cursor-pointer">
              <Link href="/" className="flex items-center space-x-2 sm:space-x-4 space-x-reverse">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  >
                    <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="white" />
                    <path
                      d="M19 15L19.5 17.5L22 18L19.5 18.5L19 21L18.5 18.5L16 18L18.5 17.5L19 15Z"
                      fill="white"
                      opacity="0.8"
                    />
                    <path d="M5 6L5.5 8L7 8.5L5.5 9L5 11L4.5 9L3 8.5L4.5 8L5 6Z" fill="white" opacity="0.6" />
                  </svg>
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-800">SharifGPT</h1>
              </Link>
            </div>

            {/* Navigation */}
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

                <div className="absolute top-full right-0 mt-2 w-[800px] bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                  <div className="p-8">
                    <div className="grid grid-cols-3 gap-8">
                      {/* Credit Cards Column */}
                      <div>
                        <div className="flex items-center mb-6">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center ml-3">
                            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-bold text-gray-800">کارت‌های اعتباری</h3>
                        </div>
                        <ul className="space-y-3">
                          <li>
                            <Link
                              href="/products?category=cards"
                              className="flex items-center text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                            >
                              <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center ml-3">
                                <span className="text-white text-xs font-bold">V</span>
                              </div>
                              <span>خرید ویزا کارت Visa Card</span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/products?category=cards"
                              className="flex items-center text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                            >
                              <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center ml-3">
                                <span className="text-white text-xs font-bold">M</span>
                              </div>
                              <span>خرید مسترکارت Mastercard</span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/products?category=cards"
                              className="text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 block"
                            >
                              خرید مسترکارت فیزیکی
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/products?category=cards"
                              className="text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 block"
                            >
                              خرید ویزا کارت فیزیکی
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/products?category=cards"
                              className="text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 block"
                            >
                              خرید مسترکارت مجازی
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/products?category=cards"
                              className="text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 block"
                            >
                              خرید ویزا کارت مجازی
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/products?category=cards"
                              className="text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 block"
                            >
                              مسترکارت مجازی آمریکا
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/products?category=cards"
                              className="flex items-center text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                            >
                              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-red-500 rounded flex items-center justify-center ml-3">
                                <span className="text-white text-xs font-bold">⚡</span>
                              </div>
                              <span>شارژ مسترکارت و ویزا کارت</span>
                            </Link>
                          </li>
                        </ul>
                      </div>

                      {/* Services Column */}
                      <div>
                        <div className="flex items-center mb-6">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center ml-3">
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-bold text-gray-800">خدمات دیجیتال</h3>
                        </div>
                        <ul className="space-y-3">
                          <li>
                            <Link
                              href="/products?category=spotify"
                              className="flex items-center text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                            >
                              <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center ml-3">
                                <span className="text-white text-xs font-bold">♪</span>
                              </div>
                              <span>اسپاتیفای پریمیوم</span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/products?category=youtube"
                              className="flex items-center text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                            >
                              <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center ml-3">
                                <span className="text-white text-xs font-bold">▶</span>
                              </div>
                              <span>یوتیوب پریمیوم</span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/products?category=netflix"
                              className="flex items-center text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                            >
                              <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center ml-3">
                                <span className="text-white text-xs font-bold">N</span>
                              </div>
                              <span>نتفلیکس پریمیوم</span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/products?category=ai-tools"
                              className="flex items-center text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                            >
                              <div className="w-6 h-6 bg-teal-500 rounded flex items-center justify-center ml-3">
                                <span className="text-white text-xs font-bold">🤖</span>
                              </div>
                              <span>ابزارهای هوش مصنوعی</span>
                            </Link>
                          </li>
                        </ul>
                      </div>

                      {/* Additional Services Column */}
                      <div>
                        <div className="flex items-center mb-6">
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center ml-3">
                            <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0H7v-4h2v4zm4 0H7v-7h2v7zm4 0H7v-4h2v4z" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-bold text-gray-800">سایر خدمات</h3>
                        </div>
                        <ul className="space-y-3">
                          <li>
                            <Link
                              href="/products"
                              className="text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 block"
                            >
                              مشاهده همه محصولات
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/products?category=cards"
                              className="text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 block"
                            >
                              کارت‌های اعتباری
                            </Link>
                          </li>
                        </ul>

                        {/* Popular Badge */}
                        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                          <div className="flex items-center mb-2">
                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                              محبوب
                            </span>
                          </div>
                          <h4 className="font-bold text-gray-800 mb-1">پکیج ویژه</h4>
                          <p className="text-sm text-gray-600">کارت اعتباری + شارژ رایگان</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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

                <div className="absolute top-full right-0 mt-2 w-[800px] bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                  <div className="p-8">
                    <div className="grid grid-cols-3 gap-8">
                      {/* AI Fundamentals Column */}
                      <div>
                        <div className="flex items-center mb-6">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center ml-3">
                            <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-bold text-gray-800">مبانی هوش مصنوعی</h3>
                        </div>
                        <ul className="space-y-3">
                          <li>
                            <a
                              href="#"
                              className="flex items-center text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                            >
                              <div className="w-6 h-6 bg-purple-500 rounded flex items-center justify-center ml-3">
                                <span className="text-white text-xs font-bold">🤖</span>
                              </div>
                              <span>آشنایی با ChatGPT</span>
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="flex items-center text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                            >
                              <div className="w-6 h-6 bg-indigo-500 rounded flex items-center justify-center ml-3">
                                <span className="text-white text-xs font-bold">💡</span>
                              </div>
                              <span>تکنیک‌های پرامپت نویسی</span>
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 block"
                            >
                              هوش مصنوعی برای مبتدیان
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 block"
                            >
                              اصول یادگیری ماشین
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 block"
                            >
                              شبکه‌های عصبی مقدماتی
                            </a>
                          </li>
                        </ul>
                      </div>

                      {/* Business & Professional Column */}
                      <div>
                        <div className="flex items-center mb-6">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center ml-3">
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-bold text-gray-800">کسب و کار</h3>
                        </div>
                        <ul className="space-y-3">
                          <li>
                            <a
                              href="#"
                              className="flex items-center text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                            >
                              <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center ml-3">
                                <span className="text-white text-xs font-bold">📊</span>
                              </div>
                              <span>هوش مصنوعی در بازاریابی</span>
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="flex items-center text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                            >
                              <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center ml-3">
                                <span className="text-white text-xs font-bold">💼</span>
                              </div>
                              <span>مدیریت پروژه با AI</span>
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 block"
                            >
                              تحلیل داده با هوش مصنوعی
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 block"
                            >
                              خدمات مشتری هوشمند
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 block"
                            >
                              اتوماسیون فرآیندها
                            </a>
                          </li>
                        </ul>
                      </div>

                      {/* Creative & Technical Column */}
                      <div>
                        <div className="flex items-center mb-6">
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center ml-3">
                            <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-bold text-gray-800">خلاقیت و فناوری</h3>
                        </div>
                        <ul className="space-y-3">
                          <li>
                            <a
                              href="#"
                              className="flex items-center text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                            >
                              <div className="w-6 h-6 bg-pink-500 rounded flex items-center justify-center ml-3">
                                <span className="text-white text-xs font-bold">🎨</span>
                              </div>
                              <span>تولید محتوا با AI</span>
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="flex items-center text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                            >
                              <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center ml-3">
                                <span className="text-white text-xs font-bold">🎬</span>
                              </div>
                              <span>ساخت ویدیو با هوش مصنوعی</span>
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 block"
                            >
                              طراحی گرافیک با AI
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 block"
                            >
                              برنامه‌نویسی با کمک AI
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 block"
                            >
                              موسیقی و صدا با AI
                            </a>
                          </li>
                        </ul>

                        {/* Featured Course Badge */}
                        <div className="mt-8 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100">
                          <div className="flex items-center mb-2">
                            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                              ویژه
                            </span>
                          </div>
                          <h4 className="font-bold text-gray-800 mb-1">دوره جامع AI</h4>
                          <p className="text-sm text-gray-600">از صفر تا صد هوش مصنوعی</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Link
                href="/enterprise"
                className="flex items-center text-gray-700 hover:text-[#3092BE] transition-all duration-300 px-3 py-2 rounded-lg text-sm font-medium transform hover:scale-105 hover:shadow-[0_0_15px_rgba(48,146,190,0.3)] whitespace-nowrap"
              >
                <span>فروش سازمانی</span>
              </Link>
              <Link
                href="/blog"
                className="text-gray-700 hover:text-[#3092BE] transition-all duration-300 px-3 py-2 rounded-lg text-sm font-medium transform hover:scale-105 hover:shadow-[0_0_15px_rgba(48,146,190,0.3)]"
              >
                بلاگ
              </Link>
            </nav>

            {/* Actions: Search, Contact, Cart, Profile */}
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

              <div className="relative" id="profileContainer">
                <div className="flex items-center space-x-3 space-x-reverse">
                  {/* Cart Icon - Separate Circle */}
                  <div className="relative">
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 border-[#3092BE] flex items-center justify-center bg-white shadow-sm cursor-pointer transition-transform duration-300 transform hover:scale-110">
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

                  {/* Profile Icon - Separate Circle */}
                  <div className="cursor-pointer" onClick={handleProfileClick}>
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

                {/* Profile Dropdown for Authenticated Users */}
                {isAuthenticated && isProfileDropdownOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 z-50">
                    <div className="p-4">
                      {/* User Info */}
                      <div className="flex items-center space-x-3 space-x-reverse pb-4 border-b border-gray-100">
                        <img
                          className="w-12 h-12 rounded-full object-cover"
                          src="/images/design-mode/3Y1Z0Qj(1).png"
                          alt="آواتار کاربر"
                        />
                        <div className="text-right">
                          <p className="font-semibold text-gray-800">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <a
                          href="#"
                          className="flex items-center space-x-3 space-x-reverse px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                            />
                          </svg>
                          <span>پروفایل من</span>
                        </a>
                        <a
                          href="#"
                          className="flex items-center space-x-3 space-x-reverse px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                          </svg>
                          <span>سفارشات من</span>
                        </a>
                      </div>

                      {/* Logout */}
                      <div className="pt-2 border-t border-gray-100">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 space-x-reverse px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          <span>خروج</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="w-full h-px bg-gray-200"></div>
        </div>
      </header>

      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-blue-600">
              خانه
            </Link>
            <span>/</span>
            <span className="text-gray-800">بلاگ</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">مقالات و راهنماها</h1>
          <p className="text-gray-600 mt-2">آخرین مطالب و راهنماهای مفید در زمینه محصولات دیجیتال</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <img src={article.image || "/placeholder.svg"} alt={article.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">{article.category}</span>
                  <div className="flex items-center text-gray-500 text-sm space-x-2 space-x-reverse">
                    <span>{article.date}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">{article.title}</h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.excerpt}</p>
                <Link href={`/blog/${article.id}`} className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  ادامه مطلب ←
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}
