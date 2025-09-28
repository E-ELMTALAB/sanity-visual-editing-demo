"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function CourseDetailPage() {
  const params = useParams()
  const courseId = params.id as string

  const [activeTab, setActiveTab] = useState("overview")
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

  // Sample course data - in real app, this would be fetched based on courseId
  const course = {
    id: Number.parseInt(courseId) || 1,
    title: "دوره جامع ChatGPT و هوش مصنوعی",
    description: "آموزش کامل استفاده از ChatGPT و ابزارهای هوش مصنوعی برای افزایش بهره‌وری در کار و زندگی",
    longDescription: `این دوره جامع شما را با دنیای شگفت‌انگیز هوش مصنوعی آشنا می‌کند. از مبانی ChatGPT گرفته تا تکنیک‌های پیشرفته Prompt Engineering، همه چیز را یاد خواهید گرفت. 

    در این دوره، شما یاد می‌گیرید چگونه از هوش مصنوعی برای بهبود کسب و کارتان، افزایش بهره‌وری شخصی، و حل مسائل پیچیده استفاده کنید. با پروژه‌های عملی و مثال‌های واقعی، مهارت‌های لازم برای موفقیت در عصر هوش مصنوعی را کسب خواهید کرد.`,
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
    instructor: {
      name: "دکتر احمد محمدی",
      bio: "دکترای هوش مصنوعی از دانشگاه تهران با بیش از 10 سال تجربه در صنعت فناوری",
      image: "/placeholder.svg?height=100&width=100&text=استاد",
      experience: "10+ سال",
      students: 15000,
      courses: 25,
    },
    students: 2847,
    features: [
      "آموزش کامل ChatGPT و GPT-4",
      "ابزارهای هوش مصنوعی برای کسب و کار",
      "پروژه‌های عملی و کاربردی",
      "گواهینامه معتبر پایان دوره",
      "پشتیبانی مادام‌العمر",
      "دسترسی به انجمن اختصاصی",
    ],
    requirements: ["دسترسی به اینترنت", "علاقه به یادگیری فناوری‌های جدید", "هیچ پیش‌نیاز فنی خاصی نیاز نیست"],
    syllabus: [
      {
        title: "مقدمه‌ای بر هوش مصنوعی",
        duration: "45 دقیقه",
        lessons: ["تاریخچه هوش مصنوعی", "انواع هوش مصنوعی", "کاربردهای روزمره AI"],
      },
      {
        title: "آشنایی با ChatGPT",
        duration: "90 دقیقه",
        lessons: ["ثبت نام و راه‌اندازی", "رابط کاربری ChatGPT", "اولین مکالمه با AI"],
      },
      {
        title: "تکنیک‌های پیشرفته Prompt Engineering",
        duration: "120 دقیقه",
        lessons: ["اصول نوشتن پرامپت موثر", "تکنیک‌های پیشرفته", "بهینه‌سازی نتایج"],
      },
      {
        title: "ابزارهای تولید محتوا",
        duration: "100 دقیقه",
        lessons: ["تولید متن خلاقانه", "ایجاد تصاویر با AI", "ساخت ویدیو و صدا"],
      },
      {
        title: "هوش مصنوعی در کسب و کار",
        duration: "85 دقیقه",
        lessons: ["اتوماسیون فرآیندها", "تحلیل داده با AI", "خدمات مشتری هوشمند"],
      },
    ],
    badge: "پرفروش",
  }

  const faqs = [
    {
      id: 1,
      question: "این دوره برای چه کسانی مناسب است؟",
      answer:
        "این دوره برای همه کسانی که می‌خواهند با هوش مصنوعی آشنا شوند مناسب است. از مبتدیان تا حرفه‌ای‌ها می‌توانند از این دوره بهره‌مند شوند.",
    },
    {
      id: 2,
      question: "آیا نیاز به پیش‌نیاز خاصی دارم؟",
      answer: "خیر، این دوره از پایه شروع می‌شود و تنها نیاز به علاقه و انگیزه برای یادگیری دارید.",
    },
    {
      id: 3,
      question: "مدت زمان دسترسی به دوره چقدر است؟",
      answer: "پس از خرید، دسترسی مادام‌العمر به تمام محتوای دوره خواهید داشت.",
    },
    {
      id: 4,
      question: "آیا گواهینامه دریافت می‌کنم؟",
      answer: "بله، پس از تکمیل موفقیت‌آمیز دوره، گواهینامه معتبر برای شما صادر می‌شود.",
    },
  ]

  const relatedCourses = [
    {
      id: 2,
      title: "برنامه‌نویسی Python از صفر تا صد",
      price: 750000,
      rating: 4.7,
      image: "/python-programming-course.jpg",
    },
    {
      id: 3,
      title: "طراحی UI/UX حرفه‌ای",
      price: 680000,
      rating: 4.9,
      image: "/ui-ux-design-course.jpg",
    },
    {
      id: 4,
      title: "دیجیتال مارکتینگ و SEO",
      price: 590000,
      rating: 4.6,
      image: "/digital-marketing-seo-course.jpg",
    },
  ]

  const userReviews = [
    {
      id: 1,
      name: "محمد رضا",
      rating: 5,
      comment: "دوره فوق‌العاده‌ای بود. مطالب کاربردی و مفید. به همه توصیه می‌کنم.",
      date: "1403/02/15",
    },
    {
      id: 2,
      name: "فاطمه احمدی",
      rating: 5,
      comment: "استاد بسیار خوب تدریس می‌کند. خیلی چیز یاد گرفتم.",
      date: "1403/02/10",
    },
    {
      id: 3,
      name: "علی محمدی",
      rating: 4,
      comment: "دوره خیلی جامع بود. فقط کاش پروژه‌های بیشتری داشت.",
      date: "1403/02/05",
    },
  ]

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("New review:", newReview)
    setNewReview({ name: "", rating: 5, comment: "" })
  }

  const handlePurchase = () => {
    // Handle course purchase
    console.log("Purchasing course:", course.id)
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

                {/* Products Dropdown */}
                <div className="absolute top-full right-0 mt-2 w-[800px] bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                  <div className="p-8">
                    <div className="grid grid-cols-3 gap-8">
                      {/* Applied AI Column */}
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
                              href="/products?category=applied-ai"
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
                              href="/products?category=applied-ai"
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
                              href="/products?category=applied-ai"
                              className="text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 block"
                            >
                              Gemini Advanced
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/products?category=applied-ai"
                              className="text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 block"
                            >
                              Perplexity Pro
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/products?category=applied-ai"
                              className="text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 block"
                            >
                              Copilot Pro
                            </Link>
                          </li>
                        </ul>
                      </div>

                      {/* Text-to-Image and Text-to-Video Column */}
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
                              href="/products?category=text-to-image"
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
                              href="/products?category=text-to-image"
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
                              href="/products?category=text-to-image"
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
                                href="/products?category=text-to-video"
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
                                href="/products?category=text-to-video"
                                className="text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 block"
                              >
                                Pika Labs
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* Programming AI and Other AI Column */}
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
                              href="/products?category=programming-ai"
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
                              href="/products?category=programming-ai"
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
                              href="/products?category=programming-ai"
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
                                href="/products?category=text-to-audio"
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
                                href="/products?category=text-to-audio"
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
                                href="/products?category=other-ai"
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

                {/* Courses Dropdown */}
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 text-right">دسته‌بندی دوره‌ها</h3>
                    <div className="grid grid-cols-1 gap-3">
                      <Link
                        href="/courses?category=ai"
                        className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group/item"
                      >
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center ml-3">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                            />
                          </svg>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-800 group-hover/item:text-[#3092BE]">هوش مصنوعی</div>
                          <div className="text-sm text-gray-500">AI و ChatGPT</div>
                        </div>
                      </Link>
                      <Link
                        href="/courses?category=programming"
                        className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group/item"
                      >
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center ml-3">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                            />
                          </svg>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-800 group-hover/item:text-[#3092BE]">برنامه‌نویسی</div>
                          <div className="text-sm text-gray-500">وب و موبایل</div>
                        </div>
                      </Link>
                      <Link
                        href="/courses?category=design"
                        className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group/item"
                      >
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center ml-3">
                          <svg
                            className="w-6 h-6 text-purple-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                            />
                          </svg>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-800 group-hover/item:text-[#3092BE]">طراحی</div>
                          <div className="text-sm text-gray-500">UI/UX و گرافیک</div>
                        </div>
                      </Link>
                      <Link
                        href="/courses?category=marketing"
                        className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group/item"
                      >
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center ml-3">
                          <svg
                            className="w-6 h-6 text-orange-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                            />
                          </svg>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-800 group-hover/item:text-[#3092BE]">
                            دیجیتال مارکتینگ
                          </div>
                          <div className="text-sm text-gray-500">SEO و تبلیغات</div>
                        </div>
                      </Link>
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
                <div className="flex items-center cursor-pointer" onClick={handleProfileClick}>
                  <div className="relative z-10 -ml-3 sm:-ml-5 transition-transform duration-300 transform hover:scale-110">
                    <img
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white shadow-md object-cover"
                      src={
                        isAuthenticated
                          ? "https://i.imgur.com/3Y1Z0Qj.png"
                          : "https://placehold.co/40x40/E5E7EB/9CA3AF?text=?"
                      }
                      alt="آواتار کاربر"
                    />
                  </div>
                  <div className="relative z-0 transition-transform duration-300 transform hover:scale-110">
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

      {/* Breadcrumb */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">
              خانه
            </Link>
            <span>/</span>
            <Link href="/courses" className="hover:text-blue-600">
              دوره‌ها
            </Link>
            <span>/</span>
            <span className="text-gray-800">{course.title}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">{course.title}</h1>
                  <p className="text-gray-600 mb-4">{course.description}</p>

                  {/* Course Stats */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
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
                          d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1h4z"
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
                          className={`w-5 h-5 ${i < Math.floor(course.rating) ? "text-yellow-400" : "text-gray-300"}`}
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
                </div>

                {course.badge && (
                  <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">{course.badge}</div>
                )}
              </div>

              {/* Course Image */}
              <div className="mb-6">
                <img
                  src={course.image || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-64 lg:h-80 object-cover rounded-lg"
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 space-x-reverse px-6">
                  {[
                    { id: "overview", label: "نمای کلی" },
                    { id: "curriculum", label: "سرفصل‌ها" },
                    { id: "instructor", label: "مدرس" },
                    { id: "reviews", label: "نظرات" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-3">درباره این دوره</h3>
                      <div className="text-gray-600 leading-relaxed whitespace-pre-line">{course.longDescription}</div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-3">ویژگی‌های دوره</h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {course.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-gray-600">
                            <svg
                              className="w-5 h-5 text-green-500 ml-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-3">پیش‌نیازها</h3>
                      <ul className="space-y-2">
                        {course.requirements.map((requirement, index) => (
                          <li key={index} className="flex items-center text-gray-600">
                            <svg
                              className="w-5 h-5 text-blue-500 ml-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {requirement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Curriculum Tab */}
                {activeTab === "curriculum" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">سرفصل‌های دوره</h3>
                    {course.syllabus.map((section, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg">
                        <div className="p-4 bg-gray-50 border-b border-gray-200">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-800">{section.title}</h4>
                            <span className="text-sm text-gray-500">{section.duration}</span>
                          </div>
                        </div>
                        <div className="p-4">
                          <ul className="space-y-2">
                            {section.lessons.map((lesson, lessonIndex) => (
                              <li key={lessonIndex} className="flex items-center text-gray-600">
                                <svg
                                  className="w-4 h-4 text-blue-500 ml-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-5-9a9 9 0 019 9v1a2 2 0 01-2 2H8a2 2 0 01-2-2v-1a9 9 0 019-9z"
                                  />
                                </svg>
                                {lesson}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Instructor Tab */}
                {activeTab === "instructor" && (
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4 space-x-reverse">
                      <img
                        src={course.instructor.image || "/placeholder.svg"}
                        alt={course.instructor.name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      <div className="flex-1 text-right">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{course.instructor.name}</h3>
                        <p className="text-gray-600 mb-4">{course.instructor.bio}</p>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-blue-600">{course.instructor.experience}</div>
                            <div className="text-sm text-gray-500">تجربه</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-blue-600">
                              {course.instructor.students.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">دانشجو</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-blue-600">{course.instructor.courses}</div>
                            <div className="text-sm text-gray-500">دوره</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === "reviews" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-gray-800">نظرات دانشجویان</h3>
                      <div className="flex items-center">
                        <div className="flex items-center ml-2">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-5 h-5 ${i < Math.floor(course.rating) ? "text-yellow-400" : "text-gray-300"}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-gray-600 text-sm">
                          {course.rating} از {course.reviews} نظر
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {userReviews.map((review) => (
                        <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold ml-3">
                                {review.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-medium text-gray-800">{review.name}</div>
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
                          <p className="text-gray-600">{review.comment}</p>
                        </div>
                      ))}
                    </div>

                    {/* Add Review Form */}
                    <div className="border-t border-gray-200 pt-6">
                      <h4 className="text-lg font-bold text-gray-800 mb-4">نظر خود را بنویسید</h4>
                      <form onSubmit={handleReviewSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">نام</label>
                          <input
                            type="text"
                            value={newReview.name}
                            onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">امتیاز</label>
                          <select
                            value={newReview.rating}
                            onChange={(e) => setNewReview({ ...newReview, rating: Number.parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {[5, 4, 3, 2, 1].map((rating) => (
                              <option key={rating} value={rating}>
                                {rating} ستاره
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">نظر</label>
                          <textarea
                            value={newReview.comment}
                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <button
                          type="submit"
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          ارسال نظر
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">سوالات متداول</h3>
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div key={faq.id} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                      className="w-full px-4 py-3 text-right flex items-center justify-between hover:bg-gray-50 transition-colors"
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
                      <div className="px-4 pb-3 text-gray-600 border-t border-gray-200">{faq.answer}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Related Courses */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">دوره‌های مرتبط</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedCourses.map((relatedCourse) => (
                  <Link
                    key={relatedCourse.id}
                    href={`/courses/${relatedCourse.id}`}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <img
                      src={relatedCourse.image || "/placeholder.svg"}
                      alt={relatedCourse.title}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h4 className="font-medium text-gray-800 mb-2 text-sm">{relatedCourse.title}</h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-3 h-3 ${i < Math.floor(relatedCourse.rating) ? "text-yellow-400" : "text-gray-300"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="text-xs text-gray-500 mr-1">{relatedCourse.rating}</span>
                      </div>
                      <span className="text-sm font-bold text-blue-600">
                        {relatedCourse.price.toLocaleString()} تومان
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Purchase Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-3xl font-bold text-blue-600">{course.price.toLocaleString()}</span>
                  <span className="text-lg text-gray-600 mr-2">تومان</span>
                </div>
                {course.originalPrice > course.price && (
                  <div className="flex items-center justify-center space-x-2 space-x-reverse">
                    <span className="text-lg text-gray-400 line-through">{course.originalPrice.toLocaleString()}</span>
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-bold">
                      {course.discount}% تخفیف
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={handlePurchase}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors mb-4"
              >
                خرید دوره
              </button>

              <div className="text-center text-sm text-gray-500 mb-4">30 روز ضمانت بازگشت وجه</div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">مدت زمان:</span>
                  <span className="font-medium">{course.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">تعداد جلسات:</span>
                  <span className="font-medium">{course.sessions} جلسه</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">سطح:</span>
                  <span className="font-medium">{course.level}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">دانشجویان:</span>
                  <span className="font-medium">{course.students.toLocaleString()} نفر</span>
                </div>
              </div>
            </div>

            {/* Course Features */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">این دوره شامل:</h3>
              <ul className="space-y-3">
                {course.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <svg
                      className="w-5 h-5 text-green-500 ml-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

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
                ارائه‌دهنده برترین خدمات هوش مصنوعی و آموزش‌های تخصصی برای پیشرفت شما در دنیای دیجیتال
              </p>
            </div>

            <div>
              <h4 className="text-base font-semibold mb-4">لینک‌های مفید</h4>
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
                <li>
                  <a href="#" className="text-blue-100 hover:text-white transition-colors">
                    تماس با ما
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-base font-semibold mb-4">نماد اعتماد</h4>
              <div className="flex justify-center md:justify-start">
                <div className="bg-white rounded-lg p-3 inline-block">
                  <div className="text-blue-600 text-xs font-bold text-center">
                    <div>نماد</div>
                    <div>اعتماد الکترونیک</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-blue-400 mt-6 sm:mt-8 pt-4 sm:pt-6 text-center">
            <p className="text-xs sm:text-sm text-blue-100">© 1403 SharifGPT. تمامی حقوق محفوظ است.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
