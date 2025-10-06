"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useCart } from "../../../contexts/cart-context"
import CartDropdown from "../../../components/cart-dropdown"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface ProductPageProps {
  productData: any
}

export default function ProductPage({ productData }: ProductPageProps) {
  const [selectedTab, setSelectedTab] = useState("description")
  const [quantity, setQuantity] = useState(1)
  const [selectedOption, setSelectedOption] = useState(productData?.options?.[0]?.id || "1-month")
  const [selectedImage, setSelectedImage] = useState(0)

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [user, setUser] = useState({ name: "مهدی", email: "mehdi@example.com" })

  const { state: cartState, addItem } = useCart()
  const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false)
  const [showAddedToCart, setShowAddedToCart] = useState(false)


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

  const handleAddToCart = () => {
    const selectedProductOption = product.options.find((opt: any) => opt.id === selectedOption)
    addItem({
      id: product.id,
      title: product.title,
      price: selectedProductOption?.price || product.price,
      image: product.image,
      selectedOption: selectedProductOption?.name,
      quantity,
    })

    setShowAddedToCart(true)
    setTimeout(() => setShowAddedToCart(false), 3000)
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

  const product = {
    id: 1,
    title: productData?.name || "اکانت اسپاتیفای پریمیوم",
    description: productData?.description ||
      "اسپاتیفای یکی از محبوب‌ترین سرویس‌های پخش موسیقی در جهان است که دسترسی به میلیون‌ها آهنگ، پادکست و محتوای صوتی را فراهم می‌کند. با خرید اکانت اسپاتیفای از فروشگاه ما، به دنیایی از موسیقی بی‌نظیر موسیقی دسترسی خواهید داشت.",
    longDescription: productData?.longDescription || "",
    category: productData?.category || "محصولات",
    price: productData?.discountedPrice ?? productData?.price ?? 250000,
    originalPrice: productData?.originalPrice || 350000,
    discount: productData?.discountPercentage ?? (productData?.originalPrice && productData?.price
      ? Math.round(((productData.originalPrice - productData.price) / productData.originalPrice) * 100)
      : 30),
    rating: typeof productData?.rating === 'number' ? productData.rating : 0,
    reviews: typeof productData?.reviewCount === 'number' ? productData.reviewCount : 0,
    image: productData?.imageUrl || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-dPdgCWW6zllellUtmElnrpbQKerDIJ.png",
    gallery: Array.isArray(productData?.galleryUrls) && productData?.galleryUrls?.length
      ? productData.galleryUrls.filter(Boolean)
      : [
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-dPdgCWW6zllellUtmElnrpbQKerDIJ.png",
          "https://placehold.co/600x400/1DB954/FFFFFF?text=Spotify+2",
          "https://placehold.co/600x400/1DB954/FFFFFF?text=Spotify+3",
        ],
    features: Array.isArray(productData?.features) ? productData.features : [],
    options: Array.isArray(productData?.options) ? productData.options : [],
    badges: Array.isArray(productData?.badges) ? productData.badges : [],
    inStock: productData?.inStock !== false,
    relatedProducts: Array.isArray(productData?.relatedProducts) ? productData.relatedProducts : [],
    relatedBlogs: Array.isArray(productData?.relatedBlogs) ? productData.relatedBlogs : [],
  }

  const reviews = [
    {
      id: 1,
      user: "علی محمدی",
      rating: 5,
      date: "2 روز پیش",
      comment: "عالی بود، سریع فعال شد و بدون مشکل کار می‌کنه. قیمتش هم خیلی مناسب بود.",
      helpful: 12,
    },
    {
      id: 2,
      user: "سارا احمدی",
      rating: 4,
      date: "1 هفته پیش",
      comment: "کیفیت خوبی داره ولی یکم دیر فعال شد. در کل راضی هستم.",
      helpful: 8,
    },
    {
      id: 3,
      user: "محمد رضایی",
      rating: 5,
      date: "2 هفته پیش",
      comment: "بهترین قیمت بازار رو داشت. پشتیبانی هم عالی بود.",
      helpful: 15,
    },
  ]


  const relatedProducts = product.relatedProducts
  const relatedArticles = product.relatedBlogs

  const selectedPrice = product.options.find((opt: any) => opt.id === selectedOption)?.price || product.price


  return (
    <div className="bg-gray-50 min-h-screen" dir="rtl">
      <header className="sticky top-0 z-50 glassmorphism">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
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
                {/* Cart Icon - Separate Circle */}
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div
                    className="relative cursor-pointer transition-transform duration-300 transform hover:scale-110"
                    onClick={() => setIsCartDropdownOpen(!isCartDropdownOpen)}
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
                    {cartState.itemCount > 0 && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {cartState.itemCount}
                      </div>
                    )}
                  </div>

                  {/* Profile Icon - Separate Circle */}
                  <div className="cursor-pointer" onClick={handleProfileClick}>
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
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM5 9h14l1 12H4L5 9z"
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

              {/* Cart Dropdown */}
              <CartDropdown isOpen={isCartDropdownOpen} onClose={() => setIsCartDropdownOpen(false)} />
            </div>
          </div>
          <div className="w-full h-px bg-gray-200"></div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">
              خانه
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-blue-600">
              محصولات
            </Link>
            <span>/</span>
            <span className="text-gray-800">{product.category || 'محصولات'}</span>
            <span>/</span>
            <span className="text-gray-800">{product.title}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg group">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="lg:hidden">
              {/* Product Info - Mobile Only */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/80 via-white/60 to-blue-50/80 backdrop-blur-xl border border-white/30 shadow-xl mb-6">
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-green-400/20 to-blue-400/20 rounded-full blur-xl"></div>

                <div className="relative p-4">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4">
                    {product.title}
                  </h1>

                  <div className="flex items-center justify-between mb-4 p-3 bg-white/40 backdrop-blur-sm border border-white/40 rounded-xl shadow-md">
                    <div className="flex items-center space-x-4 space-x-reverse">
                      {/* Rating stars with smaller size */}
                      <div className="flex items-center space-x-1 space-x-reverse bg-gradient-to-r from-yellow-50/80 to-orange-50/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-yellow-200/50">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-yellow-400 drop-shadow-sm" : "text-gray-300"}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="text-gray-800 mr-2 font-bold text-sm">{product.rating}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 space-x-reverse">
                        <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm px-2 py-1 rounded-lg border border-blue-200/50">
                          <span className="text-blue-700 font-semibold text-xs">({product.reviews} نظر)</span>
                        </div>
                        <div className="bg-gradient-to-r from-green-50/80 to-emerald-50/80 backdrop-blur-sm px-2 py-1 rounded-lg border border-green-200/50 flex items-center space-x-1 space-x-reverse">
                          <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-green-700 font-semibold text-xs">تایید شده</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50/60 via-white/50 to-green-50/60 backdrop-blur-xl border border-white/40 shadow-lg p-4 mb-4">
                    {/* Smaller decorative background elements */}
                    <div className="absolute top-0 left-0 w-12 h-12 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-xl"></div>
                    <div className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-tl from-green-400/10 to-blue-400/10 rounded-full blur-lg"></div>

                    <div className="relative flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
                            {selectedPrice.toLocaleString()} تومان
                          </span>
                          {product.originalPrice > selectedPrice && (
                            <div className="bg-gradient-to-r from-red-500/90 to-pink-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-full shadow-md border border-white/20">
                              <span className="font-bold text-xs">{product.discount}% تخفیف</span>
                            </div>
                          )}
                        </div>

                        {/* Original price with smaller styling */}
                        {product.originalPrice > selectedPrice && (
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <span className="text-sm text-gray-500 line-through bg-gray-100/60 backdrop-blur-sm px-2 py-0.5 rounded-md">
                              {product.originalPrice.toLocaleString()} تومان
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="text-left bg-gradient-to-br from-green-50/80 to-emerald-50/80 backdrop-blur-sm border border-green-200/50 rounded-xl p-3 shadow-md">
                        <div className="flex items-center space-x-1 space-x-reverse mb-1">
                          <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-xs font-medium text-green-700">صرفه‌جویی شما:</span>
                        </div>
                        <div className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          {(product.originalPrice - selectedPrice).toLocaleString()} تومان
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="hidden lg:block">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/80 via-white/60 to-blue-50/80 backdrop-blur-xl border border-white/30 shadow-xl">
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-green-400/20 to-blue-400/20 rounded-full blur-xl"></div>

                <div className="relative p-4">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4">
                    {product.title}
                  </h1>

                  <div className="flex items-center justify-between mb-4 p-3 bg-white/40 backdrop-blur-sm border border-white/40 rounded-xl shadow-md">
                    <div className="flex items-center space-x-4 space-x-reverse">
                      {/* Rating stars with smaller size */}
                      <div className="flex items-center space-x-1 space-x-reverse bg-gradient-to-r from-yellow-50/80 to-orange-50/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-yellow-200/50">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-yellow-400 drop-shadow-sm" : "text-gray-300"}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="text-gray-800 mr-2 font-bold text-sm">{product.rating}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 space-x-reverse">
                        <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm px-2 py-1 rounded-lg border border-blue-200/50">
                          <span className="text-blue-700 font-semibold text-xs">({product.reviews} نظر)</span>
                        </div>
                        <div className="bg-gradient-to-r from-green-50/80 to-emerald-50/80 backdrop-blur-sm px-2 py-1 rounded-lg border border-green-200/50 flex items-center space-x-1 space-x-reverse">
                          <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-green-700 font-semibold text-xs">تایید شده</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50/60 via-white/50 to-green-50/60 backdrop-blur-xl border border-white/40 shadow-lg p-4 mb-4">
                    {/* Smaller decorative background elements */}
                    <div className="absolute top-0 left-0 w-12 h-12 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-xl"></div>
                    <div className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-tl from-green-400/10 to-blue-400/10 rounded-full blur-lg"></div>

                    <div className="relative flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
                            {selectedPrice.toLocaleString()} تومان
                          </span>
                          {product.originalPrice > selectedPrice && (
                            <div className="bg-gradient-to-r from-red-500/90 to-pink-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-full shadow-md border border-white/20">
                              <span className="font-bold text-xs">{product.discount}% تخفیف</span>
                            </div>
                          )}
                        </div>

                        {/* Original price with smaller styling */}
                        {product.originalPrice > selectedPrice && (
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <span className="text-sm text-gray-500 line-through bg-gray-100/60 backdrop-blur-sm px-2 py-0.5 rounded-md">
                              {product.originalPrice.toLocaleString()} تومان
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="text-left bg-gradient-to-br from-green-50/80 to-emerald-50/80 backdrop-blur-sm border border-green-200/50 rounded-xl p-3 shadow-md">
                        <div className="flex items-center space-x-1 space-x-reverse mb-1">
                          <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-xs font-medium text-green-700">صرفه‌جویی شما:</span>
                        </div>
                        <div className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          {(product.originalPrice - selectedPrice).toLocaleString()} تومان
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Tab Headers */}
            <div className="border-b border-gray-200">
              <div className="flex">
                {[
                  { id: "description", name: "توضیحات" },
                  { id: "features", name: "ویژگی‌ها" },
                  { id: "reviews", name: "نظرات کاربران" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`px-6 py-4 font-medium transition-colors ${
                      selectedTab === tab.id
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {selectedTab === "description" && (
                <div className="prose max-w-none prose-gray text-gray-700 leading-relaxed">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                  >
                    {product.longDescription || product.description}
                  </ReactMarkdown>
                </div>
              )}

              {selectedTab === "features" && (
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-6">ویژگی‌های اسپاتیفای</h3>
                  <ul className="space-y-4">
                    {product.features.map((feature: any, index: number) => (
                      <li key={index} className="flex items-start space-x-3 space-x-reverse">
                        <svg
                          className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedTab === "reviews" && (
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-gray-800">نظرات کاربران</h3>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      ثبت نظر
                    </button>
                  </div>

                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3 space-x-reverse">
                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-gray-600 font-medium">{review.user[0]}</span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-800">{review.user}</div>
                              <div className="text-sm text-gray-500">{review.date}</div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 mb-3">{review.comment}</p>
                        <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-500">
                          <button className="hover:text-blue-600">مفید ({review.helpful})</button>
                          <button className="hover:text-blue-600">پاسخ</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-16">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">محصولات مرتبط</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct: any) => (
                <Link
                  key={relatedProduct.id}
                  href={`/products/${relatedProduct.slug}`}
                  className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-blue-300"
                >
                  <div className="relative">
                    <img
                      src={relatedProduct.image || "/placeholder.svg"}
                      alt={relatedProduct.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {relatedProduct.discountPercentage > 0 && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        {relatedProduct.discountPercentage}% تخفیف
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {relatedProduct.title}
                    </h3>
                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(relatedProduct.rating || 0) ? "text-yellow-400" : "text-gray-300"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="text-gray-600 text-sm mr-2">({relatedProduct.reviewCount || 0})</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <span className="text-lg font-bold text-blue-600">
                          {relatedProduct.price.toLocaleString()} تومان
                        </span>
                        {relatedProduct.originalPrice > relatedProduct.price && (
                          <span className="text-sm text-gray-500 line-through">
                            {relatedProduct.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/products" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
                مشاهده همه محصولات
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Related Articles Section */}
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">مقالات مرتبط</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedArticles.map((article: any) => (
                <Link
                  key={article.id}
                  href={`/blog/${article.slug}`}
                  className="block p-6 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-300 group"
                >
                  {article.coverImage && (
                    <div className="mb-3">
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <h3 className="font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium">
                      {Array.isArray(article.tags) && article.tags.length > 0 ? article.tags[0] : 'مقاله'}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      5 دقیقه
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
                مشاهده همه مقالات
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 backdrop-blur-md bg-white/90 border-t border-gray-200/50 shadow-2xl">
        <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between space-x-2 space-x-reverse">
            {/* Product info section - optimized for mobile */}
            <div className="flex items-center space-x-2 space-x-reverse bg-white/70 backdrop-blur-sm rounded-xl px-3 py-2 sm:px-4 sm:py-3 border border-white/30 shadow-lg min-w-0 flex-1 max-w-[45%]">
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-gray-800 text-xs sm:text-sm truncate">{product.title}</h3>
                <div className="flex items-center space-x-1 space-x-reverse">
                  <p className="text-blue-600 font-bold text-sm sm:text-base whitespace-nowrap">
                    {selectedPrice.toLocaleString()}
                  </p>
                  <span className="text-blue-600 font-bold text-xs sm:text-sm">تومان</span>
                  {product.originalPrice > selectedPrice && (
                    <span className="text-xs text-gray-500 line-through ml-1">
                      {product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Controls section - optimized spacing */}
            <div className="flex items-center space-x-3 space-x-reverse">
              {/* Quantity controls - smaller for mobile */}
              <div className="flex items-center bg-white/70 backdrop-blur-sm border border-white/30 rounded-xl shadow-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2 sm:px-3 py-2 text-gray-700 hover:bg-white/60 transition-all duration-300 font-bold text-sm sm:text-base"
                >
                  −
                </button>
                <div className="px-2 sm:px-3 py-2 border-x border-white/30 bg-white/40 font-bold text-gray-800 min-w-[35px] sm:min-w-[40px] text-center text-sm sm:text-base">
                  {quantity}
                </div>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2 sm:px-3 py-2 text-gray-700 hover:bg-white/60 transition-all duration-300 font-bold text-sm sm:text-base"
                >
                  +
                </button>
              </div>

              {/* Add to cart button - responsive sizing */}
              <button
                onClick={handleAddToCart}
                className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-500 transform hover:scale-105 shadow-xl flex items-center space-x-1 space-x-reverse backdrop-blur-md border border-white/30 ${
                  showAddedToCart
                    ? "bg-gradient-to-r from-green-500/90 to-green-600/90 text-white shadow-green-500/25"
                    : "bg-gradient-to-r from-blue-600/90 to-blue-700/90 text-white hover:from-blue-700/90 hover:to-blue-800/90 shadow-blue-500/25"
                } hover:shadow-2xl whitespace-nowrap`}
                style={{
                  boxShadow: showAddedToCart
                    ? "0 15px 30px -8px rgba(34, 197, 94, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1) inset"
                    : "0 15px 30px -8px rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1) inset",
                }}
              >
                <div className="relative">
                  <svg
                    className={`w-3 h-3 sm:w-4 sm:h-4 transition-all duration-300 ${showAddedToCart ? "scale-110" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={showAddedToCart ? "M5 13l4 4L19 7" : "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"}
                    />
                  </svg>
                  {showAddedToCart && <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>}
                </div>
                <span className="relative hidden sm:inline">{showAddedToCart ? "✨ اضافه شد!" : "افزودن به سبد"}</span>
                <span className="relative sm:hidden">{showAddedToCart ? "✓" : "+"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="pb-24">
        {/* Footer Section */}
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
    </div>
  )
}
