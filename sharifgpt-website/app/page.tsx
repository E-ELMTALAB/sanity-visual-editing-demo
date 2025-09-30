"use client"

import type React from "react"
import Link from "next/link"
import { useEffect, useState, useCallback } from "react"
import MobileMenu from "../components/mobile-menu"
import RobotAssistant from "../components/robot-assistant"
import ProductCard from "@/components/product-card"
import CartDropdown from "@/components/cart-dropdown" // Assuming CartDropdown component exists
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import Footer from "@/components/footer"
import type { HeroSlide, PromoCard, DiscountedProduct, SocialMediaProduct, EducationalProduct, BestsellingCourse } from "types"

const IndependentSlider = ({ className, items = [], autoplayInterval = 5000 }) => {
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
        src={currentItem.imageUrl || "/placeholder.svg"}
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
        src={item.imageUrl || "/placeholder.svg"}
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

export default function HomePage({ heroData }: { heroData?: { heroSlides?: HeroSlide[]; promoCards?: PromoCard[]; discountedProducts?: DiscountedProduct[]; socialMediaProducts?: SocialMediaProduct[]; educationalProducts?: EducationalProduct[]; bestsellingCourses?: BestsellingCourse[] } }) {
  const heroSlides = heroData?.heroSlides || []
  const promoCards = heroData?.promoCards || []
  const discountedProductsFromSanity = heroData?.discountedProducts || []
  const socialMediaProductsFromSanity = heroData?.socialMediaProducts || []
  const educationalProductsFromSanity = heroData?.educationalProducts || []
  const bestsellingCoursesFromSanity = heroData?.bestsellingCourses || []
  const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false)
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "", confirmPassword: "" })
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [user, setUser] = useState({ name: "مهدی", email: "mehdi@example.com" })
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const [currentBannerIndex, setCurrentBannerIndex] = useState(0)

  // Cart state and handlers
  const [cartState, setCartState] = useState({ itemCount: 0 }) // Example cart state
  const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false)

  const handleCartClick = () => {
    setIsCartDropdownOpen(!isCartDropdownOpen)
  }

  const sliderData = {
    topBanner: heroSlides.slice(0, 1),
    mainSlider: heroSlides,
    sideBannerLeft: promoCards[0],
    sideBannerRight: promoCards[1],
  }

  const discountedProducts = discountedProductsFromSanity.map((dp, i) => ({
    id: i + 1,
    name: dp.name || '',
    category: dp.category || 'applied-ai',
    originalPrice: dp.originalPrice || 0,
    discountedPrice: dp.discountedPrice || 0,
    discountPercentage: dp.discountPercentage || 0,
    image: (dp as any)?.image?.asset?.url || `https://placehold.co/400x300/10B981/FFFFFF?text=${encodeURIComponent(dp.name || 'Product')}`,
    description: dp.description || '',
  }))

  const socialMediaProducts = socialMediaProductsFromSanity.map((smp, i) => ({
    id: i + 1,
    name: smp.name || '',
    category: smp.category || 'social-media',
    price: smp.price || 0,
    originalPrice: smp.originalPrice || 0,
    discountPercentage: smp.discountPercentage || 0,
    image: (smp as any)?.image?.asset?.url || `/placeholder.svg?height=120&width=120&text=${encodeURIComponent(smp.name || 'Product')}`,
    description: smp.description || '',
  }))

  const educationalProducts = educationalProductsFromSanity.map((edp, i) => ({
    id: i + 1,
    name: edp.name || '',
    category: edp.category || 'education',
    price: edp.price || 0,
    originalPrice: edp.originalPrice || 0,
    discountPercentage: edp.discountPercentage || 0,
    image: (edp as any)?.image?.asset?.url || `/placeholder.svg?height=120&width=120&text=${encodeURIComponent(edp.name || 'Product')}`,
    description: edp.description || '',
  }))

  const bestsellingCourses = bestsellingCoursesFromSanity.map((course, i) => ({
    id: i + 1,
    title: course.title || '',
    description: course.description || '',
    price: course.price || 0,
    originalPrice: course.originalPrice || 0,
    image: (course as any)?.image?.asset?.url || `https://placehold.co/600x400/E0F2FE/0891b2?text=${encodeURIComponent(course.title || 'Course')}`,
    instructor: course.instructor || '',
    duration: course.duration || '',
    students: course.students || 0,
    rating: course.rating || 0,
    category: course.category || 'programming',
    level: course.level || 'beginner',
    reviewCount: course.reviewCount || 0,
  }))


  const [storiesData, setStoriesData] = useState([
    {
      id: 1,
      user: "جدیدترین‌ها",
      img: "https://placehold.co/80x80/E0F2FE/0891b2?text=New",
      fullImg: "https://placehold.co/400x600/E0F2FE/0891b2?text=Latest+News+Story",
      seen: false,
      viewed: false, // Added viewed state to track clicked stories
    },
    {
      id: 2,
      user: "تخفیف برق‌آسا",
      img: "https://placehold.co/80x80/FEF3C7/F59E0B?text=Sale",
      fullImg: "https://placehold.co/400x600/FEF3C7/F59E0B?text=Lightning+Sale+Story",
      seen: false,
      viewed: false, // Added viewed state
    },
    {
      id: 3,
      user: "الکترونیک",
      img: "https://placehold.co/80x80/E0E7FF/4F46E5?text=Tech",
      fullImg: "https://placehold.co/400x600/E0E7FF/4F46E5?text=Electronics+Story",
      seen: true,
      viewed: false, // Added viewed state
    },
    {
      id: 4,
      user: "فشن",
      img: "https://placehold.co/80x80/FCE7F3/EC4899?text=Fashion",
      fullImg: "https://placehold.co/400x600/FCE7F3/EC4899?text=Fashion+Story",
      seen: false,
      viewed: false, // Added viewed state
    },
    {
      id: 5,
      user: "خانه و دکور",
      img: "https://placehold.co/80x80/D1FAE5/10B981?text=Home",
      fullImg: "https://placehold.co/400x600/D1FAE5/10B981?text=Home+Decor+Story",
      seen: true,
      viewed: false, // Added viewed state
    },
    {
      id: 6,
      user: "موبایل",
      img: "https://placehold.co/80x80/F3E8FF/8B5CF6?text=Mobile",
      fullImg: "https://placehold.co/400x600/F3E8FF/8B5CF6?text=Mobile+Story",
      seen: false,
      viewed: false, // Added viewed state
    },
    {
      id: 7,
      user: "ورزش",
      img: "https://placehold.co/80x80/DBEAFE/3B82F6?text=Sport",
      fullImg: "https://placehold.co/400x600/DBEAFE/3B82F6?text=Sports+Story",
      seen: true,
      viewed: false, // Added viewed state
    },
  ])

  const handleProfileClick = () => {
    if (isAuthenticated) {
      setIsProfileDropdownOpen(!isProfileDropdownOpen)
    } else {
      window.location.href = "/login"
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple validation - in real app, this would be API call
    if (loginForm.email && loginForm.password) {
      setIsAuthenticated(true)
      setIsLoginModalOpen(false)
      setLoginForm({ email: "", password: "" })
      // In real app, you'd get user data from API response
      setUser({ name: "مهدی", email: loginForm.email })
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple validation - in real app, this would be API call
    if (
      registerForm.name &&
      registerForm.email &&
      registerForm.password &&
      registerForm.password === registerForm.confirmPassword
    ) {
      setIsAuthenticated(true)
      setIsLoginModalOpen(false)
      setRegisterForm({ name: "", email: "", password: "", confirmPassword: "" })
      setUser({ name: registerForm.name, email: registerForm.email })
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setIsProfileDropdownOpen(false)
    setUser({ name: "", email: "" })
  }

  const openStoryViewer = (index: number) => {
    setCurrentStoryIndex(index)
    setIsStoryViewerOpen(true)
    setStoriesData((prev) => prev.map((story, i) => (i === index ? { ...story, viewed: true } : story)))
  }

  const closeStoryViewer = () => {
    setIsStoryViewerOpen(false)
  }

  const nextStory = () => {
    const nextIndex = (currentStoryIndex + 1) % storiesData.length
    setCurrentStoryIndex(nextIndex)
    setStoriesData((prev) => prev.map((story, i) => (i === nextIndex ? { ...story, viewed: true } : story)))
  }

  const prevStory = () => {
    const prevIndex = currentStoryIndex === 0 ? storiesData.length - 1 : currentStoryIndex - 1
    setCurrentStoryIndex(prevIndex)
    setStoriesData((prev) => prev.map((story, i) => (i === prevIndex ? { ...story, viewed: true } : story)))
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString("fa-IR")
  }

  // Dummy bannerImages array to resolve the lint error
  const bannerImages = ["/banner1.jpg", "/banner2.jpg"]

  useEffect(() => {
    const storiesContainer = document.getElementById("storiesContainer")

    if (storiesContainer) {
      // Clear existing stories
      storiesContainer.innerHTML = ""

      storiesData.forEach((story, index) => {
        const storyElement = document.createElement("div")
        storyElement.className =
          "flex-shrink-0 flex flex-col items-center space-y-1 sm:space-y-2 cursor-pointer transition-transform duration-200 hover:scale-105"

        let borderClass = "story-unseen" // Default for unseen stories
        if (story.viewed) {
          borderClass = "story-viewed" // No border for viewed stories
        } else if (story.seen) {
          borderClass = "story-seen" // Gray border for seen but not viewed
        }

        storyElement.innerHTML = `
          <div class="p-1 rounded-full ${borderClass}">
            <img class="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover" src="${story.img}" alt="${story.user}">
          </div>
          <p class="text-xs text-gray-600 text-center max-w-[70px] truncate">${story.user}</p>
        `

        storyElement.addEventListener("click", () => {
          openStoryViewer(index)
        })

        storiesContainer.appendChild(storyElement)
      })

      const leftArrow = document.getElementById("storiesLeftArrow")
      const rightArrow = document.getElementById("storiesRightArrow")

      const updateArrowVisibility = () => {
        if (leftArrow && rightArrow) {
          const { scrollLeft, scrollWidth, clientWidth } = storiesContainer

          // Show/hide left arrow
          if (scrollLeft > 0) {
            leftArrow.classList.remove("opacity-0", "pointer-events-none")
            leftArrow.classList.add("opacity-100", "pointer-events-auto")
          } else {
            leftArrow.classList.add("opacity-0", "pointer-events-none")
            leftArrow.classList.remove("opacity-100", "pointer-events-auto")
          }

          // Show/hide right arrow
          if (scrollLeft < scrollWidth - clientWidth - 10) {
            rightArrow.classList.remove("opacity-0", "pointer-events-none")
            rightArrow.classList.add("opacity-100", "pointer-events-auto")
          } else {
            rightArrow.classList.add("opacity-0", "pointer-events-none")
            rightArrow.classList.remove("opacity-100", "pointer-events-auto")
          }
        }
      }

      // Initial check
      updateArrowVisibility()

      // Add scroll listener
      storiesContainer.addEventListener("scroll", updateArrowVisibility)

      // Add resize listener to update arrows on window resize
      window.addEventListener("resize", updateArrowVisibility)

      // Cleanup function
      return () => {
        storiesContainer.removeEventListener("scroll", updateArrowVisibility)
        window.removeEventListener("resize", updateArrowVisibility)
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      const profileContainer = document.getElementById("profileContainer")
      if (profileContainer && !profileContainer.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false)
      }
      // Close cart dropdown if clicking outside
      const cartContainer = document.getElementById("cartContainer") // Assuming cart has an ID
      if (cartContainer && !cartContainer.contains(event.target as Node)) {
        setIsCartDropdownOpen(false)
      }
    }

    const bannerInterval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % bannerImages.length)
    }, 4000) // Switch every 4 seconds

    // Stories navigation logic
    const storiesContainerElement = document.getElementById("storiesContainer")
    const storiesLeftArrow = document.getElementById("storiesLeftArrow")
    const storiesRightArrow = document.getElementById("storiesRightArrow")

    const updateArrowVisibility = () => {
      if (storiesContainerElement && storiesLeftArrow && storiesRightArrow) {
        storiesLeftArrow.style.opacity = storiesContainerElement.scrollLeft > 0 ? "1" : "0"
        storiesLeftArrow.style.pointerEvents = storiesContainerElement.scrollLeft > 0 ? "auto" : "none"
        storiesRightArrow.style.opacity =
          storiesContainerElement.scrollLeft <
          storiesContainerElement.scrollWidth - storiesContainerElement.clientWidth - 1
            ? "1"
            : "0"
        storiesRightArrow.style.pointerEvents =
          storiesContainerElement.scrollLeft <
          storiesContainerElement.scrollWidth - storiesContainerElement.clientWidth - 1
            ? "auto"
            : "none"
      }
    }

    if (storiesContainerElement) {
      storiesContainerElement.addEventListener("scroll", updateArrowVisibility)
    }

    // Initial check for arrow visibility
    updateArrowVisibility()

    const mobileMenuButton = document.getElementById("mobileMenuButton")
    const mobileMenu = document.getElementById("mobileMenu")
    const mobileMenuBackdrop = document.getElementById("mobileMenuBackdrop")

    const toggleMobileMenu = () => {
      if (mobileMenu && mobileMenuBackdrop) {
        const isOpen = mobileMenu.classList.contains("translate-x-0")
        if (isOpen) {
          // Close menu
          mobileMenu.classList.remove("translate-x-0")
          mobileMenu.classList.add("translate-x-full")
          mobileMenuBackdrop.classList.remove("opacity-100", "pointer-events-auto")
          mobileMenuBackdrop.classList.add("opacity-0", "pointer-events-none")
        } else {
          // Open menu
          mobileMenu.classList.remove("translate-x-full")
          mobileMenu.classList.add("translate-x-0")
          mobileMenuBackdrop.classList.remove("opacity-0", "pointer-events-none")
          mobileMenuBackdrop.classList.add("opacity-100", "pointer-events-auto")
        }
      }
    }

    if (mobileMenuButton) {
      mobileMenuButton.addEventListener("click", toggleMobileMenu)
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      clearInterval(bannerInterval) // Clean up banner interval
      if (storiesContainerElement) {
        storiesContainerElement.removeEventListener("scroll", updateArrowVisibility)
      }
      if (mobileMenuButton) {
        mobileMenuButton.removeEventListener("click", toggleMobileMenu)
      }
    }
  }, [storiesData, bannerImages.length]) // Added bannerImages.length to dependencies

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false)
  }

  const handleStoriesScroll = (direction: "left" | "right") => {
    if (typeof window !== "undefined") {
      const container = document.getElementById("storiesContainer")
      if (container) {
        const scrollAmount = direction === "left" ? -200 : 200
        container.scrollBy({ left: scrollAmount, behavior: "smooth" })
      }
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen" dir="rtl">
      <div className="hidden lg:block">
        <RobotAssistant />
      </div>

      {isStoryViewerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-[100] flex items-center justify-center"
          onClick={closeStoryViewer} // Added click to close on backdrop
        >
          <div className="relative w-full h-full max-w-md mx-auto flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation() // Prevent event bubbling
                closeStoryViewer()
              }}
              className="absolute top-4 right-4 z-[110] w-10 h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Story Progress Bars */}
            <div className="absolute top-4 left-4 right-16 z-[105] flex space-x-1 space-x-reverse">
              {storiesData.map((_, index) => (
                <div key={index} className="flex-1 h-1 bg-white bg-opacity-30 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-white transition-all duration-300 ${
                      index < currentStoryIndex ? "w-full" : index === currentStoryIndex ? "w-full" : "w-0"
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* Story Content */}
            <div
              className="relative w-full h-full max-w-sm mx-4"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on story content
            >
              <img
                src={storiesData[currentStoryIndex].fullImg || "/placeholder.svg"}
                alt={storiesData[currentStoryIndex].user}
                className="w-full h-full object-cover rounded-2xl"
              />

              {/* Story Info */}
              <div className="absolute top-16 left-4 right-4 z-[105]">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <img
                    src={storiesData[currentStoryIndex].img || "/placeholder.svg"}
                    alt={storiesData[currentStoryIndex].user}
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                  <span className="text-white font-semibold text-sm">{storiesData[currentStoryIndex].user}</span>
                </div>
              </div>

              {/* Navigation Areas */}
              <button
                onClick={(e) => {
                  e.stopPropagation() // Prevent event bubbling
                  prevStory()
                }}
                className="absolute left-0 top-0 w-1/3 h-full z-[105] flex items-center justify-start pl-4 text-white opacity-0 hover:opacity-100 transition-opacity"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation() // Prevent event bubbling
                  nextStory()
                }}
                className="absolute right-0 top-0 w-1/3 h-full z-[105] flex items-center justify-end pr-4 text-white opacity-0 hover:opacity-100 transition-opacity"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Tap Areas for Mobile */}
              <div
                onClick={(e) => {
                  e.stopPropagation() // Prevent event bubbling
                  prevStory()
                }}
                className="absolute left-0 top-0 w-1/3 h-full z-[105] sm:hidden"
              />
              <div
                onClick={(e) => {
                  e.stopPropagation() // Prevent event bubbling
                  nextStory()
                }}
                className="absolute right-0 top-0 w-1/3 h-full z-[105] sm:hidden"
              />
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <header className="sticky top-0 z-50 glassmorphism">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Mobile Menu Button - Only visible on mobile */}
            <button
              id="mobileMenuButton"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors ml-2"
              aria-label="باز کردن منو"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center space-y-1">
                <div className="w-5 h-0.5 bg-gray-600 transition-colors hover:bg-blue-600"></div>
                <div className="w-5 h-0.5 bg-gray-600 transition-colors hover:bg-blue-600"></div>
                <div className="w-5 h-0.5 bg-gray-600 transition-colors hover:bg-blue-600"></div>
              </div>
            </button>

            {/* Logo and Name */}
            <div className="relative flex items-center space-x-2 sm:space-x-4 space-x-reverse cursor-pointer">
              <Link href="/" className="flex items-center space-x-2 sm:space-x-4 space-x-reverse">
                <img
                  src="/images/design-mode/Group%201(1).png"
                  alt="SharifGPT Logo"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                />
                <h1 className="text-lg sm:text-xl font-bold text-gray-800">SharifGPT</h1>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center space-x-2 space-x-reverse">
              <div className="h-8 border-l border-gray-300"></div>
              <div className="relative group">
                <Link
                  href="/products"
                  className="flex items-center text-gray-700 hover:text-[#3092BE] transition-all duration-300 px-3 py-2 rounded-lg text-sm font-medium transform hover:scale-105 hover:shadow-[0_0_15px_rgba(48,146,190,0.3)]"
                >
                  <span>محصولات</span>
                  <svg
                    className="w-4 h-4 mr-1 transition-transform duration-200 group-hover:rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>

                {/* Products Dropdown Menu */}
                <div className="absolute top-full right-0 mt-2 w-[800px] bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                  <div className="p-8">
                    <div className="grid grid-cols-3 gap-8">
                      {/* AI Column */}
                      <div>
                        <div className="flex items-center mb-6">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center ml-3">
                            <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-bold text-gray-800">هوش مصنوعی</h3>
                        </div>
                        <ul className="space-y-3">
                          <li>
                            <Link
                              href="/products?category=ai"
                              className="flex items-center text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                            >
                              <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center ml-3">
                                <span className="text-white text-xs font-bold">🤖</span>
                              </div>
                              <span>ChatGPT Plus</span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/products?category=ai"
                              className="flex items-center text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                            >
                              <div className="w-6 h-6 bg-indigo-500 rounded flex items-center justify-center ml-3">
                                <span className="text-white text-xs font-bold">💡</span>
                              </div>
                              <span>Claude Pro</span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/products?category=ai"
                              className="text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 block"
                            >
                              Gemini Advanced
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/products?category=ai"
                              className="text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 block"
                            >
                              Perplexity Pro
                            </Link>
                          </li>
                        </ul>
                      </div>

                      {/* Social Media and Music Column */}
                      <div>
                        <div className="flex items-center mb-6">
                          <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center ml-3">
                            <svg className="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-bold text-gray-800">سوشیال مدیا</h3>
                        </div>
                        <ul className="space-y-3">
                          <li>
                            <Link
                              href="/products?category=social-media"
                              className="flex items-center text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                            >
                              <div className="w-6 h-6 bg-pink-500 rounded flex items-center justify-center ml-3">
                                <span className="text-white text-xs font-bold">📱</span>
                              </div>
                              <span>Instagram Premium</span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/products?category=social-media"
                              className="flex items-center text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                            >
                              <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center ml-3">
                                <span className="text-white text-xs font-bold">🐦</span>
                              </div>
                              <span>Twitter Blue</span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/products?category=social-media"
                              className="text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 block"
                            >
                              LinkedIn Premium
                            </Link>
                          </li>
                        </ul>

                        <div className="mt-8">
                          <div className="flex items-center mb-4">
                            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center ml-3">
                              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                              </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">موسیقی</h3>
                          </div>
                          <ul className="space-y-3">
                            <li>
                              <Link
                                href="/products?category=music"
                                className="flex items-center text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                              >
                                <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center ml-3">
                                  <span className="text-white text-xs font-bold">🎵</span>
                                </div>
                                <span>Spotify Premium</span>
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/products?category=music"
                                className="text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 block"
                              >
                                Apple Music
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* Educational and SIM Card Column */}
                      <div>
                        <div className="flex items-center mb-6">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center ml-3">
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-bold text-gray-800">آموزشی</h3>
                        </div>
                        <ul className="space-y-3">
                          <li>
                            <Link
                              href="/products?category=educational"
                              className="flex items-center text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                            >
                              <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center ml-3">
                                <span className="text-white text-xs font-bold">📚</span>
                              </div>
                              <span>Coursera Plus</span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/products?category=educational"
                              className="flex items-center text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                            >
                              <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center ml-3">
                                <span className="text-white text-xs font-bold">🎓</span>
                              </div>
                              <span>Udemy Business</span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/products?category=educational"
                              className="text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 block"
                            >
                              MasterClass
                            </Link>
                          </li>
                        </ul>

                        <div className="mt-8">
                          <div className="flex items-center mb-4">
                            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center ml-3">
                              <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17 4h3a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-3V4zM4 4h3v4H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
                                <path d="M7 4h10v16H7z" />
                              </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">سیمکارت</h3>
                          </div>
                          <ul className="space-y-3">
                            <li>
                              <Link
                                href="/products?category=sim-card"
                                className="flex items-center text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                              >
                                <div className="w-6 h-6 bg-yellow-500 rounded flex items-center justify-center ml-3">
                                  <span className="text-white text-xs font-bold">📶</span>
                                </div>
                                <span>سیمکارت مجازی</span>
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/products?category=sim-card"
                                className="text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 block"
                              >
                                سیمکارت بین‌المللی
                              </Link>
                            </li>
                          </ul>
                        </div>

                        {/* Popular Badge */}
                        <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                          <div className="flex items-center mb-2">
                            <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                              محبوب
                            </span>
                          </div>
                          <h4 className="font-bold text-gray-800 mb-1">پکیج کامل</h4>
                          <p className="text-sm text-gray-600">تمام محصولات دیجیتال</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <Link
                  href="/courses"
                  className="flex items-center text-gray-700 hover:text-[#3092BE] transition-all duration-300 px-3 py-2 rounded-lg text-sm font-medium transform hover:scale-105 hover:shadow-[0_0_15px_rgba(48,146,190,0.3)]"
                >
                  <span>دوره‌ها</span>
                  <svg
                    className="w-4 h-4 mr-1 transition-transform duration-200 group-hover:rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>

                {/* Courses Dropdown Menu */}
                <div className="absolute top-full right-0 mt-2 w-[800px] bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                  <div className="p-8">
                    <div className="grid grid-cols-3 gap-8">
                      {/* AI Fundamentals Column */}
                      <div>
                        <div className="flex items-center mb-6">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center ml-3">
                            <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-bold text-gray-800">مبانی هوش مصنوعی</h3>
                        </div>
                        <ul className="space-y-3">
                          <li>
                            <a
                              href="#"
                              className="flex items-center text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                            >
                              <div className="w-6 h-6 bg-purple-500 rounded flex items-center justify-center ml-3">
                                <span className="text-white text-xs font-bold">🤖</span>
                              </div>
                              <span>آشنایی با ChatGPT</span>
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="flex items-center text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                            >
                              <div className="w-6 h-6 bg-indigo-500 rounded flex items-center justify-center ml-3">
                                <span className="text-white text-xs font-bold">💡</span>
                              </div>
                              <span>تکنیک‌های پرامپت نویسی</span>
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 block"
                            >
                              هوش مصنوعی برای مبتدیان
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 block"
                            >
                              اصول یادگیری ماشین
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 block"
                            >
                              شبکه‌های عصبی مقدماتی
                            </a>
                          </li>
                        </ul>
                      </div>

                      {/* Business & Professional Column */}
                      <div>
                        <div className="flex items-center mb-6">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center ml-3">
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-bold text-gray-800">کسب و کار</h3>
                        </div>
                        <ul className="space-y-3">
                          <li>
                            <a
                              href="#"
                              className="flex items-center text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                            >
                              <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center ml-3">
                                <span className="text-white text-xs font-bold">📊</span>
                              </div>
                              <span>هوش مصنوعی در بازاریابی</span>
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="flex items-center text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                            >
                              <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center ml-3">
                                <span className="text-white text-xs font-bold">💼</span>
                              </div>
                              <span>مدیریت پروژه با AI</span>
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 block"
                            >
                              تحلیل داده با هوش مصنوعی
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 block"
                            >
                              خدمات مشتری هوشمند
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 block"
                            >
                              اتوماسیون فرآیندها
                            </a>
                          </li>
                        </ul>
                      </div>

                      {/* Creative & Technical Column */}
                      <div>
                        <div className="flex items-center mb-6">
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center ml-3">
                            <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-bold text-gray-800">خلاقیت و فناوری</h3>
                        </div>
                        <ul className="space-y-3">
                          <li>
                            <a
                              href="#"
                              className="flex items-center text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                            >
                              <div className="w-6 h-6 bg-pink-500 rounded flex items-center justify-center ml-3">
                                <span className="text-white text-xs font-bold">🎨</span>
                              </div>
                              <span>تولید محتوا با AI</span>
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="flex items-center text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                            >
                              <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center ml-3">
                                <span className="text-white text-xs font-bold">🎬</span>
                              </div>
                              <span>ساخت ویدیو با هوش مصنوعی</span>
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 block"
                            >
                              طراحی گرافیک با AI
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 block"
                            >
                              برنامه‌نویسی با کمک AI
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 block"
                            >
                              موسیقی و صدا با AI
                            </a>
                          </li>
                        </ul>

                        {/* Featured Course Badge */}
                        <div className="mt-8 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100">
                          <div className="flex items-center mb-2">
                            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                              ویژه
                            </span>
                          </div>
                          <h4 className="font-bold text-gray-800 mb-1">دوره جامع AI</h4>
                          <p className="text-sm text-gray-600">از صفر تا صد هوش مصنوعی</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Link
                href="/enterprise"
                className="flex items-center text-gray-700 hover:text-[#3092BE] transition-all duration-300 px-3 py-2 rounded-lg text-sm font-medium transform hover:scale-105 hover:shadow-[0_0_15px_rgba(48,146,190,0.3)] whitespace-nowrap"
              >
                <span>فروش سازمانی</span>
                <svg
                  className="w-4 h-4 mr-1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link
                href="/blog"
                className="text-gray-700 hover:text-[#3092BE] transition-all duration-300 px-3 py-2 rounded-lg text-sm font-medium transform hover:scale-105 hover:shadow-[0_0_15px_rgba(48,146,190,0.3)]"
              >
                مجله
              </Link>
            </nav>

            {/* Actions: Search, Contact, Cart, Profile */}
            <div className="flex items-center space-x-3 sm:space-x-5 space-x-reverse">
              {/* Search Box */}
              <div className="relative hidden xl:block">
                <input
                  type="text"
                  placeholder="جستجو..."
                  className="w-40 xl:w-48 bg-gray-100 border border-[#3092BE] rounded-full py-2 pr-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3092BE] transition-all duration-300 ease-in-out hover:w-48 xl:hover:w-60 focus:w-48 xl:focus:w-60"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
              </div>

              {/* Contact */}
              <div className="hidden md:flex items-center space-x-2 space-x-reverse border-l border-gray-300 pl-3 sm:pl-5">
                <div className="text-right">
                  <div className="flex items-center justify-end">
                    <a
                      href="/contact"
                      className="text-xs sm:text-sm font-semibold text-gray-700 hover:text-[#3092BE] transition-colors cursor-pointer"
                    >
                      تماس با ما
                    </a>
                    <span className="relative flex h-2 w-2 sm:h-3 sm:w-3 mr-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 sm:h-3 sm:w-3 bg-green-500"></span>
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">وضعیت: آنلاین</p>
                </div>
              </div>

              <div className="relative" id="profileContainer">
                <div className="flex items-center space-x-3 space-x-reverse">
                  {/* Cart Icon - Separate Circle */}
                  <div className="relative" id="cartContainer">
                    <div
                      className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 border-[#3092BE] flex items-center justify-center bg-white shadow-sm cursor-pointer transition-transform duration-300 transform hover:scale-110"
                      onClick={handleCartClick}
                    >
                      <svg
                        className="h-4 w-4 sm:h-5 sm:w-5 text-[#3092BE]"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                      </svg>
                      {/* Cart Badge */}
                      {cartState.itemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                          {cartState.itemCount}
                        </span>
                      )}
                    </div>
                    {/* Cart Dropdown */}
                    <CartDropdown isOpen={isCartDropdownOpen} onClose={() => setIsCartDropdownOpen(false)} />
                  </div>

                  {/* Profile Icon - Separate Circle */}
                  <div className="relative">
                    <div
                      className="cursor-pointer transition-transform duration-300 transform hover:scale-110"
                      onClick={handleProfileClick}
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg border-2 border-white">
                        {isAuthenticated ? (
                          <img
                            className="w-full h-full rounded-full object-cover"
                            src="/images/design-mode/3Y1Z0Qj(2).png"
                            alt="آواتار کاربر"
                          />
                        ) : (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 sm:w-5 sm:h-5"
                          >
                            <path
                              d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                              fill="white"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full h-px bg-gray-200"></div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          id="mobileMenu"
          className={`fixed inset-y-0 right-0 z-[9999] w-80 backdrop-blur-xl bg-white/95 shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                  >
                    <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="white" />
                    <path
                      d="M19 15L19.5 17.5L22 18L19.5 18.5L19 21L18.5 18.5L16 18L18.5 17.5L19 15Z"
                      fill="white"
                      opacity="0.8"
                    />
                    <path d="M5 6L5.5 8L7 8.5L5.5 9L5 11L4.5 9L3 8.5L4.5 8L5 6Z" fill="white" opacity="0.6" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-800">منو</h2>
              </div>
              <button
                onClick={handleMobileMenuClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile Menu Items */}
            <div className="flex-1 overflow-y-auto p-4">
              <nav className="space-y-2">
                {/* Products */}
                <div className="border-b border-gray-100 pb-4 mb-4">
                  <Link
                    href="/products"
                    className="flex items-center justify-between p-3 text-gray-700 hover:text-[#3092BE] hover:bg-gray-50 rounded-lg transition-all duration-300 group"
                    onClick={handleMobileMenuClose}
                  >
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </div>
                      <span className="font-medium">محصولات</span>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-[#3092BE] transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                {/* Courses */}
                <div className="border-b border-gray-100 pb-4 mb-4">
                  <Link
                    href="/courses"
                    className="flex items-center justify-between p-3 text-gray-700 hover:text-[#3092BE] hover:bg-gray-50 rounded-lg transition-all duration-300 group"
                    onClick={handleMobileMenuClose}
                  >
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z" />
                        </svg>
                      </div>
                      <span className="font-medium">دوره‌ها</span>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-[#3092BE] transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                {/* Enterprise */}
                <div className="border-b border-gray-100 pb-4 mb-4">
                  <Link
                    href="/enterprise"
                    className="flex items-center justify-between p-3 text-gray-700 hover:text-[#3092BE] hover:bg-gray-50 rounded-lg transition-all duration-300 group"
                    onClick={handleMobileMenuClose}
                  >
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
                        </svg>
                      </div>
                      <span className="font-medium">فروش سازمانی</span>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-[#3092BE] transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                {/* Blog */}
                <div>
                  <Link
                    href="/blog"
                    className="flex items-center justify-between p-3 text-gray-700 hover:text-[#3092BE] hover:bg-gray-50 rounded-lg transition-all duration-300 group"
                    onClick={handleMobileMenuClose}
                  >
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                        </svg>
                      </div>
                      <span className="font-medium">بلاگ</span>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-[#3092BE] transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        </div>

        {/* Mobile Menu Backdrop */}
        <div
          id="mobileMenuBackdrop"
          className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[9998] transition-all duration-300 lg:hidden ${
            isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          onClick={handleMobileMenuClose}
        ></div>
      </header>

      <main className="container mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Stories Section */}
        <section className="mb-8 sm:mb-12">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">{"اتفاقات جدید امروز"}</h2>
          <div className="relative">
            {/* Left Arrow */}
            <button
              id="storiesLeftArrow"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 opacity-0 pointer-events-none"
              onClick={() => handleStoriesScroll("left")}
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Right Arrow */}
            <button
              id="storiesRightArrow"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 opacity-0 pointer-events-none"
              onClick={() => handleStoriesScroll("right")}
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div
              id="storiesContainer"
              className="flex space-x-3 sm:space-x-4 space-x-reverse overflow-x-auto pb-4 scrollbar-hide"
            >
              {/* Stories will be injected by JS */}
            </div>
          </div>
        </section>

        <section className="mb-16 sm:mb-20">
          <div className="w-full max-w-6xl mx-auto">
            <div className="flex flex-col gap-6">
              {/* اسلایدر بنر بالا */}
              <div className="w-full h-[200px] md:h-[250px] lg:h-[280px]">
                <IndependentSlider items={sliderData.topBanner} />
              </div>

              {/* بخش اصلی (اسلایدر وسط و بنرهای کناری) */}
              <div className="flex flex-col lg:flex-row items-center justify-center gap-4 md:gap-6 h-auto lg:h-[450px]">
                {/* بنر سمت راست (در موبایل زیر اسلایدر) */}
                <div className="w-full lg:w-1/4 h-full hidden lg:block">
                  <PromoCard item={sliderData.sideBannerRight} />
                </div>

                {/* اسلایدر اصلی وسط */}
                <div className="w-full lg:w-1/2 h-full">
                  <IndependentSlider items={sliderData.mainSlider} />
                </div>

                {/* بنر سمت چپ (در موبایل زیر اسلایدر) */}
                <div className="w-full lg:w-1/4 h-full hidden lg:block">
                  <PromoCard item={sliderData.sideBannerLeft} />
                </div>

                {/* نمایش بنرها در موبایل */}
                <div className="w-full grid grid-cols-2 gap-4 lg:hidden mt-4">
                  <div className="h-[250px]">
                    <PromoCard item={sliderData.sideBannerRight} />
                  </div>
                  <div className="h-[250px]">
                    <PromoCard item={sliderData.sideBannerLeft} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16 sm:mb-20">
          <div
            id="categoryContainer"
            className="flex items-center gap-3 p-4 overflow-x-auto scrollbar-hide max-w-6xl mx-auto sm:justify-center sm:gap-4 sm:flex-nowrap sm:overflow-x-visible"
          >
            {/* هوش مصنوعی */}
            <Link href="/products?category=ai">
              <div className="flex items-center justify-start w-40 h-14 p-2 pl-3 rounded-full shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105 bg-blue-600 flex-shrink-0 sm:w-64 sm:h-20 sm:p-3 sm:pl-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-opacity-20 overflow-hidden bg-[rgba(81,130,239,1)] sm:w-14 sm:h-14">
                  <img
                    src="/robot-ai-icon.png"
                    alt="آیکون هوش مصنوعی"
                    className="w-6 h-6 object-contain sm:w-9 sm:h-9"
                  />
                </div>
                <div className="text-right text-white mr-2 sm:mr-3">
                  <h3 className="text-sm font-bold sm:text-lg">هوش مصنوعی</h3>
                  <p className="text-xs opacity-90 hidden sm:block">اکانت های هوش مصنوعی</p>
                </div>
              </div>
            </Link>

            {/* سوشیال مدیا */}
            <Link href="/products?category=social-media">
              <div className="flex items-center justify-start w-40 h-14 p-2 pl-3 rounded-full shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105 flex-shrink-0 bg-[rgba(53,56,69,1)] sm:w-64 sm:h-20 sm:p-3 sm:pl-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-opacity-20 overflow-hidden bg-[rgba(53,56,69,1)] sm:w-14 sm:h-14">
                  <img
                    src="/bird-social-icon.png"
                    alt="آیکون سوشیال مدیا"
                    className="w-6 h-6 object-contain sm:w-9 sm:h-9"
                  />
                </div>
                <div className="text-right text-white mr-2 sm:mr-3">
                  <h3 className="text-sm font-bold sm:text-lg">سوشیال مدیا</h3>
                  <p className="text-xs opacity-90 hidden sm:block">اکانت های سوشیال مدیا</p>
                </div>
              </div>
            </Link>

            {/* موسیقی */}
            <Link href="/products?category=music">
              <div className="flex items-center justify-start w-40 h-14 p-2 pl-3 rounded-full shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105 flex-shrink-0 bg-[rgba(5,150,105,1)] sm:w-64 sm:h-20 sm:p-3 sm:pl-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-opacity-20 overflow-hidden bg-[rgba(55,171,135,1)] sm:w-14 sm:h-14">
                  <img src="/music-note-icon.png" alt="آیکون موسیقی" className="w-6 h-6 object-contain sm:w-9 sm:h-9" />
                </div>
                <div className="text-right text-white mr-2 sm:mr-3">
                  <h3 className="text-sm font-bold sm:text-lg">موسیقی</h3>
                  <p className="text-xs opacity-90 hidden sm:block">استریم موسیقی</p>
                </div>
              </div>
            </Link>

            {/* آموزشی */}
            <Link href="/products?category=educational">
              <div className="flex items-center justify-start w-40 h-14 p-2 pl-3 rounded-full shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105 bg-lime-600 flex-shrink-0 sm:w-64 sm:h-20 sm:p-3 sm:pl-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-opacity-20 overflow-hidden bg-[rgba(132,181,61,1)] sm:w-14 sm:h-14">
                  <img
                    src="/owl-education-icon.png"
                    alt="آیکون آموزشی"
                    className="w-6 h-6 object-contain sm:w-9 sm:h-9"
                  />
                </div>
                <div className="text-right text-white mr-2 sm:mr-3">
                  <h3 className="text-sm font-bold sm:text-lg">آموزشی</h3>
                  <p className="text-xs opacity-90 hidden sm:block">اکانت های آموزشی</p>
                </div>
              </div>
            </Link>

            {/* سیمکارت */}
            <Link href="/products?category=sim-card">
              <div className="flex items-center justify-start w-40 h-14 p-2 pl-3 rounded-full shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105 bg-pink-500 flex-shrink-0 sm:w-64 sm:h-20 sm:p-3 sm:pl-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-opacity-20 overflow-hidden bg-[rgba(255,173,219,1)] sm:w-14 sm:h-14">
                  <img src="/sim-card-icon.png" alt="آیکون سیمکارت" className="w-6 h-6 object-contain sm:w-9 sm:h-9" />
                </div>
                <div className="text-right text-white mr-2 sm:mr-3">
                  <h3 className="text-sm font-bold sm:text-lg">سیمکارت</h3>
                  <p className="text-xs opacity-90 hidden sm:block">خرید سیمکارت مجازی</p>
                </div>
              </div>
            </Link>
          </div>

          <div
            id="categoryScrollbar"
            className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-400 rounded-full opacity-0 transition-opacity duration-300"
            style={{ transform: "scaleX(0)", transformOrigin: "left" }}
          ></div>
        </section>

        {discountedProducts.length > 0 && (
          <section className="mb-16 sm:mb-20 relative">
            <div className="backdrop-blur-md bg-red-500/15 border border-red-300/30 rounded-3xl sm:rounded-[2rem] p-8 sm:p-10 shadow-xl">
              <h2 className="text-lg sm:text-xl font-bold text-red-700 mb-6 sm:mb-8">تخفیفات ویژه</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 px-2 py-4">
                {discountedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    title={product.name}
                    description={product.description}
                    price={product.discountedPrice}
                    originalPrice={product.originalPrice}
                    discountPercentage={product.discountPercentage}
                    image={product.image}
                    category={product.category}
                    href={`/products?category=${product.category}&highlight=${product.id}`}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {socialMediaProducts.length > 0 && (
          <section className="mb-16 sm:mb-20 relative" id="social-media-products">
            <div className="backdrop-blur-md bg-[#b52492]/15 border rounded-3xl sm:rounded-[2rem] p-6 sm:p-8 shadow-xl overflow-hidden border-[rgba(255,149,0,0.3)]">
              <h2 className="text-lg sm:text-xl font-bold text-pink-800 mb-6 sm:mb-8">پرفروش‌ترین محصولات سوشیال مدیا</h2>
              <div className="relative px-2 py-2">
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  spaceBetween={8}
                  slidesPerView={1.1}
                  navigation={{
                    nextEl: ".swiper-button-next-social",
                    prevEl: ".swiper-button-prev-social",
                  }}
                  pagination={{
                    clickable: true,
                    el: ".swiper-pagination-social",
                  }}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }}
                  breakpoints={{
                    640: {
                      slidesPerView: 1.8,
                      spaceBetween: 10,
                    },
                    1024: {
                      slidesPerView: 3.2,
                      spaceBetween: 12,
                    },
                  }}
                  dir="rtl"
                  className="!pb-12"
                >
                  {socialMediaProducts.map((product) => (
                    <SwiperSlide key={product.id} className="!h-auto">
                      <ProductCard
                        id={product.id}
                        title={product.name}
                        description={product.description}
                        price={product.price}
                        originalPrice={product.originalPrice}
                        discountPercentage={product.discountPercentage}
                        image={product.image}
                        category={product.category}
                        href={`/products?category=${product.category}&highlight=${product.id}`}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>

                <div className="swiper-button-next-social absolute top-1/2 -right-2 transform -translate-y-1/2 w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-pink-700 transition-colors z-10 text-sm">
                  ←
                </div>
                <div className="swiper-button-prev-social absolute top-1/2 -left-2 transform -translate-y-1/2 w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-pink-700 transition-colors z-10 text-sm">
                  →
                </div>

                <div className="swiper-pagination-social !bottom-0 !relative mt-4 text-center"></div>
              </div>
            </div>
          </section>
        )}

        {educationalProducts.length > 0 && (
          <section className="mb-16 sm:mb-20 relative" id="educational-products">
            <div className="backdrop-blur-md bg-[#5ea500]/15 border border-green-400/30 rounded-3xl sm:rounded-[2rem] p-6 sm:p-8 shadow-xl overflow-hidden">
              <h2 className="text-lg sm:text-xl font-bold text-green-800 mb-6 sm:mb-8">پرفروش‌ترین محصولات آموزشی</h2>
              <div className="relative px-4 py-2">
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  spaceBetween={16}
                  slidesPerView={1.1}
                  navigation={{
                    nextEl: ".swiper-button-next-edu",
                    prevEl: ".swiper-button-prev-edu",
                  }}
                  pagination={{
                    clickable: true,
                    el: ".swiper-pagination-edu",
                  }}
                  autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }}
                  breakpoints={{
                    640: {
                      slidesPerView: 1.8,
                      spaceBetween: 20,
                    },
                    1024: {
                      slidesPerView: 3.2,
                      spaceBetween: 24,
                    },
                  }}
                  dir="rtl"
                  className="!pb-12"
                >
                  {educationalProducts.map((product) => (
                    <SwiperSlide key={product.id} className="!h-auto">
                      <div className="p-2">
                        <ProductCard
                          id={product.id}
                          title={product.name}
                          description={product.description}
                          price={product.price}
                          originalPrice={product.originalPrice}
                          discountPercentage={product.discountPercentage}
                          image={product.image}
                          category={product.category}
                          href={`/products?category=${product.category}&highlight=${product.id}`}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                <div className="swiper-button-next-edu absolute top-1/2 -right-2 transform -translate-y-1/2 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-700 transition-colors z-10 text-sm">
                  ←
                </div>
                <div className="swiper-button-prev-edu absolute top-1/2 -left-2 transform -translate-y-1/2 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-700 transition-colors z-10 text-sm">
                  →
                </div>

                <div className="swiper-pagination-edu !bottom-0 !relative mt-4 text-center"></div>
              </div>
            </div>
          </section>
        )}

        {bestsellingCourses.length > 0 && (
          <section className="mb-16 sm:mb-20">
            <div className="backdrop-blur-md bg-blue-500/15 border border-blue-200/30 rounded-3xl sm:rounded-[2rem] p-8 sm:p-10 shadow-xl">
              <h2 className="text-lg sm:text-xl font-bold text-blue-800 mb-6 sm:mb-8">پرفروش‌ترین دوره‌ها</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-2 py-4">
                {bestsellingCourses.map((course) => (
                  <ProductCard
                    key={course.id}
                    id={course.id}
                    title={course.title}
                    description={course.description}
                    price={course.price}
                    originalPrice={course.originalPrice > course.price ? course.originalPrice : undefined}
                    discountPercentage={
                      course.originalPrice > course.price
                        ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
                        : undefined
                    }
                    rating={course.rating}
                    reviewCount={course.reviewCount}
                    image={course.image}
                    category={course.category}
                    href={`/products?category=${course.category}&highlight=${course.id}`}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SharifGPT Magazine section with top 3 articles */}
        <section className="mb-16 sm:mb-20">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-3">مجله شریف جی پی تی</h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto">
              بهترین پرامپت ها و آموزش ها و اخبار جدید رو تو مجله شریف پیدا کن!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 text-right">
            {/* Article 1 - Photo Design Prompts */}
            <Link
              href="/blog/1"
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative">
                <img
                  src="/photo-editing-design-interface-colorful-creative-t.jpg"
                  alt="پرامپت طراحی عکس"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <div className="bg-gradient-to-r from-green-400 to-green-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <span>#</span>
                    <span>1</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">
                  پرامپت طراحی عکس
                </h3>
                <p className="text-gray-600 text-sm mb-4">بیشترین بازدید در هفته اخیر</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <span className="text-gray-700 font-medium">4.9</span>
                  </div>
                  <span className="text-gray-500">2.1K بازدید</span>
                </div>
              </div>
            </Link>

            {/* Article 2 - Advanced ChatGPT Tutorial */}
            <Link
              href="/blog/2"
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative">
                <img
                  src="/chatgpt-interface-ai-chat-conversation-modern-blue.jpg"
                  alt="پیشرفته ChatGPT آموزش"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-cyan-400 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <span>#</span>
                    <span>2</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                  پیشرفته ChatGPT آموزش
                </h3>
                <p className="text-gray-600 text-sm mb-4">تکنیک‌های حرفه‌ای پرامپت نویسی</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <span className="text-gray-700 font-medium">4.8</span>
                  </div>
                  <span className="text-gray-500">1.8K بازدید</span>
                </div>
              </div>
            </Link>

            {/* Article 3 - AI in Business */}
            <Link
              href="/blog/3"
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative">
                <img
                  src="/business-analytics-dashboard-charts-graphs-data-vi.jpg"
                  alt="هوش مصنوعی در کسب و کار"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <span>#</span>
                    <span>3</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                  هوش مصنوعی در کسب و کار
                </h3>
                <p className="text-gray-600 text-sm mb-4">راهکارهای عملی برای شرکت‌ها</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <span className="text-gray-700 font-medium">4.7</span>
                  </div>
                  <span className="text-gray-500">1.5K بازدید</span>
                </div>
              </div>
            </Link>
          </div>
        </section>

        <section className="mb-16 sm:mb-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800">ما رو دنبال کنید</h2>
          <p className="text-gray-500 mt-2 mb-8 sm:mb-10 max-w-lg mx-auto text-sm sm:text-base">
            برای تخفیفات ویژه و آخرین اخبار شریف جی پی تی رو در سوشیال مدیا دنبال کنید
          </p>
          <div className="inline-block p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-sky-100 via-white to-blue-100">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Instagram */}
              <a
                href="#"
                className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center space-y-3 sm:space-y-4 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 w-full sm:w-56 group hover:bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400"
              >
                <svg
                  className="w-10 h-10 sm:w-12 sm:h-12 text-gray-700 group-hover:text-white transition-colors duration-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <span className="font-semibold text-gray-700 group-hover:text-white transition-colors duration-300 text-sm sm:text-base">
                  {"SharifGPT Instagram"}
                </span>
              </a>
              {/* Twitter (X) */}
              <a
                href="#"
                className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center space-y-3 sm:space-y-4 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 w-full sm:w-56 group hover:bg-black"
              >
                <svg
                  className="w-10 h-10 sm:w-12 sm:h-12 text-black group-hover:text-white transition-colors duration-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span className="font-semibold text-gray-700 group-hover:text-white transition-colors duration-300 text-sm sm:text-base">
                  SharifGPT X
                </span>
              </a>
              {/* YouTube */}
              <a
                href="#"
                className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center space-y-3 sm:space-y-4 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 w-full sm:w-56 group hover:bg-red-600"
              >
                <svg
                  className="w-10 h-10 sm:w-12 sm:h-12 text-red-600 group-hover:text-white transition-colors duration-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                <span className="font-semibold text-gray-700 group-hover:text-white transition-colors duration-300 text-sm sm:text-base">
                  {"SharifGPT Youtube"}
                </span>
              </a>
              {/* Telegram */}
              <a
                href="#"
                className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center space-y-3 sm:space-y-4 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 w-full sm:w-56 group hover:bg-blue-500"
              >
                <svg
                  className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500 group-hover:text-white transition-colors duration-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.12-.05-.17-.06-.05-.14-.03-.2-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.37.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24-.02.37z" />
                </svg>
                <span className="font-semibold text-gray-700 group-hover:text-white transition-colors duration-300 text-sm sm:text-base">
                  SharifGPT Telegram
                </span>
              </a>
            </div>
          </div>

          <div className="mt-16 sm:mt-20">
            {/* About Us Title */}
            <div className="text-right mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black">درباره ما</h2>
            </div>

            {/* Feature Boxes */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
              {/* High Speed */}
              <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <svg
                      className="w-8 h-8 sm:w-10 sm:h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-bold text-lg text-gray-800">سرعت بالا</h3>
                  <p className="text-sm text-gray-600">پردازش فوق‌العاده سریع</p>
                </div>
              </div>

              {/* High Security */}
              <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <svg
                      className="w-8 h-8 sm:w-10 sm:h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-bold text-lg text-gray-800">امنیت بالا</h3>
                  <p className="text-sm text-gray-600">حفاظت کامل از داده‌ها</p>
                </div>
              </div>

              {/* 24/7 Support */}
              <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <svg
                      className="w-8 h-8 sm:w-10 sm:h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-bold text-lg text-gray-800">پشتیبانی ۲۴ ساعته</h3>
                  <p className="text-sm text-gray-600">همیشه در کنار شما</p>
                </div>
              </div>

              {/* Complete Security */}
              <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <svg
                      className="w-8 h-8 sm:w-10 sm:h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-bold text-lg text-gray-800">امنیت کامل</h3>
                  <p className="text-sm text-gray-600">محافظت تمام‌جانبه</p>
                </div>
              </div>
            </div>

            {/* Description and Button */}
            <div className="text-center">
              <p className="text-gray-700 text-lg sm:text-xl mb-6 sm:mb-8">
                برای آشنایی بیشتر با شریف جی پی تی روی دکمه زیر بزنید
              </p>
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-8 py-4 sm:px-12 sm:py-5 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold rounded-2xl sm:rounded-3xl transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 group relative overflow-hidden text-base sm:text-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative z-10 flex items-center gap-3">
                  <svg
                    className="w-6 h-6 sm:w-7 sm:h-7 group-hover:rotate-12 transition-transform duration-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  اطلاعات بیشتر
                </span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <Footer />

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </div>
  )
}
