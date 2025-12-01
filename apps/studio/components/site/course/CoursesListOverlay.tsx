import type { CoursePayload, FAQ } from 'types'

interface CoursesListOverlayProps {
  courses: (CoursePayload & { imageUrl?: string | null; instructorName?: string })[]
  faqs: FAQ[]
}

export default function CoursesListOverlay({ courses, faqs }: CoursesListOverlayProps) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0 }}>
      {/* Course Cards Overlays */}
      {courses.map((course, index) => (
        <div key={course._id || index} data-sanity-id={course._id} data-sanity-type="course">
          <span>{course.title}</span>
          <span>{course.shortDescription}</span>
          <span>{course.longDescription}</span>
          <span>{course.price}</span>
          <span>{course.originalPrice}</span>
          <span>{course.category}</span>
          <span>{course.level}</span>
          <span>{course.duration}</span>
          <span>{course.rating}</span>
          <span>{course.reviewCount}</span>
          <span>{course.totalStudents}</span>
          <span>{course.instructorName}</span>
          {course.features?.map((feature, idx) => (
            <span key={`feature-${idx}`}>{feature}</span>
          ))}
        </div>
      ))}

      {/* FAQ Overlays */}
      {faqs.map((faq, index) => (
        <div key={faq._id || index} data-sanity-id={faq._id} data-sanity-type="faq">
          <span>{faq.question}</span>
          <span>{faq.answer}</span>
        </div>
      ))}
    </div>
  )
}
