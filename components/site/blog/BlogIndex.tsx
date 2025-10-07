"use client"
import ImageBox from 'components/shared/ImageBox'
import Link from 'next/link'
import { CustomPortableText } from 'components/shared/CustomPortableText'
import type { PostListItemPayload } from 'types'
import { Calendar, Clock, User, Tag } from 'lucide-react'

// Helper function to calculate reading time from excerpt
function estimateReadingTime(excerpt: any[]): number {
  if (!excerpt || !Array.isArray(excerpt)) return 2
  
  const text = excerpt
    .filter((block) => block._type === 'block')
    .map((block) => block.children?.map((child: any) => child.text).join(''))
    .join(' ')
  
  const wordsPerMinute = 200
  const words = text.split(/\s+/).length
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute))
  
  return minutes * 5 // Estimate full article is 5x the excerpt
}

// Helper function to get category label in Persian
function getCategoryLabel(category?: string): string {
  const categories: Record<string, string> = {
    'ai': 'هوش مصنوعی',
    'programming': 'برنامه‌نویسی',
    'tutorial': 'آموزش',
    'news': 'اخبار',
    'technology': 'تکنولوژی',
    'products': 'محصولات',
    'guide': 'راهنما',
    'review': 'نقد و بررسی',
  }
  return categories[category || ''] || category || ''
}

export default function BlogIndex({ posts }: { posts: PostListItemPayload[] }) {
  return (
    <div className="bg-gray-50 min-h-screen" dir="rtl">
      <div className="mx-auto max-w-7xl px-4 py-10">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            بلاگ SharifGPT
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            آخرین مقالات، آموزش‌ها و اخبار دنیای هوش مصنوعی، برنامه‌نویسی و فناوری
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts?.map((post, idx) => {
            const readingTime = estimateReadingTime(post.excerpt || [])
            const categoryLabel = getCategoryLabel(post.category)
            
            return (
              <Link key={post._id || idx} href={`/blog/${post.slug}`}> 
                <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col">
                  {/* Cover Image */}
                  {post.coverImage && (
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <ImageBox 
                        image={post.coverImage} 
                        alt={post.title || 'Cover'} 
                        classesWrapper="relative w-full h-full transition-transform duration-300 hover:scale-110" 
                      />
                      
                      {/* Category Badge */}
                      {post.category && (
                        <div className="absolute top-3 right-3">
                          <span className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                            {categoryLabel}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="p-5 flex flex-col flex-grow">
                    {/* Title */}
                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
                      {post.title}
                    </h2>
                    
                    {/* Excerpt */}
                    {post.excerpt && (
                      <div className="text-gray-600 mb-4 line-clamp-3 text-sm flex-grow">
                        <CustomPortableText value={post.excerpt} />
                      </div>
                    )}
                    
                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex items-center gap-2 mb-4 flex-wrap">
                        {post.tags.slice(0, 3).map((tag, tagIdx) => (
                          <span 
                            key={tagIdx}
                            className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="text-xs text-gray-500">+{post.tags.length - 3}</span>
                        )}
                      </div>
                    )}
                    
                    {/* Meta Information */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t border-gray-100 mt-auto">
                      {post.author && (
                        <div className="flex items-center gap-1.5">
                          <User className="w-4 h-4" />
                          <span className="truncate">{post.author}</span>
                        </div>
                      )}
                      {post.publishedAt && (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          <time dateTime={post.publishedAt}>
                            {new Date(post.publishedAt).toLocaleDateString('fa-IR', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </time>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 mr-auto">
                        <Clock className="w-4 h-4" />
                        <span>{readingTime} دقیقه</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* No Posts Message */}
        {(!posts || posts.length === 0) && (
          <div className="text-center py-20">
            <div className="text-gray-400 mb-4">
              <Tag className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">هنوز مقاله‌ای منتشر نشده است</h3>
            <p className="text-gray-500">به زودی مقالات جدید را اینجا خواهید دید</p>
          </div>
        )}
      </div>
    </div>
  )
}
