"use client"
import ImageBox from 'components/shared/ImageBox'
import Link from 'next/link'
import { CustomPortableText } from 'components/shared/CustomPortableText'
import type { PostListItemPayload } from 'types'

export default function BlogIndex({ posts }: { posts: PostListItemPayload[] }) {
  return (
    <div className="mx-auto max-w-5xl py-10">
      <h1 className="mb-6 text-3xl font-extrabold">Blog</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {posts?.map((post, idx) => (
          <Link key={idx} href={`/blog/${post.slug}`}> 
            <div className="rounded-md border bg-white/5 p-3 hover:bg-white/10">
              <div className="mb-3">
                <ImageBox image={post.coverImage} alt={post.title || 'Cover'} classesWrapper="relative aspect-[16/9]" />
              </div>
              <div className="text-xl font-bold">{post.title}</div>
              {post.excerpt && (
                <div className="mt-2 text-gray-300">
                  <CustomPortableText value={post.excerpt} />
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}


