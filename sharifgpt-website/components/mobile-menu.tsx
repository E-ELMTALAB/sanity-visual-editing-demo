"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import type { JSX } from "react/jsx-runtime" // Import JSX to fix the undeclared variable error

// کامپوننت برای آیکون‌ها (SVG) - بدون تغییر
const Icon = ({ name, className }: { name: string; className?: string }) => {
  const icons: Record<string, JSX.Element> = {
    user: (
      <svg
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
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    ),
    star: (
      <svg
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
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
    ),
    chevronDown: (
      <svg
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
        <path d="m6 9 6 6 6-6"></path>
      </svg>
    ),
    home: (
      <svg
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
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9,22 9,12 15,12 15,22"></polyline>
      </svg>
    ),
    shopping: (
      <svg
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
        <path d="m7 7 10-4-3 18"></path>
        <path d="M17 3H7"></path>
        <path d="M9 9h8a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9"></path>
      </svg>
    ),
    book: (
      <svg
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
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
      </svg>
    ),
    phone: (
      <svg
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
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
      </svg>
    ),
    info: (
      <svg
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
        <circle cx="12" cy="12" r="10"></circle>
        <path d="m9 12 2 2 4-4"></path>
      </svg>
    ),
    briefcase: (
      <svg
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
        <rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
      </svg>
    ),
    edit: (
      <svg
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
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
      </svg>
    ),
  }

  return <span className={className}>{icons[name] || icons.home}</span>
}

// کامپوننت آکاردئون برای منوهای فرعی
const AccordionItem = ({
  title,
  iconName,
  children,
  href,
}: {
  title: string
  iconName: string
  children?: React.ReactNode
  href?: string
}) => {
  const [isOpen, setIsOpen] = useState(false)

  if (href && !children) {
    return (
      <Link href={href} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
        <div className="flex items-center">
          <Icon name={iconName} className="ml-3 text-gray-600" />
          <span className="text-gray-800 font-medium">{title}</span>
        </div>
      </Link>
    )
  }

  return (
    <div className="border-b border-gray-100">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center">
          <Icon name={iconName} className="ml-3 text-gray-600" />
          <span className="text-gray-800 font-medium">{title}</span>
        </div>
        <Icon
          name="chevronDown"
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && <div className="bg-gray-50 border-t border-gray-100">{children}</div>}
    </div>
  )
}

// کامپوننت منوی موبایل اصلی
const MobileMenu = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />

      {/* Menu Panel */}
      <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 lg:hidden transform transition-transform duration-300">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800">منو</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto">
            <AccordionItem title="محصولات" iconName="shopping">
              <div className="p-4 space-y-2">
                <Link
                  href="/products?category=ai"
                  className="block p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                >
                  هوش مصنوعی
                </Link>
                <Link
                  href="/products?category=social-media"
                  className="block p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                >
                  سوشیال مدیا
                </Link>
                <Link
                  href="/products?category=music"
                  className="block p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                >
                  موسیقی
                </Link>
                <Link
                  href="/products?category=educational"
                  className="block p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                >
                  آموزشی
                </Link>
                <Link
                  href="/products?category=sim-card"
                  className="block p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                >
                  سیمکارت
                </Link>
              </div>
            </AccordionItem>

            <AccordionItem title="دوره‌ها" iconName="book">
              <div className="p-4 space-y-2">
                <Link
                  href="/courses?category=ai"
                  className="block p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                >
                  دوره‌های هوش مصنوعی
                </Link>
                <Link
                  href="/courses?category=programming"
                  className="block p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                >
                  دوره‌های برنامه‌نویسی
                </Link>
                <Link
                  href="/courses?category=business"
                  className="block p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                >
                  دوره‌های کسب و کار
                </Link>
              </div>
            </AccordionItem>

            <AccordionItem title="بلاگ" iconName="edit" href="/blog" />

            <AccordionItem title="فروش سازمانی" iconName="briefcase" href="/enterprise" />

            <AccordionItem title="تماس با ما" iconName="phone" href="/contact" />

            <AccordionItem title="درباره ما" iconName="info" href="/about" />
          </nav>
        </div>
      </div>
    </>
  )
}

export default MobileMenu
