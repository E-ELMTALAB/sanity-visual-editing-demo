import Link from "next/link"
import { Mail, Phone, Clock } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* دسته های پرفروش */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-blue-300">دسته های پرفروش</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/products?category=cards"
                  className="text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
                  کارت‌های اعتباری
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=spotify"
                  className="text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full ml-2"></div>
                  اسپاتیفای پریمیوم
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=youtube"
                  className="text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full ml-2"></div>
                  یوتیوب پریمیوم
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=ai-tools"
                  className="text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <div className="w-2 h-2 bg-purple-500 rounded-full ml-2"></div>
                  ابزارهای هوش مصنوعی
                </Link>
              </li>
              <li>
                <Link href="/courses" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full ml-2"></div>
                  دوره‌های آموزشی
                </Link>
              </li>
            </ul>
          </div>

          {/* لینک های مفید */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-blue-300">لینک های مفید</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  درباره ما
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  تماس با ما
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">
                  بلاگ
                </Link>
              </li>
              <li>
                <Link href="/enterprise" className="text-gray-300 hover:text-white transition-colors">
                  فروش سازمانی
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-300 hover:text-white transition-colors">
                  مرکز پشتیبانی
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white transition-colors">
                  سوالات متداول
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">
                  قوانین و مقررات
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  حریم خصوصی
                </Link>
              </li>
            </ul>
          </div>

          {/* شریف جی پی تی در شبکه های اجتماعی */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-blue-300">شریف جی پی تی در شبکه های اجتماعی</h3>
            <div className="space-y-4">
              <a
                href="https://t.me/sharifgpt"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-300 hover:text-white transition-colors"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center ml-3">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16c-.169 1.858-.896 6.728-.896 6.728-.302 1.507-1.123 1.507-1.123 1.507s-.302 0-.604-.302L12 13.5l-2.945 2.593s-.302.302-.604.302-1.123 0-1.123-1.507c0 0-.727-4.87-.896-6.728-.169-1.858.604-2.16.604-2.16s.906-.302 1.81 0c.906.302 7.348 0 7.348 0s.773.302.604 2.16z" />
                  </svg>
                </div>
                <span className="text-sm">تلگرام</span>
              </a>
              <a
                href="https://instagram.com/sharifgpt"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-300 hover:text-white transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center ml-3">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
                <span className="text-sm">اینستاگرام</span>
              </a>
              <a
                href="https://youtube.com/@sharifgpt"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-300 hover:text-white transition-colors"
              >
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center ml-3">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </div>
                <span className="text-sm">یوتیوب</span>
              </a>
            </div>
          </div>

          {/* نماد و توضیحات شریف جی پی تی */}
          <div>
            <div className="flex items-center space-x-3 space-x-reverse mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
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
              <h3 className="text-xl font-bold text-blue-300">SharifGPT</h3>
            </div>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              شریف جی پی تی ارائه‌دهنده برترین اکانت‌های پریمیوم، کارت‌های اعتباری مجازی و دوره‌های آموزشی هوش مصنوعی است.
              ما با تکیه بر کیفیت و اعتماد، بهترین خدمات دیجیتال را به شما ارائه می‌دهیم.
            </p>

            {/* نماد اعتماد */}
            <div className="flex items-center space-x-3 space-x-reverse mb-4">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-lg">
                <div className="text-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-1 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-600 font-bold">تایید شده</span>
                </div>
              </div>
              <div className="text-sm text-gray-300">
                <div className="font-semibold">نماد اعتماد الکترونیکی</div>
                <div className="text-xs text-gray-400">کسب و کار معتبر</div>
              </div>
            </div>
          </div>
        </div>

        {/* بخش پشتیبانی */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-blue-300 ml-3" />
              <h3 className="text-xl font-bold text-blue-300">پشتیبانی ۲۴/۷</h3>
            </div>
            <p className="text-center text-gray-300 text-lg font-semibold">
              هفت روز هفته، از ساعت ۸ تا ۲۴ پاسخگوی شما هستیم
            </p>
            <div className="flex items-center justify-center mt-4 space-x-6 space-x-reverse">
              <div className="flex items-center text-sm text-gray-300">
                <Mail className="w-4 h-4 ml-2" />
                <span>support@sharifgpt.com</span>
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <Phone className="w-4 h-4 ml-2" />
                <span>۰۲۱-۱۲۳۴۵۶۷۸</span>
              </div>
            </div>
            <div className="flex items-center justify-center mt-2">
              <span className="relative flex h-3 w-3 ml-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm text-green-400 font-medium">آنلاین و آماده پاسخگویی</span>
            </div>
          </div>
        </div>

        {/* کپی رایت */}
        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-gray-400 text-sm">© ۱۴۰۳ شریف جی پی تی. تمامی حقوق محفوظ است.</p>
          <p className="text-gray-500 text-xs mt-2">طراحی و توسعه با ❤️ توسط تیم شریف جی پی تی</p>
        </div>
      </div>
    </footer>
  )
}
