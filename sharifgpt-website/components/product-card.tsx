"use client"

import type React from "react"
import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ProductCardProps {
  id: string | number
  title: string
  description?: string
  price: number
  originalPrice?: number
  discountPercentage?: number
  image?: string
  category?: string
  rating?: number
  reviews?: number
  features?: string[]
  badge?: string
  href: string
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  description,
  price,
  originalPrice,
  discountPercentage,
  image,
  category,
  rating,
  reviews,
  features,
  badge,
  href,
}) => {
  const formatPrice = (price: number) => {
    return price.toLocaleString("fa-IR")
  }

  const productPageHref = `/products/${id}`

  return (
    <div className="relative group w-full bg-white rounded-2xl shadow-lg overflow-hidden transform-gpu transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 cursor-pointer">
      {/* Image section - fills top portion without padding */}
      <div className="relative h-32 sm:h-40 overflow-hidden">
        <img
          src={image || "/placeholder.svg?height=160&width=280&query=product"}
          alt={title}
          className="w-full h-full object-cover transform-gpu transition-transform duration-500 group-hover:scale-105"
        />

        {/* Discount badge */}
        {discountPercentage && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            {discountPercentage}% تخفیف
          </div>
        )}

        {badge && (
          <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            {badge}
          </div>
        )}
      </div>

      {/* Content section */}
      <div className="p-3 sm:p-4 flex flex-col min-h-36 sm:h-44">
        {/* Title and description */}
        <div className="flex-1 text-center mb-2 sm:mb-3">
          <h3 className="text-gray-800 text-xs sm:text-base font-bold line-clamp-2 mb-1">{title}</h3>
        </div>

        {/* Price section */}
        <div className="text-center mb-2 sm:mb-3">
          <div className="text-blue-600 text-base sm:text-xl font-bold">
            {formatPrice(price)} <span className="text-xs sm:text-sm text-gray-500">تومان</span>
          </div>
          {originalPrice && originalPrice > price && (
            <div className="text-xs text-gray-400 line-through">{formatPrice(originalPrice)} تومان</div>
          )}
        </div>

        <div className="flex gap-1 sm:gap-2 mt-auto">
          <Link href={productPageHref} className="w-full">
            <Button className="w-full font-semibold py-1.5 sm:py-2.5 px-2 sm:px-4 rounded-lg sm:rounded-xl transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
              <Eye size={14} className="sm:w-4 sm:h-4" />
              مشاهده محصول
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
