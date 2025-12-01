"use client"
import ImageBox from 'components/shared/ImageBox'
import { CustomPortableText } from 'components/shared/CustomPortableText'
import type { PostPayload } from 'types'
import Link from 'next/link'
import { Share2, Facebook, Twitter, Linkedin, MessageCircle, Clock, Calendar, User, Tag, Home, ChevronRight } from 'lucide-react'
import { useState } from 'react'

// Helper function to calculate reading time
function calculateReadingTime(body: any[]): number {
  if (!body || !Array.isArray(body)) return 1
  
  const text = body
    .filter((block) => block._type === 'block')
    .map((block) => block.children?.map((child: any) => child.text).join(''))
    .join(' ')
  
  const wordsPerMinute = 200
  const words = text.split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  
  return minutes || 1
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

export default function BlogPost({ post }: { post: PostPayload }) {
  const { title, coverImage, excerpt, body, author, publishedAt, category, tags, relatedPosts } = post || {}
  const [showShareMenu, setShowShareMenu] = useState(false)
  
  const readingTime = calculateReadingTime(body || [])
  const categoryLabel = getCategoryLabel(category)
  
  // Share functionality
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareTitle = title || ''
  
  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`,
  }

  return (
    <div className="bg-gray-50 min-h-screen" dir="rtl">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-blue-600 transition-colors flex items-center gap-1">
            <Home className="w-4 h-4" />
            <span>خانه</span>
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/blog" className="hover:text-blue-600 transition-colors">
            بلاگ
          </Link>
          {category && (
            <>
              <ChevronRight className="w-4 h-4" />
              <Link href={`/blog?category=${category}`} className="hover:text-blue-600 transition-colors">
                {categoryLabel}
              </Link>
            </>
          )}
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium truncate">{title}</span>
        </nav>

        {/* Category Badge */}
        {category && (
          <div className="mb-4">
            <Link href={`/blog?category=${category}`}>
              <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-blue-200 transition-colors">
                {categoryLabel}
              </span>
            </Link>
          </div>
        )}

        {/* Title */}
        <h1 className="mb-4 text-4xl font-extrabold text-gray-900 leading-tight">{title}</h1>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600 border-b border-gray-200 pb-4">
          {author && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="font-medium text-gray-900">{author}</span>
            </div>
          )}
          {publishedAt && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <time dateTime={publishedAt}>
                {new Date(publishedAt).toLocaleDateString('fa-IR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{readingTime} دقیقه مطالعه</span>
          </div>

          {/* Share Button */}
          <div className="mr-auto relative">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>اشتراک‌گذاری</span>
            </button>
            
            {/* Share Menu */}
            {showShareMenu && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                <a
                  href={shareLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                >
                  <Twitter className="w-4 h-4 text-blue-400" />
                  <span>توییتر</span>
                </a>
                <a
                  href={shareLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                >
                  <Facebook className="w-4 h-4 text-blue-600" />
                  <span>فیسبوک</span>
                </a>
                <a
                  href={shareLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                >
                  <Linkedin className="w-4 h-4 text-blue-700" />
                  <span>لینکدین</span>
                </a>
                <a
                  href={shareLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-green-600" />
                  <span>واتساپ</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Cover Image */}
        {coverImage && (
          <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
            <ImageBox image={coverImage} alt={title || 'Cover'} classesWrapper="relative aspect-[16/9]" />
          </div>
        )}

        {/* Excerpt */}
        {excerpt && (
          <div className="mb-8 p-6 bg-blue-50 border-r-4 border-blue-500 rounded-lg">
            <div className="text-lg text-gray-800 leading-relaxed">
              <CustomPortableText value={excerpt} />
            </div>
          </div>
        )}

        {/* Body Content */}
        {body && (
          <article className="prose prose-lg prose-gray max-w-none mb-12 bg-white p-8 rounded-xl shadow-sm">
            <CustomPortableText value={body} />
          </article>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="mb-12 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-3 flex-wrap">
              <Tag className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-700">برچسب‌ها:</span>
              {tags.map((tag, idx) => (
                <Link key={idx} href={`/blog?tag=${encodeURIComponent(tag)}`}>
                  <span className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors">
                    #{tag}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Author Card */}
        {author && (
          <div className="mb-12 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                {author.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">درباره نویسنده</h3>
                <p className="text-lg font-semibold text-gray-800 mb-2">{author}</p>
                <p className="text-gray-600">نویسنده و متخصص حوزه تکنولوژی و هوش مصنوعی</p>
              </div>
            </div>
          </div>
        )}

        {/* Related Posts */}
        {relatedPosts && relatedPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">مقالات مرتبط</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost._id} href={`/blog/${relatedPost.slug}`}>
                  <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    {relatedPost.coverImage && (
                      <div className="relative aspect-[16/9]">
                        <ImageBox 
                          image={relatedPost.coverImage} 
                          alt={relatedPost.title || 'Related post'} 
                          classesWrapper="relative w-full h-full"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      {relatedPost.category && (
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mb-2">
                          {getCategoryLabel(relatedPost.category)}
                        </span>
                      )}
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-lg">
                        {relatedPost.title}
                      </h3>
                      {relatedPost.excerpt && (
                        <div className="text-sm text-gray-600 line-clamp-2">
                          <CustomPortableText value={relatedPost.excerpt} />
                        </div>
                      )}
                      {relatedPost.publishedAt && (
                        <div className="mt-3 text-xs text-gray-500 flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          {new Date(relatedPost.publishedAt).toLocaleDateString('fa-IR')}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to Blog Link */}
        <div className="text-center pt-8 border-t border-gray-200">
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
          >
            <span>بازگشت به لیست مقالات</span>
            <ChevronRight className="w-4 h-4 rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  )
}
