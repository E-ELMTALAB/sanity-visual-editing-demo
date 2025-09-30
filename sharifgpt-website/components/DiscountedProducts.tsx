"use client"
import type { DiscountedProduct } from 'types'
import Link from 'next/link'

interface DiscountedProductsProps {
  products: DiscountedProduct[]
  formatPrice: (price: number) => string
}

export default function DiscountedProducts({ products, formatPrice }: DiscountedProductsProps) {
  if (!products?.length) return null

  return (
    <section className="py-10 sm:py-14 bg-gradient-to-br from-[#F8FBFF] via-white to-[#EEF4FF]">
      <div className="container mx-auto px-3 sm:px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
          <div>
            <span className="inline-flex items-center bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
              🔥 پیشنهادی ویژه
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-3">
              محصولات ویژه با تخفیف محدود
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-2xl">
              جدیدترین اشتراک‌های هوش مصنوعی و سرویس‌های دیجیتال با تخفیف‌های باورنکردنی! هر هفته پیشنهادهای جدید اضافه می‌شود.
            </p>
          </div>

          <Link
            href="/products?filter=discounted"
            className="inline-flex items-center justify-center font-semibold text-sm sm:text-base px-4 py-2 text-blue-600 border border-blue-200 rounded-xl bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition transform hover:text-blue-700"
          >
            مشاهده همه محصولات تخفیف‌دار
            <svg
              className="w-4 h-4 ml-2 transform rtl:rotate-180"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, idx) => {
            const price = product.price ?? 0
            const originalPrice = product.originalPrice ?? 0
            const discountPercentage = product.discountPercentage ?? Math.round(100 - (price / originalPrice) * 100)
            const imageUrl = (product as any)?.image?.asset?.url

            return (
              <div
                key={product._key || idx}
                className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden"
              >
                <div className="relative">
                  <div className="absolute right-4 top-4 z-10">
                    <span className="inline-flex items-center gap-1 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      <span className="text-base">🔥</span>
                      {discountPercentage}% تخفیف
                    </span>
                  </div>

                  <div className="overflow-hidden">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.title || 'Discounted product'}
                        className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-blue-200 via-blue-100 to-white flex items-center justify-center">
                        <span className="text-blue-600 text-xl font-bold">{product.title}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-blue-600 font-bold">
                    پیشنهاد ویژه
                    <span className="inline-flex w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                  </div>

                  <h3 className="mt-2 text-lg font-extrabold text-gray-900 line-clamp-2">
                    {product.title}
                  </h3>

                  <p className="mt-3 text-sm text-gray-600 line-clamp-3 min-h-[60px]">
                    {product.description}
                  </p>

                  <div className="mt-5">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-extrabold text-blue-600">
                        {formatPrice(price)} تومان
                      </span>
                      {originalPrice > price && (
                        <span className="text-sm text-gray-400 line-through">
                          {formatPrice(originalPrice)} تومان
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2l4 -4"
                        />
                      </svg>
                      تضمین اصالت و فعالسازی آنی
                    </div>
                  </div>

                  {product.ctaHref && (
                    <Link
                      href={product.ctaHref}
                      className="mt-5 inline-flex items-center justify-center w-full py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-md hover:shadow-lg transition-all"
                    >
                      {product.ctaText || 'خرید سریع'}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 ml-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

