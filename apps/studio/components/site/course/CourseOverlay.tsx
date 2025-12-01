import type { CoursePayload } from 'types'

interface CourseOverlayProps {
  course: CoursePayload | null
}

export default function CourseOverlay({ course }: CourseOverlayProps) {
  if (!course) return null

  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0 }}>
      {/* Course Basic Info */}
      <div
        data-sanity-id={course._id}
        data-sanity-type="course"
      >
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
        
        {/* Features */}
        {course.features?.map((feature, idx) => (
          <span key={`feature-${idx}`}>{feature}</span>
        ))}
        
        {/* Requirements */}
        {course.requirements?.map((req, idx) => (
          <span key={`req-${idx}`}>{req}</span>
        ))}
        
        {/* Learning Outcomes */}
        {course.learningOutcomes?.map((outcome, idx) => (
          <span key={`outcome-${idx}`}>{outcome}</span>
        ))}
        
        {/* Syllabus */}
        {course.syllabus?.map((module, idx) => (
          <div key={`module-${idx}`}>
            <span>{module.title}</span>
            <span>{module.description}</span>
            <span>{module.duration}</span>
            {module.lessons?.map((lesson, lessonIdx) => (
              <div key={`lesson-${lessonIdx}`}>
                <span>{lesson.title}</span>
                <span>{lesson.duration}</span>
                <span>{lesson.description}</span>
              </div>
            ))}
          </div>
        ))}
        
        {/* SEO Fields */}
        {course.seo?.metaTitle && <span>{course.seo.metaTitle}</span>}
        {course.seo?.metaDescription && <span>{course.seo.metaDescription}</span>}
        {course.seo?.keywords?.map((keyword, idx) => (
          <span key={`keyword-${idx}`}>{keyword}</span>
        ))}
      </div>
      
      {/* Instructor Info */}
      {course.instructor && (
        <div
          data-sanity-id={course.instructor._id}
          data-sanity-type="instructor"
        >
          <span>{course.instructor.name}</span>
          <span>{course.instructor.title}</span>
          <span>{course.instructor.bio}</span>
          <span>{course.instructor.experience}</span>
          {course.instructor.expertise?.map((exp, idx) => (
            <span key={`exp-${idx}`}>{exp}</span>
          ))}
        </div>
      )}
    </div>
  )
}



