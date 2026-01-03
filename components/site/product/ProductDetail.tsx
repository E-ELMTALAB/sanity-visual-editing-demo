"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Heart, Share2, Check, X } from "lucide-react";
import { DeliveryProcessSection } from "./DeliveryProcessSection";
import { urlForImage, toProxiedUrl } from "lib/sanity.image";

interface ProductDetailProps {
  product: {
    _id: string;
    name: string;
    description: string;
    longDescription?: string;
    category: string;
    price: number;
    originalPrice?: number;
    discountPercentage?: number;
    imageUrl: string | null;
    galleryUrls: string[];
    features: string[];
    badges: string[];
    inStock: boolean;
    rating: number;
    reviewCount: number;
    options: any[];
    relatedProducts: any[];
    relatedBlogs: any[];
    slug: any;
  };
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(product.imageUrl || "");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  // Calculate discounted price
  const discountedPrice = product.originalPrice && product.discountPercentage
    ? product.originalPrice * (1 - product.discountPercentage / 100)
    : product.price;

  const handleAddToCart = () => {
    // TODO: Implement cart functionality
    console.log("Adding to cart:", { product, quantity });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      setShowShareOptions(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">خانه</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-blue-600">محصولات</Link>
            <span>/</span>
            <span className="text-gray-800">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-xl overflow-hidden shadow-sm">
              {selectedImage ? (
                <Image
                  src={selectedImage}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">تصویر موجود نیست</span>
                </div>
              )}
            </div>

            {/* Gallery Thumbnails */}
            {product.galleryUrls && product.galleryUrls.length > 0 && (
              <div className="flex space-x-2 space-x-reverse overflow-x-auto">
                {product.galleryUrls.map((imageUrl, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(imageUrl)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === imageUrl ? "border-blue-500" : "border-gray-200"
                    }`}
                  >
                    <Image
                      src={imageUrl}
                      alt={`${product.name} ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Product Title and Rating */}
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviewCount} نظر)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-3 space-x-reverse">
              <span className="text-2xl font-bold text-gray-900">
                {discountedPrice.toLocaleString('fa-IR')} تومان
              </span>
              {product.originalPrice && product.discountPercentage && (
                <>
                  <span className="text-lg text-gray-500 line-through">
                    {product.originalPrice.toLocaleString('fa-IR')} تومان
                  </span>
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
                    {product.discountPercentage}% تخفیف
                  </span>
                </>
              )}
            </div>

            {/* Badges */}
            {product.badges && product.badges.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.badges.map((badge, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}

            {/* Stock Status */}
            <div className="flex items-center space-x-2 space-x-reverse">
              {product.inStock ? (
                <>
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-green-600 font-medium">موجود در انبار</span>
                </>
              ) : (
                <>
                  <X className="w-5 h-5 text-red-600" />
                  <span className="text-red-600 font-medium">ناموجود</span>
                </>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4 space-x-reverse">
              <span className="text-gray-700 font-medium">تعداد:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-50"
                >
                  -
                </button>
                <span className="px-4 py-2 text-center min-w-[50px]">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 space-x-reverse">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 flex items-center justify-center space-x-2 space-x-reverse px-6 py-3 rounded-lg font-medium transition-colors ${
                  product.inStock
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>افزودن به سبد خرید</span>
              </button>

              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`p-3 rounded-lg border transition-colors ${
                  isWishlisted
                    ? "bg-red-50 border-red-200 text-red-600"
                    : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
              </button>

              <button
                onClick={handleShare}
                className="p-3 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">ویژگی‌ها</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 space-x-reverse text-gray-700">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Delivery Process Section */}
        <div className="mt-12">
          <DeliveryProcessSection />
        </div>

        {/* Product Description */}
        <div className="mt-12 bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">توضیحات محصول</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
            {product.longDescription && (
              <div className="mt-4 text-gray-700 leading-relaxed">
                {product.longDescription}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">محصولات مرتبط</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {product.relatedProducts.slice(0, 4).map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/products/${relatedProduct.slug?.current || relatedProduct.id}`}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="aspect-square bg-gray-200">
                    {relatedProduct.image ? (
                      <Image
                        src={toProxiedUrl(urlForImage(relatedProduct.image)?.url()) || ''}
                        alt={relatedProduct.title}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-400">تصویر</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                      {relatedProduct.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">
                        {relatedProduct.price?.toLocaleString('fa-IR')} تومان
                      </span>
                      {relatedProduct.discountPercentage && (
                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-medium">
                          {relatedProduct.discountPercentage}% تخفیف
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}