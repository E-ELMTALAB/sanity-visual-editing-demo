"use client"

import type React from "react"
import Link from "next/link"
import { useEffect, useState } from "react"
import MobileMenu from "./mobile-menu"
import CartDropdown from "./cart-dropdown"

interface HeaderProps {
  showProductsDropdown?: boolean
  showCoursesDropdown?: boolean
}

export default function Header({ showProductsDropdown = true, showCoursesDropdown = true }: HeaderProps) {
  const [products, setProducts] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false)
  const [cartState, setCartState] = useState({ itemCount: 0 })

  // Fetch products from Sanity
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        if (response.ok) {
          const productsData = await response.json()
          setProducts(productsData)
        } else {
          // Fallback to sample products if no products in Sanity
          setProducts([
            { _id: '1', name: 'ChatGPT Plus', slug: { current: 'chatgpt-plus' }, category: 'ai' },
            { _id: '2', name: 'Claude Pro', slug: { current: 'claude-pro' }, category: 'ai' },
            { _id: '3', name: 'Spotify Premium', slug: { current: 'spotify-premium' }, category: 'music' },
            { _id: '4', name: 'Netflix Premium', slug: { current: 'netflix-premium' }, category: 'entertainment' },
            { _id: '5', name: 'YouTube Premium', slug: { current: 'youtube-premium' }, category: 'educational' },
            { _id: '6', name: 'Instagram Premium', slug: { current: 'instagram-premium' }, category: 'social-media' },
            { _id: '7', name: 'LinkedIn Premium', slug: { current: 'linkedin-premium' }, category: 'social-media' },
            { _id: '8', name: 'Coursera Plus', slug: { current: 'coursera-plus' }, category: 'educational' },
            { _id: '9', name: 'Udemy Business', slug: { current: 'udemy-business' }, category: 'educational' }
          ])
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        // Fallback to sample products on error
        setProducts([
          { _id: '1', name: 'ChatGPT Plus', slug: { current: 'chatgpt-plus' }, category: 'ai' },
          { _id: '2', name: 'Claude Pro', slug: { current: 'claude-pro' }, category: 'ai' },
          { _id: '3', name: 'Spotify Premium', slug: { current: 'spotify-premium' }, category: 'music' },
          { _id: '4', name: 'Netflix Premium', slug: { current: 'netflix-premium' }, category: 'entertainment' },
          { _id: '5', name: 'YouTube Premium', slug: { current: 'youtube-premium' }, category: 'educational' },
          { _id: '6', name: 'Instagram Premium', slug: { current: 'instagram-premium' }, category: 'social-media' },
          { _id: '7', name: 'LinkedIn Premium', slug: { current: 'linkedin-premium' }, category: 'social-media' },
          { _id: '8', name: 'Coursera Plus', slug: { current: 'coursera-plus' }, category: 'educational' },
          { _id: '9', name: 'Udemy Business', slug: { current: 'udemy-business' }, category: 'educational' }
        ])
      }
    }
    
    if (showProductsDropdown) {
      fetchProducts()
    }
  }, [showProductsDropdown])

  // Fetch courses from Sanity
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses')
        if (response.ok) {
          const coursesData = await response.json()
          setCourses(coursesData)
        } else {
          // Fallback to sample courses if no courses in Sanity
          setCourses([
            { _id: '1', title: 'آشنایی با ChatGPT', slug: { current: 'chatgpt-intro' }, category: 'ai' },
            { _id: '2', title: 'تکنیک‌های پرامپت نویسی', slug: { current: 'prompt-techniques' }, category: 'ai' },
            { _id: '3', title: 'هوش مصنوعی برای مبتدیان', slug: { current: 'ai-beginners' }, category: 'ai' },
            { _id: '4', title: 'هوش مصنوعی در بازاریابی', slug: { current: 'ai-marketing' }, category: 'business' },
            { _id: '5', title: 'مدیریت پروژه با AI', slug: { current: 'ai-project-management' }, category: 'business' },
            { _id: '6', title: 'تولید محتوا با AI', slug: { current: 'ai-content-creation' }, category: 'design' },
            { _id: '7', title: 'ساخت ویدیو با هوش مصنوعی', slug: { current: 'ai-video-creation' }, category: 'design' },
            { _id: '8', title: 'طراحی گرافیک با AI', slug: { current: 'ai-graphic-design' }, category: 'design' },
            { _id: '9', title: 'برنامه‌نویسی با کمک AI', slug: { current: 'ai-programming' }, category: 'programming' }
          ])
        }
      } catch (error) {
        console.error('Error fetching courses:', error)
        // Fallback to sample courses on error
        setCourses([
          { _id: '1', title: 'آشنایی با ChatGPT', slug: { current: 'chatgpt-intro' }, category: 'ai' },
          { _id: '2', title: 'تکنیک‌های پرامپت نویسی', slug: { current: 'prompt-techniques' }, category: 'ai' },
          { _id: '3', title: 'هوش مصنوعی برای مبتدیان', slug: { current: 'ai-beginners' }, category: 'ai' },
          { _id: '4', title: 'هوش مصنوعی در بازاریابی', slug: { current: 'ai-marketing' }, category: 'business' },
          { _id: '5', title: 'مدیریت پروژه با AI', slug: { current: 'ai-project-management' }, category: 'business' },
          { _id: '6', title: 'تولید محتوا با AI', slug: { current: 'ai-content-creation' }, category: 'design' },
          { _id: '7', title: 'ساخت ویدیو با هوش مصنوعی', slug: { current: 'ai-video-creation' }, category: 'design' },
          { _id: '8', title: 'طراحی گرافیک با AI', slug: { current: 'ai-graphic-design' }, category: 'design' },
          { _id: '9', title: 'برنامه‌نویسی با کمک AI', slug: { current: 'ai-programming' }, category: 'programming' }
        ])
      }
    }
    
    if (showCoursesDropdown) {
      fetchCourses()
    }
  }, [showCoursesDropdown])

  const handleCartClick = () => {
    setIsCartDropdownOpen(!isCartDropdownOpen)
  }

  return (
    <>
      {/* Header Section */}
      <header className="sticky top-0 z-50 glassmorphism">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Mobile Menu Button - Only visible on mobile */}
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
              
              {/* Products Dropdown */}
              {showProductsDropdown && (
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
                        {/* Products from Sanity */}
                        {products.length > 0 ? (
                          products.slice(0, 9).map((product, index) => (
                            <div key={product._id || index} className="col-span-1">
                              <Link
                                href={`/products/${product.slug?.current || product.slug || '#'}`}
                                className="flex items-center text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                              >
                                <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center ml-3">
                                  <span className="text-white text-xs font-bold">
                                    {product.category === 'ai' ? '🤖' : 
                                     product.category === 'music' ? '🎵' : 
                                     product.category === 'social-media' ? '📱' : 
                                     product.category === 'educational' ? '📚' : 
                                     product.category === 'entertainment' ? '🎬' : '📦'}
                                  </span>
                                </div>
                                <span>{product.name || 'محصول'}</span>
                              </Link>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-3 text-center py-8">
                            <p className="text-gray-500">هیچ محصولی یافت نشد</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Courses Dropdown */}
              {showCoursesDropdown && (
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
                        {/* Courses from Sanity */}
                        {courses.length > 0 ? (
                          courses.slice(0, 9).map((course, index) => (
                            <div key={course._id || index} className="col-span-1">
                              <Link
                                href={`/courses/${course.slug?.current || course.slug || '#'}`}
                                className="flex items-center text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                              >
                                <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center ml-3">
                                  <span className="text-white text-xs font-bold">
                                    {course.category === 'ai' ? '🤖' : 
                                     course.category === 'business' ? '💼' : 
                                     course.category === 'design' ? '🎨' : 
                                     course.category === 'programming' ? '💻' : 
                                     course.category === 'marketing' ? '📊' : 
                                     course.category === 'web-development' ? '🌐' : 
                                     course.category === 'data-science' ? '📈' : '📚'}
                                  </span>
                                </div>
                                <span>{course.title || course.name || 'دوره'}</span>
                              </Link>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-3 text-center py-8">
                            <p className="text-gray-500">هیچ دوره‌ای یافت نشد</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

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

            {/* Actions: Search, Contact, Cart, Profile */}
            <div className="flex items-center space-x-3 sm:space-x-5 space-x-reverse">
              {/* Search Box */}
              <div className="relative hidden xl:block">
                <input
                  type="text"
                  placeholder="جستجو..."
                  className="w-64 px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Contact Button */}
              <Link
                href="/contact"
                className="hidden sm:flex items-center text-gray-700 hover:text-[#3092BE] transition-all duration-300 px-3 py-2 rounded-lg text-sm font-medium transform hover:scale-105 hover:shadow-[0_0_15px_rgba(48,146,190,0.3)]"
              >
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                تماس
              </Link>

              {/* Cart Button */}
              <button
                onClick={handleCartClick}
                className="relative flex items-center text-gray-700 hover:text-[#3092BE] transition-all duration-300 px-3 py-2 rounded-lg text-sm font-medium transform hover:scale-105 hover:shadow-[0_0_15px_rgba(48,146,190,0.3)]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                {cartState.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartState.itemCount}
                  </span>
                )}
              </button>

              {/* Profile Button */}
              <Link
                href="/login"
                className="flex items-center text-gray-700 hover:text-[#3092BE] transition-all duration-300 px-3 py-2 rounded-lg text-sm font-medium transform hover:scale-105 hover:shadow-[0_0_15px_rgba(48,146,190,0.3)]"
              >
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                ورود
              </Link>
            </div>
          </div>
          <div className="w-full h-px bg-gray-200"></div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Cart Dropdown */}
      <CartDropdown isOpen={isCartDropdownOpen} onClose={() => setIsCartDropdownOpen(false)} />
    </>
  )
}
