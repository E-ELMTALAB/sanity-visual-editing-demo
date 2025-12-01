"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import type { CoursePayload, FAQ } from "types"
import DynamicHeading from "components/shared/DynamicHeading"

interface Category {
  id: string
  name: string
  value: string
  count: number
}

interface CoursesPageClientProps {
  coursesData: (CoursePayload & { imageUrl?: string | null; instructorName?: string })[]
  faqsData: FAQ[]
  categoriesData: Category[]
}

export default function CoursesPageClient({ coursesData, faqsData, categoriesData }: CoursesPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("popular")
  const [showFilters, setShowFilters] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  // Filter courses by category
  const filteredCourses = useMemo(() => {
    return coursesData.filter((course) => {
      if (selectedCategory === "all") return true
      return course.category === selectedCategory
    })
  }, [coursesData, selectedCategory])

  // Sort filtered courses
  const sortedCourses = useMemo(() => {
    const sorted = [...filteredCourses]
    
    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0))
      case "price-high":
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0))
      case "rating":
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      case "newest":
        return sorted.reverse() // Assuming newer courses come first from query
      case "popular":
      default:
        return sorted.sort((a, b) => (b.totalStudents || 0) - (a.totalStudents || 0))
    }
  }, [filteredCourses, sortBy])

  // Helper function to get level label
  const getLevelLabel = (level?: string) => {
    switch (level) {
      case 'beginner':
        return 'مقدماتی'
      case 'intermediate':
        return 'متوسط'
      case 'advanced':
        return 'پیشرفته'
      case 'all-levels':
        return 'مقدماتی تا پیشرفته'
      default:
        return level || ''
    }
  }

  // Helper function to get badge label
  const getBadgeLabel = (badge?: string) => {
    switch (badge) {
      case 'bestseller':
        return 'پرفروش'
      case 'new':
        return 'جدید'
      case 'popular':
        return 'محبوب'
      case 'special-offer':
        return 'پیشنهاد ویژه'
      default:
        return badge || ''
    }
  }

  if (!coursesData || coursesData.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen" dir="rtl">
        <div className="container mx-auto px-4 py-16 text-center">
          <DynamicHeading 
            tag="h1" 
            className="text-3xl font-bold text-gray-800 mb-4"
          >
            دوره‌های آموزشی
          </DynamicHeading>
          <p className="text-gray-600">در حال حاضر دوره‌ای موجود نیست.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen" dir="rtl">
      {/* Page Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-blue-600">
              خانه
            </Link>
            <span>/</span>
            <span className="text-gray-800">دوره‌ها</span>
          </div>
          <DynamicHeading 
            tag="h1" 
            className="text-3xl font-bold text-gray-800"
          >
            دوره‌های آموزشی آنلاین
          </DynamicHeading>
          <p className="text-gray-600 mt-2">بهترین دوره‌های آموزشی با اساتید مجرب</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                  <DynamicHeading 
                    tag="h3" 
                    className="text-lg font-bold text-gray-800"
                  >
                    فیلترها
                  </DynamicHeading>
                <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden text-blue-600">
                  {showFilters ? "بستن" : "نمایش"}
                </button>
              </div>

              <div className={`space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
                {/* Categories */}
                <div>
                    <DynamicHeading 
                      tag="h4" 
                      className="font-semibold text-gray-800 mb-4"
                    >
                      دسته‌بندی
                    </DynamicHeading>
                  <div className="space-y-2">
                    {categoriesData.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.value)}
                        className={`w-full text-right px-3 py-2 rounded-lg transition-colors ${
                          selectedCategory === category.value
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
                    <DynamicHeading 
                      tag="h4" 
                      className="font-semibold text-gray-800 mb-4"
                    >
                      محدوده قیمت
                    </DynamicHeading>
                  <div className="space-y-2">
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" className="ml-2" />
                      <span className="text-gray-600">زیر 500,000 تومان</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" className="ml-2" />
                      <span className="text-gray-600">500,000 - 800,000 تومان</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" className="ml-2" />
                      <span className="text-gray-600">بالای 800,000 تومان</span>
                    </label>
                  </div>
                </div>

                {/* Level */}
                <div>
                    <DynamicHeading 
                      tag="h4" 
                      className="font-semibold text-gray-800 mb-4"
                    >
                      سطح دوره
                    </DynamicHeading>
                  <div className="space-y-2">
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" className="ml-2" />
                      <span className="text-gray-600">مقدماتی</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" className="ml-2" />
                      <span className="text-gray-600">متوسط</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" className="ml-2" />
                      <span className="text-gray-600">پیشرفته</span>
                    </label>
                  </div>
                </div>

                {/* Duration */}
                <div>
                    <DynamicHeading 
                      tag="h4" 
                      className="font-semibold text-gray-800 mb-4"
                    >
                      مدت زمان
                    </DynamicHeading>
                  <div className="space-y-2">
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" className="ml-2" />
                      <span className="text-gray-600">کمتر از 10 ساعت</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" className="ml-2" />
                      <span className="text-gray-600">10 تا 20 ساعت</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
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
                  نمایش {sortedCourses.length} دوره از {coursesData.length} دوره
                </div>
              </div>
            </div>

            {/* Courses Grid */}
            {sortedCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                {sortedCourses.map((course) => {
                  const discountPercentage = course.discountPercentage || 
                    (course.originalPrice && course.price 
                      ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
                      : 0)

                  return (
                    <div
                      key={course._id}
                      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="relative">
                        {course.imageUrl ? (
                          <img
                            src={course.imageUrl}
                            alt={course.title || 'Course'}
                            loading="lazy"
                            className="w-full h-48 object-cover"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400">بدون تصویر</span>
                          </div>
                        )}
                        {discountPercentage > 0 && (
                          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                            {discountPercentage}% تخفیف
                          </div>
                        )}
                        {course.badge && (
                          <div className="absolute top-3 left-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                            {getBadgeLabel(course.badge)}
                          </div>
                        )}
                      </div>

                      <div className="p-6">
                         <DynamicHeading 
                           tag="h3" 
                           className="font-bold text-lg text-gray-800 mb-2 line-clamp-2"
                         >
                           {course.title}
                         </DynamicHeading>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.shortDescription}</p>

                        {/* Course Info */}
                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                          {course.duration && (
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
                          )}
                          {course.totalSessions && (
                            <div className="flex items-center">
                              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1h4z"
                                />
                              </svg>
                              {course.totalSessions} جلسه
                            </div>
                          )}
                          {course.totalStudents && (
                            <div className="flex items-center">
                              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                              {course.totalStudents} دانشجو
                            </div>
                          )}
                          {course.level && (
                            <div className="flex items-center">
                              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              {getLevelLabel(course.level)}
                            </div>
                          )}
                        </div>

                        {/* Rating */}
                        {course.rating && (
                          <div className="flex items-center mb-4">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${i < Math.floor(course.rating || 0) ? "text-yellow-400" : "text-gray-300"}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-gray-600 text-sm mr-2">
                              {course.rating} ({course.reviewCount || 0} نظر)
                            </span>
                          </div>
                        )}

                        {/* Instructor */}
                        {course.instructorName && (
                          <div className="text-sm text-gray-600 mb-4">
                            <span className="font-medium">مدرس: </span>
                            {course.instructorName}
                          </div>
                        )}

                        {/* Price */}
                        {course.price !== undefined && (
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <span className="text-2xl font-bold text-gray-800">{course.price.toLocaleString()}</span>
                              <span className="text-sm text-gray-600">تومان</span>
                              {course.originalPrice && course.originalPrice > course.price && (
                                <span className="text-sm text-gray-400 line-through">
                                  {course.originalPrice.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex space-x-2 space-x-reverse">
                          <Link
                            href={`/courses/${course.slug?.current}`}
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
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <p className="text-gray-600">دوره‌ای در این دسته‌بندی یافت نشد.</p>
              </div>
            )}

            {/* FAQ Section */}
            {faqsData && faqsData.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                 <DynamicHeading 
                   tag="h2" 
                   className="text-2xl font-bold text-gray-800 mb-6"
                 >
                   سوالات متداول
                 </DynamicHeading>
                <div className="space-y-4">
                  {faqsData.map((faq, idx) => (
                    <div key={faq._id || idx} className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                        className="w-full text-right p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-800">{faq.question}</span>
                        <svg
                          className={`w-5 h-5 text-gray-500 transition-transform ${
                            expandedFaq === idx ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {expandedFaq === idx && (
                        <div className="px-4 pb-4 text-gray-600 border-t border-gray-100">
                          <p className="pt-3">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
