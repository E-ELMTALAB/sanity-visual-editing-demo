"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import ProductCard from "@/components/product-card"
import type { FAQ } from "../../../types"

interface ProductsPageClientProps {
  faqsData?: FAQ[]
}

export default function ProductsPageClient({ faqsData }: ProductsPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("popular")
  const [showFilters, setShowFilters] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [user, setUser] = useState({ name: "مهدی", email: "mehdi@example.com" })
  const [headerVisible, setHeaderVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [products, setProducts] = useState<any[]>([])

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

  // Fetch products from Sanity
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        if (response.ok) {
          const productsData = await response.json()
          setProducts(productsData)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }
    
    fetchProducts()
  }, [])

  const categories = [
    { id: "all", name: "همه محصولات", count: 45 },
    { id: "ai", name: "هوش مصنوعی", count: 15 },
    { id: "social-media", name: "سوشیال مدیا", count: 8 },
    { id: "music", name: "موسیقی", count: 6 },
    { id: "educational", name: "آموزشی", count: 10 },
    { id: "sim-card", name: "سیمکارت", count: 6 },
  ]

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const categoryParam = urlParams.get("category")
    if (categoryParam && categories.some((cat) => cat.id === categoryParam)) {
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

  // Scroll behavior to hide/show header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY < 10) {
        setHeaderVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px
        setHeaderVisible(false)
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setHeaderVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const filteredProducts = products.filter(
    (product) => selectedCategory === "all" || product.category === selectedCategory,
  )

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return (a.price || 0) - (b.price || 0)
      case "price-high":
        return (b.price || 0) - (a.price || 0)
      case "rating":
        return (b.rating || 0) - (a.rating || 0)
      case "newest":
        return (b._id || b.id || 0) - (a._id || a.id || 0)
      default:
        return (b.reviewCount || b.reviews || 0) - (a.reviewCount || a.reviews || 0)
    }
  })

  return (
    <div className="bg-gray-50 min-h-screen" dir="rtl">
      <header className={`fixed top-0 left-0 right-0 z-50 glassmorphism transition-transform duration-300 ${headerVisible ? 'translate-y-0' : '-translate-y-full'}`}>
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

                {/* Products Dropdown Menu */}
                <div className="absolute top-full right-0 mt-2 w-[800px] bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                  <div className="p-8">
                    <div className="grid grid-cols-3 gap-8">
                      <div>
                        <div className="flex items-center mb-6">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center ml-3">
                            <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-bold text-gray-800">هوش مصنوعی کاربردی</h3>
                        </div>
                        <ul className="space-y-3">
                          <li>
                            <Link
                              href="/products?category=ai"
                              className="flex items-center text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                            >
                              <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center ml-3">
                                <span className="text-white text-xs font-bold">🤖</span>
                              </div>
                              <span>ChatGPT Plus</span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/products?category=ai"
                              className="flex items-center text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                            >
                              <div className="w-6 h-6 bg-indigo-500 rounded flex items-center justify-center ml-3">
                                <span className="text-white text-xs font-bold">💡</span>
                              </div>
                              <span>Claude Pro</span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/products?category=ai"
                              className="text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 block"
                            >
                              Gemini Advanced
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/products?category=ai"
                              className="text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 block"
                            >
                              Perplexity Pro
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/products?category=ai"
                              className="text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 block"
                            >
                              Copilot Pro
                            </Link>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <div className="flex items-center mb-6">
                          <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center ml-3">
                            <svg className="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-bold text-gray-800">هوش مصنوعی متن به عکس</h3>
                        </div>
                        <ul className="space-y-3">
                          <li>
                            <Link
                              href="/products?category=ai"
                              className="flex items-center text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                            >
                              <div className="w-6 h-6 bg-pink-500 rounded flex items-center justify-center ml-3">
                                <span className="text-white text-xs font-bold">🎨</span>
                              </div>
                              <span>Midjourney</span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/products?category=ai"
                              className="flex items-center text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                            >
                              <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center ml-3">
                                <span className="text-white text-xs font-bold">🖼️</span>
                              </div>
                              <span>DALL-E 3</span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/products?category=ai"
                              className="text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 block"
                            >
                              Stable Diffusion
                            </Link>
                          </li>
                        </ul>

                        <div className="mt-8">
                          <div className="flex items-center mb-4">
                            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center ml-3">
                              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">هوش مصنوعی متن به ویدیو</h3>
                          </div>
                          <ul className="space-y-3">
                            <li>
                              <Link
                                href="/products?category=ai"
                                className="flex items-center text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                              >
                                <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center ml-3">
                                  <span className="text-white text-xs font-bold">🎬</span>
                                </div>
                                <span>Runway ML</span>
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/products?category=ai"
                                className="text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 block"
                              >
                                Pika Labs
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center mb-6">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center ml-3">
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-bold text-gray-800">هوش مصنوعی برنامه‌نویسی</h3>
                        </div>
                        <ul className="space-y-3">
                          <li>
                            <Link
                              href="/products?category=ai"
                              className="flex items-center text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                            >
                              <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center ml-3">
                                <span className="text-white text-xs font-bold">💻</span>
                              </div>
                              <span>GitHub Copilot</span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/products?category=ai"
                              className="flex items-center text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                            >
                              <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center ml-3">
                                <span className="text-white text-xs font-bold">🔧</span>
                              </div>
                              <span>Cursor Pro</span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/products?category=ai"
                              className="text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 block"
                            >
                              Replit AI
                            </Link>
                          </li>
                        </ul>

                        <div className="mt-8">
                          <div className="flex items-center mb-4">
                            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center ml-3">
                              <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                              </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">هوش مصنوعی متن به صدا</h3>
                          </div>
                          <ul className="space-y-3">
                            <li>
                              <Link
                                href="/products?category=ai"
                                className="flex items-center text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                              >
                                <div className="w-6 h-6 bg-yellow-500 rounded flex items-center justify-center ml-3">
                                  <span className="text-white text-xs font-bold">🎵</span>
                                </div>
                                <span>ElevenLabs</span>
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/products?category=ai"
                                className="text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 block"
                              >
                                Murf AI
                              </Link>
                            </li>
                          </ul>
                        </div>

                        <div className="mt-8">
                          <div className="flex items-center mb-4">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center ml-3">
                              <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">سایر هوش مصنوعی‌ها</h3>
                          </div>
                          <ul className="space-y-3">
                            <li>
                              <Link
                                href="/products?category=ai"
                                className="text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 block"
                              >
                                مشاهده همه
                              </Link>
                            </li>
                          </ul>
                        </div>

                        {/* Popular Badge */}
                        <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                          <div className="flex items-center mb-2">
                            <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                              محبوب
                            </span>
                          </div>
                          <h4 className="font-bold text-gray-800 mb-1">پکیج AI کامل</h4>
                          <p className="text-sm text-gray-600">تمام ابزارهای هوش مصنوعی</p>
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

                {/* Courses Dropdown Menu */}
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
                  <div className="relative cursor-pointer transition-transform duration-300 transform hover:scale-110">
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
                        <a
                          href="#"
                          className="flex items-center space-x-3 space-x-reverse px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                          <span>علاقه‌مندی‌ها</span>
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
                              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.066z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <span>تنظیمات</span>
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

                {/* Welcome Tooltip for Authenticated Users */}
                {isAuthenticated && !isProfileDropdownOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 p-2 bg-white rounded-md shadow-lg text-center whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20 hidden sm:block">
                    <p className="text-xs font-medium text-gray-700">
                      خوش آمدی <span className="text-[#3092BE] font-bold">{user.name}</span>!
                    </p>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-4 border-b-white"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="w-full h-px bg-gray-200"></div>
        </div>
      </header>

      {/* Header */}
      <div className="bg-white shadow-sm mt-16 sm:mt-20">
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
                {/* Categories */}
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

                {/* Price Range */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4">محدوده قیمت</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="ml-2" />
                      <span className="text-gray-600">زیر 200,000 تومان</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="ml-2" />
                      <span className="text-gray-600">200,000 - 300,000 تومان</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="ml-2" />
                      <span className="text-gray-600">بالای 300,000 تومان</span>
                    </label>
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4">امتیاز</h4>
                  <div className="space-y-2">
                    {[5, 4, 3].map((rating) => (
                      <label key={rating} className="flex items-center">
                        <input type="checkbox" className="ml-2" />
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="text-gray-600 mr-2">و بالاتر</span>
                        </div>
                      </label>
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
                  نمایش {sortedProducts.length} محصول از {products.length} محصول
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2 sm:gap-3 mb-12">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product._id || product.id}
                  id={product._id || product.id}
                  title={product.name || product.title}
                  description={product.description}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  discountPercentage={product.discountPercentage || product.discount}
                  image={product.image}
                  badge={product.badges?.[0] || product.badge}
                  rating={product.rating}
                  reviews={product.reviewCount || product.reviews}
                  features={product.features}
                  href={`/products/${product.slug?.current || product.slug || product.id}`}
                  buttonText="مشاهده محصول"
                />
              ))}
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">سوالات متداول</h2>
              </div>
              
              {/* Dynamic FAQ List from Sanity */}
              {faqsData && faqsData.length > 0 ? (
                <div className="space-y-3">
                  {faqsData.map((faq, index) => (
                    <div key={faq._id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                        className="w-full flex items-center justify-between p-5 text-right hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start gap-3 flex-1">
                          {faq.category && (
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                              {faq.category === 'general' && 'عمومی'}
                              {faq.category === 'payment' && 'پرداخت'}
                              {faq.category === 'shipping' && 'ارسال'}
                              {faq.category === 'account' && 'حساب کاربری'}
                              {faq.category === 'technical' && 'فنی'}
                              {faq.category === 'products' && 'محصولات'}
                              {faq.category === 'services' && 'خدمات'}
                              {faq.category === 'other' && 'سایر'}
                            </span>
                          )}
                          <h3 className="font-semibold text-gray-800 flex-1">{faq.question}</h3>
                        </div>
                        <svg
                          className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 mr-3 ${
                            expandedFaq === index ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {expandedFaq === index && (
                        <div className="px-5 pb-5 text-gray-600 leading-relaxed">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>هیچ سوالی یافت نشد</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-12">
              <div className="flex items-center space-x-2 space-x-reverse">
                <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  قبلی
                </button>
                {[1, 2, 3].map((page) => (
                  <button
                    key={page}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      page === 1 ? "bg-blue-600 text-white" : "border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  بعدی
                </button>
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
                  <a href="#" className="text-blue-100 hover:text-white">
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
