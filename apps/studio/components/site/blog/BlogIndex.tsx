"use client"
import ImageBox from 'components/shared/ImageBox'
import Link from 'next/link'
import { CustomPortableText } from 'components/shared/CustomPortableText'
import type { PostListItemPayload } from 'types'
import { Calendar, Clock, User, Tag, Search, Filter } from 'lucide-react'
import { Navbar } from '@/components/global/Navbar'
import { Footer } from '@/components/global/Footer'

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
      {/* Header */}
      <Navbar menuItems={[]} />
      
      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-10">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6">
            <Tag className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            بلاگ SharifGPT
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            آخرین مقالات، آموزش‌ها و اخبار دنیای هوش مصنوعی، برنامه‌نویسی و فناوری
          </p>
          
          {/* Search and Filter Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="جستجو در مقالات..."
                className="w-full px-6 py-4 pr-12 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm shadow-sm"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <button className="absolute left-16 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <Filter className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts?.map((post, idx) => {
            const readingTime = estimateReadingTime(post.excerpt || [])
            const categoryLabel = getCategoryLabel(post.category)
            
            return (
              <Link key={post._id || idx} href={`/blog/${post.slug}`}> 
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 h-full flex flex-col group">
                  {/* Cover Image */}
                  {post.coverImage && (
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <ImageBox 
                        image={post.coverImage} 
                        alt={post.title || 'Cover'} 
                        classesWrapper="relative w-full h-full transition-transform duration-500 group-hover:scale-110" 
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Category Badge */}
                      {post.category && (
                        <div className="absolute top-4 right-4">
                          <span className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg backdrop-blur-sm">
                            {categoryLabel}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="p-6 flex flex-col flex-grow">
                    {/* Title */}
                    <h2 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
                      {post.title}
                    </h2>
                    
                    {/* Excerpt */}
                    {post.excerpt && (
                      <div className="text-gray-600 mb-5 line-clamp-3 text-sm flex-grow leading-relaxed">
                        <CustomPortableText value={post.excerpt} />
                      </div>
                    )}
                    
                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex items-center gap-2 mb-5 flex-wrap">
                        {post.tags.slice(0, 3).map((tag, tagIdx) => (
                          <span 
                            key={tagIdx}
                            className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-full transition-colors"
                          >
                            #{tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">+{post.tags.length - 3}</span>
                        )}
                      </div>
                    )}
                    
                    {/* Meta Information */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t border-gray-100 mt-auto">
                      {post.author && (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <User className="w-3 h-3 text-white" />
                          </div>
                          <span className="truncate font-medium">{post.author}</span>
                        </div>
                      )}
                      {post.publishedAt && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <time dateTime={post.publishedAt} className="font-medium">
                            {new Date(post.publishedAt).toLocaleDateString('fa-IR', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </time>
                        </div>
                      )}
                      <div className="flex items-center gap-2 mr-auto">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">{readingTime} دقیقه مطالعه</span>
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
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-6">
              <Tag className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">هنوز مقاله‌ای منتشر نشده است</h3>
            <p className="text-gray-500 text-lg">به زودی مقالات جدید را اینجا خواهید دید</p>
            <div className="mt-8">
              <Link 
                href="/"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                بازگشت به صفحه اصلی
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
            </div>
          </div>
        )}

        {/* Load More Button */}
        {posts && posts.length > 0 && (
          <div className="text-center mt-12">
            <button className="inline-flex items-center px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
              مشاهده مقالات بیشتر
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer footer={[]} />
    </div>
  )
}
