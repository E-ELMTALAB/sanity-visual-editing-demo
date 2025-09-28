"use client"
import ImageBox from 'components/shared/ImageBox'
import { CustomPortableText } from 'components/shared/CustomPortableText'
import type { PostPayload } from 'types'

export default function BlogPost({ post }: { post: PostPayload }) {
  const { title, coverImage, excerpt, body, author, publishedAt } = post || {}
  return (
    <div className="mx-auto max-w-3xl py-10">
      <h1 className="mb-3 text-3xl font-extrabold">{title}</h1>
      {(author || publishedAt) && (
        <div className="mb-4 text-sm text-gray-400">
          {author && <span>By {author}</span>}
          {author && publishedAt && <span className="mx-2">•</span>}
          {publishedAt && <span>{new Date(publishedAt).toLocaleDateString()}</span>}
        </div>
      )}
      <div className="mb-6">
        <ImageBox image={coverImage} alt={title || 'Cover'} classesWrapper="relative aspect-[16/9]" />
      </div>
      {excerpt && (
        <div className="mb-6 text-lg text-gray-200">
          <CustomPortableText value={excerpt} />
        </div>
      )}
      {body && (
        <div className="prose prose-invert max-w-none">
          <CustomPortableText value={body} />
        </div>
      )}
    </div>
  )
}


