"use client"

import { useState } from "react"
import Link from "next/link"
import type { CoursePayload, FAQ } from "types"
import DynamicHeading from "components/shared/DynamicHeading"
import { urlForImage } from "lib/sanity.image"

interface CoursePageClientProps {
  courseData: (CoursePayload & { imageUrl?: string | null; instructor?: any; relatedCourses?: any[] }) | null
  faqsData: FAQ[]
}

export default function CoursePageClient({ courseData, faqsData }: CoursePageClientProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  if (!courseData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">دوره یافت نشد</p>
        </div>
      </div>
    )
  }

  const course = courseData

  return (
    <div className="bg-gray-50 min-h-screen" dir="rtl">
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
                  <DynamicHeading 
                    tag="h1"
                    className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2"
                  >
                    {course.title}
                  </DynamicHeading>
                  <p className="text-gray-600 mb-4">{course.shortDescription}</p>

                  {/* Course Stats */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
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
                        {course.level === 'beginner' && 'مقدماتی'}
                        {course.level === 'intermediate' && 'متوسط'}
                        {course.level === 'advanced' && 'پیشرفته'}
                        {course.level === 'all-levels' && 'مقدماتی تا پیشرفته'}
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
                            className={`w-5 h-5 ${i < Math.floor(course.rating || 0) ? "text-yellow-400" : "text-gray-300"}`}
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
                </div>

                {course.badge && (
                  <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {course.badge === 'bestseller' && 'پرفروش'}
                    {course.badge === 'new' && 'جدید'}
                    {course.badge === 'popular' && 'محبوب'}
                    {course.badge === 'special-offer' && 'پیشنهاد ویژه'}
                  </div>
                )}
              </div>

              {/* Course Image */}
              {course.imageUrl && (
                <div className="mb-6">
                  <img
                    src={course.imageUrl}
                    alt={course.title || 'Course Image'}
                    loading="lazy"
                    className="w-full h-64 lg:h-80 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 space-x-reverse px-6">
                  {[
                    { id: "overview", label: "نمای کلی" },
                    { id: "curriculum", label: "سرفصل‌ها" },
                    { id: "instructor", label: "مدرس" },
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
                    {course.longDescription && (
                      <div>
                        <DynamicHeading 
                          tag="h3" 
                          className="text-lg font-bold text-gray-800 mb-3"
                        >
                          درباره این دوره
                        </DynamicHeading>
                        <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                          {course.longDescription}
                        </div>
                      </div>
                    )}

                    {course.features && course.features.length > 0 && (
                      <div>
                        <DynamicHeading 
                          tag="h3" 
                          className="text-lg font-bold text-gray-800 mb-3"
                        >
                          ویژگی‌های دوره
                        </DynamicHeading>
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
                    )}

                    {course.requirements && course.requirements.length > 0 && (
                      <div>
                        <DynamicHeading 
                          tag="h3" 
                          className="text-lg font-bold text-gray-800 mb-3"
                        >
                          پیش‌نیازها
                        </DynamicHeading>
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
                    )}

                    {course.learningOutcomes && course.learningOutcomes.length > 0 && (
                      <div>
                        <DynamicHeading 
                          tag="h3" 
                          className="text-lg font-bold text-gray-800 mb-3"
                        >
                          چیزهایی که یاد خواهید گرفت
                        </DynamicHeading>
                        <ul className="space-y-2">
                          {course.learningOutcomes.map((outcome, index) => (
                            <li key={index} className="flex items-center text-gray-600">
                              <svg
                                className="w-5 h-5 text-purple-500 ml-2"
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
                              {outcome}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {course.targetAudience && course.targetAudience.length > 0 && (
                      <div>
                        <DynamicHeading 
                          tag="h3" 
                          className="text-lg font-bold text-gray-800 mb-3"
                        >
                          این دوره برای چه کسانی است
                        </DynamicHeading>
                        <ul className="space-y-2">
                          {course.targetAudience.map((audience, index) => (
                            <li key={index} className="flex items-center text-gray-600">
                              <svg
                                className="w-5 h-5 text-orange-500 ml-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                              {audience}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Curriculum Tab */}
                {activeTab === "curriculum" && (
                  <div className="space-y-4">
                    <DynamicHeading 
                      tag="h3" 
                      className="text-lg font-bold text-gray-800 mb-4"
                    >
                      سرفصل‌های دوره
                    </DynamicHeading>
                    {course.syllabus && course.syllabus.length > 0 ? (
                      course.syllabus.map((module, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg">
                          <div className="p-4 bg-gray-50 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                              <DynamicHeading 
                                tag="h4" 
                                className="font-medium text-gray-800"
                              >
                                {module.title}
                              </DynamicHeading>
                              {module.duration && <span className="text-sm text-gray-500">{module.duration}</span>}
                            </div>
                            {module.description && (
                              <p className="text-sm text-gray-600 mt-2">{module.description}</p>
                            )}
                          </div>
                          {module.lessons && module.lessons.length > 0 && (
                            <div className="p-4">
                              <ul className="space-y-2">
                                {module.lessons.map((lesson, lessonIndex) => (
                                  <li key={lessonIndex} className="flex items-start justify-between text-gray-600">
                                    <div className="flex items-start flex-1">
                                      <svg
                                        className="w-4 h-4 text-blue-500 ml-2 mt-1 flex-shrink-0"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                        />
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                      </svg>
                                      <div className="flex-1">
                                        <div className="font-medium">{lesson.title}</div>
                                        {lesson.description && (
                                          <div className="text-sm text-gray-500 mt-1">{lesson.description}</div>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2 space-x-reverse mr-2">
                                      {lesson.duration && (
                                        <span className="text-sm text-gray-500">{lesson.duration}</span>
                                      )}
                                      {lesson.isPreview && (
                                        <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                                          پیش‌نمایش
                                        </span>
                                      )}
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">سرفصلی برای این دوره تعریف نشده است.</p>
                    )}
                  </div>
                )}

                {/* Instructor Tab */}
                {activeTab === "instructor" && (
                  <div className="space-y-6">
                    {course.instructor ? (
                      <div className="flex items-start space-x-4 space-x-reverse">
                        {course.instructor.imageUrl && (
                          <img
                            src={course.instructor.imageUrl}
                            alt={course.instructor.name}
                            loading="lazy"
                            className="w-20 h-20 rounded-full object-cover"
                          />
                        )}
                        <div className="flex-1 text-right">
                          <DynamicHeading 
                            tag="h3" 
                            className="text-xl font-bold text-gray-800 mb-1"
                          >
                            {course.instructor.name}
                          </DynamicHeading>
                          {course.instructor.title && (
                            <p className="text-sm text-gray-500 mb-2">{course.instructor.title}</p>
                          )}
                          {course.instructor.bio && <p className="text-gray-600 mb-4">{course.instructor.bio}</p>}

                          {/* Instructor Stats */}
                          <div className="grid grid-cols-3 gap-4 text-center mt-4">
                            {course.instructor.experience && (
                              <div>
                                <div className="text-2xl font-bold text-blue-600">{course.instructor.experience}</div>
                                <div className="text-sm text-gray-500">تجربه</div>
                              </div>
                            )}
                            {course.instructor.totalStudents !== undefined && (
                              <div>
                                <div className="text-2xl font-bold text-blue-600">
                                  {course.instructor.totalStudents.toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-500">دانشجو</div>
                              </div>
                            )}
                            {course.instructor.totalCourses !== undefined && (
                              <div>
                                <div className="text-2xl font-bold text-blue-600">{course.instructor.totalCourses}</div>
                                <div className="text-sm text-gray-500">دوره</div>
                              </div>
                            )}
                          </div>

                          {/* Expertise */}
                          {course.instructor.expertise && course.instructor.expertise.length > 0 && (
                            <div className="mt-4">
                              <DynamicHeading 
                                tag="h4" 
                                className="font-medium text-gray-800 mb-2"
                              >
                                حوزه‌های تخصصی:
                              </DynamicHeading>
                              <div className="flex flex-wrap gap-2">
                                {course.instructor.expertise.map((skill, idx) => (
                                  <span
                                    key={idx}
                                    className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Social Media */}
                          {course.instructor.socialMedia && (
                            <div className="mt-4 flex items-center space-x-3 space-x-reverse">
                              {course.instructor.socialMedia.linkedin && (
                                <a
                                  href={course.instructor.socialMedia.linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-600 hover:text-blue-600"
                                >
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                  </svg>
                                </a>
                              )}
                              {course.instructor.socialMedia.twitter && (
                                <a
                                  href={course.instructor.socialMedia.twitter}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-600 hover:text-blue-400"
                                >
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                                  </svg>
                                </a>
                              )}
                              {course.instructor.socialMedia.telegram && (
                                <a
                                  href={course.instructor.socialMedia.telegram}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-600 hover:text-blue-500"
                                >
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.752-.244-1.349-.374-1.297-.79.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.121.099.155.232.171.326.016.093.036.305.02.472z" />
                                  </svg>
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">اطلاعات مدرس برای این دوره موجود نیست.</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* FAQ Section */}
            {faqsData && faqsData.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <DynamicHeading 
                  tag="h3" 
                  className="text-lg font-bold text-gray-800 mb-4"
                >
                  سوالات متداول
                </DynamicHeading>
                <div className="space-y-4">
                  {faqsData.map((faq, idx) => (
                    <div key={faq._id || idx} className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                        className="w-full px-4 py-3 text-right flex items-center justify-between hover:bg-gray-50 transition-colors"
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
                        <div className="px-4 pb-3 text-gray-600 border-t border-gray-200 pt-3">{faq.answer}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Courses */}
            {course.relatedCourses && course.relatedCourses.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <DynamicHeading 
                  tag="h3" 
                  className="text-lg font-bold text-gray-800 mb-4"
                >
                  دوره‌های مرتبط
                </DynamicHeading>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {course.relatedCourses.map((relatedCourse) => (
                    <Link
                      key={relatedCourse._id}
                      href={`/courses/${relatedCourse.slug?.current}`}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      {relatedCourse.imageUrl && (
                        <img
                          src={relatedCourse.imageUrl}
                          alt={relatedCourse.title || 'Course'}
                          loading="lazy"
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                      )}
                      <DynamicHeading 
                        tag="h4" 
                        className="font-medium text-gray-800 mb-2 text-sm"
                      >
                        {relatedCourse.title}
                      </DynamicHeading>
                      <div className="flex items-center justify-between">
                        {relatedCourse.rating && (
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
                        )}
                        {relatedCourse.price && (
                          <span className="text-sm font-bold text-blue-600">
                            {relatedCourse.price.toLocaleString()} تومان
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Purchase Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 sticky top-24">
              <div className="text-center mb-6">
                {course.price !== undefined && (
                  <>
                    <div className="flex items-center justify-center mb-2">
                      <span className="text-3xl font-bold text-blue-600">{course.price.toLocaleString()}</span>
                      <span className="text-lg text-gray-600 mr-2">تومان</span>
                    </div>
                    {course.originalPrice && course.originalPrice > course.price && (
                      <div className="flex items-center justify-center space-x-2 space-x-reverse">
                        <span className="text-lg text-gray-400 line-through">
                          {course.originalPrice.toLocaleString()}
                        </span>
                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-bold">
                          {course.discountPercentage
                            ? `${course.discountPercentage}%`
                            : `${Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}%`}{" "}
                          تخفیف
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>

              <Link
                href="/cart"
                className="block w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors mb-4 text-center"
              >
                خرید دوره
              </Link>

              <div className="text-center text-sm text-gray-500 mb-4">30 روز ضمانت بازگشت وجه</div>

              <div className="space-y-3 text-sm">
                {course.duration && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">مدت زمان:</span>
                    <span className="font-medium">{course.duration}</span>
                  </div>
                )}
                {course.totalSessions && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">تعداد جلسات:</span>
                    <span className="font-medium">{course.totalSessions} جلسه</span>
                  </div>
                )}
                {course.level && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">سطح:</span>
                    <span className="font-medium">
                      {course.level === 'beginner' && 'مقدماتی'}
                      {course.level === 'intermediate' && 'متوسط'}
                      {course.level === 'advanced' && 'پیشرفته'}
                      {course.level === 'all-levels' && 'مقدماتی تا پیشرفته'}
                    </span>
                  </div>
                )}
                {course.totalStudents && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">دانشجویان:</span>
                    <span className="font-medium">{course.totalStudents.toLocaleString()} نفر</span>
                  </div>
                )}
                {course.language && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">زبان:</span>
                    <span className="font-medium">
                      {course.language === 'persian' && 'فارسی'}
                      {course.language === 'english' && 'انگلیسی'}
                      {course.language === 'bilingual' && 'دوزبانه'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Course Features */}
            {course.features && course.features.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <DynamicHeading 
                  tag="h3" 
                  className="text-lg font-bold text-gray-800 mb-4"
                >
                  این دوره شامل:
                </DynamicHeading>
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
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
