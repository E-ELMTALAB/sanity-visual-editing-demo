"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useCart } from "../../contexts/cart-context"
import CartDropdown from "../../components/cart-dropdown"
import MobileMenu from "../../components/mobile-menu" // Imported MobileMenu component

export default function CartPage() {
  const { state, removeItem, updateQuantity, clearCart } = useCart()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false)
  const [user, setUser] = useState({ name: "مهدی", email: "mehdi@example.com" })
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false) // Added mobile menu state to match home page

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

  return (
    <div className="bg-gray-50 min-h-screen" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 glassmorphism">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center">
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
              <div className="relative flex items-center space-x-2 sm:space-x-4 space-x-reverse cursor-pointer">
                <Link href="/" className="flex items-center space-x-2 sm:space-x-4 space-x-reverse">
                  <img
                    src="/images/design-mode/Group%201(1).png"
                    alt="SharifGPT Logo"
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                  />
                  <h1 className="text-lg sm:text-xl font-bold text-gray-800">SharifGPT</h1>
                </Link>
              </div>
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
                <div className="flex items-center cursor-pointer" onClick={handleProfileClick}>
                  <div className="relative z-10 -ml-3 sm:-ml-5 transition-transform duration-300 transform hover:scale-110">
                    {isAuthenticated ? (
                      <img
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white shadow-md object-cover"
                        src="/images/design-mode/3Y1Z0Qj(2).png"
                        alt="آواتار کاربر"
                      />
                    ) : (
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white shadow-md bg-white flex items-center justify-center">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div
                    className="relative z-0 transition-transform duration-300 transform hover:scale-110"
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsCartDropdownOpen(!isCartDropdownOpen)
                    }}
                  >
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
                    {state.itemCount > 0 && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {state.itemCount}
                      </div>
                    )}
                  </div>
                </div>

                <CartDropdown isOpen={isCartDropdownOpen} onClose={() => setIsCartDropdownOpen(false)} />

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
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
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

        <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      </header>

      {/* Breadcrumb */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">
              خانه
            </Link>
            <span>/</span>
            <span className="text-gray-800">سبد خرید</span>
          </div>
        </div>
      </div>

      {/* Cart Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-800">سبد خرید</h1>
              {state.items.length > 0 && (
                <button onClick={clearCart} className="text-red-600 hover:text-red-700 text-sm font-medium">
                  پاک کردن سبد
                </button>
              )}
            </div>
          </div>

          {state.items.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">سبد خرید شما خالی است</h2>
              <p className="text-gray-600 mb-8">هنوز محصولی به سبد خرید خود اضافه نکرده‌اید</p>
              <Link
                href="/products"
                className="inline-flex items-center bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105"
              >
                مشاهده محصولات
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
            </div>
          ) : (
            <div className="p-6">
              <div className="space-y-6">
                {state.items.map((item) => (
                  <div
                    key={`${item.id}-${item.selectedOption}`}
                    className="flex items-center space-x-6 space-x-reverse p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 text-lg mb-2">{item.title}</h3>
                      {item.selectedOption && <p className="text-gray-600 mb-2">{item.selectedOption}</p>}
                      <p className="text-blue-600 font-bold text-xl">{item.price.toLocaleString()} تومان</p>
                    </div>
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-4 py-2 text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                          -
                        </button>
                        <span className="px-6 py-2 border-x border-gray-300 font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-4 py-2 text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-600 text-sm">مجموع:</p>
                        <p className="font-bold text-lg text-blue-600">
                          {(item.price * item.quantity).toLocaleString()} تومان
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="mt-8 border-t border-gray-200 pt-6">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-700 text-lg">تعداد کالاها:</span>
                    <span className="font-bold text-lg">{state.itemCount} عدد</span>
                  </div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-gray-700 text-xl">مجموع کل:</span>
                    <span className="text-3xl font-bold text-blue-600">{state.total.toLocaleString()} تومان</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                      href="/products"
                      className="px-6 py-3 border border-blue-600 text-blue-600 rounded-xl text-center hover:bg-blue-50 transition-colors font-medium"
                    >
                      ادامه خرید
                    </Link>
                    <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-bold">
                      تسویه حساب
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: "#3092BE" }}>
        <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 text-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 text-center md:text-right">
            <div>
              <div className="flex items-center justify-center md:justify-start space-x-2 space-x-reverse mb-4">
                <img
                  src="/images/design-mode/Group%201(1).png"
                  alt="SharifGPT Logo"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <h3 className="text-lg font-bold">SharifGPT</h3>
              </div>
              <p className="text-sm text-blue-100 leading-relaxed">
                ارائه‌دهنده بهترین خدمات هوش مصنوعی و محصولات دیجیتال با کیفیت بالا و قیمت مناسب
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">لینک‌های مفید</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-blue-100 hover:text-white transition-colors">
                    شرایط و قوانین
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-100 hover:text-white transition-colors">
                    حریم خصوصی
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-100 hover:text-white transition-colors">
                    درباره ما
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">نماد اعتماد</h4>
              <div className="flex justify-center md:justify-start">
                <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center">
                  <span className="text-xs text-center">
                    نماد
                    <br />
                    اعتماد
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
