"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import ProductCard from "components/product-card"
import type { ProductDoc, FAQ } from "types"
import { urlForImage } from "lib/sanity.image"

interface ProductsPageClientProps {
  productsData?: ProductDoc[]
  faqsData?: FAQ[]
}

export default function ProductsPageClient({ productsData = [], faqsData = [] }: ProductsPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("popular")
  const [showFilters, setShowFilters] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [newReview, setNewReview] = useState({ name: "", rating: 5, comment: "" })
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

  // Transform Sanity data to component format
  const transformedProducts = productsData.map((product, i) => ({
    id: product._id || String(i + 1),
    title: product.name || '',
    description: product.description || '',
    price: product.price || 0,
    originalPrice: product.originalPrice || 0,
    discount: product.discountPercentage || 0,
    rating: product.rating || 0,
    reviews: product.reviewCount || 0,
    image: product.image ? urlForImage(product.image)?.url() || '/placeholder.svg' : '/placeholder.svg',
    category: product.category || 'all',
    features: product.features || [],
    badge: product.badges?.[0] || undefined,
    inStock: product.inStock !== false,
    slug: product.slug?.current || String(i + 1),
  }))

  // Calculate category counts from Sanity data
  const categoryCounts = transformedProducts.reduce((acc, product) => {
    const cat = product.category || 'all'
    acc[cat] = (acc[cat] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const categories = [
    { id: "all", name: "همه محصولات", count: transformedProducts.length },
    { id: "ai", name: "هوش مصنوعی", count: categoryCounts['ai'] || 0 },
    { id: "social-media", name: "سوشیال مدیا", count: categoryCounts['social-media'] || 0 },
    { id: "music", name: "موسیقی", count: categoryCounts['music'] || 0 },
    { id: "educational", name: "آموزشی", count: categoryCounts['educational'] || 0 },
    { id: "sim-card", name: "سیمکارت", count: categoryCounts['sim-card'] || 0 },
  ]

  // Transform FAQ data from Sanity
  const faqs = faqsData.map((faq, i) => ({
    id: faq._id || String(i + 1),
    question: faq.question || '',
    answer: faq.answer || '',
    category: faq.category,
  }))

  const relatedArticles = [
    {
      id: 1,
      title: "راهنمای کامل استفاده از اسپاتیفای پریمیوم",
      category: "spotify",
      readTime: "5 دقیقه",
    },
    {
      id: 2,
      title: "مزایای یوتیوب پریمیوم برای تولیدکنندگان محتوا",
      category: "youtube",
      readTime: "7 دقیقه",
    },
    {
      id: 3,
      title: "امنیت کارت‌های اعتباری مجازی در خریدهای آنلاین",
      category: "cards",
      readTime: "6 دقیقه",
    },
  ]

  const userReviews = [
    {
      id: 1,
      name: "مهدی",
      rating: 5,
      comment: "خدمات عالی و سریع. اکانت اسپاتیفای خریداری کردم و بلافاصله فعال شد.",
      date: "1403/01/20",
    },
    {
      id: 2,
      name: "سارا",
      rating: 4,
      comment: "کیفیت خوب و قیمت مناسب. پشتیبانی هم سریع پاسخ می‌دهد.",
      date: "1403/01/18",
    },
    {
      id: 3,
      name: "علی",
      rating: 5,
      comment: "بهترین سایت برای خرید محصولات دیجیتال. کاملاً راضی هستم.",
      date: "1403/01/15",
    },
  ]

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const categoryParam = urlParams.get("category")
    const validCategories = ["all", "ai", "social-media", "music", "educational", "sim-card"]
    if (categoryParam && validCategories.includes(categoryParam)) {
      setSelectedCategory(categoryParam)
    }

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

  const filteredProducts = transformedProducts.filter(
    (product) => selectedCategory === "all" || product.category === selectedCategory,
  )

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "newest":
        return 0 // Already sorted by _createdAt desc in query
      default:
        return b.reviews - a.reviews
    }
  })

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("New review:", newReview)
    setNewReview({ name: "", rating: 5, comment: "" })
  }

  // Don't render if no products
  if (transformedProducts.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">محصولی یافت نشد</h2>
          <p className="text-gray-600">لطفاً بعداً بررسی کنید یا با پشتیبانی تماس بگیرید.</p>
        </div>
      </div>
    )
  }

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
                href="/enterprise"
                className="text-gray-700 hover:text-[#3092BE] transition-all duration-300 px-3 py-2 rounded-lg text-sm font-medium"
              >
                فروش سازمانی
              </Link>
              <Link
                href="/blog"
                className="text-gray-700 hover:text-[#3092BE] transition-all duration-300 px-3 py-2 rounded-lg text-sm font-medium"
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
                  className="w-40 xl:w-48 bg-gray-100 border border-[#3092BE] rounded-full py-2 pr-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3092BE]"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2">
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
                  <Link href="/cart" className="relative cursor-pointer transition-transform duration-300 transform hover:scale-110">
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 border-[#3092BE] flex items-center justify-center bg-white shadow-sm">
                      <svg className="h-4 w-4 sm:h-5 sm:w-5 text-[#3092BE]" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                      </svg>
                    </div>
                  </Link>

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

                {isAuthenticated && isProfileDropdownOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 z-50">
                    <div className="p-4">
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
                      <div className="py-2">
                        <a href="#" className="flex items-center space-x-3 space-x-reverse px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                          <span>پروفایل من</span>
                        </a>
                        <a href="#" className="flex items-center space-x-3 space-x-reverse px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                          <span>سفارشات من</span>
                        </a>
                      </div>
                      <div className="pt-2 border-t border-gray-100">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 space-x-reverse px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg w-full"
                        >
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
            <span className="text-gray-800">محصولات</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">فروشگاه محصولات دیجیتال</h1>
          <p className="text-gray-600 mt-2">بهترین محصولات دیجیتال با قیمت‌های مناسب</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800">فیلترها</h3>
                <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden text-blue-600">
                  {showFilters ? "بستن" : "نمایش"}
                </button>
              </div>

              <div className={`space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4">دسته‌بندی</h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-right px-3 py-2 rounded-lg transition-colors ${
                          selectedCategory === category.id
                            ? "bg-blue-100 text-blue-600 font-medium"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{category.name}</span>
                          <span className="text-sm text-gray-400">({category.count})</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Sort and View Options */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <span className="text-gray-600">مرتب‌سازی:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="popular">محبوب‌ترین</option>
                    <option value="newest">جدیدترین</option>
                    <option value="price-low">ارزان‌ترین</option>
                    <option value="price-high">گران‌ترین</option>
                    <option value="rating">بالاترین امتیاز</option>
                  </select>
                </div>
                <div className="text-gray-600 text-sm">
                  نمایش {sortedProducts.length} محصول از {transformedProducts.length} محصول
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2 sm:gap-3 mb-12">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={Number(product.id)}
                  title={product.title}
                  description={product.description}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  discountPercentage={product.discount}
                  image={product.image}
                  badge={product.badge}
                  rating={product.rating}
                  reviews={product.reviews}
                  features={product.features}
                  href={`/products/${product.slug}`}
                  buttonText="مشاهده محصول"
                />
              ))}
            </div>

            {/* FAQ Section - Only show if FAQs exist */}
            {faqs.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">سوالات متداول</h2>
                <div className="space-y-4">
                  {faqs.map((faq) => (
                    <div key={faq.id} className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                        className="w-full text-right p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-800">{faq.question}</span>
                        <svg
                          className={`w-5 h-5 text-gray-500 transition-transform ${
                            expandedFaq === faq.id ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {expandedFaq === faq.id && (
                        <div className="px-4 pb-4 text-gray-600 border-t border-gray-100">
                          <p className="pt-3">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Articles Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">مقالات مرتبط با محصول</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedArticles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/blog/${article.id}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
                  >
                    <h3 className="font-medium text-gray-800 mb-2 line-clamp-2">{article.title}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">{article.category}</span>
                      <span>{article.readTime}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* User Reviews Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">نظرات کاربران</h2>
              </div>

              <div className="space-y-4 mb-8">
                {userReviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <span className="font-medium text-gray-800">{review.name}</span>
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
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">ثبت نظر</h3>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">نام</label>
                      <input
                        type="text"
                        value={newReview.name}
                        onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">امتیاز</label>
                      <select
                        value={newReview.rating}
                        onChange={(e) => setNewReview({ ...newReview, rating: Number.parseInt(e.target.value) })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <option key={rating} value={rating}>
                            {rating} ستاره
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">نظر شما</label>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="نظر خود را بنویسید..."
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    ثبت نظر
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer style={{ backgroundColor: "#3092BE" }}>
        <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 text-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 text-center md:text-right">
            <div>
              <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">SharifGPT</h3>
              <p className="text-sm text-blue-100">ارائه دهنده برترین دوره‌ها و محصولات دیجیتال مبتنی بر هوش مصنوعی.</p>
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">لینک‌های سریع</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-blue-100 hover:text-white">
                    قوانین و مقررات
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-100 hover:text-white">
                    سیاست حریم خصوصی
                  </a>
                </li>
                <li>
                  <a href="/about" className="text-blue-100 hover:text-white">
                    درباره ما
                  </a>
                </li>
              </ul>
            </div>
            <div className="sm:col-span-2 md:col-span-1">
              <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">نماد اعتماد</h3>
              <div className="flex justify-center md:justify-start">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-xs sm:text-sm">جای نماد</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 sm:mt-8 border-t border-blue-500 pt-4 sm:pt-6 text-center text-xs sm:text-sm text-blue-200">
            <p>&copy; 1403 - تمامی حقوق برای SharifGPT محفوظ است.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
