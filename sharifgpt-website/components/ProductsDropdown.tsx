"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getClient } from '../lib/sanity.client'
import { productsListQuery } from '../lib/sanity.queries'

interface Product {
  _id: string
  name: string
  slug: { current: string }
  category: string
  price: number
  originalPrice?: number
  discountPercentage?: number
  image?: any
  badges?: string[]
}

interface ProductsDropdownProps {
  isOpen: boolean
}

export default function ProductsDropdown({ isOpen }: ProductsDropdownProps) {
  const [products, setProducts] = useState<Record<string, Product[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const client = getClient()
        
        // Fetch all products
        const allProducts = await client.fetch(productsListQuery)
        
        // Define the categories we want to show in the dropdown
        const categories = ['ai', 'social-media', 'music', 'educational', 'sim-card']
        const productsByCategory: Record<string, Product[]> = {}

        // Filter products by category
        for (const category of categories) {
          const categoryProducts = allProducts.filter((product: Product) => product.category === category)
          if (categoryProducts && categoryProducts.length > 0) {
            productsByCategory[category] = categoryProducts.slice(0, 4) // Limit to 4 products per category
          }
        }

        setProducts(productsByCategory)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isOpen) {
      fetchProducts()
    }
  }, [isOpen])

  if (loading) {
    return (
      <div className="absolute top-full right-0 mt-2 w-[800px] bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
        <div className="p-8">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3092BE]"></div>
          </div>
        </div>
      </div>
    )
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ai':
        return (
          <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        )
      case 'social-media':
        return (
          <svg className="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
          </svg>
        )
      case 'music':
        return (
          <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
        )
      case 'educational':
        return (
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
          </svg>
        )
      case 'sim-card':
        return (
          <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17 4h3a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-3V4zM4 4h3v4H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
            <path d="M7 4h10v16H7z" />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        )
    }
  }

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'ai':
        return 'هوش مصنوعی'
      case 'social-media':
        return 'سوشیال مدیا'
      case 'music':
        return 'موسیقی'
      case 'educational':
        return 'آموزشی'
      case 'sim-card':
        return 'سیمکارت'
      default:
        return category
    }
  }

  const getCategoryBgColor = (category: string) => {
    switch (category) {
      case 'ai':
        return 'bg-purple-100'
      case 'social-media':
        return 'bg-pink-100'
      case 'music':
        return 'bg-red-100'
      case 'educational':
        return 'bg-green-100'
      case 'sim-card':
        return 'bg-yellow-100'
      default:
        return 'bg-gray-100'
    }
  }

  const getProductIcon = (product: Product, index: number) => {
    const icons = ['🤖', '💡', '🎨', '📱', '🎵', '📚', '📶', '🔧']
    return icons[index % icons.length]
  }

  const getProductIconBg = (index: number) => {
    const colors = ['bg-green-500', 'bg-indigo-500', 'bg-pink-500', 'bg-blue-500', 'bg-yellow-500', 'bg-orange-500', 'bg-purple-500', 'bg-red-500']
    return colors[index % colors.length]
  }

  return (
    <div className="absolute top-full right-0 mt-2 w-[800px] bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
      <div className="p-8">
        <div className="grid grid-cols-3 gap-8">
          {Object.entries(products).map(([category, categoryProducts], categoryIndex) => (
            <div key={category}>
              <div className="flex items-center mb-6">
                <div className={`w-8 h-8 ${getCategoryBgColor(category)} rounded-lg flex items-center justify-center ml-3`}>
                  {getCategoryIcon(category)}
                </div>
                <h3 className="text-lg font-bold text-gray-800">{getCategoryTitle(category)}</h3>
              </div>
              <ul className="space-y-3">
                {categoryProducts.map((product, index) => (
                  <li key={product._id}>
                    <Link
                      href={`/products/${product.slug.current}`}
                      className="flex items-center text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                    >
                      <div className={`w-6 h-6 ${getProductIconBg(index)} rounded flex items-center justify-center ml-3`}>
                        <span className="text-white text-xs font-bold">{getProductIcon(product, index)}</span>
                      </div>
                      <span>{product.name}</span>
                    </Link>
                  </li>
                ))}
                {categoryProducts.length > 0 && (
                  <li>
                    <Link
                      href={`/products?category=${category}`}
                      className="text-[#3092BE] hover:text-[#2a7ba8] transition-colors py-2 px-3 rounded-lg hover:bg-blue-50 block text-sm font-medium"
                    >
                      مشاهده همه →
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Show message if no products are found */}
        {Object.keys(products).length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">محصولاتی یافت نشد</p>
          </div>
        )}
      </div>
    </div>
  )
}
