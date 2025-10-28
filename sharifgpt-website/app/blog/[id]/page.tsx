"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

export default function BlogArticlePage() {
  const params = useParams()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [user, setUser] = useState({ name: "مهدی", email: "mehdi@example.com" })
  const [article, setArticle] = useState<any>(null)

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

  // Sample articles data - in a real app, this would come from a database or CMS
  const articles = [
    {
      id: 1,
      title: "راهنمای کامل استفاده از اسپاتیفای پریمیوم",
      excerpt:
        "در این مقاله با تمام قابلیت‌های اسپاتیفای پریمیوم آشنا شوید و بیاموزید چگونه از آن بهترین استفاده را ببرید.",
      content: `
        <h2>مقدمه</h2>
        <p>اسپاتیفای پریمیوم یکی از محبوب‌ترین سرویس‌های پخش موسیقی در جهان است که امکانات فوق‌العاده‌ای را برای کاربران فراهم می‌کند. در این مقاله قصد داریم تا با تمام قابلیت‌های این سرویس آشنا شوید.</p>
        
        <h2>مزایای اسپاتیفای پریمیوم</h2>
        <ul>
          <li>پخش موسیقی بدون تبلیغات</li>
          <li>کیفیت صدای بالا</li>
          <li>امکان دانلود موسیقی برای گوش دادن آفلاین</li>
          <li>پخش نامحدود با امکان رد کردن آهنگ‌ها</li>
          <li>دسترسی به پادکست‌های اختصاصی</li>
        </ul>
        
        <h2>نحوه استفاده بهینه</h2>
        <p>برای استفاده بهینه از اسپاتیفای پریمیوم، توصیه می‌کنیم ابتدا پلی‌لیست‌های مورد علاقه خود را ایجاد کنید و سپس آهنگ‌های مورد نظر را دانلود کنید تا در زمان عدم دسترسی به اینترنت نیز بتوانید از آن‌ها لذت ببرید.</p>
        
        <h2>نتیجه‌گیری</h2>
        <p>اسپاتیفای پریمیوم سرمایه‌گذاری عالی برای علاقه‌مندان به موسیقی است که تجربه‌ای بی‌نظیر از گوش دادن به موسیقی ارائه می‌دهد.</p>
      `,
      category: "spotify",
      date: "1403/01/15",
      readTime: "5 دقیقه",
      image: "/spotify-music-streaming.jpg",
      author: "تیم SharifGPT",
      tags: ["اسپاتیفای", "موسیقی", "پریمیوم"],
    },
    {
      id: 2,
      title: "مزایای یوتیوب پریمیوم برای تولیدکنندگان محتوا",
      excerpt: "یوتیوب پریمیوم چه امکاناتی برای کسانی که محتوا تولید می‌کنند فراهم می‌کند؟",
      content: `
        <h2>مقدمه</h2>
        <p>یوتیوب پریمیوم نه تنها برای بینندگان مزایای فراوانی دارد، بلکه برای تولیدکنندگان محتوا نیز امکانات ویژه‌ای فراهم می‌کند.</p>
        
        <h2>مزایا برای کریتورها</h2>
        <ul>
          <li>درآمد بیشتر از طریق YouTube Premium Revenue</li>
          <li>دسترسی به YouTube Music برای استفاده در ویدیوها</li>
          <li>امکان آپلود ویدیوهای با کیفیت بالاتر</li>
          <li>دسترسی زودتر به ویژگی‌های جدید</li>
          <li>پشتیبانی بهتر از تیم یوتیوب</li>
        </ul>
        
        <h2>نحوه بهره‌برداری</h2>
        <p>تولیدکنندگان محتوا می‌توانند از یوتیوب پریمیوم برای تحلیل بهتر آمار کانال خود، دسترسی به ابزارهای پیشرفته تولید محتوا و افزایش درآمد استفاده کنند.</p>
        
        <h2>نتیجه‌گیری</h2>
        <p>یوتیوب پریمیوم برای تولیدکنندگان محتوای جدی، سرمایه‌گذاری ارزشمندی محسوب می‌شود.</p>
      `,
      category: "youtube",
      date: "1403/01/10",
      readTime: "7 دقیقه",
      image: "/youtube-premium-content-creator.jpg",
      author: "تیم SharifGPT",
      tags: ["یوتیوب", "تولید محتوا", "پریمیوم"],
    },
    {
      id: 3,
      title: "امنیت کارت‌های اعتباری مجازی در خریدهای آنلاین",
      excerpt: "چرا استفاده از کارت‌های مجازی برای خریدهای آنلاین امن‌تر است و چگونه از آن‌ها استفاده کنیم؟",
      content: `
        <h2>مقدمه</h2>
        <p>در عصر دیجیتال، امنیت مالی یکی از مهم‌ترین دغدغه‌های کاربران است. کارت‌های اعتباری مجازی راه‌حلی مدرن برای این مشکل محسوب می‌شوند.</p>
        
        <h2>مزایای امنیتی</h2>
        <ul>
          <li>جداسازی اطلاعات مالی اصلی</li>
          <li>امکان تنظیم محدودیت مبلغ و زمان</li>
          <li>قابلیت لغو فوری در صورت سوء استفاده</li>
          <li>عدم نیاز به ارائه اطلاعات کارت اصلی</li>
          <li>ردیابی دقیق تراکنش‌ها</li>
        </ul>
        
        <h2>نحوه استفاده</h2>
        <p>برای استفاده از کارت مجازی، ابتدا از طریق بانک یا ارائه‌دهنده خدمات مالی معتبر، کارت مجازی دریافت کنید. سپس اطلاعات آن را در سایت مورد نظر وارد کرده و خرید خود را انجام دهید.</p>
        
        <h2>نکات امنیتی</h2>
        <p>همیشه از ارائه‌دهندگان معتبر استفاده کنید و اطلاعات کارت را در مکان‌های امن نگهداری کنید.</p>
      `,
      category: "cards",
      date: "1403/01/05",
      readTime: "6 دقیقه",
      image: "/virtual-credit-card-security.jpg",
      author: "تیم SharifGPT",
      tags: ["امنیت", "کارت مجازی", "خرید آنلاین"],
    },
    {
      id: 4,
      title: "آینده هوش مصنوعی در ابزارهای روزمره",
      excerpt: "نگاهی به تأثیر ابزارهای هوش مصنوعی مثل ChatGPT در زندگی روزمره ما.",
      content: `
        <h2>مقدمه</h2>
        <p>هوش مصنوعی دیگر موضوعی علمی-تخیلی نیست، بلکه بخش جدایی‌ناپذیر از زندگی روزمره ما شده است. از ChatGPT گرفته تا ابزارهای تولید تصویر، همه در حال تغییر نحوه کار و زندگی ما هستند.</p>
        
        <h2>کاربردهای فعلی</h2>
        <ul>
          <li>ChatGPT برای نوشتن و تحلیل متن</li>
          <li>DALL-E و Midjourney برای تولید تصویر</li>
          <li>GitHub Copilot برای برنامه‌نویسی</li>
          <li>Grammarly برای ویرایش متن</li>
          <li>Siri و Google Assistant برای دستیار صوتی</li>
        </ul>
        
        <h2>آینده هوش مصنوعی</h2>
        <p>در آینده نزدیک، انتظار داریم هوش مصنوعی در حوزه‌های بیشتری مثل پزشکی، آموزش، حمل و نقل و حتی هنر نقش بیشتری ایفا کند.</p>
        
        <h2>چالش‌ها و فرصت‌ها</h2>
        <p>با وجود مزایای فراوان، هوش مصنوعی چالش‌هایی مثل جایگزینی مشاغل، مسائل اخلاقی و حریم خصوصی را نیز به همراه دارد.</p>
        
        <h2>نتیجه‌گیری</h2>
        <p>آینده متعلق به کسانی است که بتوانند با هوش مصنوعی همکاری کنند و از آن به عنوان ابزاری برای بهبود زندگی استفاده کنند.</p>
      `,
      category: "ai-tools",
      date: "1402/12/28",
      readTime: "8 دقیقه",
      image: "/artificial-intelligence-daily-tools.jpg",
      author: "تیم SharifGPT",
      tags: ["هوش مصنوعی", "ChatGPT", "آینده"],
    },
  ]

  // Find the article based on the ID from the URL
  useEffect(() => {
    const articleId = Number.parseInt(params.id as string)
    const foundArticle = articles.find((a) => a.id === articleId)
    setArticle(foundArticle)
  }, [params.id])

  // Related articles (excluding current article)
  const relatedArticles = articles.filter((a) => a.id !== article?.id).slice(0, 3)

  if (!article) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">مقاله یافت نشد</h1>
          <Link href="/blog" className="text-blue-600 hover:text-blue-700">
            بازگشت به بلاگ
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 glassmorphism">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo and Name */}
            <div className="relative flex items-center space-x-2 sm:space-x-4 space-x-reverse cursor-pointer">
              <Link href="/" className="flex items-center space-x-2 sm:space-x-4 space-x-reverse">
                <img
                  src="/images/design-mode/group-1-1.png"
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
                              <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center ml-3">
                                <span className="text-white text-xs font-bold">🧠</span>
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
                        </ul>
                      </div>

                      {/* Text-to-Image & Video AI Column */}
                      <div>
                        <div className="flex items-center mb-6">
                          <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center ml-3">
                            <svg className="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-bold text-gray-800">هوش مصنوعی متن به تصویر و ویدیو</h3>
                        </div>
                        <ul className="space-y-3">
                          <li>
                            <Link
                              href="/products?category=text-to-image"
                              className="flex items-center text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                            >
                              <div className="w-6 h-6 bg-purple-500 rounded flex items-center justify-center ml-3">
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
                              <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center ml-3">
                                <span className="text-white text-xs font-bold">🖼️</span>
                              </div>
                              <span>DALL-E 3</span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/products?category=text-to-video"
                              className="text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 block"
                            >
                              Runway ML
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

                      {/* Programming & Other AI Column */}
                      <div>
                        <div className="flex items-center mb-6">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center ml-3">
                            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-bold text-gray-800">برنامه‌نویسی و سایر AI</h3>
                        </div>
                        <ul className="space-y-3">
                          <li>
                            <Link
                              href="/products?category=programming-ai"
                              className="flex items-center text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                            >
                              <div className="w-6 h-6 bg-gray-800 rounded flex items-center justify-center ml-3">
                                <span className="text-white text-xs font-bold">💻</span>
                              </div>
                              <span>GitHub Copilot</span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/products?category=programming-ai"
                              className="text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 block"
                            >
                              Cursor Pro
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/products?category=text-to-audio"
                              className="text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 block"
                            >
                              ElevenLabs
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/products?category=other-ai"
                              className="text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 block"
                            >
                              سایر ابزارهای AI
                            </Link>
                          </li>
                        </ul>
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
                              className="text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 block"
                            >
                              تحلیل داده با هوش مصنوعی
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
                              className="text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 block"
                            >
                              طراحی گرافیک با AI
                            </a>
                          </li>
                        </ul>
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
            <Link href="/blog" className="hover:text-blue-600">
              بلاگ
            </Link>
            <span>/</span>
            <span className="text-gray-800">{article.title}</span>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Article Header */}
            <div className="relative">
              <img
                src={article.image || "/placeholder.svg"}
                alt={article.title}
                className="w-full h-64 md:h-80 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                <div className="p-6 text-white">
                  <div className="flex items-center space-x-2 space-x-reverse mb-4">
                    <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">{article.category}</span>
                    <span className="text-sm opacity-90">{article.date}</span>
                    <span className="text-sm opacity-90">•</span>
                    <span className="text-sm opacity-90">{article.readTime}</span>
                  </div>
                  <h1 className="text-2xl md:text-4xl font-bold mb-2">{article.title}</h1>
                  <p className="text-lg opacity-90">{article.excerpt}</p>
                </div>
              </div>
            </div>

            {/* Article Meta */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <img
                    src="/images/design-mode/group-1-1.png"
                    alt="نویسنده"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">{article.author}</p>
                    <p className="text-sm text-gray-500">{article.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  {article.tags.map((tag: string, index: number) => (
                    <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Article Body */}
            <div className="p-6 md:p-8">
              <div
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: article.content }}
                style={{
                  fontSize: "16px",
                  lineHeight: "1.8",
                }}
              />
            </div>

            {/* Article Footer */}
            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <button className="flex items-center space-x-2 space-x-reverse text-gray-600 hover:text-blue-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span>پسندیدن</span>
                  </button>
                  <button className="flex items-center space-x-2 space-x-reverse text-gray-600 hover:text-blue-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                      />
                    </svg>
                    <span>اشتراک‌گذاری</span>
                  </button>
                </div>
                <Link href="/blog" className="text-blue-600 hover:text-blue-700 font-medium">
                  بازگشت به بلاگ
                </Link>
              </div>
            </div>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">مقالات مرتبط</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((relatedArticle) => (
                  <article
                    key={relatedArticle.id}
                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <img
                      src={relatedArticle.image || "/placeholder.svg"}
                      alt={relatedArticle.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                          {relatedArticle.category}
                        </span>
                        <span className="text-xs text-gray-500">{relatedArticle.readTime}</span>
                      </div>
                      <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">{relatedArticle.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{relatedArticle.excerpt}</p>
                      <Link
                        href={`/blog/${relatedArticle.id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        ادامه مطلب ←
                      </Link>
                    </div>
                  </article>
                ))}
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
