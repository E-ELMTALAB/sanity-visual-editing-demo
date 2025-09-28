"use client"

import { useState, useEffect, useCallback } from "react"

// کامپوننت اسلایدر مستقل که تمام منطق را در خود دارد
const IndependentSlider = ({ className, items, autoplayInterval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = useCallback(() => {
    const isFirstSlide = currentIndex === 0
    const newIndex = isFirstSlide ? items.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
  }, [currentIndex, items.length])

  const goToNext = useCallback(() => {
    const isLastSlide = currentIndex === items.length - 1
    const newIndex = isLastSlide ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
  }, [currentIndex, items.length])

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex)
  }

  // افکت برای اسلاید خودکار
  useEffect(() => {
    if (autoplayInterval) {
      const timer = setInterval(() => {
        goToNext()
      }, autoplayInterval)

      // پاک‌سازی تایمر هنگام unmount شدن کامپوننت
      return () => clearInterval(timer)
    }
  }, [goToNext, autoplayInterval])

  if (!items || items.length === 0) {
    return null // اگر آیتمی وجود نداشت، چیزی رندر نکن
  }

  const currentItem = items[currentIndex]

  return (
    <div
      className={`relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 ease-in-out w-full h-full cursor-pointer ${className}`}
    >
      {/* تصویر پس‌زمینه با انیمیشن */}
      <img
        src={currentItem.imageUrl}
        alt={currentItem.title}
        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
      />

      {/* لایه گرادینت برای خوانایی متن */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>

      {/* محتوای متنی */}
      <div className="absolute bottom-0 left-0 p-4 md:p-6 text-white w-full">
        <div>
          <h3 className={"text-xl md:text-2xl font-bold drop-shadow-lg"}>{currentItem.title}</h3>
          <p className={"text-sm md:text-base mt-1 opacity-90 drop-shadow-md"}>{currentItem.subtitle}</p>
          {currentItem.buttonText && (
            <button
              className={`
                    mt-3 text-xs py-2 px-4 bg-sky-500 text-white font-bold rounded-full shadow-md hover:bg-sky-600 
                    transition-all duration-300 transform hover:scale-105 focus:outline-none
                `}
            >
              {currentItem.buttonText}
            </button>
          )}
        </div>
      </div>

      {/* دکمه‌های ناوبری (فقط در هاور نمایش داده می‌شوند) */}
      <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={(e) => {
            e.stopPropagation()
            goToPrevious()
          }}
          className="bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors duration-300 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            goToNext()
          }}
          className="bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors duration-300 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* نقاط نشانگر اسلاید */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center items-center space-x-2">
        {items.map((_, slideIndex) => (
          <div
            key={slideIndex}
            onClick={(e) => {
              e.stopPropagation() // جلوگیری از کلیک روی کارت اصلی
              goToSlide(slideIndex)
            }}
            className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-500 ${currentIndex === slideIndex ? "bg-white scale-125" : "bg-white/50"}`}
          ></div>
        ))}
      </div>
    </div>
  )
}

// کامپوننت کارت‌های تبلیغاتی ثابت در کنار اسلایدر
const PromoCard = ({ item }) => {
  if (!item) return null
  return (
    <div className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 ease-in-out w-full h-full cursor-pointer">
      <img
        src={item.imageUrl}
        alt={item.title}
        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-4 md:p-6 text-white w-full">
        <h3 className="text-lg md:text-xl font-bold drop-shadow-lg">{item.title}</h3>
        <p className="text-xs md:text-sm mt-1 opacity-90 drop-shadow-md">{item.subtitle}</p>
        <button
          className={`
                    mt-3 text-xs py-2 px-4 bg-sky-500 text-white font-bold rounded-full shadow-md hover:bg-sky-600 
                    transition-all duration-300 transform hover:scale-105 focus:outline-none
                 `}
        >
          مشاهده
        </button>
      </div>
    </div>
  )
}

// کامپوننت اصلی اپلیکیشن
const App = () => {
  // داده‌های جدید برای چیدمان فروشگاهی
  const pageData = {
    topBanner: [
      {
        id: 20,
        title: "چت جی پی تی اختصاصی ۳ ماهه",
        subtitle: "۲۳۹ هزار تومان",
        imageUrl: "https://placehold.co/1200x300/0891b2/ffffff?text=ChatGPT+Plus",
        buttonText: "خرید",
      },
      {
        id: 21,
        title: "اشتراک ویژه میدجرنی",
        subtitle: "بهترین هوش مصنوعی ساخت تصویر",
        imageUrl: "https://placehold.co/1200x300/4f46e5/ffffff?text=Midjourney",
        buttonText: "مشاهده",
      },
    ],
    mainSlider: [
      {
        id: 1,
        title: "کالکشن جدید پاییزه",
        subtitle: "تا ۳۰٪ تخفیف ویژه",
        imageUrl: "https://placehold.co/800x500/f97316/ffffff?text=Fall+Collection",
        buttonText: "خرید الان",
      },
      {
        id: 2,
        title: "لوازم الکترونیکی",
        subtitle: "جدیدترین گجت‌های روز دنیا",
        imageUrl: "https://placehold.co/800x500/3b82f6/ffffff?text=Electronics",
        buttonText: "بیشتر ببین",
      },
      {
        id: 3,
        title: "خرید شگفت‌انگیز",
        subtitle: "فرصت رو از دست نده!",
        imageUrl: "https://placehold.co/800x500/be185d/ffffff?text=Super+Sale",
        buttonText: "خرید",
      },
    ],
    sideBannerLeft: {
      id: 10,
      title: "بازی‌های جدید",
      subtitle: "اکانت قانونی بازی‌ها",
      imageUrl: "https://placehold.co/400x500/10b981/ffffff?text=Gaming",
    },
    sideBannerRight: {
      id: 11,
      title: "مد و پوشاک",
      subtitle: "استایل خودتو بساز",
      imageUrl: "https://placehold.co/400x500/8b5cf6/ffffff?text=Fashion",
    },
  }

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="w-full max-w-6xl mx-auto p-4 font-sans">
        <div className="flex flex-col gap-4 md:gap-6">
          {/* بخش بنر بالایی */}
          <div className="w-full h-[200px] md:h-[250px] lg:h-[280px]">
            <IndependentSlider items={pageData.topBanner} />
          </div>

          {/* بخش اصلی (اسلایدر وسط و بنرهای کناری) */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-4 md:gap-6 h-auto lg:h-[450px]">
            {/* بنر سمت راست (در موبایل زیر اسلایدر) */}
            <div className="w-full lg:w-1/4 h-full hidden lg:block">
              <PromoCard item={pageData.sideBannerRight} />
            </div>

            {/* اسلایدر اصلی وسط */}
            <div className="w-full lg:w-1/2 h-full">
              <IndependentSlider items={pageData.mainSlider} />
            </div>

            {/* بنر سمت چپ (در موبایل زیر اسلایدر) */}
            <div className="w-full lg:w-1/4 h-full hidden lg:block">
              <PromoCard item={pageData.sideBannerLeft} />
            </div>

            {/* نمایش بنرها در موبایل */}
            <div className="w-full grid grid-cols-2 gap-4 lg:hidden mt-4">
              <div className="h-[250px]">
                <PromoCard item={pageData.sideBannerRight} />
              </div>
              <div className="h-[250px]">
                <PromoCard item={pageData.sideBannerLeft} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
