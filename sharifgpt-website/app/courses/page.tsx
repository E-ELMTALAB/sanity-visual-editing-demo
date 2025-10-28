"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("popular")
  const [showFilters, setShowFilters] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [newReview, setNewReview] = useState({ name: "", rating: 5, comment: "" })
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [user, setUser] = useState({ name: "مهدی", email: "mehdi@example.com" })
  const [headerVisible, setHeaderVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

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

  // Scroll behavior to hide/show header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY < 10) {
        setHeaderVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHeaderVisible(false)
      } else if (currentScrollY < lastScrollY) {
        setHeaderVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const categories = [
    { id: "all", name: "همه دوره‌ها", count: 24 },
    { id: "ai", name: "هوش مصنوعی", count: 8 },
    { id: "programming", name: "برنامه‌نویسی", count: 6 },
    { id: "design", name: "طراحی", count: 4 },
    { id: "marketing", name: "دیجیتال مارکتینگ", count: 3 },
    { id: "business", name: "کسب و کار", count: 3 },
  ]

  const courses = [
    {
      id: 1,
      title: "دوره جامع ChatGPT و هوش مصنوعی",
      description: "آموزش کامل استفاده از ChatGPT و ابزارهای هوش مصنوعی برای افزایش بهره‌وری در کار و زندگی",
      price: 890000,
      originalPrice: 1200000,
      discount: 26,
      rating: 4.8,
      reviews: 156,
      image: "/ai-course-special-offer-banner-persian-text.jpg",
      category: "ai",
      duration: "12 ساعت",
      sessions: 24,
      level: "مقدماتی تا پیشرفته",
      instructor: "دکتر احمد محمدی",
      students: 2847,
      features: [
        "آموزش کامل ChatGPT و GPT-4",
        "ابزارهای هوش مصنوعی برای کسب و کار",
        "پروژه‌های عملی و کاربردی",
        "گواهینامه معتبر پایان دوره",
        "پشتیبانی مادام‌العمر",
        "دسترسی به انجمن اختصاصی",
      ],
      badge: "پرفروش",
      syllabus: [
        "مقدمه‌ای بر هوش مصنوعی",
        "آشنایی با ChatGPT",
        "تکنیک‌های پیشرفته Prompt Engineering",
        "ابزارهای تولید محتوا",
        "هوش مصنوعی در کسب و کار",
      ],
    },
    {
      id: 2,
      title: "برنامه‌نویسی Python از صفر تا صد",
      description: "یادگیری کامل زبان برنامه‌نویسی Python از مبانی تا پروژه‌های پیشرفته",
      price: 750000,
      originalPrice: 950000,
      discount: 21,
      rating: 4.7,
      reviews: 203,
      image: "/python-programming-course.jpg",
      category: "programming",
      duration: "18 ساعت",
      sessions: 36,
      level: "مقدماتی",
      instructor: "مهندس سارا احمدی",
      students: 1923,
      features: [
        "آموزش از پایه تا پیشرفته",
        "پروژه‌های عملی متنوع",
        "کار با کتابخانه‌های محبوب",
        "آموزش Django و Flask",
        "پروژه نهایی کامل",
      ],
      badge: "جدید",
    },
    {
      id: 3,
      title: "طراحی UI/UX حرفه‌ای",
      description: "آموزش کامل طراحی رابط کاربری و تجربه کاربری از مبانی تا حرفه‌ای شدن",
      price: 680000,
      originalPrice: 850000,
      discount: 20,
      rating: 4.9,
      reviews: 89,
      image: "/ui-ux-design-course.jpg",
      category: "design",
      duration: "15 ساعت",
      sessions: 30,
      level: "مقدماتی تا متوسط",
      instructor: "استاد علی رضایی",
      students: 1456,
      features: ["اصول طراحی UI/UX", "کار با Figma و Adobe XD", "طراحی موبایل فرست", "پروتوتایپ سازی", "تست کاربری"],
      badge: "محبوب",
    },
    {
      id: 4,
      title: "دیجیتال مارکتینگ و SEO",
      description: "استراتژی‌های مدرن بازاریابی دیجیتال و بهینه‌سازی موتورهای جستجو",
      price: 590000,
      originalPrice: 750000,
      discount: 21,
      rating: 4.6,
      reviews: 124,
      image: "/digital-marketing-seo-course.jpg",
      category: "marketing",
      duration: "10 ساعت",
      sessions: 20,
      level: "مقدماتی تا متوسط",
      instructor: "مهندس مریم کریمی",
      students: 987,
      features: [
        "SEO تکنیکال و محتوایی",
        "تبلیغات گوگل و فیسبوک",
        "بازاریابی شبکه‌های اجتماعی",
        "تحلیل و آنالیتیکس",
        "استراتژی محتوا",
      ],
    },
    {
      id: 5,
      title: "راه‌اندازی کسب و کار آنلاین",
      description: "راهنمای کامل شروع و مدیریت کسب و کار اینترنتی موفق",
      price: 450000,
      originalPrice: 600000,
      discount: 25,
      rating: 4.5,
      reviews: 67,
      image: "/online-business-startup-course.jpg",
      category: "business",
      duration: "8 ساعت",
      sessions: 16,
      level: "مقدماتی",
      instructor: "دکتر حسین نوری",
      students: 543,
      features: ["ایده‌یابی و تحقیق بازار", "مدل کسب و کار", "فروش آنلاین", "مدیریت مالی", "رشد و توسعه"],
    },
    {
      id: 6,
      title: "React و Next.js پیشرفته",
      description: "توسعه اپلیکیشن‌های وب مدرن با React و Next.js",
      price: 820000,
      originalPrice: 1000000,
      discount: 18,
      rating: 4.8,
      reviews: 91,
      image: "/react-nextjs-advanced-course.jpg",
      category: "programming",
      duration: "20 ساعت",
      sessions: 40,
      level: "متوسط تا پیشرفته",
      instructor: "مهندس امیر حسینی",
      students: 756,
      features: [
        "React Hooks پیشرفته",
        "Next.js 14 و App Router",
        "TypeScript کامل",
        "State Management",
        "پروژه‌های Real-world",
      ],
      badge: "پیشنهاد ویژه",
    },
  ]

  const faqs = [
    {
      id: 1,
      question: "دوره‌ها چگونه ارائه می‌شوند؟",
      answer:
        "تمام دوره‌ها به صورت ویدیویی ضبط شده و در پلتفرم آنلاین ما قرار دارند. شما می‌توانید در هر زمان و مکانی به آن‌ها دسترسی داشته باشید.",
    },
    {
      id: 2,
      question: "آیا گواهینامه دریافت می‌کنم؟",
      answer: "بله، پس از تکمیل موفقیت‌آمیز هر دوره، گواهینامه معتبر و قابل تأیید برای شما صادر می‌شود.",
    },
    {
      id: 3,
      question: "مدت زمان دسترسی به دوره چقدر است؟",
      answer:
        "پس از خرید، دسترسی مادام‌العمر به محتوای دوره خواهید داشت و می‌توانید هر زمان که خواستید به آن مراجعه کنید.",
    },
    {
      id: 4,
      question: "آیا امکان بازپرداخت وجود دارد؟",
      answer: "بله، تا 30 روز پس از خرید، در صورت عدم رضایت می‌توانید درخواست بازپرداخت کامل وجه دهید.",
    },
    {
      id: 5,
      question: "پیش‌نیازهای دوره‌ها چیست؟",
      answer:
        "پیش‌نیازهای هر دوره در صفحه جزئیات آن دوره مشخص شده است. اکثر دوره‌های مقدماتی نیاز به پیش‌نیاز خاصی ندارند.",
    },
  ]

  const relatedArticles = [
    {
      id: 1,
      title: "راهنمای انتخاب بهترین دوره آموزشی ��نلاین",
      category: "آموزش",
      readTime: "8 دقیقه",
    },
    {
      id: 2,
      title: "مزایای یادگیری هوش مصنوعی در سال 2024",
      category: "هوش مصنوعی",
      readTime: "6 دقیقه",
    },
    {
      id: 3,
      title: "چگونه برنامه‌نویسی را از صفر شروع کنیم؟",
      category: "برنامه‌نویسی",
      readTime: "10 دقیقه",
    },
    {
      id: 4,
      title: "آینده شغلی طراحان UI/UX",
      category: "طراحی",
      readTime: "7 دقیقه",
    },
  ]

  const userReviews = [
    {
      id: 1,
      name: "محمد رضا",
      rating: 5,
      comment: "دوره ChatGPT فوق‌العاده بود. مطالب کاربردی و مفید. به همه توصیه می‌کنم.",
      date: "1403/02/15",
      course: "دوره جامع ChatGPT",
    },
    {
      id: 2,
      name: "فاطمه احمدی",
      rating: 5,
      comment: "استاد بسیار خوب تدریس می‌کند. دوره Python عالی بود و خیلی چیز یاد گرفتم.",
      date: "1403/02/10",
      course: "برنامه‌نویسی Python",
    },
    {
      id: 3,
      name: "علی محمدی",
      rating: 4,
      comment: "دوره UI/UX خیلی جامع بود. فقط کاش پروژه‌های بیشتری داشت.",
      date: "1403/02/05",
      course: "طراحی UI/UX",
    },
  ]

  const filteredCourses = courses.filter((course) => selectedCategory === "all" || course.category === selectedCategory)

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "newest":
        return b.id - a.id
      default:
        return b.students - a.students
    }
  })

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("New review:", newReview)
    setNewReview({ name: "", rating: 5, comment: "" })
  }

  return (
    <div className="bg-gray-50 min-h-screen" dir="rtl">
      <header className={`fixed top-0 left-0 right-0 z-50 glassmorphism transition-transform duration-300 ${headerVisible ? 'translate-y-0' : '-translate-y-full'}`}>
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
                              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
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
      </header>

      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-blue-600">
              خانه
            </Link>
            <span>/</span>
            <span className="text-gray-800">دوره‌ها</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">دوره‌های آموزشی آنلاین</h1>
          <p className="text-gray-600 mt-2">بهترین دوره‌های آموزشی با اساتید مجرب</p>
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
                      <span className="text-gray-600">زیر 500,000 تومان</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="ml-2" />
                      <span className="text-gray-600">500,000 - 800,000 تومان</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="ml-2" />
                      <span className="text-gray-600">بالای 800,000 تومان</span>
                    </label>
                  </div>
                </div>

                {/* Level */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4">سطح دوره</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="ml-2" />
                      <span className="text-gray-600">مقدماتی</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="ml-2" />
                      <span className="text-gray-600">متوسط</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="ml-2" />
                      <span className="text-gray-600">پیشرفته</span>
                    </label>
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4">مدت زمان</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="ml-2" />
                      <span className="text-gray-600">کمتر از 10 ساعت</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="ml-2" />
                      <span className="text-gray-600">10 تا 20 ساعت</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="ml-2" />
                      <span className="text-gray-600">بیش از 20 ساعت</span>
                    </label>
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
                  نمایش {sortedCourses.length} دوره از {courses.length} دوره
                </div>
              </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
              {sortedCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative">
                    <img
                      src={course.image || "/placeholder.svg"}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    {course.discount > 0 && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        {course.discount}% تخفیف
                      </div>
                    )}
                    {course.badge && (
                      <div className="absolute top-3 left-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        {course.badge}
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">{course.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>

                    {/* Course Info */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {course.duration}
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 4V2a1 1 0 01-1-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1h4z"
                          />
                        </svg>
                        {course.sessions} جلسه
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        {course.students} دانشجو
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {course.level}
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(course.rating) ? "text-yellow-400" : "text-gray-300"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-gray-600 text-sm mr-2">
                        {course.rating} ({course.reviews} نظر)
                      </span>
                    </div>

                    {/* Instructor */}
                    <div className="text-sm text-gray-600 mb-4">
                      <span className="font-medium">مدرس: </span>
                      {course.instructor}
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <span className="text-2xl font-bold text-gray-800">{course.price.toLocaleString()}</span>
                        <span className="text-sm text-gray-600">تومان</span>
                        {course.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            {course.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2 space-x-reverse">
                      <Link
                        href={`/courses/${course.id}`}
                        className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        مشاهده دوره
                      </Link>
                      <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* FAQ Section */}
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
              <div className="mt-6 text-center">
                <button className="text-blue-600 hover:text-blue-700 font-medium">بیشتر...</button>
              </div>
            </div>

            {/* Related Articles Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">مقالات مرتبط با دوره‌ها</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="mt-6 text-center">
                <Link href="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
                  مشاهده همه مقالات
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* User Reviews Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">نظرات دانشجویان</h2>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i < 4 ? "text-yellow-400" : "text-gray-300"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-bold">4.7</span>
                    <span className="mx-1">میانگین امتیاز</span>
                    <span className="text-blue-600">247</span>
                    <span>مجموع نظر</span>
                  </div>
                </div>
              </div>

              {/* Existing Reviews */}
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
                    <p className="text-gray-600 mb-1">{review.comment}</p>
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">{review.course}</span>
                  </div>
                ))}
              </div>

              {/* Review Submission Form */}
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

              <div className="mt-6 text-center">
                <button className="bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600 transition-colors font-medium">
                  نظرات کاربران
                </button>
              </div>
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


