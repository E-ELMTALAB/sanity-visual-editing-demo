import CoursePageClient from '../../../sharifgpt-website/app/courses/[slug]/page'

export default function Page({ params }: { params: { slug: string } }) {
  return <CoursePageClient />
}
