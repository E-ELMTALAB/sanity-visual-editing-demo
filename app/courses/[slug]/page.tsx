import CoursePageClient from '../../../sharifgpt-website/app/courses/[id]/page'

export default function Page({ params }: { params: { slug: string } }) {
  return <CoursePageClient />
}
