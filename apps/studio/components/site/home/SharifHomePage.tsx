"use client"

import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'

interface SharifHomePageProps {
  topBannerSlides: any[]
  heroSlides: any[]
  promoCards: any[]
  discountedProducts: any[]
  socialMediaProducts: any[]
  educationalProducts: any[]
  bestsellingCourses: any[]
  magazinePosts: any[]
  featuredBlogs: any[]
}

export default function SharifHomePage({
  topBannerSlides,
  heroSlides,
  promoCards,
  discountedProducts,
  socialMediaProducts,
  educationalProducts,
  bestsellingCourses,
  magazinePosts,
  featuredBlogs,
}: SharifHomePageProps) {
  return (
    <div className="w-full">
      {/* Top Banner */}
      {topBannerSlides && topBannerSlides.length > 0 && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 text-center">
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 3000 }}
            loop
            className="w-full"
          >
            {topBannerSlides.map((slide, idx) => (
              <SwiperSlide key={idx}>
                <div className="text-sm md:text-base">
                  {slide.title} {slide.subtitle && `- ${slide.subtitle}`}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Hero Section */}
      {heroSlides && heroSlides.length > 0 && (
        <section className="mb-12">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            loop
            className="rounded-2xl overflow-hidden shadow-2xl"
            style={{ height: '500px' }}
          >
            {heroSlides.map((slide, idx) => (
              <SwiperSlide key={idx}>
                <div className="relative w-full h-full">
                  {slide.imageUrl && (
                    <img
                      src={slide.imageUrl}
                      alt={slide.title || 'Hero'}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-8 text-white max-w-2xl">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                      {slide.title}
                    </h1>
                    {slide.subtitle && (
                      <p className="text-lg md:text-xl mb-6 opacity-90 drop-shadow-md">
                        {slide.subtitle}
                      </p>
                    )}
                    {slide.buttonText && slide.buttonHref && (
                      <Link
                        href={slide.buttonHref}
                        className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-lg transition-colors"
                      >
                        {slide.buttonText}
                      </Link>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      )}

      {/* Promo Cards */}
      {promoCards && promoCards.length > 0 && (
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {promoCards.map((card, idx) => (
              <div
                key={idx}
                className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow group"
              >
                {card.imageUrl && (
                  <img
                    src={card.imageUrl}
                    alt={card.title || 'Promo'}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 text-white w-full">
                  <h3 className="text-xl font-bold">{card.title}</h3>
                  {card.subtitle && <p className="text-sm mt-1">{card.subtitle}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Discounted Products */}
      {discountedProducts && discountedProducts.length > 0 && (
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-right">محصولات تخفیف‌دار</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {discountedProducts.map((product, idx) => (
              <ProductCard key={idx} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Social Media Products */}
      {socialMediaProducts && socialMediaProducts.length > 0 && (
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-right">محصولات شبکه‌های اجتماعی</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {socialMediaProducts.map((product, idx) => (
              <ProductCard key={idx} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Educational Products */}
      {educationalProducts && educationalProducts.length > 0 && (
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-right">محصولات آموزشی</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {educationalProducts.map((product, idx) => (
              <ProductCard key={idx} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Bestselling Courses */}
      {bestsellingCourses && bestsellingCourses.length > 0 && (
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-right">دوره‌های پرفروش</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bestsellingCourses.map((course, idx) => (
              <CourseCard key={idx} course={course} />
            ))}
          </div>
        </section>
      )}

      {/* Magazine Posts */}
      {magazinePosts && magazinePosts.length > 0 && (
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-right">مجله</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {magazinePosts.map((post, idx) => (
              <BlogCard key={idx} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Featured Blogs */}
      {featuredBlogs && featuredBlogs.length > 0 && (
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-right">مطالب برگزیده</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBlogs.map((blog, idx) => (
              <BlogCard key={idx} post={blog} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

// Simple Product Card Component
function ProductCard({ product }: { product: any }) {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.name || product.title || 'Product'}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">{product.name || product.title}</h3>
        {product.price && (
          <p className="text-green-400 font-bold">
            {product.price.toLocaleString('fa-IR')} تومان
          </p>
        )}
      </div>
    </div>
  )
}

// Simple Course Card Component
function CourseCard({ course }: { course: any }) {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
      {course.imageUrl && (
        <img
          src={course.imageUrl}
          alt={course.title || 'Course'}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">{course.title}</h3>
        {course.description && (
          <p className="text-sm text-gray-400 mb-2">{course.description}</p>
        )}
        {course.price && (
          <p className="text-green-400 font-bold">
            {course.price.toLocaleString('fa-IR')} تومان
          </p>
        )}
      </div>
    </div>
  )
}

// Simple Blog Card Component
function BlogCard({ post }: { post: any }) {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
      {post.coverImageUrl && (
        <img
          src={post.coverImageUrl}
          alt={post.title || 'Blog'}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">{post.title}</h3>
        {post.excerpt && <p className="text-sm text-gray-400">{post.excerpt}</p>}
      </div>
    </div>
  )
}

