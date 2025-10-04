"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { useCart } from "../contexts/cart-context"

interface CartDropdownProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartDropdown({ isOpen, onClose }: CartDropdownProps) {
  const { state, removeItem, updateQuantity } = useCart()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const isAuthenticated = false // This should come from your auth context/state

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 max-h-96 overflow-hidden"
      dir="rtl"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-cyan-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">سبد خرید</h3>
          <div className="flex items-center space-x-2 space-x-reverse">
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-bold">
              {state.itemCount} کالا
            </span>
            <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Cart Items */}
      <div className="max-h-64 overflow-y-auto">
        {state.items.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <p className="text-gray-500 mb-4">سبد خرید شما خالی است</p>
            <Link
              href="/products"
              onClick={onClose}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              مشاهده محصولات
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {state.items.map((item) => (
              <div
                key={`${item.id}-${item.selectedOption}`}
                className="flex items-center space-x-4 space-x-reverse p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-800 text-sm truncate">{item.title}</h4>
                  {item.selectedOption && <p className="text-xs text-gray-500">{item.selectedOption}</p>}
                  <p className="text-blue-600 font-bold text-sm">{item.price.toLocaleString()} تومان</p>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2 py-1 text-gray-600 hover:bg-gray-200 transition-colors text-sm"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 border-x border-gray-300 text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 text-gray-600 hover:bg-gray-200 transition-colors text-sm"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {state.items.length > 0 && (
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600">مجموع:</span>
            <span className="text-xl font-bold text-blue-600">{state.total.toLocaleString()} تومان</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/cart"
              onClick={onClose}
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded-xl text-center hover:bg-blue-50 transition-colors font-medium text-sm"
            >
              مشاهده سبد
            </Link>
            <Link
              href="/checkout"
              onClick={onClose}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-center hover:from-blue-700 hover:to-blue-800 transition-all font-medium text-sm"
            >
              پرداخت
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
